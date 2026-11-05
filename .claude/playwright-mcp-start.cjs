#!/usr/bin/env node
// Khởi động Playwright MCP, khai báo bí mật trong .env để agent gõ bằng TÊN biến, giá trị không vào log phiên.
// Không truyền thẳng .env vì --secrets che mọi chỗ trùng giá trị: WORKERS=5 sẽ làm số 5 trên trang thành <secret>.
// Chưa có .env thì vẫn chạy, chỉ không có bí mật; truyền --secrets tới file không tồn tại làm server không khởi động được.
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Bản đã kiểm chứng cơ chế --secrets. Nâng phiên bản thì thử lại việc gõ bằng tên biến.
const MCP_PACKAGE = '@playwright/mcp@0.0.84';
const SECRET_NAME = /PASS|PWD|SECRET|TOKEN|COOKIE|SESSION|KEY|OTP|USER|EMAIL|ACCOUNT/i;
const MIN_VALUE_LENGTH = 4;

function secretLines(envText) {
  return envText.split(/\r?\n/).filter(line => {
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match || !SECRET_NAME.test(match[1])) return false;
    return match[2].trim().replace(/^["']|["']$/g, '').length >= MIN_VALUE_LENGTH;
  });
}

function quote(arg) {
  return /\s/.test(arg) ? `"${arg}"` : arg;
}

function main() {
  const [label, ...args] = process.argv.slice(2);
  const root = path.resolve(__dirname, '..');
  const envFile = path.join(root, '.env');
  const secretFile = path.join(root, '.playwright-mcp', `mcp-secrets-${label}.env`);
  const removeSecretFile = () => fs.rmSync(secretFile, { force: true });

  const lines = fs.existsSync(envFile) ? secretLines(fs.readFileSync(envFile, 'utf8')) : [];
  if (lines.length > 0) {
    fs.mkdirSync(path.dirname(secretFile), { recursive: true });
    fs.writeFileSync(secretFile, `${lines.join('\n')}\n`, { mode: 0o600 });
    args.push('--secrets', secretFile);
  }

  // Trên Windows npx là file .cmd nên phải chạy qua shell; shell nối tham số nên tự đặt dấu nháy
  const command = ['npx', '-y', MCP_PACKAGE, ...args].map(quote).join(' ');
  const child = spawn(command, { stdio: 'inherit', shell: true, cwd: root });
  child.on('exit', code => {
    removeSecretFile();
    process.exit(code ?? 1);
  });
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => child.kill(signal));
  }
}

if (require.main === module) main();

module.exports = { secretLines };
