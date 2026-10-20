# Đặc tả Yêu cầu — Module Sách (`BOOK`) · Nền tảng Mobile

> Index module (metadata dải mã · REQ dùng chung · phân quyền · Story · AMB/RISK · Nhật ký): [../REQUIREMENTS_BOOK_SUMMARY.md](../REQUIREMENTS_BOOK_SUMMARY.md) · Danh mục hệ thống: [../../README.md](../../README.md) · Bản đồ app: [../../_discovery/modules/module_03_sach_danh_muc.md](../../_discovery/modules/module_03_sach_danh_muc.md)

| Mục | Giá trị |
|---|---|
| **Hệ thống** | AnhTester Book Management (mã hệ thống `BK`) |
| **Module** | Sách — tab `Book` (Book Management): danh sách · sắp xếp · tab danh mục · Filter · form Create a new book · Modify book · trang chi tiết · Confirm delete |
| **Nền tảng** | **Android** 🟨 (đọc · validation · khách · xoá ✅ — tạo ❌ (REQ-147) · lưu thay đổi ❌ (REQ-155)) · iOS ❔ chưa khảo sát (máy Windows) |
| **Thiết bị khảo sát** | Emulator `Pixel_10_Pro_XL_API_37` · Android 17 · màn hình `1344×2992` · hướng **dọc** (trừ REQ-152) · locale `en-US` · app `book.anhtester.com` `1.0 (versionCode 1)` bản **debug** · `UiAutomator2` qua Appium MCP · loại app **Hybrid (Capacitor)** — WebView `153.0.8010.36`, khảo sát bằng cây `NATIVE_APP` |
| **Tầng network** | ❌ Không quan sát được — chưa dựng proxy, WebView không bật gỡ lỗi. Rule phía server lấy từ web và [api/requirements_book_api.md](../api/requirements_book_api.md) |
| **Phương pháp** | Thao tác thật trên app ngày 26-09-2026 và 20-10-2026 — đọc thuộc tính phần tử, nhập thử (ô số nhập bằng bàn phím `adb shell input text`), chọn ảnh qua trình chọn ảnh hệ thống, tắt mạng bằng `adb shell svc wifi/data disable`, xoay bằng `settings put system user_rotation`, đưa app xuống nền bằng `appium_app_lifecycle background`, quay màn hình / chụp liên tục để đọc thông báo nổi. Kết quả ghi dữ liệu đối chiếu bằng **đọc công khai** `GET /api/book?search=` · `GET /api/book/<id>` · `GET /api/promotion-book` (không token) |
| **Tài khoản** | 26-09: tài khoản test do tester đăng nhập — user cho phép tạo/sửa/xoá sách test `Auto Mobile Book <timestamp>`; form sửa chỉ mở trên sách test còn sót, **không** lưu · 20-10: **khách** (app đang chưa đăng nhập) rồi tài khoản test do tester đăng nhập; tạo thử lại sách test, sửa thử rồi **xoá** sách test còn sót `Auto BKAPI NoPrice <timestamp>`. Mục 10 |
| **REQ trong file này** | **12** — `REQ-BK-BOOK-147` → `158` (chỉ áp Android). Cộng 39 REQ web kiểm khớp trên Android, chuyển lên [index mục 3.2](../REQUIREMENTS_BOOK_SUMMARY.md#32-dùng-chung-android--web) (`Android · Web`) và `REQ-01` · `42` · `51` mở rộng thành `Android · Web · API` |

> **Thang `Nguồn`:** `Kiểm chứng thực tế` = đã thao tác trên app và xác nhận bằng ảnh (danh mục mục 9) hoặc số liệu thuộc tính ghi trong AC. Mọi AC chỉ đúng với **thiết bị + hướng màn hình** ở bảng trên.

---

## 2. Bản đồ phủ tài liệu

Không có tài liệu nào cho app — toàn bộ REQ sinh từ khảo sát thực tế. 48 REQ web (`02 → 50` trừ `42`) và 4 REQ index 3.1 được **đối chiếu** trên app:

| Kết quả | REQ | Ghi chú |
|---|---|---|
| ✅ Khớp → chuyển lên index mục 3.2 (`Android · Web`) | `02` · `04 → 06` · `09 → 18` · `21 → 34` · `38` · `41` · `44` · `45` · `48` · `49` (34 — 26-09-2026) · `03` · `07` · `20` · `37` · `50` (5 — 20-10-2026) | `17` · `48` kỳ vọng — cả hai nền tảng chưa đạt; `34` biên 24/25 và `03` vế > 7 ngày kiểm chứng **lần đầu** trên Android |
| ✅ Khớp → mở rộng tại index 3.1 | `51` → `Android · Web · API` (26-09) · `01` · `42` → `Android · Web · API` (20-10) | Thẻ đầu giá âm · khách xem được · lượt xem tăng đúng 1 |
| ❌ Android chạy khác → REQ riêng ở file này | `39` → `REQ-147` · `08` (URL) → `REQ-149` · `36` → `REQ-150` · `46` → `REQ-155` | Tạo sách thất bại — `AMB-BK-BOOK-34` · lưu thay đổi thất bại, thông báo rỗng — `AMB-BK-BOOK-38` |
| ⛔ **Bị chặn** bởi REQ-147 — giữ ở `web/` / index 3.1 | `39` · `40` · `46` · `47` · `52` | Cần sách do phiên tạo trên Android — tạo vẫn lỗi 20-10-2026 (2/2) |
| ➖ Không áp dụng | `08` · `19` · `43` (dựa vào URL) · `35` (trình chọn ảnh hệ thống chỉ liệt kê ảnh — không chọn được tệp `.txt`) | App không có thanh địa chỉ |

---

## 3. Yêu cầu Chức năng

> ↗️ 34 REQ dùng chung `Android · Web` ở [index mục 3.2](../REQUIREMENTS_BOOK_SUMMARY.md#32-dùng-chung-android--web) — AC Android nằm ở đó.

### 3.1. Danh sách (STORY-BK-BOOK-01)

| REQ ID | Tên yêu cầu | Nền tảng | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|---|
| REQ-BK-BOOK-149 | Kiểu sắp xếp trở về Feature khi rời tab Book rồi quay lại | Android | Thay REQ-08 (URL) — app không có thanh địa chỉ | Chọn `Price: Low to High` → sang tab `Dashboard` → quay lại tab `Book` → nút `Sort By: Feature` | 🟢 | — | Kiểm chứng thực tế · đọc `text` nút Sort By |
| REQ-BK-BOOK-151 | Mất mạng: danh sách hiện No Data, không báo lỗi mạng | Android | Mất mạng — hành vi quan sát (`AMB-BK-BOOK-36` ✅ chấp nhận hiện trạng) | (1) Tắt Wi-Fi + dữ liệu · xác nhận `ping` thất bại → (2) mở tab `Book` → chỉ còn tab `All`, vùng thẻ `No Data`, **không** có thông báo lỗi mạng. Bật mạng lại, mở lại tab → danh sách trở lại. **Không** assert nội dung thông báo lỗi mạng | 🟢 | — | Kiểm chứng thực tế · `android_book_list_offline.png` |
| REQ-BK-BOOK-152 | Xoay ngang: lưới nhiều cột, hàng tab có nút cuộn | Android | Xoay màn hình | Xoay `LANDSCAPE` (ảnh `2992×1344`) → thẻ sách xếp **4 cột** · hàng tab danh mục hiện nhiều tab hơn kèm nút mũi tên `>` trước icon ⚙ · `New book` · `Filter` · `Sort By` vẫn hiển thị. Quay lại dọc → 1 cột | 🟢 | — | Kiểm chứng thực tế · `android_book_list_landscape.png` |

### 3.2. Danh mục & bộ lọc (STORY-BK-BOOK-02)

| REQ ID | Tên yêu cầu | Nền tảng | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|---|
| REQ-BK-BOOK-153 | Chỉ nhập Price from thì dòng mô tả ghi cận dưới | Android | Bổ sung REQ-18. Web chưa kiểm | `Filter` → chọn `Price from` = `10.000`, `Price to` trống → dòng mô tả `Price greater than or equal to 10.000 ₫` | 🟢 | — | Kiểm chứng thực tế · đọc `text` dòng mô tả |

### 3.3. Tạo sách (STORY-BK-BOOK-04)

| REQ ID | Tên yêu cầu | Nền tảng | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|---|
| REQ-BK-BOOK-147 | Tạo sách thành công trên Android | Android | Kỳ vọng — hiện **chưa đạt** (`AMB-BK-BOOK-34` ✅ chốt là lỗi). Cùng hành vi web REQ-39 | Book name `Auto Mobile Book <timestamp>` · 1 ảnh PNG · giá `50000` · danh mục `Technology` → `Create book` → thông báo `Book created successfully.` · về danh sách · sách mới đầu `Newest`. **Hiện tại:** một thông báo đang tải hiện < 1 giây rồi mất (26-09: `Uploading image...` · 20-10: `Uploading book...`) · **không** có thông báo thành công/lỗi · vẫn ở form, dữ liệu còn nguyên · đọc công khai `GET /api/book?search=<tên>` → 0 bản ghi. Tái hiện **4/4** (26-09 2/2 · 20-10 2/2). Không assert câu của thông báo đang tải | 🟢 | 20-10-2026 · thử lại | Kiểm chứng thực tế — ❌ lệch · `android_book_create_uploading_no_result.png` (26-09) · `android_book_create_uploading_book_no_result.png` (20-10) · đọc lại API công khai |
| REQ-BK-BOOK-150 | Chọn ảnh bìa qua trình chọn ảnh của hệ thống | Android | Thay REQ-35 · 36 (chọn tệp) trên app | Bấm vùng `Drop or select a files` → trình chọn ảnh của hệ thống mở (cho chọn nhiều, cần bấm `Done`) → quay lại form: dưới vùng chọn có **1 ô ảnh** kèm nút × · nút `Remove all` · lỗi `You must upload at least 1 file` mất. **Không** assert nội dung ô ảnh — cùng bản build, 26-09 hiện biểu tượng ảnh chung, 20-10 hiện ảnh thu nhỏ của ảnh đã chọn. Chuỗi của trình chọn ảnh do hệ điều hành sinh — **cấm** dùng làm assertion | 🟢 | 20-10-2026 · sửa AC | Kiểm chứng thực tế · `android_book_create_filled_part1.png` (26-09) · `android_book_create_filled_thumbnail.png` (20-10) |
| REQ-BK-BOOK-156 | Dữ liệu form Create book giữ nguyên khi app xuống nền | Android | Vòng đời app | Điền Book name · 1 ảnh · giá `50000` · danh mục `Technology` → đưa app xuống nền 5 giây → mở lại → vẫn ở `Create a new book` · Book name · Slug · ô ảnh · `50.000 VNĐ` · chip `Technology` còn nguyên | 🟢 | — | Kiểm chứng thực tế (20-10-2026) · đọc `text` các ô sau khi quay lại |
| REQ-BK-BOOK-157 | Back hệ thống ở Create a new book quay về danh sách, không hỏi xác nhận | Android | Nút Back (`AMB-BK-BOOK-39` ✅ chấp nhận hiện trạng) | Form đang có dữ liệu (bàn phím đóng) → nút Back hệ thống → về `Book Management` **ngay**, **không** có hộp hỏi xác nhận · không tạo sách (API công khai 0 bản ghi) · mở lại `New book` → form trống | 🟢 | — | Kiểm chứng thực tế (20-10-2026) · đọc cây phần tử sau Back · đọc lại API công khai |
| REQ-BK-BOOK-158 | Bàn phím ở form Create a new book không che ô đang nhập; ô giá dùng bàn phím số | Android | Bàn phím (đo với bàn phím ảo **neo đáy** — Gboard, `show_ime_with_hard_keyboard=1`) | (1) Chạm `Book name` → bàn phím chữ mở (mép trên `y 1825` / `2992`), ô nằm trên bàn phím · (2) cuộn tới `Regular price` (ô đang ở dưới mép bàn phím) → chạm → trang **tự cuộn**, ô hiện trọn phía trên bàn phím · bàn phím chuyển sang **bàn phím số** (`0–9` · `,` · `.` · `−`) · (3) chạm `Categories` → bàn phím chữ, ô trên bàn phím, danh sách gợi ý danh mục mở · (4) khi bàn phím mở, **thanh điều hướng đáy** (`Dashboard` … `File`) nổi ngay trên bàn phím; danh sách gợi ý đang mở **che** nút `Create book` → đóng bàn phím (nút ⌄) → `Create book` · `Reset` hiện lại ở đáy form | 🟢 | — | Kiểm chứng thực tế (20-10-2026) · `android_book_create_keyboard_price.png` · `android_book_create_keyboard_categories.png` · `dumpsys input_method` (`mInputShown=true`, `visibleTopInsets=1825`) |

### 3.4. Sửa sách (STORY-BK-BOOK-06)

| REQ ID | Tên yêu cầu | Nền tảng | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|---|
| REQ-BK-BOOK-148 | Tab Book đang ở Modify book quay về danh sách | Android | Kỳ vọng — hiện **chưa đạt** (cùng lỗi điều hướng `AMB-BK-12` ✅) | Đứng ở `Modify book` → bấm tab `Book` ở bottom navigation → phải hiển thị `Book Management`. **Hiện tại:** vẫn ở `Modify book`; breadcrumb `Book management` đưa về được | 🟢 | — | Kiểm chứng thực tế — ❌ lệch · `android_book_modify_tab_book_stays.png` |
| REQ-BK-BOOK-154 | Breadcrumb Modify book ghi đúng tên màn hình | Android | Kỳ vọng — hiện **chưa đạt** (`AMB-BK-BOOK-37` ✅ chốt là lỗi). Web chưa kiểm | Nút bút trên thẻ → tiêu đề `Modify book` · breadcrumb `Book management / Modify book`. **Hiện tại:** breadcrumb `Book management / Create a new book` | 🟢 | — | Kiểm chứng thực tế — ❌ lệch · `android_book_modify_default_part1.png` |
| REQ-BK-BOOK-155 | Lưu thay đổi thất bại thì báo lỗi có nội dung | Android | Kỳ vọng — hiện **chưa đạt** (`AMB-BK-BOOK-38` ✅ chốt là lỗi) | `Modify book` → sửa Book name → `Save changes` mà server **không** lưu → thông báo nổi có **chữ** mô tả lỗi, form giữ dữ liệu vừa sửa. **Hiện tại** (sách test còn sót, tác giả đã bị xoá): thông báo nổi chỉ có biểu tượng `!` đỏ và nút ×, **không có chữ** · tên không đổi (đọc lại API công khai) · tái hiện **2/2**. Lưu thành công trên Android (REQ-46) chưa kiểm — cần sách do phiên tạo | 🟢 | — | Kiểm chứng thực tế (20-10-2026) — ❌ lệch · `android_book_modify_save_error_empty.png` (chụp liên tục 14 khung) |

**Tổng trong file: 11 REQ** — Danh sách 3 (`149` · `151` · `152`) · Lọc 1 (`153`) · Tạo 5 (`147` · `150` · `156` · `157` · `158`) · Sửa 3 (`148` · `154` · `155`) → `3 + 1 + 5 + 3 = 12 ✔`

---

## 4. Đặc tả Trường Dữ liệu (Field Spec)

| Màn hình | Field (Label) | Loại UI (class) | Required | Ràng buộc quan sát được | REQ liên quan | Ghi chú |
|---|---|---|---|---|---|---|
| Danh sách | Sort By | `Button` `text` `Sort By: <kiểu>` → `MenuItem` | — | 4 kiểu, mặc định `Feature` | 04 → 06 · 149 | |
| Danh sách | Tab danh mục | `android.view.View` `text` `<tên> <số>` · `selected` | — | Mặc định `All` | 10 · 11 | ⚙ id `setting-category` |
| Danh sách | Thẻ sách | ảnh id `img-book-<id>` (`content-desc` = slug, hoặc `New` khi có nhãn) · tên id `book-<id>` (`content-desc` = tên) · nút bút `Button` không nhãn · bộ đếm lượt xem `TextView` | — | — | 02 · 03 · 21 · 42 | id ổn định theo sách |
| Filter | Search book · Price from · Price to | `EditText` | — | Giá có 4 gợi ý | 12 → 18 · 153 | |
| Create / Modify | Book name · Description | `EditText` | Book name ✅ | — | 22 · 24 · 45 | `resource-id` tự sinh |
| Create / Modify | Slug name book | `EditText` `enabled=false` + ô tick `Change` (`Button`) | ✅ | Tự sinh từ tên | 24 · 25 · 45 | |
| Create / Modify | Picture | Vùng chọn tệp → trình chọn ảnh hệ thống | ✅ | Ít nhất 1 ảnh | 26 · 150 | |
| Create / Modify | Regular price | `EditText` (ô số) + hậu tố `VNĐ` | ✅ | 1.000 → 100.000.000.000 · nhận số lẻ | 27 · 29 → 31 | **Không** nhận `setValue` — nhập bằng bàn phím |
| Create / Modify | Categories | `EditText` + chip `Button` (`text` = `<số> <tên>` với danh mục có sẵn, `<tên>` với chip tự gõ) | ✅ | Chip tự gõ ≤ 24 ký tự | 28 · 32 → 34 | |
| Create / Modify | Available book | `android.widget.Switch` | — | Hiển thị bật mặc định | 38 | `checked` luôn `false` |
| Create / Modify | Reset · Create book / Save changes · Delete | `Button` | — | Khoá khi chưa sửa | 23 · 44 | |
| Confirm delete | Cancel · Delete | `Button` id `dialog-delete-cancel` · `dialog-delete-action` | — | — | 48 · 49 | id ổn định |

---

## 5. Validation Messages (nguyên văn trên app)

| REQ | Điều kiện | Thông báo | Vị trí |
|---|---|---|---|
| 26 | Không có ảnh | `You must upload at least 1 file` | Dưới vùng ảnh |
| 27 | Giá trống | `Price is required.` | Dưới ô |
| 28 | Không danh mục | `Please select at least one category` | Dưới ô |
| 29 | Giá < 1.000 | `Price must be greater than 1000 VNĐ.` | Dưới ô |
| 30 | Giá > 100.000.000.000 | `Price must be less than 1 billion VNĐ.` | Dưới ô |
| 31 | Giá hợp lệ | `<số định dạng> VNĐ` (VD `1.500,5 VNĐ`) | Dưới ô |
| 34 | Chip tự gõ ≥ 25 ký tự | `Each category name must be less than 25 characters` | Dưới ô |
| 147 | Create book | `Uploading image...` (26-09) / `Uploading book...` (20-10) rồi **không** có gì | Thông báo nổi — lệch web |
| 155 | Save changes thất bại | Biểu tượng `!` đỏ, **không có chữ** | Thông báo nổi — lệch kỳ vọng |
| 50 | Delete thành công | `Deleted successfully.` (biểu tượng `!` đỏ — `AMB-BK-BOOK-40`) | Thông báo nổi |
| 48 | Delete | `Confirm delete` / `Do you want delete <tên>, after delete you can't undo` | Hộp thoại — `<tên>` sai (REQ-48) |
| 18 · 153 | Mô tả khoảng giá | `Price not specified` · `Price greater than or equal to 10.000 ₫` · `Price between 10.000 ₫ and 100.000 ₫` | Dưới ô giá |

---

## 6. Yêu cầu riêng của mobile (skill 3.5.3)

| Nhóm | Kết quả | REQ / AMB |
|---|---|---|
| Quyền runtime | **Không áp dụng** — chọn ảnh qua trình chọn ảnh hệ thống (Photo Picker) không cần quyền đọc bộ nhớ; không có hộp thoại xin quyền | REQ-150 |
| Vòng đời app | Form `Create a new book` giữ toàn bộ dữ liệu khi xuống nền 5 giây | REQ-156 |
| Mất mạng | `No Data`, không báo lỗi mạng | REQ-151 · `AMB-BK-BOOK-36` |
| Xoay màn hình | Lưới 4 cột, hàng tab có nút cuộn | REQ-152 |
| Bàn phím | Ô đang nhập luôn hiện trên bàn phím (trang tự cuộn) · ô giá dùng bàn phím số · thanh điều hướng nổi trên bàn phím · danh sách gợi ý danh mục che `Create book` cho tới khi đóng bàn phím. Đo ngày 20-10-2026 sau khi bật `show_ime_with_hard_keyboard=1` **và** khởi động lại Gboard (mặc định emulator có bàn phím vật lý → Gboard chỉ hiện bong bóng ≡) | REQ-158 |
| Deep link | **Không áp dụng** — app không khai scheme/host | — |
| Push notification | **Không áp dụng** | — |
| Phiên bản tối thiểu | Ghi ở `AUTH` (`AMB-BK-AUTH-19`) | — |

---

## 7. Luồng người dùng

```
Tab Book ─┬─ Sort By ─► 4 kiểu (về Feature khi rời tab)
          ├─ tab danh mục ─► lọc
          ├─ Filter ─► Search · Price from/to
          ├─ tên thẻ ─► chi tiết ─ Back
          ├─ New book ─► Create a new book ─┬─ Create book ─► "Uploading book..." ─► (không gì — REQ-147)
          │                                 ├─ khối Promotion ─► bảng khuyến mãi còn hiệu lực (REQ-37)
          │                                 └─ Back hệ thống ─► danh sách, không hỏi (REQ-157)
          └─ bút ─► Modify book ─┬─ Save changes ─► "!" không chữ (REQ-155)
                                  ├─ Delete ─► Confirm delete (tên sai — REQ-48) ─┬─ Delete ─► "Deleted successfully." · danh sách
                                  │                                               └─ Cancel
                                  └─ tab Book ─► (đứng yên — REQ-148) · breadcrumb ─► danh sách
Khách ─ tab Book ─► danh sách (không New book, không bút, không ⚙ — REQ-20)
```

---

## 8. Ghi chú kỹ thuật cho automation

| Vấn đề | Chi tiết |
|---|---|
| Ô giá là ô số | `setValue` trả `400` — nhập bằng bàn phím (`mobile: type` / `adb shell input text`) sau khi chạm vào ô |
| Bấm `Create book` đôi khi không có tác dụng | Lần bấm đầu sau khi thêm chip không kích hoạt kiểm tra; lần sau mới có — cùng hiện tượng `RISK-BK-AUTH-08`. Assert theo kết quả, không theo số lần bấm |
| Trình chọn ảnh | `com.google.android.photopicker` — chọn ảnh theo `content-desc` `Photo taken on …` rồi bấm `Done`. Phải đẩy ảnh test vào máy trước (`adb push` + quét media) |
| Thẻ sách | Dùng id `book-<id>` / `img-book-<id>` — ổn định theo sách |
| Danh sách dài | Mỗi thẻ cao ~1.150 px ở máy dọc; đếm thẻ bằng cách gom id khi cuộn |
| Hộp Confirm delete | Không assert tên trong hộp cho tới khi REQ-48 được sửa |
| Ô `Search book` không lọc khi `setValue` | Giống ô tìm người dùng — chạm vào ô rồi gõ bằng bàn phím |
| Thông báo nổi mất trong ~1–2 giây | Chụp liên tục (`screencap` lặp) hoặc quay màn hình ngay khi bấm; `Uploading book...` và thông báo lỗi rỗng rất dễ chụp hụt |
| Kiểm kết quả ghi dữ liệu | Đối chiếu bằng đọc công khai `GET /api/book?search=<tên>` · `GET /api/book/<id>` (404 sau khi xoá) — app không lộ request |
| Dữ liệu cho TC sửa / xoá | Tạo sách bằng **API** ở setup (REQ-147 chặn việc tạo trên app) |
| Bàn phím ảo trên emulator | Emulator mặc định có bàn phím vật lý → Gboard chỉ hiện bong bóng ≡. Trước TC bàn phím: `adb shell settings put secure show_ime_with_hard_keyboard 1` rồi `adb shell am force-stop com.google.android.inputmethod.latin`; trả `0` khi xong |

---

## 9. Danh mục Evidence

Thư mục [`evidence/`](evidence/). **Mọi ảnh đã mở lại xác nhận đúng trạng thái.** Ảnh chỉ có sách công khai và dữ liệu test; không có email người dùng.

| Ảnh | Màn hình | Trạng thái | REQ |
|---|---|---|---|
| `android_book_list_logged_in.png` | Danh sách | Mặc định, đã đăng nhập | 02 · 04 · 10 · 21 |
| `android_book_sort_menu_open.png` | Danh sách | Menu Sort By mở | 05 |
| `android_book_sort_price_low_high.png` | Danh sách | Price: Low to High — thẻ đầu giá âm | 06 · 51 |
| `android_book_category_tab_selected.png` | Danh sách | Tab Test chọn | 11 |
| `android_book_filter_search_uppercase.png` | Filter | Tìm `DORAEMON` | 12 · 14 |
| `android_book_filter_price_range_lost_from.png` | Filter | Khoảng 10.000 – 100.000, thẻ đầu `-1.000 ₫` | 17 · 18 |
| `android_book_create_default_part1.png` · `_part2` · `_part3` | Create a new book | Mặc định (3 phần) | 22 · 38 |
| `android_book_create_missing_required_part2.png` | Create a new book | Thiếu ảnh · giá · danh mục | 26 → 28 |
| `android_book_create_freetext_category_chip.png` | Create a new book | 2 chip tự gõ 24 + 25 ký tự — lỗi độ dài | 33 · 34 |
| `android_book_create_filled_part1.png` | Create a new book | Đã chọn ảnh · giá · Technology | 32 · 150 |
| `android_book_create_uploading_no_result.png` | Create a new book | `Uploading image...` ngay sau khi bấm | 147 |
| `android_book_modify_default_part1.png` · `_part2.png` | Modify book | Điền sẵn, Save changes khoá, breadcrumb sai | 44 · 154 |
| `android_book_delete_confirm.png` | Confirm delete | Tên sai (tên form trước) | 48 |
| `android_book_modify_tab_book_stays.png` | Modify book | Sau khi bấm tab Book — vẫn Modify | 148 |
| `android_book_detail.png` | Chi tiết | NEW · danh mục · tên · giá · Author by trống | 41 |
| `android_book_list_offline.png` | Danh sách | Mất mạng — `No Data` | 151 |
| `android_book_list_landscape.png` | Danh sách | Xoay ngang — 4 cột | 152 |
| `android_book_list_guest.png` | Danh sách (khách) | Không `New book`, không bút, không ⚙ · thẻ `23 Th12 2025` không nhãn New | 01 · 03 · 20 |
| `android_book_card_new_within_7_days.png` | Danh sách | Thẻ sách test tạo `13 Th10 2026` có nhãn `New` | 03 |
| `android_book_create_filled_thumbnail.png` | Create a new book | Đã chọn ảnh (ảnh thu nhỏ) · `50.000 VNĐ` · `Technology` | 150 |
| `android_book_create_uploading_book_no_result.png` | Create a new book | `Uploading book...` ngay sau khi bấm | 147 |
| `android_book_create_promotion_open.png` | Create a new book | Khối Promotion mở — `1–5 of 24` | 37 |
| `android_book_modify_save_error_empty.png` | Modify book | Sau `Save changes` — thông báo `!` không chữ | 155 |
| `android_book_create_keyboard_price.png` | Create a new book | Bàn phím số ở ô giá — ô hiện trọn, thanh điều hướng nổi trên bàn phím | 158 |
| `android_book_create_keyboard_categories.png` | Create a new book | Bàn phím chữ ở ô Categories — danh sách gợi ý mở | 158 |
| `android_book_delete_success_toast.png` | Danh sách | Khung hình chuyển cảnh — `Deleted successfully.` · `No Data` (trích từ video) | 50 |

REQ không có ảnh riêng, truy bằng số liệu thuộc tính trong AC: 07 · 09 · 13 · 15 · 16 · 23 · 24 · 25 · 29 → 31 · 42 · 45 · 49 · 149 · 153 · 156 · 157.

---

## 10. Dữ liệu test — tạo / dọn

| Bản ghi | Tạo bởi | Dùng cho | Dọn |
|---|---|---|---|
| Sách `Auto Mobile Book <timestamp> Tiếng Việt` (26-09) · `Auto Mobile Book <timestamp>` (20-10) | Create book trên Android (2 lần mỗi lượt) | REQ-147 · 156 · 157 | **Không** được tạo (API công khai → 0 bản ghi) — không có gì để dọn |
| Ảnh `auto_mobile_book_<timestamp>.png` | `adb push` vào `/sdcard/Download/` của emulator | REQ-150 | Còn trên emulator — không lên server |
| Danh mục tự gõ `amcat<timestamp>…` (24 · 25 ký tự) | Chip trên form | REQ-34 | **Không** gửi lên server (form bị chặn phía app) |
| Sách `Auto BKAPI NoPrice <timestamp>` (còn sót từ đợt API 25-09-2026, tác giả đã bị xoá) | Đợt API | 26-09: mở `Modify book` + `Confirm delete` rồi **Cancel** · 20-10: mở chi tiết (lượt xem 1 → 2, REQ-42) · `Save changes` 2 lần (lỗi — REQ-155) → **Delete** (REQ-50) | ✅ **Đã xoá** 20-10-2026 — `GET /api/book/<id>` → 404 (`RISK-BK-BOOK-10`) |

Không sửa/xoá bản ghi có sẵn nào khác. Lượt xem của sách người khác không bị tăng (chỉ mở chi tiết sách test). Video quay màn hình đã xoá khỏi máy ảo, **không** lưu vào `docs/`.
