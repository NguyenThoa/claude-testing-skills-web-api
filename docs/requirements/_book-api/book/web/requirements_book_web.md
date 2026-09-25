# Đặc tả Yêu cầu — Module Sách (`BOOK`) · Nền tảng Web

> Index module (metadata · phân quyền · trạng thái · Story · AMB/RISK · Nhật ký): [../REQUIREMENTS_BOOK_SUMMARY.md](../REQUIREMENTS_BOOK_SUMMARY.md) · Danh mục hệ thống: [../../README.md](../../README.md) · Bản đồ: [../../_discovery/modules/module_03_sach_danh_muc.md](../../_discovery/modules/module_03_sach_danh_muc.md)

| Mục | Giá trị |
|---|---|
| **Hệ thống** | AnhTester Book Management (mã hệ thống `BK`) |
| **Module** | Sách — `Book Management` (`/book-management`) · tạo / sửa (`/book-management/handle`) · chi tiết (`/book-management/detail/<slug>`) |
| **Nền tảng** | **Web** ✅ — `https://book.anhtester.com` |
| **Trình duyệt khảo sát** | Google Chrome 153 (Playwright MCP, headed), viewport đo được `1600 × 750`, `navigator.language = en-US`. Mọi AC về hiển thị **chỉ đúng với trình duyệt + viewport này** |
| **Tầng network** | ✅ Quan sát **thụ động** request do UI phát sinh. **Không** gọi API trực tiếp |
| **Phương pháp** | Thao tác thật ngày 25-09-2026 — khách và tài khoản tự tạo `auto_web_<timestamp>_a@auto.test`. Tạo / sửa / xoá **chỉ** trên 1 cuốn sách do phiên tạo; sách của người khác chỉ xem, **không** mở trang chi tiết (tránh làm tăng lượt xem) |
| **REQ trong file này** | **48** — `REQ-BK-BOOK-02` → `50` trừ `42`. 4 REQ `01` · `42` · `51` · `52` kiểm chứng khớp trên API (25-09-2026) → **chuyển lên index** (dùng chung `Web · API`), mã giữ nguyên |

> **Thang `Nguồn`:** `Kiểm chứng thực tế` = đã thao tác và xác nhận bằng ảnh hoặc số liệu DOM/network ghi trong AC · `API · <METHOD> <path>` = quan sát thụ động request do UI gửi · `❌ lệch (AMB-…)` = AC ghi hành vi **kỳ vọng**, hệ thống hiện chưa đạt.

---

## 2. Bản đồ phủ tài liệu

Không có tài liệu nào cho màn hình này — toàn bộ REQ sinh từ khảo sát thực tế. Mặt API đã có bản đồ (`api_map.md` mục 2.3 · phát hiện F-04 · F-05 · F-06 · F-08 · F-09) nhưng **chưa có REQ**. Quản lý danh mục (icon ⚙ cạnh hàng tab) thuộc module `CAT` — không khảo sát ở lượt này.

---

## 3. Yêu cầu Chức năng

### 3.1. Danh sách & sắp xếp (STORY-BK-BOOK-01)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-BK-BOOK-02 | Thẻ sách hiển thị thông tin chính | | Mỗi thẻ có: ảnh bìa · avatar người đăng · ngày tạo (`dd ThMM yyyy`) · tên sách (link tới trang chi tiết) · lượt xem (biểu tượng mắt) · **giá bán** (`currentPrice`, định dạng `50.000 ₫`). Sách có khuyến mãi hiện thêm **giá gốc gạch ngang** phía trên giá bán | 🟢 | — | Kiểm chứng thực tế · `web_book_list_logged_in_viewport.png` |
| REQ-BK-BOOK-03 | Sách tạo trong vòng 7 ngày có nhãn New | Tiêu chí "mới" = tạo trong vòng **7 ngày** (`AMB-BK-BOOK-03` ✅) | Sách vừa tạo trong ngày hiển thị nhãn `New` ở góc thẻ (danh sách) và `NEW` ở trang chi tiết · sách có ngày tạo (hiện trên thẻ) cách ngày hiện tại **quá 7 ngày** **không** có nhãn `New` | 🟡 | 25-09-2026 · DEMO-AMB-2509 | Kiểm chứng thực tế (vế trong ngày) · `web_book_modify_success_toast_viewport.png` · `web_book_detail_own_viewport.png` · vế > 7 ngày: quyết định PO — **chưa kiểm chứng** |
| REQ-BK-BOOK-04 | Mặc định sắp theo lượt xem giảm dần | | Mở trang → nút hiển thị `Sort By: Feature` · request `sort=viewCount&sortBy=desc` · lượt xem giảm dần từ trái sang phải, trên xuống dưới | 🟢 | — | Kiểm chứng thực tế · `web_book_list_logged_in_viewport.png` · API · GET /api/book (tham số) |
| REQ-BK-BOOK-05 | Sort By: Newest sắp theo ngày tạo mới nhất | | Mở `Sort By` → menu có đúng 4 mục `Feature` · `Newest` · `Price: Low to High` · `Price: High to Low` → chọn `Newest` → request `sort=createdAt&sortBy=desc` | 🟢 | — | Kiểm chứng thực tế · `web_book_sort_menu_open_viewport.png` · API · GET /api/book (tham số) |
| REQ-BK-BOOK-06 | Price: Low to High sắp theo giá bán tăng dần | | Chọn `Price: Low to High` → request `sort=currentPrice&sortBy=asc` · giá bán tăng dần (giá âm đứng đầu — `AMB-BK-BOOK-01`) | 🟢 | — | Kiểm chứng thực tế · API · GET /api/book (tham số) · đọc giá 5 thẻ đầu |
| REQ-BK-BOOK-07 | Price: High to Low sắp theo giá bán giảm dần | | Chọn `Price: High to Low` → request `sort=currentPrice&sortBy=desc` | 🟢 | — | Kiểm chứng thực tế · API · GET /api/book (tham số) |
| REQ-BK-BOOK-08 | Kiểu sắp xếp ghi lên URL và áp dụng lại khi mở URL | | Chọn `Price: Low to High` → URL thêm `?sort=Price%3A+Low+to+High`. Mở thẳng `/book-management?sort=Price%3A+High+to+Low` → nút hiện `Sort By: Price: High to Low` · request `sort=currentPrice&sortBy=desc` | 🟢 | — | Kiểm chứng thực tế · đọc URL + nhãn nút |
| REQ-BK-BOOK-09 | Cuộn tới cuối tải thêm sách | Không có thanh phân trang | Trang đầu có 36 thẻ · cuộn tới cuối → hiện `Loading more book...` → tải `page=2&limit=36` → thêm 36 thẻ (72) | 🟢 | — | Kiểm chứng thực tế · đếm `.MuiCard-root` + API · GET /api/book?…&page=2 |

### 3.2. Danh mục & bộ lọc (STORY-BK-BOOK-02)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-BK-BOOK-10 | Hàng tab danh mục kèm số sách | | Dưới thanh Filter/Sort có hàng tab cuộn ngang: `All` (mặc định chọn) rồi các danh mục, mỗi tab kèm **số sách** (VD `Test 11`). Chỉ liệt kê danh mục có sách (49 tab lúc khảo sát trong khi hệ thống có 197 danh mục — không assert con số) | 🟢 | — | Kiểm chứng thực tế · `web_book_list_logged_in_viewport.png` · đếm `role=tab` |
| REQ-BK-BOOK-11 | Chọn tab danh mục lọc sách theo danh mục | | Bấm tab `Test 11` → tab được chọn · URL `?category=+Test` · chỉ còn **11** thẻ = số trên tab. Network: `search={"categories":{"some":{"name":{"in":[" Test"]}}}}` | 🟢 | — | Kiểm chứng thực tế · `web_book_category_tab_selected_viewport.png` · đếm thẻ |
| REQ-BK-BOOK-12 | Nút Filter mở khu lọc | | Bấm `Filter` → hiện ô `Search book...` và cặp ô `Price from` → `Price to`, dòng chữ `Price not specified` · URL thêm `isFilter=true` · bấm lại thì khu lọc đóng | 🟢 | — | Kiểm chứng thực tế · `web_book_filter_search_uppercase_viewport.png` · đọc URL |
| REQ-BK-BOOK-13 | Tìm sách theo từ khoá | | Gõ `doraemon` vào `Search book...` → chỉ còn sách khớp (2 cuốn lúc khảo sát). Network: `search={"OR":[{"name":{"contains":…}},{"description":{"contains":…}},{"slug":{"contains":…}}]}` — tìm trong tên, mô tả và slug | 🟢 | — | Kiểm chứng thực tế · API · GET /api/book (tham số search) |
| REQ-BK-BOOK-14 | Tìm sách không phân biệt hoa thường | | Gõ `DORAEMON` → cùng kết quả như `doraemon` | 🟢 | — | Kiểm chứng thực tế · `web_book_filter_search_uppercase_viewport.png` |
| REQ-BK-BOOK-15 | Ô khoảng giá có gợi ý | | Bấm `Price from` (hoặc `Price to`) → gợi ý `10.000` · `100.000` · `1.000.000` · `10.000.000`; ô nhận số tự do (`type=number`) | 🟢 | — | Kiểm chứng thực tế · đọc `role=option` + `type` |
| REQ-BK-BOOK-16 | Lọc giá từ một mức trở lên | | Chỉ chọn `Price from` = `10.000` → URL `from=10000` · request `search={"currentPrice":{"gte":10000}}` | 🟢 | — | API · GET /api/book (tham số) — chưa đối chiếu từng thẻ |
| REQ-BK-BOOK-17 | Lọc giá trong khoảng Từ – Đến | Kỳ vọng — hiện **chưa đạt** | `Price from` 10.000 + `Price to` 100.000 → phải lọc `10.000 ≤ giá bán ≤ 100.000`. **Hiện tại:** request **chỉ** còn `{"currentPrice":{"lte":100000}}` — mất cận dưới, danh sách vẫn có sách giá `-8.382.500 ₫` | 🟢 | — | Kiểm chứng thực tế — ❌ lệch (`AMB-BK-BOOK-02`) · `web_book_filter_price_range_lost_from_viewport.png` |
| REQ-BK-BOOK-18 | Dòng mô tả khoảng giá | | Chưa nhập giá → `Price not specified` · nhập cả 2 đầu → `Price between 10.000 ₫ and 100.000 ₫` | 🟢 | — | Kiểm chứng thực tế · `web_book_filter_search_uppercase_viewport.png` · `web_book_filter_price_range_lost_from_viewport.png` |
| REQ-BK-BOOK-19 | Từ khoá và khoảng giá ghi lên URL | | Tìm `doraemon` → URL có `searchName=doraemon` · chọn giá → URL có `from=10000&to=100000` | 🟢 | — | Kiểm chứng thực tế · đọc URL |

### 3.3. Quyền thao tác theo trạng thái đăng nhập (STORY-BK-BOOK-03)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-BK-BOOK-20 | Khách không có nút tạo, sửa, quản lý danh mục | | Chưa đăng nhập → **không** có `New book` · thẻ sách **không** có nút bút · cuối hàng tab **không** có icon ⚙ | 🟢 | — | Kiểm chứng thực tế · `web_book_list_guest_viewport.png` · đọc DOM (0 nút trong thẻ) |
| REQ-BK-BOOK-21 | Đã đăng nhập có New book, bút sửa trên mọi thẻ và icon ⚙ | Hành vi hiện tại — **cùng bản chất F-02** (`AMB-BK-BOOK-15` 🔴) | Đăng nhập tài khoản tự tạo → nút `New book` góc phải tiêu đề · **mọi** thẻ sách (kể cả sách người khác đăng) có nút bút · icon ⚙ cuối hàng tab | 🟢 | — | Kiểm chứng thực tế · `web_book_list_logged_in_viewport.png` · chỉ **bấm** bút trên sách do phiên tạo |

### 3.4. Tạo sách (STORY-BK-BOOK-04)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-BK-BOOK-22 | Form Create a new book có đủ thành phần | | `New book` → `/book-management/handle?name=Create-new-book&query=<bộ lọc hiện tại>` · tiêu đề `Create a new book` · breadcrumb `Book management / Create a new book` · khối *Detail* (`Book name *` · `Slug name book *` + ô `Change` · `Description` · `Picture *` vùng kéo-thả) · khối *Property* (`Regular price` hậu tố `VNĐ` · `Categories *`) · khối *Promotion* (`Select promotion`, thu gọn) · công tắc `Available book` · nút `Reset` · `Create book` | 🟢 | — | Kiểm chứng thực tế · `web_book_create_default_fullpage.png` |
| REQ-BK-BOOK-23 | Create book khoá khi form chưa có thay đổi | | Mở form, chưa nhập gì → `Create book` `disabled` · gõ Book name → `Create book` bật | 🟢 | — | Kiểm chứng thực tế · đọc thuộc tính `disabled` |
| REQ-BK-BOOK-24 | Slug tự sinh từ tên sách | | Book name `Auto Web Book <timestamp> Tiếng Việt` → Slug `auto-web-book-<timestamp>-tieng-viet` — chữ thường, **bỏ dấu tiếng Việt**, khoảng trắng thành `-` | 🟢 | — | Kiểm chứng thực tế · `web_book_create_filled_fullpage.png` · đọc `value` |
| REQ-BK-BOOK-25 | Ô slug khoá mặc định | | Ô `Slug name book` có `disabled=true`, ô `Change` chưa tick | 🟢 | — | Kiểm chứng thực tế · đọc `disabled` · chưa thử tick `Change` |
| REQ-BK-BOOK-26 | Thiếu ảnh bị chặn | | Không chọn ảnh → `Create book` → vùng Picture viền đỏ + `You must upload at least 1 file` · không gửi request | 🟢 | — | Kiểm chứng thực tế · `web_book_create_missing_required_fullpage.png` |
| REQ-BK-BOOK-27 | Thiếu giá bị chặn | Nhãn `Regular price` **không** có dấu `*` | Giá trống (hoặc nhập chữ — ô số trả về rỗng) → `Price is required.` | 🟢 | — | Kiểm chứng thực tế · `web_book_create_missing_required_fullpage.png` |
| REQ-BK-BOOK-28 | Thiếu danh mục bị chặn | | Không chọn danh mục → `Please select at least one category` | 🟢 | — | Kiểm chứng thực tế · `web_book_create_missing_required_fullpage.png` |
| REQ-BK-BOOK-29 | Giá tối thiểu 1.000 | Câu chữ lệch biên (`AMB-BK-BOOK-04`) | `-1000` · `0` · `999` → `Price must be greater than 1000 VNĐ.` · `1000` → hợp lệ (dưới ô hiện `1.000 VNĐ`) | 🟢 | — | Kiểm chứng thực tế · đọc lỗi bằng DOM (6 giá trị) |
| REQ-BK-BOOK-30 | Giá tối đa 100.000.000.000 | Câu chữ lệch biên (`AMB-BK-BOOK-05`) | `100000000000` → hợp lệ · `100000000001` → `Price must be less than 1 billion VNĐ.` (biên đo bằng chia đôi khoảng) | 🟢 | — | Kiểm chứng thực tế · đọc lỗi bằng DOM |
| REQ-BK-BOOK-31 | Giá hợp lệ hiển thị định dạng dưới ô | | Nhập `50000` → dưới ô hiện `50.000 VNĐ` · nhập `1500.5` → `1.500,5 VNĐ` (số lẻ được chấp nhận) | 🟢 | — | Kiểm chứng thực tế · `web_book_create_filled_fullpage.png` · đọc DOM |
| REQ-BK-BOOK-32 | Categories liệt kê mọi danh mục kèm số sách | | Bấm ô `Categories` → danh sách toàn bộ danh mục (197 lúc khảo sát), mỗi mục có huy hiệu số sách · gõ `Technology` → chỉ còn `5 Technology` · chọn → chip `Technology` | 🟢 | — | Kiểm chứng thực tế · `web_book_create_categories_open_viewport.png` |
| REQ-BK-BOOK-33 | Categories cho thêm tên tự gõ | Cùng bản chất F-05 (`AMB-BK-BOOK-06`) | Gõ tên chưa có (không còn gợi ý) → `Enter` → thêm chip mới mang biểu tượng ngôi sao (khác chip danh mục có sẵn) | 🟢 | — | Kiểm chứng thực tế · `web_book_create_freetext_category_chip_viewport.png` · **chưa** gửi tạo sách với chip này |
| REQ-BK-BOOK-34 | Tên danh mục tự gõ tối đa 24 ký tự | Biên chốt: ≤ 24 hợp lệ, ≥ 25 bị chặn (`AMB-BK-BOOK-06` ✅) | Chip tự gõ **24** ký tự → **không** có lỗi · **25** ký tự → dưới ô `Each category name must be less than 25 characters` · 28 ký tự → cùng câu (đã quan sát) | 🟡 | 25-09-2026 · DEMO-AMB-2509 | Kiểm chứng thực tế (28 ký tự) · `web_book_create_freetext_category_chip_viewport.png` · biên 24/25: quyết định PO — **chưa kiểm chứng** |
| REQ-BK-BOOK-35 | Tệp không phải ảnh không được thêm | | Chọn tệp `.txt` qua `browse` → **không** có ảnh xem trước, lỗi `You must upload at least 1 file` vẫn còn · **không** có thông báo riêng (`AMB-BK-BOOK-12`). Ô tệp có `accept` = 7 định dạng ảnh | 🟢 | — | Kiểm chứng thực tế · đọc DOM sau khi chọn tệp |
| REQ-BK-BOOK-36 | Ảnh hợp lệ hiện xem trước, tải lên khi tạo sách | | Chọn ảnh PNG → hiện ảnh xem trước + nút `Remove all` · lỗi Picture mất · **chưa** tải lên. Bấm `Create book` → `POST /api/file` (200) rồi `POST /api/book` với `pictures` = `["/$book-image/<slug>/<tên tệp>_<4 ký tự>.png"]` | 🟢 | — | Kiểm chứng thực tế · `web_book_create_filled_fullpage.png` · API · POST /api/file → 200 |
| REQ-BK-BOOK-37 | Chọn khuyến mãi chỉ từ khuyến mãi còn hiệu lực | | Mở khối `Promotion` → request `GET /api/promotion-book?limit=5&page=1` với điều kiện `endDate ≥ thời điểm hiện tại` **và** `isActive = true`, kèm ô tìm theo `name` / `code` | 🟢 | — | API · GET /api/promotion-book (tham số) — nội dung bảng chưa đọc |
| REQ-BK-BOOK-38 | Available book mặc định bật | | Mở form → công tắc `Available book` bật · tạo sách → body `status: "AVAILABLE"` | 🟢 | — | Kiểm chứng thực tế · `web_book_create_default_fullpage.png` · API · POST /api/book (body) |
| REQ-BK-BOOK-39 | Tạo sách thành công | | Điền hợp lệ → `Create book` → thông báo `Book created successfully.` · quay về `/book-management` **giữ** bộ lọc lúc bấm New book (VD `?category=+Test`). Network: `POST /api/book` → **200** | 🟢 | — | Kiểm chứng thực tế · `web_book_create_success_toast_viewport.png` |
| REQ-BK-BOOK-40 | Sách mới xuất hiện đầu danh sách Newest | Tác tạo dùng được (skill 4.3.8) | Sau REQ-39 → `Sort By: Newest` → thẻ đầu là sách vừa tạo, nhãn `New`, đúng tên, ảnh, giá `50.000 ₫` | 🟢 | — | Kiểm chứng thực tế · đọc thẻ đầu bằng DOM (ảnh `web_book_modify_success_toast_viewport.png` là cùng vị trí sau khi đã đổi tên) |

### 3.5. Trang chi tiết (STORY-BK-BOOK-05)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-BK-BOOK-41 | Trang chi tiết sách | | Bấm tên/ảnh trên thẻ → `/book-management/detail/<slug>` · nút `Back` · ảnh bìa với bộ đếm `1/1` và nút trước/sau · nhãn `NEW` (sách mới) · tên danh mục (link) · tên sách · giá bán · khối `Author by` có tên **và email** người đăng (`AMB-BK-BOOK-13`) | 🟢 | — | Kiểm chứng thực tế · `web_book_detail_own_viewport.png` |
| REQ-BK-BOOK-43 | Sách không tồn tại | | Mở `/book-management/detail/<slug không tồn tại>` → thông báo `Book not found.` · vùng ảnh hiện `No Data` · `Author by` trống. Network: `GET /api/book/<slug>?view=true` → **404** | 🟢 | — | Kiểm chứng thực tế · `web_book_detail_deleted_not_found_viewport.png` |

### 3.6. Sửa sách (STORY-BK-BOOK-06)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-BK-BOOK-44 | Form Modify book điền sẵn dữ liệu | | Bấm bút trên thẻ → `/book-management/handle?name=Modify-book&id=<id>&query=…` · tiêu đề `Modify book` · Book name · Slug · giá · danh mục · ảnh · `Available book` **điền sẵn** · `Save changes` và `Reset` `disabled` cho tới khi sửa · có thêm nút `Delete` cuối trang | 🟢 | — | Kiểm chứng thực tế · `web_book_modify_default_fullpage.png` · đọc `value` + `disabled` |
| REQ-BK-BOOK-45 | Sửa tên sinh lại slug | Hành vi quan sát (`AMB-BK-BOOK-07`) | Sửa Book name → Slug đổi theo tên mới (`…-edited`) · `Save changes` bật | 🟢 | — | Kiểm chứng thực tế · đọc `value` ô Slug |
| REQ-BK-BOOK-46 | Lưu thay đổi thành công | | `Save changes` → thông báo `Book updated successfully.` · quay về danh sách (giữ `?sort=…`) · thẻ hiển thị tên mới. Network: `PATCH /api/book/<id>` → **200** | 🟢 | — | Kiểm chứng thực tế · `web_book_modify_success_toast_viewport.png` |
| REQ-BK-BOOK-47 | Tắt Available book lưu trạng thái UNAVAILABLE | | Tắt `Available book` → `Save changes` → body `status: "UNAVAILABLE"` · mở lại Modify → công tắc **tắt** | 🟢 | — | Kiểm chứng thực tế · API · PATCH /api/book/{id} (body) · đọc `checked` |

### 3.7. Xoá sách (STORY-BK-BOOK-07)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-BK-BOOK-48 | Xoá cần xác nhận, hiển thị đúng tên sách | Kỳ vọng — hiện **chưa đạt** | Modify book → `Delete` → hộp `Confirm delete` nội dung `Do you want delete <tên>, after delete you can't undo` · nút `Cancel` · `Delete`. `<tên>` phải là tên **hiện tại**. **Hiện tại:** hiển thị tên **lúc tạo** dù đã đổi tên | 🟢 | — | Kiểm chứng thực tế — ❌ lệch (`AMB-BK-BOOK-08`) · `web_book_delete_confirm_stale_name_viewport.png` |
| REQ-BK-BOOK-49 | Cancel không xoá | | Hộp `Confirm delete` → `Cancel` → hộp đóng · vẫn ở Modify book · **không** có request `DELETE` | 🟢 | — | Kiểm chứng thực tế · đọc DOM + network |
| REQ-BK-BOOK-50 | Xác nhận xoá gỡ sách | | `Delete` trong hộp → thông báo `Deleted successfully.` · về danh sách · sách **không** còn. Network: `DELETE /api/book/<id>` → **200** · mở lại URL chi tiết → REQ-43 | 🟢 | — | Kiểm chứng thực tế · `web_book_delete_success_toast_viewport.png` |

**Tổng: 52 REQ** — Danh sách 10 (`01 → 09` · `51`) · Danh mục & lọc 10 (`10 → 19`) · Quyền 2 (`20 · 21`) · Tạo 20 (`22 → 40` · `52`) · Chi tiết 3 (`41 → 43`) · Sửa 4 (`44 → 47`) · Xoá 3 (`48 → 50`) → `10 + 10 + 2 + 20 + 3 + 4 + 3 = 52 ✔`

> ↑ `REQ-BK-BOOK-01` · `42` · `51` · `52` **đã chuyển lên index** [`../REQUIREMENTS_BOOK_SUMMARY.md` mục 3](../REQUIREMENTS_BOOK_SUMMARY.md#3-yêu-cầu-dùng-chung-web--api) ngày 25-09-2026 — kiểm chứng khớp trên API, `Nền tảng` = `Web · API`. Mã giữ nguyên; ảnh evidence ở lại `web/evidence/`. Tổng module: 52 REQ web = 48 ở file này + 4 ở index.

---

## 4. Đặc tả Trường Dữ liệu (Field Spec)

| Màn hình | Field (Label) | Loại UI (DOM) | Required | Ràng buộc quan sát được | REQ liên quan | Ghi chú |
|---|---|---|---|---|---|---|
| Danh sách | Sort By | nút + menu 4 mục | — | Mặc định `Feature` | 04 → 08 | Nhãn ghi lên URL `sort` |
| Danh sách | Tab danh mục | `role=tab` | — | `All` + danh mục có sách | 10 · 11 | URL `category` giữ nguyên khoảng trắng đầu tên (`+Test`) |
| Filter | Search book... | `input` | — | Tìm `contains` trong name · description · slug, không phân biệt hoa thường | 13 · 14 · 19 | URL `searchName` |
| Filter | Price from · Price to | combobox Autocomplete · `input[type=number]` | — | Gợi ý 4 mốc | 15 → 19 | URL `from` · `to` · lọc theo **giá bán** `currentPrice` |
| Tạo / Sửa | Book name | `input[name=name]` · `required` | ✅ | Câu lỗi khi trống **chưa** lấy được (luôn nhập tên khi thử) | 22 · 24 · 45 | |
| Tạo / Sửa | Slug name book | `input[name=slug]` · `required` · `disabled` | ✅ | Tự sinh từ tên | 24 · 25 · 45 | Mở khoá bằng ô `Change` (chưa thử) |
| Tạo / Sửa | Description | `textarea[name=description]` | ❌ | — | 22 | Chưa thử giới hạn độ dài |
| Tạo / Sửa | Picture | `input[type=file][name=picture]` · `multiple` · `accept` 7 định dạng ảnh | ✅ | Ít nhất 1 ảnh | 26 · 35 · 36 | Chưa thử giới hạn dung lượng / số ảnh |
| Tạo / Sửa | Regular price | `input[type=number][name=price]` · hậu tố `VNĐ` | ✅ (nhãn không có `*`) | `1.000` ≤ giá ≤ `100.000.000.000` · nhận số lẻ | 27 · 29 · 30 · 31 | |
| Tạo / Sửa | Categories | Autocomplete nhiều giá trị (chip) | ✅ | ≥ 1 danh mục · cho gõ tên mới (tạo danh mục mới khi lưu), mỗi tên ≤ 24 ký tự | 28 · 32 · 33 · 34 · 52 | |
| Tạo / Sửa | Promotion | bảng chọn (checkbox) · 5 dòng/trang · ô `Search...` | ❌ | Chỉ khuyến mãi còn hiệu lực | 37 | Chưa chọn thử |
| Tạo / Sửa | Available book | công tắc | — | Mặc định bật → `AVAILABLE` · tắt → `UNAVAILABLE` | 38 · 47 | |

---

## 5. Validation & thông báo (nguyên văn)

| REQ | Điều kiện | Thông báo | Vị trí |
|---|---|---|---|
| 26 | Không có ảnh | `You must upload at least 1 file` (không dấu chấm cuối) | Dưới vùng Picture |
| 27 | Giá trống | `Price is required.` | Dưới ô |
| 28 | Không có danh mục | `Please select at least one category` | Dưới ô |
| 29 | Giá < 1.000 | `Price must be greater than 1000 VNĐ.` | Dưới ô |
| 30 | Giá > 100.000.000.000 | `Price must be less than 1 billion VNĐ.` | Dưới ô |
| 34 | Tên danh mục tự gõ ≥ 25 ký tự (đã đo ở 28; biên 25 theo quyết định PO) | `Each category name must be less than 25 characters` | Dưới ô |
| 18 | Chưa nhập khoảng giá · đủ 2 đầu | `Price not specified` · `Price between <from> ₫ and <to> ₫` | Dưới cặp ô giá |
| 39 | Tạo thành công | `Book created successfully.` | Thông báo nổi |
| 46 | Sửa thành công | `Book updated successfully.` | Thông báo nổi |
| 48 | Bấm Delete | `Confirm delete` / `Do you want delete <tên>, after delete you can't undo` | Hộp thoại |
| 50 | Xoá thành công | `Deleted successfully.` (biểu tượng **đỏ** — `AMB-BK-BOOK-11`) | Thông báo nổi |
| 43 | Sách không tồn tại | `Book not found.` + `No Data` | Thông báo nổi + vùng ảnh |

---

## 6. Luồng người dùng

```
/book-management ─┬─ Sort By ─► ?sort=…          ─┬─ Filter ─► ?isFilter=true (Search book · Price from/to)
                  ├─ tab danh mục ─► ?category=…  └─ cuộn cuối ─► "Loading more book..." (+36)
                  ├─ bấm thẻ ─► /book-management/detail/<slug>  (lượt xem +1)
                  └─ [đã đăng nhập] New book ─► /handle?name=Create-new-book ─ Create book ─► danh sách + "Book created successfully."
                                    bút trên thẻ ─► /handle?name=Modify-book&id=… ─┬─ Save changes ─► danh sách + "Book updated successfully."
                                                                                     └─ Delete ─► Confirm delete ─► danh sách + "Deleted successfully."
Khách mở /handle ─► /sign-in?redirect=/book-management/handle + "Please login first" (REQ-BK-AUTH-96)
```

---

## 7. Yêu cầu phi chức năng quan sát được

| Hạng mục | Quan sát | Ghi chú |
|---|---|---|
| Giá âm trên danh sách | Nhiều thẻ có giá bán âm (`-1.000 ₫`, `-8.382.500 ₫`, `-12.194.250 ₫`) do khuyến mãi lớn hơn giá gốc | `AMB-BK-BOOK-01` ✅ chốt là lỗi → REQ-51 · F-04 |
| Ảnh hỏng | Console báo nhiều `404` cho `GET /api/file?path=…` (đường dẫn ảnh cũ / ảnh ngoài) | Không phải lỗi của TC — `RISK-BK-BOOK-04` |
| Tiêu đề tab | Trang chi tiết giữ tiêu đề mặc định `API RESTful miễn phí dành cho Tester kiểm thử` | `AMB-BK-BOOK-17` |
| Bố cục khách | Khách thấy lưới thẻ khác bố cục (thẻ đầu chiếm 2 cột, chữ đè lên ảnh) so với người đã đăng nhập | Chỉ ghi nhận, không cấp REQ |
| Tải trang lần đầu | Có lúc phát 2 request liền: `search={"status":"AVAILABLE"}` rồi `search={}` | Ghi chú kỹ thuật — danh sách hiển thị theo request sau |

---

## 8. Ghi chú kỹ thuật cho automation

| Vấn đề | Chi tiết |
|---|---|
| Thẻ sách | `.MuiCard-root`; nút bút là `button` duy nhất trong thẻ (không nhãn) · link chi tiết `a[href^="/book-management/detail/"]` |
| Tìm sách test | Dùng `Search book...` với tên riêng `auto_book_<timestamp>` thay vì cuộn — danh sách cuộn vô tận và thứ tự đổi theo lượt xem |
| Nút `Create book` / `Save changes` | Khoá tới khi form "dirty" — nhập ít nhất 1 ô trước khi assert lỗi bắt buộc |
| Categories | `role=combobox` nhãn `Categories` · lựa chọn có tiền tố số sách (`5 Technology`) → chọn theo `hasText`, không khớp tuyệt đối |
| Upload ảnh | `input[type=file][name=picture]` — dùng `setInputFiles`; tải lên xảy ra lúc bấm Create |
| Toast | Sống ≈ 3 giây (`RISK-BK-AUTH-10`) |
| Mở trang chi tiết | Làm tăng lượt xem thật — TC chỉ mở chi tiết sách tự tạo |

---

## 9. Danh mục Evidence

Thư mục [`evidence/`](evidence/). **Mọi ảnh đã mở lại xác nhận đúng trạng thái.** Ảnh danh sách chứa ảnh bìa/tên sách của người dùng khác (dữ liệu công khai, không có email). Ảnh chụp viewport trừ khi tên có `_fullpage` / `_element`; ảnh fullpage bị thanh bên (sidebar) dính ghép lặp giữa ảnh.

| Ảnh | Trạng thái | REQ |
|---|---|---|
| `web_book_list_guest_viewport.png` | Khách — không New book, không bút, không ⚙ | 01 · 20 |
| `web_book_list_logged_in_viewport.png` | Đã đăng nhập — New book, bút, ⚙, `Sort By: Feature` | 02 · 04 · 10 · 21 |
| `web_book_sort_menu_open_viewport.png` | Menu Sort By mở — 4 mục | 05 |
| `web_book_category_tab_selected_viewport.png` | Tab `Test 11` được chọn | 11 |
| `web_book_filter_search_uppercase_viewport.png` | Filter mở, tìm `DORAEMON` — 2 kết quả, `Price not specified` | 12 · 14 · 18 |
| `web_book_filter_price_range_lost_from_viewport.png` | Khoảng 10.000 → 100.000 nhưng vẫn có giá âm | 17 · 18 |
| `web_book_create_default_fullpage.png` | Form tạo mặc định, Create book mờ | 22 · 38 |
| `web_book_create_missing_required_fullpage.png` | Thiếu ảnh · giá · danh mục | 26 · 27 · 28 |
| `web_book_create_categories_open_viewport.png` | Danh sách Categories mở | 32 |
| `web_book_create_freetext_category_chip_viewport.png` | Chip tự gõ 28 ký tự + lỗi độ dài | 33 · 34 |
| `web_book_create_filled_fullpage.png` | Form đủ dữ liệu, ảnh xem trước, slug tự sinh | 24 · 31 · 36 |
| `web_book_create_success_toast_viewport.png` | `Book created successfully.`, giữ tab `Test` | 39 |
| `web_book_detail_own_viewport.png` | Trang chi tiết sách tự tạo | 03 · 41 |
| `web_book_modify_default_fullpage.png` | Modify book điền sẵn, Save changes/Reset mờ, nút Delete | 44 |
| `web_book_modify_success_toast_viewport.png` | `Book updated successfully.`, tên mới, nhãn New | 03 · 46 |
| `web_book_unavailable_card_no_mark_element.png` | Thẻ sách UNAVAILABLE — không có dấu hiệu | `AMB-BK-BOOK-09` |
| `web_book_delete_confirm_stale_name_viewport.png` | Hộp xác nhận hiện tên cũ | 48 |
| `web_book_delete_success_toast_viewport.png` | `Deleted successfully.` (biểu tượng đỏ) | 50 |
| `web_book_detail_deleted_not_found_viewport.png` | Chi tiết sách đã xoá — `No Data` | 43 |

REQ không có ảnh riêng, truy bằng số liệu DOM/network ghi trong AC: 06 · 07 · 08 · 09 · 13 · 15 · 16 · 19 · 23 · 25 · 29 · 30 · 35 · 37 · 40 · 42 · 45 · 47 · 49 · 51. **Chưa kiểm chứng** (quyết định PO `DEMO-AMB-2509`): 52 · vế > 7 ngày của 03 · biên 24/25 của 34.

---

## 10. Dữ liệu test — tạo / dọn

| Bản ghi | Tạo bởi | Dùng cho | Dọn |
|---|---|---|---|
| Sách `Auto Web Book <timestamp> …` (danh mục `Technology`, giá 50.000) | Create book (REQ-39) | Chi tiết · sửa · xoá | ✅ Đã xoá qua Modify → Delete (REQ-50) |
| Ảnh bìa `$book-image/auto-web-book-<timestamp>-tieng-viet/auto_web_book_cover_<4 ký tự>.png` | Upload khi tạo sách (REQ-36) | Ảnh bìa | ❔ **Chưa xác minh** — tìm theo tên trong `File management` không thấy (ô tìm có thể chỉ tìm thư mục hiện tại). Có thể còn trên server — `RISK-BK-BOOK-03` |
| Chip danh mục tự gõ `khong_ton_tai_zzz_<timestamp>` | Gõ vào Categories | REQ-33 · 34 | ✅ Gỡ chip trước khi tạo sách — **không** tạo danh mục mới |

Không sửa/xoá sách của người khác. Lượt xem +1 chỉ trên sách tự tạo.
