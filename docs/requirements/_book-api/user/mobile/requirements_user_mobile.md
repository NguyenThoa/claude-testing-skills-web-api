# Đặc tả Yêu cầu — Module Người dùng (`USER`) · Nền tảng Mobile

> Index module (metadata dải mã · REQ dùng chung · phân quyền · Story · AMB/RISK · Nhật ký): [../REQUIREMENTS_USER_SUMMARY.md](../REQUIREMENTS_USER_SUMMARY.md) · Danh mục hệ thống: [../../README.md](../../README.md) · Bản đồ app: [../../_discovery/modules/module_02_nguoi_dung.md](../../_discovery/modules/module_02_nguoi_dung.md)

| Mục | Giá trị |
|---|---|
| **Hệ thống** | AnhTester Book Management (mã hệ thống `BK`) |
| **Module** | Người dùng — tab `User` (User Management): danh sách · tìm kiếm · bộ lọc · Add user · Update user · Confirm delete |
| **Nền tảng** | **Android** 🟨 (đọc · validation · khách · xoá ✅ — sửa/khoá **lỗi** (REQ-129) · thêm người dùng khai **theo giả định**, chưa kiểm chứng — `AMB-BK-USER-22`) · iOS ❔ chưa khảo sát (máy Windows) |
| **Thiết bị khảo sát** | Emulator `Pixel_10_Pro_XL_API_37` · Android 17 · màn hình `1344×2992` · hướng **dọc** · locale `en-US` · app `book.anhtester.com` `1.0 (versionCode 1)` bản **debug** · `UiAutomator2` qua Appium MCP · loại app **Hybrid (Capacitor)** — WebView `153.0.8010.36`, khảo sát bằng cây `NATIVE_APP` (context `WEBVIEW_*` không liệt kê) |
| **Tầng network** | ❌ Không quan sát được — chưa dựng proxy, WebView không bật gỡ lỗi. Rule phía server lấy từ web và [api/requirements_user_api.md](../api/requirements_user_api.md) |
| **Phương pháp** | Thao tác thật trên app ngày 26-09-2026 và 20-10-2026 — đọc thuộc tính phần tử (`enabled` · `selected` · `checked` · `content-desc` · `bounds`), nhập thử từng ô, tắt mạng bằng `adb shell svc wifi/data disable`, xoay bằng `appium_orientation`, quay màn hình (`adb shell screenrecord`) để đọc thông báo nổi. Kết quả ghi dữ liệu đối chiếu bằng **đọc công khai** `GET /api/user?search=<email>` (không token). **Agent không nhập mật khẩu và không tạo tài khoản** trên hệ thống production |
| **Tài khoản** | 26-09: tài khoản test do tester đăng nhập sẵn — chỉ mở menu / hộp thoại rồi Cancel · 20-10: **khách** (app đang chưa đăng nhập) rồi tài khoản test do tester đăng nhập; Update thử rồi **xoá** tài khoản test còn sót `auto_web_<timestamp>_b@auto.test`. Mục 10 |
| **REQ trong file này** | **12** — `REQ-BK-USER-120` → `131` (chỉ áp Android). Cộng 35 REQ web dùng chung `Android · Web` ở [index mục 3.2](../REQUIREMENTS_USER_SUMMARY.md#32-dùng-chung-android--web) (33 kiểm khớp thực tế · `32` · `34` theo giả định) · `01` · `33` · `35` mở rộng tại index mục 3.1 (`Android · Web · API`; `33` · `35` theo giả định) |

> **Thang `Nguồn`:** `Kiểm chứng thực tế` = đã thao tác trên app và xác nhận bằng ảnh (danh mục mục 9) hoặc số liệu thuộc tính ghi trong AC. Mọi AC chỉ đúng với **thiết bị + hướng màn hình** ở bảng trên.

---

## 2. Bản đồ phủ tài liệu

Không có tài liệu nào cho app — toàn bộ REQ sinh từ khảo sát thực tế. 38 REQ web (`02 → 42`, trừ 4 REQ đã ở index 3.1) được **đối chiếu** trên app:

| Kết quả | REQ | Ghi chú |
|---|---|---|
| ✅ Khớp → chuyển lên index mục 3.2 (`Android · Web`) | `02 → 18` · `20 → 31` · `36` · `41` (31 — 26-09-2026) · `19` · `42` (20-10-2026) | `30` kỳ vọng — cả hai nền tảng chưa đạt |
| ✅ Khớp → mở rộng tại index 3.1 | `01` → `Android · Web · API` (20-10-2026) | Khách xem được danh sách |
| ❌ Android chạy khác → REQ riêng ở file này | `37` (Update thành công) → `REQ-129` | `Error in processing request` — `AMB-BK-USER-21` |
| ⛔ **Bị chặn** bởi REQ-129 — giữ ở `web/` / index 3.1 | `37` · `38` · `39` · `40` | Mọi vế cần Update lưu thành công |
| 📐 **Khai Android theo giả định** — chuyển lên index (`32` · `34` mục 3.2 · `33` · `35` mục 3.1) | `32` · `33` · `34` · `35` | Chưa kiểm chứng thực tế (cần gõ mật khẩu / tạo tài khoản trên production) — `AMB-BK-USER-22` ✅ chốt theo hành vi web, TC `@NeedsVerify` |

⚠️ Thao tác **gửi dữ liệu** trên Android đều lỗi ở 3 màn hình đã thử: Save Profile (REQ-BK-AUTH-122) · Create book (REQ-BK-BOOK-147) · Update user (REQ-129); còn **Delete** (REQ-42) chạy được. Khi tester chạy các REQ ❔ ở trên (Add user), kết quả lệch web phải ghi thành REQ riêng + AMB.

---

## 3. Yêu cầu Chức năng

> ↗️ 31 REQ dùng chung `Android · Web` ở [index mục 3.2](../REQUIREMENTS_USER_SUMMARY.md#32-dùng-chung-android--web) — AC Android nằm ở đó. Field Spec, Validation, Danh mục Evidence dưới đây vẫn nhắc các mã này vì mô tả giao diện Android.

### 3.1. Danh sách · điều hướng (STORY-BK-USER-01)

| REQ ID | Tên yêu cầu | Nền tảng | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|---|
| REQ-BK-USER-120 | Tab User đang ở My Profile / Setting account quay về danh sách | Android | Kỳ vọng — hiện **chưa đạt** (`AMB-BK-12` ✅ chốt là lỗi điều hướng Android) | Đứng ở My Profile (hoặc Setting account) → bấm tab `User` ở bottom navigation → phải hiển thị `User Management`. **Hiện tại:** vẫn ở My Profile (cây phần tử vẫn có các ô hồ sơ), chỉ breadcrumb `User management` đưa về được danh sách | 🟢 | — | Kiểm chứng thực tế — ❌ lệch · `android_profile_tab_user_stays.png` |
| REQ-BK-USER-121 | Bảng người dùng cuộn ngang, cột ⋮ luôn ở mép phải | Android | Bố cục màn hình hẹp | Màn hình dọc: chỉ thấy cột `Name` (một phần `Phone`) · vuốt ngang trên bảng → lần lượt `Phone` · `Address` · `Active` · `Created` · `Updated` · nút ⋮ của mỗi dòng **không** trôi theo, luôn ở `x ≈ 1152–1260` | 🟢 | — | Kiểm chứng thực tế · `android_user_list_hscroll_end.png` · đọc `bounds` trước/sau khi vuốt |
| REQ-BK-USER-125 | Mất mạng: danh sách hiện No Data, không báo lỗi mạng | Android | Mất mạng — hành vi quan sát (`AMB-BK-USER-20` ✅ chấp nhận hiện trạng) | (1) Tắt Wi-Fi + dữ liệu di động · xác nhận `ping` tới server thất bại → (2) mở tab `User` → vùng bảng hiện `No Data`, phân trang không có số trang · **không** có thông báo lỗi mạng. Bật mạng lại, mở lại tab → danh sách trở lại. **Không** assert nội dung thông báo lỗi mạng | 🟢 | — | Kiểm chứng thực tế · `android_user_list_offline.png` |
| REQ-BK-USER-128 | Back hệ thống ở danh sách User quay về màn hình trước | Android | Nút Back | Đứng ở Dashboard → tab `User` → nút Back hệ thống (bàn phím đang đóng) → về Dashboard (`Welcome <tên>`, tab `Dashboard` `selected=true`) | 🟢 | — | Kiểm chứng thực tế · đọc cây phần tử sau Back |
| REQ-BK-USER-130 | Xoay ngang: bảng hiện nhiều cột hơn, tiêu đề cột dính khi cuộn dọc | Android | Xoay màn hình | Tab `User` → xoay `LANDSCAPE` (ảnh `2992×1344`) → ô tìm kiếm giãn đủ rộng, đọc trọn gợi ý `Search user (name, email, phone or address)` · bảng hiện cùng lúc ≥ 5 tiêu đề cột (`Phone` · `Address` · `Active` · `Created` · `Updated`) không cần vuốt ngang · vùng dòng thấp — cuộn dọc để xem dòng, **hàng tiêu đề cột ở yên** đầu bảng · thanh điều hướng đáy vẫn hiện. Xoay lại `PORTRAIT` → bố cục dọc như REQ-121 | 🟢 | — | Kiểm chứng thực tế (20-10-2026) · `android_user_list_landscape.png` · ảnh sau khi cuộn dọc không lưu (có email người khác) |

### 3.2. Bộ lọc nâng cao (STORY-BK-USER-02)

| REQ ID | Tên yêu cầu | Nền tảng | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|---|
| REQ-BK-USER-122 | Hàng điều kiện lọc cuộn ngang tới Value, Add filter, Clear filter | Android | Bố cục màn hình hẹp (`AMB-BK-USER-18` ✅ chấp nhận) | Mở bảng lọc → `Field` · `Operator` hiển thị, `Value` chỉ lộ **24 px** ở mép phải (`bounds [1272,612][1296,780]`), `Add filter` · `Clear filter` ngoài màn hình → vuốt ngang trong vùng lọc → `Value` rộng đủ (`[648,612][1296,780]`), `Add filter` và `Clear filter` bấm được | 🟢 | — | Kiểm chứng thực tế · `android_user_filter_open.png` · `android_user_filter_hscroll.png` · đọc `bounds` |
| REQ-BK-USER-123 | Đổi Field xoá luôn Value đã nhập | Android | Bổ sung REQ-14. Web chưa kiểm | Field `Email` · Operator `Contains (∈)` · Value `auto_web_<timestamp>` → đổi Field sang `Phone` → Operator `Equals (=)` **và** ô Value trống | 🟢 | — | Kiểm chứng thực tế · đọc `text` ô Value |

### 3.3. Thêm · sửa người dùng (STORY-BK-USER-04 · 05)

| REQ ID | Tên yêu cầu | Nền tảng | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|---|
| REQ-BK-USER-124 | Mở lại Add user hoặc Update user không mang lỗi cũ | Android | Kỳ vọng — hiện **chưa đạt** (`AMB-BK-USER-19` ✅ chốt là lỗi). Web chưa kiểm | (1) `New user` → Name 251 ký tự + Email sai → `Save` (lỗi hiện) → `Cancel` → (2) `New user` lại → mọi ô trống và **không** có lỗi nào · (3) ⋮ → `Edit` một người dùng hợp lệ → **không** có lỗi nào. **Hiện tại:** (2) ô trống nhưng vẫn hiện `Name must be less than 250 characters.` · `Invalid email address` · `Password is required.` · (3) `Update user` điền sẵn dữ liệu hợp lệ vẫn báo đỏ 3 lỗi đó (kể cả `Password is required.` — Update không bắt buộc mật khẩu). Tắt hẳn app rồi mở lại thì hết | 🟢 | — | Kiểm chứng thực tế — ❌ lệch · `android_user_add_reopen_stale_errors.png` · `android_user_update_stale_errors.png` |
| REQ-BK-USER-126 | Dữ liệu Add user giữ nguyên khi app xuống nền | Android | Vòng đời app | `New user` → nhập Name `auto_mobile_bg_<timestamp>` → nút Home (app xuống nền 5 giây) → mở lại app → hộp `Add user` vẫn mở, Name giữ nguyên | 🟢 | — | Kiểm chứng thực tế · đọc `text` ô Name sau khi quay lại |
| REQ-BK-USER-127 | Bàn phím không che ô đang nhập và nút Save của Add user | Android | Bàn phím | `New user` → chạm ô Email → bàn phím mở (`mInputShown=true`) → hộp thoại co lại: ô Email `[243,1416][1101,1587]` · `Cancel` · `Save` `y 1758–1869` đều nằm **trên** bàn phím | 🟢 | — | Kiểm chứng thực tế · `android_user_add_keyboard_open.png` · `dumpsys input_method` |
| REQ-BK-USER-129 | Update user trên Android lưu thành công | Android | Kỳ vọng — hiện **chưa đạt** (`AMB-BK-USER-21` ✅ chốt là lỗi). Cùng hành vi web REQ-37 | App vừa mở lại (tránh REQ-124) → tìm theo email tài khoản test → ⋮ → `Edit` → sửa Name (2 ô mật khẩu **trống**) → `Update` → thông báo `Updated successfully.` · hộp thoại đóng · dòng hiện Name mới. **Hiện tại:** thông báo nổi `Error in processing request` (biểu tượng `!` đỏ) · hộp thoại **vẫn mở** · Name không đổi (đọc lại công khai `GET /api/user?search=<email>` → `name` cũ, `updatedAt` cũ). Tắt thêm `Active for login` rồi `Update` → cùng lỗi, `isActive` vẫn `true`. Tái hiện **3/3** | 🟢 | — | Kiểm chứng thực tế (20-10-2026) — ❌ lệch · `android_user_update_error_processing.png` · đọc lại qua API công khai |
| REQ-BK-USER-131 | Xoay ngang khi đang mở Add user: dữ liệu giữ nguyên, hộp thoại chia 2 cột | Android | Xoay màn hình | `New user` → nhập Name → xoay `LANDSCAPE` (ảnh `2992×1344`) → hộp `Add user` vẫn mở, chia **2 cột** (*Infomation* bên trái · *Account* bên phải) · `Cancel` · `Save` cố định ở đáy, `enabled=true` · ô Name giữ nguyên chữ đã nhập → xoay lại `PORTRAIT` → bố cục 1 cột, Name vẫn giữ nguyên | 🟢 | — | Kiểm chứng thực tế (20-10-2026) · `android_user_add_landscape.png` · đọc `text` ô Name trước / sau khi xoay |

**Tổng trong file: 12 REQ** — Danh sách 5 (`120` · `121` · `125` · `128` · `130`) · Bộ lọc 2 (`122` · `123`) · Thêm/sửa 5 (`124` · `126` · `127` · `129` · `131`) → `5 + 2 + 5 = 12 ✔`

---

## 4. Đặc tả Trường Dữ liệu (Field Spec)

| Màn hình | Field (Label) | Loại UI (class) | Required | Ràng buộc quan sát được | REQ liên quan | Ghi chú |
|---|---|---|---|---|---|---|
| Danh sách | Search user | `EditText` (không `hint` trong cây — placeholder chỉ thấy trên ảnh) | — | Lọc khi gõ | 08 · 09 | Trống lại khi rời tab |
| Danh sách | Số dòng mỗi trang | `android.widget.Spinner` | — | 7 lựa chọn, mặc định `5` | 04 · 05 · 07 | Lựa chọn là `android.view.View` trong `ListView` |
| Danh sách | Nút trang | `Button` · `content-desc` `page 1` · `Go to page N` · `Go to previous page` · `Go to next page` | — | — | 06 · 09 | |
| Bộ lọc | Field · Operator · nối AND/OR | `Spinner` · nối có id `mui-component-select-mode` | — | Mặc định `Name` · `Equals (=)` · `AND` | 12 · 13 · 14 · 16 | |
| Bộ lọc | Value | `EditText` | — | Tự áp dụng khi gõ · bị xoá khi đổi Field | 15 · 123 | Nằm ngoài màn hình — REQ-122 |
| Bộ lọc | × · Add filter · Clear filter | `Button` id `remove` · `add-filter` · `clear-filter` | — | — | 11 · 16 · 17 | id ổn định |
| Add / Update user | Name · Phone · Email | `EditText` | Name · Email ✅ | Name ≤ 250 (app — kỳ vọng 191) · Email định dạng | 26 · 27 · 30 · 31 | `resource-id` tự sinh |
| Add / Update user | Division · Ward · Address | `EditText` `address-division` · `address-ward` · `address` | ❌ | Ward/Address `enabled=false` khi ô trước trống | 24 | |
| Add / Update user | Password · Password Confirmation | `EditText` · `password=true` | Add ✅ · Update ❌ | — | 28 · 29 · 36 | Agent không nhập |
| Add / Update user | Active for login | `android.widget.Switch` | — | Hiển thị bật mặc định | 25 | `checked` luôn `false` — RISK-BK-USER-09 |
| Confirm delete | Cancel · Delete | `Button` id `dialog-delete-cancel` · `dialog-delete-action` | — | — | 41 | id ổn định |

---

## 5. Validation Messages (nguyên văn trên app)

| REQ | Màn hình | Điều kiện | Thông báo | Vị trí |
|---|---|---|---|---|
| 26 | Add user | Name trống | `Name is required.` | Dưới ô |
| 27 | Add user | Email trống | `Email is required.` | Dưới ô |
| 28 | Add user | Password trống | `Password is required.` | Dưới ô |
| 29 | Add user | Confirmation trống | `Password confirmation is required.` | Dưới ô |
| 30 | Add user | Name 251 ký tự | `Name must be less than 250 characters.` | Dưới ô |
| 31 | Add user | Email sai định dạng | `Invalid email address` | Dưới ô |
| 41 | Danh sách | ⋮ → Delete | `Confirm delete` / `Confirm you want to delete user "<Name>".` | Hộp thoại |
| 09 · 125 | Danh sách | Không kết quả · mất mạng | `No Data` | Vùng bảng |
| 42 | Danh sách | Delete thành công | `Deleted successfully.` (✓ xanh) | Thông báo nổi đáy màn hình |
| 129 | Update user | Update (mọi trường hợp đã thử) | `Error in processing request` (`!` đỏ) — **lệch web** | Thông báo nổi đáy màn hình |

Validation giống hệt web. `Created successfully.` · `Email already exists.` · `Password confirmation does not match.` **chưa** quan sát được trên Android (cần nhập mật khẩu — mục 2) · `Updated successfully.` không xuất hiện vì REQ-129.

---

## 6. Yêu cầu riêng của mobile (skill 3.5.3)

| Nhóm | Kết quả | REQ / AMB |
|---|---|---|
| Quyền runtime | **Không áp dụng** — Manifest chỉ khai `INTERNET`; `Upload photo` mở trình chọn ảnh hệ thống (không cần quyền) — chưa thử ở màn hình này | — |
| Vòng đời app | Hộp Add user và dữ liệu giữ khi xuống nền 5 giây | REQ-126 |
| Mất mạng | Danh sách hiện `No Data`, không báo lỗi mạng | REQ-125 · `AMB-BK-USER-20` |
| Xoay màn hình | Bảng hiện nhiều cột, tiêu đề cột dính khi cuộn dọc · hộp Add user chia 2 cột, giữ dữ liệu khi xoay (20-10-2026). Chưa thử ở Update user | REQ-130 · 131 |
| Bàn phím | Không che ô Email và nút Save | REQ-127 |
| Deep link | **Không áp dụng** — app không khai scheme/host (`system_map.md` mục 1) | — |
| Push notification | **Không áp dụng** — không quan sát thấy thông báo đẩy | — |
| Phiên bản tối thiểu | Ghi một lần ở module `AUTH` (`AMB-BK-AUTH-19`) | — |

---

## 7. Luồng người dùng

```
Tab User ─┬─ gõ Search ─► lọc
          ├─ icon lọc ─► bảng lọc (vuốt ngang tới Value · Add filter · Clear filter)
          ├─ vuốt ngang bảng ─► các cột còn lại (⋮ dính mép phải)
          └─ New user ─► Add user ─ Save (lỗi phía app) / Cancel
             ⋮ (dòng người khác) ─┬─ Edit ─► Update user ─┬─ Update ─► "Error in processing request" (REQ-129)
                                   │                       └─ Cancel
                                   └─ Delete ─► Confirm delete ─┬─ Delete ─► "Deleted successfully." · dòng biến mất
                                                                └─ Cancel
Khách ─ tab User ─► danh sách (không New user, không ⋮ — REQ-19)
             ⋮ (dòng "You") ─► Edit · Delete khoá
My Profile / Setting account ─ tab User ─► (đứng yên — REQ-120) · breadcrumb ─► danh sách
```

---

## 8. Ghi chú kỹ thuật cho automation

| Vấn đề | Chi tiết |
|---|---|
| Nút ⋮ và icon lọc không nhãn | `Button` rỗng `text` / `content-desc` → bắt theo quan hệ với dòng (cùng hàng với `TextView` email). Đề nghị dev thêm `aria-label` |
| Tìm phần tử theo XPath trong WebView | `xpath` `//android.widget.EditText` đôi lúc không trả phần tử dù có trong cây — dùng `-android uiautomator` `new UiSelector().className("android.widget.EditText").instance(n)` |
| Công tắc `Active for login` | `Switch.checked` luôn `false` — không assert trạng thái qua thuộc tính, assert qua kết quả (nhãn `Active`/`Inactive` trên dòng) |
| Lỗi validation dính giữa các lần mở hộp thoại | REQ-124 — test chạy nối tiếp phải khởi động lại app hoặc chấp nhận lỗi cũ; không assert "không có lỗi" khi mở hộp thoại cho tới khi dev sửa |
| Ẩn bàn phím | Không dùng phím Back khi bàn phím đã đóng — Back điều hướng về Dashboard (REQ-128). Kiểm `mInputShown` trước |
| Danh sách bị sắp theo `Updated` | Luôn tìm dòng bằng email riêng của test, không dựa vào vị trí |
| Ô tìm kiếm không lọc khi `setValue` | `setValue` ghi chữ vào ô nhưng **không** lọc bảng — chạm vào ô rồi gõ bằng bàn phím (`mobile: type` / `adb shell input text`) |
| Thông báo nổi mất nhanh | `Deleted successfully.` · `Error in processing request` hiện ~2 giây ở đáy màn hình (trên thanh điều hướng) — đọc ngay sau thao tác hoặc quay màn hình |
| Kiểm kết quả ghi dữ liệu | App không lộ request — đối chiếu bằng đọc công khai `GET /api/user?search=<email>` (không cần token) |

---

## 9. Danh mục Evidence

Thư mục [`evidence/`](evidence/). **Mọi ảnh đã mở lại xác nhận đúng trạng thái.** Ảnh có dòng của người dùng khác đã **làm mờ** vùng dòng (chỉ giữ tiêu đề, bộ lọc, phân trang); dòng còn rõ chỉ là tài khoản test `auto_demo_account_*` · `auto_web_*_b` và dữ liệu tự sinh `auto_*`.

| Ảnh | Màn hình | Trạng thái | REQ |
|---|---|---|---|
| `android_user_list_hscroll_end.png` | Danh sách | Đã vuốt ngang tới `Created` · `Updated`, ⋮ mép phải | 02 · 03 · 121 |
| `android_user_search_self_you.png` | Danh sách | Tìm theo email tài khoản test — dòng `You` | 08 · 21 |
| `android_user_row_menu_self_disabled.png` | Danh sách | ⋮ dòng `You` — Edit/Delete mờ | 22 |
| `android_user_row_menu_other_enabled.png` | Danh sách | ⋮ dòng tài khoản test khác — Edit/Delete dùng được | 20 · 23 |
| `android_user_pagesize_open.png` | Danh sách | Ô số dòng mở — 7 lựa chọn | 04 |
| `android_user_search_no_data.png` | Danh sách | Không kết quả | 09 |
| `android_user_filter_open.png` | Bộ lọc | Mở — Value tràn mép phải (dòng đã làm mờ) | 11 · 122 |
| `android_user_filter_hscroll.png` | Bộ lọc | Đã vuốt ngang — Value · Add filter · Clear filter (dòng đã làm mờ) | 11 · 122 |
| `android_user_filter_field_open.png` | Bộ lọc | Danh sách Field mở (dòng đã làm mờ) | 12 |
| `android_user_filter_email_contains.png` | Bộ lọc | Email · Contains · Value → 1 dòng | 15 |
| `android_user_filter_two_conditions.png` | Bộ lọc | 2 điều kiện, ô nối mở AND/OR | 16 |
| `android_user_add_dialog_default_part1.png` · `_part2.png` | Add user | Mặc định (2 phần) | 24 · 25 |
| `android_user_add_empty_submit.png` | Add user | Save trống — 4 lỗi | 26 → 29 |
| `android_user_add_invalid_fields.png` | Add user | Name 251 ký tự · Email sai | 30 · 31 |
| `android_user_add_reopen_stale_errors.png` | Add user | Mở lại sau Cancel — lỗi cũ còn | 124 |
| `android_user_update_stale_errors.png` | Update user | Dữ liệu hợp lệ vẫn báo đỏ | 124 |
| `android_user_update_dialog_default_part1.png` · `_part2.png` | Update user | Điền sẵn (sau khi mở lại app) | 36 |
| `android_user_delete_confirm.png` | Confirm delete | Hộp xác nhận | 41 |
| `android_user_add_keyboard_open.png` | Add user | Bàn phím mở ở ô Email | 127 |
| `android_user_list_offline.png` | Danh sách | Mất mạng — `No Data` | 125 |
| `android_profile_tab_user_stays.png` | My Profile | Sau khi bấm tab User — vẫn My Profile | 120 |
| `android_user_list_guest_hscroll_end.png` | Danh sách (khách) | Đã vuốt ngang tới `Updated` — không `New user`, không cột ⋮ (chỉ cột `Active` · `Created` · `Updated`, không lộ tên/email) | 01 · 19 |
| `android_user_list_landscape.png` | Danh sách (khách) | Xoay ngang — ô tìm kiếm đủ gợi ý, 5 tiêu đề cột trong một khung nhìn | 130 |
| `android_user_update_error_processing.png` | Update user | Sau khi bấm `Update` — thông báo `Error in processing request`, hộp vẫn mở (tài khoản test `auto_web_<timestamp>_b`) | 129 |
| `android_user_delete_success.png` | Danh sách | `Deleted successfully.` · từ khoá `auto_web_` → không còn dòng | 42 |
| `android_user_add_landscape.png` | Add user | Xoay ngang — 2 cột, `Cancel` · `Save` ở đáy (Name ở cột trái, nằm dưới mép ảnh) | 131 |

REQ không có ảnh riêng, truy bằng số liệu thuộc tính trong AC: 05 · 06 · 07 · 10 · 13 · 14 · 17 · 18 · 123 · 126 · 128. Ảnh sắp xếp theo `Name` (REQ-10) và ảnh xoay ngang sau khi cuộn dọc (REQ-130) **không** lưu vì chứa email người dùng thật.

---

## 10. Dữ liệu test — tạo / dọn

| Bản ghi | Tạo bởi | Dùng cho | Dọn |
|---|---|---|---|
| — | Không tạo tài khoản nào (cả 2 lượt) | — | — |
| User `auto_web_<timestamp>_b@auto.test` (còn sót từ đợt Web) | Đợt Web 25-09-2026 | 26-09: mở menu ⋮ · Update user · Confirm delete rồi **Cancel** · 20-10: Update thử 3 lần (đều lỗi — REQ-129, dữ liệu không đổi) → **Delete** (REQ-42) | ✅ **Đã xoá** 20-10-2026 — `GET /api/user?search=` trả 0 bản ghi |

Không sửa/xoá bản ghi có sẵn nào khác. Tạo 0 · dọn 1 (bản ghi sót của đợt Web). Video quay màn hình chỉ để đọc thông báo nổi — đã xoá khỏi máy ảo, **không** lưu vào `docs/`.
