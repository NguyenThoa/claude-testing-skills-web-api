---
name: skills-gsheet-integration
description: Skill đọc ticket / user story / yêu cầu thay đổi từ Google Sheet — thay cho Jira. Ba đường đọc (connector Google Drive · link chia sẻ qua scripts/gsheet/gsheet_fetch.py · file CSV tải về), lọc theo mã ticket / module / trạng thái, lưu bản chụp thành file .md trong docs/ làm nguồn cho phân tích requirements. Team không dùng Jira — kết quả test và bug chỉ lưu thành file .md, không đẩy đi đâu.
---

# Google Sheet Integration

Purpose: Team **không dùng Jira**. Nguồn ticket là **Google Sheet**; mọi kết quả (execution report, bug report, báo cáo) lưu thành **file `.md`** trong `docs/`. Skill này lo đúng một việc: **đọc sheet → bản chụp `.md` có nguồn rõ ràng**, để các workflow phân tích requirements dùng như một tài liệu.

---

## When to Use

- User đưa link `docs.google.com/spreadsheets/...` kèm mã ticket / module cần phân tích
- *"lấy requirement từ sheet"*, *"đọc ticket TK-12 trên Google Sheet"*, *"sheet ticket có gì mới"*
- Workflow khác cần nội dung ticket mà user chỉ đưa mã ticket: `/analyze-requirement-document`, `/update-requirements-from-ticket`, `/generate-traceability-matrix`, `/retest-fixed-bugs`
- User đưa file `.csv` / `.xlsx` tải từ Google Sheet

**Không** dùng để ghi lên sheet. Kết quả test, bug, báo cáo **chỉ** lưu `.md` trong `docs/` — xem mục 5.

---

## 1. Chọn đường đọc

| Thứ tự | Điều kiện | Cách đọc |
|---|---|---|
| 1 | Connector **Google Drive** đã bật trong phiên (có công cụ đọc file Drive) | Đọc sheet qua connector — giữ được sheet riêng tư, không cần chia sẻ link |
| 2 | Sheet chia sẻ *"Bất kỳ ai có đường liên kết — Người xem"* | `python scripts/gsheet/gsheet_fetch.py --url "<link>" …` |
| 3 | Sheet riêng tư, không có connector | Nhờ user *File → Tải xuống → .csv* (hoặc `.xlsx`) → `--file <đường dẫn>` · `.xlsx` thì ủy quyền skill `xlsx` |

- Script trả **mã 2** = sheet riêng tư hoặc link sai → **dừng**, chuyển đường 1 hoặc 3, báo user một câu. **Tuyệt đối không bịa nội dung ticket.**
- Connector Google Drive báo chưa xác thực → báo user bật connector trong cài đặt Claude, không tự xoay sang cách khác ngoài 3 đường trên.
- **Không** dùng `WebFetch` cho link sheet — kết quả đã qua xử lý, bảng lớn bị cắt âm thầm.

Lệnh đầy đủ và quy ước cột: [`scripts/gsheet/README.md`](../../../scripts/gsheet/README.md).

---

## 2. Quy trình đọc

1. **Xem cột trước** — sheet mới chạy `--list-columns`. Chưa nhận ra cột *mã ticket* hoặc *tiêu đề* → hỏi user **một câu** cột nào là mã ticket, rồi lọc bằng `--where`. Không tự đoán cột.
2. **Lọc đúng phạm vi** — theo mã ticket (`--id`), module (`--module`), trạng thái (`--status`) hoặc cột bất kỳ (`--where`). Không kéo cả sheet vào ngữ cảnh khi chỉ cần vài ticket.
3. **Lưu bản chụp** — `--format md -o <file>` theo mục 3.
4. **Đọc lại file vừa ghi**, tóm tắt cho user: số ticket, mã + tiêu đề, cột nào trống (VD ticket thiếu Acceptance Criteria).
5. **Chuyển tiếp** — mục 4.

### Đọc qua connector Google Drive

Connector trả nội dung sheet dạng bảng / CSV → ghi ra `reports/gsheet/<tab>.csv` rồi chạy script với `--file` để lọc và xuất `.md` **cùng định dạng** với hai đường kia. Workflow phía sau chỉ cần biết một định dạng.

---

## 3. Nơi lưu

| File | Đường dẫn | Ghi chú |
|---|---|---|
| Bản chụp ticket | `docs/requirements/_discovery/sources/gsheet_<mã-ticket \| tab>_<YYYYMMDD>.md` | Nhiều ticket một lần lấy → đặt theo tab hoặc mã đầu. **Không sửa tay** — sheet đổi thì lấy lại, file mới |
| CSV tải về / CSV từ connector | `reports/gsheet/` | Đã `.gitignore` — file làm việc, không vào `docs/` |

Bản chụp ghi sẵn **Nguồn** (link sheet + tab) và **Thời điểm lấy** — workflow phía sau trích dẫn nguyên văn từ file này như từ một tài liệu, ghi `Nguồn: gsheet_<…>.md · <mã ticket>`.

🔒 Không ghi giá trị bí mật vào `docs/`. Ô sheet chứa mật khẩu / token → che bằng hình thái (`<16 ký tự hex>`) trước khi lưu, nhắc user đổi giá trị đó.

---

## 4. Chuyển tiếp sang workflow nào

| Tình huống | Workflow kế tiếp | Đầu vào |
|---|---|---|
| Ticket mới, chưa phân tích | `/analyze-requirement-document` | File bản chụp `.md` |
| Module đã có tài liệu requirements, ticket là thay đổi | `/update-requirements-from-ticket` | File bản chụp + mã ticket → `<TICKET-ID>` |
| Cần ma trận truy vết từ danh sách ticket | `/generate-traceability-matrix` | Bản chụp làm nguồn requirements phụ |
| Bug theo dõi trên sheet cần retest | `/retest-fixed-bugs` | Bản chụp — đối chiếu với `docs/bugs/` |

**Mã ticket** trên sheet (cột *Mã ticket*, VD `TK-12`) dùng nguyên làm `<TICKET-ID>` trong `analysis_<TICKET-ID>.md`, `impact_<TICKET-ID>.md`, `delta_tc_<TICKET-ID>.md`. Sheet không có cột mã → đề nghị team thêm cột trước khi phân tích; chuỗi delta cần mã ổn định để nối các tầng.

**Comment / quyết định mới nhất** thường nằm ở cột *Ghi chú* / *Quyết định* hoặc tab riêng — đọc cả phần đó; quyết định ghi sau **đè lên** mô tả gốc.

---

## 5. Kết quả test và bug — chỉ lưu file `.md`

| Loại | Nơi lưu | Workflow |
|---|---|---|
| Kết quả thực thi manual | `docs/executions/<module>/<nền-tảng>/run_<timestamp>/execution_report.md` | `/execute-test-cases` |
| Kết quả automation | `reports/` (Allure) + phân tích `docs/executions/<module>/<nền-tảng>/analysis_<timestamp>.md` | `/run-and-fix-tests` · `/analyze-test-report` |
| Bug | `docs/bugs/<module>/<nền-tảng>/BUG_*.md` + danh mục `docs/bugs/README.md` | `/create-bug-report` |
| Báo cáo tiến độ / tổng hợp | `docs/executions/test_progress_*.md` · `test_summary_*.md` | `/generate-test-progress-report` · `/generate-test-summary-report` |

Team muốn bảng bug trên Google Sheet → xuất CSV/Excel từ `scripts/bugs-viewer/bundle.html` rồi tự dán vào sheet. Agent **không** ghi lên sheet.

---

## Anti-Patterns

- ❌ Bịa / tóm tắt từ trí nhớ nội dung ticket khi chưa đọc được sheet
- ❌ `WebFetch` link Google Sheet
- ❌ Kéo cả sheet hàng trăm dòng vào ngữ cảnh khi chỉ cần vài ticket
- ❌ Sửa tay file bản chụp — lấy lại từ sheet
- ❌ Ghi kết quả / bug lên Google Sheet hay bất kỳ công cụ ngoài nào
- ❌ Lưu CSV tải về vào `docs/`
