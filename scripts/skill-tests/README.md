# Bộ test cho skill

Chạy sau mỗi lần sửa `.claude/`, `CLAUDE.md` hoặc `scripts/`. Không cần cài gì thêm, chỉ cần Node 20.12 trở lên. Không gọi mạng.

```bash
node --test "scripts/skill-tests/*.test.js"
```

| File | Kiểm tra |
|---|---|
| `skills.test.js` | Frontmatter · tham chiếu skill, workflow, link · bản đồ `references/` · `paths` của rule · chốt an toàn · cú pháp `settings.json` · format test case · dấu vết thứ đã gỡ · giá trị bí mật |
| `contracts.test.js` | Hợp đồng giữa các file: luật đã chốt không bị nơi khác nói ngược (`.env`, tên tool cũ, email test, TC ID, `@KnownBug`, mẫu báo cáo, locator, ngưỡng flaky, mẫu framework, quyền git) |
| `tools.test.js` | Parser test case · CLI Xray từ chối ghi khi thiếu `--yes` · báo lỗi trung thực với Jira giả lập · `qi.py` · cột của viewer |

**Giới hạn:** bộ test này kiểm tra cấu trúc và công cụ, không kiểm tra chất lượng nội dung do agent sinh ra. Sau khi sửa lớn, vẫn nên chạy thử cả chuỗi trên một module mẫu và có người đọc lại kết quả.

Sửa skill làm một test fail thì sửa nguyên nhân. Chỉ đổi test khi quy ước đã đổi có chủ đích.
