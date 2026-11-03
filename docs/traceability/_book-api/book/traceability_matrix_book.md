# Ma Trận Truy Vết (RTM) — Sách (`BOOK`) · hệ thống Book

> **Tóm tắt:** 158/158 REQ đã có TC (100%) · **0/191 TC có script automation** · **chưa chạy lần nào** · 30 TC `@KnownBug` chờ Dev sửa lỗi

| Thông tin | Nội dung |
|---|---|
| Ngày sinh | 20-10-2026 10:48 |
| Phạm vi | Module `BOOK` · Web · API · Android |
| Mốc git | `ed6525b` — TC/REQ sửa sau mốc này thì RTM đã cũ |
| Nguồn đã quét | REQ: `requirements/_book-api/book/` (158 REQ) · TC: 7 file ở `testcases/_book-api/book/` (191 TC) · Automation: không tìm thấy script (cột ẩn) · Checklist: chưa có (cột ẩn) · Kết quả chạy: chưa có (cột ẩn) · Bug: `docs/bugs/_book-api/README.md` — chưa nối được vì TC chưa chạy |
| Tổng hợp | [../traceability_matrix.md](../traceability_matrix.md) — ⬛ module ngoài tầm nhìn của RTM nằm ở đó |

## 1. Tổng quan

| Chỉ số | Tiến độ | Giá trị |
|---|---|---|
| Requirement Coverage | `▰▰▰▰▰▰▰▰▰▰` | **158/158** (100%) REQ trong phạm vi |
| Platform Coverage · Web | `▰▰▰▰▰▰▰▰▰▰` | 52/52 cặp REQ × nền tảng (100%) |
| Platform Coverage · API | `▰▰▰▰▰▰▰▰▰▰` | 98/98 cặp REQ × nền tảng (100%) |
| Platform Coverage · Android | `▰▰▰▰▰▰▰▰▰▰` | 54/54 cặp REQ × nền tảng (100%) |
| Automation Coverage | `▱▱▱▱▱▱▱▱▱▱` | **0/191** TC (0%) — chưa có script |

**Phân bổ REQ theo trạng thái:**

| ✅ Đã automate | 🟣 Automate một phần | 🟡 Thủ công | 🟠 Chỉ checklist | 🔴 Chưa có TC | ⏭️ Loại trừ |
|:-:|:-:|:-:|:-:|:-:|:-:|
| 0 | 0 | 158 | 0 | 0 | 0 |

## 2. Việc cần làm

1. ▶️ **191 TC chưa từng chạy** → `/execute-test-cases` (Web) — Android / API chạy tay theo file TC · 30 TC `@KnownBug` dự kiến FAIL, đã có bug đang mở
2. 🟡 **Bắt đầu automate:** 83 TC Critical/High đã chấm `Automation = Yes` → `/generate-automation-from-testcases`

## 3. Ma trận chi tiết

### 3.1. Danh sách & sắp xếp (STORY-BK-BOOK-01)

`▰▰▰▰▰` 13/13 REQ có TC

| REQ ID | Yêu cầu | Nền tảng | TC IDs | Trạng thái |
|---|---|---|---|---|
| REQ-BK-BOOK-01 | Không cần đăng nhập vẫn xem được danh sách sách | Web · API · Android | BK_BOOK_TC_001, BK_BOOK_TC_060, BK_BOOK_TC_181 | 🟡 Thủ công |
| REQ-BK-BOOK-02 | Thẻ sách hiển thị thông tin chính | Web · Android | BK_BOOK_TC_002, BK_BOOK_TC_137 | 🟡 Thủ công |
| REQ-BK-BOOK-03 | Sách tạo trong vòng 7 ngày có nhãn New | Web · Android | BK_BOOK_TC_007, BK_BOOK_TC_184 | 🟡 Thủ công · REQ 🟡 đã sửa |
| REQ-BK-BOOK-04 | Mặc định sắp theo lượt xem giảm dần | Web · Android | BK_BOOK_TC_005, BK_BOOK_TC_138 | 🟡 Thủ công |
| REQ-BK-BOOK-05 | Sort By: Newest sắp theo ngày tạo mới nhất | Web · Android | BK_BOOK_TC_008, BK_BOOK_TC_160 | 🟡 Thủ công |
| REQ-BK-BOOK-06 | Price: Low to High sắp theo giá bán tăng dần | Web · Android | BK_BOOK_TC_009, BK_BOOK_TC_161 | 🟡 Thủ công |
| REQ-BK-BOOK-07 | Price: High to Low sắp theo giá bán giảm dần | Web · Android | BK_BOOK_TC_010, BK_BOOK_TC_183 | 🟡 Thủ công |
| REQ-BK-BOOK-08 | Kiểu sắp xếp ghi lên URL và áp dụng lại khi mở URL | Web | BK_BOOK_TC_011 | 🟡 Thủ công |
| REQ-BK-BOOK-09 | Cuộn tới cuối tải thêm sách | Web · Android | BK_BOOK_TC_012, BK_BOOK_TC_164 | 🟡 Thủ công |
| REQ-BK-BOOK-51 | Giá bán hiển thị không âm | Web · API · Android | BK_BOOK_TC_013, BK_BOOK_TC_117, BK_BOOK_TC_162 | 🟡 Thủ công |
| REQ-BK-BOOK-149 | Kiểu sắp xếp trở về Feature khi rời tab Book rồi quay lại | Android | BK_BOOK_TC_163 | 🟡 Thủ công |
| REQ-BK-BOOK-151 | Mất mạng: danh sách hiện No Data, không báo lỗi mạng | Android | BK_BOOK_TC_179 | 🟡 Thủ công |
| REQ-BK-BOOK-152 | Xoay ngang: lưới nhiều cột, hàng tab có nút cuộn | Android | BK_BOOK_TC_180 | 🟡 Thủ công |

### 3.2. Danh mục & bộ lọc (STORY-BK-BOOK-02)

`▰▰▰▰▰` 11/11 REQ có TC

| REQ ID | Yêu cầu | Nền tảng | TC IDs | Trạng thái |
|---|---|---|---|---|
| REQ-BK-BOOK-10 | Hàng tab danh mục kèm số sách | Web · Android | BK_BOOK_TC_006, BK_BOOK_TC_139 | 🟡 Thủ công |
| REQ-BK-BOOK-11 | Chọn tab danh mục lọc sách theo danh mục | Web · Android | BK_BOOK_TC_014, BK_BOOK_TC_165 | 🟡 Thủ công |
| REQ-BK-BOOK-12 | Nút Filter mở khu lọc | Web · Android | BK_BOOK_TC_015, BK_BOOK_TC_166 | 🟡 Thủ công |
| REQ-BK-BOOK-13 | Tìm sách theo từ khoá | Web · Android | BK_BOOK_TC_016, BK_BOOK_TC_167, BK_BOOK_TC_178 | 🟡 Thủ công |
| REQ-BK-BOOK-14 | Tìm sách không phân biệt hoa thường | Web · Android | BK_BOOK_TC_017, BK_BOOK_TC_168 | 🟡 Thủ công |
| REQ-BK-BOOK-15 | Ô khoảng giá có gợi ý | Web · Android | BK_BOOK_TC_018, BK_BOOK_TC_169 | 🟡 Thủ công |
| REQ-BK-BOOK-16 | Lọc giá từ một mức trở lên | Web · Android | BK_BOOK_TC_019, BK_BOOK_TC_170 | 🟡 Thủ công |
| REQ-BK-BOOK-17 | Lọc giá trong khoảng Từ – Đến | Web · Android | BK_BOOK_TC_020, BK_BOOK_TC_173 | 🟡 Thủ công |
| REQ-BK-BOOK-18 | Dòng mô tả khoảng giá | Web · Android | BK_BOOK_TC_021, BK_BOOK_TC_172 | 🟡 Thủ công |
| REQ-BK-BOOK-19 | Từ khoá và khoảng giá ghi lên URL | Web | BK_BOOK_TC_022 | 🟡 Thủ công |
| REQ-BK-BOOK-153 | Chỉ nhập Price from thì dòng mô tả ghi cận dưới | Android | BK_BOOK_TC_171 | 🟡 Thủ công |

### 3.3. Quyền thao tác theo trạng thái đăng nhập (STORY-BK-BOOK-03)

`▰▰▰▰▰` 2/2 REQ có TC

| REQ ID | Yêu cầu | Nền tảng | TC IDs | Trạng thái |
|---|---|---|---|---|
| REQ-BK-BOOK-20 | Khách không có nút tạo, sửa, quản lý danh mục | Web · Android | BK_BOOK_TC_003, BK_BOOK_TC_023, BK_BOOK_TC_182 | 🟡 Thủ công |
| REQ-BK-BOOK-21 | Đã đăng nhập có New book, bút sửa trên mọi thẻ và icon ⚙ | Web · Android | BK_BOOK_TC_004, BK_BOOK_TC_136 | 🟡 Thủ công |

### 3.4. Tạo sách (STORY-BK-BOOK-04)

`▰▰▰▰▰` 25/25 REQ có TC

| REQ ID | Yêu cầu | Nền tảng | TC IDs | Trạng thái |
|---|---|---|---|---|
| REQ-BK-BOOK-22 | Form Create a new book có đủ thành phần | Web · Android | BK_BOOK_TC_024, BK_BOOK_TC_140 | 🟡 Thủ công |
| REQ-BK-BOOK-23 | Create book khoá khi form chưa có thay đổi | Web · Android | BK_BOOK_TC_026, BK_BOOK_TC_147 | 🟡 Thủ công |
| REQ-BK-BOOK-24 | Slug tự sinh từ tên sách | Web · Android | BK_BOOK_TC_033, BK_BOOK_TC_148 | 🟡 Thủ công |
| REQ-BK-BOOK-25 | Ô slug khoá mặc định | Web · Android | BK_BOOK_TC_034, BK_BOOK_TC_149 | 🟡 Thủ công |
| REQ-BK-BOOK-26 | Thiếu ảnh bị chặn | Web · Android | BK_BOOK_TC_035, BK_BOOK_TC_150 | 🟡 Thủ công |
| REQ-BK-BOOK-27 | Thiếu giá bị chặn | Web · Android | BK_BOOK_TC_036, BK_BOOK_TC_151 | 🟡 Thủ công |
| REQ-BK-BOOK-28 | Thiếu danh mục bị chặn | Web · Android | BK_BOOK_TC_037, BK_BOOK_TC_152 | 🟡 Thủ công |
| REQ-BK-BOOK-29 | Giá tối thiểu 1.000 | Web · Android | BK_BOOK_TC_038, BK_BOOK_TC_039, BK_BOOK_TC_153, BK_BOOK_TC_155 | 🟡 Thủ công |
| REQ-BK-BOOK-30 | Giá tối đa 100.000.000.000 | Web · Android | BK_BOOK_TC_040, BK_BOOK_TC_041, BK_BOOK_TC_154, BK_BOOK_TC_155 | 🟡 Thủ công |
| REQ-BK-BOOK-31 | Giá hợp lệ hiển thị định dạng dưới ô | Web · Android | BK_BOOK_TC_042, BK_BOOK_TC_155 | 🟡 Thủ công |
| REQ-BK-BOOK-32 | Categories liệt kê mọi danh mục kèm số sách | Web · Android | BK_BOOK_TC_043, BK_BOOK_TC_156 | 🟡 Thủ công |
| REQ-BK-BOOK-33 | Categories cho thêm tên tự gõ | Web · Android | BK_BOOK_TC_044, BK_BOOK_TC_157 | 🟡 Thủ công |
| REQ-BK-BOOK-34 | Tên danh mục tự gõ tối đa 24 ký tự | Web · Android | BK_BOOK_TC_045, BK_BOOK_TC_046, BK_BOOK_TC_158, BK_BOOK_TC_159 | 🟡 Thủ công · REQ 🟡 đã sửa |
| REQ-BK-BOOK-35 | Tệp không phải ảnh không được thêm | Web | BK_BOOK_TC_047 | 🟡 Thủ công |
| REQ-BK-BOOK-36 | Ảnh hợp lệ hiện xem trước, tải lên khi tạo sách | Web | BK_BOOK_TC_048 | 🟡 Thủ công |
| REQ-BK-BOOK-37 | Chọn khuyến mãi chỉ từ khuyến mãi còn hiệu lực | Web · Android | BK_BOOK_TC_049, BK_BOOK_TC_185 | 🟡 Thủ công |
| REQ-BK-BOOK-38 | Available book mặc định bật | Web · Android | BK_BOOK_TC_025, BK_BOOK_TC_141 | 🟡 Thủ công |
| REQ-BK-BOOK-39 | Tạo sách thành công | Web | BK_BOOK_TC_027, BK_BOOK_TC_057, BK_BOOK_TC_058, BK_BOOK_TC_059 | 🟡 Thủ công |
| REQ-BK-BOOK-40 | Sách mới xuất hiện đầu danh sách Newest | Web | BK_BOOK_TC_028 | 🟡 Thủ công |
| REQ-BK-BOOK-52 | Tạo sách với tên danh mục chưa có sinh danh mục mới | Web · API | BK_BOOK_TC_050, BK_BOOK_TC_074 | 🟡 Thủ công |
| REQ-BK-BOOK-147 | Tạo sách thành công trên Android | Android | BK_BOOK_TC_143 | 🟡 Thủ công |
| REQ-BK-BOOK-150 | Chọn ảnh bìa qua trình chọn ảnh của hệ thống | Android | BK_BOOK_TC_142 | 🟡 Thủ công |
| REQ-BK-BOOK-156 | Dữ liệu form Create book giữ nguyên khi app xuống nền | Android | BK_BOOK_TC_189 | 🟡 Thủ công |
| REQ-BK-BOOK-157 | Back hệ thống ở Create a new book quay về danh sách, không hỏi xác nhận | Android | BK_BOOK_TC_190 | 🟡 Thủ công |
| REQ-BK-BOOK-158 | Bàn phím ở form Create a new book không che ô đang nhập; ô giá dùng bàn phím số | Android | BK_BOOK_TC_191 | 🟡 Thủ công |

### 3.5. Trang chi tiết (STORY-BK-BOOK-05)

`▰▰▰▰▰` 3/3 REQ có TC

| REQ ID | Yêu cầu | Nền tảng | TC IDs | Trạng thái |
|---|---|---|---|---|
| REQ-BK-BOOK-41 | Trang chi tiết sách | Web · Android | BK_BOOK_TC_029, BK_BOOK_TC_059, BK_BOOK_TC_144 | 🟡 Thủ công |
| REQ-BK-BOOK-42 | Mở chi tiết sách với `view=true` tăng lượt xem đúng 1 | Web · API · Android | BK_BOOK_TC_051, BK_BOOK_TC_079, BK_BOOK_TC_186 | 🟡 Thủ công |
| REQ-BK-BOOK-43 | Sách không tồn tại | Web | BK_BOOK_TC_052, BK_BOOK_TC_059 | 🟡 Thủ công |

### 3.6. Sửa sách (STORY-BK-BOOK-06)

`▰▰▰▰▰` 7/7 REQ có TC

| REQ ID | Yêu cầu | Nền tảng | TC IDs | Trạng thái |
|---|---|---|---|---|
| REQ-BK-BOOK-44 | Form Modify book điền sẵn dữ liệu | Web · Android | BK_BOOK_TC_030, BK_BOOK_TC_145 | 🟡 Thủ công |
| REQ-BK-BOOK-45 | Sửa tên sinh lại slug | Web · Android | BK_BOOK_TC_053, BK_BOOK_TC_174 | 🟡 Thủ công |
| REQ-BK-BOOK-46 | Lưu thay đổi thành công | Web | BK_BOOK_TC_031, BK_BOOK_TC_059 | 🟡 Thủ công |
| REQ-BK-BOOK-47 | Tắt Available book lưu trạng thái UNAVAILABLE | Web | BK_BOOK_TC_054 | 🟡 Thủ công |
| REQ-BK-BOOK-148 | Tab Book đang ở Modify book quay về danh sách | Android | BK_BOOK_TC_177 | 🟡 Thủ công |
| REQ-BK-BOOK-154 | Breadcrumb Modify book ghi đúng tên màn hình | Android | BK_BOOK_TC_176 | 🟡 Thủ công |
| REQ-BK-BOOK-155 | Lưu thay đổi thất bại thì báo lỗi có nội dung | Android | BK_BOOK_TC_187 | 🟡 Thủ công |

### 3.7. Xoá sách (STORY-BK-BOOK-07)

`▰▰▰▰▰` 3/3 REQ có TC

| REQ ID | Yêu cầu | Nền tảng | TC IDs | Trạng thái |
|---|---|---|---|---|
| REQ-BK-BOOK-48 | Xoá cần xác nhận, hiển thị đúng tên sách | Web · Android | BK_BOOK_TC_055, BK_BOOK_TC_175 | 🟡 Thủ công |
| REQ-BK-BOOK-49 | Cancel không xoá | Web · Android | BK_BOOK_TC_056, BK_BOOK_TC_146 | 🟡 Thủ công |
| REQ-BK-BOOK-50 | Xác nhận xoá gỡ sách | Web · Android | BK_BOOK_TC_032, BK_BOOK_TC_059, BK_BOOK_TC_188 | 🟡 Thủ công |

### 3.8. Danh sách · tìm kiếm · sắp xếp · phân trang — API (STORY-BK-BOOK-08)

`▰▰▰▰▰` 27/27 REQ có TC

| REQ ID | Yêu cầu | Nền tảng | TC IDs | Trạng thái |
|---|---|---|---|---|
| REQ-BK-BOOK-53 | Danh sách trả `list` và `pagination` đúng hình dạng | API | BK_BOOK_TC_060 | 🟡 Thủ công |
| REQ-BK-BOOK-54 | `auth` là chủ sách hoặc `null` | API | BK_BOOK_TC_060 | 🟡 Thủ công |
| REQ-BK-BOOK-55 | Mặc định `limit`=10 · `page`=1 · sắp `updatedAt` giảm dần | API | BK_BOOK_TC_090 | 🟡 Thủ công |
| REQ-BK-BOOK-56 | `limit` cắt đúng số bản ghi và tính `totalPage` | API | BK_BOOK_TC_065 | 🟡 Thủ công |
| REQ-BK-BOOK-57 | `limit` ngoài khoảng [1 ; 10000] bị từ chối | API | BK_BOOK_TC_065 | 🟡 Thủ công |
| REQ-BK-BOOK-58 | `limit` = 10000 hợp lệ (biên trên) | API | BK_BOOK_TC_065 | 🟡 Thủ công |
| REQ-BK-BOOK-59 | `limit` sai kiểu bị từ chối | API | BK_BOOK_TC_065 | 🟡 Thủ công |
| REQ-BK-BOOK-60 | `page` chuyển sang trang khác trả bản ghi khác | API | BK_BOOK_TC_065 | 🟡 Thủ công |
| REQ-BK-BOOK-61 | `page` < 1 bị từ chối | API | BK_BOOK_TC_065 | 🟡 Thủ công |
| REQ-BK-BOOK-62 | `page` sai kiểu bị từ chối | API | BK_BOOK_TC_065 | 🟡 Thủ công |
| REQ-BK-BOOK-63 | `page` vượt tổng số trang trả danh sách rỗng, không lỗi | API | BK_BOOK_TC_065 | 🟡 Thủ công |
| REQ-BK-BOOK-64 | `sort` nhận 9 giá trị, `sortBy` sắp đúng chiều | API | BK_BOOK_TC_061 | 🟡 Thủ công |
| REQ-BK-BOOK-65 | `sort` ngoài enum bị từ chối | API | BK_BOOK_TC_061 | 🟡 Thủ công |
| REQ-BK-BOOK-66 | `sortBy` chỉ nhận `asc` hoặc `desc` | API | BK_BOOK_TC_061 | 🟡 Thủ công |
| REQ-BK-BOOK-67 | `search` JSON: lọc theo `name` chứa chuỗi, không phân biệt hoa thường | API | BK_BOOK_TC_062 | 🟡 Thủ công |
| REQ-BK-BOOK-68 | `search` JSON: lọc theo `description` và `slug` | API | BK_BOOK_TC_091 | 🟡 Thủ công |
| REQ-BK-BOOK-69 | `search` JSON: lọc theo danh mục | API | BK_BOOK_TC_063 | 🟡 Thủ công |
| REQ-BK-BOOK-70 | `search` JSON: lọc theo `status` | API | BK_BOOK_TC_092 | 🟡 Thủ công |
| REQ-BK-BOOK-71 | `search` JSON: lọc theo giá gốc `price` (`gte` · `gte` + `lte`) | API | BK_BOOK_TC_064 | 🟡 Thủ công |
| REQ-BK-BOOK-72 | `search` JSON: lọc `currentPrice` đủ hai đầu `gte` + `lte` | API | BK_BOOK_TC_064 | 🟡 Thủ công |
| REQ-BK-BOOK-73 | `search` JSON: `OR` là hợp | API | BK_BOOK_TC_093 | 🟡 Thủ công |
| REQ-BK-BOOK-74 | `search` chuỗi thường khớp tên · mô tả · slug, không phân biệt hoa thường | API | BK_BOOK_TC_094 | 🟡 Thủ công |
| REQ-BK-BOOK-75 | `search` JSON sai cú pháp được coi là chuỗi thường | API | BK_BOOK_TC_095 | 🟡 Thủ công |
| REQ-BK-BOOK-76 | `search` JSON tham chiếu trường hoặc toán tử không tồn tại bị từ chối | API | BK_BOOK_TC_096 | 🟡 Thủ công |
| REQ-BK-BOOK-144 | `lengthData` bằng số phần tử thực trả về | API | BK_BOOK_TC_098 | 🟡 Thủ công |
| REQ-BK-BOOK-145 | `limit` phải là số nguyên | API | BK_BOOK_TC_098 | 🟡 Thủ công |
| REQ-BK-BOOK-146 | Body lỗi 400 của bộ lọc không lộ thông tin nội bộ | API | BK_BOOK_TC_097 | 🟡 Thủ công |

### 3.9. Chi tiết sách — API (STORY-BK-BOOK-09)

`▰▰▰▰▰` 6/6 REQ có TC

| REQ ID | Yêu cầu | Nền tảng | TC IDs | Trạng thái |
|---|---|---|---|---|
| REQ-BK-BOOK-77 | Chi tiết sách trả đủ 13 khoá | API | BK_BOOK_TC_078 | 🟡 Thủ công |
| REQ-BK-BOOK-78 | `{id}` nhận cả `id` lẫn `slug` | API | BK_BOOK_TC_099 | 🟡 Thủ công |
| REQ-BK-BOOK-79 | Endpoint đọc công khai bỏ qua header `Authorization` | API | BK_BOOK_TC_078 | 🟡 Thủ công |
| REQ-BK-BOOK-80 | `view` sai kiểu bị từ chối | API | BK_BOOK_TC_100 | 🟡 Thủ công |
| REQ-BK-BOOK-81 | `id` không tồn tại trả 404 | API | BK_BOOK_TC_080 | 🟡 Thủ công |
| REQ-BK-BOOK-82 | Sách không có ảnh có `picture` = `[]` ở cả chi tiết lẫn danh sách | API | BK_BOOK_TC_101 | 🟡 Thủ công |

### 3.10. Tạo sách — API (STORY-BK-BOOK-10)

`▰▰▰▰▰` 36/36 REQ có TC

| REQ ID | Yêu cầu | Nền tảng | TC IDs | Trạng thái |
|---|---|---|---|---|
| REQ-BK-BOOK-83 | Tạo sách thành công trả **201** | API | BK_BOOK_TC_102 | 🟡 Thủ công |
| REQ-BK-BOOK-84 | Sách vừa tạo đọc lại đúng dữ liệu | API | BK_BOOK_TC_066 | 🟡 Thủ công |
| REQ-BK-BOOK-85 | Slug tự sinh từ tên: chữ thường, bỏ dấu, nối `-` | API | BK_BOOK_TC_103 | 🟡 Thủ công |
| REQ-BK-BOOK-86 | Slug tự đặt được lưu nguyên văn | API | BK_BOOK_TC_104 | 🟡 Thủ công |
| REQ-BK-BOOK-87 | Trùng tên sách bị từ chối, không phân biệt hoa thường | API | BK_BOOK_TC_075 | 🟡 Thủ công |
| REQ-BK-BOOK-88 | Trùng slug bị từ chối với thông báo nói về slug | API | BK_BOOK_TC_105 | 🟡 Thủ công |
| REQ-BK-BOOK-89 | Tạo sách khi không có / sai scheme xác thực bị từ chối | API | BK_BOOK_TC_067 | 🟡 Thủ công |
| REQ-BK-BOOK-90 | Tạo sách với token không hợp lệ bị từ chối | API | BK_BOOK_TC_067 | 🟡 Thủ công |
| REQ-BK-BOOK-91 | Thiếu `name` bị từ chối | API | BK_BOOK_TC_069 | 🟡 Thủ công |
| REQ-BK-BOOK-92 | `name` sai kiểu bị từ chối | API | BK_BOOK_TC_069 | 🟡 Thủ công |
| REQ-BK-BOOK-93 | `name` tối đa 191 ký tự | API | BK_BOOK_TC_106 | 🟡 Thủ công |
| REQ-BK-BOOK-94 | `status` ngoài enum bị từ chối | API | BK_BOOK_TC_072 | 🟡 Thủ công |
| REQ-BK-BOOK-95 | Thiếu `status` bị từ chối | API | BK_BOOK_TC_107 | 🟡 Thủ công |
| REQ-BK-BOOK-96 | Thiếu `categories` bị từ chối | API | BK_BOOK_TC_108 | 🟡 Thủ công |
| REQ-BK-BOOK-97 | `categories` rỗng bị từ chối | API | BK_BOOK_TC_071 | 🟡 Thủ công |
| REQ-BK-BOOK-98 | `categories` sai kiểu bị từ chối | API | BK_BOOK_TC_108 | 🟡 Thủ công |
| REQ-BK-BOOK-99 | Danh mục trùng lặp trong mảng được gộp | API | BK_BOOK_TC_109 | 🟡 Thủ công |
| REQ-BK-BOOK-100 | Tên danh mục tối đa 191 ký tự | API | BK_BOOK_TC_109 | 🟡 Thủ công |
| REQ-BK-BOOK-101 | Thiếu `price` bị từ chối | API | BK_BOOK_TC_070 | 🟡 Thủ công |
| REQ-BK-BOOK-102 | `price` sai kiểu bị từ chối | API | BK_BOOK_TC_110 | 🟡 Thủ công |
| REQ-BK-BOOK-103 | `price` lớn hơn 100.000.000.000 bị từ chối | API | BK_BOOK_TC_111 | 🟡 Thủ công |
| REQ-BK-BOOK-104 | Giá gốc dưới 1.000 (kể cả âm) bị từ chối | API | BK_BOOK_TC_073 | 🟡 Thủ công |
| REQ-BK-BOOK-105 | Giá gốc đúng bằng 1.000 (biên dưới) được chấp nhận | API | BK_BOOK_TC_073 | 🟡 Thủ công |
| REQ-BK-BOOK-106 | `description` tối đa 65.535 ký tự | API | BK_BOOK_TC_112 | 🟡 Thủ công |
| REQ-BK-BOOK-107 | `pictures` sai kiểu bị từ chối | API | BK_BOOK_TC_113 | 🟡 Thủ công |
| REQ-BK-BOOK-108 | `pictures` trỏ tệp không tồn tại vẫn tạo được sách, không sinh ảnh | API | BK_BOOK_TC_113 | 🟡 Thủ công |
| REQ-BK-BOOK-109 | `promotions` chứa id không tồn tại bị từ chối | API | BK_BOOK_TC_114 | 🟡 Thủ công |
| REQ-BK-BOOK-110 | Trường ngoài schema và trường server tự tính bị bỏ qua | API | BK_BOOK_TC_076 | 🟡 Thủ công |
| REQ-BK-BOOK-111 | Tạo sách nhận đủ 3 content-type khai trong spec | API | BK_BOOK_TC_068 | 🟡 Thủ công |
| REQ-BK-BOOK-112 | Body JSON sai cú pháp bị từ chối, body lỗi **không** phải JSON | API | BK_BOOK_TC_115 | 🟡 Thủ công |
| REQ-BK-BOOK-113 | Chuỗi tấn công và Unicode ở `name` · `description` lưu nguyên văn | API | BK_BOOK_TC_077 | 🟡 Thủ công |
| REQ-BK-BOOK-137 | Sách không gắn khuyến mãi có giá bán bằng giá gốc | API | BK_BOOK_TC_116 | 🟡 Thủ công |
| REQ-BK-BOOK-139 | `price` = 100.000.000.000 được chấp nhận | API | BK_BOOK_TC_118 | 🟡 Thủ công |
| REQ-BK-BOOK-140 | `price` số lẻ được lưu nguyên | API | BK_BOOK_TC_119 | 🟡 Thủ công |
| REQ-BK-BOOK-142 | `name` rỗng bị từ chối | API | BK_BOOK_TC_120 | 🟡 Thủ công |
| REQ-BK-BOOK-143 | Tên danh mục rỗng bị từ chối | API | BK_BOOK_TC_121 | 🟡 Thủ công |

### 3.11. Sửa sách — API (STORY-BK-BOOK-11)

`▰▰▰▰▰` 19/19 REQ có TC

| REQ ID | Yêu cầu | Nền tảng | TC IDs | Trạng thái |
|---|---|---|---|---|
| REQ-BK-BOOK-114 | Sửa sách thành công trả **201** | API | BK_BOOK_TC_122 | 🟡 Thủ công |
| REQ-BK-BOOK-115 | Cập nhật một phần: chỉ gửi field cần đổi | API | BK_BOOK_TC_081 | 🟡 Thủ công |
| REQ-BK-BOOK-116 | Body `{}` không đổi gì và không lỗi | API | BK_BOOK_TC_123 | 🟡 Thủ công |
| REQ-BK-BOOK-117 | Đổi `name` không sinh lại `slug` | API | BK_BOOK_TC_081 | 🟡 Thủ công |
| REQ-BK-BOOK-118 | Đổi sang tên của sách khác bị từ chối; giữ nguyên tên thì được | API | BK_BOOK_TC_124 | 🟡 Thủ công |
| REQ-BK-BOOK-119 | Đổi `status` được lưu | API | BK_BOOK_TC_082 | 🟡 Thủ công |
| REQ-BK-BOOK-120 | `status` ngoài enum khi sửa bị từ chối | API | BK_BOOK_TC_125 | 🟡 Thủ công |
| REQ-BK-BOOK-121 | Đổi `price` được lưu | API | BK_BOOK_TC_126 | 🟡 Thủ công |
| REQ-BK-BOOK-122 | `price` sai kiểu hoặc quá lớn khi sửa bị từ chối | API | BK_BOOK_TC_126 | 🟡 Thủ công |
| REQ-BK-BOOK-123 | Giá gốc dưới 1.000 (kể cả âm) khi sửa bị từ chối | API | BK_BOOK_TC_127 | 🟡 Thủ công |
| REQ-BK-BOOK-124 | `categories` rỗng khi sửa bị từ chối | API | BK_BOOK_TC_128 | 🟡 Thủ công |
| REQ-BK-BOOK-125 | Đổi `slug` được lưu | API | BK_BOOK_TC_129 | 🟡 Thủ công |
| REQ-BK-BOOK-126 | Sửa sách khi không có / sai token bị từ chối | API | BK_BOOK_TC_083 | 🟡 Thủ công |
| REQ-BK-BOOK-127 | Sửa `id` không tồn tại trả 404 | API | BK_BOOK_TC_084 | 🟡 Thủ công |
| REQ-BK-BOOK-128 | Người dùng đã đăng nhập sửa được sách của người khác, chủ sách không đổi | API | BK_BOOK_TC_085 | 🟡 Thủ công |
| REQ-BK-BOOK-129 | Trường ngoài schema bị bỏ qua khi sửa | API | BK_BOOK_TC_130 | 🟡 Thủ công |
| REQ-BK-BOOK-130 | Sửa sách nhận `form-urlencoded` · `multipart` cho field chuỗi; field số bị từ chối | API | BK_BOOK_TC_131 | 🟡 Thủ công |
| REQ-BK-BOOK-138 | Sửa `price` tính lại giá bán | API | BK_BOOK_TC_132 | 🟡 Thủ công |
| REQ-BK-BOOK-141 | Sửa `categories` thay thế toàn bộ danh sách | API | BK_BOOK_TC_133 | 🟡 Thủ công |

### 3.12. Xoá sách — API (STORY-BK-BOOK-12)

`▰▰▰▰▰` 5/5 REQ có TC

| REQ ID | Yêu cầu | Nền tảng | TC IDs | Trạng thái |
|---|---|---|---|---|
| REQ-BK-BOOK-131 | Xoá sách thành công | API | BK_BOOK_TC_086 | 🟡 Thủ công |
| REQ-BK-BOOK-132 | Xoá sách khi không có / sai token bị từ chối | API | BK_BOOK_TC_087 | 🟡 Thủ công |
| REQ-BK-BOOK-133 | Xoá `id` không tồn tại, và xoá lần thứ hai, trả 404 | API | BK_BOOK_TC_088 | 🟡 Thủ công |
| REQ-BK-BOOK-134 | Người dùng đã đăng nhập xoá được sách của người khác | API | BK_BOOK_TC_089 | 🟡 Thủ công |
| REQ-BK-BOOK-135 | Sách của người dùng đã bị xoá vẫn tồn tại với `auth` = `null` | API | BK_BOOK_TC_134 | 🟡 Thủ công |

### 3.13. Quy ước chung của module — API (STORY-BK-BOOK-13)

`▰▰▰▰▰` 1/1 REQ có TC

| REQ ID | Yêu cầu | Nền tảng | TC IDs | Trạng thái |
|---|---|---|---|---|
| REQ-BK-BOOK-136 | Body lỗi kiểm tra dữ liệu có hình dạng `msg` + `fields` | API | BK_BOOK_TC_135 | 🟡 Thủ công |

## 4. 🟡 TC chưa automate

| Priority | Automation = Yes | Partial | No | Tổng |
|---|:-:|:-:|:-:|:-:|
| Critical | 10 | 0 | 0 | 10 |
| High | 73 | 0 | 0 | 73 |
| Medium | 84 | 3 | 0 | 87 |
| Low | 20 | 1 | 0 | 21 |
| **Tổng** | **187** | **4** | **0** | **191** |

<details><summary>Danh sách đầy đủ 191 TC (xếp theo Priority)</summary>

| TC ID | Nền tảng | Priority | Automation dự kiến | Ghi chú |
|---|---|---|---|---|
| BK_BOOK_TC_003 | Web | Critical | Yes | — |
| BK_BOOK_TC_023 | Web | Critical | Yes | `@NeedsVerify` |
| BK_BOOK_TC_027 | Web | Critical | Yes | — |
| BK_BOOK_TC_031 | Web | Critical | Yes | — |
| BK_BOOK_TC_032 | Web | Critical | Yes | — |
| BK_BOOK_TC_060 | API | Critical | Yes | — |
| BK_BOOK_TC_066 | API | Critical | Yes | — |
| BK_BOOK_TC_143 | Android | Critical | Yes | `@KnownBug` |
| BK_BOOK_TC_146 | Android | Critical | Yes | — |
| BK_BOOK_TC_188 | Android | Critical | Yes | — |
| BK_BOOK_TC_001 | Web | High | Yes | — |
| BK_BOOK_TC_002 | Web | High | Yes | — |
| BK_BOOK_TC_004 | Web | High | Yes | — |
| BK_BOOK_TC_013 | Web | High | Yes | `@KnownBug` |
| BK_BOOK_TC_016 | Web | High | Yes | `@NeedsVerify` |
| BK_BOOK_TC_020 | Web | High | Yes | `@KnownBug` |
| BK_BOOK_TC_024 | Web | High | Yes | — |
| BK_BOOK_TC_028 | Web | High | Yes | — |
| BK_BOOK_TC_029 | Web | High | Yes | — |
| BK_BOOK_TC_030 | Web | High | Yes | — |
| BK_BOOK_TC_033 | Web | High | Yes | `@NeedsVerify` |
| BK_BOOK_TC_035 | Web | High | Yes | — |
| BK_BOOK_TC_036 | Web | High | Yes | `@NeedsVerify` |
| BK_BOOK_TC_037 | Web | High | Yes | — |
| BK_BOOK_TC_038 | Web | High | Yes | — |
| BK_BOOK_TC_039 | Web | High | Yes | `@NeedsVerify` |
| BK_BOOK_TC_040 | Web | High | Yes | — |
| BK_BOOK_TC_041 | Web | High | Yes | `@NeedsVerify` |
| BK_BOOK_TC_059 | Web | High | Yes | — |
| BK_BOOK_TC_064 | API | High | Yes | — |
| BK_BOOK_TC_067 | API | High | Yes | — |
| BK_BOOK_TC_069 | API | High | Yes | — |
| BK_BOOK_TC_070 | API | High | Yes | `@KnownBug` |
| BK_BOOK_TC_071 | API | High | Yes | — |
| BK_BOOK_TC_072 | API | High | Yes | — |
| BK_BOOK_TC_073 | API | High | Yes | `@KnownBug` |
| BK_BOOK_TC_074 | API | High | Yes | — |
| BK_BOOK_TC_076 | API | High | Yes | — |
| BK_BOOK_TC_077 | API | High | Yes | — |
| BK_BOOK_TC_079 | API | High | Yes | — |
| BK_BOOK_TC_081 | API | High | Yes | — |
| BK_BOOK_TC_083 | API | High | Yes | — |
| BK_BOOK_TC_085 | API | High | Yes | — |
| BK_BOOK_TC_086 | API | High | Yes | — |
| BK_BOOK_TC_087 | API | High | Yes | — |
| BK_BOOK_TC_089 | API | High | Yes | — |
| BK_BOOK_TC_107 | API | High | Yes | `@KnownBug` |
| BK_BOOK_TC_108 | API | High | Yes | — |
| BK_BOOK_TC_110 | API | High | Yes | — |
| BK_BOOK_TC_111 | API | High | Yes | — |
| BK_BOOK_TC_116 | API | High | Yes | `@KnownBug` |
| BK_BOOK_TC_117 | API | High | Yes | `@KnownBug` |
| BK_BOOK_TC_126 | API | High | Yes | — |
| BK_BOOK_TC_127 | API | High | Yes | `@KnownBug` |
| BK_BOOK_TC_130 | API | High | Yes | — |
| BK_BOOK_TC_132 | API | High | Yes | `@KnownBug` |
| BK_BOOK_TC_133 | API | High | Yes | `@KnownBug` |
| BK_BOOK_TC_134 | API | High | Yes | — |
| BK_BOOK_TC_136 | Android | High | Yes | — |
| BK_BOOK_TC_137 | Android | High | Yes | — |
| BK_BOOK_TC_140 | Android | High | Yes | — |
| BK_BOOK_TC_142 | Android | High | Yes | — |
| BK_BOOK_TC_144 | Android | High | Yes | `@NeedsVerify` |
| BK_BOOK_TC_145 | Android | High | Yes | — |
| BK_BOOK_TC_148 | Android | High | Yes | — |
| BK_BOOK_TC_150 | Android | High | Yes | — |
| BK_BOOK_TC_151 | Android | High | Yes | — |
| BK_BOOK_TC_152 | Android | High | Yes | — |
| BK_BOOK_TC_153 | Android | High | Yes | — |
| BK_BOOK_TC_154 | Android | High | Yes | `@NeedsVerify` |
| BK_BOOK_TC_155 | Android | High | Yes | — |
| BK_BOOK_TC_158 | Android | High | Yes | — |
| BK_BOOK_TC_159 | Android | High | Yes | `@NeedsVerify` |
| BK_BOOK_TC_161 | Android | High | Yes | — |
| BK_BOOK_TC_162 | Android | High | Yes | `@KnownBug` |
| BK_BOOK_TC_167 | Android | High | Yes | `@NeedsVerify` |
| BK_BOOK_TC_170 | Android | High | Yes | — |
| BK_BOOK_TC_173 | Android | High | Yes | `@KnownBug` |
| BK_BOOK_TC_175 | Android | High | Yes | `@KnownBug` |
| BK_BOOK_TC_178 | Android | High | Yes | `@NeedsVerify` |
| BK_BOOK_TC_181 | Android | High | Yes | — |
| BK_BOOK_TC_182 | Android | High | Yes | — |
| BK_BOOK_TC_187 | Android | High | Yes | `@KnownBug` |
| BK_BOOK_TC_005 | Web | Medium | Yes | — |
| BK_BOOK_TC_006 | Web | Medium | Yes | — |
| BK_BOOK_TC_007 | Web | Medium | Yes | — |
| BK_BOOK_TC_008 | Web | Medium | Yes | — |
| BK_BOOK_TC_009 | Web | Medium | Yes | — |
| BK_BOOK_TC_010 | Web | Medium | Yes | `@NeedsVerify` |
| BK_BOOK_TC_012 | Web | Medium | Yes | `@NeedsVerify` |
| BK_BOOK_TC_014 | Web | Medium | Yes | — |
| BK_BOOK_TC_017 | Web | Medium | Yes | — |
| BK_BOOK_TC_019 | Web | Medium | Yes | `@NeedsVerify` |
| BK_BOOK_TC_025 | Web | Medium | Yes | — |
| BK_BOOK_TC_026 | Web | Medium | Yes | — |
| BK_BOOK_TC_043 | Web | Medium | Yes | — |
| BK_BOOK_TC_044 | Web | Medium | Yes | — |
| BK_BOOK_TC_045 | Web | Medium | Yes | `@NeedsVerify` |
| BK_BOOK_TC_046 | Web | Medium | Yes | `@NeedsVerify` |
| BK_BOOK_TC_048 | Web | Medium | Yes | — |
| BK_BOOK_TC_050 | Web | Medium | Yes | `@NeedsVerify` |
| BK_BOOK_TC_051 | Web | Medium | Yes | — |
| BK_BOOK_TC_052 | Web | Medium | Yes | — |
| BK_BOOK_TC_053 | Web | Medium | Yes | — |
| BK_BOOK_TC_054 | Web | Medium | Yes | — |
| BK_BOOK_TC_055 | Web | Medium | Yes | `@KnownBug` |
| BK_BOOK_TC_056 | Web | Medium | Yes | — |
| BK_BOOK_TC_057 | Web | Medium | Partial | `@NeedsVerify` |
| BK_BOOK_TC_058 | Web | Medium | Yes | `@NeedsVerify` |
| BK_BOOK_TC_061 | API | Medium | Yes | — |
| BK_BOOK_TC_062 | API | Medium | Yes | — |
| BK_BOOK_TC_063 | API | Medium | Yes | — |
| BK_BOOK_TC_065 | API | Medium | Yes | — |
| BK_BOOK_TC_068 | API | Medium | Yes | `@KnownBug` |
| BK_BOOK_TC_075 | API | Medium | Yes | — |
| BK_BOOK_TC_078 | API | Medium | Yes | — |
| BK_BOOK_TC_080 | API | Medium | Yes | — |
| BK_BOOK_TC_082 | API | Medium | Yes | — |
| BK_BOOK_TC_084 | API | Medium | Yes | — |
| BK_BOOK_TC_088 | API | Medium | Yes | — |
| BK_BOOK_TC_090 | API | Medium | Yes | — |
| BK_BOOK_TC_091 | API | Medium | Yes | — |
| BK_BOOK_TC_092 | API | Medium | Yes | — |
| BK_BOOK_TC_093 | API | Medium | Yes | — |
| BK_BOOK_TC_094 | API | Medium | Yes | — |
| BK_BOOK_TC_096 | API | Medium | Yes | — |
| BK_BOOK_TC_097 | API | Medium | Yes | `@KnownBug` |
| BK_BOOK_TC_098 | API | Medium | Yes | `@KnownBug` |
| BK_BOOK_TC_099 | API | Medium | Yes | — |
| BK_BOOK_TC_101 | API | Medium | Yes | `@KnownBug` |
| BK_BOOK_TC_103 | API | Medium | Yes | `@KnownBug` |
| BK_BOOK_TC_105 | API | Medium | Yes | `@KnownBug` |
| BK_BOOK_TC_106 | API | Medium | Yes | — |
| BK_BOOK_TC_109 | API | Medium | Yes | — |
| BK_BOOK_TC_114 | API | Medium | Yes | — |
| BK_BOOK_TC_115 | API | Medium | Yes | — |
| BK_BOOK_TC_118 | API | Medium | Yes | `@KnownBug` |
| BK_BOOK_TC_119 | API | Medium | Yes | `@KnownBug` |
| BK_BOOK_TC_120 | API | Medium | Yes | `@NeedsVerify` |
| BK_BOOK_TC_121 | API | Medium | Partial | `@KnownBug` |
| BK_BOOK_TC_124 | API | Medium | Yes | — |
| BK_BOOK_TC_125 | API | Medium | Yes | — |
| BK_BOOK_TC_128 | API | Medium | Yes | — |
| BK_BOOK_TC_131 | API | Medium | Yes | `@KnownBug` |
| BK_BOOK_TC_135 | API | Medium | Yes | — |
| BK_BOOK_TC_138 | Android | Medium | Yes | — |
| BK_BOOK_TC_139 | Android | Medium | Yes | — |
| BK_BOOK_TC_141 | Android | Medium | Partial | — |
| BK_BOOK_TC_147 | Android | Medium | Yes | — |
| BK_BOOK_TC_149 | Android | Medium | Yes | — |
| BK_BOOK_TC_156 | Android | Medium | Yes | — |
| BK_BOOK_TC_157 | Android | Medium | Yes | — |
| BK_BOOK_TC_160 | Android | Medium | Yes | `@NeedsVerify` |
| BK_BOOK_TC_164 | Android | Medium | Yes | — |
| BK_BOOK_TC_165 | Android | Medium | Yes | — |
| BK_BOOK_TC_166 | Android | Medium | Yes | — |
| BK_BOOK_TC_168 | Android | Medium | Yes | — |
| BK_BOOK_TC_171 | Android | Medium | Yes | — |
| BK_BOOK_TC_172 | Android | Medium | Yes | — |
| BK_BOOK_TC_174 | Android | Medium | Yes | — |
| BK_BOOK_TC_177 | Android | Medium | Yes | `@KnownBug` |
| BK_BOOK_TC_179 | Android | Medium | Yes | — |
| BK_BOOK_TC_180 | Android | Medium | Yes | — |
| BK_BOOK_TC_183 | Android | Medium | Yes | — |
| BK_BOOK_TC_184 | Android | Medium | Yes | — |
| BK_BOOK_TC_185 | Android | Medium | Yes | — |
| BK_BOOK_TC_186 | Android | Medium | Yes | — |
| BK_BOOK_TC_189 | Android | Medium | Yes | — |
| BK_BOOK_TC_190 | Android | Medium | Yes | — |
| BK_BOOK_TC_191 | Android | Medium | Yes | — |
| BK_BOOK_TC_011 | Web | Low | Yes | — |
| BK_BOOK_TC_015 | Web | Low | Yes | — |
| BK_BOOK_TC_018 | Web | Low | Yes | `@NeedsVerify` |
| BK_BOOK_TC_021 | Web | Low | Yes | — |
| BK_BOOK_TC_022 | Web | Low | Yes | — |
| BK_BOOK_TC_034 | Web | Low | Yes | — |
| BK_BOOK_TC_042 | Web | Low | Yes | — |
| BK_BOOK_TC_047 | Web | Low | Yes | `@NeedsVerify` |
| BK_BOOK_TC_049 | Web | Low | Partial | `@NeedsVerify` |
| BK_BOOK_TC_095 | API | Low | Yes | — |
| BK_BOOK_TC_100 | API | Low | Yes | — |
| BK_BOOK_TC_102 | API | Low | Yes | `@KnownBug` |
| BK_BOOK_TC_104 | API | Low | Yes | — |
| BK_BOOK_TC_112 | API | Low | Yes | — |
| BK_BOOK_TC_113 | API | Low | Yes | — |
| BK_BOOK_TC_122 | API | Low | Yes | `@KnownBug` |
| BK_BOOK_TC_123 | API | Low | Yes | — |
| BK_BOOK_TC_129 | API | Low | Yes | — |
| BK_BOOK_TC_163 | Android | Low | Yes | — |
| BK_BOOK_TC_169 | Android | Low | Yes | `@NeedsVerify` |
| BK_BOOK_TC_176 | Android | Low | Yes | `@KnownBug` |

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
