#!/usr/bin/env node
/**
 * Đẩy kết quả test lên Xray Server, tạo Test Execution rồi đọc lại Jira để đối chiếu.
 * Chỉ báo hoàn tất khi Jira trả mã Test Execution và số test đọc lại khớp số test trong file.
 */
const fs = require('fs');
const path = require('path');
const { parseArgs } = require('util');

const USAGE = `Cách dùng:
  node import_results.js --format <junit|xray> --file <file> [tuỳ chọn]

Tuỳ chọn:
  --project <KEY>     Project Jira, bắt buộc với junit
  --test-plan <KEY>   Test Plan gắn với Test Execution (junit)
  --cache <file>      File cache TC ID ↔ mã Test (junit), lặp được. Mặc định đọc mọi .cache_*.json của skill
  --allow-new-tests   Cho phép đẩy test chưa có mã Xray, có thể tạo Test mới
  --dry-run           Chỉ đọc file và xem trước, không gọi Jira
  --yes               Xác nhận đã được user duyệt, cho phép ghi lên Jira`;

const ISSUE_KEY = /^[A-Z][A-Z0-9]*-\d+$/;
const PROJECT_KEY = /^[A-Z][A-Z0-9]*$/;
// Bỏ qua nội dung trong dấu nháy để "/>" của <property> hoặc ">" trong tên test không làm cắt sai testcase
const TESTCASE = /<testcase\b(?:"[^"]*"|'[^']*'|[^>"'])*?(?:\/>|>[\s\S]*?<\/testcase>)/g;
const OPENING_TAG = /^<testcase\b(?:"[^"]*"|'[^']*'|[^>"'])*?(\/?)>/;
const HAS_TEST_KEY = /<property\b[^>]*\bname=["']test_key["']/;
const TC_ID = /[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)*_TC_\d+/g;

/** Gộp các file cache thành bảng TC ID → mã Test. TC ID trỏ tới hai mã khác nhau thì bỏ, không đoán. */
function loadKeyMap(cacheFiles) {
  const map = {};
  const conflicts = new Set();
  for (const file of cacheFiles) {
    const created = JSON.parse(fs.readFileSync(file, 'utf8')).createdTests || {};
    for (const [tcId, key] of Object.entries(created)) {
      if (map[tcId] && map[tcId] !== key) conflicts.add(tcId);
      map[tcId] = key;
    }
  }
  conflicts.forEach(tcId => delete map[tcId]);
  return { map, conflicts: [...conflicts] };
}

/** Chèn property test_key cho testcase có đúng một TC ID ở tên hoặc property, và TC ID đó có trong bảng. */
function injectTestKeys(content, keyMap) {
  let injected = 0;
  const result = content.replace(TESTCASE, testcase => {
    if (HAS_TEST_KEY.test(testcase)) return testcase;
    const opening = testcase.match(OPENING_TAG);
    const properties = testcase.match(/<properties>[\s\S]*?<\/properties>/);
    const ids = new Set(`${opening[0]}${properties ? properties[0] : ''}`.match(TC_ID) || []);
    if (ids.size !== 1) return testcase;
    const key = keyMap[[...ids][0]];
    if (!key) return testcase;
    injected += 1;
    const property = `<property name="test_key" value="${key}"/>`;
    if (properties) return testcase.replace('<properties>', `<properties>${property}`);
    if (opening[1]) return `${opening[0].slice(0, -2)}><properties>${property}</properties></testcase>`;
    return testcase.replace(opening[0], `${opening[0]}<properties>${property}</properties>`);
  });
  return { content: result, injected };
}

/** Đọc file kết quả, trả về số test và số test chưa có mã Xray. */
function inspectResults(format, content) {
  if (format === 'junit') {
    const testcases = content.match(TESTCASE) || [];
    return {
      total: testcases.length,
      withoutKey: testcases.filter(testcase => !HAS_TEST_KEY.test(testcase)).length
    };
  }
  const tests = JSON.parse(content).tests;
  if (!Array.isArray(tests)) throw new Error('File Xray JSON thiếu mảng "tests"');
  return { total: tests.length, withoutKey: tests.filter(test => !test.testKey).length };
}

async function importResults({ format, content, fileName, projectKey, testPlanKey, client }) {
  const { total } = inspectResults(format, content);
  if (total === 0) throw new Error('File không có test nào');

  const res = format === 'junit'
    ? await client.importJunit(content, fileName, { projectKey, testPlanKey })
    : await client.importExecutionJson(JSON.parse(content));

  const failures = [];
  const key = res.data?.testExecIssue?.key;
  if (!res.ok) {
    failures.push(`Jira từ chối import: HTTP ${res.status} - ${JSON.stringify(res.data)}`);
  } else if (!key) {
    failures.push(`Jira trả HTTP ${res.status} nhưng không có mã Test Execution`);
  } else {
    const check = await client.fetchJson(`${client.baseUrl}/rest/raven/1.0/api/testexec/${key}/test`);
    if (!check.ok || !Array.isArray(check.data)) {
      failures.push(`${key}: không đọc lại được danh sách test, HTTP ${check.status}`);
    } else if (check.data.length !== total) {
      failures.push(`${key}: Jira có ${check.data.length} test, file có ${total} test`);
    }
  }
  return { key, total, failures };
}

async function main() {
  let options;
  try {
    const { values } = parseArgs({
      options: {
        format: { type: 'string' },
        file: { type: 'string' },
        project: { type: 'string' },
        'test-plan': { type: 'string' },
        cache: { type: 'string', multiple: true },
        'allow-new-tests': { type: 'boolean', default: false },
        'dry-run': { type: 'boolean', default: false },
        yes: { type: 'boolean', default: false }
      }
    });
    if (!['junit', 'xray'].includes(values.format) || !values.file) {
      throw new Error('Thiếu hoặc sai --format, --file');
    }
    if (values.format === 'junit' && !PROJECT_KEY.test(values.project || '')) {
      throw new Error('Định dạng junit cần --project hợp lệ, VD PROJ');
    }
    if (values['test-plan'] && !ISSUE_KEY.test(values['test-plan'])) {
      throw new Error(`--test-plan không hợp lệ: "${values['test-plan']}"`);
    }
    if (values['test-plan'] && values.format !== 'junit') {
      throw new Error('--test-plan chỉ dùng với junit. Với xray, khai testPlanKey trong file JSON');
    }
    if (!values['dry-run'] && !values.yes) {
      throw new Error('Lệnh này sẽ ghi lên Jira. Chạy --dry-run, xin user xác nhận, rồi chạy lại với --yes');
    }
    const filePath = path.resolve(values.file);
    if (!fs.existsSync(filePath)) throw new Error(`Không tìm thấy file: ${filePath}`);
    options = { ...values, filePath, content: fs.readFileSync(filePath, 'utf8') };
    if (values.format === 'junit') {
      const skillDir = path.resolve(__dirname, '..');
      const cacheFiles = values.cache
        ? values.cache.map(file => path.resolve(file))
        : fs.readdirSync(skillDir).filter(name => /^\.cache_.*\.json$/.test(name)).map(name => path.join(skillDir, name));
      const { map, conflicts } = loadKeyMap(cacheFiles);
      const { content, injected } = injectTestKeys(options.content, map);
      options.content = content;
      console.log(`Đã gắn mã Xray từ cache: ${injected} test`);
      if (conflicts.length > 0) console.log(`⚠️ TC ID có hai mã Test trong cache, không gắn: ${conflicts.join(', ')}`);
    }
    options.summary = inspectResults(values.format, options.content);
  } catch (err) {
    console.error(`Lỗi: ${err.message}\n\n${USAGE}`);
    process.exit(1);
  }

  const { total, withoutKey } = options.summary;
  console.log(`File: ${options.filePath}\nĐịnh dạng: ${options.format}\nSố test: ${total}\nChưa có mã Xray: ${withoutKey}`);
  if (withoutKey > 0) {
    console.log(`⚠️ ${withoutKey} test chưa có mã Xray: Xray có thể tạo Test mới cho các test này.`);
  }
  if (options['dry-run']) {
    console.log('✅ Dry run xong, chưa gọi Jira.');
    return;
  }
  if (withoutKey > 0 && !options['allow-new-tests']) {
    console.error('❌ DỪNG: còn test chưa có mã Xray, chưa gọi Jira. Đặt TC ID vào tên test, chạy /export-to-xray, hoặc thêm --allow-new-tests khi user đã đồng ý tạo Test mới.');
    process.exit(1);
  }

  const { XrayServerClient } = require('./xray_client');
  const { key, failures } = await importResults({
    format: options.format,
    content: options.content,
    fileName: path.basename(options.filePath),
    projectKey: options.project,
    testPlanKey: options['test-plan'],
    client: new XrayServerClient()
  });

  if (failures.length > 0) {
    console.error(`❌ CÓ LỖI${key ? ` (Test Execution: ${key})` : ''}`);
    failures.forEach(message => console.error(`  - ${message}`));
    console.error('Kiểm tra trên Jira trước khi import lại, vì có thể đã tạo Test Execution.');
    process.exitCode = 1;
    return;
  }
  console.log(`🎉 HOÀN TẤT: Test Execution ${key}, ${total} test, đã đối chiếu lại trên Jira.`);
}

if (require.main === module) {
  main().catch(err => {
    console.error(`❌ DỪNG: ${err.message}`);
    process.exit(1);
  });
}

module.exports = { inspectResults, importResults, injectTestKeys, loadKeyMap };
