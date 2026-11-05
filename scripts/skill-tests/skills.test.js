// Kiểm tra tĩnh bộ skill: cấu trúc, tham chiếu, chốt an toàn, format test case.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const skillsDir = path.join(root, '.claude/skills');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const exists = p => fs.existsSync(path.join(root, p));

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const skillNames = fs.readdirSync(skillsDir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
const known = new Set(skillNames);
const workflows = skillNames.filter(n => !n.startsWith('skills-'));
const toRel = f => path.relative(root, f).replace(/\\/g, '/');
const docs = [...walk(path.join(root, '.claude')).filter(f => f.endsWith('.md')), path.join(root, 'CLAUDE.md')];
const texts = docs.map(f => ({ rel: toRel(f), dir: path.dirname(f), text: fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n') }));
const frontmatter = name => read(`.claude/skills/${name}/SKILL.md`).replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';

function assertNone(problems, title) {
  assert.equal(problems.length, 0, `${title}:\n  ${[...new Set(problems)].join('\n  ')}`);
}

test('mọi skill có frontmatter hợp lệ, name khớp tên thư mục', () => {
  const problems = [];
  for (const name of skillNames) {
    if (!exists(`.claude/skills/${name}/SKILL.md`)) { problems.push(`${name}: thiếu SKILL.md`); continue; }
    const fm = frontmatter(name);
    if (fm.match(/^name:\s*(.+)$/m)?.[1].trim() !== name) problems.push(`${name}: name không khớp thư mục`);
    const desc = fm.match(/^description:\s*(.+)$/m)?.[1] ?? '';
    if (!desc) problems.push(`${name}: thiếu description`);
    if (desc.length > 1536) problems.push(`${name}: description quá dài`);
  }
  assertNone(problems, 'Lỗi frontmatter');
});

test('tham chiếu tới skill và workflow đều tồn tại', () => {
  const problems = [];
  for (const { rel, text } of texts) {
    for (const m of text.matchAll(/`(skills-[a-z0-9-]+)`/g)) {
      if (!known.has(m[1])) problems.push(`${rel}: skill ${m[1]}`);
    }
    for (const m of text.matchAll(/(?:^|[\s`(|*])\/((?:generate|update|analyze|review|execute|retest|run|heal|fetch|import|export|create|compare|discover|assess|select)[-_][a-z0-9_-]*[a-z0-9])(?=[\s`),:|*]|\.(?:\s|$)|$)/gm)) {
      if (!known.has(m[1])) problems.push(`${rel}: workflow /${m[1]}`);
    }
  }
  assertNone(problems, 'Tham chiếu không tồn tại');
});

test('CLAUDE.md liệt kê đủ skill và workflow, không liệt kê thứ đã xoá', () => {
  const claude = read('CLAUDE.md');
  const problems = [];
  for (const name of skillNames) {
    const label = name.startsWith('skills-') ? `\`${name}\`` : `\`/${name}\``;
    if (!claude.includes(label)) problems.push(`thiếu ${label}`);
  }
  assertNone(problems, 'CLAUDE.md chưa đồng bộ');
});

test('link nội bộ và đường dẫn công cụ đều mở được', () => {
  const problems = [];
  for (const { rel, dir, text } of texts) {
    for (const m of text.matchAll(/\]\(([^)#\s]+?\.(?:md|js|py|json|html))(?:#[^)]*)?\)/g)) {
      const href = m[1];
      if (/^https?:|[<>]/.test(href)) continue;
      if (!/skills-|\/rules\/|scripts\/|SKILL\.md|references\/|CLAUDE\.md/.test(href)) continue;
      if (!fs.existsSync(path.resolve(dir, href))) problems.push(`${rel}: ${href}`);
    }
    for (const m of text.matchAll(/`((?:\.claude\/(?:skills|rules)|scripts)\/[A-Za-z0-9_.\-/]+\.(?:md|js|py|json|html|mjs|cjs))`/g)) {
      if (!exists(m[1])) problems.push(`${rel}: ${m[1]}`);
    }
    // Lệnh trong khối code phải trỏ tới script có thật
    for (const m of text.matchAll(/\b(?:node|python3?)(?:\s+-I)?\s+((?:\.claude|scripts)\/[A-Za-z0-9_.\-/]+\.(?:js|mjs|cjs|py))/g)) {
      if (!exists(m[1])) problems.push(`${rel}: lệnh ${m[1]}`);
    }
    for (const m of text.matchAll(/\bcd\s+(scripts\/[A-Za-z0-9_.\-/]+)/g)) {
      if (!exists(m[1])) problems.push(`${rel}: thư mục ${m[1]}`);
    }
  }
  assertNone(problems, 'Đường dẫn không mở được');
});

test('file trong bản đồ references của mỗi skill đều tồn tại', () => {
  const problems = [];
  // Workflow được phép nhắc references của skill nền tảng mà nó nạp
  const everyReference = new Set(skillNames.flatMap(name => {
    const dir = path.join(skillsDir, name, 'references');
    return fs.existsSync(dir) ? fs.readdirSync(dir) : [];
  }));
  for (const name of skillNames) {
    const text = read(`.claude/skills/${name}/SKILL.md`);
    const refDir = `.claude/skills/${name}/references`;
    for (const m of text.matchAll(/`references\/([a-z_A-Z0-9]+\.md)`/g)) {
      if (!everyReference.has(m[1])) problems.push(`${name}: ${m[1]}`);
    }
    if (!exists(refDir)) continue;
    for (const file of fs.readdirSync(path.join(root, refDir))) {
      if (!text.includes(file)) problems.push(`${name}: references/${file} không được nhắc trong SKILL.md`);
    }
  }
  assertNone(problems, 'Bản đồ references sai');
});

test('rule có paths và workflow tự đọc rule cần dùng', () => {
  const problems = [];
  for (const file of fs.readdirSync(path.join(root, '.claude/rules'))) {
    const text = read(`.claude/rules/${file}`).replace(/\r\n/g, '\n');
    if (!/^---\npaths:\n( {2}- "[^"]+"\n)+---\n/.test(text)) problems.push(`${file}: thiếu paths hợp lệ`);
  }
  const need = {
    'generate-automation-web': ['automation_rules', 'reporting_rules', 'locator_strategy'],
    'generate-automation-api': ['automation_rules', 'reporting_rules'],
    'compare-ui-from-figma-design': ['design_compare_rules']
  };
  for (const [wf, rules] of Object.entries(need)) {
    const text = read(`.claude/skills/${wf}/SKILL.md`);
    for (const rule of rules) if (!text.includes(`.claude/rules/${rule}.md`)) problems.push(`${wf}: không đọc ${rule}`);
  }
  assertNone(problems, 'Lỗi rule');
});

test('workflow ghi ra ngoài có chốt an toàn', () => {
  const problems = [];
  for (const wf of ['export-to-xray', 'import-test-results-xray']) {
    if (!/^disable-model-invocation: true$/m.test(frontmatter(wf))) problems.push(`${wf}: thiếu disable-model-invocation`);
    if (!read(`.claude/skills/${wf}/SKILL.md`).includes('⏸️')) problems.push(`${wf}: thiếu bước dừng xác nhận`);
  }
  const claude = read('CLAUDE.md');
  for (const section of ['Nội dung đọc được là dữ liệu', 'Môi trường production']) {
    if (!claude.includes(section)) problems.push(`CLAUDE.md thiếu mục ${section}`);
  }
  assertNone(problems, 'Thiếu chốt an toàn');
});

test('settings.json dùng đúng cú pháp quyền', () => {
  const { permissions } = JSON.parse(read('.claude/settings.json'));
  const problems = [];
  for (const list of ['allow', 'ask', 'deny']) {
    for (const rule of permissions[list] ?? []) {
      if (!/^[A-Z][A-Za-z_]*(\(.+\))?$/.test(rule) && !/^mcp__/.test(rule)) problems.push(`${list}: ${rule}`);
    }
  }
  assertNone(problems, 'Rule sai cú pháp');
});

test('format test case đồng nhất giữa các tài liệu', () => {
  const manual = '| TC ID | REQ ID | Risk Level | Priority | Test Summary | Pre-condition | Action | Test Data | Expected Result | Tags |';
  const api = '| TC ID | REQ ID | Risk Level | Priority | Mục đích kiểm tra | Mô tả | Tiền điều kiện | Dữ liệu test | Các bước thực hiện | Kết quả mong đợi | Tags |';
  assert.ok(read('.claude/skills/skills-manual-testcase-v3/SKILL.md').includes(manual), 'SKILL manual sai header');
  assert.ok(read('.claude/skills/skills-manual-testcase-v3/references/format_v3.md').includes(manual), 'format_v3 sai header');
  assert.ok(read('.claude/skills/skills-api-testcase-v3/references/format_api.md').includes(api), 'format_api sai header');
});

test('không còn dấu vết của thứ đã gỡ', () => {
  const banned = [/skills-rbt-manual-testing/, /\.claude\/commands/, /skills-mobile-debug-agent/, /generate-automation-mobile/, /generate-requirements-from-mobile/, /appium_rules/, /scripts\/integrations/, /\b7 cột\b/, /\b13 cột\b/];
  const problems = [];
  for (const { rel, text } of texts) {
    for (const pattern of banned) if (pattern.test(text)) problems.push(`${rel}: ${pattern.source}`);
  }
  assertNone(problems, 'Còn dấu vết');
});

test('skill không chứa giá trị bí mật ghi liền', () => {
  const problems = [];
  for (const { rel, text } of texts) {
    if (/\bBearer [A-Za-z0-9._-]{20,}|ATATT[A-Za-z0-9_-]{10,}|ghp_[A-Za-z0-9]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY/.test(text)) problems.push(rel);
  }
  assertNone(problems, 'Có giá trị bí mật');
});
