#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const { parseArgs } = require('util');
const { exportFullToXray } = require('./export_runner');

const USAGE = `Cách dùng:
  node cli.js <STORY-KEY> --tc-file <file> [tuỳ chọn]

Bắt buộc:
  <STORY-KEY>            Mã Story trên Jira, VD PROJ-123
  --tc-file <file>       File markdown chứa bảng test case

Tuỳ chọn:
  --project <KEY>        Project Jira (mặc định: phần đầu của STORY-KEY)
  --test-sets <P1,P2,P3> 3 mã Test Set có sẵn (mặc định: tìm theo Story, chưa có thì tạo mới)
  --test-plan <KEY>      Mã Test Plan có sẵn (mặc định: tìm theo --plan-summary)
  --plan-summary <text>  Tiêu đề Test Plan, dùng để tìm Test Plan có sẵn
  --plan-file <file>     File chứa mục "${'## III. MÃ WIKI MARKUP JIRA'}" để cập nhật Description của Test Plan
  --limit <n>            Chỉ xử lý n test case đầu
  --limit-1              Như --limit 1
  --dry-run              Chỉ đọc file và xem trước, không gọi Jira
  --update-existing      Sửa Test đã có theo file, gỡ TC @Deprecated khỏi Test Set và Test Plan. Không tạo Test mới
  --yes                  Xác nhận đã được user duyệt, cho phép ghi lên Jira
  --help                Xem hướng dẫn này`;

const ISSUE_KEY = /^[A-Z][A-Z0-9]*-\d+$/;
const PLAN_MARKER = '## III. MÃ WIKI MARKUP JIRA';

function readArgs() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      'tc-file': { type: 'string' },
      project: { type: 'string' },
      'test-sets': { type: 'string' },
      'test-plan': { type: 'string' },
      'plan-summary': { type: 'string' },
      'plan-file': { type: 'string' },
      limit: { type: 'string' },
      'limit-1': { type: 'boolean', default: false },
      'dry-run': { type: 'boolean', default: false },
      'update-existing': { type: 'boolean', default: false },
      yes:{ type: 'boolean', default: false },
      help: { type: 'boolean', default: false }
    }
  });
  return { values, positionals };
}

function requireIssueKey(value, label) {
  if (!ISSUE_KEY.test(value)) {
    throw new Error(`${label} không hợp lệ: "${value}" (đúng dạng: PROJ-123)`);
  }
  return value;
}

function parseTestSets(raw) {
  if (!raw) return {};
  const keys = raw.split(',').map(k => k.trim());
  if (keys.length !== 3) {
    throw new Error('--test-sets phải có đúng 3 mã theo thứ tự P1,P2,P3');
  }
  keys.forEach(k => requireIssueKey(k, '--test-sets'));
  return { P1: keys[0], P2: keys[1], P3: keys[2] };
}

function parseLimit(values) {
  if (values['limit-1']) return 1;
  if (values.limit === undefined) return 0;
  if (!/^[1-9]\d*$/.test(values.limit)) {
    throw new Error(`--limit phải là số nguyên dương: "${values.limit}"`);
  }
  return Number(values.limit);
}

function readPlanWikiText(planFile) {
  if (!planFile) return '';
  const planPath = path.resolve(planFile);
  if (!fs.existsSync(planPath)) {
    throw new Error(`Không tìm thấy --plan-file: ${planPath}`);
  }
  const content = fs.readFileSync(planPath, 'utf8');
  const match = content.split(PLAN_MARKER)[1]?.match(/```text\r?\n([\s\S]*?)\r?\n```/);
  if (!match) {
    throw new Error(`--plan-file thiếu mục "${PLAN_MARKER}" kèm khối \`\`\`text: ${planPath}`);
  }
  return match[1].trim();
}

async function main() {
  let options;
  try {
    const { values, positionals } = readArgs();
    if (values.help) {
      console.log(USAGE);
      return;
    }
    if (positionals.length !== 1 || !values['tc-file']) {
      throw new Error('Thiếu <STORY-KEY> hoặc --tc-file');
    }
    if (!values['dry-run'] && !values.yes) {
      throw new Error('Lệnh này sẽ ghi lên Jira. Chạy --dry-run, xin user xác nhận, rồi chạy lại với --yes');
    }

    const storyKey = requireIssueKey(positionals[0], 'STORY-KEY');
    options = {
      projectKey: values.project || storyKey.split('-')[0],
      storyKey,
      tcFilePath: path.resolve(values['tc-file']),
      testSetKeys: parseTestSets(values['test-sets']),
      testPlanKey: values['test-plan'] ? requireIssueKey(values['test-plan'], '--test-plan') : '',
      testPlanSummary: values['plan-summary'] || '',
      testPlanWikiText: readPlanWikiText(values['plan-file']),
      dryRun: values['dry-run'],
      updateExisting: values['update-existing'],
      limit: parseLimit(values)
    };
  } catch (err) {
    console.error(`Lỗi: ${err.message}\n\n${USAGE}`);
    process.exit(1);
  }

  const { failures } = await exportFullToXray(options);
  if (failures.length > 0) process.exitCode = 1;
}

main().catch(err => {
  console.error(`❌ DỪNG: ${err.message}`);
  process.exit(1);
});
