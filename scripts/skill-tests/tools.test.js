// Kiểm tra công cụ đi kèm skill bằng dữ liệu mẫu. Jira được giả lập, không có request nào ra mạng.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '../..');
const scripts = path.join(root, '.claude/skills/skills-xray-export/scripts');
const cli = path.join(scripts, 'cli.js');
const { parseTestCaseMarkdown } = require(path.join(scripts, 'tc_parser.js'));
const { exportFullToXray } = require(path.join(scripts, 'export_runner.js'));

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-tests-'));
test.after(() => fs.rmSync(tmp, { recursive: true, force: true }));
const fixture = (name, body) => {
  const file = path.join(tmp, name);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, body);
  return file;
};

const manualTable = `# I. Mau
## I.1 Giao dien
| TC ID | REQ ID | Risk Level | Priority | Test Summary | Pre-condition | Action | Test Data | Expected Result | Tags |
|---|---|---|---|---|---|---|---|---|---|
| CRM_CUST_TC_001 | REQ-CUST-01 | High | P1 | Kiểm tra mở màn hình | | 1. Mở<br>2. Đọc | 1. a<br>2. b | 1. Mở được<br>2. Đúng | @Smoke |
| CRM_CUST_TC_002 | REQ-CUST-01 | Low | P3 | 🗑️ Deprecated (PROJ-1, 04-11-2026) — Cũ | | 1. A | | 1. B | @Deprecated |

| TC ID | REQ | Trạng thái |
|---|---|---|
| CRM_CUST_TC_001 | REQ-CUST-01 | Bảng phụ, không phải test case |
`;
const apiTable = `# API
## A. Validate
| TC ID | REQ ID | Risk Level | Priority | Mục đích kiểm tra | Mô tả | Tiền điều kiện | Dữ liệu test | Các bước thực hiện | Kết quả mong đợi | Tags |
|---|---|---|---|---|---|---|---|---|---|---|
| CRM_DOC_TC_001 | REQ-DOC-03 | High | P2 | Kiểm tra thiếu file | Không truyền file | | file: không có | 1. Bỏ file<br>2. Gọi API | 1. Thất bại<br>2. HTTP 400 | @API |
`;
const legacyTable = `| TC ID | REQ ID | Module | Risk Level | Test Scenario | Pre-Condition | Test Steps | Test Data | Expected Result | Priority | Automation | Auto Type | Tags |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| CRM_OLD_TC_001 | REQ-OLD-01 | OLD | High | Kiểm tra cũ | | 1. A | 1. x | 1. B | Critical | Yes | UI | @Smoke |
`;

test('parser đọc đúng bảng manual, bỏ bảng phụ và TC đã gỡ', t => {
  t.mock.method(console, 'log', () => {});
  const list = parseTestCaseMarkdown(fixture('manual.md', manualTable));
  assert.equal(list.length, 1);
  assert.equal(list[0].priority, 'P1');
  assert.equal(list[0].steps.length, 2);
});

test('parser đưa TC API thành một Manual Step', () => {
  const [tc] = parseTestCaseMarkdown(fixture('api.md', apiTable));
  assert.equal(tc.id, 'CRM_DOC_TC_001');
  assert.equal(tc.steps.length, 1);
  assert.match(tc.steps[0].expected, /HTTP 400/);
});

test('parser vẫn đọc bộ TC cũ 13 cột và quy đổi Priority', () => {
  const [tc] = parseTestCaseMarkdown(fixture('legacy.md', legacyTable));
  assert.equal(tc.priority, 'P1');
});

const gapRow = (action, data, expected) => `| TC ID | REQ ID | Risk Level | Priority | Test Summary | Pre-condition | Action | Test Data | Expected Result | Tags |
|---|---|---|---|---|---|---|---|---|---|
| CRM_CUST_TC_003 | REQ-CUST-01 | High | P1 | Kiểm tra đăng nhập | | ${action} | ${data} | ${expected} | @Smoke |
`;

test('parser ghép Expected theo số bước trong file, bước không có Expected để trống', () => {
  const [tc] = parseTestCaseMarkdown(fixture('gap.md', gapRow(
    '1. Mở trang<br>2. Nhập email<br>3. Nhập mật khẩu<br>4. Click Login',
    '1. (không có)<br>2. a@b.c<br>3. Abc123<br>4. (không có)',
    '1. Trang hiển thị<br>4. Chuyển đến Dashboard'
  )));
  assert.deepEqual(tc.steps.map(s => s.expected), ['Trang hiển thị', '', '', 'Chuyển đến Dashboard']);
  assert.deepEqual(tc.steps.map(s => s.data), ['', 'a@b.c', 'Abc123', '']);
});

test('parser gắn Expected không đánh số vào bước cuối', () => {
  const [tc] = parseTestCaseMarkdown(fixture('plain.md', gapRow('1. Mở<br>2. Lưu', '', 'Lưu thành công')));
  assert.deepEqual(tc.steps.map(s => s.expected), ['', 'Lưu thành công']);
});

test('parser từ chối Expected của bước không tồn tại', () => {
  assert.throws(() => parseTestCaseMarkdown(fixture('orphan.md', gapRow('1. Mở', '', '1. Mở được<br>2. Thừa'))), /bước 2/);
});

const sharedRow = pre => `## Pre-condition chung
Đã đăng nhập.
Đang ở màn hình Khách hàng.

| TC ID | REQ ID | Risk Level | Priority | Test Summary | Pre-condition | Action | Test Data | Expected Result | Tags |
|---|---|---|---|---|---|---|---|---|---|
| CRM_CUST_TC_004 | REQ-CUST-01 | High | P1 | Kiểm tra mở popup | ${pre} | 1. Mở | | 1. Mở được | @Smoke |
`;

test('parser thay "Pre-condition chung" bằng nội dung thật, giữ phần khác biệt', () => {
  const read = (name, pre) => parseTestCaseMarkdown(fixture(name, sharedRow(pre)))[0].precondition;
  const shared = 'Đã đăng nhập.\nĐang ở màn hình Khách hàng.';
  assert.equal(read('pre1.md', 'Pre-condition chung'), shared);
  assert.equal(read('pre2.md', 'Pre-condition chung, mở popup Thêm mới'), `${shared}\nmở popup Thêm mới`);
  assert.equal(read('pre3.md', 'Bản ghi đang chờ xử lý'), 'Bản ghi đang chờ xử lý');
});

test('parser từ chối "Pre-condition chung" khi file không có khối nội dung', () => {
  const file = fixture('pre4.md', sharedRow('Pre-condition chung').replace('## Pre-condition chung\nĐã đăng nhập.\nĐang ở màn hình Khách hàng.\n', ''));
  assert.throws(() => parseTestCaseMarkdown(file), /Pre-condition chung/);
});

test('/generate-application-test-plan giao TC và code cho workflow chuẩn, các workflow đó agent gọi được', () => {
  const skills = path.join(root, '.claude/skills');
  const skill = fs.readFileSync(path.join(skills, 'generate-application-test-plan/SKILL.md'), 'utf8');
  assert.doesNotMatch(skill, /TC ID \|/, 'không tự định nghĩa bảng TC');
  assert.match(skill, /Đối chiếu Scenario ↔ REQ/);
  for (const name of ['generate-requirements-from-website', 'generate-testcases-from-requirements', 'generate-automation-web']) {
    assert.ok(skill.includes(`/${name}`), `thiếu ${name}`);
    assert.doesNotMatch(fs.readFileSync(path.join(skills, name, 'SKILL.md'), 'utf8'), /disable-model-invocation/);
  }
});

test('parser từ chối Priority không hợp lệ', () => {
  const file = fixture('bad.md', manualTable.replace('| High | P1 |', '| High | Gấp |'));
  assert.throws(() => parseTestCaseMarkdown(file), /Priority/);
});

function runCli(args) {
  return spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8', env: { ...process.env, JIRA_TOKEN: '' }, cwd: tmp });
}

test('CLI từ chối ghi Jira khi thiếu --yes', () => {
  const res = runCli(['PROJ-1', '--tc-file', fixture('m2.md', manualTable)]);
  assert.equal(res.status, 1);
  assert.match(res.stderr, /--yes/);
});

test('CLI cho phép dry-run mà không cần token', () => {
  assert.equal(runCli(['PROJ-1', '--tc-file', fixture('m3.md', manualTable), '--dry-run']).status, 0);
});

test('CLI báo lỗi với tham số sai', () => {
  assert.equal(runCli(['sai-ma', '--tc-file', 'x', '--dry-run']).status, 1);
});

function fakeJira(rules = {}, state = { steps: {}, fields: {}, sets: {}, plan: new Set(), tests: {}, id: 1, stepId: 1, tracked: 0 }) {
  state.stepPuts = 0;
  state.stepPosts = 0;
  state.stepDeletes = 0;
  state.fieldUpdates = 0;
  state.issues = 0;
  global.fetch = async (url, options = {}) => {
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body) : {};
    const reply = (status, data) => ({ ok: status < 400, status, text: async () => JSON.stringify(data) });
    let m;
    if (url.includes('/search')) {
      const jql = decodeURIComponent(url);
      const id = Object.keys(state.tests).find(k => jql.includes(`"${k}"`));
      const found = id ? [{ key: state.tests[id], fields: state.fields[state.tests[id]] }] : [];
      return reply(200, { issues: [...(rules.nearMatches || []), ...found] });
    }
    if (method === 'POST' && url.endsWith('/rest/api/2/issue')) {
      const type = body.fields.issuetype.name;
      if (rules.failTestSet && type === 'Test Set') return reply(500, {});
      const key = `MOCK-${state.id++}`;
      if (type === 'Test') {
        state.issues++;
        state.tests[body.fields.summary.match(/\[(.+?)\]/)[1]] = key;
        state.fields[key] = body.fields;
      }
      return reply(201, { key });
    }
    if ((m = url.match(/\/api\/test\/(.+)\/step\/(\d+)$/))) {
      const list = state.steps[m[1]];
      const index = list.findIndex(step => step.id === Number(m[2]));
      if (method === 'DELETE') {
        state.stepDeletes++;
        list.splice(index, 1);
      } else {
        state.stepPosts++;
        list[index] = { id: list[index].id, step: { raw: body.step }, data: { raw: body.data }, result: { raw: body.result } };
      }
      return reply(200, {});
    }
    if ((m = url.match(/\/api\/test\/(.+)\/step$/))) {
      state.steps[m[1]] ||= [];
      if (method === 'GET') return reply(200, state.steps[m[1]]);
      state.stepPuts++;
      if (rules.failStepAt === state.stepPuts) return reply(500, {});
      if (rules.silentStepLoss) return reply(200, {});
      state.steps[m[1]].push({ id: state.stepId++, step: { raw: body.step }, data: { raw: body.data }, result: { raw: body.result } });
      return reply(200, {});
    }
    if ((m = url.match(/\/rest\/api\/2\/issue\/(MOCK-\d+)\?/))) return reply(200, { fields: state.fields[m[1]] || {} });
    if (method === 'PUT' && (m = url.match(/\/rest\/api\/2\/issue\/(MOCK-\d+)$/))) {
      state.fieldUpdates++;
      Object.assign(state.fields[m[1]], body.fields);
      return reply(204, {});
    }
    if ((m = url.match(/\/api\/testset\/(.+)\/test$/))) {
      state.sets[m[1]] ||= new Set();
      if (method === 'POST') {
        if (rules.failSet) return reply(500, {});
        (body.add || []).forEach(k => state.sets[m[1]].add(k));
        (body.remove || []).forEach(k => state.sets[m[1]].delete(k));
        return reply(200, {});
      }
      return reply(200, [...state.sets[m[1]]].map(key => ({ key })));
    }
    if (url.match(/\/api\/testplan\/.+\/test$/)) {
      if (method === 'POST') {
        if (rules.failPlan) return reply(500, {});
        if (!rules.silentPlanLoss) (body.add || []).forEach(k => state.plan.add(k));
        (body.remove || []).forEach(k => state.plan.delete(k));
        return reply(200, {});
      }
      return reply(200, [...state.plan].map(key => ({ key })));
    }
    if (url.includes('/issue/PROJTEST-1?')) return reply(200, { fields: { issuelinks: [] } });
    return reply(201, {});
  };
  return state;
}

const cachePath = path.join(scripts, '../.cache_PROJTEST-1.json');
const manualFile = fixture('runner.md', manualTable);

async function runExport(t, options = {}) {
  for (const method of ['log', 'warn', 'error']) t.mock.method(console, method, () => {});
  process.env.JIRA_TOKEN = 'mock';
  return exportFullToXray({ projectKey: 'PROJTEST', storyKey: 'PROJTEST-1', tcFilePath: manualFile, testPlanKey: 'PROJTEST-300', ...options });
}
const cleanCache = () => fs.rmSync(cachePath, { force: true });

test('export báo thành công khi mọi thứ đúng', async t => {
  cleanCache();
  fakeJira();
  const { failures, warnings } = await runExport(t);
  cleanCache();
  assert.deepEqual([failures.length, warnings.length], [0, 0]);
});

test('export báo lỗi khi nạp step lỗi, chạy lại nạp tiếp và không tạo trùng', async t => {
  cleanCache();
  const state = fakeJira({ failStepAt: 2 });
  const first = await runExport(t);
  assert.equal(first.failures.length, 1);
  fakeJira({}, state);
  const second = await runExport(t);
  cleanCache();
  assert.equal(second.failures.length, 0);
  assert.equal(state.issues, 0, 'không được tạo trùng Test');
  assert.equal(state.stepPuts, 1, 'chỉ nạp step còn thiếu');
});

test('export dừng trước khi tạo test khi không tạo được Test Set', async t => {
  cleanCache();
  const state = fakeJira({ failTestSet: true });
  await assert.rejects(runExport(t), /Test Set/);
  cleanCache();
  assert.equal(state.issues, 0);
});

for (const [name, rules] of [
  ['gán Test Set lỗi', { failSet: true }],
  ['nạp Test Plan lỗi', { failPlan: true }],
  ['Jira trả 200 nhưng không lưu step', { silentStepLoss: true }],
  ['Jira trả 200 nhưng Test Plan thiếu test', { silentPlanLoss: true }]
]) {
  test(`export không báo thành công giả khi ${name}`, async t => {
    cleanCache();
    fakeJira(rules);
    const { failures } = await runExport(t);
    cleanCache();
    assert.ok(failures.length > 0);
  });
}

test('thiếu Test Plan là cảnh báo, không phải thành công trọn vẹn', async t => {
  cleanCache();
  fakeJira();
  const { failures, warnings } = await runExport(t, { testPlanKey: '' });
  cleanCache();
  assert.deepEqual([failures.length, warnings.length], [0, 1]);
});

test('kết quả tìm gần đúng không bị dùng nhầm thay cho Test, Pre-Condition, Test Set đúng', async t => {
  cleanCache();
  const near = { key: 'NEAR-1', fields: { summary: '[CRM_CUST_TC_0010] Test khác', description: 'Khác' } };
  const state = fakeJira({ nearMatches: [near] });
  const file = fixture('near.md', sharedRow('Pre-condition chung'));
  await runExport(t, { tcFilePath: file });
  const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
  cleanCache();
  assert.notEqual(cache.createdTests.CRM_CUST_TC_004, 'NEAR-1');
  assert.ok(!Object.values(cache.preMap).includes('NEAR-1'));
  assert.ok(!Object.keys(state.sets).includes('NEAR-1'));
});

const changedTable = manualTable
  .replace('| High | P1 | Kiểm tra mở màn hình', '| High | P2 | Kiểm tra mở màn hình đã sửa')
  .replace('1. Mở được<br>2. Đúng', '1. Mở được<br>2. Đúng theo yêu cầu mới');

test('TC đổi nội dung: mặc định chỉ cảnh báo, không ghi đè và không báo hoàn tất', async t => {
  cleanCache();
  const state = fakeJira();
  await runExport(t);
  fakeJira({}, state);
  const { failures, warnings, driftIds } = await runExport(t, { tcFilePath: fixture('changed.md', changedTable) });
  cleanCache();
  assert.equal(failures.length, 0);
  assert.deepEqual(driftIds, ['CRM_CUST_TC_001']);
  assert.ok(warnings.some(w => w.includes('--update-existing')));
  assert.deepEqual([state.stepPosts, state.fieldUpdates], [0, 0]);
});

test('--update-existing sửa step, field và chuyển Test Set khi Priority đổi', async t => {
  cleanCache();
  const state = fakeJira();
  const sets = { P1: 'PROJTEST-201', P2: 'PROJTEST-202', P3: 'PROJTEST-203' };
  await runExport(t, { testSetKeys: sets });
  fakeJira({}, state);
  const { failures, updatedIds } = await runExport(t, { testSetKeys: sets, tcFilePath: fixture('changed2.md', changedTable), updateExisting: true });
  cleanCache();
  const key = state.tests.CRM_CUST_TC_001;
  assert.equal(failures.length, 0);
  assert.deepEqual(updatedIds, ['CRM_CUST_TC_001']);
  assert.equal(state.steps[key][1].result.raw, 'Đúng theo yêu cầu mới');
  assert.equal(state.stepPosts, 1, 'chỉ sửa step đã đổi');
  assert.equal(state.fields[key].priority.name, 'Medium');
  assert.ok(!state.sets[sets.P1].has(key));
  assert.ok(state.sets[sets.P2].has(key));
});

test('--update-existing xoá step thừa khi TC bớt bước', async t => {
  cleanCache();
  const state = fakeJira();
  const sets = { P1: 'PROJTEST-201', P2: 'PROJTEST-202', P3: 'PROJTEST-203' };
  await runExport(t, { testSetKeys: sets });
  fakeJira({}, state);
  const shorter = manualTable.replace('1. Mở<br>2. Đọc | 1. a<br>2. b | 1. Mở được<br>2. Đúng', '1. Mở | 1. a | 1. Mở được');
  const { failures } = await runExport(t, { testSetKeys: sets, tcFilePath: fixture('shorter.md', shorter), updateExisting: true });
  cleanCache();
  assert.equal(failures.length, 0);
  assert.equal(state.stepDeletes, 1);
});

test('--update-existing không tạo Test mới và gỡ TC Deprecated khỏi Test Set, Test Plan', async t => {
  cleanCache();
  const state = fakeJira();
  const sets = { P1: 'PROJTEST-201', P2: 'PROJTEST-202', P3: 'PROJTEST-203' };
  const active = manualTable.replace('| 🗑️ Deprecated (PROJ-1, 04-11-2026) — Cũ |', '| Kiểm tra cũ |').replace('@Deprecated', '@Regression');
  await runExport(t, { testSetKeys: sets, tcFilePath: fixture('active.md', active) });
  const oldKey = state.tests.CRM_CUST_TC_002;
  assert.ok(state.sets[sets.P3].has(oldKey));
  fakeJira({}, state);
  const withNew = manualTable.replace(
    '| CRM_CUST_TC_002 |',
    '| CRM_CUST_TC_009 | REQ-CUST-01 | Low | P3 | Kiểm tra mới | | 1. A | | 1. B | @Regression |\n| CRM_CUST_TC_002 |'
  );
  const { failures, notOnXray } = await runExport(t, { testSetKeys: sets, tcFilePath: fixture('dep.md', withNew), updateExisting: true });
  cleanCache();
  assert.equal(state.issues, 0, 'không tạo Test mới');
  assert.deepEqual(notOnXray, ['CRM_CUST_TC_009']);
  assert.ok(!state.sets[sets.P3].has(oldKey));
  assert.ok(!state.plan.has(oldKey));
  assert.equal(failures.length, 0);
});

const importCli = path.join(scripts, 'import_results.js');
const { inspectResults, importResults, injectTestKeys, markKnownBugs } = require(importCli);
const junitXml = `<testsuites><testsuite name="s">
<testcase name="a" classname="c"><properties><property name="test_key" value="PROJ-1"/></properties></testcase>
<testcase name="b" classname="c"/>
</testsuite></testsuites>`;

function runImport(args) {
  return spawnSync(process.execPath, [importCli, ...args], { encoding: 'utf8', env: { ...process.env, JIRA_TOKEN: '' }, cwd: tmp });
}

test('import đọc đúng số test và số test chưa có mã', () => {
  assert.deepEqual(inspectResults('junit', junitXml), { total: 2, withoutKey: 1 });
  assert.deepEqual(inspectResults('xray', JSON.stringify({ tests: [{ testKey: 'PROJ-1' }, {}] })), { total: 2, withoutKey: 1 });
});

test('import nhận test_key dù đứng sau property khác, không nhầm với tên test', () => {
  const xml = `<testsuite>
<testcase name="a > b"><properties><property name="owner" value="x"/><property name="test_key" value="PROJ-1"/></properties></testcase>
<testcase name="test_key"/>
</testsuite>`;
  assert.deepEqual(inspectResults('junit', xml), { total: 2, withoutKey: 1 });
});

test('import gắn test_key theo TC ID ở tên hoặc property, bỏ qua test không chắc', () => {
  const xml = `<testsuite>
<testcase name="CRM_A_TC_001 - a > b"/>
<testcase name="b"><properties><property name="testId" value="CRM_A_TC_002"/></properties></testcase>
<testcase name="CRM_A_TC_003 - c"><failure>sai</failure></testcase>
<testcase name="CRM_A_TC_001 và CRM_A_TC_002"/>
<testcase name="d"><system-out>CRM_A_TC_001</system-out></testcase>
<testcase name="CRM_A_TC_009 - chưa có mã"/>
</testsuite>`;
  const { content, injected } = injectTestKeys(xml, { CRM_A_TC_001: 'P-1', CRM_A_TC_002: 'P-2', CRM_A_TC_003: 'P-3' });
  assert.equal(injected, 3);
  assert.deepEqual(inspectResults('junit', content), { total: 6, withoutKey: 3 });
  assert.match(content, /name="CRM_A_TC_001 - a > b"><properties><property name="test_key" value="P-1"\/><\/properties><\/testcase>/);
  assert.match(content, /<properties><property name="test_key" value="P-2"\/><property name="testId"/);
  assert.match(content, /<property name="test_key" value="P-3"\/><\/properties><failure>/);
});

test('import chuyển test @KnownBug thành FAIL, kể cả khi runner ghi pass hoặc skip', () => {
  const xml = `<testsuite>
<testcase name="CRM_A_TC_001 - pass giả"/>
<testcase name="CRM_A_TC_002 - xfail"><skipped type="pytest.xfail" message="BUG"/></testcase>
<testcase name="CRM_A_TC_003 - có property"><properties><property name="x" value="y"/></properties></testcase>
<testcase name="CRM_A_TC_004 - @KnownBug:BUG_1"/>
<testcase name="CRM_A_TC_005 - đã đỏ"><failure>sai</failure></testcase>
<testcase name="CRM_A_TC_006 - bình thường"/>
</testsuite>`;
  const { content, marked, missing } = markKnownBugs('junit', xml, ['CRM_A_TC_001', 'CRM_A_TC_002', 'CRM_A_TC_003', 'CRM_A_TC_005']);
  assert.deepEqual(missing, []);
  assert.equal(marked.length, 5);
  assert.equal((content.match(/<failure/g) || []).length, 5);
  assert.doesNotMatch(content, /<skipped/);
  assert.match(content, /<\/properties><failure/);
  assert.match(content, /TC_006 - bình thường"\/>/);
  assert.deepEqual(inspectResults('junit', content), { total: 6, withoutKey: 6 });
});

test('import xray chuyển testKey được khai thành FAIL', () => {
  const json = JSON.stringify({ tests: [{ testKey: 'P-1', status: 'PASS' }, { testKey: 'P-2', status: 'PASS', comment: '@KnownBug:BUG_1' }, { testKey: 'P-3', status: 'PASS' }] });
  const { content, marked } = markKnownBugs('xray', json, ['P-1']);
  assert.deepEqual(marked, ['P-1', 'P-2']);
  assert.deepEqual(JSON.parse(content).tests.map(test => test.status), ['FAIL', 'FAIL', 'PASS']);
});

test('import dừng khi --known-bugs không có trong file', () => {
  const res = runImport(['--format', 'junit', '--file', fixture('r4.xml', junitXml), '--project', 'PROJ', '--known-bugs', 'CRM_A_TC_999', '--dry-run']);
  assert.equal(res.status, 1);
  assert.match(res.stderr, /CRM_A_TC_999/);
});

test('import dừng trước khi gọi Jira khi còn test chưa có mã', () => {
  const res = runImport(['--format', 'junit', '--file', fixture('r3.xml', junitXml), '--project', 'PROJ', '--cache', fixture('c.json', '{"createdTests":{}}'), '--yes']);
  assert.equal(res.status, 1);
  assert.match(res.stderr, /chưa gọi Jira/);
});

test('import từ chối ghi Jira khi thiếu --yes', () => {
  const res = runImport(['--format', 'junit', '--file', fixture('r.xml', junitXml), '--project', 'PROJ']);
  assert.equal(res.status, 1);
  assert.match(res.stderr, /--yes/);
});

test('import dry-run không cần token và cảnh báo test chưa có mã', () => {
  const res = runImport(['--format', 'junit', '--file', fixture('r2.xml', junitXml), '--project', 'PROJ', '--dry-run']);
  assert.equal(res.status, 0, res.stderr);
  assert.match(res.stdout, /tạo Test mới/);
});

test('import junit bắt buộc có project', () => {
  assert.equal(runImport(['--format', 'junit', '--file', fixture('r3.xml', junitXml), '--dry-run']).status, 1);
});

for (const [name, response, tests, expectedFailures] of [
  ['thành công khi số test khớp', { ok: true, status: 200, data: { testExecIssue: { key: 'PROJ-9' } } }, 2, 0],
  ['báo lỗi khi Jira từ chối', { ok: false, status: 400, data: {} }, 2, 1],
  ['báo lỗi khi Jira trả 200 mà không có mã Test Execution', { ok: true, status: 200, data: {} }, 2, 1],
  ['báo lỗi khi số test đọc lại không khớp', { ok: true, status: 200, data: { testExecIssue: { key: 'PROJ-9' } } }, 1, 1]
]) {
  test(`import ${name}`, async () => {
    const client = {
      baseUrl: 'http://mock',
      importJunit: async () => response,
      importExecutionJson: async () => response,
      fetchJson: async () => ({ ok: true, status: 200, data: new Array(tests).fill({}) })
    };
    const { failures } = await importResults({ format: 'junit', content: junitXml, fileName: 'r.xml', projectKey: 'PROJ', client });
    assert.equal(failures.length, expectedFailures);
  });
}

test('import gửi JUnit dạng multipart, không gửi header JSON', async () => {
  process.env.JIRA_TOKEN = 'mock';
  const { XrayServerClient } = require(path.join(scripts, 'xray_client.js'));
  let captured;
  global.fetch = async (url, options) => {
    captured = { url, options };
    return { ok: true, status: 200, text: async () => '{"testExecIssue":{"key":"PROJ-9"}}' };
  };
  const res = await new XrayServerClient({ baseUrl: 'http://mock' }).importJunit(junitXml, 'r.xml', { projectKey: 'PROJ', testPlanKey: 'PROJ-300' });
  assert.equal(res.data.testExecIssue.key, 'PROJ-9');
  assert.match(captured.url, /import\/execution\/junit\?projectKey=PROJ&testPlanKey=PROJ-300/);
  assert.ok(captured.options.body instanceof FormData);
  assert.equal(captured.options.headers['Content-Type'], undefined);
});

test('Quality Insights đọc được format v3 web và API', t => {
  const python = ['python', 'python3'].find(cmd => spawnSync(cmd, ['--version']).status === 0);
  if (!python) return t.skip('máy không có Python');
  const projectRoot = path.join(tmp, 'qi');
  fixture('qi/docs/testcases/cust/web/test_cases_cust_web.md', manualTable);
  fixture('qi/docs/testcases/doc/api/test_cases_doc_api.md', apiTable);
  const code = [
    'import sys, json, pathlib, importlib.util as u',
    `s = u.spec_from_file_location('qi', r'${path.join(root, 'scripts/quality-insights/qi.py')}')`,
    "m = u.module_from_spec(s); sys.modules['qi'] = m; s.loader.exec_module(m)",
    `print(json.dumps(m.collect_testcases(pathlib.Path(r'${projectRoot}'))))`
  ].join('\n');
  const res = spawnSync(python, ['-I', '-c', code], { encoding: 'utf8', env: { ...process.env, PYTHONIOENCODING: 'utf-8' } });
  assert.equal(res.status, 0, res.stderr);
  const tcs = JSON.parse(res.stdout);
  assert.equal(tcs.CRM_CUST_TC_001.priority, 'Critical');
  assert.equal(tcs.CRM_CUST_TC_002.deprecated, true);
  assert.equal(tcs.CRM_DOC_TC_001.risk, 'High');
});

test('Quality Insights tính tầm ảnh hưởng theo Risk Level và @HighImpact', t => {
  const python = ['python', 'python3'].find(cmd => spawnSync(cmd, ['--version']).status === 0);
  if (!python) return t.skip('máy không có Python');
  const code = [
    'import sys, json, importlib.util as u',
    `s = u.spec_from_file_location('qi', r'${path.join(root, 'scripts/quality-insights/qi.py')}')`,
    "m = u.module_from_spec(s); sys.modules['qi'] = m; s.loader.exec_module(m)",
    "print(json.dumps([m.high_impact({'risk': r, 'tags': g}) for r, g in [('High', []), ('Medium', ['@HighImpact']), ('Medium', [])]]))"
  ].join('\n');
  const res = spawnSync(python, ['-I', '-c', code], { encoding: 'utf8', env: { ...process.env, PYTHONIOENCODING: 'utf-8' } });
  assert.equal(res.status, 0, res.stderr);
  assert.deepEqual(JSON.parse(res.stdout), [true, true, false]);
});

test('Quality Insights không để vùng rất bất ổn xuống Thấp chỉ vì B thấp', t => {
  const python = ['python', 'python3'].find(cmd => spawnSync(cmd, ['--version']).status === 0);
  if (!python) return t.skip('máy không có Python');
  const code = [
    'import sys, json, datetime, importlib.util as u',
    `s = u.spec_from_file_location('qi', r'${path.join(root, 'scripts/quality-insights/qi.py')}')`,
    "m = u.module_from_spec(s); sys.modules['qi'] = m; s.loader.exec_module(m)",
    "base = {'system': 'x', 'module': 'cust', 'platform': 'web'}",
    "tc = {**base, 'id': 'CRM_CUST_TC_001', 'deprecated': False, 'reqs': [], 'risk': 'Low', 'tags': []}",
    "bugs = [{**base, 'id': f'B{i}', 'state': 'open', 'severity': 'Major'} for i in range(3)]",
    "impact = {**{k: base[k] for k in ('system', 'module')}, 'ticket': 'T-1', 'date': '05-11-2026', 'reqs': [], 'changes': {'remove': ['REQ-CUST-01']}}",
    "d = {'bugs': bugs, 'runs': [], 'testcases': {tc['id']: tc}, 'impacts': [impact]}",
    "r = m.build_risk(d, datetime.date(2026, 11, 5), None, None)['rows'][0]",
    "print(json.dumps({'level': r['level'], 'score': r['score'], 'likelihood': r['likelihood'], 'B': r['B']}))"
  ].join('\n');
  const res = spawnSync(python, ['-I', '-c', code], { encoding: 'utf8', env: { ...process.env, PYTHONIOENCODING: 'utf-8' } });
  assert.equal(res.status, 0, res.stderr);
  const row = JSON.parse(res.stdout);
  assert.equal(row.B, 0);
  assert.ok(row.likelihood >= 4 && row.score < 8, JSON.stringify(row));
  assert.equal(row.level, 'Trung bình');
});

test('viewer test case nhận tên cột mới ở cả mã nguồn và bundle', () => {
  for (const file of ['src/lib/parser.ts', 'bundle.html']) {
    const text = fs.readFileSync(path.join(root, 'scripts/testcases-viewer', file), 'utf8');
    for (const column of ['test summary', 'mục đích kiểm tra', 'các bước thực hiện', 'kết quả mong đợi']) {
      assert.ok(text.includes(column), `${file} thiếu ${column}`);
    }
  }
});
