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

test('REQ đã duyệt mà app lệch mang @AppDeviation, FAIL thì báo bug', () => {
  const executor = skill('skills-manual-test-executor');
  assert.match(executor, /\*\*`@AppDeviation`\*\*.*\/create-bug-report/);
  assert.match(skill('analyze-test-report'), /@AppDeviation.*\/create-bug-report/);
  assert.match(skill('skills-test-report-analyzer'), /@AppDeviation.*\/create-bug-report/);
  const conflictRow = /Lệch với (app|API): <hiện trạng>.*@NeedsVerify/;
  assert.deepEqual(findInDocs(conflictRow), []);
});

test('tiêu chí exit có tỷ lệ TC đã chạy, bảng mặc định khớp ở reporter và plan', () => {
  const row = text => text.split('\n').find(line => line.startsWith('| 8 | TC trong phạm vi đã chạy tới'));
  const reporter = row(skill('skills-test-summary-reporter'));
  assert.ok(reporter);
  assert.equal(row(read('.claude/skills/generate-master-test-plan/references/plan_template.md')), reporter);
  assert.deepEqual(findInDocs(/#8 trở đi|tiếp từ #8/), []);
});

test('thao tác gây gián đoạn chỉ chạy khi user duyệt', () => {
  assert.match(read('.claude/skills/skills-requirements-analyzer/references/api_spec.md'), /Thao tác gây gián đoạn[\s\S]*đích danh TC trong chat/);
  assert.match(skill('skills-manual-test-executor'), /\*\*`@Disruptive`\*\*.*SKIPPED/);
  for (const name of ['generate-automation-api', 'generate-automation-web', 'generate-testcases-api']) {
    assert.match(skill(name), /@Disruptive/, name);
  }
  assert.doesNotMatch(skill('generate-test-data'), /DROP TABLE/);
});

test('bí mật: MCP khởi động qua file khai báo --secrets, ghim phiên bản, không đưa cả .env', () => {
  const { mcpServers } = JSON.parse(read('.mcp.json'));
  for (const server of Object.values(mcpServers)) {
    assert.equal(server.command, 'node');
    assert.equal(server.args[0], '.claude/playwright-mcp-start.cjs');
  }
  const start = require(path.join(root, '.claude/playwright-mcp-start.cjs'));
  const kept = start.secretLines('BASE_URL=https://x.test\nWORKERS=5\nTEST_PASSWORD=abcd1234\n# TOKEN=cu\nAPI_TOKEN=\nexport TEST_USERNAME=auto_user\nOTP=12\n');
  assert.deepEqual(kept, ['TEST_PASSWORD=abcd1234', 'export TEST_USERNAME=auto_user']);
  assert.match(read('.claude/playwright-mcp-start.cjs'), /@playwright\/mcp@\d+\.\d+\.\d+/);
  assert.match(read('CLAUDE.md'), /gõ \*\*tên biến\*\*/);
});

test('Quality Gate có bước kiểm bằng máy và báo review độc lập', () => {
  for (const rel of ['skills-manual-testcase-v3', 'skills-api-testcase-v3']) {
    const gates = read(`.claude/skills/${rel}/references/quality_gates.md`);
    assert.match(gates, /tc_lint\.js/, rel);
    assert.match(gates, /Review độc lập/, rel);
  }
  assert.match(skill('review-testcases'), /tc_lint\.js/);
  assert.match(skill('review-testcases'), /phiên mới hoặc subagent mới/);
});

test('mẫu Selenium không ghi đè hook của BaseTest, không giữ driver làm field', () => {
  const rules = read('.claude/rules/selenium_rules.md');
  assert.doesNotMatch(rules, /public void setUp\(\)|public void tearDown\(\)/);
  assert.doesNotMatch(rules, /new \w+Page\(driver\)|ValidPass/);
  assert.match(rules, /new LoginPage\(driver\(\)\)/);
});

test('vòng tự sửa thống nhất 3 vòng, expected-fail kiểm đúng assertion', () => {
  assert.deepEqual(findInDocs(/5 vòng/), []);
  const rules = read('.claude/rules/automation_rules.md');
  assert.match(rules, /function knownBug/);
  assert.match(rules, /testInfo\.expectedStatus = 'passed'/);
  assert.match(rules, /expectedExceptionsMessageRegExp/);
});

test('TC ID có trong tên test lẫn label', () => {
  assert.match(read('.claude/rules/reporting_rules.md'), /TC ID phải có ở cả hai nơi/);
  assert.deepEqual(findInDocs(/không nhét vào title|TC_LOGIN_01/), []);
  assert.doesNotMatch(read('.claude/rules/automation_rules.md'), /testLoginWithValidCredentials/);
  assert.match(read('.claude/skills/skills-framework-architect/references/CODE_TEMPLATES.md'), /public void CRM_LOGIN_TC_001_/);
});

test('settings chặn đủ lệnh git đổi trạng thái code', () => {
  const { permissions } = JSON.parse(read('.claude/settings.json'));
  for (const command of ['pull', 'checkout', 'merge', 'rebase', 'reset', 'restore', 'switch', 'stash', 'clean', 'revert']) {
    assert.ok(permissions.deny.includes(`Bash(git ${command}*)`), command);
    assert.ok(permissions.deny.includes(`PowerShell(git ${command}*)`), command);
  }
  assert.ok(!permissions.allow.includes('Bash(npx *)'));
});

test('TC API có đường chạy, không agent nào chấm thay tester', () => {
  assert.match(skill('execute-test-cases'), /File TC thuộc `api\/`[\s\S]*Agent không chấm thay/);
  assert.match(skill('skills-test-summary-reporter'), /`Cách chạy API` = `tự động hoá`/);
});

test('agent không tự đóng bug, viewer và qi hiểu trạng thái chờ xác nhận', () => {
  const retest = skill('retest-fixed-bugs');
  assert.match(retest, /Agent không tự đóng bug/);
  assert.doesNotMatch(retest, /\| ✅ FIXED \| `🟢 Đã đóng/);
  assert.match(read('scripts/bugs-viewer/bundle.html'), /chờ xác nhận\/i\.test\(retest\[0\]\.result\) \? 'PENDING'/);
  assert.match(read('scripts/quality-insights/qi.py'), /'Đã fix', 'chờ retest'/);
});

test('flaky có lối ra cho lỗi sản phẩm chập chờn', () => {
  assert.match(skill('analyze-flaky-tests'), /Lỗi sản phẩm chập chờn[\s\S]*\/create-bug-report/);
  assert.match(skill('create-bug-report'), /lỗi sản phẩm chập chờn/);
});

test('heal không thay locator khi hành vi đổi', () => {
  assert.match(skill('heal-locators'), /Nghi đổi hành vi[\s\S]*\(trừ 🚩\)/);
  assert.match(skill('skills-locator-healer-agent'), /Không Heal Khi Hành Vi Đổi/);
});

test('report ghi đúng agent chạy, không ghi agent hỗ trợ', () => {
  assert.deepEqual(findInDocs(/\(agent hỗ trợ\)/), []);
  for (const name of ['skills-manual-test-executor', 'retest-fixed-bugs']) {
    assert.match(skill(name), /Người soát xét/, name);
  }
});

test('workflow chạm hệ thống thật có bước kiểm môi trường', () => {
  for (const name of ['execute-test-cases', 'retest-fixed-bugs', 'heal-locators', 'run-and-fix-tests', 'generate-automation-web', 'generate-automation-api', 'update-automation-from-impact', 'generate-user-guide', 'analyze-flaky-tests', 'create-bug-report', 'compare-ui-from-figma-design', 'discover-system', 'generate-requirements-from-website', 'generate-requirements-from-api', 'generate-testcases-api']) {
    assert.match(skill(name), /^(- |> )\*\*Kiểm môi trường trước khi/m, name);
  }
  const templates = read('.claude/skills/skills-framework-architect/references/CODE_TEMPLATES.md');
  assert.equal((templates.match(/ALLOWED_TEST_HOST/g) || []).length >= 6, true);
});

test('mẫu chặn host: nhận host test, từ chối host lạ', () => {
  const isTest = /(^|[.-])(dev|test|qa|staging|uat|sandbox|preview)([.-]|$)|^(localhost|127\.0\.0\.1)$/i;
  assert.match(read('.claude/skills/skills-framework-architect/references/CODE_TEMPLATES.md'), /const TEST_HOST = \/\(\^\|\[\.-\]\)/);
  for (const host of ['localhost', '127.0.0.1', 'staging.acme.vn', 'crm-uat.acme.vn', 'qa.acme.vn']) assert.match(host, isTest);
  for (const host of ['acme.vn', 'contest.acme.vn', 'latest-news.vn', 'developer.acme.vn']) assert.doesNotMatch(host, isTest);
});

test('settings chặn đường lách và thao tác xoá trên Jira', () => {
  const { permissions } = JSON.parse(read('.claude/settings.json'));
  for (const command of ['npm exec*', 'npm x *', 'npm publish*', 'mvn deploy*', 'git -C*', 'git -c*']) {
    assert.ok(permissions.deny.includes(`Bash(${command})`), command);
    assert.ok(permissions.deny.includes(`PowerShell(${command})`), command);
  }
  for (const tool of ['jira_delete_issue', 'confluence_delete_page', 'confluence_delete_attachment']) {
    assert.ok(permissions.deny.includes(`mcp__jira-cybertech__${tool}`), tool);
  }
});

test('video và HTML nhúng của lần chạy không vào git', () => {
  const ignore = read('.gitignore');
  assert.match(ignore, /^docs\/executions\/\*\*\/video\/$/m);
  assert.match(ignore, /^docs\/executions\/\*\*\/\*\.html$/m);
});

test('agent không tự đứng tên quyết định bỏ test', () => {
  assert.match(read('.claude/skills/skills-manual-testcase-v3/references/mode_quick.md'), /⏳ chờ duyệt/);
  assert.match(read('.claude/skills/skills-manual-testcase-v3/references/quality_gates.md'), /⏳ chờ duyệt/);
});

test('đối chiếu CTFL v4.0.1: rủi ro có đủ thuộc tính và cách phản hồi', () => {
  const gate = read('.claude/skills/skills-requirements-analyzer/references/ambiguity_and_gate.md');
  for (const word of ['Loại', 'Khả năng', 'Tác động', 'Mức', 'Phản hồi', 'Chuyển giao', 'Dự phòng']) assert.match(gate, new RegExp(word), word);
  assert.match(read('.claude/skills/skills-requirements-analyzer/references/output_format.md'), /Loại \| Khả năng \| Tác động \| Mức \| Phản hồi/);
});

test('đối chiếu CTFL v4.0.1: kỹ thuật thiết kế đúng giáo trình', () => {
  const techniques = read('.claude/skills/skills-manual-testcase-v3/references/test_design_techniques.md');
  const api = read('.claude/skills/skills-api-testcase-v3/references/test_design_api.md');
  assert.doesNotMatch(techniques, /rút gọn pairwise|dùng pairwise và ghi/);
  assert.doesNotMatch(api, /tổ hợp: pairwise/);
  assert.match(techniques, /mỗi TC chỉ thử một chuyển đổi không hợp lệ/);
  for (const text of [techniques, api]) assert.match(text, /debrief/);
  assert.match(techniques, /impact analysis/);
});

test('đối chiếu CTFL v4.0.1: confirmation test chạy lại TC từng FAIL', () => {
  assert.match(skill('retest-fixed-bugs'), /chạy lại mọi TC từng FAIL do bug này/);
});

test('đối chiếu CTFL v4.0.1: bug report và báo cáo hoàn tất đủ nội dung điển hình', () => {
  const bug = skill('skills-bug-reporter');
  assert.match(bug, /\*\*Người báo cáo:\*\*/);
  assert.doesNotMatch(bug, /mức ảnh hưởng kỹ thuật/);
  const summary = skill('skills-test-summary-reporter');
  for (const part of ['test completion report', '### 8.4 Sai lệch so với plan', '### 8.5 Việc đóng đợt', 'change request']) assert.ok(summary.includes(part), part);
});

test('đối chiếu CTFL v4.0.1: trích dẫn khớp bản đã đối chiếu', () => {
  const standards = read('.claude/skills/generate-master-test-plan/references/standards.md');
  assert.match(standards, /v4\.0\.1 ngày 15-09-2024/);
  assert.doesNotMatch(standards, /chưa\*\* đối chiếu|organizational test policy/);
  assert.doesNotMatch(skill('skills-test-progress-reporter'), /ongoing control of the testing/);
  assert.doesNotMatch(read('.claude/skills/generate-master-test-plan/references/plan_template.md'), /chậm và dễ vỡ/);
});
