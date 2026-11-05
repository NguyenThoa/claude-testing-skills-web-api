/**
 * Parser đọc và chuẩn hóa test cases từ file markdown, tìm cột theo tên ở dòng header:
 * - Format v3:   | TC ID | REQ ID | Priority | Test Summary | Pre-condition | Action | Test Data | Expected Result |
 * - 13 cột:      | TC ID | REQ ID | ... | Test Scenario | Pre-Condition | Test Steps | Test Data | Expected Result | Priority | ... | Tags |
 * - Format API:  | TC ID | REQ ID | Risk Level | Priority | Mục đích kiểm tra | Mô tả | Tiền điều kiện | Dữ liệu test | Các bước thực hiện | Kết quả mong đợi | Tags |
 *   Kết quả mong đợi của API áp cho cả request, nên TC API được đẩy thành 1 Manual Step.
 * - Dạng cũ:     | TC_ID | Req_ID | Priority | Summary | Precondition | Action | Test Data | Expected |
 */
const fs = require('fs');

const COLUMN_ALIASES = {
  id: ['tc id', 'tc_id'],
  reqId: ['req id', 'req_id'],
  priority: ['priority'],
  summary: ['test summary', 'test scenario', 'summary', 'mục đích kiểm tra'],
  precondition: ['pre-condition', 'precondition', 'tiền điều kiện'],
  action: ['test steps', 'action', 'các bước thực hiện'],
  data: ['test data', 'dữ liệu test'],
  expected: ['expected result', 'expected', 'kết quả mong đợi'],
  tags: ['tags']
};
const REQUIRED_COLUMNS = ['id', 'reqId', 'priority', 'summary', 'action', 'expected'];
const LEGACY_COLUMNS = { id: 0, reqId: 1, priority: 2, summary: 3, precondition: 4, action: 5, data: 6, expected: 7 };
const SEPARATOR_ROW = /^\|(\s*:?-+:?\s*\|)+$/;
const SHARED_PRECONDITION_HEADING = /^##\s+Pre-condition chung\b/i;
const SHARED_PRECONDITION_REF = /^Pre-condition chung(?:\s*[,;:+]\s*|\s+|$)/i;
const TC_ID = /^[A-Za-z0-9_-]+_TC_\d+$/;
const PRIORITY_GROUPS = {
  P1: 'P1', P2: 'P2', P3: 'P3',
  CRITICAL: 'P1', HIGH: 'P2', MEDIUM: 'P2', LOW: 'P3'
};

function splitRow(row) {
  return row.replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map(cell => cell.trim());
}

/** Trả về vị trí từng cột nếu đây là bảng test case, null nếu là bảng khác trong cùng file */
function mapColumns(headerRow) {
  const cells = splitRow(headerRow).map(cell => cell.toLowerCase());
  const columns = {};
  for (const [field, aliases] of Object.entries(COLUMN_ALIASES)) {
    const index = cells.findIndex(cell => aliases.includes(cell));
    if (index !== -1) columns[field] = index;
  }
  columns.singleStep = cells.includes('mục đích kiểm tra');
  return REQUIRED_COLUMNS.every(field => columns[field] !== undefined) ? columns : null;
}

function cleanMarkdown(str) {
  if (!str || str === '(không có)') return '';
  return str
    .split(/<br\s*\/?>/gi).join('\n')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .trim();
}

function splitNumberedSteps(text) {
  if (!text || text === '(không có)') return [];
  const cleanLines = text.split(/<br\s*\/?>/gi).map(s => s.trim()).filter(Boolean);

  const items = [];
  let currentNum = 0;
  let currentContent = [];

  for (const line of cleanLines) {
    const match = line.match(/^(\d+)[\.\)]\s*(.*)/);
    if (match) {
      if (currentNum > 0) {
        items.push({ num: currentNum, text: currentContent.join('\n').trim() });
      }
      currentNum = parseInt(match[1], 10);
      currentContent = [match[2]];
    } else {
      currentContent.push(line);
    }
  }
  if (currentNum > 0) {
    items.push({ num: currentNum, text: currentContent.join('\n').trim() });
  }

  if (items.length === 0) {
    return cleanLines.map((c, i) => ({ num: i + 1, text: c, unnumbered: true }));
  }

  return items;
}

/** Trả về Map số bước -> nội dung. Ô không đánh số là một khối chung, gắn vào bước cuối của Action. */
function indexByStep(items, actions) {
  if (items.length > 0 && items[0].unnumbered) {
    const last = actions[actions.length - 1]?.num ?? 1;
    return new Map([[last, items.map(item => item.text).join('\n')]]);
  }
  return new Map(items.map(item => [item.num, item.text]));
}

/** Đọc khối "## Pre-condition chung" đầu file, không có thì trả chuỗi rỗng. */
function readSharedPrecondition(lines) {
  const start = lines.findIndex(line => SHARED_PRECONDITION_HEADING.test(line.trim()));
  if (start === -1) return '';
  const block = [];
  for (const line of lines.slice(start + 1)) {
    const trimmed = line.trim();
    if (/^(#|\||---)/.test(trimmed)) break;
    if (trimmed) block.push(trimmed);
  }
  return cleanMarkdown(block.join('\n'));
}

/** Thay chữ "Pre-condition chung" bằng nội dung thật, giữ phần khác biệt của từng TC. */
function resolvePrecondition(raw, shared, id) {
  const text = cleanMarkdown(raw);
  const match = text.match(SHARED_PRECONDITION_REF);
  if (!match) return text;
  if (!shared) {
    throw new Error(`${id}: ghi "Pre-condition chung" nhưng file không có nội dung ở khối "## Pre-condition chung"`);
  }
  const delta = text.slice(match[0].length).trim();
  return delta ? `${shared}\n${delta}` : shared;
}

function parseTestCaseMarkdown(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Không tìm thấy file: ${filePath}`);
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const sharedPrecondition = readSharedPrecondition(lines);

  let currentSection = 'Giao diện & Chức năng chung';
  const testCases = [];
  let columns = LEGACY_COLUMNS;
  let previousRow = '';
  const deprecatedIds = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ') && !trimmed.startsWith('## Pre-condition')) {
      currentSection = trimmed.replace(/^##\s+/, '').replace(/\s+\(.*?\)/, '').trim();
      continue;
    }

    if (SEPARATOR_ROW.test(trimmed)) {
      columns = mapColumns(previousRow);
      continue;
    }
    previousRow = trimmed;

    if (columns && trimmed.startsWith('|')) {
      const parts = splitRow(trimmed);
      const id = (parts[columns.id] || '').replace(/\*\*/g, '');
      if (TC_ID.test(id)) {
        const isDeprecated = /@Deprecated/i.test(parts[columns.tags] || '')
          || /^(\*\*)?🗑️\s*Deprecated/i.test(parts[columns.summary] || '');
        if (isDeprecated) {
          deprecatedIds.push(id);
          continue;
        }

        const reqId = parts[columns.reqId] || '';
        const rawPriority = parts[columns.priority] || '';
        const summary = parts[columns.summary] || '';
        const precondition = resolvePrecondition(parts[columns.precondition] || '', sharedPrecondition, id);
        const rawAction = parts[columns.action] || '';
        const rawData = parts[columns.data] || '';
        const rawExpected = parts[columns.expected] || '';

        const priority = PRIORITY_GROUPS[rawPriority.toUpperCase()];
        if (!priority) {
          throw new Error(`${id}: Priority "${rawPriority}" không hợp lệ (cần P1/P2/P3 hoặc Critical/High/Medium/Low)`);
        }

        if (columns.singleStep) {
          testCases.push({
            id,
            reqId,
            priority,
            summary: cleanMarkdown(summary),
            precondition,
            section: currentSection,
            steps: [{
              stepNumber: 1,
              action: cleanMarkdown(rawAction),
              data: cleanMarkdown(rawData),
              expected: cleanMarkdown(rawExpected)
            }]
          });
          continue;
        }

        // Ghép theo số bước ghi trong file: bước không có Expected thì để trống, không mượn của bước khác
        const actions = splitNumberedSteps(rawAction);
        const datas = indexByStep(splitNumberedSteps(rawData), actions);
        const expecteds = indexByStep(splitNumberedSteps(rawExpected), actions);
        for (const [label, items] of [['Test Data', datas], ['Expected Result', expecteds]]) {
          const orphan = [...items.keys()].find(num => !actions.some(action => action.num === num));
          if (orphan !== undefined) {
            throw new Error(`${id}: ${label} có bước ${orphan} nhưng Action không có bước này`);
          }
        }

        const steps = actions.map(action => ({
          stepNumber: action.num,
          action: cleanMarkdown(action.text),
          data: cleanMarkdown(datas.get(action.num) || ''),
          expected: cleanMarkdown(expecteds.get(action.num) || '')
        }));

        testCases.push({
          id,
          reqId,
          priority,
          summary: cleanMarkdown(summary),
          precondition,
          section: currentSection,
          steps
        });
      }
    }
  }

  if (deprecatedIds.length > 0) {
    console.log(`ℹ️ Bỏ qua ${deprecatedIds.length} test case gắn @Deprecated.`);
  }
  testCases.deprecatedIds = deprecatedIds;
  return testCases;
}

module.exports = {
  cleanMarkdown,
  splitNumberedSteps,
  parseTestCaseMarkdown
};
