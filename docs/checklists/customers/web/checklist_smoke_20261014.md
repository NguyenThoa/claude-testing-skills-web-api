## Khách hàng — Checklist Smoke (17 mục · ~15 phút)

**Nguồn:** TC-based (`docs/testcases/customers/web/parts/part_01_web_smoke.md` + nhánh CRUD / phân quyền ở `part_04`, `part_05`)
**Scope:** Module `customers` · Web (Chrome, viewport desktop) · luồng danh sách → tạo → hồ sơ → sửa → bật/tắt hoạt động → xoá → màn hình nhập · role Admin, Project Manager
**Mã checklist:** `CL-smoke_20261014` — mã mục khi chạy = `CL-smoke_20261014-<số mục 2 chữ số>`
**Trạng thái lấy từ:** Chưa có lần chạy nào — module `customers` chưa có execution report

> Tài khoản lấy trong `.env`: `ADMIN_EMAIL` / `ADMIN_PASSWORD`, `PM_EMAIL` / `PM_PASSWORD`. Đăng nhập Admin trước mục 1.
> ⚠️ Môi trường dùng chung — chạy **theo thứ tự**: mục 5 tạo khách hàng test `KH-SMOKE`, các mục 6 → 14 dùng lại, mục 14 xoá nó. Khách hàng của mục 7, 8 phải xoá tay sau khi chạy (cách xoá như mục 13–14).
> `{ts}` = ngày giờ lúc chạy dạng `YYYYMMDDHHmm` (VD `202610141530`).

### Nhóm: Danh sách khách hàng

| # | Trạng thái | Hạng mục kiểm tra | Kết quả kỳ vọng | Priority | REQ ID | TC ID liên quan | Execution ID |
|---|---|---|---|---|---|---|---|
| 1 | ☐ | Bấm `Customers` ở menu trái | Mở `/admin/clients`, tab ghi `Customers`; thấy khối `Customers Summary` và bảng có dữ liệu | P1 | REQ-CUST-01 | CRM_CUST_TC_001 | — |
| 2 | ☐ | Quan sát thanh công cụ và khối `Customers Summary` | Có 3 nút `+ New Customer` · `Import Customers` · `Contacts`; số `Total Customers` = `Active Customers` + `Inactive Customers` | P2 | REQ-CUST-02, REQ-CUST-08 | CRM_CUST_TC_002 | — |
| 3 | ☐ | Quan sát tiêu đề cột và chân bảng | Cột `#` · `Company` · `Primary Contact` · `Primary Email` · `Phone` · `Active` · `Groups` · `Date Created`; góc dưới trái `Showing 1 to 25 of … entries` | P2 | REQ-CUST-03, REQ-CUST-06 | CRM_CUST_TC_003 | — |

### Nhóm: Tạo khách hàng

| # | Trạng thái | Hạng mục kiểm tra | Kết quả kỳ vọng | Priority | REQ ID | TC ID liên quan | Execution ID |
|---|---|---|---|---|---|---|---|
| 4 | ☐ | Bấm `+ New Customer` | Mở `/admin/clients/client`, tab ghi `Add new customer`; con trỏ sẵn trong ô `Company`, chỉ `Company` có dấu `*` đỏ | P1 | REQ-CUST-23, REQ-CUST-25, REQ-CUST-26 | CRM_CUST_TC_005, CRM_CUST_TC_008 | — |
| 5 | ☐ | Nhập Company `auto_cl_smoke_{ts}` (`KH-SMOKE`), bấm `Save` | Không báo lỗi; mở `/admin/clients/client/{id}`, tiêu đề dạng `#{id} auto_cl_smoke_…` | P1 | REQ-CUST-25, REQ-CUST-33 | CRM_CUST_TC_009 | — |
| 6 | ☐ | Về danh sách, gõ tên `KH-SMOKE` vào ô `Search..` | Đúng 1 dòng: công tắc `Active` đang bật, `Date Created` là hôm nay; `Total Customers` tăng 1 | P1 | REQ-CUST-11, REQ-CUST-33, REQ-CUST-56 | CRM_CUST_TC_011, CRM_CUST_TC_021 | — |
| 7 | ☐ | Tạo khách hàng `auto_cl_full_{ts}` điền đủ mọi ô hai tab `Customer Details`, `Billing & Shipping` | Mở lại hồ sơ thấy đúng từng giá trị đã nhập; địa chỉ thanh toán và giao hàng không bị tráo | P2 | REQ-CUST-27, REQ-CUST-33, REQ-CUST-50 | CRM_CUST_TC_010 | — |
| 8 | ☐ | Nhập Company `auto_cl_contact_{ts}`, bấm `Save and create contact` | Hồ sơ mở ở tab `Contacts`, hộp thoại `Add new contact` tự bật kèm tên công ty | P2 | REQ-CUST-34 | CRM_CUST_TC_012 | — |

### Nhóm: Hồ sơ & sửa

| # | Trạng thái | Hạng mục kiểm tra | Kết quả kỳ vọng | Priority | REQ ID | TC ID liên quan | Execution ID |
|---|---|---|---|---|---|---|---|
| 9 | ☐ | Ở danh sách, bấm vào tên `KH-SMOKE` | Mở hồ sơ, tab `Profile` tô xanh; biểu mẫu có 3 tab, có `Customer Admins`; chân biểu mẫu chỉ 1 nút `Save` | P2 | REQ-CUST-47, REQ-CUST-49, REQ-CUST-51 | CRM_CUST_TC_013, CRM_CUST_TC_014 | — |
| 10 | ☐ | Sửa `KH-SMOKE`: nhập Phone `0911111001`, bấm `Save` | Ở lại hồ sơ, ô Phone hiện `0911111001`, Company giữ nguyên; cột `Phone` ở danh sách đổi theo | P1 | REQ-CUST-50, REQ-CUST-51 | CRM_CUST_TC_067 | — |

### Nhóm: Trạng thái hoạt động

| # | Trạng thái | Hạng mục kiểm tra | Kết quả kỳ vọng | Priority | REQ ID | TC ID liên quan | Execution ID |
|---|---|---|---|---|---|---|---|
| 11 | ☐ | Gạt công tắc `Active` của `KH-SMOKE` sang tắt, nhấn F5 | Công tắc vẫn xám sau khi nạp lại; `Inactive Customers` tăng 1, `Active Customers` giảm 1 | P1 | REQ-CUST-57, REQ-CUST-58 | CRM_CUST_TC_074 | — |
| 12 | ☐ | Gạt công tắc của `KH-SMOKE` bật lại, nhấn F5 | Công tắc xanh giữ nguyên; hai số Summary về như trước mục 11 | P1 | REQ-CUST-56, REQ-CUST-58 | CRM_CUST_TC_074 | — |

### Nhóm: Xoá khách hàng

| # | Trạng thái | Hạng mục kiểm tra | Kết quả kỳ vọng | Priority | REQ ID | TC ID liên quan | Execution ID |
|---|---|---|---|---|---|---|---|
| 13 | ☐ | Rê chuột dòng `KH-SMOKE`, bấm `Delete`, chọn `Cancel` | Hộp thoại hỏi `Are you sure you want to perform this action?`; sau Cancel dòng `KH-SMOKE` vẫn còn | P1 | REQ-CUST-60 | CRM_CUST_TC_076 | — |
| 14 | ☐ | Bấm `Delete` lại trên dòng `KH-SMOKE`, chọn `OK` | Thông báo nền xanh `Customer deleted`; tìm lại tên ra `No matching records found` | P1 | REQ-CUST-61 | CRM_CUST_TC_077 | — |

### Nhóm: Nhập khách hàng

| # | Trạng thái | Hạng mục kiểm tra | Kết quả kỳ vọng | Priority | REQ ID | TC ID liên quan | Execution ID |
|---|---|---|---|---|---|---|---|
| 15 | ☐ | Bấm `Import Customers` (không chọn tệp, không bấm Import) | Mở `/admin/clients/import`: 4 mục hướng dẫn, mục 4 chữ đỏ `Duplicate email rows won't be imported.`; có nút `Download Sample`, `Choose File` | P2 | REQ-CUST-72, REQ-CUST-73, REQ-CUST-75, REQ-CUST-77 | CRM_CUST_TC_015, CRM_CUST_TC_016 | — |

### Nhóm: Phân quyền

| # | Trạng thái | Hạng mục kiểm tra | Kết quả kỳ vọng | Priority | REQ ID | TC ID liên quan | Execution ID |
|---|---|---|---|---|---|---|---|
| 16 | ☐ | Cửa sổ ẩn danh, chưa đăng nhập, gõ thẳng `https://crm.anhtester.com/admin/clients` | Bị đưa về `/admin/authentication`, không thoáng thấy tên khách hàng hay bảng nào | P1 | REQ-CUST-01 | CRM_CUST_TC_113 | — |
| 17 | ☐ | Đăng nhập Project Manager, mở `Customers` | Thấy đủ 3 nút như Admin; `Total Customers` bằng số Admin thấy (PM thấy toàn bộ khách hàng) | P1 | REQ-CUST-01, REQ-CUST-08 | CRM_CUST_TC_115 | — |

### Không áp dụng cho module này
- **Modal/Dialog** — hộp thoại `Bulk Actions`, `Create Filter`, `Assign Admin` thuộc Vòng 2, cắt khỏi Smoke (hộp thoại `Add new contact` đã phủ ở mục 8, hộp xác nhận xoá ở mục 13)

### Phần đã cắt khỏi Smoke (chạy ở bộ TC chi tiết)
- Bỏ trống Company, độ dài biên, ký tự đặc biệt, mã tiêm (`TC_039`→`TC_047`) — Vòng 2 Validation
- Sắp xếp, phân trang, bộ lọc, Export, Bulk Actions (`TC_017`→`TC_038`) — Vòng 2 Data Table
- Nhập CSV thật, Simulate Import (`TC_102`→`TC_106`) — tạo nhiều bản ghi trên môi trường dùng chung
- Các tab con của hồ sơ: Notes, Statement, Vault, Map, Reminders (`TC_082`→`TC_099`)
- Phân quyền chi tiết của PM (15 tab, Vault ẩn, xoá, nhập) (`TC_116`→`TC_121`) và tài khoản cổng khách hàng (`TC_114`)
- Responsive, bàn phím, đa trình duyệt, hiệu năng (`TC_125`→`TC_128`) — Vòng 4

### Ký nhận

| Môi trường | Build / Version | Người thực hiện | Ngày | Kết quả (Pass/Fail/Blocked) |
|---|---|---|---|---|
|  |  |  |  |  |
