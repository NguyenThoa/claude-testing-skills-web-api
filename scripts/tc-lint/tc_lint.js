#!/usr/bin/env node
/**
 * Kiểm bằng máy những tiêu chí Quality Gate của bộ test case mà agent dễ tự khai sai.
 * Không chấm được chất lượng nội dung: đạt ở đây chỉ là điều kiện cần.
 *
 *   node scripts/tc-lint/tc_lint.js <file TC hoặc index>... [--req <file requirements>]...
 *
 * Mã thoát 1 khi còn LỖI. CẢNH BÁO không làm fail, nhưng phải nêu trong báo cáo.
 */
const fs = require('fs');
const path = require('path');

const COLUMNS = {
  id: ['tc id', 'tc_id'],
  req: ['req id', 'req_id'],
  risk: ['risk level'],
  priority: ['priority'],
  summary: ['test summary', 'test scenario', 'mục đích kiểm tra'],
  action: ['action', 'test steps', 'các bước thực hiện'],
  data: ['test data', 'dữ liệu test'],
  expected: ['expected result', 'kết quả mong đợi'],
  tags: ['tags'],
};
const REQUIRED = ['id', 'req', 'priority', 'summary', 'action', 'expected'];
const SEPARATOR = /^\|(\s*:?-+:?\s*\|)+$/;
const TC_ID = /^[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)*_TC_\d{3,}$/;
const REQ_ID = /REQ-[A-Z0-9]+(?:-[A-Z0-9]+)*-\d+/g;
const PRIORITY = /^(P[123]|Critical|High|Medium|Low)$/;
const RISK = /^(High|Medium|Low)$/;
const VAGUE_EXPECTED = /hoạt động (đúng|bình thường|tốt)|hiển thị đúng|xử lý đúng|như mong đợi|\bOK\b/i;
const VAGUE_DATA = /^(dữ liệu |giá trị |thông tin |email |mật khẩu )?(hợp lệ|đúng|bất kỳ)$/i;
const IMAGE = /(?:\]\(|`)((?!https?:)[^`)\s]+\.(?:png|jpe?g|webp|webm|mp4))(?:\)|`)/gi;

function splitRow(row) {
  return row.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map(cell => cell.trim());
}

function mapHeader(row) {
  const cells = splitRow(row).map(cell => cell.toLowerCase());
  const columns = {};
  for (const [field, names] of Object.entries(COLUMNS)) {
    const index = cells.findIndex(cell => names.includes(cell));
    if (index !== -1) columns[field] = index;
  }
  return REQUIRED.every(field => columns[field] !== undefined) ? columns : null;
}

/** Bỏ phần ghi chú `⚠️ …` ở cuối ô để không bắt nhầm chữ trong lời chú thích. */
function withoutNotes(cell) {
  return cell.split(/<br\s*\/?>/i).filter(line => !line.trim().startsWith('⚠️')).join('<br>');
}

function stepNumbers(cell) {
  return cell.split(/<br\s*\/?>/i)
    .map(line => line.trim().match(/^(\d+)[.)]\s/))
    .filter(Boolean)
    .map(match => Number(match[1]));
}

function checkRow(row, columns, report) {
  const cell = field => (columns[field] === undefined ? '' : (row[columns[field]] || ''));
  const id = cell('id').replace(/\*\*/g, '');
  const tags = cell('tags');
  const expected = cell('expected');

  if (!TC_ID.test(id)) report.error(`TC ID sai định dạng <HỆ_THỐNG>_<MODULE>_TC_<nnn>: "${id}"`);
  if (/@Deprecated/i.test(tags)) return { id, deprecated: true, reqs: [], tags, priority: cell('priority') };

  if (!PRIORITY.test(cell('priority'))) report.error(`Priority không hợp lệ: "${cell('priority')}"`);
  if (columns.risk !== undefined && !RISK.test(cell('risk'))) report.error(`Risk Level không hợp lệ: "${cell('risk')}"`);
  if (!cell('summary')) report.error('Thiếu nội dung kiểm tra');
  if (!cell('action')) report.error('Thiếu các bước thực hiện');
  if (!withoutNotes(expected).trim()) report.error('Thiếu kết quả mong đợi');
  if (VAGUE_EXPECTED.test(withoutNotes(expected))) report.error('Kết quả mong đợi mơ hồ, không kiểm chứng được');
  if (/\bhoặc\b/i.test(withoutNotes(expected))) report.warn('Kết quả mong đợi có "hoặc": kiểm lại, chấm PASS/FAIL phải rõ một kết quả');
  if (VAGUE_DATA.test(cell('data').replace(/^\d+[.)]\s*/, ''))) report.error(`Test Data mơ hồ: "${cell('data')}"`);

  const reqs = cell('req').match(REQ_ID) || [];
  if (reqs.length === 0 && !cell('req').includes('⚠️')) report.error(`REQ ID không hợp lệ: "${cell('req')}"`);

  // Bảng API có một khối kết quả cho cả request nên chỉ đối chiếu bước với bảng manual
  if (cell('summary') && !Object.prototype.hasOwnProperty.call(columns, 'singleBlock')) {
    const actions = stepNumbers(cell('action'));
    const orphan = stepNumbers(withoutNotes(expected)).find(number => !actions.includes(number));
    if (orphan !== undefined) report.error(`Kết quả mong đợi có bước ${orphan} nhưng các bước thực hiện không có`);
  }

  if (/@KnownBug(?!:\S)/.test(tags)) report.error('@KnownBug thiếu mã bug');
  if (/⚠️\s*Lệch với (app|API)/i.test(expected) && !tags.includes('@AppDeviation')) {
    report.error('Có dòng "⚠️ Lệch với app/API" nhưng thiếu tag @AppDeviation');
  }
  if (tags.includes('@AppDeviation') && !/⚠️\s*Lệch với (app|API)/i.test(expected)) {
    report.error('Có tag @AppDeviation nhưng thiếu dòng "⚠️ Lệch với app/API"');
  }
  if (/⚠️\s*chưa có evidence/i.test(expected) && !tags.includes('@NeedsVerify')) {
    report.error('Có "⚠️ chưa có evidence" nhưng thiếu tag @NeedsVerify');
  }
  return { id, deprecated: false, reqs, tags, priority: cell('priority') };
}

function checkFile(filePath, result) {
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  let columns = null;
  lines.forEach((line, index) => {
    const report = {
      error: message => result.errors.push(`${filePath}:${index + 1} ${message}`),
      warn: message => result.warnings.push(`${filePath}:${index + 1} ${message}`),
    };
    const trimmed = line.trim();
    if (SEPARATOR.test(trimmed)) {
      columns = index > 0 ? mapHeader(lines[index - 1]) : null;
      if (columns && splitRow(lines[index - 1]).some(cell => cell.toLowerCase() === 'mục đích kiểm tra')) {
        columns.singleBlock = true;
      }
    } else if (!trimmed.startsWith('|')) {
      columns = null;
    } else if (columns && !mapHeader(trimmed)) {
      const row = checkRow(splitRow(trimmed), columns, report);
      if (result.seen.has(row.id)) report.error(`Trùng TC ID ${row.id} (đã có ở ${result.seen.get(row.id)})`);
      result.seen.set(row.id, `${filePath}:${index + 1}`);
      result.rows.push(row);
    }

    for (const match of line.matchAll(IMAGE)) {
      if (!fs.existsSync(path.resolve(path.dirname(filePath), match[1]))) report.error(`Không thấy file evidence: ${match[1]}`);
    }
  });
}

function lint(files, reqFiles = []) {
  const result = { errors: [], warnings: [], rows: [], seen: new Map() };
  for (const file of files) checkFile(file, result);
  if (result.rows.length === 0) result.errors.push('Không tìm thấy dòng test case nào trong các file đã đưa');

  const active = result.rows.filter(row => !row.deprecated);
  if (reqFiles.length > 0) {
    const known = new Set(reqFiles.flatMap(file => fs.readFileSync(file, 'utf8').match(REQ_ID) || []));
    const covered = new Set(active.flatMap(row => row.reqs));
    for (const row of active) {
      for (const req of row.reqs) {
        if (!known.has(req)) result.errors.push(`${row.id} trỏ tới ${req} nhưng tài liệu requirements không có mã này`);
      }
    }
    for (const req of [...known].filter(id => !covered.has(id)).sort()) {
      result.warnings.push(`${req} chưa có TC: bổ sung, hoặc ghi lý do ở Bảng Đối Soát Coverage`);
    }
  }
  return result;
}

function main() {
  const files = [];
  const reqFiles = [];
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--req') reqFiles.push(args[++i]);
    else files.push(args[i]);
  }
  if (files.length === 0) {
    console.error('Cách dùng: node scripts/tc-lint/tc_lint.js <file TC hoặc index>... [--req <file requirements>]...');
    process.exit(2);
  }
  const missing = [...files, ...reqFiles].filter(file => !file || !fs.existsSync(file));
  if (missing.length > 0) {
    console.error(`Không thấy file: ${missing.join(', ')}`);
    process.exit(2);
  }

  const { errors, warnings, rows } = lint(files, reqFiles);
  errors.forEach(line => console.log(`LỖI ${line}`));
  warnings.forEach(line => console.log(`CẢNH BÁO ${line}`));
  const deprecated = rows.filter(row => row.deprecated).length;
  console.log(`Tổng kết: ${rows.length} TC (${deprecated} @Deprecated) · ${errors.length} lỗi · ${warnings.length} cảnh báo`);
  process.exit(errors.length > 0 ? 1 : 0);
}

if (require.main === module) main();

module.exports = { lint };
