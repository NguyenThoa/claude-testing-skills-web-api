# Báo Cáo Review Test Cases — `USER` · Mobile (Android) · lượt bổ sung 20-10-2026

## Tổng quan
- **Nguồn:** `mobile/test_cases_user_mobile.md` lúc review — nay tách thành [../mobile/parts/](../mobile/parts/part_02_mobile_them_sua_xoa.md) (TC ID giữ nguyên) — chỉ các TC sinh ngày 20-10-2026: `BK_USER_TC_150` → `154` (sau khi sửa: thêm `155`)
- **Requirements đối chiếu:** [REQUIREMENTS_USER_SUMMARY.md](../../../../requirements/_book-api/user/REQUIREMENTS_USER_SUMMARY.md) mục 3.1 · 3.2 · [mobile/requirements_user_mobile.md](../../../../requirements/_book-api/user/mobile/requirements_user_mobile.md)
- **Mode:** REVIEW + sửa lỗi nhỏ, rõ ràng (user cho phép trong yêu cầu) — mốc git trước khi sửa `10d27c5`
- **Số TC review:** 5 (lúc bắt đầu) → 6 (sau khi tách)
- **Kết quả (trước khi sửa):** 🟢 4 tốt | 🟡 1 cần sửa | 🔴 0 — **sau khi sửa:** 🟢 6
- **Điểm trung bình:** 11,6/12 (trước) → 12/12 (sau)
- **Loại trừ theo requirements:** REQ-BK-USER-32 · 33 · 34 · 35 (chưa khai Android — cần nhập mật khẩu) · 37 · 38 · 39 · 40 (bị chặn bởi REQ-129) · tải ảnh đại diện (`AMB-BK-USER-05`)

## Chi tiết từng TC

| TC ID | Điểm | Xếp loại | Vấn đề chính | Đề xuất sửa → đã làm |
|---|---|---|---|---|
| BK_USER_TC_150 | 12/12 | 🟢 | — | — |
| BK_USER_TC_151 | 12/12 | 🟢 | Phần đọc cây phần tử nằm đúng dưới `🔧` + `@TechCheck` | — |
| BK_USER_TC_152 | 10/12 → 12/12 | 🟡 → 🟢 | Tiêu chí 6: Bảng biến thể gộp `a` sửa **Name** và `b` tắt **`Active for login`** — **khác trường**, khác kết quả kiểm (Name mới vs nhãn `Inactive`) → vi phạm bảng CẤM gộp. Tiêu chí 1: bước 3 *"Thay đổi theo biến thể"* buộc người chạy tra Test Data mới biết làm gì | ✅ Giữ `152` cho kịch bản sửa Name (bước 3 ghi thẳng *"Sửa ô `Name` theo Test Data"*) · biến thể `b` tách thành **`BK_USER_TC_155`** (số mới nối tiếp dải) với Steps / Expected riêng: công tắc xám · `Inactive` đỏ · `@KnownBug` |
| BK_USER_TC_153 | 12/12 | 🟢 | Pre-Condition *"chạy sau TC_152"* là thứ tự để không xoá mất dữ liệu của TC sửa — Expected không phụ thuộc kết quả TC trước (dùng *"Name hiện tại của U-M3"*) → không trừ tiêu chí 3 | Cập nhật Pre-Condition thành *"sau TC_152 · 155"* |
| BK_USER_TC_154 | 12/12 | 🟢 | — | — |
| BK_USER_TC_155 | 12/12 | 🟢 | TC mới tách từ `152` | — |

## Đối soát loại kiểm thử (4 vòng) — phần các TC mới đóng góp

| Vòng | Nhánh | Trạng thái | Ghi chú |
|---|---|---|---|
| 1 | UI cơ bản · Display | ✅ | TC_150 (màn hình khách) |
| 1 | Save · Verify data | ✅ | TC_152 · 155 (`@KnownBug`) · 153 — kiểm lại bằng tìm theo email + 🔧 API công khai |
| 1 | Input valid data (tạo mới) | ⏭️ | Loại trừ — REQ-34 chưa khai Android |
| 2 | State Transition | ✅ | Active → Inactive TC_155 · Active → đã xoá TC_153 · Inactive → Active ⏭️ REQ-40 bị chặn |
| 2 | Save / Edit / Delete | ✅ | TC_152 · 155 · 153 |
| 2 | Required · Validation · EP · BVA | ➖ | Các TC mới không có ô nhập mới — validation Add user đã phủ ở TC_134 → 140 |
| 3 | Permission | ✅ | Cột *Khách* của ma trận Android: TC_150 · 151 — ma trận đủ 7/7 ô |
| 3 | Security | ✅ | TC_151 (khách không có thao tác ghi) |
| 4 | Responsive (xoay) | ✅ | TC_154 |
| 4 | E2E | ⏭️ | Khoá → không đăng nhập được: cần REQ-129 sửa xong |

Đối soát bảng 15 loại field: ➖ — 6 TC không thêm ô nhập nào ngoài `Name` (đã đối soát ở báo cáo bộ TC gốc).

## Coverage Gaps (TC còn thiếu)

| # | Kịch bản thiếu | Vòng / Nhánh | Priority đề xuất |
|---|---|---|---|
| 1 | Xoay ngang khi **đang mở** hộp `Add user` có dữ liệu — dữ liệu còn không, nút `Save` còn bấm được không | V4 · Responsive | ✅ **Đã đóng** cùng ngày — recon → `REQ-BK-USER-131` → `BK_USER_TC_156` |

## TC trùng lặp — đề xuất merge

Không có. TC_153 (xoá thật) và TC_117 (huỷ xoá) khác kết quả kiểm — giữ cả hai.

## Kết luận & Khuyến nghị

- 6/6 TC 🟢 sau khi tách `152` → `152` + `155`; số biến thể Mobile giữ nguyên 64
- Gap #1 (xoay khi đang mở hộp thoại) đã đóng: `REQ-BK-USER-131` · `BK_USER_TC_156`
- Khi Dev sửa REQ-129: bỏ `@KnownBug` ở TC_152 · 155, khai Android cho REQ-37 → 40 và sinh TC khoá / mở khoá → đăng nhập
