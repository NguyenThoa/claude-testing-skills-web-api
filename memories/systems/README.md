# systems/ — Kiến thức về hệ thống đang test

Chưa có hệ thống nào — `docs/` mẫu đã dọn ngày 03-11-2026.

## Cấu trúc khi có hệ thống

```
systems/
└── <hệ-thống>/              ← tên ngắn, ASCII, VD crm · erp · book-api
    ├── _tong-quan.md        ← URL môi trường (không kèm mật khẩu) · có dùng chung không · loại tài khoản test · năng lực QA (gọi API / CSDL)
    └── <module>.md          ← cùng tên thư mục module trong docs/ — business rule ẩn, bẫy khi recon/chạy test, màn hình hay lỗi
```

**Ghi vào đây** thứ học được khi làm việc mà tài liệu `docs/` không có chỗ ghi hoặc dễ bị bỏ qua: vì sao một bước phải làm theo cách đó, dữ liệu nào không được đụng, lỗi môi trường hay gặp.

**Không ghi** lại REQ, TC, kết quả chạy — những thứ đó đã nằm trong `docs/`. Chỉ dẫn link tới file `docs/` liên quan.

Chuyển dự án mới: xoá cả thư mục `systems/<hệ-thống>/` của dự án cũ.
