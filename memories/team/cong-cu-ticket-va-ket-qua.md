# Công cụ: không Jira, ticket từ Google Sheet, kết quả lưu .md

- **Loại:** Quyết định
- **Ngày:** 03-11-2026
- **Nguồn:** user nói trong chat khi tuỳ biến repo

- Công ty **không dùng Jira / Xray**. Ba skill Jira (`fetch-jira-requirements`, `import-test-results-xray`, `skills-jira-integration`) đã **xoá** theo xác nhận của user.
- Ticket / user story / yêu cầu thay đổi nằm trên **Google Sheet** → đọc bằng `/fetch-gsheet-requirements` (skill nền `skills-gsheet-integration`, script `scripts/gsheet/gsheet_fetch.py`). Link mặc định: `GSHEET_REQUIREMENTS_URL` trong `.env`.
- Bug, execution report, báo cáo **chỉ lưu file `.md`** trong `docs/` — không đẩy lên công cụ ngoài, **không ghi lên Google Sheet**.
- Mã ticket trên sheet (VD `TK-12`) dùng nguyên làm `<TICKET-ID>`.

**Vì sao:** team không có Jira; mọi thứ cần nằm trong repo để truy vết bằng git.

**Áp dụng thế nào:** gặp yêu cầu "lấy ticket", "đẩy bug", "đồng bộ kết quả" → đi đường Google Sheet / file `.md`, không đề xuất Jira, Xray, TestRail. Script Google Sheet mới chỉ chạy thử bằng file CSV mẫu — **chưa thử với sheet thật** của team.
