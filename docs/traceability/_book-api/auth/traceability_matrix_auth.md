# Ma Trận Truy Vết (RTM) — Xác thực & Phiên (`AUTH`) · hệ thống Book

> **Tóm tắt:** 126/126 REQ đã có TC (100%) · **0/210 TC có script automation** · **chưa chạy lần nào** · 15 TC `@KnownBug` chờ Dev sửa lỗi

| Thông tin | Nội dung |
|---|---|
| Ngày sinh | 20-10-2026 10:48 |
| Phạm vi | Module `AUTH` · Web · API · Android |
| Mốc git | `ed6525b` — TC/REQ sửa sau mốc này thì RTM đã cũ |
| Nguồn đã quét | REQ: `requirements/_book-api/auth/` (126 REQ) · TC: 8 file ở `testcases/_book-api/auth/` (210 TC) · Automation: không tìm thấy script (cột ẩn) · Checklist: chưa có (cột ẩn) · Kết quả chạy: chưa có (cột ẩn) · Bug: `docs/bugs/_book-api/README.md` — chưa nối được vì TC chưa chạy |
| Tổng hợp | [../traceability_matrix.md](../traceability_matrix.md) — ⬛ module ngoài tầm nhìn của RTM nằm ở đó |

## 1. Tổng quan

| Chỉ số | Tiến độ | Giá trị |
|---|---|---|
| Requirement Coverage | `▰▰▰▰▰▰▰▰▰▰` | **126/126** (100%) REQ trong phạm vi |
| Platform Coverage · Web | `▰▰▰▰▰▰▰▰▰▰` | 72/72 cặp REQ × nền tảng (100%) |
| Platform Coverage · API | `▰▰▰▰▰▰▰▰▰▰` | 48/48 cặp REQ × nền tảng (100%) |
| Platform Coverage · Android | `▰▰▰▰▰▰▰▰▰▰` | 62/62 cặp REQ × nền tảng (100%) |
| Automation Coverage | `▱▱▱▱▱▱▱▱▱▱` | **0/210** TC (0%) — chưa có script |

**Phân bổ REQ theo trạng thái:**

| ✅ Đã automate | 🟣 Automate một phần | 🟡 Thủ công | 🟠 Chỉ checklist | 🔴 Chưa có TC | ⏭️ Loại trừ |
|:-:|:-:|:-:|:-:|:-:|:-:|
| 0 | 0 | 126 | 0 | 0 | 0 |

## 2. Việc cần làm

1. ▶️ **210 TC chưa từng chạy** → `/execute-test-cases` (Web) — Android / API chạy tay theo file TC · 15 TC `@KnownBug` dự kiến FAIL, đã có bug đang mở
2. 🟡 **Bắt đầu automate:** 132 TC Critical/High đã chấm `Automation = Yes` → `/generate-automation-from-testcases`

## 3. Ma trận chi tiết

### 3.1. Đăng ký tài khoản (STORY-BK-AUTH-01)

`▰▰▰▰▰` 35/35 REQ có TC

| REQ ID | Yêu cầu | Nền tảng | TC IDs | Trạng thái |
|---|---|---|---|---|
| REQ-BK-AUTH-01 | Đăng ký thành công với tên + email + mật khẩu hợp lệ | Web · API · Android | BK_AUTH_TC_029, BK_AUTH_TC_030, BK_AUTH_TC_039, BK_AUTH_TC_053, BK_AUTH_TC_054, BK_AUTH_TC_055, BK_AUTH_TC_059, BK_AUTH_TC_067, BK_AUTH_TC_068, BK_AUTH_TC_144, BK_AUTH_TC_168, BK_AUTH_TC_169, BK_AUTH_TC_170, BK_AUTH_TC_171 | 🟡 Thủ công |
| REQ-BK-AUTH-02 | Đăng ký không cần token | API | BK_AUTH_TC_059 | 🟡 Thủ công |
| REQ-BK-AUTH-03 | Tài khoản vừa đăng ký đăng nhập được | Web · API · Android | BK_AUTH_TC_004, BK_AUTH_TC_031, BK_AUTH_TC_054, BK_AUTH_TC_106, BK_AUTH_TC_146, BK_AUTH_TC_171 | 🟡 Thủ công |
| REQ-BK-AUTH-04 | Thiếu `name` bị từ chối | API | BK_AUTH_TC_061 | 🟡 Thủ công |
| REQ-BK-AUTH-05 | Thiếu `email` bị từ chối với lỗi thiếu field | API | BK_AUTH_TC_062 | 🟡 Thủ công |
| REQ-BK-AUTH-06 | Thiếu `password` bị từ chối | API | BK_AUTH_TC_063 | 🟡 Thủ công |
| REQ-BK-AUTH-07 | `email` sai định dạng bị từ chối | API | BK_AUTH_TC_064 | 🟡 Thủ công |
| REQ-BK-AUTH-08 | Không đăng ký trùng email | Web · API · Android | BK_AUTH_TC_041, BK_AUTH_TC_065, BK_AUTH_TC_157 | 🟡 Thủ công |
| REQ-BK-AUTH-09 | Kiểm trùng email không phân biệt hoa thường | Web · API · Android | BK_AUTH_TC_042, BK_AUTH_TC_066, BK_AUTH_TC_158 | 🟡 Thủ công |
| REQ-BK-AUTH-10 | Đăng ký nhận đủ 3 content-type khai trong spec | API | BK_AUTH_TC_060 | 🟡 Thủ công |
| REQ-BK-AUTH-65 | Màn hình Sign up có đủ các ô | Web · Android | BK_AUTH_TC_026, BK_AUTH_TC_044, BK_AUTH_TC_045, BK_AUTH_TC_141, BK_AUTH_TC_165 | 🟡 Thủ công |
| REQ-BK-AUTH-66 | Link "Get started" mở Sign up | Web · Android | BK_AUTH_TC_027, BK_AUTH_TC_142 | 🟡 Thủ công |
| REQ-BK-AUTH-67 | Link "Sign in" trên Sign up về Sign in | Web · Android | BK_AUTH_TC_028, BK_AUTH_TC_143 | 🟡 Thủ công |
| REQ-BK-AUTH-68 | Sign up: bỏ trống Name bị chặn | Web · Android | BK_AUTH_TC_032, BK_AUTH_TC_036, BK_AUTH_TC_148 | 🟡 Thủ công |
| REQ-BK-AUTH-69 | Sign up: bỏ trống Email bị chặn | Web · Android | BK_AUTH_TC_033, BK_AUTH_TC_036, BK_AUTH_TC_149 | 🟡 Thủ công |
| REQ-BK-AUTH-70 | Sign up: bỏ trống Password bị chặn | Web · Android | BK_AUTH_TC_034, BK_AUTH_TC_036, BK_AUTH_TC_150 | 🟡 Thủ công |
| REQ-BK-AUTH-71 | Sign up: bỏ trống Password Confirmation bị chặn | Web · Android | BK_AUTH_TC_035, BK_AUTH_TC_036, BK_AUTH_TC_151 | 🟡 Thủ công |
| REQ-BK-AUTH-72 | Phone không bắt buộc | Web · Android | BK_AUTH_TC_029, BK_AUTH_TC_036, BK_AUTH_TC_046, BK_AUTH_TC_152, BK_AUTH_TC_159 | 🟡 Thủ công |
| REQ-BK-AUTH-73 | Name tối đa 191 ký tự | Web · Android | BK_AUTH_TC_037, BK_AUTH_TC_038, BK_AUTH_TC_153, BK_AUTH_TC_154 | 🟡 Thủ công · REQ 🟡 đã sửa |
| REQ-BK-AUTH-74 | Sign up: Email sai định dạng bị chặn | Web · Android | BK_AUTH_TC_040, BK_AUTH_TC_155 | 🟡 Thủ công |
| REQ-BK-AUTH-75 | Mật khẩu xác nhận phải khớp | Web · Android | BK_AUTH_TC_043, BK_AUTH_TC_156 | 🟡 Thủ công |
| REQ-BK-AUTH-76 | Division liệt kê đơn vị hành chính cấp tỉnh | Web · Android | BK_AUTH_TC_030, BK_AUTH_TC_047, BK_AUTH_TC_160 | 🟡 Thủ công |
| REQ-BK-AUTH-77 | Ward bị khoá khi chưa chọn Division | Web · Android | BK_AUTH_TC_026, BK_AUTH_TC_048, BK_AUTH_TC_161 | 🟡 Thủ công |
| REQ-BK-AUTH-78 | Ward liệt kê phường theo Division đã chọn | Web · Android | BK_AUTH_TC_030, BK_AUTH_TC_049, BK_AUTH_TC_162 | 🟡 Thủ công |
| REQ-BK-AUTH-79 | Address bị khoá cho tới khi chọn Ward | Web · Android | BK_AUTH_TC_026, BK_AUTH_TC_030, BK_AUTH_TC_048, BK_AUTH_TC_163 | 🟡 Thủ công |
| REQ-BK-AUTH-80 | Đổi Division xoá Ward đã chọn | Web · Android | BK_AUTH_TC_050, BK_AUTH_TC_164 | 🟡 Thủ công |
| REQ-BK-AUTH-81 | Lỗi email trùng hiện ngay dưới ô Email | Web · Android | BK_AUTH_TC_041, BK_AUTH_TC_042, BK_AUTH_TC_157, BK_AUTH_TC_158 | 🟡 Thủ công |
| REQ-BK-AUTH-82 | Back hệ thống ở Sign up về Sign in, không hỏi xác nhận | Android | BK_AUTH_TC_051 | 🟡 Thủ công |
| REQ-BK-AUTH-83 | Dữ liệu Sign up được giữ khi rời màn hình rồi quay lại | Web · Android | BK_AUTH_TC_052, BK_AUTH_TC_166 | 🟡 Thủ công |
| REQ-BK-AUTH-84 | Dữ liệu form giữ nguyên khi app xuống nền | Android | BK_AUTH_TC_056 | 🟡 Thủ công |
| REQ-BK-AUTH-85 | Xoay ngang được, dữ liệu form giữ nguyên | Android | BK_AUTH_TC_057 | 🟡 Thủ công |
| REQ-BK-AUTH-86 | Bàn phím không che ô đang nhập | Android | BK_AUTH_TC_058 | 🟡 Thủ công |
| REQ-BK-AUTH-88 | Nhấn Enter trong Sign up **không** gửi form | Web | BK_AUTH_TC_167 | 🟡 Thủ công |
| REQ-BK-AUTH-89 | Địa chỉ gửi lên server là chuỗi ghép 3 ô | Web | BK_AUTH_TC_145 | 🟡 Thủ công |
| REQ-BK-AUTH-90 | Đăng ký thành công thì form Sign up được làm trống | Web | BK_AUTH_TC_147 | 🟡 Thủ công |

### 3.2. Đăng nhập (STORY-BK-AUTH-02)

`▰▰▰▰▰` 39/39 REQ có TC

| REQ ID | Yêu cầu | Nền tảng | TC IDs | Trạng thái |
|---|---|---|---|---|
| REQ-BK-AUTH-11 | Đăng nhập thành công | Web · API · Android | BK_AUTH_TC_004, BK_AUTH_TC_019, BK_AUTH_TC_054, BK_AUTH_TC_069, BK_AUTH_TC_112, BK_AUTH_TC_136 | 🟡 Thủ công |
| REQ-BK-AUTH-12 | Đăng nhập không cần token | API | BK_AUTH_TC_107 | 🟡 Thủ công |
| REQ-BK-AUTH-13 | Access token từ đăng nhập dùng được cho endpoint cần xác thực | API | BK_AUTH_TC_071 | 🟡 Thủ công |
| REQ-BK-AUTH-14 | Email đăng nhập không phân biệt hoa thường | Web · API · Android | BK_AUTH_TC_017, BK_AUTH_TC_072, BK_AUTH_TC_126 | 🟡 Thủ công |
| REQ-BK-AUTH-15 | Sai mật khẩu bị từ chối | Web · API · Android | BK_AUTH_TC_013, BK_AUTH_TC_023, BK_AUTH_TC_073, BK_AUTH_TC_081, BK_AUTH_TC_122, BK_AUTH_TC_139 | 🟡 Thủ công |
| REQ-BK-AUTH-16 | Email chưa đăng ký bị từ chối | Web · API · Android | BK_AUTH_TC_014, BK_AUTH_TC_074, BK_AUTH_TC_123 | 🟡 Thủ công |
| REQ-BK-AUTH-17 | Thiếu `email` bị từ chối với lỗi thiếu field | API | BK_AUTH_TC_075 | 🟡 Thủ công |
| REQ-BK-AUTH-18 | Thiếu `password` bị từ chối | API | BK_AUTH_TC_076 | 🟡 Thủ công |
| REQ-BK-AUTH-19 | `email` sai định dạng bị từ chối | API | BK_AUTH_TC_077 | 🟡 Thủ công |
| REQ-BK-AUTH-20 | Cookie `refetchToken` được set với đủ cờ bảo mật | API | BK_AUTH_TC_078 | 🟡 Thủ công |
| REQ-BK-AUTH-21 | Cookie `accessToken` mang cùng giá trị với `accessToken` trong body | API | BK_AUTH_TC_079 | 🟡 Thủ công |
| REQ-BK-AUTH-22 | Cookie `accessToken` có cờ `HttpOnly` · `Secure` · `SameSite` | API | BK_AUTH_TC_080 | 🟡 Thủ công |
| REQ-BK-AUTH-23 | Đăng nhập nhận đủ 3 content-type khai trong spec | API | BK_AUTH_TC_070 | 🟡 Thủ công |
| REQ-BK-AUTH-49 | Màn hình Sign in có đủ ô nhập và nút | Web · Android | BK_AUTH_TC_001, BK_AUTH_TC_109, BK_AUTH_TC_140 | 🟡 Thủ công |
| REQ-BK-AUTH-50 | Chưa đăng nhập, nút avatar mở Sign in | Web · Android | BK_AUTH_TC_002, BK_AUTH_TC_110 | 🟡 Thủ công |
| REQ-BK-AUTH-51 | Thẻ "Book management sign in" trên Dashboard mở Sign in | Web · Android | BK_AUTH_TC_003, BK_AUTH_TC_111 | 🟡 Thủ công |
| REQ-BK-AUTH-52 | Sign in: bỏ trống Email bị chặn | Web · Android | BK_AUTH_TC_007, BK_AUTH_TC_009, BK_AUTH_TC_116, BK_AUTH_TC_118 | 🟡 Thủ công |
| REQ-BK-AUTH-53 | Sign in: bỏ trống Password bị chặn | Web · Android | BK_AUTH_TC_008, BK_AUTH_TC_009, BK_AUTH_TC_117, BK_AUTH_TC_118 | 🟡 Thủ công |
| REQ-BK-AUTH-54 | Sign in: Email sai định dạng bị chặn ngay phía client | Web · Android | BK_AUTH_TC_010, BK_AUTH_TC_022, BK_AUTH_TC_119, BK_AUTH_TC_138 | 🟡 Thủ công |
| REQ-BK-AUTH-55 | Sau lần gửi đầu, lỗi ô nhập cập nhật ngay khi sửa | Web · Android | BK_AUTH_TC_011, BK_AUTH_TC_120 | 🟡 Thủ công |
| REQ-BK-AUTH-56 | Nút con mắt hiện mật khẩu dạng chữ | Web · Android | BK_AUTH_TC_012, BK_AUTH_TC_121 | 🟡 Thủ công |
| REQ-BK-AUTH-57 | Đăng nhập thất bại giữ nguyên dữ liệu đã nhập | Web · Android | BK_AUTH_TC_015, BK_AUTH_TC_124 | 🟡 Thủ công |
| REQ-BK-AUTH-58 | Thông báo kết quả tự đóng | Web · Android | BK_AUTH_TC_016, BK_AUTH_TC_125 | 🟡 Thủ công |
| REQ-BK-AUTH-59 | Sau đăng nhập, Dashboard chào đúng tên | Web · Android | BK_AUTH_TC_004, BK_AUTH_TC_020, BK_AUTH_TC_031, BK_AUTH_TC_113 | 🟡 Thủ công |
| REQ-BK-AUTH-60 | Menu avatar khi đã đăng nhập | Android | BK_AUTH_TC_005, BK_AUTH_TC_020, BK_AUTH_TC_031 | 🟡 Thủ công |
| REQ-BK-AUTH-61 | Phiên đăng nhập được giữ sau khi tắt hẳn app | Android | BK_AUTH_TC_024 | 🟡 Thủ công |
| REQ-BK-AUTH-63 | Mất mạng khi đăng nhập: không vào hệ thống, giữ dữ liệu | Android | BK_AUTH_TC_025 | 🟡 Thủ công |
| REQ-BK-AUTH-64 | Back hệ thống ở Sign in quay về màn hình trước | Android | BK_AUTH_TC_018 | 🟡 Thủ công |
| REQ-BK-AUTH-87 | Nhấn Enter trong form Sign in gửi đăng nhập | Web | BK_AUTH_TC_127, BK_AUTH_TC_140 | 🟡 Thủ công |
| REQ-BK-AUTH-91 | Sign in giữ dữ liệu đã nhập khi rời trang trong ứng dụng rồi quay lại | Web | BK_AUTH_TC_128 | 🟡 Thủ công |
| REQ-BK-AUTH-92 | Menu tài khoản trên web | Web | BK_AUTH_TC_114 | 🟡 Thủ công |
| REQ-BK-AUTH-93 | Phiên đăng nhập được giữ khi tải lại trang | Web | BK_AUTH_TC_129 | 🟡 Thủ công |
| REQ-BK-AUTH-96 | Khách mở URL cần đăng nhập bị chuyển sang Sign in | Web | BK_AUTH_TC_130, BK_AUTH_TC_193 | 🟡 Thủ công |
| REQ-BK-AUTH-97 | Đăng nhập từ trang có `redirect` quay về đúng URL gốc, giữ cả query | Web | BK_AUTH_TC_131 | 🟡 Thủ công · REQ 🟡 đã sửa |
| REQ-BK-AUTH-98 | Đăng nhập không có `redirect` về Dashboard | Web | BK_AUTH_TC_132 | 🟡 Thủ công |
| REQ-BK-AUTH-99 | Đã đăng nhập vẫn mở được trang Sign in | Web | BK_AUTH_TC_133 | 🟡 Thủ công |
| REQ-BK-AUTH-100 | Tài khoản bị khoá không đăng nhập được | Web | BK_AUTH_TC_134 | 🟡 Thủ công |
| REQ-BK-AUTH-121 | Tài khoản bị khoá được báo khoá trước khi kiểm mật khẩu | Web | BK_AUTH_TC_135 | 🟡 Thủ công |
| REQ-BK-AUTH-126 | Exit app đưa về màn hình chính của máy, mở lại vẫn đăng nhập | Android | BK_AUTH_TC_210 | 🟡 Thủ công |

### 3.3. Làm mới token & Đăng xuất (STORY-BK-AUTH-03)

`▰▰▰▰▰` 13/13 REQ có TC

| REQ ID | Yêu cầu | Nền tảng | TC IDs | Trạng thái |
|---|---|---|---|---|
| REQ-BK-AUTH-24 | Làm mới token thành công bằng cookie `refetchToken` | API | BK_AUTH_TC_082 | 🟡 Thủ công |
| REQ-BK-AUTH-25 | Access token mới từ làm mới token dùng được | API | BK_AUTH_TC_083 | 🟡 Thủ công |
| REQ-BK-AUTH-26 | Làm mới token không cần header `Authorization` | API | BK_AUTH_TC_108 | 🟡 Thủ công |
| REQ-BK-AUTH-27 | Thiếu cookie `refetchToken` bị từ chối | API | BK_AUTH_TC_084 | 🟡 Thủ công |
| REQ-BK-AUTH-28 | Cookie `refetchToken` không hợp lệ bị từ chối | API | BK_AUTH_TC_085 | 🟡 Thủ công |
| REQ-BK-AUTH-29 | Đăng xuất thành công | API | BK_AUTH_TC_086 | 🟡 Thủ công |
| REQ-BK-AUTH-30 | Đăng xuất không có token bị từ chối | API | BK_AUTH_TC_088 | 🟡 Thủ công |
| REQ-BK-AUTH-31 | Đăng xuất với token không hợp lệ bị từ chối | API | BK_AUTH_TC_089 | 🟡 Thủ công |
| REQ-BK-AUTH-32 | Đăng xuất yêu cầu trình duyệt xoá cookie `refetchToken` | API | BK_AUTH_TC_087 | 🟡 Thủ công |
| REQ-BK-AUTH-33 | Sau đăng xuất, `refetchToken` của phiên không còn làm mới được token | API | BK_AUTH_TC_090 | 🟡 Thủ công |
| REQ-BK-AUTH-62 | Đăng xuất từ menu avatar đưa về Sign in | Android | BK_AUTH_TC_006, BK_AUTH_TC_021, BK_AUTH_TC_054 | 🟡 Thủ công |
| REQ-BK-AUTH-94 | Đăng xuất đưa về Sign in kèm thông báo | Web | BK_AUTH_TC_115, BK_AUTH_TC_171 | 🟡 Thủ công |
| REQ-BK-AUTH-95 | Đăng xuất xoá token lưu trên trình duyệt | Web | BK_AUTH_TC_137 | 🟡 Thủ công |

### 3.4. Thông tin & Hồ sơ người dùng hiện tại (STORY-BK-AUTH-04)

`▰▰▰▰▰` 32/32 REQ có TC

| REQ ID | Yêu cầu | Nền tảng | TC IDs | Trạng thái |
|---|---|---|---|---|
| REQ-BK-AUTH-34 | Lấy thông tin người dùng hiện tại | API | BK_AUTH_TC_091 | 🟡 Thủ công |
| REQ-BK-AUTH-35 | Thông tin người dùng hiện tại không lộ khoá ngoài danh sách | API | BK_AUTH_TC_067, BK_AUTH_TC_092 | 🟡 Thủ công |
| REQ-BK-AUTH-36 | Thông tin trả về khớp dữ liệu đã đăng ký | API | BK_AUTH_TC_068, BK_AUTH_TC_093 | 🟡 Thủ công |
| REQ-BK-AUTH-37 | Lấy thông tin khi không có token bị từ chối | API | BK_AUTH_TC_094 | 🟡 Thủ công |
| REQ-BK-AUTH-38 | Lấy thông tin với token không hợp lệ bị từ chối | API | BK_AUTH_TC_095 | 🟡 Thủ công |
| REQ-BK-AUTH-39 | Endpoint cần xác thực chỉ nhận token qua header `Authorization` | API | BK_AUTH_TC_096 | 🟡 Thủ công |
| REQ-BK-AUTH-40 | Token của tài khoản đã bị xoá không còn dùng được | API | BK_AUTH_TC_097 | 🟡 Thủ công |
| REQ-BK-AUTH-41 | Cập nhật tên hiển thị qua hồ sơ | API | BK_AUTH_TC_098 | 🟡 Thủ công |
| REQ-BK-AUTH-42 | Thông tin người dùng phản ánh tên đã cập nhật | API | BK_AUTH_TC_099 | 🟡 Thủ công |
| REQ-BK-AUTH-43 | Cập nhật hồ sơ khi không có token bị từ chối | API | BK_AUTH_TC_100 | 🟡 Thủ công |
| REQ-BK-AUTH-44 | Cập nhật hồ sơ với `email` sai định dạng bị từ chối | API | BK_AUTH_TC_101 | 🟡 Thủ công |
| REQ-BK-AUTH-45 | Đổi mật khẩu qua hồ sơ | API | BK_AUTH_TC_102 | 🟡 Thủ công |
| REQ-BK-AUTH-46 | Đăng nhập được bằng mật khẩu mới sau khi đổi | API | BK_AUTH_TC_103 | 🟡 Thủ công |
| REQ-BK-AUTH-47 | Mật khẩu cũ bị từ chối sau khi đổi | API | BK_AUTH_TC_104 | 🟡 Thủ công |
| REQ-BK-AUTH-101 | My Profile hiển thị dữ liệu hiện tại của tài khoản | Web · Android | BK_AUTH_TC_172, BK_AUTH_TC_192, BK_AUTH_TC_194, BK_AUTH_TC_209 | 🟡 Thủ công |
| REQ-BK-AUTH-102 | Nút Save Profile và Reset mờ khi chưa sửa gì | Web · Android | BK_AUTH_TC_173, BK_AUTH_TC_195 | 🟡 Thủ công |
| REQ-BK-AUTH-103 | Cập nhật hồ sơ thành công | Web | BK_AUTH_TC_174 | 🟡 Thủ công |
| REQ-BK-AUTH-104 | Tên mới hiển thị ở Dashboard | Web | BK_AUTH_TC_175 | 🟡 Thủ công |
| REQ-BK-AUTH-105 | My Profile: bỏ trống Name bị chặn | Web · Android | BK_AUTH_TC_178, BK_AUTH_TC_198 | 🟡 Thủ công |
| REQ-BK-AUTH-106 | My Profile: Email sai định dạng bị chặn | Web · Android | BK_AUTH_TC_179, BK_AUTH_TC_199 | 🟡 Thủ công |
| REQ-BK-AUTH-107 | Đổi mật khẩu bắt buộc nhập Old Password | Web · Android | BK_AUTH_TC_180, BK_AUTH_TC_200 | 🟡 Thủ công |
| REQ-BK-AUTH-108 | My Profile: mật khẩu xác nhận phải khớp | Web · Android | BK_AUTH_TC_181, BK_AUTH_TC_201 | 🟡 Thủ công |
| REQ-BK-AUTH-109 | Old Password sai thì không đổi được mật khẩu | Web | BK_AUTH_TC_182 | 🟡 Thủ công |
| REQ-BK-AUTH-110 | Đổi mật khẩu thành công thì tự đăng xuất | Web | BK_AUTH_TC_184 | 🟡 Thủ công |
| REQ-BK-AUTH-111 | Sau khi đổi, mật khẩu cũ bị từ chối | Web | BK_AUTH_TC_185 | 🟡 Thủ công |
| REQ-BK-AUTH-112 | Sau khi đổi, mật khẩu mới đăng nhập được | Web | BK_AUTH_TC_186 | 🟡 Thủ công |
| REQ-BK-AUTH-113 | Reset khôi phục giá trị đã lưu | Web · Android | BK_AUTH_TC_187, BK_AUTH_TC_202 | 🟡 Thủ công |
| REQ-BK-AUTH-114 | Save Profile vẫn gửi được sau một lần bị server từ chối | Web | BK_AUTH_TC_183 | 🟡 Thủ công |
| REQ-BK-AUTH-115 | Mở thẳng URL My Profile khi đã đăng nhập hiển thị My Profile | Web | BK_AUTH_TC_176 | 🟡 Thủ công |
| REQ-BK-AUTH-120 | My Profile: đổi Email sang email đã có bị từ chối | Web | BK_AUTH_TC_188 | 🟡 Thủ công |
| REQ-BK-AUTH-122 | Save Profile trên Android cập nhật hồ sơ thành công | Android | BK_AUTH_TC_196 | 🟡 Thủ công |
| REQ-BK-AUTH-123 | Back hệ thống ở My Profile quay về màn hình trước | Android | BK_AUTH_TC_203 | 🟡 Thủ công |

### 3.5. Quy ước chung của module (STORY-BK-AUTH-05)

`▰▰▰▰▰` 1/1 REQ có TC

| REQ ID | Yêu cầu | Nền tảng | TC IDs | Trạng thái |
|---|---|---|---|---|
| REQ-BK-AUTH-48 | Body lỗi kiểm tra dữ liệu có hình dạng `msg` + `fields` | API | BK_AUTH_TC_105 | 🟡 Thủ công |

### 3.6. Tuỳ chỉnh giao diện tài khoản (STORY-BK-AUTH-06)

`▰▰▰▰▰` 6/6 REQ có TC

| REQ ID | Yêu cầu | Nền tảng | TC IDs | Trạng thái |
|---|---|---|---|---|
| REQ-BK-AUTH-116 | Màn hình Setting account có đủ thành phần | Web · Android | BK_AUTH_TC_177, BK_AUTH_TC_197 | 🟡 Thủ công |
| REQ-BK-AUTH-117 | Chọn theme áp dụng ngay, chưa cần Save | Web · Android | BK_AUTH_TC_189, BK_AUTH_TC_204 | 🟡 Thủ công |
| REQ-BK-AUTH-118 | Save lưu cấu hình giao diện lên tài khoản | Web · Android | BK_AUTH_TC_190, BK_AUTH_TC_205 | 🟡 Thủ công |
| REQ-BK-AUTH-119 | Reset đưa theme về System | Web · Android | BK_AUTH_TC_191, BK_AUTH_TC_206 | 🟡 Thủ công |
| REQ-BK-AUTH-124 | Reset ở Setting account trả về theme đang áp dụng lúc mở màn hình | Android | BK_AUTH_TC_207 | 🟡 Thủ công |
| REQ-BK-AUTH-125 | Theme và màu vừa chọn áp dụng toàn app, giữ khi rời màn hình | Android | BK_AUTH_TC_208 | 🟡 Thủ công |

## 4. 🟡 TC chưa automate

| Priority | Automation = Yes | Partial | No | Tổng |
|---|:-:|:-:|:-:|:-:|
| Critical | 20 | 0 | 0 | 20 |
| High | 112 | 0 | 0 | 112 |
| Medium | 55 | 6 | 0 | 61 |
| Low | 16 | 1 | 0 | 17 |
| **Tổng** | **203** | **7** | **0** | **210** |

<details><summary>Danh sách đầy đủ 210 TC (xếp theo Priority)</summary>

| TC ID | Nền tảng | Priority | Automation dự kiến | Ghi chú |
|---|---|---|---|---|
| BK_AUTH_TC_004 | Android | Critical | Yes | — |
| BK_AUTH_TC_006 | Android | Critical | Yes | — |
| BK_AUTH_TC_029 | Android | Critical | Yes | — |
| BK_AUTH_TC_054 | Android | Critical | Yes | — |
| BK_AUTH_TC_059 | API | Critical | Yes | — |
| BK_AUTH_TC_069 | API | Critical | Yes | — |
| BK_AUTH_TC_082 | API | Critical | Yes | — |
| BK_AUTH_TC_086 | API | Critical | Yes | — |
| BK_AUTH_TC_091 | API | Critical | Yes | — |
| BK_AUTH_TC_106 | API | Critical | Yes | — |
| BK_AUTH_TC_112 | Web | Critical | Yes | — |
| BK_AUTH_TC_115 | Web | Critical | Yes | — |
| BK_AUTH_TC_130 | Web | Critical | Yes | — |
| BK_AUTH_TC_134 | Web | Critical | Yes | — |
| BK_AUTH_TC_137 | Web | Critical | Yes | — |
| BK_AUTH_TC_144 | Web | Critical | Yes | — |
| BK_AUTH_TC_146 | Web | Critical | Yes | — |
| BK_AUTH_TC_174 | Web | Critical | Yes | — |
| BK_AUTH_TC_184 | Web | Critical | Yes | — |
| BK_AUTH_TC_196 | Android | Critical | Yes | `@KnownBug` · `@NeedsVerify` |
| BK_AUTH_TC_001 | Android | High | Yes | — |
| BK_AUTH_TC_002 | Android | High | Yes | — |
| BK_AUTH_TC_005 | Android | High | Yes | — |
| BK_AUTH_TC_007 | Android | High | Yes | — |
| BK_AUTH_TC_008 | Android | High | Yes | — |
| BK_AUTH_TC_010 | Android | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_013 | Android | High | Yes | — |
| BK_AUTH_TC_014 | Android | High | Yes | — |
| BK_AUTH_TC_020 | Android | High | Yes | — |
| BK_AUTH_TC_021 | Android | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_022 | Android | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_023 | Android | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_024 | Android | High | Yes | — |
| BK_AUTH_TC_025 | Android | High | Yes | — |
| BK_AUTH_TC_026 | Android | High | Yes | — |
| BK_AUTH_TC_027 | Android | High | Yes | — |
| BK_AUTH_TC_030 | Android | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_031 | Android | High | Yes | — |
| BK_AUTH_TC_032 | Android | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_033 | Android | High | Yes | — |
| BK_AUTH_TC_034 | Android | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_035 | Android | High | Yes | — |
| BK_AUTH_TC_037 | Android | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_038 | Android | High | Yes | `@KnownBug` |
| BK_AUTH_TC_040 | Android | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_041 | Android | High | Yes | — |
| BK_AUTH_TC_042 | Android | High | Yes | — |
| BK_AUTH_TC_043 | Android | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_048 | Android | High | Yes | — |
| BK_AUTH_TC_050 | Android | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_055 | Android | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_061 | API | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_062 | API | High | Yes | — |
| BK_AUTH_TC_063 | API | High | Yes | — |
| BK_AUTH_TC_064 | API | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_065 | API | High | Yes | — |
| BK_AUTH_TC_066 | API | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_067 | API | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_068 | API | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_071 | API | High | Yes | — |
| BK_AUTH_TC_073 | API | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_074 | API | High | Yes | — |
| BK_AUTH_TC_075 | API | High | Yes | — |
| BK_AUTH_TC_076 | API | High | Yes | — |
| BK_AUTH_TC_077 | API | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_078 | API | High | Yes | — |
| BK_AUTH_TC_080 | API | High | Yes | `@KnownBug` |
| BK_AUTH_TC_081 | API | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_083 | API | High | Yes | — |
| BK_AUTH_TC_084 | API | High | Yes | — |
| BK_AUTH_TC_085 | API | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_088 | API | High | Yes | — |
| BK_AUTH_TC_089 | API | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_090 | API | High | Yes | `@KnownBug` |
| BK_AUTH_TC_092 | API | High | Yes | — |
| BK_AUTH_TC_093 | API | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_094 | API | High | Yes | — |
| BK_AUTH_TC_095 | API | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_096 | API | High | Yes | — |
| BK_AUTH_TC_097 | API | High | Yes | — |
| BK_AUTH_TC_098 | API | High | Yes | `@KnownBug` |
| BK_AUTH_TC_099 | API | High | Yes | `@KnownBug` |
| BK_AUTH_TC_100 | API | High | Yes | — |
| BK_AUTH_TC_102 | API | High | Yes | `@KnownBug` |
| BK_AUTH_TC_103 | API | High | Yes | `@KnownBug` |
| BK_AUTH_TC_104 | API | High | Yes | `@KnownBug` |
| BK_AUTH_TC_107 | API | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_108 | API | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_109 | Web | High | Yes | — |
| BK_AUTH_TC_110 | Web | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_113 | Web | High | Yes | — |
| BK_AUTH_TC_114 | Web | High | Yes | — |
| BK_AUTH_TC_116 | Web | High | Yes | — |
| BK_AUTH_TC_117 | Web | High | Yes | — |
| BK_AUTH_TC_119 | Web | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_122 | Web | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_123 | Web | High | Yes | — |
| BK_AUTH_TC_126 | Web | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_129 | Web | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_139 | Web | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_141 | Web | High | Yes | — |
| BK_AUTH_TC_145 | Web | High | Yes | — |
| BK_AUTH_TC_148 | Web | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_149 | Web | High | Yes | — |
| BK_AUTH_TC_150 | Web | High | Yes | — |
| BK_AUTH_TC_151 | Web | High | Yes | — |
| BK_AUTH_TC_153 | Web | High | Yes | — |
| BK_AUTH_TC_154 | Web | High | Yes | `@KnownBug` |
| BK_AUTH_TC_155 | Web | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_156 | Web | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_157 | Web | High | Yes | — |
| BK_AUTH_TC_158 | Web | High | Yes | — |
| BK_AUTH_TC_171 | Web | High | Yes | — |
| BK_AUTH_TC_172 | Web | High | Yes | — |
| BK_AUTH_TC_175 | Web | High | Yes | — |
| BK_AUTH_TC_178 | Web | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_179 | Web | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_180 | Web | High | Yes | — |
| BK_AUTH_TC_181 | Web | High | Yes | — |
| BK_AUTH_TC_182 | Web | High | Yes | — |
| BK_AUTH_TC_185 | Web | High | Yes | — |
| BK_AUTH_TC_186 | Web | High | Yes | — |
| BK_AUTH_TC_188 | Web | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_192 | Web | High | Yes | — |
| BK_AUTH_TC_193 | Web | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_194 | Android | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_198 | Android | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_199 | Android | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_200 | Android | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_201 | Android | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_209 | Android | High | Yes | — |
| BK_AUTH_TC_210 | Android | High | Yes | `@NeedsVerify` |
| BK_AUTH_TC_003 | Android | Medium | Yes | — |
| BK_AUTH_TC_009 | Android | Medium | Yes | — |
| BK_AUTH_TC_011 | Android | Medium | Yes | `@NeedsVerify` |
| BK_AUTH_TC_012 | Android | Medium | Yes | `@NeedsVerify` |
| BK_AUTH_TC_015 | Android | Medium | Yes | — |
| BK_AUTH_TC_016 | Android | Medium | Yes | `@NeedsVerify` |
| BK_AUTH_TC_017 | Android | Medium | Yes | `@NeedsVerify` |
| BK_AUTH_TC_019 | Android | Medium | Partial | `@NeedsVerify` |
| BK_AUTH_TC_028 | Android | Medium | Yes | — |
| BK_AUTH_TC_036 | Android | Medium | Yes | — |
| BK_AUTH_TC_039 | Android | Medium | Yes | `@NeedsVerify` |
| BK_AUTH_TC_044 | Android | Medium | Yes | `@NeedsVerify` |
| BK_AUTH_TC_045 | Android | Medium | Yes | `@NeedsVerify` |
| BK_AUTH_TC_047 | Android | Medium | Yes | `@NeedsVerify` |
| BK_AUTH_TC_049 | Android | Medium | Yes | — |
| BK_AUTH_TC_052 | Android | Medium | Yes | — |
| BK_AUTH_TC_053 | Android | Medium | Partial | `@NeedsVerify` |
| BK_AUTH_TC_056 | Android | Medium | Yes | — |
| BK_AUTH_TC_057 | Android | Medium | Yes | `@NeedsVerify` |
| BK_AUTH_TC_058 | Android | Medium | Yes | — |
| BK_AUTH_TC_060 | API | Medium | Yes | `@NeedsVerify` |
| BK_AUTH_TC_070 | API | Medium | Yes | `@NeedsVerify` |
| BK_AUTH_TC_072 | API | Medium | Yes | `@NeedsVerify` |
| BK_AUTH_TC_079 | API | Medium | Yes | — |
| BK_AUTH_TC_087 | API | Medium | Yes | — |
| BK_AUTH_TC_101 | API | Medium | Yes | `@NeedsVerify` |
| BK_AUTH_TC_105 | API | Medium | Yes | — |
| BK_AUTH_TC_111 | Web | Medium | Yes | — |
| BK_AUTH_TC_118 | Web | Medium | Yes | — |
| BK_AUTH_TC_120 | Web | Medium | Yes | `@NeedsVerify` |
| BK_AUTH_TC_121 | Web | Medium | Yes | `@NeedsVerify` |
| BK_AUTH_TC_124 | Web | Medium | Yes | — |
| BK_AUTH_TC_127 | Web | Medium | Yes | — |
| BK_AUTH_TC_131 | Web | Medium | Yes | `@KnownBug` |
| BK_AUTH_TC_132 | Web | Medium | Yes | — |
| BK_AUTH_TC_135 | Web | Medium | Yes | — |
| BK_AUTH_TC_136 | Web | Medium | Partial | `@NeedsVerify` |
| BK_AUTH_TC_138 | Web | Medium | Yes | `@NeedsVerify` |
| BK_AUTH_TC_142 | Web | Medium | Yes | — |
| BK_AUTH_TC_143 | Web | Medium | Yes | — |
| BK_AUTH_TC_147 | Web | Medium | Yes | — |
| BK_AUTH_TC_152 | Web | Medium | Yes | — |
| BK_AUTH_TC_160 | Web | Medium | Yes | — |
| BK_AUTH_TC_161 | Web | Medium | Yes | — |
| BK_AUTH_TC_162 | Web | Medium | Yes | — |
| BK_AUTH_TC_163 | Web | Medium | Yes | — |
| BK_AUTH_TC_164 | Web | Medium | Yes | `@NeedsVerify` |
| BK_AUTH_TC_168 | Web | Medium | Partial | `@NeedsVerify` |
| BK_AUTH_TC_169 | Web | Medium | Yes | `@NeedsVerify` |
| BK_AUTH_TC_173 | Web | Medium | Yes | — |
| BK_AUTH_TC_176 | Web | Medium | Yes | `@KnownBug` |
| BK_AUTH_TC_177 | Web | Medium | Yes | — |
| BK_AUTH_TC_183 | Web | Medium | Yes | `@KnownBug` |
| BK_AUTH_TC_187 | Web | Medium | Yes | — |
| BK_AUTH_TC_190 | Web | Medium | Yes | `@KnownBug` |
| BK_AUTH_TC_195 | Android | Medium | Yes | — |
| BK_AUTH_TC_197 | Android | Medium | Yes | — |
| BK_AUTH_TC_202 | Android | Medium | Yes | — |
| BK_AUTH_TC_205 | Android | Medium | Partial | `@KnownBug` |
| BK_AUTH_TC_207 | Android | Medium | Yes | — |
| BK_AUTH_TC_208 | Android | Medium | Partial | `@NeedsVerify` |
| BK_AUTH_TC_018 | Android | Low | Yes | `@NeedsVerify` |
| BK_AUTH_TC_046 | Android | Low | Yes | `@NeedsVerify` |
| BK_AUTH_TC_051 | Android | Low | Yes | — |
| BK_AUTH_TC_125 | Web | Low | Yes | `@NeedsVerify` |
| BK_AUTH_TC_128 | Web | Low | Yes | — |
| BK_AUTH_TC_133 | Web | Low | Yes | — |
| BK_AUTH_TC_140 | Web | Low | Yes | `@NeedsVerify` |
| BK_AUTH_TC_159 | Web | Low | Yes | — |
| BK_AUTH_TC_165 | Web | Low | Yes | `@NeedsVerify` |
| BK_AUTH_TC_166 | Web | Low | Yes | — |
| BK_AUTH_TC_167 | Web | Low | Yes | — |
| BK_AUTH_TC_170 | Web | Low | Yes | `@NeedsVerify` |
| BK_AUTH_TC_189 | Web | Low | Yes | `@NeedsVerify` |
| BK_AUTH_TC_191 | Web | Low | Yes | — |
| BK_AUTH_TC_203 | Android | Low | Yes | `@NeedsVerify` |
| BK_AUTH_TC_204 | Android | Low | Partial | `@NeedsVerify` |
| BK_AUTH_TC_206 | Android | Low | Yes | — |

</details>

## 5. Kiểm tra khác

| Hạng mục | Số lượng | Kết quả |
|---|:-:|---|
| 🔴 REQ chưa có TC | 0 | ✅ Không có |
| 🔴 REQ × nền tảng chưa có TC đúng nền tảng | 0 | ✅ Không có |
| 🟠 REQ chỉ có checklist | 0 | ✅ Không có — chưa có checklist nào cho hệ thống Book |
| ⚪ Orphan test (không map về REQ) | 0 | ✅ Không có — chưa có script automation |
| 🧩 TC trỏ tới REQ không tồn tại | 0 | ✅ Không có |
| 🗑️ TC `@Deprecated` (không tính phủ) | 0 | ✅ Không có |
| ⚠️ Mapping suy luận cần xác nhận | 0 | ✅ Không có — 100% mapping theo ID |
