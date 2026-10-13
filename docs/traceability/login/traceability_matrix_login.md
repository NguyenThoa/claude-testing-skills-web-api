# Ma Trận Truy Vết (RTM) — Đăng nhập / Xác thực (`LOGIN`)

> **Tóm tắt:** 40/40 REQ trong phạm vi đã có TC · **0/51 TC có script automation** · lần chạy gần nhất 45 PASS / 6 FAIL · 4 REQ loại trừ theo quyết định PO

| Thông tin | Nội dung |
|---|---|
| Ngày sinh | 14-10-2026 02:34 |
| Phạm vi | Module `LOGIN` · web |
| Mốc git | `501decf` — TC/script sửa sau mốc này thì RTM đã cũ |
| Nguồn đã quét | REQ: `requirements/login/` (44 REQ) · TC: `testcases/login/web/test_cases_login_web.md` (51 TC) · Automation: **không tìm thấy script** — ẩn cột `Automation` · Checklist: chưa có — ẩn cột `Checklist` · Kết quả chạy: `run_1787215085`, `run_1789759574` |
| Tổng hợp | [../traceability_matrix.md](../traceability_matrix.md) — ⬛ module ngoài tầm nhìn của RTM nằm ở đó |

## 1. Tổng quan

| Chỉ số | Tiến độ | Giá trị |
|---|---|---|
| Requirement Coverage | `▰▰▰▰▰▰▰▰▰▰` | **40/40** (100%) REQ trong phạm vi |
| Platform Coverage · web | `▰▰▰▰▰▰▰▰▰▰` | 40/40 cặp REQ × nền tảng |
| Automation Coverage | `▱▱▱▱▱▱▱▱▱▱` | **0/51** TC (0%) |
| Pass rate lần chạy gần nhất | `▰▰▰▰▰▰▰▰▰▱` | 45/51 (88%) · ❌ 6 FAIL · 0 TC chưa chạy |

**Phân bổ REQ theo trạng thái:**

| ✅ Đã automate | 🟣 Automate một phần | 🟡 Thủ công | 🟠 Chỉ checklist | 🔴 Chưa có TC | ⏭️ Loại trừ |
|:-:|:-:|:-:|:-:|:-:|:-:|
| 0 | 0 | 40 | 0 | 0 | 4 |

## 2. Việc cần làm

1. ❌ **5 TC FAIL đã có bug đang mở** — retest khi Dev báo fix → `/retest-fixed-bugs`
2. ❌ **1 TC FAIL nhưng bug đã đóng** — CRM_LOGIN_TC_018: kết quả FAIL đã lỗi thời, chạy lại để có kết quả đúng với TC hiện tại → `/execute-test-cases`
3. 🟡 **Bắt đầu automate:** 22 TC Critical/High đã chấm `Automation = Yes` (danh sách ở mục 4) → `/generate-automation-from-testcases`

## 3. Ma trận chi tiết

### 3.1. Giao diện trang đăng nhập (STORY-LOGIN-01)

`▰▰▰▰▰` 7/7 REQ có TC

| REQ ID | Yêu cầu | TC IDs | Kết quả gần nhất | Trạng thái |
|---|---|---|:-:|---|
| REQ-LOGIN-01 | Truy cập trang đăng nhập | CRM_LOGIN_TC_001 | ✅ 1 | 🟡 Thủ công |
| REQ-LOGIN-02 | Thành phần biểu mẫu đăng nhập | CRM_LOGIN_TC_002, CRM_LOGIN_TC_038, CRM_LOGIN_TC_042, CRM_LOGIN_TC_043, CRM_LOGIN_TC_044, CRM_LOGIN_TC_048, CRM_LOGIN_TC_049, CRM_LOGIN_TC_050 | ✅ 8 | 🟡 Thủ công |
| REQ-LOGIN-03 | Tự động đặt con trỏ vào ô Email | CRM_LOGIN_TC_002 | ✅ 1 | 🟡 Thủ công |
| REQ-LOGIN-04 | Logo dẫn về trang chủ | CRM_LOGIN_TC_004 | ❌ 1 🐞 | 🟡 Thủ công |
| REQ-LOGIN-05 | Không có CAPTCHA | CRM_LOGIN_TC_003 | ✅ 1 | 🟡 Thủ công |
| REQ-LOGIN-36 | Không có đăng nhập mạng xã hội | CRM_LOGIN_TC_003 | ✅ 1 | 🟡 Thủ công |
| REQ-LOGIN-37 | Trang đăng nhập không nạp tệp JavaScript nào | CRM_LOGIN_TC_003 | ✅ 1 | 🟡 Thủ công |

### 3.2. Đăng nhập thành công (STORY-LOGIN-02)

`▰▰▰▰▰` 5/5 REQ có TC

| REQ ID | Yêu cầu | TC IDs | Kết quả gần nhất | Trạng thái |
|---|---|---|:-:|---|
| REQ-LOGIN-06 | Đăng nhập bằng thông tin hợp lệ | CRM_LOGIN_TC_005, CRM_LOGIN_TC_006, CRM_LOGIN_TC_010, CRM_LOGIN_TC_041, CRM_LOGIN_TC_050 | ✅ 5 | 🟡 Thủ công |
| REQ-LOGIN-07 | Email không phân biệt hoa thường | CRM_LOGIN_TC_007 | ✅ 1 | 🟡 Thủ công |
| REQ-LOGIN-08 | Ghi nhớ đăng nhập sinh cookie `autologin` | CRM_LOGIN_TC_008 | ✅ 1 | 🟡 Thủ công |
| REQ-LOGIN-09 | Không tích Ghi nhớ thì không phát hành cookie `autologin` | CRM_LOGIN_TC_009 | ✅ 1 | 🟡 Thủ công |
| REQ-LOGIN-38 | Email bỏ qua khoảng trắng thừa đầu/cuối | CRM_LOGIN_TC_007 | ✅ 1 | 🟡 Thủ công |

### 3.3. Kiểm tra dữ liệu đầu vào & đăng nhập thất bại (STORY-LOGIN-03)

`▰▰▰▰▰` 8/8 REQ có TC

| REQ ID | Yêu cầu | TC IDs | Kết quả gần nhất | Trạng thái |
|---|---|---|:-:|---|
| REQ-LOGIN-10 | Bỏ trống cả hai trường | CRM_LOGIN_TC_011, CRM_LOGIN_TC_043 | ✅ 2 | 🟡 Thủ công |
| REQ-LOGIN-11 | Bỏ trống riêng Email | CRM_LOGIN_TC_011 | ✅ 1 | 🟡 Thủ công |
| REQ-LOGIN-12 | Bỏ trống riêng Mật khẩu | CRM_LOGIN_TC_011 | ✅ 1 | 🟡 Thủ công |
| REQ-LOGIN-13 | Chặn email sai định dạng ngay tại trình duyệt | CRM_LOGIN_TC_012, CRM_LOGIN_TC_045, CRM_LOGIN_TC_046 | ✅ 3 | 🟡 Thủ công |
| REQ-LOGIN-14 | Thông báo khi sai thông tin đăng nhập | CRM_LOGIN_TC_013, CRM_LOGIN_TC_014, CRM_LOGIN_TC_017, CRM_LOGIN_TC_018, CRM_LOGIN_TC_040, CRM_LOGIN_TC_045, CRM_LOGIN_TC_047, CRM_LOGIN_TC_050 | ✅ 7 · ❌ 1 | 🟡 Thủ công |
| REQ-LOGIN-15 | Thông báo lỗi không tiết lộ email nào có thật | CRM_LOGIN_TC_013, CRM_LOGIN_TC_019 | ✅ 2 | 🟡 Thủ công |
| REQ-LOGIN-16 | Máy chủ **phải** giữ lại email đã nhập sau khi đăng nhập thất bại | CRM_LOGIN_TC_016 | ❌ 1 🐞 | 🟡 Thủ công |
| REQ-LOGIN-41 | Không khoá tài khoản sau nhiều lần đăng nhập sai | CRM_LOGIN_TC_015 | ✅ 1 | 🟡 Thủ công |

### 3.4. Bảo vệ phiên & điều hướng (STORY-LOGIN-04)

`▰▰▰▰▰` 9/9 REQ có TC

| REQ ID | Yêu cầu | TC IDs | Kết quả gần nhất | Trạng thái |
|---|---|---|:-:|---|
| REQ-LOGIN-17 | Chặn URL nội bộ khi chưa đăng nhập | CRM_LOGIN_TC_021 | ✅ 1 | 🟡 Thủ công |
| REQ-LOGIN-18 | Không ghi nhớ URL đích sau khi chuyển hướng | CRM_LOGIN_TC_022 | ✅ 1 | 🟡 Thủ công |
| REQ-LOGIN-19 | Đã đăng nhập thì không vào lại trang đăng nhập | CRM_LOGIN_TC_023 | ✅ 1 | 🟡 Thủ công |
| REQ-LOGIN-20 | Đã đăng nhập thì không vào trang Quên mật khẩu | CRM_LOGIN_TC_023 | ✅ 1 | 🟡 Thủ công |
| REQ-LOGIN-21 | Biểu mẫu đăng nhập mang mã chống CSRF | CRM_LOGIN_TC_024 | ✅ 1 | 🟡 Thủ công |
| REQ-LOGIN-22 | Từ chối yêu cầu có mã CSRF sai | CRM_LOGIN_TC_025 | ✅ 1 | 🟡 Thủ công |
| REQ-LOGIN-42 | Phiên đăng nhập hết hạn sau 1 giờ | CRM_LOGIN_TC_026, CRM_LOGIN_TC_051 | ✅ 2 | 🟡 Thủ công |
| REQ-LOGIN-43 | Tài khoản khách hàng không đăng nhập được vào khu quản trị | CRM_LOGIN_TC_019, CRM_LOGIN_TC_020 | ✅ 2 | 🟡 Thủ công |
| REQ-LOGIN-44 | Ép truy cập qua HTTPS | CRM_LOGIN_TC_039 | ❌ 1 🐞 | 🟡 Thủ công |

### 3.5. Quên mật khẩu (STORY-LOGIN-05)

`▰▰▰▰▰` 5/5 REQ có TC · 1 loại trừ

| REQ ID | Yêu cầu | TC IDs | Kết quả gần nhất | Trạng thái |
|---|---|---|:-:|---|
| REQ-LOGIN-23 | Truy cập trang Quên mật khẩu | CRM_LOGIN_TC_027 | ✅ 1 | 🟡 Thủ công |
| REQ-LOGIN-24 | Trang Quên mật khẩu không có lối quay lại đăng nhập | CRM_LOGIN_TC_027 | ✅ 1 | 🟡 Thủ công |
| REQ-LOGIN-25 | Gửi biểu mẫu Quên mật khẩu khi bỏ trống email | CRM_LOGIN_TC_028 | ❌ 1 🐞 | 🟡 Thủ công |
| REQ-LOGIN-26 | Email không tồn tại trong hệ thống | CRM_LOGIN_TC_029, CRM_LOGIN_TC_030 | ✅ 1 · ❌ 1 🐞 | 🟡 Thủ công |
| REQ-LOGIN-27 | Email tồn tại thì gửi liên kết đặt lại mật khẩu | — | — | ⏭️ Loại trừ |
| REQ-LOGIN-28 | Liên kết đặt lại mật khẩu sai/hết hạn | CRM_LOGIN_TC_031 | ✅ 1 | 🟡 Thủ công |

### 3.6. Đăng xuất (STORY-LOGIN-06)

`▰▰▰▰▰` 6/6 REQ có TC · 3 loại trừ

| REQ ID | Yêu cầu | TC IDs | Kết quả gần nhất | Trạng thái |
|---|---|---|:-:|---|
| REQ-LOGIN-29 | Mỗi viewport có **một** lối đăng xuất dùng được | CRM_LOGIN_TC_032, CRM_LOGIN_TC_033 | ✅ 2 | 🟡 Thủ công |
| REQ-LOGIN-30 | Cảnh báo khi còn bộ đếm giờ đang chạy | CRM_LOGIN_TC_034 | ✅ 1 | 🟡 Thủ công |
| REQ-LOGIN-31 | Đăng xuất ngay khi không có bộ đếm giờ | CRM_LOGIN_TC_035 | ✅ 1 | 🟡 Thủ công |
| REQ-LOGIN-32 | Kết thúc phiên và về trang đăng nhập | CRM_LOGIN_TC_036 | ✅ 1 | 🟡 Thủ công |
| REQ-LOGIN-33 | URL nội bộ bị chặn lại sau khi đăng xuất | CRM_LOGIN_TC_036 | ✅ 1 | 🟡 Thủ công |
| REQ-LOGIN-34 | Cookie `autologin` không bị xoá khỏi trình duyệt khi đăng xuất | — | — | ⏭️ Loại trừ |
| REQ-LOGIN-35 | Cookie `autologin` đọc được bằng JavaScript | — | — | ⏭️ Loại trừ |
| REQ-LOGIN-39 | Cookie `autologin` không tự đăng nhập lại sau khi đăng xuất chủ động | CRM_LOGIN_TC_037 | ✅ 1 | 🟡 Thủ công |
| REQ-LOGIN-40 | Cookie `autologin` khi phiên hết hạn tự nhiên | — | — | ⏭️ Loại trừ |

### ⏭️ REQ loại trừ có chủ đích — không tính vào mẫu số

| REQ ID | Lý do | Căn cứ |
|---|---|---|
| REQ-LOGIN-27 | Không kiểm chứng luồng gửi mail đặt lại với email có thật | `AMB-LOGIN-04` ⏭️ |
| REQ-LOGIN-34 | Cookie ghi nhớ không bị xoá khi đăng xuất — chỉ ghi nhận hiện trạng | `AMB-LOGIN-06` ⏭️ |
| REQ-LOGIN-35 | Cookie ghi nhớ thiếu cờ `HttpOnly` — chỉ ghi nhận hiện trạng cho `RISK-LOGIN-02` | `AMB-LOGIN-07` ⏭️ |
| REQ-LOGIN-40 | Ghi nhớ đăng nhập khi phiên hết hạn tự nhiên — PO xác nhận tính năng **không hoạt động** | `AMB-LOGIN-15` ⏭️ |

## 4. 🟡 TC chưa automate

> **Chưa có project automation nào** — cả 51 TC đều chạy tay. Cột `Automation` dưới đây là **dự định** ghi trong file TC, không phải thực tế.

| Priority | Automation = Yes | Partial | No | Tổng |
|---|:-:|:-:|:-:|:-:|
| Critical | 10 | 0 | 0 | 10 |
| High | 12 | 4 | 2 | 18 |
| Medium | 17 | 2 | 0 | 19 |
| Low | 2 | 1 | 1 | 4 |

<details><summary>Danh sách đầy đủ 51 TC (xếp theo Priority, rồi khả năng automate)</summary>

| TC ID | Priority | Automation dự kiến | Ghi chú |
|---|---|---|---|
| CRM_LOGIN_TC_001 | Critical | Yes | — |
| CRM_LOGIN_TC_002 | Critical | Yes | — |
| CRM_LOGIN_TC_005 | Critical | Yes | — |
| CRM_LOGIN_TC_011 | Critical | Yes | — |
| CRM_LOGIN_TC_013 | Critical | Yes | — |
| CRM_LOGIN_TC_017 | Critical | Yes | — |
| CRM_LOGIN_TC_021 | Critical | Yes | — |
| CRM_LOGIN_TC_025 | Critical | Yes | — |
| CRM_LOGIN_TC_032 | Critical | Yes | — |
| CRM_LOGIN_TC_036 | Critical | Yes | — |
| CRM_LOGIN_TC_006 | High | Yes | — |
| CRM_LOGIN_TC_007 | High | Yes | — |
| CRM_LOGIN_TC_012 | High | Yes | — |
| CRM_LOGIN_TC_015 | High | Yes | — |
| CRM_LOGIN_TC_016 | High | Yes | 🐞 có bug đang mở |
| CRM_LOGIN_TC_019 | High | Yes | — |
| CRM_LOGIN_TC_020 | High | Yes | — |
| CRM_LOGIN_TC_027 | High | Yes | — |
| CRM_LOGIN_TC_028 | High | Yes | 🐞 có bug đang mở |
| CRM_LOGIN_TC_029 | High | Yes | 🐞 có bug đang mở |
| CRM_LOGIN_TC_035 | High | Yes | — |
| CRM_LOGIN_TC_039 | High | Yes | 🐞 có bug đang mở |
| CRM_LOGIN_TC_008 | High | Partial | — |
| CRM_LOGIN_TC_009 | High | Partial | — |
| CRM_LOGIN_TC_024 | High | Partial | — |
| CRM_LOGIN_TC_037 | High | Partial | — |
| CRM_LOGIN_TC_026 | High | No | QA tự chạy, không automation · chạy lâu |
| CRM_LOGIN_TC_051 | High | No | QA tự chạy, không automation · chạy lâu |
| CRM_LOGIN_TC_003 | Medium | Yes | — |
| CRM_LOGIN_TC_014 | Medium | Yes | — |
| CRM_LOGIN_TC_018 | Medium | Yes | — |
| CRM_LOGIN_TC_022 | Medium | Yes | — |
| CRM_LOGIN_TC_023 | Medium | Yes | — |
| CRM_LOGIN_TC_030 | Medium | Yes | — |
| CRM_LOGIN_TC_031 | Medium | Yes | — |
| CRM_LOGIN_TC_033 | Medium | Yes | — |
| CRM_LOGIN_TC_034 | Medium | Yes | — |
| CRM_LOGIN_TC_038 | Medium | Yes | — |
| CRM_LOGIN_TC_042 | Medium | Yes | — |
| CRM_LOGIN_TC_043 | Medium | Yes | — |
| CRM_LOGIN_TC_045 | Medium | Yes | — |
| CRM_LOGIN_TC_046 | Medium | Yes | — |
| CRM_LOGIN_TC_047 | Medium | Yes | — |
| CRM_LOGIN_TC_049 | Medium | Yes | — |
| CRM_LOGIN_TC_050 | Medium | Yes | — |
| CRM_LOGIN_TC_010 | Medium | Partial | — |
| CRM_LOGIN_TC_040 | Medium | Partial | — |
| CRM_LOGIN_TC_004 | Low | Yes | 🐞 có bug đang mở |
| CRM_LOGIN_TC_048 | Low | Yes | — |
| CRM_LOGIN_TC_041 | Low | Partial | — |
| CRM_LOGIN_TC_044 | Low | No | — |

</details>

## 5. Kiểm tra khác

| Hạng mục | Số lượng | Kết quả |
|---|:-:|---|
| 🔴 REQ chưa có TC | 0 | ✅ Không có |
| 🟠 REQ chỉ có checklist | 0 | ✅ Không có — chưa có checklist nào cho module |
| ⚪ Orphan test (không map về REQ) | 0 | ✅ Không có — chưa có script automation |
| 🧩 TC trỏ tới REQ không tồn tại | 0 | ✅ Không có — mọi TC trỏ về REQ đang có trong tài liệu |
| 🗑️ Script trỏ vào TC Deprecated | 0 | ✅ Không có — chưa có TC `@Deprecated` |
| ⚠️ Mapping suy luận cần xác nhận | 0 | ✅ Không có — 100% mapping theo ID |
