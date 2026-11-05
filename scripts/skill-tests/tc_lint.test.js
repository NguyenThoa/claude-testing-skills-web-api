// Script kiểm bộ TC phải bắt đúng từng lỗi và chấp nhận file đúng.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const SCRIPT = path.resolve(__dirname, '../tc-lint/tc_lint.js');
const { lint } = require(SCRIPT);

const MANUAL_HEADER = '| TC ID | REQ ID | Risk Level | Priority | Test Summary | Pre-condition | Action | Test Data | Expected Result | Tags |\n|---|---|---|---|---|---|---|---|---|---|';
const GOOD_ROW = '| CRM_X_TC_001 | REQ-X-01 | High | P1 | Kiểm tra lưu | (không có) | 1. Mở<br>2. Lưu | (không có) | 1. Thấy form<br>2. Hiện "Đã lưu" | @Smoke |';

function setup(t, body, extraFiles = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tc-lint-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const file = path.join(dir, 'test_cases_x_web.md');
  fs.writeFileSync(file, body);
  for (const [name, content] of Object.entries(extraFiles)) fs.writeFileSync(path.join(dir, name), content);
  return { dir, file };
}

const errorsOf = (t, row) => lint([setup(t, `${MANUAL_HEADER}\n${row}\n`).file]).errors.join('\n');

test('file đúng thì không có lỗi', t => {
  const { errors, rows } = lint([setup(t, `${MANUAL_HEADER}\n${GOOD_ROW}\n`).file]);
  assert.deepEqual(errors, []);
  assert.equal(rows.length, 1);
});

test('bắt TC ID sai định dạng và trùng', t => {
  assert.match(errorsOf(t, GOOD_ROW.replace('CRM_X_TC_001', 'TC-X-1')), /TC ID sai định dạng/);
  const twice = setup(t, `${MANUAL_HEADER}\n${GOOD_ROW}\n${GOOD_ROW}\n`).file;
  assert.match(lint([twice]).errors.join('\n'), /Trùng TC ID/);
});

test('bắt Priority, Risk Level, Expected mơ hồ, Test Data mơ hồ', t => {
  assert.match(errorsOf(t, GOOD_ROW.replace('| P1 |', '| Gấp |')), /Priority không hợp lệ/);
  assert.match(errorsOf(t, GOOD_ROW.replace('| High |', '| Cao |')), /Risk Level không hợp lệ/);
  assert.match(errorsOf(t, GOOD_ROW.replace('Hiện "Đã lưu"', 'Hoạt động đúng')), /mơ hồ/);
  assert.match(errorsOf(t, GOOD_ROW.replace('| (không có) | 1. Thấy', '| Dữ liệu hợp lệ | 1. Thấy')), /Test Data mơ hồ/);
});

test('bắt Expected có bước mà Action không có', t => {
  assert.match(errorsOf(t, GOOD_ROW.replace('2. Hiện', '3. Hiện')), /bước 3/);
});

test('bắt tag trạng thái lệch với nội dung', t => {
  assert.match(errorsOf(t, GOOD_ROW.replace('@Smoke', '@KnownBug')), /thiếu mã bug/);
  assert.match(errorsOf(t, GOOD_ROW.replace('@Smoke', '@AppDeviation')), /thiếu dòng/);
  assert.match(errorsOf(t, GOOD_ROW.replace('Hiện "Đã lưu"', 'Hiện "Đã lưu"<br>⚠️ Lệch với app: chưa lưu')), /thiếu tag @AppDeviation/);
  assert.match(errorsOf(t, GOOD_ROW.replace('Hiện "Đã lưu"', 'Hiện "Đã lưu"<br>⚠️ chưa có evidence')), /thiếu tag @NeedsVerify/);
});

test('TC @Deprecated không bị chấm nội dung', t => {
  const row = GOOD_ROW.replace('@Smoke', '@Deprecated').replace('| P1 |', '| Gấp |');
  assert.equal(errorsOf(t, row), '');
});

test('đối chiếu REQ: mã không có thật là lỗi, REQ chưa có TC là cảnh báo', t => {
  const { dir, file } = setup(t, `${MANUAL_HEADER}\n${GOOD_ROW}\n${GOOD_ROW.replace('001', '002').replace('REQ-X-01', 'REQ-X-99')}\n`, {
    'req.md': 'REQ-X-01 và REQ-X-02',
  });
  const { errors, warnings } = lint([file], [path.join(dir, 'req.md')]);
  assert.match(errors.join('\n'), /REQ-X-99/);
  assert.match(warnings.join('\n'), /REQ-X-02 chưa có TC/);
});

test('link evidence phải có file thật', t => {
  const { file } = setup(t, `${MANUAL_HEADER}\n${GOOD_ROW}\n\n![a](evidence/co.png)\n![b](evidence/khong_co.png)\n`);
  fs.mkdirSync(path.join(path.dirname(file), 'evidence'));
  fs.writeFileSync(path.join(path.dirname(file), 'evidence', 'co.png'), '');
  const errors = lint([file]).errors.join('\n');
  assert.match(errors, /khong_co\.png/);
  assert.doesNotMatch(errors, /co\.png.*\n.*co\.png/);
});

test('đọc được bảng API, không đối chiếu số bước', t => {
  const header = '| TC ID | REQ ID | Risk Level | Priority | Mục đích kiểm tra | Mô tả | Tiền điều kiện | Dữ liệu test | Các bước thực hiện | Kết quả mong đợi | Tags |\n|---|---|---|---|---|---|---|---|---|---|---|';
  const row = '| CRM_X_TC_002 | REQ-X-01 | Low | P2 | Kiểm tra gọi | Mô tả | (không có) | (không có) | 1. Gọi API | 1. HTTP 200<br>2. Body có id | @API |';
  const { errors, rows } = lint([setup(t, `${header}\n${row}\n`).file]);
  assert.deepEqual(errors, []);
  assert.equal(rows.length, 1);
});

test('CLI: thoát 1 khi có lỗi, 0 khi sạch, không có TC cũng là lỗi', t => {
  const run = file => spawnSync(process.execPath, [SCRIPT, file], { encoding: 'utf8' });
  assert.equal(run(setup(t, `${MANUAL_HEADER}\n${GOOD_ROW}\n`).file).status, 0);
  assert.equal(run(setup(t, `${MANUAL_HEADER}\n${GOOD_ROW.replace('| P1 |', '| Gấp |')}\n`).file).status, 1);
  assert.equal(run(setup(t, '# Không có bảng\n').file).status, 1);
});
