# Ma Trận Truy Vết (RTM) — Khách hàng (`CUST`)

> **Tóm tắt:** 84/84 REQ trong phạm vi đã có TC · **0/129 TC có script automation** · **chưa có lần chạy nào**

| Thông tin | Nội dung |
|---|---|
| Ngày sinh | 14-10-2026 02:34 |
| Phạm vi | Module `CUST` · web |
| Mốc git | `501decf` — TC/script sửa sau mốc này thì RTM đã cũ |
| Nguồn đã quét | REQ: `requirements/customers/` (84 REQ) · TC: `testcases/customers/web/parts/ (5 part)` (129 TC) · Automation: **không tìm thấy script** — ẩn cột `Automation` · Checklist: chưa có — ẩn cột `Checklist` · Kết quả chạy: chưa có — ẩn cột `Kết quả gần nhất` |
| Tổng hợp | [../traceability_matrix.md](../traceability_matrix.md) — ⬛ module ngoài tầm nhìn của RTM nằm ở đó |

## 1. Tổng quan

| Chỉ số | Tiến độ | Giá trị |
|---|---|---|
| Requirement Coverage | `▰▰▰▰▰▰▰▰▰▰` | **84/84** (100%) REQ trong phạm vi |
| Platform Coverage · web | `▰▰▰▰▰▰▰▰▰▰` | 84/84 cặp REQ × nền tảng |
| Automation Coverage | `▱▱▱▱▱▱▱▱▱▱` | **0/129** TC (0%) |

**Phân bổ REQ theo trạng thái:**

| ✅ Đã automate | 🟣 Automate một phần | 🟡 Thủ công | 🟠 Chỉ checklist | 🔴 Chưa có TC | ⏭️ Loại trừ |
|:-:|:-:|:-:|:-:|:-:|:-:|
| 0 | 0 | 84 | 0 | 0 | 0 |

## 2. Việc cần làm

1. ▶️ **129 TC chưa từng chạy** → `/execute-test-cases`
2. 🟡 **Bắt đầu automate:** 41 TC Critical/High đã chấm `Automation = Yes` (danh sách ở mục 4) → `/generate-automation-from-testcases`

## 3. Ma trận chi tiết

### 3.1. Danh sách khách hàng (STORY-CUST-01)

`▰▰▰▰▰` 10/10 REQ có TC

| REQ ID | Yêu cầu | TC IDs | Trạng thái |
|---|---|---|---|
| REQ-CUST-01 | Truy cập màn hình danh sách khách hàng | CRM_CUST_TC_001, CRM_CUST_TC_113, CRM_CUST_TC_114, CRM_CUST_TC_115, CRM_CUST_TC_127 | 🟡 Thủ công |
| REQ-CUST-02 | Bảng tổng quan Customers Summary | CRM_CUST_TC_002, CRM_CUST_TC_004 | 🟡 Thủ công |
| REQ-CUST-03 | Cấu trúc cột bảng danh sách | CRM_CUST_TC_003, CRM_CUST_TC_125 | 🟡 Thủ công |
| REQ-CUST-04 | Sắp xếp theo cột | CRM_CUST_TC_003, CRM_CUST_TC_017, CRM_CUST_TC_018 | 🟡 Thủ công |
| REQ-CUST-05 | Chọn số dòng mỗi trang | CRM_CUST_TC_003, CRM_CUST_TC_019, CRM_CUST_TC_128 | 🟡 Thủ công |
| REQ-CUST-06 | Phân trang danh sách | CRM_CUST_TC_003, CRM_CUST_TC_004, CRM_CUST_TC_020 | 🟡 Thủ công |
| REQ-CUST-07 | Nạp dữ liệu phía máy chủ | CRM_CUST_TC_020, CRM_CUST_TC_128 | 🟡 Thủ công |
| REQ-CUST-08 | Thanh công cụ màn hình danh sách | CRM_CUST_TC_002, CRM_CUST_TC_115 | 🟡 Thủ công |
| REQ-CUST-09 | Thao tác nhanh trên từng dòng | CRM_CUST_TC_004, CRM_CUST_TC_014, CRM_CUST_TC_115 | 🟡 Thủ công |
| REQ-CUST-10 | Nạp lại bảng không tải lại trang | CRM_CUST_TC_003, CRM_CUST_TC_024 | 🟡 Thủ công |

### 3.2. Tìm kiếm & bộ lọc (STORY-CUST-02)

`▰▰▰▰▰` 7/7 REQ có TC

| REQ ID | Yêu cầu | TC IDs | Trạng thái |
|---|---|---|---|
| REQ-CUST-11 | Tìm kiếm nhanh trên bảng | CRM_CUST_TC_003, CRM_CUST_TC_011, CRM_CUST_TC_021, CRM_CUST_TC_023, CRM_CUST_TC_112 | 🟡 Thủ công |
| REQ-CUST-12 | Hiển thị số bản ghi sau khi lọc | CRM_CUST_TC_021 | 🟡 Thủ công |
| REQ-CUST-13 | Không tìm thấy kết quả | CRM_CUST_TC_022 | 🟡 Thủ công |
| REQ-CUST-14 | Bộ lọc tuỳ biến theo điều kiện | CRM_CUST_TC_026, CRM_CUST_TC_027, CRM_CUST_TC_028 | 🟡 Thủ công |
| REQ-CUST-15 | Chọn kiểu khớp điều kiện | CRM_CUST_TC_028 | 🟡 Thủ công |
| REQ-CUST-16 | Lưu bộ lọc để dùng lại | CRM_CUST_TC_026, CRM_CUST_TC_029 | 🟡 Thủ công |
| REQ-CUST-17 | Danh sách bộ lọc đã lưu | CRM_CUST_TC_025 | 🟡 Thủ công |

### 3.3. Xuất dữ liệu & thao tác hàng loạt (STORY-CUST-03)

`▰▰▰▰▰` 5/5 REQ có TC

| REQ ID | Yêu cầu | TC IDs | Trạng thái |
|---|---|---|---|
| REQ-CUST-18 | Xuất danh sách khách hàng | CRM_CUST_TC_030, CRM_CUST_TC_031, CRM_CUST_TC_032, CRM_CUST_TC_115 | 🟡 Thủ công |
| REQ-CUST-19 | Cột chọn không nằm trong dữ liệu xuất | CRM_CUST_TC_031 | 🟡 Thủ công |
| REQ-CUST-20 | Chọn nhiều khách hàng | CRM_CUST_TC_033 | 🟡 Thủ công |
| REQ-CUST-21 | Mở hộp thoại thao tác hàng loạt | CRM_CUST_TC_034, CRM_CUST_TC_038, CRM_CUST_TC_115 | 🟡 Thủ công |
| REQ-CUST-22 | Nội dung thao tác hàng loạt | CRM_CUST_TC_034, CRM_CUST_TC_035, CRM_CUST_TC_036, CRM_CUST_TC_037 | 🟡 Thủ công |

### 3.4. Tạo khách hàng mới (STORY-CUST-04)

`▰▰▰▰▰` 12/12 REQ có TC

| REQ ID | Yêu cầu | TC IDs | Trạng thái |
|---|---|---|---|
| REQ-CUST-23 | Truy cập biểu mẫu thêm khách hàng | CRM_CUST_TC_005, CRM_CUST_TC_008, CRM_CUST_TC_121 | 🟡 Thủ công |
| REQ-CUST-24 | Biểu mẫu chia 2 tab ở chế độ tạo mới | CRM_CUST_TC_005 | 🟡 Thủ công |
| REQ-CUST-25 | Company là trường bắt buộc duy nhất | CRM_CUST_TC_005, CRM_CUST_TC_009, CRM_CUST_TC_043, CRM_CUST_TC_044, CRM_CUST_TC_045, CRM_CUST_TC_046, CRM_CUST_TC_047 | 🟡 Thủ công |
| REQ-CUST-26 | Con trỏ đặt sẵn ở ô Company | CRM_CUST_TC_005, CRM_CUST_TC_126 | 🟡 Thủ công |
| REQ-CUST-27 | Các trường thông tin khách hàng | CRM_CUST_TC_005, CRM_CUST_TC_010, CRM_CUST_TC_050, CRM_CUST_TC_051, CRM_CUST_TC_052, CRM_CUST_TC_054, CRM_CUST_TC_055, CRM_CUST_TC_056, CRM_CUST_TC_125, CRM_CUST_TC_126 | 🟡 Thủ công |
| REQ-CUST-28 | Gán nhiều nhóm cho khách hàng | CRM_CUST_TC_006, CRM_CUST_TC_057, CRM_CUST_TC_058 | 🟡 Thủ công |
| REQ-CUST-29 | Tạo nhanh nhóm khách hàng ngay trên biểu mẫu | CRM_CUST_TC_059, CRM_CUST_TC_060, CRM_CUST_TC_121 | 🟡 Thủ công |
| REQ-CUST-30 | Chọn tiền tệ cho khách hàng | CRM_CUST_TC_006, CRM_CUST_TC_061 | 🟡 Thủ công |
| REQ-CUST-31 | Chọn ngôn ngữ mặc định cho khách hàng | CRM_CUST_TC_006, CRM_CUST_TC_062 | 🟡 Thủ công |
| REQ-CUST-32 | Chọn quốc gia | CRM_CUST_TC_006, CRM_CUST_TC_063 | 🟡 Thủ công |
| REQ-CUST-33 | Lưu khách hàng mới | CRM_CUST_TC_009, CRM_CUST_TC_010, CRM_CUST_TC_011, CRM_CUST_TC_043, CRM_CUST_TC_044, CRM_CUST_TC_107, CRM_CUST_TC_109, CRM_CUST_TC_111, CRM_CUST_TC_112, CRM_CUST_TC_127 | 🟡 Thủ công |
| REQ-CUST-34 | Lưu rồi tạo liên hệ ngay | CRM_CUST_TC_012 | 🟡 Thủ công |

### 3.5. Địa chỉ thanh toán & giao hàng (STORY-CUST-05)

`▰▰▰▰▰` 5/5 REQ có TC

| REQ ID | Yêu cầu | TC IDs | Trạng thái |
|---|---|---|---|
| REQ-CUST-35 | Nhóm trường Địa chỉ thanh toán | CRM_CUST_TC_007, CRM_CUST_TC_056 | 🟡 Thủ công |
| REQ-CUST-36 | Nhóm trường Địa chỉ giao hàng | CRM_CUST_TC_007, CRM_CUST_TC_056 | 🟡 Thủ công |
| REQ-CUST-37 | Sao chép địa chỉ khách hàng sang địa chỉ thanh toán | CRM_CUST_TC_064, CRM_CUST_TC_066 | 🟡 Thủ công |
| REQ-CUST-38 | Sao chép địa chỉ thanh toán sang địa chỉ giao hàng | CRM_CUST_TC_065, CRM_CUST_TC_066 | 🟡 Thủ công |
| REQ-CUST-39 | Gợi ý về việc bỏ trống địa chỉ giao hàng | CRM_CUST_TC_007 | 🟡 Thủ công |

### 3.6. Kiểm tra dữ liệu & cảnh báo trùng tên (STORY-CUST-06)

`▰▰▰▰▰` 7/7 REQ có TC

| REQ ID | Yêu cầu | TC IDs | Trạng thái |
|---|---|---|---|
| REQ-CUST-40 | Bỏ trống Company thì không lưu được | CRM_CUST_TC_039, CRM_CUST_TC_042, CRM_CUST_TC_069 | 🟡 Thủ công |
| REQ-CUST-41 | Nhãn tab đổi màu khi tab đó có lỗi | CRM_CUST_TC_039 | 🟡 Thủ công |
| REQ-CUST-42 | Lỗi ở tab không hiển thị thì tự chuyển về tab chứa lỗi | CRM_CUST_TC_041 | 🟡 Thủ công |
| REQ-CUST-43 | Company chỉ chứa khoảng trắng phải bị chặn | CRM_CUST_TC_040, CRM_CUST_TC_047 | 🟡 Thủ công |
| REQ-CUST-44 | Cảnh báo khi tên công ty đã tồn tại | CRM_CUST_TC_048, CRM_CUST_TC_108, CRM_CUST_TC_128 | 🟡 Thủ công |
| REQ-CUST-45 | Cảnh báo trùng tên không chặn việc lưu | CRM_CUST_TC_049 | 🟡 Thủ công |
| REQ-CUST-46 | Biểu mẫu mang mã chống CSRF | CRM_CUST_TC_122 | 🟡 Thủ công |

### 3.7. Hồ sơ khách hàng & chỉnh sửa (STORY-CUST-07)

`▰▰▰▰▰` 11/11 REQ có TC

| REQ ID | Yêu cầu | TC IDs | Trạng thái |
|---|---|---|---|
| REQ-CUST-47 | Mở hồ sơ khách hàng | CRM_CUST_TC_013, CRM_CUST_TC_014 | 🟡 Thủ công |
| REQ-CUST-48 | Điều hướng 19 tab nghiệp vụ | CRM_CUST_TC_013 | 🟡 Thủ công |
| REQ-CUST-49 | Biểu mẫu sửa có thêm tab Customer Admins | CRM_CUST_TC_013, CRM_CUST_TC_072, CRM_CUST_TC_121 | 🟡 Thủ công |
| REQ-CUST-50 | Biểu mẫu sửa nạp đúng dữ liệu đã lưu | CRM_CUST_TC_010, CRM_CUST_TC_067, CRM_CUST_TC_068, CRM_CUST_TC_110, CRM_CUST_TC_112 | 🟡 Thủ công |
| REQ-CUST-51 | Chế độ sửa chỉ có một nút lưu | CRM_CUST_TC_013, CRM_CUST_TC_067 | 🟡 Thủ công |
| REQ-CUST-52 | Mở nhanh website của khách hàng | CRM_CUST_TC_013, CRM_CUST_TC_053, CRM_CUST_TC_124 | 🟡 Thủ công |
| REQ-CUST-53 | Tuỳ chọn hiển thị tên liên hệ chính trên chứng từ | CRM_CUST_TC_070, CRM_CUST_TC_071 | 🟡 Thủ công |
| REQ-CUST-54 | Gán quản trị viên phụ trách khách hàng | CRM_CUST_TC_072, CRM_CUST_TC_073, CRM_CUST_TC_121 | 🟡 Thủ công |
| REQ-CUST-55 | Bảng danh sách quản trị viên phụ trách | CRM_CUST_TC_072, CRM_CUST_TC_073 | 🟡 Thủ công |
| REQ-CUST-83 | Tab hồ sơ khách hàng thay đổi theo vai trò | CRM_CUST_TC_116 | 🟡 Thủ công |
| REQ-CUST-84 | Khoá đổi tiền tệ khi khách hàng đã có giao dịch | CRM_CUST_TC_006, CRM_CUST_TC_061, CRM_CUST_TC_129 | 🟡 Thủ công |

### 3.8. Trạng thái hoạt động & xoá (STORY-CUST-08)

`▰▰▰▰▰` 9/9 REQ có TC

| REQ ID | Yêu cầu | TC IDs | Trạng thái |
|---|---|---|---|
| REQ-CUST-56 | Khách hàng mới mặc định đang hoạt động | CRM_CUST_TC_009, CRM_CUST_TC_011, CRM_CUST_TC_074 | 🟡 Thủ công |
| REQ-CUST-57 | Tắt trạng thái hoạt động từ danh sách | CRM_CUST_TC_074, CRM_CUST_TC_075, CRM_CUST_TC_112, CRM_CUST_TC_117, CRM_CUST_TC_127 | 🟡 Thủ công |
| REQ-CUST-58 | Bật lại trạng thái hoạt động | CRM_CUST_TC_074, CRM_CUST_TC_080, CRM_CUST_TC_112, CRM_CUST_TC_117 | 🟡 Thủ công |
| REQ-CUST-59 | Giải thích ý nghĩa trạng thái Inactive | CRM_CUST_TC_074 | 🟡 Thủ công |
| REQ-CUST-60 | Xác nhận trước khi xoá khách hàng | CRM_CUST_TC_076, CRM_CUST_TC_119 | 🟡 Thủ công |
| REQ-CUST-61 | Xoá khách hàng thành công | CRM_CUST_TC_075, CRM_CUST_TC_077, CRM_CUST_TC_078, CRM_CUST_TC_112, CRM_CUST_TC_119, CRM_CUST_TC_127 | 🟡 Thủ công |
| REQ-CUST-62 | Xoá bằng cách mở thẳng đường dẫn | CRM_CUST_TC_123 | 🟡 Thủ công |
| REQ-CUST-81 | Khách hàng Inactive bị loại khỏi mọi dropdown chọn khách hàng | CRM_CUST_TC_079, CRM_CUST_TC_080 | 🟡 Thủ công · ⚪ REQ chưa implement |
| REQ-CUST-82 | Chặn xoá khách hàng đang có dữ liệu liên quan | CRM_CUST_TC_081 | 🟡 Thủ công · ⚪ REQ chưa implement |

### 3.9. Các tab phụ trợ của hồ sơ (STORY-CUST-09)

`▰▰▰▰▰` 9/9 REQ có TC

| REQ ID | Yêu cầu | TC IDs | Trạng thái |
|---|---|---|---|
| REQ-CUST-63 | Ghi chú nội bộ về khách hàng | CRM_CUST_TC_082, CRM_CUST_TC_083 | 🟡 Thủ công |
| REQ-CUST-64 | Sao kê công nợ khách hàng | CRM_CUST_TC_084, CRM_CUST_TC_085, CRM_CUST_TC_086 | 🟡 Thủ công |
| REQ-CUST-65 | Tóm tắt số dư trong sao kê | CRM_CUST_TC_061, CRM_CUST_TC_084 | 🟡 Thủ công |
| REQ-CUST-66 | Gửi sao kê qua email | CRM_CUST_TC_087 | 🟡 Thủ công |
| REQ-CUST-67 | Kho lưu thông tin đăng nhập của khách hàng | CRM_CUST_TC_088, CRM_CUST_TC_089, CRM_CUST_TC_090, CRM_CUST_TC_091, CRM_CUST_TC_092 | 🟡 Thủ công |
| REQ-CUST-68 | Ba mức hiển thị của mục Vault | CRM_CUST_TC_088, CRM_CUST_TC_120 | 🟡 Thủ công |
| REQ-CUST-69 | Xác nhận mật khẩu trước khi xem mật khẩu Vault | CRM_CUST_TC_090 | 🟡 Thủ công |
| REQ-CUST-70 | Toạ độ bản đồ của khách hàng | CRM_CUST_TC_093, CRM_CUST_TC_094, CRM_CUST_TC_095 | 🟡 Thủ công |
| REQ-CUST-71 | Đặt nhắc nhở cho khách hàng | CRM_CUST_TC_096, CRM_CUST_TC_097, CRM_CUST_TC_098, CRM_CUST_TC_099 | 🟡 Thủ công |

### 3.10. Nhập khách hàng từ CSV (STORY-CUST-10)

`▰▰▰▰▰` 9/9 REQ có TC

| REQ ID | Yêu cầu | TC IDs | Trạng thái |
|---|---|---|---|
| REQ-CUST-72 | Truy cập màn hình nhập khách hàng | CRM_CUST_TC_015 | 🟡 Thủ công |
| REQ-CUST-73 | Hướng dẫn định dạng tệp nhập | CRM_CUST_TC_015, CRM_CUST_TC_104 | 🟡 Thủ công |
| REQ-CUST-74 | Bảng cột mẫu của tệp nhập | CRM_CUST_TC_016, CRM_CUST_TC_101, CRM_CUST_TC_105 | 🟡 Thủ công |
| REQ-CUST-75 | Tải tệp CSV mẫu | CRM_CUST_TC_016, CRM_CUST_TC_101 | 🟡 Thủ công |
| REQ-CUST-76 | Tệp CSV là trường bắt buộc | CRM_CUST_TC_100, CRM_CUST_TC_105 | 🟡 Thủ công |
| REQ-CUST-77 | Thiết lập kèm theo khi nhập | CRM_CUST_TC_016, CRM_CUST_TC_106 | 🟡 Thủ công |
| REQ-CUST-78 | Chạy thử trước khi nhập thật | CRM_CUST_TC_016, CRM_CUST_TC_102 | 🟡 Thủ công |
| REQ-CUST-79 | Kết quả nhập tệp CSV | CRM_CUST_TC_103, CRM_CUST_TC_118 | 🟡 Thủ công |
| REQ-CUST-80 | Chạy thử nhập tệp không ghi dữ liệu | CRM_CUST_TC_102 | 🟡 Thủ công |

## 4. 🟡 TC chưa automate

> **Chưa có project automation nào** — cả 129 TC đều chạy tay. Cột `Automation` dưới đây là **dự định** ghi trong file TC, không phải thực tế.

| Priority | Automation = Yes | Partial | No | Tổng |
|---|:-:|:-:|:-:|:-:|
| Critical | 15 | 1 | 0 | 16 |
| High | 26 | 6 | 0 | 32 |
| Medium | 43 | 12 | 0 | 55 |
| Low | 14 | 10 | 2 | 26 |

<details><summary>Danh sách đầy đủ 129 TC (xếp theo Priority, rồi khả năng automate)</summary>

| TC ID | Priority | Automation dự kiến | Ghi chú |
|---|---|---|---|
| CRM_CUST_TC_001 | Critical | Yes | — |
| CRM_CUST_TC_005 | Critical | Yes | — |
| CRM_CUST_TC_008 | Critical | Yes | — |
| CRM_CUST_TC_009 | Critical | Yes | — |
| CRM_CUST_TC_010 | Critical | Yes | — |
| CRM_CUST_TC_011 | Critical | Yes | — |
| CRM_CUST_TC_039 | Critical | Yes | — |
| CRM_CUST_TC_044 | Critical | Yes | — |
| CRM_CUST_TC_067 | Critical | Yes | — |
| CRM_CUST_TC_074 | Critical | Yes | — |
| CRM_CUST_TC_076 | Critical | Yes | — |
| CRM_CUST_TC_077 | Critical | Yes | — |
| CRM_CUST_TC_103 | Critical | Yes | — |
| CRM_CUST_TC_113 | Critical | Yes | — |
| CRM_CUST_TC_114 | Critical | Yes | — |
| CRM_CUST_TC_081 | Critical | Partial | — |
| CRM_CUST_TC_012 | High | Yes | — |
| CRM_CUST_TC_013 | High | Yes | — |
| CRM_CUST_TC_014 | High | Yes | — |
| CRM_CUST_TC_021 | High | Yes | — |
| CRM_CUST_TC_034 | High | Yes | — |
| CRM_CUST_TC_035 | High | Yes | — |
| CRM_CUST_TC_036 | High | Yes | — |
| CRM_CUST_TC_040 | High | Yes | — |
| CRM_CUST_TC_041 | High | Yes | — |
| CRM_CUST_TC_043 | High | Yes | — |
| CRM_CUST_TC_045 | High | Yes | — |
| CRM_CUST_TC_048 | High | Yes | — |
| CRM_CUST_TC_049 | High | Yes | — |
| CRM_CUST_TC_069 | High | Yes | — |
| CRM_CUST_TC_100 | High | Yes | — |
| CRM_CUST_TC_102 | High | Yes | — |
| CRM_CUST_TC_104 | High | Yes | — |
| CRM_CUST_TC_107 | High | Yes | — |
| CRM_CUST_TC_112 | High | Yes | — |
| CRM_CUST_TC_115 | High | Yes | — |
| CRM_CUST_TC_116 | High | Yes | — |
| CRM_CUST_TC_118 | High | Yes | — |
| CRM_CUST_TC_119 | High | Yes | — |
| CRM_CUST_TC_123 | High | Yes | — |
| CRM_CUST_TC_124 | High | Yes | — |
| CRM_CUST_TC_129 | High | Yes | — |
| CRM_CUST_TC_037 | High | Partial | QA tự chạy, không automation |
| CRM_CUST_TC_079 | High | Partial | — |
| CRM_CUST_TC_080 | High | Partial | — |
| CRM_CUST_TC_090 | High | Partial | — |
| CRM_CUST_TC_120 | High | Partial | — |
| CRM_CUST_TC_122 | High | Partial | — |
| CRM_CUST_TC_002 | Medium | Yes | — |
| CRM_CUST_TC_003 | Medium | Yes | — |
| CRM_CUST_TC_004 | Medium | Yes | — |
| CRM_CUST_TC_006 | Medium | Yes | — |
| CRM_CUST_TC_007 | Medium | Yes | — |
| CRM_CUST_TC_015 | Medium | Yes | — |
| CRM_CUST_TC_016 | Medium | Yes | — |
| CRM_CUST_TC_017 | Medium | Yes | — |
| CRM_CUST_TC_019 | Medium | Yes | — |
| CRM_CUST_TC_020 | Medium | Yes | — |
| CRM_CUST_TC_022 | Medium | Yes | — |
| CRM_CUST_TC_026 | Medium | Yes | — |
| CRM_CUST_TC_030 | Medium | Yes | — |
| CRM_CUST_TC_033 | Medium | Yes | — |
| CRM_CUST_TC_042 | Medium | Yes | — |
| CRM_CUST_TC_047 | Medium | Yes | — |
| CRM_CUST_TC_050 | Medium | Yes | — |
| CRM_CUST_TC_051 | Medium | Yes | — |
| CRM_CUST_TC_052 | Medium | Yes | — |
| CRM_CUST_TC_055 | Medium | Yes | — |
| CRM_CUST_TC_056 | Medium | Yes | — |
| CRM_CUST_TC_058 | Medium | Yes | — |
| CRM_CUST_TC_059 | Medium | Yes | — |
| CRM_CUST_TC_061 | Medium | Yes | — |
| CRM_CUST_TC_063 | Medium | Yes | — |
| CRM_CUST_TC_064 | Medium | Yes | — |
| CRM_CUST_TC_065 | Medium | Yes | — |
| CRM_CUST_TC_068 | Medium | Yes | — |
| CRM_CUST_TC_070 | Medium | Yes | — |
| CRM_CUST_TC_071 | Medium | Yes | — |
| CRM_CUST_TC_072 | Medium | Yes | — |
| CRM_CUST_TC_073 | Medium | Yes | — |
| CRM_CUST_TC_075 | Medium | Yes | — |
| CRM_CUST_TC_082 | Medium | Yes | — |
| CRM_CUST_TC_083 | Medium | Yes | — |
| CRM_CUST_TC_084 | Medium | Yes | — |
| CRM_CUST_TC_085 | Medium | Yes | — |
| CRM_CUST_TC_088 | Medium | Yes | — |
| CRM_CUST_TC_089 | Medium | Yes | — |
| CRM_CUST_TC_106 | Medium | Yes | — |
| CRM_CUST_TC_117 | Medium | Yes | — |
| CRM_CUST_TC_121 | Medium | Yes | — |
| CRM_CUST_TC_127 | Medium | Yes | — |
| CRM_CUST_TC_027 | Medium | Partial | — |
| CRM_CUST_TC_028 | Medium | Partial | — |
| CRM_CUST_TC_031 | Medium | Partial | — |
| CRM_CUST_TC_038 | Medium | Partial | — |
| CRM_CUST_TC_046 | Medium | Partial | — |
| CRM_CUST_TC_078 | Medium | Partial | — |
| CRM_CUST_TC_105 | Medium | Partial | — |
| CRM_CUST_TC_108 | Medium | Partial | — |
| CRM_CUST_TC_109 | Medium | Partial | — |
| CRM_CUST_TC_110 | Medium | Partial | — |
| CRM_CUST_TC_125 | Medium | Partial | — |
| CRM_CUST_TC_126 | Medium | Partial | — |
| CRM_CUST_TC_018 | Low | Yes | — |
| CRM_CUST_TC_024 | Low | Yes | — |
| CRM_CUST_TC_025 | Low | Yes | — |
| CRM_CUST_TC_053 | Low | Yes | — |
| CRM_CUST_TC_054 | Low | Yes | — |
| CRM_CUST_TC_057 | Low | Yes | — |
| CRM_CUST_TC_062 | Low | Yes | — |
| CRM_CUST_TC_091 | Low | Yes | — |
| CRM_CUST_TC_093 | Low | Yes | — |
| CRM_CUST_TC_096 | Low | Yes | — |
| CRM_CUST_TC_097 | Low | Yes | — |
| CRM_CUST_TC_098 | Low | Yes | — |
| CRM_CUST_TC_101 | Low | Yes | — |
| CRM_CUST_TC_111 | Low | Yes | — |
| CRM_CUST_TC_023 | Low | Partial | — |
| CRM_CUST_TC_029 | Low | Partial | — |
| CRM_CUST_TC_060 | Low | Partial | QA tự chạy, không automation |
| CRM_CUST_TC_066 | Low | Partial | — |
| CRM_CUST_TC_086 | Low | Partial | — |
| CRM_CUST_TC_087 | Low | Partial | — |
| CRM_CUST_TC_092 | Low | Partial | — |
| CRM_CUST_TC_094 | Low | Partial | — |
| CRM_CUST_TC_095 | Low | Partial | — |
| CRM_CUST_TC_099 | Low | Partial | — |
| CRM_CUST_TC_032 | Low | No | — |
| CRM_CUST_TC_128 | Low | No | — |

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
