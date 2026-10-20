# Báo Cáo Review Test Cases — `BOOK` · Mobile (Android) · lượt bổ sung 20-10-2026

## Tổng quan
- **Nguồn:** [../mobile/parts/part_01_mobile_danh_sach.md](../mobile/parts/part_01_mobile_danh_sach.md) · [../mobile/parts/part_02_mobile_tao_sua_xoa.md](../mobile/parts/part_02_mobile_tao_sua_xoa.md) — chỉ các TC sinh ngày 20-10-2026: `BK_BOOK_TC_181` → `190`
- **Requirements đối chiếu:** [REQUIREMENTS_BOOK_SUMMARY.md](../../../../requirements/_book-api/book/REQUIREMENTS_BOOK_SUMMARY.md) mục 3.1 · 3.2 · [mobile/requirements_book_mobile.md](../../../../requirements/_book-api/book/mobile/requirements_book_mobile.md)
- **Mode:** REVIEW + sửa lỗi nhỏ, rõ ràng (user cho phép trong yêu cầu) — mốc git trước khi sửa `10d27c5`
- **Số TC review:** 10
- **Kết quả (trước khi sửa):** 🟢 10 tốt | 🟡 0 | 🔴 0 — 1 TC có lỗi diễn đạt nhỏ đã sửa
- **Điểm trung bình:** 11,8/12 (trước) → 11,9/12 (sau)
- **Loại trừ theo requirements:** REQ-BK-BOOK-39 · 40 · 46 · 47 · 52 (bị chặn bởi REQ-147) · 08 · 19 · 43 · 35 · 36 (không áp dụng trên app) · tạo / sửa khuyến mãi (module `PROMO`)

## Chi tiết từng TC

| TC ID | Điểm | Xếp loại | Vấn đề chính | Đề xuất sửa → đã làm |
|---|---|---|---|---|
| BK_BOOK_TC_181 | 12/12 | 🟢 | — | — |
| BK_BOOK_TC_182 | 12/12 | 🟢 | — | — |
| BK_BOOK_TC_183 | 12/12 | 🟢 | Expected *"không tăng từ trên xuống"* đo được bằng mắt, không gắn số tiền cụ thể — đúng | — |
| BK_BOOK_TC_184 | 11/12 → 12/12 | 🟢 | Tiêu chí 1: bước 1 *"gõ chuỗi theo biến thể bằng bàn phím"* nhưng biến thể `b` lại là *"Xoá ô tìm kiếm"* — bước không khớp biến thể | ✅ Bước 1 tách thành 2 gạch đầu dòng `a` (tìm `SM-A`) · `b` (ô trống, cuộn tới thẻ > 7 ngày) · Test Data `b` ghi rõ *"chỉ đọc"* |
| BK_BOOK_TC_185 | 12/12 | 🟢 | Đếm `<N>` nằm dưới `🔧` + `@TechCheck` | — |
| BK_BOOK_TC_186 | 12/12 | 🟢 | — | — |
| BK_BOOK_TC_187 | 11/12 | 🟢 | Tiêu chí 2: Expected bước 5 chấp nhận **hai** kết quả (lưu thành công **hoặc** lỗi có chữ) — đúng với rule có điều kiện của REQ-155, phần chấm cốt lõi vẫn một (*"thông báo có chữ, tên trên thẻ khớp thông báo"*) | Giữ — không sửa. Khi REQ-46 khai Android, tách kịch bản *"lưu thành công"* thành TC riêng |
| BK_BOOK_TC_188 | 12/12 | 🟢 | Bước 3 bắt đối chiếu `Book name` trước khi xoá — chặn đúng rủi ro REQ-48 | — |
| BK_BOOK_TC_189 | 12/12 | 🟢 | — | — |
| BK_BOOK_TC_190 | 12/12 | 🟢 | Ghi chú ⚠️ bàn phím phải đóng — đúng bẫy REQ-128 | — |

## Đối soát loại kiểm thử (4 vòng) — phần các TC mới đóng góp

| Vòng | Nhánh | Trạng thái | Ghi chú |
|---|---|---|---|
| 1 | UI cơ bản · Display | ✅ | TC_181 (màn hình khách) · 185 (khối Promotion) |
| 1 | Save · Verify data | ✅ | TC_187 (`@KnownBug`) · 188 — kiểm lại bằng tìm theo tên + 🔧 API |
| 2 | EP | ✅ | TC_184 (≤ 7 ngày / > 7 ngày) |
| 2 | BVA | ⏭️ | Mốc đúng 7 ngày — cần sách tạo cách đây đúng 7 ngày, API không cho đặt `createdAt`. Rà lại khi có dữ liệu cố định |
| 2 | Business Rule | ✅ | TC_183 (sắp giảm dần) · 185 (chỉ khuyến mãi còn hiệu lực) · 186 (lượt xem +1) |
| 2 | State Transition | ✅ | AVAILABLE → đã xoá TC_188 |
| 2 | Save / Edit / Delete | ✅ | TC_187 · 188 |
| 2 | Error Guessing | ✅ | TC_190 (Back giữa chừng) |
| 3 | Permission | ✅ | Cột *Khách* của ma trận Android: TC_181 · 182 — ma trận đủ 8/8 ô |
| 3 | Security | ✅ | TC_182 |
| 4 | Vòng đời app | ✅ | TC_189 |
| 4 | Bàn phím (form sách) | ✅ | Đã đo cùng ngày → `REQ-BK-BOOK-158` · `BK_BOOK_TC_191` |

Đối soát bảng 15 loại field: ➖ — 10 TC không thêm ô nhập mới (form Create đã đối soát ở báo cáo bộ TC gốc).

## Coverage Gaps (TC còn thiếu)

| # | Kịch bản thiếu | Vòng / Nhánh | Priority đề xuất |
|---|---|---|---|
| 1 | Bàn phím mở ở ô `Regular price` / `Categories` không che ô và nút `Create book` | V4 · Bàn phím | ✅ **Đã đóng** cùng ngày — `REQ-BK-BOOK-158` · `BK_BOOK_TC_191` |

## TC trùng lặp — đề xuất merge

Không có. TC_188 (xoá thật) và TC_146 (huỷ xoá) khác kết quả kiểm — giữ cả hai.

## Kết luận & Khuyến nghị

- 10/10 TC 🟢; sửa diễn đạt bước 1 của TC_184
- Gap #1 (bàn phím form sách) đã đóng: `REQ-BK-BOOK-158` · `BK_BOOK_TC_191`
- Khi Dev sửa REQ-147 / 155: khai Android cho REQ-39 · 40 · 46 · 47 · 52, tách kịch bản lưu thành công khỏi TC_187
