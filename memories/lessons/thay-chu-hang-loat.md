# Thay chữ hàng loạt dễ đụng dữ liệu thật của hệ thống

- **Loại:** Bài học
- **Ngày:** 03-11-2026
- **Nguồn:** lượt đổi "Anh Tester" → "Team QA Chí Doanh"

Lượt thay đầu tiên dùng regex có loại trừ (`Demo`, `Example`, `Admin …`) vẫn đổi nhầm 4 chỗ là chữ hiển thị của hệ thống đang test (`HKD Anh Tester`, `logo Anh Tester`, `Book — Anh Tester`) — phải hoàn tác.

**Vì sao:** cùng một chuỗi vừa là tên tác giả vừa là chữ trên giao diện / tên hệ thống; regex không phân biệt được ngữ cảnh.

**Áp dụng thế nào:**
1. Trước khi thay: liệt kê **ngữ cảnh** mọi chỗ khớp, chia hai loại *tác giả/thương hiệu* và *dữ liệu hệ thống*.
2. Sau khi thay: đọc `git diff` các file test case, requirements, fixture — chỗ nào nằm trong Expected Result, tiêu đề trang, payload → hoàn tác.
3. Chạy lại test của script bị đụng (VD `python scripts/design-compare/tests/run_tests.py`).
