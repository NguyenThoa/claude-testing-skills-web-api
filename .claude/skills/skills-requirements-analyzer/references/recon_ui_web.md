# Nhánh UI Recon — phân tích website thực tế

### 3.1. Nhánh UI Recon — phân tích website thực tế

1. **Phân tích Khung giao diện (Layout):** Header, Footer, Sidebar, Main Content, Breadcrumb
2. **Thu thập Form & Inputs:** tất cả `input`, `select`, `textarea` — ghi nhận `type`, `required`, `maxlength`, `minlength`, `pattern`, giá trị mặc định
3. **Thu thập Actions:** chức năng từng nút (Save, Submit, Cancel, Delete, Edit), alerts/toasts/validation messages khi tương tác lỗi
4. **Trích xuất Workflows:** sự phụ thuộc giữa các thành phần (VD: nút Submit chỉ enable khi tích Checkbox)
5. **Thu thập Phân quyền (nếu có nhiều role):** đăng nhập từng role (nếu được cung cấp account) — ghi nhận role nào thấy gì / làm được gì
6. **Thu thập Trạng thái (nếu entity có status):** các trạng thái quan sát được và hành động cho phép ở từng trạng thái
7. **Thu thập Thông báo lỗi:** trigger từng validation để ghi nhận nguyên văn error message
8. **Đọc tầng network** (mục **3.1.1**) — bắt buộc khi hệ thống không có tài liệu
9. **Thăm dò phân quyền khi thiếu account** (mục **3.1.2**) — chỉ khi không đủ account cho mọi role

### 3.1.1. Thu thập từ tầng Network (BẮT BUỘC khi hệ thống không có tài liệu)

DOM chỉ cho biết **hệ thống đang hiển thị gì**. Tầng network cho biết **hệ thống thật sự làm gì** — đây là nguồn quý nhất khi không có một dòng tài liệu nào, và là thứ duy nhất tiết lộ được phần backend mà UI giấu đi.

Bật `browser_network_requests` trong suốt quá trình recon (không chỉ lúc load trang — **phải bật khi submit form** mới bắt được response lỗi).

| Loại request | Dữ kiện rút ra được | Ghi vào mục nào |
|---|---|---|
| `GET /api/<entity>` — danh sách | Tên trường thật của entity · trường **có trong data nhưng không hiển thị** trên bảng · cấu trúc phân trang (`page`/`size`/`total`) | 6.3 Field Spec · 6.2 REQ về phân trang |
| `GET /api/<entity>/{id}` — chi tiết | Toàn bộ schema entity · quan hệ tới entity khác (`customer_id`, `owner`) | 6.3 · Bản đồ phụ thuộc |
| `POST`/`PUT` — payload submit | Tên field thật ↔ nhãn hiển thị · field ẩn được gửi kèm · **kiểu dữ liệu thật** (số vs chuỗi) | 6.3 (cột ánh xạ nhãn ↔ field) |
| Response **4xx khi submit sai** | ⭐ **Validation server-side** — rule mà UI không chặn · **nguyên văn message** trong body (thường khác message hiện trên UI) | 6.4 Validation Messages |
| Response chứa enum | Danh sách trạng thái đầy đủ — kể cả trạng thái **chưa từng thấy trên UI** | 6.6 Ma trận Trạng thái |
| Endpoint gọi khi mở dropdown | Nguồn dữ liệu của dropdown (bảng master nào) · **tổng số option thật** so với số đang hiển thị | 6.3 · phát hiện dropdown bị giới hạn |
| Endpoint **có nhưng không UI nào gọi** | Tính năng chưa build hoặc đã gỡ giao diện | 6.2 với trạng thái ⚪ + `AMB-<MODULE>-XX` |
| Response `403` khi đổi role | Ranh giới phân quyền thật ở tầng server | 6.5 Ma trận Phân quyền |

**Luật ghi nhận — bắt buộc:**

| Tình huống | Xử lý |
|---|---|
| Rule chỉ có ở server, UI **không** chặn | Vẫn gán REQ, cột `Nguồn` ghi `API response · POST /api/x · 422` + mở `AMB-<MODULE>-XX` hỏi: chặn ở UI hay cố ý để server chặn? |
| Message API **khác** message hiện trên UI | Ghi **cả hai nguyên văn** vào 6.4 + `AMB-<MODULE>-XX` 🔴 — đây là bug tiềm ẩn, không phải ambiguity thường |
| Field có trong payload nhưng **không** có trên form | Gán REQ trạng thái ⚪ hoặc mở `AMB-<MODULE>-XX` — **không** im lặng bỏ qua |
| Endpoint không có UI | Ghi nhận, **KHÔNG** gọi thử để "kiểm chứng" |

🚫 **Cấm tuyệt đối:** gọi API trực tiếp (curl/fetch/`browser_evaluate` gọi endpoint) để dò hành vi. Recon chỉ được **quan sát thụ động** request do UI tự phát sinh. Gọi thẳng API là hành vi kiểm thử xâm nhập, càng nguy hiểm trên môi trường dùng chung — và request tự tay tạo ra **không** chứng minh được điều gì về hành vi của UI.

📌 Cột `Nguồn` cho dữ kiện lấy từ network ghi rõ: `API · POST /api/customers · 422` — đủ để người review mở lại tab Network mà đối chiếu.

### 3.1.2. Phân quyền khi không đủ account cho mọi role

Thực tế hay gặp: hệ thống có 5 role nhưng QA chỉ đưa 1 account admin. Không được vì thế mà **bỏ trống** mục 6.5, cũng không được **bịa** ma trận.

**Bước 1 — Xác định hệ thống có những role nào** (không cần account vẫn làm được):

| Nguồn | Cách lấy |
|---|---|
| Màn hình quản lý người dùng / phân quyền | Đọc dropdown chọn role, bảng danh sách role — thường lộ đủ tên role |
| Màn hình cấu hình quyền | Ma trận quyền của chính hệ thống — **nguồn tốt nhất**, chép nguyên trạng |
| Response API chứa `role` / `permissions` | Mục 3.1.1 |
| Tài liệu QA cung cấp (nếu có) | Mục 3.2 |

**Bước 2 — Suy diễn có kiểm soát, theo 3 mức bằng chứng:**

| Mức | Cách có được | Ghi vào ma trận |
|---|---|---|
| ✅ **Đã kiểm chứng** | Đăng nhập đúng role đó và thử thật | `✅` / `❌` bình thường |
| ⚠️ **Suy từ cấu hình** | Đọc từ màn hình phân quyền của hệ thống, chưa đăng nhập thử | `⚠️✅` / `⚠️❌` — kèm chú thích nguồn |
| ❔ **Chưa có căn cứ** | Không có account, không có màn hình cấu hình | `❔` + **bắt buộc** mở `AMB-<MODULE>-XX` 🔴 |

**Bước 3 — Với account đang có, vẫn khai thác được:**
- Menu/nút **bị ẩn** vs **hiện nhưng disabled** — hai cái này nghĩa khác nhau, phải đọc DOM để phân biệt (ảnh không cho biết)
- Truy cập thẳng URL của chức năng bị ẩn → quan sát phản ứng (chuyển hướng · trang 403 · vẫn vào được). ⚠️ Chỉ thử với **URL chỉ đọc**, tuyệt đối không thử URL xoá/sửa
- So sánh response `permissions` trả về lúc đăng nhập với danh sách quyền đầy đủ ở màn hình cấu hình

**Luật cứng:**
- ❌ **Không** suy quyền của role B từ hành vi của role A — "admin làm được nên manager chắc cũng làm được" là bịa
- ❌ Ô `❔` **không được** làm tròn thành `❌`. "Chưa kiểm chứng" ≠ "không có quyền"
- ✅ Cuối ma trận 6.5 **bắt buộc** có dòng tổng: `Đã kiểm chứng: N ô · Suy diễn: M ô · Chưa rõ: K ô` — người đọc biết ngay tin được bao nhiêu phần
- ✅ Mỗi role **chưa có account** = 1 `AMB-<MODULE>-XX` 🔴 riêng, nội dung: *"Xin account role X để kiểm chứng N ô đang suy diễn"*
