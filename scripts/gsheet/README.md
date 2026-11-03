# gsheet — Đọc ticket / requirement từ Google Sheet

Công cụ của skill [`skills-gsheet-integration`](../../.claude/skills/skills-gsheet-integration/SKILL.md). Team không dùng Jira: ticket, user story, yêu cầu thay đổi nằm trên **Google Sheet**, kết quả test và bug lưu thành **file `.md`** trong `docs/`.

Cần: Python 3.9+ · không cài thư viện nào.

## Ba cách đọc sheet

| Sheet của bạn | Cách đọc |
|---|---|
| Chia sẻ *"Bất kỳ ai có đường liên kết — Người xem"* | `--url "<link>"` — script tải CSV qua link export |
| Riêng tư, Claude đã bật connector **Google Drive** | Agent đọc qua connector, không cần script |
| Riêng tư, không có connector | *File → Tải xuống → Giá trị được phân tách bằng dấu phẩy (.csv)* → `--file <đường dẫn .csv>` |

Sheet riêng tư mà gọi `--url` → Google trả về trang đăng nhập → script **dừng với mã 2** và in ba cách trên. Script không bao giờ đoán nội dung.

## Lệnh

```bash
python scripts/gsheet/gsheet_fetch.py --url "<link>" --list-columns
```

```bash
python scripts/gsheet/gsheet_fetch.py --url "<link>" --id TK-12,TK-15 -o docs/requirements/_discovery/sources/gsheet_tk-12_20261103.md
```

```bash
python scripts/gsheet/gsheet_fetch.py --url "<link>" --sheet "Requirements" --module login --status "Sẵn sàng test"
```

```bash
python scripts/gsheet/gsheet_fetch.py --file reports/gsheet/tickets.csv --where "Loại=Story" --format json
```

| Tham số | Ý nghĩa |
|---|---|
| `--url` / `--file` | Nguồn — chọn một |
| `--sheet "<tên tab>"` hoặc `--gid <số>` | Tab cần đọc. Không ghi thì lấy `gid` trong link, không có nữa thì tab đầu |
| `--id` · `--module` · `--status` · `--type` | Lọc theo cột có vai trò tương ứng, nhiều giá trị cách nhau dấu phẩy, không phân biệt hoa-thường/dấu |
| `--where "Tên cột=giá trị"` | Lọc theo cột bất kỳ, lặp được |
| `--format md\|json\|csv` | Mặc định `md` |
| `--list-columns` | In tên cột + vai trò script nhận ra — chạy lần đầu với sheet mới |
| `-o <file>` | Ghi ra file thay vì in ra màn hình |

## Quy ước cột

Script nhận cột theo **bí danh** (`COLUMN_ALIASES` trong `gsheet_fetch.py`). Cột không khớp bí danh nào vẫn được xuất đủ, chỉ không lọc được bằng tham số riêng.

| Vai trò | Tên cột nhận được |
|---|---|
| Mã ticket ⭐ | `Mã ticket` · `Ticket ID` · `Mã` · `ID` · `Key` · `Story ID` · `Mã yêu cầu` |
| Tiêu đề ⭐ | `Tiêu đề` · `Title` · `Summary` · `Tên chức năng` · `Tóm tắt` |
| Loại | `Loại` · `Type` · `Issue Type` |
| Module | `Module` · `Phân hệ` · `Chức năng` · `Feature` |
| Trạng thái | `Trạng thái` · `Status` · `Tình trạng` |
| Ưu tiên | `Ưu tiên` · `Priority` |
| Mô tả | `Mô tả` · `Description` · `Nội dung` · `Chi tiết` |
| Acceptance Criteria | `Acceptance Criteria` · `Tiêu chí chấp nhận` · `AC` |

⭐ = nên có. Sheet mẫu đề xuất cho team: `Mã ticket | Loại | Tiêu đề | Module | Trạng thái | Ưu tiên | Mô tả | Acceptance Criteria | Ghi chú / Quyết định | Người tạo | Ngày cập nhật | Link đính kèm`.

🔒 Link sheet không phải bí mật nhưng **nội dung** có thể là dữ liệu nội bộ — bản `.md` xuất ra nằm trong `docs/` và được commit, đừng để sheet chứa mật khẩu / token.
