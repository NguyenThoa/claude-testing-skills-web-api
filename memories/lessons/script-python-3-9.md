# Script Python phải chạy được trên 3.9

- **Loại:** Bài học
- **Ngày:** 03-11-2026
- **Nguồn:** viết `scripts/gsheet/gsheet_fetch.py`

Các script trong `scripts/` khai "Cần: Python 3.9+ · không cần thư viện ngoài". Máy dev có thể chạy Python mới hơn nên lỗi cú pháp của bản cũ không lộ ra.

- **Không** đặt dấu `\` trong biểu thức của f-string (`f'{v.replace("|", "\\|")}'`) — chỉ hợp lệ từ 3.12. Tách ra hàm phụ.
- Kiểm nhanh cú pháp theo 3.9: `python3 -c "import ast;ast.parse(open('<file>').read(), feature_version=(3,9))"`.
- Chỉ dùng thư viện chuẩn (`urllib`, `csv`, `json`…) — không thêm `requests`, `pandas`.

**Áp dụng thế nào:** viết hoặc sửa script Python trong repo → chạy lệnh kiểm `ast` ở trên trước khi bàn giao.
