---
name: fetch-gsheet-requirements
description: Lấy ticket / user story / yêu cầu thay đổi từ Google Sheet (lọc theo mã ticket, module, trạng thái) và lưu bản chụp thành file markdown trong docs/ — làm đầu vào cho /analyze-requirement-document hoặc /update-requirements-from-ticket. Thay cho việc lấy từ Jira.
---

> **Skill nền tảng cần nạp trước:** `skills-gsheet-integration` — đọc `.claude/skills/<tên-skill>/SKILL.md` của từng skill trước khi bắt đầu.

# Workflow: Lấy Requirements Từ Google Sheet

> **BẮT BUỘC (MANDATORY SKILL):** Nạp và đọc kỹ **`skills-gsheet-integration`** (`.claude/skills/skills-gsheet-integration/SKILL.md`) — mục **1. Chọn đường đọc** và **3. Nơi lưu** — trước khi bắt đầu.

Workflow này lấy ticket từ Google Sheet của team và lưu thành file `.md` có nguồn rõ ràng. **KHÔNG** phân tích, **KHÔNG** sinh REQ hay TC — việc đó của workflow kế tiếp.

## Input

| Input | Bắt buộc | Ghi chú |
|---|---|---|
| Link Google Sheet | ⭐ (hoặc file) | Không đưa → đọc `GSHEET_REQUIREMENTS_URL` trong `.env`. Vẫn không có → hỏi user |
| File `.csv` / `.xlsx` tải về | ⭐ (hoặc link) | Dùng khi sheet riêng tư và không có connector Google Drive |
| Tab | Không | Tên tab hoặc `gid`. Mặc định: `gid` trong link, không có thì tab đầu |
| Phạm vi | Không | Mã ticket (`TK-12,TK-15`) · module · trạng thái · điều kiện cột khác. Không ghi → hỏi user muốn lấy những ticket nào, **không** lấy cả sheet |

## Các bước

1. **Chọn đường đọc** theo skill mục 1 — connector Google Drive → link chia sẻ → file tải về.
2. **Xem cột** (sheet mới):
   ```bash
   python scripts/gsheet/gsheet_fetch.py --url "<link>" --list-columns
   ```
   Chưa nhận ra cột mã ticket / tiêu đề → hỏi user một câu, lọc bằng `--where`.
3. **Lấy và lưu bản chụp:**
   ```bash
   python scripts/gsheet/gsheet_fetch.py --url "<link>" --id <MÃ_TICKET> -o docs/requirements/_discovery/sources/gsheet_<mã-ticket>_<YYYYMMDD>.md
   ```
   Lọc theo module / trạng thái: `--module <module> --status "<trạng thái>"`. Sheet riêng tư (mã thoát 2) → **dừng**, báo user ba cách ở skill mục 1.
4. **Đọc lại file vừa ghi** và trình bày bằng Tiếng Việt: số ticket · bảng `Mã | Tiêu đề | Module | Trạng thái` · ticket nào thiếu Mô tả / Acceptance Criteria.
5. **Đề xuất bước kế tiếp** theo skill mục 4 — chưa có tài liệu module → `/analyze-requirement-document`; module đã có tài liệu → `/update-requirements-from-ticket` với `<TICKET-ID>` = mã ticket trên sheet.

## Lỗi thường gặp

| Hiện tượng | Nguyên nhân | Xử lý |
|---|---|---|
| Mã thoát 2 · *trang HTML (trang đăng nhập)* | Sheet riêng tư | Connector Google Drive · chia sẻ link *Người xem* · tải CSV về |
| Mã thoát 2 · *HTTP 404* | Link sai hoặc sheet đã xoá | Hỏi user link đúng |
| *Không nhận ra link Google Sheet* | Link không phải `docs.google.com/spreadsheets/d/<ID>` (VD link Drive rút gọn) | Mở link, lấy URL sheet đầy đủ |
| *Không tìm thấy cột …* | Tên cột của team khác bí danh | `--list-columns` → dùng `--where "<Tên cột>=<giá trị>"`, hoặc thêm bí danh vào `COLUMN_ALIASES` |
| Ra đúng tab khác | Link không có `gid` → lấy tab đầu | Thêm `--sheet "<tên tab>"` hoặc `--gid` |

## Output

- `docs/requirements/_discovery/sources/gsheet_<mã-ticket | tab>_<YYYYMMDD>.md`
- Tóm tắt trong chat + đề xuất workflow kế tiếp
