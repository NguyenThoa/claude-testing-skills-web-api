## Phiếu cấu hình của Master Test Plan

Thông tin **chỉ người mới biết** được gom vào một phiếu YAML, thay cho việc hỏi đáp rời rạc:

```
docs/test-plans/test_plan_<slug>.input.yaml      ← PHIẾU của mốc — user đưa file, hoặc agent hỏi rồi ghi; commit cùng plan
```

> Mỗi mốc một phiếu, nằm cạnh plan: plan đã duyệt luôn còn căn cứ đầu vào, và lần cập nhật sau so được phiếu đổi gì bằng lịch sử git.

### Vì sao YAML, khoá tiếng Việt có dấu, có chú thích

Người điền phiếu là QA Lead / PM / PO — **không** mở workflow này để tra ô nào nghĩa là gì. Vì vậy phiếu tự mang hướng dẫn:

- **Tên ô là tiếng Việt có dấu, có khoảng trắng** (`Đóng băng mã nguồn`, `Người dựng`) — đọc như một biểu mẫu giấy
- **Chú thích `#` cạnh ô** ghi giá trị hợp lệ; **tiêu đề nhóm** ghi `BẮT BUỘC` / `tuỳ chọn` và ai thường nắm thông tin
- Nhóm xếp **theo thứ tự điền**: mốc → kiểm soát tài liệu → phạm vi → lịch → nhân lực → môi trường, dữ liệu, công cụ → cấp độ, loại, phi chức năng, tự động hoá → … → quản lý lỗi → tiêu chí → … → chuẩn tổ chức
- Danh sách rỗng có **phần tử mẫu nằm trong chú thích** — người điền bỏ `#` là có cấu trúc đúng

Chú thích là **khung cố định của phiếu**; chỉ phần sau dấu hai chấm là dữ liệu dự án.

### Cấu trúc và giá trị hợp lệ

Agent dùng bảng này để kiểm phiếu ở Bước 2. Tên ô trong phiếu phải khớp **từng ký tự** với bảng này.

| Nhóm | Ô · giá trị hợp lệ | Nuôi mục |
|---|---|---|
| `Mốc` ⚠️ bắt buộc | `Tên` · `Mã mốc` (chữ thường, không dấu, nối `_`) · `Phiên bản phần mềm` · `Hệ thống` (danh sách; repo một hệ thống → trống) | Kiểm soát tài liệu · tên file · 2.1 |
| `Kiểm soát tài liệu` | `Người lập` (trống = người có vai trò `trưởng nhóm QA` ở `Nhân lực`) · `Người review` — danh sách `{Tên, Vai trò}` · `Mức phân loại` ∈ `công khai` · `nội bộ` · `mật` | Kiểm soát tài liệu |
| `Phạm vi` ⚠️ bắt buộc | `Trong phạm vi` — danh sách `{Module, Nền tảng, Ghi chú}`: `Module` là prefix trong danh mục · `Nền tảng` ⊂ `web` · `api`<br>`Ngoài phạm vi bổ sung` — danh sách `{Nội dung, Lý do, Người chịu trách nhiệm, Người quyết định, Ngày quyết định}` — chỉ phần **chưa** có trong `docs/`<br>`Đưa lại REQ bị loại vì môi trường`: `có` · `không` | 2.1 · 2.2 |
| `Lịch` | `Duyệt kế hoạch` · `Hoàn tất viết TC` · `Môi trường sẵn sàng` · `Bắt đầu thực thi` · `Đóng băng mã nguồn` · `Hồi quy từ` · `Hồi quy đến` · `Nghiệm thu từ` · `Nghiệm thu đến` · `Báo cáo tổng hợp` · `Phát hành`: ngày `DD-MM-YYYY`<br>`Tần suất báo cáo tiến độ` ∈ `hằng ngày` · `hằng tuần` · `hai tuần` · `Ngày gửi báo cáo tiến độ`: chữ tự do | 7.1 · 5 |
| `Nhân lực` | Danh sách `{Tên, Vai trò, Phụ trách, Cần đào tạo}` — `Vai trò` ∈ `trưởng nhóm QA` · `kiểm thử viên` · `tự động hoá` · `khác` · `Phụ trách`: danh sách `Toàn bộ` hoặc `MODULE × nền tảng` | 6 |
| `Cần tuyển thêm người` | `có` (kèm vị trí) · `không` | 6 |
| `Môi trường` | `Tên` · `Dùng chung với đội khác`: `có` · `không` · trống = theo `docs/requirements/README.md` · `Người dựng` · `Trình duyệt` (danh sách) | 5.1 |
| `Dữ liệu kiểm thử` | `Dữ liệu nền` (mô tả) · `Nguồn dữ liệu` — danh sách ⊂ `tự sinh khi chạy` · `nạp sẵn` · `bản sao production đã che` · `nhập tay` · `Có dữ liệu thật của khách hàng`: `có` · `không` · `Cách che dữ liệu` (chỉ khi có dữ liệu thật) · `Dọn dữ liệu sau khi chạy`: `có` · `không` · `Làm mới dữ liệu nền` · `Người cung cấp` | 5.2 |
| `Công cụ` | `Quản lý lỗi` · `Quản lý kết quả kiểm thử` · `Nguồn chính khi lệch` · `Tự động hoá` · `Khác` (danh sách) | 5.3 |
| `Cấp độ kiểm thử` | 5 ô con cố định `Thành phần` · `Tích hợp thành phần` · `Hệ thống` · `Tích hợp hệ thống` · `Chấp nhận`, mỗi ô `{Trong đợt: có · không, Ai thực hiện, Tiêu chí riêng}` — `Tiêu chí riêng` trống = dùng bộ chung | 3.1 |
| `Độc lập kiểm thử` | `Mức độ` ∈ `tác giả tự kiểm thử` · `đồng nghiệp cùng đội` · `đội QA riêng trong tổ chức` · `bên ngoài tổ chức` · `Ghi chú` | 3.4 |
| `Loại kiểm thử` | `Chức năng` · `Hồi quy` · `Kiểm thử lại lỗi` · `Tích hợp liên module` · `Tự động hoá` · `Nghiệm thu (UAT)` · `Hiệu năng` · `Bảo mật chuyên sâu` · `Tương thích` · `Khả năng truy cập` · `Khả dụng` · `Độ tin cậy và phục hồi`: `có` · `không`<br>`Bên thực hiện nghiệm thu`: chữ tự do<br>`Cách chạy API` ∈ `tự động hoá` · `kiểm thử viên tự chạy` · `ngoài phạm vi`<br>`Tỷ trọng thủ công / tự động`: chữ tự do | 3.2 · 3.5 |
| `Phi chức năng` | Danh sách `{Loại, Mục tiêu đo, Ngưỡng chấp nhận, Cách làm, Môi trường, Ai thực hiện}` — `Loại` ∈ `hiệu năng` · `bảo mật` · `tương thích` · `khả năng truy cập` · `khả dụng` · `độ tin cậy và phục hồi`. Chỉ khai loại mà `Loại kiểm thử` ghi `có` | 3.2.1 |
| `Chiến lược tự động hoá` | `Mục tiêu` · `Phạm vi tự động` (danh sách) · `Không tự động` — danh sách `{Nội dung, Lý do}` · `Tầng kiểm thử` (chữ tự do — tỷ trọng unit / API / UI) · `Tiêu chí chọn TC` · `Kích hoạt chạy` — danh sách `{Bộ chạy, Khi nào, Môi trường}`, `Khi nào` ∈ `mỗi commit` · `mỗi merge request` · `hằng đêm` · `mỗi build lên môi trường test` · `trước phát hành` · `chạy tay` · `Hệ thống CI` · `Người bảo trì`. Chỉ khi `Loại kiểm thử` → `Tự động hoá: có` | 3.7 |
| `Mục tiêu` | Danh sách câu mục tiêu; trống → agent đề xuất, đánh dấu chờ duyệt | 1.1 |
| `Ước lượng` | `Kỹ thuật` ∈ `tỷ lệ` · `ngoại suy` · `Wideband Delphi` · `Planning Poker` · `ba điểm` · `không ước lượng`<br>`Tổng công sức (người-ngày)` · `Giả định`<br>`Chi tiết ba điểm` — danh sách `{Hạng mục, Lạc quan, Khả năng nhất, Bi quan}` — chỉ khi `ba điểm`, đơn vị người-ngày | 7.2 |
| `Ngân sách` | `Có ngân sách riêng`: `có` · `không` · `Tổng` · `Đơn vị tiền` · `Hạng mục` — danh sách `{Nội dung, Số tiền}` | 7.3 |
| `Quản lý lỗi` | `Quy trình trạng thái` ∈ `mặc định` · `riêng` · `Quy trình riêng` (mô tả hoặc đường dẫn — chỉ khi `riêng`)<br>`Thang Severity` · `Thang Priority` ∈ `mặc định` · `riêng` · `Thang riêng` — danh sách `{Loại, Mức, Định nghĩa}`, `Loại` ∈ `Severity` · `Priority`<br>`Người phân loại lỗi` · `Họp phân loại lỗi` (tần suất)<br>`Thời hạn xử lý` — danh sách `{Severity, Phản hồi, Sửa xong}` | 9 |
| `Tiêu chí` | `Bộ tiêu chí ra` ∈ `mặc định` · `riêng`<br>`Build tính tiêu chí` (build ứng viên hoặc "từ build X trở đi"; trống = ❓, chốt trước khi chấm)<br>`Tiêu chí ra bổ sung` / `Tiêu chí ra riêng` — danh sách `{Tiêu chí, Ngưỡng}`<br>`Người chấp nhận dừng khi hết thời gian hoặc ngân sách`<br>`Dùng ngưỡng tạm dừng đề xuất`: `có` · `không` · `Ngưỡng tạm dừng riêng` (danh sách) | 4.2 · 4.3 |
| `Bên liên quan` | Danh sách `{Tên, Vai trò, Nhận gì, Tần suất, Kênh}` — `Nhận gì` ⊂ `kế hoạch` · `báo cáo tiến độ` · `báo cáo tổng hợp` · `báo cáo lỗi` | 2.4 |
| `Mẫu tài liệu` | `Dùng mẫu có sẵn của repo`: `có` · `không` · `Mẫu riêng` — danh sách `{Tài liệu, Mẫu}` | 2.4 |
| `Phê duyệt` | Danh sách `{Tên, Vai trò}` | Kiểm soát tài liệu · 11 |
| `Chuẩn tổ chức` | `Mẫu của khách` (đường dẫn file, trống = cấu trúc mặc định) · `Có chính sách kiểm thử (Test Policy)` · `Có chiến lược kiểm thử (Test Strategy)`: `có` · `không` · `Điểm làm khác` — danh sách `{Nội dung, Quy định chung, Đợt này làm, Lý do, Người duyệt}` | 12.2 · định dạng xuất |

**Quy ước giá trị:**

| Người điền ghi | Nghĩa | Plan ghi |
|---|---|---|
| Để trống (hoặc danh sách rỗng) | **Chưa chốt** | `❓` + đưa vào danh sách ô còn treo |
| `không` | **Đã quyết định là không** | Ghi rõ "không" — **không** phải ô treo |
| `có` | Đã quyết định là có | Nội dung tương ứng |

**Quy tắc đọc phiếu** (Bước 2):

- **Chuẩn hoá Unicode NFC** cả khoá lẫn giá trị trước khi so — cùng chữ "ệ" có hai cách mã hoá tuỳ bộ gõ (Unikey, EVKey, bàn phím macOS); không chuẩn hoá thì khoá gõ tay trông giống hệt mà không khớp
- So giá trị chọn-từ-danh-sách **không phân biệt hoa thường** và coi `hằng` ≡ `hàng` (`Hằng tuần` = `hằng tuần` = `hàng tuần`)
- Ngày trong phiếu theo **định dạng Việt Nam `DD-MM-YYYY`** (VD `17-09-2026`) — YAML đọc giá trị này là **chuỗi**, agent tự tách ngày · tháng · năm. Chấp nhận thêm `DD/MM/YYYY`. Ngày có năm đứng đầu (`2026-09-17`) cũng nhận vì không thể nhầm. **KHÔNG** hiểu theo kiểu Mỹ `MM-DD-YYYY`: `05-10-2026` là **ngày 5 tháng 10**. Ngày không tồn tại (`31-09-2026`) hoặc thiếu năm → báo sai kèm số dòng, **không** tự sửa
- Ngày **xuất ra plan** cũng viết `DD-MM-YYYY` như mọi tài liệu khác trong `docs/` (quy tắc chung `CLAUDE.md` mục 6b). Chỉ **tên file** giữ dạng năm đứng đầu
- Tên ô không có trong bảng → báo user (thường là gõ sai tên ô), **không** tự đoán ô định nói

> ⚠️ **Agent ghi phiếu** (Nhánh B hoặc khi cập nhật) sửa **tại chỗ phần sau dấu hai chấm** trên phiếu — **giữ nguyên** mọi chú thích, thứ tự nhóm và tên ô. **Không** dựng lại file bằng thư viện YAML (`yaml.dump` xoá sạch chú thích). Danh sách mới thêm phần tử theo đúng phần tử mẫu trong chú thích. 

> Phiếu được **commit**: lần cập nhật sau chỉ cần sửa phiếu và chạy lại — agent so **dữ liệu** (bỏ qua chú thích) với bản đã commit (`git show HEAD:<phiếu>`) để biết mục nào đổi. Phiếu chưa commit thì hỏi user mục nào đổi. 🔒 Vì thế phiếu **tuyệt đối không** chứa URL có token, mật khẩu, API key.


---
