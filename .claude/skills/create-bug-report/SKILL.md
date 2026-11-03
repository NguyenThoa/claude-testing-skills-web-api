---
name: create-bug-report
description: Sinh bug report chuẩn từ test FAIL — thu thập evidence, viết steps to reproduce, phân loại severity/priority. Lưu thành file markdown trong docs/bugs/.
---

> **Skill nền tảng cần nạp trước:** `skills-bug-reporter` · `skills-flaky-test-analyzer` — đọc `.claude/skills/<tên-skill>/SKILL.md` của từng skill trước khi bắt đầu.

# Workflow: Tạo Bug Report Từ Test FAIL

> **BẮT BUỘC (MANDATORY SKILL):** Bạn PHẢI nạp và đọc kỹ nội dung của skill **`skills-bug-reporter`** (tại `.claude/skills/skills-bug-reporter/SKILL.md`) trước khi bắt đầu.

## ⚠️ Nguyên tắc thực thi

- **Tất cả output bằng Tiếng Việt**
- **Phải tái hiện lỗi ít nhất 1 lần** trước khi viết bug — nếu không tái hiện được → nghi flaky → đề xuất chạy `/analyze-flaky-tests` thay vì báo bug
- **KHÔNG bịa evidence** — chỉ đính kèm screenshot/log thực tế thu thập được
- Bug **chỉ** lưu thành file `.md` trong `docs/bugs/` — team không dùng Jira, không đẩy lên công cụ ngoài

## Input cần thu thập

| Input | Bắt buộc? |
|---|---|
| Test fail (test file + error log, HOẶC mô tả manual TC fail) **hoặc** mã DIFF `Dev` trong báo cáo `/compare-ui-from-figma-design` | ⭐ Bắt buộc — bug từ DIFF đặt mã theo skill (hậu tố = mã DIFF thay TC_ID) |
| Requirement/spec liên quan (để viết Expected có căn cứ) | Khuyến nghị |
| Môi trường (env, browser, account test) | Khuyến nghị — agent tự thu thập nếu thiếu |

## Các bước thực hiện

### Bước 1: Thu thập & Tái hiện
1. Đọc test file / mô tả lỗi, error log, screenshot có sẵn
2. Tái hiện lỗi: chạy lại test HOẶC thao tác trên browser qua Playwright MCP (`navigate → wait_for(page_load) → thao tác → screenshot khi lỗi xuất hiện`)
3. Nếu KHÔNG tái hiện được → dừng, báo user và đề xuất `/analyze-flaky-tests`

### Bước 2: Phân tích & Phân loại
1. Rút gọn steps to reproduce về mức tối thiểu
2. Xác định Expected (có căn cứ requirement) vs Actual (quan sát được)
3. Gán Severity/Priority theo bảng trong skill `skills-bug-reporter`

### Bước 3: Viết Bug Report (CHECKPOINT)
1. Điền đầy đủ template trong skill, lưu file `docs/bugs/<module>/<nền-tảng>/BUG_<module>_<timestamp>_<TC_ID>.md` — `<nền-tảng>` là nền tảng của lần chạy phát hiện bug (thư mục `docs/executions/<module>/<nền-tảng>/` chứa report gốc)
2. **⏸️ DỪNG LẠI** — trình bày cho user review, hỏi: "Nội dung bug report đã chính xác chưa?" — user sửa gì thì cập nhật file rồi mới chốt

### Bước 4: Chốt file và danh mục
- Cập nhật dòng của bug trong `docs/bugs/README.md` sau khi user xác nhận nội dung
- Team cần bảng bug để chia sẻ → mở `scripts/bugs-viewer/bundle.html`, xuất CSV/Excel

### Bước 5: Review độc lập — subagent `bug-report-reviewer`

Chạy **tự động**, ngay khi danh sách bug đã ghi xong (file `BUG_*.md` + danh mục `docs/bugs/README.md`) và **không còn chỉnh sửa**. Không hỏi user có muốn review không.

1. Gọi subagent **`bug-report-reviewer`** (Agent tool, `subagent_type: bug-report-reviewer`, chạy foreground — subagent dùng chung browser MCP). Subagent **không thấy hội thoại** — prompt giao việc phải tự đủ: đường dẫn từng file bug vừa tạo · URL môi trường test · build/version đang chạy · **tên biến** `.env` chứa tài khoản test (không ghi giá trị) · môi trường có dùng chung không · file REQ/TC liên quan. **Không** kể cách mình đã tái hiện, không gợi ý bước nào "phải hiểu là".
2. Nhận tóm tắt → chuyển nguyên cho user: đường dẫn báo cáo review, bảng `Tái hiện (n/3) · Lỗi thật? · Kết luận` từng bug (subagent chạy đủ **3 lần** mỗi bug mới kết luận), việc cần sửa, câu hỏi cho PO.
3. Bug cần sửa / đóng / gộp → **hỏi user** trước khi đụng file bug hay danh mục. Bug vừa tạo chưa giao dev nên được sửa nội dung; bug đã giao dev thì chỉ ghi thêm, không sửa Steps/Expected/Actual (quy tắc của `skills-bug-reporter`). **Không** tự gọi lại reviewer — chỉ gọi lại khi user yêu cầu sau khi sửa.

## Output

- File `docs/bugs/<module>/<nền-tảng>/BUG_<module>_<timestamp>_<TC_ID>.md` theo template chuẩn
- Bổ sung/cập nhật dòng của bug trong danh mục `docs/bugs/README.md` — chưa tồn tại thì tạo mới theo **Template Danh Mục** trong skill `skills-bug-reporter` (cột `Mã bug` và `Trạng thái` là bắt buộc, thiếu là `scripts/bugs-viewer` bỏ cả bảng)
- Báo cáo review độc lập `docs/bugs/<module>/<nền-tảng>/review/bug_review_<YYYYMMDD_HHMM>.md` (do subagent `bug-report-reviewer` ghi ở Bước 5)
