# Hai subagent review độc lập, tự gọi sau khi sinh TC / bug

- **Loại:** Quyết định
- **Ngày:** 03-11-2026
- **Nguồn:** user yêu cầu tạo 2 subagent

- `.claude/agents/testcase-reviewer.md` — chuyên gia ISTQB, chỉ chấm đúng những gì ghi trên file (mode REVIEW của `skills-testcase-reviewer`). Công cụ: Read · Glob · Grep · Write. Không mở browser.
- `.claude/agents/bug-report-reviewer.md` — QA nghi ngờ bug: làm lại từng chữ Steps trên hệ thống thật **đủ 3 lần**, chấm *tái hiện · lỗi thật · bug viết đủ*. Không khai `tools` → kế thừa đủ công cụ, kể cả Playwright / Appium MCP (cần để tái hiện).
- Điểm gọi đã gắn vào skill: cuối `/generate-testcases-manual-rbt` (Bước 7), `/generate-testcases-from-requirements`, `/generate-testcases-api`, `/update-testcases-from-impact` APPLY (Bước 8, chỉ TC trong `delta_tc_`), `/create-bug-report` (Bước 5). Luật chung: `CLAUDE.md` mục 9b.
- Báo cáo bug review ghi vào thư mục mới `docs/bugs/<module>/<nền-tảng>/review/` (đã thêm vào cây `docs/` trong `CLAUDE.md`).

**Vì sao:** user muốn một vòng review không bị ảnh hưởng bởi lý lẽ của người viết — subagent không thấy hội thoại.

**Áp dụng thế nào:**
- Gọi **tự động** khi TC / bug đã chốt, không hỏi trước; prompt giao việc tự đủ, **không** kể lý do hay gợi ý.
- Subagent chỉ báo cáo. Main agent hỏi user trước khi sửa; không tự gọi lại reviewer thành vòng lặp.
- `bug-report-reviewer` dùng chung browser MCP với main agent → gọi foreground, và nó tự đăng xuất / về trạng thái sạch trước bước 1.
- **Bug reviewer phải thử lại đủ 3 lần / bug** (mỗi lần từ trạng thái sạch, dữ liệu mới) mới được kết luận có phải bug — 3/3 ổn định · 1–2/3 không ổn định (ghi tần suất) · 0/3 không tái hiện · chưa đủ 3 lần = không kết luận. User bổ sung 03-11-2026.
- Chưa chạy thử 2 subagent trên bộ TC / bug thật (03-11-2026 — `docs/` đang trống).
