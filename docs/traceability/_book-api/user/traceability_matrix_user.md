# Ma Trận Truy Vết (RTM) — Người dùng (`USER`) · hệ thống Book

> **Tóm tắt:** 131/131 REQ đã có TC (100%) · **0/160 TC có script automation** · **chưa chạy lần nào** · 15 TC `@KnownBug` chờ Dev sửa lỗi

| Thông tin | Nội dung |
|---|---|
| Ngày sinh | 20-10-2026 10:48 |
| Phạm vi | Module `USER` · Web · API · Android |
| Mốc git | `ed6525b` — TC/REQ sửa sau mốc này thì RTM đã cũ |
| Nguồn đã quét | REQ: `requirements/_book-api/user/` (131 REQ) · TC: 6 file ở `testcases/_book-api/user/` (160 TC) · Automation: không tìm thấy script (cột ẩn) · Checklist: chưa có (cột ẩn) · Kết quả chạy: chưa có (cột ẩn) · Bug: `docs/bugs/_book-api/README.md` — chưa nối được vì TC chưa chạy |
| Tổng hợp | [../traceability_matrix.md](../traceability_matrix.md) — ⬛ module ngoài tầm nhìn của RTM nằm ở đó |

## 1. Tổng quan

| Chỉ số | Tiến độ | Giá trị |
|---|---|---|
| Requirement Coverage | `▰▰▰▰▰▰▰▰▰▰` | **131/131** (100%) REQ trong phạm vi |
| Platform Coverage · Web | `▰▰▰▰▰▰▰▰▰▰` | 42/42 cặp REQ × nền tảng (100%) |
| Platform Coverage · API | `▰▰▰▰▰▰▰▰▰▰` | 81/81 cặp REQ × nền tảng (100%) |
| Platform Coverage · Android | `▰▰▰▰▰▰▰▰▰▰` | 50/50 cặp REQ × nền tảng (100%) |
| Automation Coverage | `▱▱▱▱▱▱▱▱▱▱` | **0/160** TC (0%) — chưa có script |

**Phân bổ REQ theo trạng thái:**

| ✅ Đã automate | 🟣 Automate một phần | 🟡 Thủ công | 🟠 Chỉ checklist | 🔴 Chưa có TC | ⏭️ Loại trừ |
|:-:|:-:|:-:|:-:|:-:|:-:|
| 0 | 0 | 131 | 0 | 0 | 0 |

## 2. Việc cần làm

1. ▶️ **160 TC chưa từng chạy** → `/execute-test-cases` (Web) — Android / API chạy tay theo file TC · 15 TC `@KnownBug` dự kiến FAIL, đã có bug đang mở
2. 🟡 **Bắt đầu automate:** 87 TC Critical/High đã chấm `Automation = Yes` → `/generate-automation-from-testcases`

## 3. Ma trận chi tiết

### 3.1. Danh sách · tìm kiếm · sắp xếp · phân trang (STORY-BK-USER-01)

`▰▰▰▰▰` 15/15 REQ có TC

| REQ ID | Yêu cầu | Nền tảng | TC IDs | Trạng thái |
|---|---|---|---|---|
| REQ-BK-USER-01 | Không cần đăng nhập vẫn xem được danh sách người dùng | Web · API · Android | BK_USER_TC_002, BK_USER_TC_051, BK_USER_TC_056, BK_USER_TC_150 | 🟡 Thủ công |
| REQ-BK-USER-02 | Bảng có đủ các cột | Web · Android | BK_USER_TC_001, BK_USER_TC_109 | 🟡 Thủ công |
| REQ-BK-USER-03 | Mặc định sắp theo Updated giảm dần | Web · Android | BK_USER_TC_010, BK_USER_TC_110 | 🟡 Thủ công |
| REQ-BK-USER-04 | Số dòng mỗi trang mặc định 5, có 7 lựa chọn | Web · Android | BK_USER_TC_005, BK_USER_TC_111 | 🟡 Thủ công |
| REQ-BK-USER-05 | Đổi số dòng tải lại từ trang 1 | Web · Android | BK_USER_TC_016, BK_USER_TC_119 | 🟡 Thủ công |
| REQ-BK-USER-06 | Thanh phân trang | Web · Android | BK_USER_TC_006, BK_USER_TC_112 | 🟡 Thủ công |
| REQ-BK-USER-07 | Số dòng mỗi trang trở về 5 khi rời trang rồi quay lại | Web · Android | BK_USER_TC_017, BK_USER_TC_120 | 🟡 Thủ công |
| REQ-BK-USER-08 | Tìm kiếm theo từ khoá | Web · Android | BK_USER_TC_018, BK_USER_TC_121 | 🟡 Thủ công |
| REQ-BK-USER-09 | Tìm kiếm không có kết quả | Web · Android | BK_USER_TC_019, BK_USER_TC_122, BK_USER_TC_146 | 🟡 Thủ công |
| REQ-BK-USER-10 | Bấm tiêu đề cột để sắp xếp tăng rồi giảm | Web · Android | BK_USER_TC_020, BK_USER_TC_123 | 🟡 Thủ công |
| REQ-BK-USER-120 | Tab User đang ở My Profile / Setting account quay về danh sách | Android | BK_USER_TC_142 | 🟡 Thủ công |
| REQ-BK-USER-121 | Bảng người dùng cuộn ngang, cột ⋮ luôn ở mép phải | Android | BK_USER_TC_118 | 🟡 Thủ công |
| REQ-BK-USER-125 | Mất mạng: danh sách hiện No Data, không báo lỗi mạng | Android | BK_USER_TC_147 | 🟡 Thủ công |
| REQ-BK-USER-128 | Back hệ thống ở danh sách User quay về màn hình trước | Android | BK_USER_TC_143 | 🟡 Thủ công |
| REQ-BK-USER-130 | Xoay ngang: bảng hiện nhiều cột hơn, tiêu đề cột dính khi cuộn dọc | Android | BK_USER_TC_154 | 🟡 Thủ công |

### 3.2. Bộ lọc nâng cao (STORY-BK-USER-02)

`▰▰▰▰▰` 10/10 REQ có TC

| REQ ID | Yêu cầu | Nền tảng | TC IDs | Trạng thái |
|---|---|---|---|---|
| REQ-BK-USER-11 | Icon lọc mở bảng lọc thay chỗ ô tìm kiếm | Web · Android | BK_USER_TC_021, BK_USER_TC_124 | 🟡 Thủ công |
| REQ-BK-USER-12 | Field có 7 lựa chọn, mặc định Name | Web · Android | BK_USER_TC_022, BK_USER_TC_126 | 🟡 Thủ công |
| REQ-BK-USER-13 | Operator có 5 lựa chọn, mặc định Equals | Web · Android | BK_USER_TC_023, BK_USER_TC_127 | 🟡 Thủ công |
| REQ-BK-USER-14 | Đổi Field đặt lại Operator về Equals | Web · Android | BK_USER_TC_024, BK_USER_TC_128 | 🟡 Thủ công |
| REQ-BK-USER-15 | Điều kiện lọc tự áp dụng khi nhập Value | Web · Android | BK_USER_TC_025, BK_USER_TC_130 | 🟡 Thủ công |
| REQ-BK-USER-16 | Add filter thêm điều kiện nối AND/OR | Web · Android | BK_USER_TC_026, BK_USER_TC_131 | 🟡 Thủ công |
| REQ-BK-USER-17 | Clear filter xoá điều kiện và đóng bảng lọc | Web · Android | BK_USER_TC_027, BK_USER_TC_132 | 🟡 Thủ công |
| REQ-BK-USER-18 | Icon cạnh tiêu đề cột mở bảng lọc theo cột đó | Web · Android | BK_USER_TC_028, BK_USER_TC_133 | 🟡 Thủ công |
| REQ-BK-USER-122 | Hàng điều kiện lọc cuộn ngang tới Value, Add filter, Clear filter | Android | BK_USER_TC_125 | 🟡 Thủ công |
| REQ-BK-USER-123 | Đổi Field xoá luôn Value đã nhập | Android | BK_USER_TC_129 | 🟡 Thủ công |

### 3.3. Quyền thao tác theo trạng thái đăng nhập (STORY-BK-USER-03)

`▰▰▰▰▰` 5/5 REQ có TC

| REQ ID | Yêu cầu | Nền tảng | TC IDs | Trạng thái |
|---|---|---|---|---|
| REQ-BK-USER-19 | Khách không có nút tạo và nút thao tác dòng | Web · Android | BK_USER_TC_003, BK_USER_TC_151 | 🟡 Thủ công |
| REQ-BK-USER-20 | Đã đăng nhập có nút New user và nút ⋮ mỗi dòng | Web · Android | BK_USER_TC_004, BK_USER_TC_108 | 🟡 Thủ công |
| REQ-BK-USER-21 | Dòng của chính mình có nhãn "You" | Web · Android | BK_USER_TC_029, BK_USER_TC_113 | 🟡 Thủ công |
| REQ-BK-USER-22 | Không sửa/xoá chính mình từ danh sách | Web · Android | BK_USER_TC_030, BK_USER_TC_144 | 🟡 Thủ công |
| REQ-BK-USER-23 | Menu của dòng người khác cho Edit và Delete | Web · Android | BK_USER_TC_031, BK_USER_TC_145 | 🟡 Thủ công |

### 3.4. Thêm người dùng (STORY-BK-USER-04)

`▰▰▰▰▰` 16/16 REQ có TC

| REQ ID | Yêu cầu | Nền tảng | TC IDs | Trạng thái |
|---|---|---|---|---|
| REQ-BK-USER-24 | Hộp thoại Add user có đủ thành phần | Web · Android | BK_USER_TC_007, BK_USER_TC_045, BK_USER_TC_050, BK_USER_TC_114 | 🟡 Thủ công |
| REQ-BK-USER-25 | Active for login mặc định bật | Web · Android | BK_USER_TC_008, BK_USER_TC_115 | 🟡 Thủ công |
| REQ-BK-USER-26 | Add user: bỏ trống Name bị chặn | Web · Android | BK_USER_TC_032, BK_USER_TC_134 | 🟡 Thủ công |
| REQ-BK-USER-27 | Add user: bỏ trống Email bị chặn | Web · Android | BK_USER_TC_033, BK_USER_TC_135 | 🟡 Thủ công |
| REQ-BK-USER-28 | Add user: Password bắt buộc | Web · Android | BK_USER_TC_034, BK_USER_TC_136 | 🟡 Thủ công |
| REQ-BK-USER-29 | Add user: bỏ trống Password Confirmation bị chặn | Web · Android | BK_USER_TC_035, BK_USER_TC_137 | 🟡 Thủ công |
| REQ-BK-USER-30 | Add user: Name tối đa 191 ký tự | Web · Android | BK_USER_TC_036, BK_USER_TC_037, BK_USER_TC_138, BK_USER_TC_139 | 🟡 Thủ công · REQ 🟡 đã sửa |
| REQ-BK-USER-31 | Add user: Email sai định dạng bị chặn | Web · Android | BK_USER_TC_038, BK_USER_TC_140 | 🟡 Thủ công |
| REQ-BK-USER-32 | Add user: mật khẩu xác nhận phải khớp | Web · Android | BK_USER_TC_039, BK_USER_TC_157 | 🟡 Thủ công |
| REQ-BK-USER-33 | Email đã tồn tại bị từ chối khi tạo người dùng | Web · API · Android | BK_USER_TC_040, BK_USER_TC_064, BK_USER_TC_158 | 🟡 Thủ công |
| REQ-BK-USER-34 | Tạo người dùng thành công | Web · Android | BK_USER_TC_009, BK_USER_TC_046, BK_USER_TC_047, BK_USER_TC_048, BK_USER_TC_049, BK_USER_TC_159 | 🟡 Thủ công |
| REQ-BK-USER-35 | Tài khoản vừa tạo đăng nhập được bằng mật khẩu đã đặt | Web · API · Android | BK_USER_TC_011, BK_USER_TC_057, BK_USER_TC_160 | 🟡 Thủ công |
| REQ-BK-USER-124 | Mở lại Add user hoặc Update user không mang lỗi cũ | Android | BK_USER_TC_141 | 🟡 Thủ công |
| REQ-BK-USER-126 | Dữ liệu Add user giữ nguyên khi app xuống nền | Android | BK_USER_TC_148 | 🟡 Thủ công |
| REQ-BK-USER-127 | Bàn phím không che ô đang nhập và nút Save của Add user | Android | BK_USER_TC_149 | 🟡 Thủ công |
| REQ-BK-USER-131 | Xoay ngang khi đang mở Add user: dữ liệu giữ nguyên, hộp thoại chia 2 cột | Android | BK_USER_TC_156 | 🟡 Thủ công |

### 3.5. Sửa người dùng · khoá/mở (STORY-BK-USER-05)

`▰▰▰▰▰` 6/6 REQ có TC

| REQ ID | Yêu cầu | Nền tảng | TC IDs | Trạng thái |
|---|---|---|---|---|
| REQ-BK-USER-36 | Hộp thoại Update user điền sẵn dữ liệu | Web · Android | BK_USER_TC_012, BK_USER_TC_116 | 🟡 Thủ công |
| REQ-BK-USER-37 | Cập nhật thành công | Web | BK_USER_TC_013, BK_USER_TC_049 | 🟡 Thủ công |
| REQ-BK-USER-38 | Để trống mật khẩu khi cập nhật thì mật khẩu không đổi | Web · API | BK_USER_TC_041, BK_USER_TC_072 | 🟡 Thủ công |
| REQ-BK-USER-39 | Tắt Active for login đánh dấu người dùng Inactive | Web | BK_USER_TC_042, BK_USER_TC_049 | 🟡 Thủ công |
| REQ-BK-USER-40 | Bật lại Active for login cho đăng nhập lại | Web | BK_USER_TC_043, BK_USER_TC_049 | 🟡 Thủ công |
| REQ-BK-USER-129 | Update user trên Android lưu thành công | Android | BK_USER_TC_152, BK_USER_TC_155 | 🟡 Thủ công |

### 3.6. Xoá người dùng (STORY-BK-USER-06)

`▰▰▰▰▰` 2/2 REQ có TC

| REQ ID | Yêu cầu | Nền tảng | TC IDs | Trạng thái |
|---|---|---|---|---|
| REQ-BK-USER-41 | Xoá cần xác nhận | Web · Android | BK_USER_TC_014, BK_USER_TC_044, BK_USER_TC_117 | 🟡 Thủ công |
| REQ-BK-USER-42 | Xác nhận xoá gỡ người dùng khỏi danh sách | Web · Android | BK_USER_TC_015, BK_USER_TC_049, BK_USER_TC_153 | 🟡 Thủ công |

### 3.7. Danh sách · tìm kiếm · sắp xếp · phân trang — API (STORY-BK-USER-07)

`▰▰▰▰▰` 27/27 REQ có TC

| REQ ID | Yêu cầu | Nền tảng | TC IDs | Trạng thái |
|---|---|---|---|---|
| REQ-BK-USER-43 | Danh sách trả `list` và `pagination` đúng hình dạng | API | BK_USER_TC_051 | 🟡 Thủ công |
| REQ-BK-USER-44 | Danh sách và chi tiết không lộ mật khẩu hay khoá ngoài schema | API | BK_USER_TC_056, BK_USER_TC_069 | 🟡 Thủ công |
| REQ-BK-USER-45 | Mặc định `limit`=10 · `page`=1 · sắp `updatedAt` giảm dần | API | BK_USER_TC_082 | 🟡 Thủ công |
| REQ-BK-USER-46 | `limit` cắt đúng số bản ghi và tính `totalPage` | API | BK_USER_TC_052 | 🟡 Thủ công |
| REQ-BK-USER-47 | `limit` ngoài khoảng [1 ; 10000] bị từ chối | API | BK_USER_TC_055 | 🟡 Thủ công |
| REQ-BK-USER-48 | `limit` = 10000 hợp lệ (biên trên) | API | BK_USER_TC_055 | 🟡 Thủ công |
| REQ-BK-USER-49 | `limit` sai kiểu bị từ chối | API | BK_USER_TC_055 | 🟡 Thủ công |
| REQ-BK-USER-50 | `page` chuyển sang trang khác trả bản ghi khác | API | BK_USER_TC_052 | 🟡 Thủ công |
| REQ-BK-USER-51 | `page` < 1 bị từ chối | API | BK_USER_TC_055 | 🟡 Thủ công |
| REQ-BK-USER-52 | `page` sai kiểu bị từ chối | API | BK_USER_TC_055 | 🟡 Thủ công |
| REQ-BK-USER-53 | `page` vượt tổng số trang trả danh sách rỗng, không lỗi | API | BK_USER_TC_055 | 🟡 Thủ công |
| REQ-BK-USER-54 | `sort` nhận 7 giá trị, `sortBy` sắp đúng chiều | API | BK_USER_TC_053 | 🟡 Thủ công |
| REQ-BK-USER-55 | `sort` ngoài enum bị từ chối | API | BK_USER_TC_053 | 🟡 Thủ công |
| REQ-BK-USER-56 | `sortBy` chỉ nhận `asc` hoặc `desc` | API | BK_USER_TC_053 | 🟡 Thủ công |
| REQ-BK-USER-57 | `search` chuỗi thường khớp tên · email · điện thoại · địa chỉ, không phân biệt hoa thường | API | BK_USER_TC_054 | 🟡 Thủ công |
| REQ-BK-USER-58 | `search` không có kết quả trả danh sách rỗng, không lỗi | API | BK_USER_TC_083 | 🟡 Thủ công |
| REQ-BK-USER-59 | `search` JSON: một điều kiện với 5 toán tử | API | BK_USER_TC_084 | 🟡 Thủ công |
| REQ-BK-USER-60 | `search` JSON: `AND` nhiều điều kiện là giao | API | BK_USER_TC_085 | 🟡 Thủ công |
| REQ-BK-USER-61 | `search` JSON: `OR` là hợp | API | BK_USER_TC_085 | 🟡 Thủ công |
| REQ-BK-USER-62 | `search` JSON: lọc theo `isActive` (boolean) | API | BK_USER_TC_086 | 🟡 Thủ công |
| REQ-BK-USER-63 | `search` JSON: lọc theo ngày `createdAt` | API | BK_USER_TC_086 | 🟡 Thủ công |
| REQ-BK-USER-64 | `search` JSON sai cú pháp được coi là chuỗi thường | API | BK_USER_TC_083 | 🟡 Thủ công |
| REQ-BK-USER-65 | `search` JSON tham chiếu trường hoặc toán tử không tồn tại bị từ chối | API | BK_USER_TC_087 | 🟡 Thủ công |
| REQ-BK-USER-116 | Bộ lọc `search` chỉ nhận 9 trường công khai của người dùng | API | BK_USER_TC_089 | 🟡 Thủ công |
| REQ-BK-USER-117 | Body lỗi 400 của bộ lọc không lộ thông tin nội bộ | API | BK_USER_TC_088 | 🟡 Thủ công |
| REQ-BK-USER-118 | `lengthData` bằng số phần tử thực trả về | API | BK_USER_TC_090 | 🟡 Thủ công |
| REQ-BK-USER-119 | `limit` phải là số nguyên | API | BK_USER_TC_090 | 🟡 Thủ công |

### 3.8. Chi tiết người dùng — API (STORY-BK-USER-08)

`▰▰▰▰▰` 3/3 REQ có TC

| REQ ID | Yêu cầu | Nền tảng | TC IDs | Trạng thái |
|---|---|---|---|---|
| REQ-BK-USER-66 | Chi tiết người dùng trả đủ 9 khoá | API | BK_USER_TC_067, BK_USER_TC_069 | 🟡 Thủ công |
| REQ-BK-USER-67 | Endpoint đọc công khai bỏ qua header `Authorization` | API | BK_USER_TC_067 | 🟡 Thủ công |
| REQ-BK-USER-68 | `id` không tồn tại trả 404 | API | BK_USER_TC_068 | 🟡 Thủ công |

### 3.9. Tạo người dùng — API (STORY-BK-USER-09)

`▰▰▰▰▰` 22/22 REQ có TC

| REQ ID | Yêu cầu | Nền tảng | TC IDs | Trạng thái |
|---|---|---|---|---|
| REQ-BK-USER-69 | Tạo người dùng thành công | API | BK_USER_TC_057 | 🟡 Thủ công |
| REQ-BK-USER-70 | Người dùng vừa tạo đọc lại được với đúng dữ liệu | API | BK_USER_TC_057 | 🟡 Thủ công |
| REQ-BK-USER-71 | Tạo người dùng khi không có header xác thực hợp lệ bị từ chối | API | BK_USER_TC_058 | 🟡 Thủ công |
| REQ-BK-USER-72 | Tạo người dùng với token không hợp lệ bị từ chối | API | BK_USER_TC_058 | 🟡 Thủ công |
| REQ-BK-USER-73 | Thiếu `name` bị từ chối | API | BK_USER_TC_060 | 🟡 Thủ công |
| REQ-BK-USER-74 | `name` sai kiểu bị từ chối | API | BK_USER_TC_060 | 🟡 Thủ công |
| REQ-BK-USER-75 | `name` rỗng bị từ chối | API | BK_USER_TC_092 | 🟡 Thủ công |
| REQ-BK-USER-76 | `name` tối đa 191 ký tự | API | BK_USER_TC_091 | 🟡 Thủ công |
| REQ-BK-USER-77 | Thiếu `email` bị từ chối với lỗi thiếu field | API | BK_USER_TC_061 | 🟡 Thủ công |
| REQ-BK-USER-78 | `email` sai định dạng bị từ chối | API | BK_USER_TC_063 | 🟡 Thủ công |
| REQ-BK-USER-79 | Thiếu `password` bị từ chối | API | BK_USER_TC_062 | 🟡 Thủ công |
| REQ-BK-USER-80 | `password` rỗng không tạo được tài khoản | API | BK_USER_TC_093 | 🟡 Thủ công |
| REQ-BK-USER-81 | `password` sai kiểu bị từ chối | API | BK_USER_TC_093 | 🟡 Thủ công |
| REQ-BK-USER-82 | `isActive` mặc định là `true` | API | BK_USER_TC_094 | 🟡 Thủ công |
| REQ-BK-USER-83 | Tạo người dùng với `isActive=false` cho người dùng Inactive | API | BK_USER_TC_094 | 🟡 Thủ công |
| REQ-BK-USER-84 | `isActive` sai kiểu bị từ chối | API | BK_USER_TC_094 | 🟡 Thủ công |
| REQ-BK-USER-85 | `phone` · `address` · `avatarUrl` là chuỗi tự do, lưu nguyên | API | BK_USER_TC_095 | 🟡 Thủ công |
| REQ-BK-USER-86 | Tạo người dùng nhận đủ 3 content-type khai trong spec | API | BK_USER_TC_059 | 🟡 Thủ công |
| REQ-BK-USER-87 | Body JSON sai cú pháp bị từ chối, body lỗi **không** phải JSON | API | BK_USER_TC_096 | 🟡 Thủ công |
| REQ-BK-USER-88 | Trường ngoài schema bị bỏ qua | API | BK_USER_TC_065 | 🟡 Thủ công |
| REQ-BK-USER-89 | Chuỗi tấn công và Unicode ở `name` lưu nguyên văn | API | BK_USER_TC_066 | 🟡 Thủ công |
| REQ-BK-USER-90 | Không có token thì bị từ chối trước cả kiểm tra dữ liệu | API | BK_USER_TC_097 | 🟡 Thủ công |

### 3.10. Sửa người dùng — API (STORY-BK-USER-10)

`▰▰▰▰▰` 19/19 REQ có TC

| REQ ID | Yêu cầu | Nền tảng | TC IDs | Trạng thái |
|---|---|---|---|---|
| REQ-BK-USER-91 | Cập nhật thành công khi gửi kèm `email` hiện tại | API | BK_USER_TC_070 | 🟡 Thủ công |
| REQ-BK-USER-92 | Cập nhật một phần không cần gửi `email` | API | BK_USER_TC_071 | 🟡 Thủ công |
| REQ-BK-USER-93 | Đổi email sang email mới | API | BK_USER_TC_098 | 🟡 Thủ công |
| REQ-BK-USER-94 | Đổi sang email của người dùng khác bị từ chối | API | BK_USER_TC_098 | 🟡 Thủ công |
| REQ-BK-USER-95 | Gửi lại email của chính mình khác hoa/thường được chấp nhận | API | BK_USER_TC_098 | 🟡 Thủ công |
| REQ-BK-USER-96 | `email` sai định dạng bị từ chối | API | BK_USER_TC_077 | 🟡 Thủ công |
| REQ-BK-USER-97 | Đổi mật khẩu: mật khẩu mới đăng nhập được | API | BK_USER_TC_099 | 🟡 Thủ công |
| REQ-BK-USER-98 | Mật khẩu cũ bị từ chối sau khi đổi | API | BK_USER_TC_099 | 🟡 Thủ công |
| REQ-BK-USER-99 | `isActive=false` khoá đăng nhập | API | BK_USER_TC_073 | 🟡 Thủ công |
| REQ-BK-USER-100 | `isActive=true` mở lại đăng nhập | API | BK_USER_TC_073 | 🟡 Thủ công |
| REQ-BK-USER-101 | `phone` · `address` · `avatarUrl` cập nhật được | API | BK_USER_TC_100 | 🟡 Thủ công |
| REQ-BK-USER-102 | Sửa người dùng khi không có / sai token bị từ chối | API | BK_USER_TC_074 | 🟡 Thủ công |
| REQ-BK-USER-103 | Sửa `id` không tồn tại trả 404 | API | BK_USER_TC_075 | 🟡 Thủ công |
| REQ-BK-USER-104 | Người dùng đã đăng nhập sửa được người dùng khác | API | BK_USER_TC_076 | 🟡 Thủ công |
| REQ-BK-USER-105 | Người dùng sửa được chính mình qua API | API | BK_USER_TC_101 | 🟡 Thủ công |
| REQ-BK-USER-106 | Trường ngoài schema bị bỏ qua khi sửa | API | BK_USER_TC_102 | 🟡 Thủ công |
| REQ-BK-USER-107 | Sửa người dùng nhận đủ 3 content-type | API | BK_USER_TC_103 | 🟡 Thủ công |
| REQ-BK-USER-108 | `name` tối đa 191 ký tự khi sửa | API | BK_USER_TC_104 | 🟡 Thủ công |
| REQ-BK-USER-109 | Sửa người dùng thu hồi refresh token cũ của họ | API | BK_USER_TC_105 | 🟡 Thủ công |

### 3.11. Xoá người dùng — API (STORY-BK-USER-11)

`▰▰▰▰▰` 5/5 REQ có TC

| REQ ID | Yêu cầu | Nền tảng | TC IDs | Trạng thái |
|---|---|---|---|---|
| REQ-BK-USER-110 | Xoá người dùng thành công | API | BK_USER_TC_078 | 🟡 Thủ công |
| REQ-BK-USER-111 | Xoá người dùng khi không có / sai token bị từ chối | API | BK_USER_TC_079 | 🟡 Thủ công |
| REQ-BK-USER-112 | Xoá `id` không tồn tại, và xoá lần thứ hai, trả 404 | API | BK_USER_TC_080 | 🟡 Thủ công |
| REQ-BK-USER-113 | Xoá người dùng xoá luôn refresh token của họ | API | BK_USER_TC_106 | 🟡 Thủ công |
| REQ-BK-USER-114 | Người dùng đã đăng nhập xoá được người dùng khác | API | BK_USER_TC_081 | 🟡 Thủ công |

### 3.12. Quy ước chung của module — API (STORY-BK-USER-12)

`▰▰▰▰▰` 1/1 REQ có TC

| REQ ID | Yêu cầu | Nền tảng | TC IDs | Trạng thái |
|---|---|---|---|---|
| REQ-BK-USER-115 | Body lỗi kiểm tra dữ liệu có hình dạng `msg` + `fields` | API | BK_USER_TC_107 | 🟡 Thủ công |

## 4. 🟡 TC chưa automate

| Priority | Automation = Yes | Partial | No | Tổng |
|---|:-:|:-:|:-:|:-:|
| Critical | 10 | 0 | 0 | 10 |
| High | 77 | 0 | 0 | 77 |
| Medium | 63 | 2 | 0 | 65 |
| Low | 8 | 0 | 0 | 8 |
| **Tổng** | **158** | **2** | **0** | **160** |

<details><summary>Danh sách đầy đủ 160 TC (xếp theo Priority)</summary>

| TC ID | Nền tảng | Priority | Automation dự kiến | Ghi chú |
|---|---|---|---|---|
| BK_USER_TC_003 | Web | Critical | Yes | — |
| BK_USER_TC_009 | Web | Critical | Yes | — |
| BK_USER_TC_013 | Web | Critical | Yes | — |
| BK_USER_TC_015 | Web | Critical | Yes | — |
| BK_USER_TC_051 | API | Critical | Yes | — |
| BK_USER_TC_057 | API | Critical | Yes | — |
| BK_USER_TC_117 | Android | Critical | Yes | — |
| BK_USER_TC_152 | Android | Critical | Yes | `@KnownBug` |
| BK_USER_TC_153 | Android | Critical | Yes | — |
| BK_USER_TC_159 | Android | Critical | Yes | `@NeedsVerify` |
| BK_USER_TC_001 | Web | High | Yes | — |
| BK_USER_TC_002 | Web | High | Yes | — |
| BK_USER_TC_004 | Web | High | Yes | — |
| BK_USER_TC_007 | Web | High | Yes | — |
| BK_USER_TC_011 | Web | High | Yes | — |
| BK_USER_TC_012 | Web | High | Yes | — |
| BK_USER_TC_014 | Web | High | Yes | — |
| BK_USER_TC_018 | Web | High | Yes | `@NeedsVerify` |
| BK_USER_TC_025 | Web | High | Yes | `@NeedsVerify` |
| BK_USER_TC_030 | Web | High | Yes | — |
| BK_USER_TC_031 | Web | High | Yes | — |
| BK_USER_TC_032 | Web | High | Yes | — |
| BK_USER_TC_033 | Web | High | Yes | — |
| BK_USER_TC_034 | Web | High | Yes | — |
| BK_USER_TC_035 | Web | High | Yes | — |
| BK_USER_TC_036 | Web | High | Yes | — |
| BK_USER_TC_037 | Web | High | Yes | `@KnownBug` · `@NeedsVerify` |
| BK_USER_TC_038 | Web | High | Yes | `@NeedsVerify` |
| BK_USER_TC_039 | Web | High | Yes | — |
| BK_USER_TC_040 | Web | High | Yes | — |
| BK_USER_TC_041 | Web | High | Yes | — |
| BK_USER_TC_042 | Web | High | Yes | — |
| BK_USER_TC_043 | Web | High | Yes | — |
| BK_USER_TC_049 | Web | High | Yes | — |
| BK_USER_TC_052 | API | High | Yes | — |
| BK_USER_TC_056 | API | High | Yes | — |
| BK_USER_TC_058 | API | High | Yes | — |
| BK_USER_TC_060 | API | High | Yes | — |
| BK_USER_TC_061 | API | High | Yes | `@KnownBug` |
| BK_USER_TC_062 | API | High | Yes | `@KnownBug` |
| BK_USER_TC_063 | API | High | Yes | — |
| BK_USER_TC_064 | API | High | Yes | — |
| BK_USER_TC_065 | API | High | Yes | — |
| BK_USER_TC_066 | API | High | Yes | — |
| BK_USER_TC_069 | API | High | Yes | — |
| BK_USER_TC_070 | API | High | Yes | — |
| BK_USER_TC_071 | API | High | Yes | `@KnownBug` |
| BK_USER_TC_072 | API | High | Yes | — |
| BK_USER_TC_073 | API | High | Yes | — |
| BK_USER_TC_074 | API | High | Yes | — |
| BK_USER_TC_076 | API | High | Yes | — |
| BK_USER_TC_078 | API | High | Yes | — |
| BK_USER_TC_079 | API | High | Yes | — |
| BK_USER_TC_081 | API | High | Yes | — |
| BK_USER_TC_084 | API | High | Yes | — |
| BK_USER_TC_089 | API | High | Yes | `@KnownBug` |
| BK_USER_TC_092 | API | High | Yes | `@KnownBug` |
| BK_USER_TC_093 | API | High | Yes | — |
| BK_USER_TC_094 | API | High | Yes | — |
| BK_USER_TC_098 | API | High | Yes | — |
| BK_USER_TC_099 | API | High | Yes | — |
| BK_USER_TC_102 | API | High | Yes | — |
| BK_USER_TC_105 | API | High | Yes | `@KnownBug` |
| BK_USER_TC_106 | API | High | Yes | — |
| BK_USER_TC_108 | Android | High | Yes | — |
| BK_USER_TC_109 | Android | High | Yes | `@NeedsVerify` |
| BK_USER_TC_114 | Android | High | Yes | — |
| BK_USER_TC_116 | Android | High | Yes | — |
| BK_USER_TC_121 | Android | High | Yes | `@NeedsVerify` |
| BK_USER_TC_130 | Android | High | Yes | `@NeedsVerify` |
| BK_USER_TC_134 | Android | High | Yes | — |
| BK_USER_TC_135 | Android | High | Yes | — |
| BK_USER_TC_136 | Android | High | Yes | — |
| BK_USER_TC_137 | Android | High | Yes | — |
| BK_USER_TC_138 | Android | High | Yes | — |
| BK_USER_TC_139 | Android | High | Yes | `@KnownBug` |
| BK_USER_TC_140 | Android | High | Yes | `@NeedsVerify` |
| BK_USER_TC_141 | Android | High | Yes | `@KnownBug` |
| BK_USER_TC_144 | Android | High | Yes | — |
| BK_USER_TC_145 | Android | High | Yes | — |
| BK_USER_TC_146 | Android | High | Yes | `@NeedsVerify` |
| BK_USER_TC_150 | Android | High | Yes | — |
| BK_USER_TC_151 | Android | High | Yes | — |
| BK_USER_TC_155 | Android | High | Yes | `@KnownBug` |
| BK_USER_TC_157 | Android | High | Yes | `@NeedsVerify` |
| BK_USER_TC_158 | Android | High | Yes | `@NeedsVerify` |
| BK_USER_TC_160 | Android | High | Yes | `@NeedsVerify` |
| BK_USER_TC_005 | Web | Medium | Yes | — |
| BK_USER_TC_006 | Web | Medium | Yes | — |
| BK_USER_TC_008 | Web | Medium | Yes | — |
| BK_USER_TC_010 | Web | Medium | Yes | — |
| BK_USER_TC_016 | Web | Medium | Yes | `@NeedsVerify` |
| BK_USER_TC_019 | Web | Medium | Yes | — |
| BK_USER_TC_020 | Web | Medium | Yes | `@NeedsVerify` |
| BK_USER_TC_021 | Web | Medium | Yes | — |
| BK_USER_TC_022 | Web | Medium | Yes | — |
| BK_USER_TC_023 | Web | Medium | Yes | `@NeedsVerify` |
| BK_USER_TC_026 | Web | Medium | Yes | `@NeedsVerify` |
| BK_USER_TC_027 | Web | Medium | Yes | — |
| BK_USER_TC_029 | Web | Medium | Yes | — |
| BK_USER_TC_044 | Web | Medium | Yes | — |
| BK_USER_TC_045 | Web | Medium | Yes | `@NeedsVerify` |
| BK_USER_TC_046 | Web | Medium | Partial | `@NeedsVerify` |
| BK_USER_TC_047 | Web | Medium | Yes | `@NeedsVerify` |
| BK_USER_TC_048 | Web | Medium | Yes | `@NeedsVerify` |
| BK_USER_TC_053 | API | Medium | Yes | — |
| BK_USER_TC_054 | API | Medium | Yes | — |
| BK_USER_TC_055 | API | Medium | Yes | — |
| BK_USER_TC_059 | API | Medium | Yes | — |
| BK_USER_TC_067 | API | Medium | Yes | — |
| BK_USER_TC_068 | API | Medium | Yes | — |
| BK_USER_TC_075 | API | Medium | Yes | — |
| BK_USER_TC_077 | API | Medium | Yes | — |
| BK_USER_TC_080 | API | Medium | Yes | — |
| BK_USER_TC_082 | API | Medium | Yes | — |
| BK_USER_TC_083 | API | Medium | Yes | — |
| BK_USER_TC_085 | API | Medium | Yes | — |
| BK_USER_TC_086 | API | Medium | Yes | — |
| BK_USER_TC_087 | API | Medium | Yes | — |
| BK_USER_TC_088 | API | Medium | Yes | `@KnownBug` |
| BK_USER_TC_090 | API | Medium | Yes | `@KnownBug` |
| BK_USER_TC_091 | API | Medium | Yes | — |
| BK_USER_TC_096 | API | Medium | Yes | — |
| BK_USER_TC_097 | API | Medium | Yes | `@KnownBug` |
| BK_USER_TC_101 | API | Medium | Yes | — |
| BK_USER_TC_103 | API | Medium | Yes | — |
| BK_USER_TC_104 | API | Medium | Yes | — |
| BK_USER_TC_107 | API | Medium | Yes | — |
| BK_USER_TC_110 | Android | Medium | Yes | — |
| BK_USER_TC_111 | Android | Medium | Yes | — |
| BK_USER_TC_112 | Android | Medium | Yes | — |
| BK_USER_TC_113 | Android | Medium | Yes | — |
| BK_USER_TC_115 | Android | Medium | Partial | — |
| BK_USER_TC_118 | Android | Medium | Yes | — |
| BK_USER_TC_119 | Android | Medium | Yes | `@NeedsVerify` |
| BK_USER_TC_122 | Android | Medium | Yes | — |
| BK_USER_TC_123 | Android | Medium | Yes | — |
| BK_USER_TC_124 | Android | Medium | Yes | — |
| BK_USER_TC_125 | Android | Medium | Yes | — |
| BK_USER_TC_126 | Android | Medium | Yes | — |
| BK_USER_TC_127 | Android | Medium | Yes | `@NeedsVerify` |
| BK_USER_TC_128 | Android | Medium | Yes | — |
| BK_USER_TC_129 | Android | Medium | Yes | — |
| BK_USER_TC_131 | Android | Medium | Yes | — |
| BK_USER_TC_132 | Android | Medium | Yes | — |
| BK_USER_TC_142 | Android | Medium | Yes | `@KnownBug` · `@NeedsVerify` |
| BK_USER_TC_143 | Android | Medium | Yes | — |
| BK_USER_TC_147 | Android | Medium | Yes | — |
| BK_USER_TC_148 | Android | Medium | Yes | — |
| BK_USER_TC_149 | Android | Medium | Yes | — |
| BK_USER_TC_154 | Android | Medium | Yes | — |
| BK_USER_TC_156 | Android | Medium | Yes | — |
| BK_USER_TC_017 | Web | Low | Yes | — |
| BK_USER_TC_024 | Web | Low | Yes | — |
| BK_USER_TC_028 | Web | Low | Yes | `@NeedsVerify` |
| BK_USER_TC_050 | Web | Low | Yes | `@NeedsVerify` |
| BK_USER_TC_095 | API | Low | Yes | — |
| BK_USER_TC_100 | API | Low | Yes | — |
| BK_USER_TC_120 | Android | Low | Yes | — |
| BK_USER_TC_133 | Android | Low | Yes | `@NeedsVerify` |

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
