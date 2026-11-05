// Kiểm tra hợp đồng giữa các file: luật đã chốt ở một nơi không được bị nơi khác nói ngược.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const skills = path.join(root, '.claude/skills');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8').replace(/\r\n/g, '\n');
const skill = name => read(`.claude/skills/${name}/SKILL.md`);
const { parseTestCaseMarkdown } = require(path.join(skills, 'skills-xray-export/scripts/tc_parser.js'));

function markdownFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(full);
    return entry.name.endsWith('.md') ? [full] : [];
  });
}

function findInDocs(pattern) {
  const files = [...markdownFiles(path.join(root, '.claude')), path.join(root, 'CLAUDE.md')];
  return files.flatMap(file => fs.readFileSync(file, 'utf8').split(/\r?\n/)
    .map((line, index) => (pattern.test(line) ? `${path.relative(root, file)}:${index + 1}` : null))
    .filter(Boolean));
}

const BANNED = [
  ['cấm đọc .env, trái CLAUDE.md', /KHÔNG (ĐƯỢC tự )?đọc (file )?`?\.env/i],
  ['hỏi mật khẩu trong chat', /hỏi user credentials|hỏi user cung cấp credentials/i],
  ['tên tool của công cụ khác', /run_command|replace_file_content|write_to_file|view_file/],
  ['tên workflow dùng gạch dưới', /`\/generate_/],
  ['chữ artifact của công cụ khác', /(xuất|tạo|cập nhật) artifact|Artifact `task\.md`|carousel trong artifact/i],
  ['tải URL bằng WebFetch', /→ `WebFetch`/],
  ['email test domain thật', /@test\.com|@auto\.test/],
  ['phiếu trong thư mục đã bỏ', /test_plan\.config|plans\/master-test-plan/],
  ['số stack không còn đúng', /8 stacks?/],
  ['đường dẫn và tên file API cũ', /Testcase_<|testcases\/api\/|requirements\/api\//],
  ['công cụ không có mẫu', /Karate/],
  ['TC ID sai định dạng trong mẫu', /TC-PRJ-\d/],
  ['mẫu tự nhận chạy được ngay', /Code mẫu \*\*chạy được ngay\*\*/],
];

for (const [reason, pattern] of BANNED) {
  test(`tài liệu không còn: ${reason}`, () => {
    assert.deepEqual(findInDocs(pattern), []);
  });
}

test('@KnownBug có mặt ở mọi workflow chạm tới test đỏ', () => {
  for (const name of ['run-and-fix-tests', 'analyze-test-report', 'skills-test-report-analyzer', 'skills-automation-code-reviewer', 'create-bug-report', 'execute-test-cases', 'skills-qa-automation-engineer', 'skills-test-progress-reporter', 'skills-test-summary-reporter']) {
    assert.match(skill(name), /@KnownBug/, name);
  }
  assert.doesNotMatch(skill('run-and-fix-tests'), /giữ nguyên đỏ/i);
});

test('mẫu báo cáo tổng hợp có chỗ cho đủ nguyên tắc số liệu', () => {
  const body = skill('skills-test-summary-reporter');
  const template = body.slice(body.indexOf('## Report Template'));
  assert.match(template, /\| ⏳ Cần chạy lại \|/);
  assert.match(template, /Đang phơi bug/);
  assert.match(template, /REQ `✅` đã duyệt/);
  assert.match(template, /REQ `⏳` theo hiện trạng/);
});

test('header TC trong tài liệu đọc được bằng parser Xray, TC ID đúng mẫu', t => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'contract-'));
  t.after(() => fs.rmSync(tmp, { recursive: true, force: true }));
  const cases = [
    ['skills-manual-testcase-v3/references/format_v3.md', ['CRM_X_TC_001', 'REQ-X-01', 'Low', 'P1', 'Kiểm tra', '', '1. Mở', '', '1. Thấy', '@Smoke']],
    ['skills-api-testcase-v3/references/format_api.md', ['CRM_X_TC_002', 'REQ-X-02', 'Low', 'P2', 'Kiểm tra', 'Mô tả', '', '', '1. Gọi', 'HTTP 200', '@API']],
  ];
  for (const [doc, row] of cases) {
    const header = read(`.claude/skills/${doc}`).split('\n').find(line => line.startsWith('| TC ID | REQ ID |'));
    assert.ok(header, doc);
    assert.equal(header.split('|').length - 2, row.length, `${doc}: số cột`);
    const file = path.join(tmp, `${row[0]}.md`);
    const separator = `|${'---|'.repeat(row.length)}`;
    fs.writeFileSync(file, `${header}\n${separator}\n| ${row.join(' | ')} |\n`);
    const parsed = parseTestCaseMarkdown(file);
    const tests = parsed.tests || parsed.testCases || parsed;
    assert.equal(JSON.stringify(tests).includes(row[0]), true, doc);
  }
});

test('thứ tự locator chỉ có một phiên bản', () => {
  assert.match(read('.claude/rules/locator_strategy.md'), /nguồn duy nhất/);
  const order = text => [text.indexOf('getByTestId()'), text.indexOf('getByText()')];
  for (const rel of ['.claude/rules/playwright_rules.md', '.claude/skills/skills-ui-debug-agent/SKILL.md']) {
    const [testId, byText] = order(read(rel));
    assert.ok(testId > 0 && testId < byText, rel);
  }
  assert.match(skill('skills-smart-locator-agent'), /locator_strategy\.md/);
});

test('ngưỡng ổn định của flaky thống nhất, Definition of Done giữ 2 lần', () => {
  assert.match(read('CLAUDE.md'), /ít nhất \*\*2 lần liên tiếp\*\*/);
  assert.match(skill('analyze-flaky-tests'), /--repeat-each=10/);
  assert.doesNotMatch(skill('analyze-flaky-tests'), /repeat-each=3|3 lần liên tiếp/);
  assert.match(skill('skills-flaky-test-analyzer'), /10\/10/);
});

test('bộ TC mới một module một file, không còn luật buộc tách part', () => {
  assert.deepEqual(findInDocs(/>\s*40 TC.*tách|Dồn >40 TC|tách `parts\/` theo/), []);
});

test('mẫu framework: viewport đặt sau devices, Java không giữ driver hay page làm field', () => {
  const templates = read('.claude/skills/skills-framework-architect/references/CODE_TEMPLATES.md');
  assert.ok(templates.indexOf("...devices['Desktop Chrome']") < templates.indexOf('viewport: env.headless'));
  assert.doesNotMatch(templates, /protected Page page;/);
  assert.doesNotMatch(templates, /new LoginPage\(driver\)/);
  assert.match(templates, /System\.getenv\(/);
  assert.match(templates, /base_url=os\.environ\["BASE_URL"\]/);
  assert.match(templates, /allure-js-commons/);
});

test('settings chặn đủ lệnh git đổi trạng thái code', () => {
  const { permissions } = JSON.parse(read('.claude/settings.json'));
  for (const command of ['pull', 'checkout', 'merge', 'rebase', 'reset', 'restore', 'switch', 'stash', 'clean', 'revert']) {
    assert.ok(permissions.deny.includes(`Bash(git ${command}*)`), command);
    assert.ok(permissions.deny.includes(`PowerShell(git ${command}*)`), command);
  }
  assert.ok(!permissions.allow.includes('Bash(npx *)'));
});
