# Danh mục So thiết kế Figma — AnhTester Book Management (`BK`)

> Điểm vào của nhánh `docs/design-reviews/_book-api/`. Mọi lần chạy `/compare-ui-from-figma-design` cho hệ thống `BK` đọc file này trước để lấy **mã DIFF kế tiếp** của module. Mã DIFF đếm **theo module**, dùng chung mọi nền tảng: `DIFF-BK-<MODULE>-<nn>`.
>
> Hệ thống mặc định (CRM) dùng danh mục riêng ở `docs/design-reviews/README.md` (chưa có lần chạy nào).

| Module | Nền tảng | Figma (page) | Lần chạy gần nhất | Khung đã so | DIFF đã dùng | Mã kế tiếp | DIFF mở (H/M/L) | Báo cáo |
|---|---|---|---|---|---|---|---|---|
| `AUTH` | Android | `hEWOqd9cGxTwZoVOJCg7nM` · `AUTH — Xác thực` | 20-10-2026 | 8/8 | `DIFF-BK-AUTH-01` → `15` | `DIFF-BK-AUTH-16` | 1 / 3 / 11 | [run_20261020_135829](auth/mobile/run_20261020_135829/design_compare_report.md) |
| `USER` | Android | `hEWOqd9cGxTwZoVOJCg7nM` · `USER — Người dùng` | 20-10-2026 | 9/9 | `DIFF-BK-USER-01` → `11` | `DIFF-BK-USER-12` | 1 / 4 / 6 | [run_20261020_150000](user/mobile/run_20261020_150000/design_compare_report.md) |
| `BOOK` | Android | `hEWOqd9cGxTwZoVOJCg7nM` · `BOOK — Sách` | 20-10-2026 | 9/9 | `DIFF-BK-BOOK-01` → `11` | `DIFF-BK-BOOK-12` | 1 / 4 / 6 | [run_20261020_150000](book/mobile/run_20261020_150000/design_compare_report.md) |

## Nhật ký

| Ngày | Lần chạy | Ghi chú |
|---|---|---|
| 20-10-2026 | `auth/mobile/run_20261020_135829` | Lượt chạy đầu tiên của workflow (kiểm chứng mode MOBILE). 14 DIFF: 13 `Design` (wireframe chưa theo kịp app) · 1 `Cần PO quyết` (Dashboard có thẻ Promotion + khối *Test message server* ngoài thiết kế). A-07, A-08 chưa so |
| 20-10-2026 | `auth/mobile/run_20261020_135829` (bổ sung) | So nốt A-07 My Profile, A-08 Setting account và toast A-05 → 8/8 khung. Thêm `DIFF-BK-AUTH-15` (nút *Reset* xám khi form chưa sửa) |
| 20-10-2026 | `user/mobile/run_20261020_150000` | 9/9 khung. 11 DIFF: **5 `Dev`** (cột Phone / nút *Add filter* / *No Data* khuất ngoài mép phải · lỗi validation dính từ *Add user* sang *Update user* · dòng định dạng ảnh thiếu dấu phân cách) · 5 `Design` · 1 `Cần PO quyết` (khách thấy *New user* và menu ⋮) |
| 20-10-2026 | `book/mobile/run_20261020_150000` | 9/9 khung. 11 DIFF: **4 `Dev`** (breadcrumb *Modify book* sai · hộp xoá thiếu tên sách · bảng khuyến mãi tràn ngang · bộ lọc giá báo *Price not specified*) · 5 `Design` · 2 `Cần PO quyết`. Ảnh Figma B-08, B-09 **dựng lại từ JSON** (hết lượt gọi Figma MCP gói Starter) |

## Thành phần dùng chung — DIFF ghi một lần

Lệch nằm ở thành phần lặp lại trên nhiều module (header, bottom nav, ô nhập, nút hộp thoại, bảng) chỉ cấp mã **ở module phát hiện đầu tiên**; báo cáo module khác dẫn chiếu mã đó (rule `design_compare_rules.md` mục 6).

| Thành phần | Mã DIFF | Gặp ở |
|---|---|---|
| Placeholder ô nhập đậm hơn | `DIFF-BK-AUTH-02` | AUTH · USER · BOOK |
| Fieldset Address / textarea thấp hơn | `DIFF-BK-AUTH-07` | AUTH (A-03, A-07) · USER |
| Avatar header là ảnh thay vì chữ cái | `DIFF-BK-AUTH-10` | mọi trang đã đăng nhập |
| Bottom nav — tab đang chọn, chiều cao | `DIFF-BK-AUTH-11` · `12` | mọi trang |
| Nút *Reset* xám khi form chưa sửa | `DIFF-BK-AUTH-15` | AUTH (A-07) · BOOK (B-06, B-08) |
| Tiêu đề trang + nút tạo mới (*New user* / *New book*) | `DIFF-BK-USER-01` | USER · BOOK |
| Dòng định dạng ảnh cho phép | `DIFF-BK-USER-08` | USER · AUTH (A-07) |
| Nút chân hộp thoại | `DIFF-BK-USER-09` | USER · BOOK (B-09) |
| Bảng rộng hơn màn hình, cột khuất mép phải | `DIFF-BK-USER-02` · `05` · `11` · `DIFF-BK-BOOK-07` | USER · BOOK — **cùng gốc**, Dev nên sửa một lần |
