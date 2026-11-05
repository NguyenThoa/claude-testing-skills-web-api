/**
 * Runner đồng bộ trọn gói lên Jira Xray Server:
 * 1. Pre-Conditions
 * 2. 3 Test Sets (P1, P2, P3)
 * 3. Tests & Manual Steps (PUT)
 * 4. Test Plan (Description chuẩn Wiki Markup 5 mục)
 * 5. Link Relates từ Story tới Test Plan & Test Sets
 * 6. Đọc lại Jira để đối chiếu kết quả
 *
 * Chỉ báo hoàn tất khi không có lỗi. Mọi lỗi được gom lại, in ở tổng kết và trả về cho CLI.
 */
const fs = require('fs');
const path = require('path');
const { parseTestCaseMarkdown } = require('./tc_parser');

const STEP_DELAY_MS = 60;
const ISSUE_DELAY_MS = 100;
const PLAN_CHUNK_SIZE = 50;

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

/** Xray Server có thể trả mảng step hoặc object { steps: [...] }. Không nhận ra dạng nào thì trả null. */
function readSteps(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.steps)) return data.steps;
  return null;
}

/** Ô của step có thể là chuỗi, hoặc object { raw, rendered } tuỳ phiên bản Xray. */
const cellText = cell => String(typeof cell === 'object' && cell !== null ? cell.raw ?? '' : cell ?? '').replace(/\r\n/g, '\n').trim();

const sameStep = (remote, step) =>
  cellText(remote.step) === step.action
  && cellText(remote.data) === step.data
  && cellText(remote.result) === step.expected;

const stepPayload = step => ({ step: step.action, data: step.data, result: step.expected });

/**
 * Đối chiếu step trên Jira với file.
 * Mặc định chỉ nạp phần còn thiếu; nội dung lệch thì báo `drift`, không ghi đè.
 * update = true: sửa step lệch, xoá step thừa, nạp step thiếu rồi đọc lại.
 */
async function syncSteps(client, testKey, tc, update = false) {
  const stepUrl = `${client.baseUrl}/rest/raven/1.0/api/test/${testKey}/step`;
  const expected = tc.steps.length;

  const before = await client.fetchJson(stepUrl);
  const remote = before.ok ? readSteps(before.data) : null;
  if (remote === null) {
    return { error: `${tc.id} (${testKey}): không đọc được danh sách step, HTTP ${before.status}` };
  }

  const changed = tc.steps
    .map((step, i) => ({ step, remote: remote[i] }))
    .filter(pair => pair.remote && !sameStep(pair.remote, pair.step));
  const extra = remote.slice(expected);

  if (!update) {
    if (extra.length > 0) {
      return { error: `${tc.id} (${testKey}): Jira có ${remote.length} step, nhiều hơn ${expected} step trong file. Cần kiểm tra tay` };
    }
    if (changed.length > 0) return { drift: true };
  } else {
    for (const pair of changed) {
      if (pair.remote.id === undefined) {
        return { error: `${tc.id} (${testKey}): Jira không trả id của step, không sửa được` };
      }
      const res = await client.updateTestStep(testKey, pair.remote.id, stepPayload(pair.step));
      if (!res.ok) return { error: `${tc.id} (${testKey}): sửa step ${pair.step.stepNumber} lỗi HTTP ${res.status}` };
      await pause(STEP_DELAY_MS);
    }
    for (const step of extra) {
      if (step.id === undefined) {
        return { error: `${tc.id} (${testKey}): Jira không trả id của step thừa, không xoá được` };
      }
      const res = await client.deleteTestStep(testKey, step.id);
      if (!res.ok) return { error: `${tc.id} (${testKey}): xoá step thừa lỗi HTTP ${res.status}` };
      await pause(STEP_DELAY_MS);
    }
  }

  if (remote.length < expected) {
    console.log(`  📝 Nạp ${expected - remote.length}/${expected} Manual Steps...`);
    for (const step of tc.steps.slice(remote.length)) {
      const res = await client.addTestStep(testKey, stepPayload(step));
      if (!res.ok) {
        return { error: `${tc.id} (${testKey}): nạp step ${step.stepNumber} lỗi HTTP ${res.status}. Chạy lại sẽ nạp tiếp phần còn thiếu` };
      }
      await pause(STEP_DELAY_MS);
    }
  }

  const touched = changed.length > 0 || extra.length > 0 || remote.length < expected;
  if (!touched) return {};

  const after = await client.fetchJson(stepUrl);
  const actual = after.ok ? readSteps(after.data) : null;
  if (actual === null || actual.length !== expected) {
    return { error: `${tc.id} (${testKey}): sau khi nạp, Jira có ${actual?.length ?? 'không đọc được'} step, mong đợi ${expected}` };
  }
  if (update && tc.steps.some((step, i) => !sameStep(actual[i], step))) {
    return { error: `${tc.id} (${testKey}): sau khi sửa, nội dung step trên Jira vẫn khác file` };
  }
  return { updated: update };
}

const PRIORITY_NAMES = { P1: 'High', P2: 'Medium', P3: 'Low' };

/** Bỏ ký tự đặc biệt của JQL khỏi đoạn chữ dùng để tìm gần đúng. */
const jqlText = text => text.replace(/[+\-&|!(){}[\]^~*?:\\/"]/g, ' ').replace(/\s+/g, ' ').trim();

const normalizedText = value => String(value ?? '').replace(/\r\n/g, '\n').trim();

/** Summary của Jira chỉ có một dòng, tối đa 255 ký tự. */
const preconditionSummary = text => text.replace(/\s*\n\s*/g, ' ').slice(0, 250);

/** JQL "~" chỉ là tìm gần đúng, nên mọi kết quả phải được so lại đúng nội dung trước khi dùng. */
const findTest = (issues, tcId) => issues?.find(issue => String(issue.fields?.summary ?? '').startsWith(`[${tcId}]`));
const findPrecondition = (issues, text) => issues?.find(issue =>
  issue.fields?.summary === preconditionSummary(text) && normalizedText(issue.fields?.description) === text);
const findTestSet = (issues, name) => issues?.find(issue => issue.fields?.summary === name);

/** Các field của Test sinh từ file. Dùng chung cho tạo mới và so sánh. */
function testFields(tc, preMap) {
  const fields = {
    summary: `[${tc.id}] ${tc.summary}`,
    priority: { name: PRIORITY_NAMES[tc.priority] },
    description: `Pre-condition: ${tc.precondition || '(không có)'}\n\nTest Case ID: ${tc.id}\nRequirement: ${tc.reqId}\nPhân nhóm: ${tc.section}`
  };
  if (tc.precondition) fields.customfield_10708 = [preMap[tc.precondition]];
  return fields;
}

/** Trả về các field trên Jira đang khác file. */
function changedFields(remote, wanted) {
  const changed = {};
  if ((remote.summary ?? '') !== wanted.summary) changed.summary = wanted.summary;
  if (remote.priority?.name !== wanted.priority.name) changed.priority = wanted.priority;
  if (String(remote.description ?? '').replace(/\r\n/g, '\n').trim() !== wanted.description.trim()) changed.description = wanted.description;
  if (wanted.customfield_10708 && !wanted.customfield_10708.every(key => (remote.customfield_10708 || []).includes(key))) {
    changed.customfield_10708 = wanted.customfield_10708;
  }
  return changed;
}

/** Đọc lại Test Set hoặc Test Plan, trả về danh sách lỗi nếu thiếu test. */
async function verifyMembers(client, label, apiPath, expectedKeys) {
  const res = await client.fetchJson(`${client.baseUrl}${apiPath}`);
  if (!res.ok || !Array.isArray(res.data)) {
    return [`${label}: không đọc lại được danh sách test, HTTP ${res.status}`];
  }
  const actual = new Set(res.data.map(test => test.key));
  const missing = expectedKeys.filter(key => !actual.has(key));
  console.log(`  📊 ${label}: có ${res.data.length} test, thiếu ${missing.length}/${expectedKeys.length} test mong đợi`);
  return missing.length > 0 ? [`${label}: thiếu ${missing.length} test: ${missing.join(', ')}`] : [];
}

function printSummary({ client, storyKey, planKey, prioritySets, priorityBuckets, total, failures, warnings }) {
  const pushed = Object.values(priorityBuckets).reduce((sum, keys) => sum + keys.length, 0);
  console.log('\n======================================================');
  if (failures.length > 0) {
    console.log(`❌ CÓ LỖI: ${failures.length} lỗi. Đã xử lý ${pushed}/${total} test case.`);
    failures.forEach(message => console.log(`  - ${message}`));
  } else if (warnings.length > 0) {
    console.log(`⚠️ XONG, NHƯNG CÒN ${warnings.length} VIỆC PHẢI LÀM TAY. Đã xử lý ${pushed}/${total} test case.`);
  } else {
    console.log(`🎉 HOÀN TẤT: ${pushed}/${total} test case, đã đối chiếu lại trên Jira.`);
  }
  warnings.forEach(message => console.log(`  ⚠️ ${message}`));
  console.log(`- Story: ${client.baseUrl}/browse/${storyKey}`);
  console.log(`- Test Plan: ${planKey ? `${client.baseUrl}/browse/${planKey}` : '(chưa có)'}`);
  for (const [pKey, pVal] of Object.entries(prioritySets)) {
    console.log(`- Test Set ${pKey}: ${pVal.key ? `${client.baseUrl}/browse/${pVal.key}` : '(chưa có)'} (${priorityBuckets[pKey].length} TCs)`);
  }
  console.log('======================================================\n');
}

async function exportFullToXray(options) {
  const {
    projectKey,
    storyKey,
    tcFilePath,
    testSetKeys = {},
    testPlanKey = '',
    testPlanWikiText,
    testPlanSummary,
    dryRun = false,
    limit = 0,
    updateExisting = false
  } = options;

  console.log('======================================================');
  console.log('🚀 FULL XRAY EXPORTER — CYBERTECH JIRA SERVER');
  console.log(`- Project: ${projectKey}`);
  console.log(`- Story: ${storyKey}`);
  console.log(`- Source file: ${tcFilePath}`);
  console.log(`- Mode: ${dryRun ? '🔍 DRY RUN' : updateExisting ? '🔄 CẬP NHẬT TEST ĐÃ CÓ' : '⚡ REAL EXECUTION'}`);
  console.log('======================================================\n');

  const testCases = parseTestCaseMarkdown(tcFilePath);
  if (testCases.length === 0) {
    throw new Error(`Không đọc được test case nào từ file: ${tcFilePath}`);
  }
  console.log(`✓ Đã nạp ${testCases.length} test cases từ file markdown.`);

  const list = limit > 0 ? testCases.slice(0, limit) : testCases;

  if (dryRun) {
    console.log(`\n[DRY RUN] Preview 3 test cases đầu tiên:`);
    list.slice(0, 3).forEach((tc, i) => {
      console.log(`\n[${i + 1}] ${tc.id} - ${tc.summary} [Priority: ${tc.priority}]`);
      console.log(`    Pre-condition: ${tc.precondition}`);
      console.log(`    Section: ${tc.section}`);
      console.log(`    Số steps: ${tc.steps.length}`);
      tc.steps.forEach(s => {
        console.log(`     - Step ${s.stepNumber}: Act="${s.action.slice(0, 40)}..." | Exp="${s.expected.slice(0, 40)}..."`);
      });
    });
    console.log('\n✅ Dry run thành công. Cấu trúc dữ liệu hoàn toàn hợp lệ.');
    return { failures: [], warnings: [] };
  }

  const { XrayServerClient } = require('./xray_client');
  const client = new XrayServerClient();
  const failures = [];
  const warnings = [];
  const fail = message => {
    failures.push(message);
    console.error(`  ❌ ${message}`);
  };

  // Cache chỉ nhớ mã issue đã tạo. Số step luôn được đối chiếu lại với Jira ở mỗi lần chạy.
  const cachePath = path.resolve(__dirname, `../.cache_${storyKey}.json`);
  let cache = { createdTests: {}, preMap: {} };
  if (fs.existsSync(cachePath)) {
    try {
      cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      console.log(`📦 Đã nạp cache từ ${cachePath}: ${Object.keys(cache.createdTests || {}).length} tests đã có.`);
    } catch {
      cache = { createdTests: {}, preMap: {} };
    }
  }
  const saveCache = () => {
    fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf8');
  };

  // 1. Quản lý Pre-Conditions
  console.log('\n--- BƯỚC 1: XỬ LÝ PRE-CONDITIONS ---');
  const uniquePreconditions = [...new Set(list.map(tc => tc.precondition).filter(Boolean))];
  const preMap = cache.preMap || {};

  for (const preText of uniquePreconditions) {
    if (preMap[preText]) {
      console.log(`  ✓ Đã có sẵn trong cache: ${preMap[preText]}`);
      continue;
    }
    console.log(`Kiểm tra Pre-Condition: "${preText.slice(0, 50)}..."`);
    const jql = `project=${projectKey} AND issuetype="Pre-Condition" AND summary ~ "${jqlText(preText).slice(0, 50)}"`;
    const searchRes = await client.searchJql(jql, 100);
    if (!searchRes.ok) {
      fail(`Không tìm được Pre-Condition "${preText.slice(0, 50)}": HTTP ${searchRes.status}`);
      continue;
    }
    const existingPre = findPrecondition(searchRes.data.issues, preText);
    if (existingPre) {
      preMap[preText] = existingPre.key;
      console.log(`  ✓ Đã có sẵn trên Jira: ${preMap[preText]}`);
    } else {
      console.log(`  + Đang tạo mới Pre-Condition...`);
      const createRes = await client.createIssue({
        project: { key: projectKey },
        issuetype: { name: 'Pre-Condition' },
        summary: preconditionSummary(preText),
        description: preText,
        customfield_10721: { value: 'Manual' },
        customfield_10722: preText
      });
      if (createRes.ok) {
        preMap[preText] = createRes.data.key;
        console.log(`  ✓ Đã tạo Pre-Condition: ${preMap[preText]}`);
      } else {
        fail(`Không tạo được Pre-Condition "${preText.slice(0, 50)}": HTTP ${createRes.status}`);
      }
    }
    cache.preMap = preMap;
    saveCache();
  }

  // 2. Quản lý 3 Test Sets theo Priority (P1, P2, P3). Thiếu Test Set thì dừng trước khi tạo test.
  console.log('\n--- BƯỚC 2: XỬ LÝ 3 TEST SETS (P1, P2, P3) ---');
  const prioritySets = {
    P1: { key: testSetKeys.P1 || '', name: `[${storyKey}] Test Set — P1 (Smoke & Critical Path)` },
    P2: { key: testSetKeys.P2 || '', name: `[${storyKey}] Test Set — P2 (Regression & Business Validation)` },
    P3: { key: testSetKeys.P3 || '', name: `[${storyKey}] Test Set — P3 (Edge Cases & Non-Functional)` }
  };

  for (const [pKey, pVal] of Object.entries(prioritySets)) {
    if (pVal.key) {
      console.log(`  ✓ Sử dụng Test Set ${pKey}: ${pVal.key}`);
      continue;
    }
    const jql = `project=${projectKey} AND issuetype="Test Set" AND summary ~ "${pKey}" AND summary ~ "${storyKey}"`;
    const searchRes = await client.searchJql(jql, 50);
    if (!searchRes.ok) {
      throw new Error(`Không tìm được Test Set ${pKey}: HTTP ${searchRes.status}. Đã dừng, chưa tạo test nào`);
    }
    const existingSet = findTestSet(searchRes.data.issues, pVal.name);
    if (existingSet) {
      pVal.key = existingSet.key;
      console.log(`  ✓ Đã tìm thấy Test Set ${pKey}: ${pVal.key}`);
    } else if (updateExisting) {
      console.log(`  - Chưa có Test Set ${pKey}: chế độ cập nhật không tạo mới`);
    } else {
      console.log(`  + Tạo mới Test Set ${pKey}...`);
      const createRes = await client.createIssue({
        project: { key: projectKey },
        issuetype: { name: 'Test Set' },
        summary: pVal.name,
        description: `Tập hợp các Test Cases mức ${pKey} cho Story ${storyKey}.`
      });
      if (!createRes.ok) {
        throw new Error(`Không tạo được Test Set ${pKey}: HTTP ${createRes.status}. Đã dừng, chưa tạo test nào`);
      }
      pVal.key = createRes.data.key;
      console.log(`  ✓ Đã tạo Test Set ${pKey}: ${pVal.key}`);
    }
  }

  // 3. Tạo Tests & nạp Manual Steps (PUT)
  console.log(`\n--- BƯỚC 3: TẠO & ĐỒNG BỘ ${list.length} TEST ISSUES & MANUAL STEPS ---`);
  const allTestKeys = [];
  const priorityBuckets = { P1: [], P2: [], P3: [] };
  const driftIds = [];
  const updatedIds = [];
  const notOnXray = [];

  for (let i = 0; i < list.length; i++) {
    const tc = list[i];
    let testKey = cache.createdTests[tc.id];

    if (testKey) {
      console.log(`[${i + 1}/${list.length}] (Cache) ${tc.id} -> ${testKey} [${tc.priority}]`);
    } else {
      console.log(`[${i + 1}/${list.length}] Đang xử lý: ${tc.id} [${tc.priority}] - ${tc.summary.slice(0, 45)}...`);

      if (tc.precondition && !preMap[tc.precondition]) {
        fail(`${tc.id}: chưa tạo vì thiếu Pre-Condition`);
        continue;
      }

      // Kiểm tra trên Jira xem đã có chưa. Không kiểm được thì không tạo, tránh sinh test trùng.
      const jql = `project=${projectKey} AND issuetype="Test" AND summary ~ "${tc.id}"`;
      const searchRes = await client.searchJql(jql, 20);
      if (!searchRes.ok) {
        fail(`${tc.id}: không kiểm tra được test đã có, HTTP ${searchRes.status}`);
        continue;
      }

      const existingTest = findTest(searchRes.data.issues, tc.id);
      if (existingTest) {
        testKey = existingTest.key;
        console.log(`  ✓ Đã tồn tại trên Jira: ${testKey}`);
      } else if (updateExisting) {
        notOnXray.push(tc.id);
        continue;
      } else {
        const fields = {
          project: { key: projectKey },
          issuetype: { name: 'Test' },
          customfield_10702: { value: 'Manual' },
          ...testFields(tc, preMap)
        };

        const createRes = await client.createIssue(fields);
        if (!createRes.ok) {
          fail(`${tc.id}: tạo Test lỗi HTTP ${createRes.status} - ${JSON.stringify(createRes.data)}`);
          continue;
        }
        testKey = createRes.data.key;
        console.log(`  ✓ Đã tạo Test Issue: ${testKey}`);

        // Lưu ý: Không liên kết 'Tests' trực tiếp tới Story để tránh làm ngập issue (đã có Test Sets & Test Plan quản lý)
      }

      cache.createdTests[tc.id] = testKey;
      saveCache();
      await pause(ISSUE_DELAY_MS);
    }

    let isDrift = false;
    let isUpdated = false;
    const issueRes = await client.fetchJson(`${client.baseUrl}/rest/api/2/issue/${testKey}?fields=summary,priority,description,customfield_10708`);
    if (!issueRes.ok) {
      fail(`${tc.id} (${testKey}): không đọc được Test trên Jira, HTTP ${issueRes.status}`);
    } else if (!tc.precondition || preMap[tc.precondition]) {
      const changes = changedFields(issueRes.data.fields || {}, testFields(tc, preMap));
      if (Object.keys(changes).length > 0) {
        if (updateExisting) {
          const updateRes = await client.updateIssue(testKey, changes);
          if (updateRes.ok) isUpdated = true;
          else fail(`${tc.id} (${testKey}): cập nhật field lỗi HTTP ${updateRes.status}`);
        } else {
          isDrift = true;
        }
      }
    }

    const stepResult = await syncSteps(client, testKey, tc, updateExisting);
    if (stepResult.error) fail(stepResult.error);
    if (stepResult.drift) isDrift = true;
    if (stepResult.updated) isUpdated = true;
    if (isDrift) driftIds.push(tc.id);
    if (isUpdated) updatedIds.push(tc.id);

    allTestKeys.push(testKey);
    priorityBuckets[tc.priority].push(testKey);
  }

  // 4. Phân bổ tests vào 3 Test Sets (Bulk add)
  console.log('\n--- BƯỚC 4: GÁN TEST CASES VÀO TỪNG TEST SET THEO PRIORITY ---');
  for (const [pKey, keys] of Object.entries(priorityBuckets)) {
    const setKey = prioritySets[pKey].key;
    if (keys.length === 0) continue;
    if (!setKey) {
      fail(`Chưa có Test Set ${pKey} để gán ${keys.length} test: chạy /export-to-xray hoặc truyền --test-sets`);
      continue;
    }
    console.log(`📦 Đang gán ${keys.length} test cases vào Test Set ${pKey} (${setKey})...`);
    const addRes = await client.addTestsToTestSet(setKey, keys);
    if (addRes.ok) {
      console.log(`  ✓ Test Set ${pKey} (${setKey}) đã nhận yêu cầu gán ${keys.length} tests.`);
    } else {
      fail(`Gán test vào Test Set ${pKey} (${setKey}) lỗi HTTP ${addRes.status} - ${JSON.stringify(addRes.data)}`);
    }
  }

  // Chế độ cập nhật: gỡ test khỏi Test Set cũ khi Priority đổi. Issue Test được giữ nguyên.
  if (updateExisting) {
    for (const [pKey, pVal] of Object.entries(prioritySets)) {
      if (!pVal.key) continue;
      const res = await client.fetchJson(`${client.baseUrl}/rest/raven/1.0/api/testset/${pVal.key}/test`);
      if (!res.ok || !Array.isArray(res.data)) {
        fail(`Test Set ${pKey} (${pVal.key}): không đọc được danh sách test, HTTP ${res.status}`);
        continue;
      }
      const members = new Set(res.data.map(test => test.key));
      const stale = allTestKeys.filter(key => members.has(key) && !priorityBuckets[pKey].includes(key));
      if (stale.length === 0) continue;
      const removeRes = await client.removeTestsFromTestSet(pVal.key, stale);
      if (!removeRes.ok) fail(`Gỡ test khỏi Test Set ${pKey} (${pVal.key}) lỗi HTTP ${removeRes.status}`);
    }
  }

  // 5. Quản lý Test Plan & nạp tests vào Plan
  console.log('\n--- BƯỚC 5: XỬ LÝ TEST PLAN ---');
  let planKey = testPlanKey;

  if (!planKey && testPlanSummary) {
    const jql = `project=${projectKey} AND issuetype="Test Plan" AND summary ~ "${jqlText(testPlanSummary)}"`;
    const searchRes = await client.searchJql(jql, 20);
    if (!searchRes.ok) {
      fail(`Không tìm được Test Plan "${testPlanSummary}": HTTP ${searchRes.status}`);
    }
    // JQL "~" là tìm gần đúng — chỉ nhận đúng tiêu đề để không ghi đè nhầm Test Plan khác
    const found = searchRes.ok && searchRes.data.issues?.find(issue => issue.fields?.summary === testPlanSummary);
    if (found) {
      planKey = found.key;
      console.log(`  ✓ Test Plan đã có: ${planKey}`);
    }
  }

  if (!planKey) {
    const message = 'Chưa có Test Plan: tạo trên Jira rồi chạy lại với --test-plan <KEY>';
    warnings.push(message);
    console.warn(`  ⚠️ ${message}`);
  } else if (testPlanWikiText) {
    const updateRes = await client.updateIssue(planKey, { description: testPlanWikiText });
    if (!updateRes.ok) {
      fail(`Không cập nhật được Description của ${planKey}: HTTP ${updateRes.status}`);
    }
  }

  if (planKey && allTestKeys.length > 0) {
    console.log(`📥 Đang nạp ${allTestKeys.length} tests vào Test Plan ${planKey}...`);
    for (let i = 0; i < allTestKeys.length; i += PLAN_CHUNK_SIZE) {
      const chunk = allTestKeys.slice(i, i + PLAN_CHUNK_SIZE);
      const addPlanRes = await client.addTestsToTestPlan(planKey, chunk);
      const range = `${i + 1} -> ${Math.min(i + PLAN_CHUNK_SIZE, allTestKeys.length)}`;
      if (addPlanRes.ok) {
        console.log(`  ✓ Đã gửi chunk ${range}`);
      } else {
        fail(`Nạp chunk ${range} vào Test Plan ${planKey} lỗi HTTP ${addPlanRes.status}`);
      }
    }
  }

  // Chế độ cập nhật: TC đã @Deprecated được gỡ khỏi Test Set và Test Plan. Issue Test được giữ nguyên.
  if (updateExisting) {
    const deprecatedKeys = (testCases.deprecatedIds || []).map(id => cache.createdTests[id]).filter(Boolean);
    if (deprecatedKeys.length > 0) {
      for (const [pKey, pVal] of Object.entries(prioritySets)) {
        if (!pVal.key) continue;
        const res = await client.removeTestsFromTestSet(pVal.key, deprecatedKeys);
        if (!res.ok) fail(`Gỡ TC Deprecated khỏi Test Set ${pKey} (${pVal.key}) lỗi HTTP ${res.status}`);
      }
      if (planKey) {
        const res = await client.removeTestsFromTestPlan(planKey, deprecatedKeys);
        if (!res.ok) fail(`Gỡ TC Deprecated khỏi Test Plan ${planKey} lỗi HTTP ${res.status}`);
      }
      console.log(`  🗑️ Đã gỡ ${deprecatedKeys.length} TC Deprecated khỏi Test Set và Test Plan: ${deprecatedKeys.join(', ')}`);
    }
  }

  // 6. Liên kết Story với Test Plan & Test Sets (bỏ qua link đã có để chạy lại không bị trùng)
  console.log('\n--- BƯỚC 6: LIÊN KẾT STORY VỚI TEST PLAN & TEST SETS ---');
  const linkTargets = [planKey, ...Object.values(prioritySets).map(pVal => pVal.key)].filter(Boolean);
  const storyRes = await client.fetchJson(`${client.baseUrl}/rest/api/2/issue/${storyKey}?fields=issuelinks`);

  if (updateExisting) {
    console.log('  - Chế độ cập nhật không đổi link của Story');
  } else if (!storyRes.ok) {
    fail(`Không đọc được Story ${storyKey}: HTTP ${storyRes.status}. Chưa tạo link`);
  } else {
    const linkedKeys = new Set(
      (storyRes.data.fields?.issuelinks || [])
        .filter(link => link.type?.name === 'Relates')
        .map(link => link.outwardIssue?.key || link.inwardIssue?.key)
    );
    for (const targetKey of linkTargets) {
      if (linkedKeys.has(targetKey)) {
        console.log(`  ✓ Đã có link Relates: ${storyKey} ↔ ${targetKey}`);
        continue;
      }
      const linkRes = await client.createIssueLink('Relates', storyKey, targetKey);
      if (linkRes.ok) {
        console.log(`  ✓ Đã tạo link Relates: ${storyKey} ↔ ${targetKey}`);
      } else {
        fail(`Không tạo được link tới ${targetKey}: HTTP ${linkRes.status} - ${JSON.stringify(linkRes.data)}`);
      }
    }
  }

  // 7. Đọc lại Jira, đối chiếu từng Test Set và Test Plan với số mong đợi
  console.log('\n--- BƯỚC 7: ĐỐI CHIẾU LẠI TRÊN JIRA ---');
  for (const [pKey, keys] of Object.entries(priorityBuckets)) {
    const setKey = prioritySets[pKey].key;
    if (keys.length === 0 || !setKey) continue;
    (await verifyMembers(client, `Test Set ${pKey} (${setKey})`, `/rest/raven/1.0/api/testset/${setKey}/test`, keys)).forEach(fail);
  }
  if (planKey && allTestKeys.length > 0) {
    (await verifyMembers(client, `Test Plan ${planKey}`, `/rest/raven/1.0/api/testplan/${planKey}/test`, allTestKeys)).forEach(fail);
  }

  if (driftIds.length > 0) {
    warnings.push(`${driftIds.length} Test trên Jira khác file, chưa ghi đè: ${driftIds.join(', ')}. Chạy lại với --update-existing`);
  }
  if (notOnXray.length > 0) {
    warnings.push(`${notOnXray.length} TC chưa có trên Xray, chế độ cập nhật không tạo mới: ${notOnXray.join(', ')}. Dùng /export-to-xray`);
  }
  if (updatedIds.length > 0) {
    console.log(`\n🔄 Đã cập nhật ${updatedIds.length} Test: ${updatedIds.join(', ')}`);
  }

  printSummary({ client, storyKey, planKey, prioritySets, priorityBuckets, total: list.length, failures, warnings });
  return { failures, warnings, updatedIds, driftIds, notOnXray };
}

module.exports = { exportFullToXray };
