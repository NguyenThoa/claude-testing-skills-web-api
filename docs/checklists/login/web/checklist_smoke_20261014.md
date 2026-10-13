## Đăng nhập / Xác thực — Checklist Smoke (11 mục · ~12 phút)

**Nguồn:** TC-based (`docs/testcases/login/web/test_cases_login_web.md`)
**Scope:** Module `login` · Web (Chrome, viewport desktop) · luồng trang đăng nhập → đăng nhập → bảo vệ phiên → quên mật khẩu → đăng xuất · role Admin, Project Manager
**Mã checklist:** `CL-smoke_20261014` — mã mục khi chạy = `CL-smoke_20261014-<số mục 2 chữ số>`
**Trạng thái lấy từ:** 11/11 mục đã có kết quả — lần chạy bộ TC `run_1787215085` (chưa có lần chạy nào của chính checklist này)

> Tài khoản lấy trong `.env`: `ADMIN_EMAIL` / `ADMIN_PASSWORD`, `PM_EMAIL` / `PM_PASSWORD`. Môi trường dùng chung — checklist này chỉ đọc, không tạo dữ liệu.

### Nhóm: Trang đăng nhập

| # | Trạng thái | Hạng mục kiểm tra | Kết quả kỳ vọng | Priority | REQ ID | TC ID liên quan | Execution ID |
|---|---|---|---|---|---|---|---|
| 1 | ✅ PASS | Mở `https://crm.anhtester.com/admin/authentication` trong cửa sổ ẩn danh | Tab trình duyệt ghi `Perfex CRM \| Anh Tester Demo - Login`, khối biểu mẫu có tiêu đề `Login` | P1 | REQ-LOGIN-01 | CRM_LOGIN_TC_001 | [run_1787215085](../../../executions/login/web/run_1787215085/execution_report.md)<br><sub>20-08-2026</sub> |
| 2 | ✅ PASS | Quan sát biểu mẫu vừa nạp, chưa bấm gì | Đủ ô `Email Address`, `Password`, ô tích `Remember me` (rỗng), nút `Login`, liên kết `Forgot Password?`; con trỏ nằm sẵn trong ô Email | P1 | REQ-LOGIN-02, REQ-LOGIN-03 | CRM_LOGIN_TC_002 | [run_1787215085](../../../executions/login/web/run_1787215085/execution_report.md)<br><sub>20-08-2026</sub> |

### Nhóm: Đăng nhập

| # | Trạng thái | Hạng mục kiểm tra | Kết quả kỳ vọng | Priority | REQ ID | TC ID liên quan | Execution ID |
|---|---|---|---|---|---|---|---|
| 3 | ✅ PASS | Đăng nhập bằng tài khoản Admin hợp lệ | Dừng ở `/admin/`, tab ghi `Dashboard`, thấy menu trái và ảnh đại diện góc trên phải | P1 | REQ-LOGIN-06 | CRM_LOGIN_TC_005 | [run_1787215085](../../../executions/login/web/run_1787215085/execution_report.md)<br><sub>20-08-2026</sub> |
| 4 | ✅ PASS | Đăng xuất, đăng nhập bằng tài khoản Project Manager | Vào `/admin/`; menu trái **không** có `Subscriptions`, `Expenses`, `Estimate Request`, `Knowledge Base`, `Reports` | P1 | REQ-LOGIN-06 | CRM_LOGIN_TC_006 | [run_1787215085](../../../executions/login/web/run_1787215085/execution_report.md)<br><sub>20-08-2026</sub> |
| 5 | ✅ PASS | Để trống cả hai ô, bấm `Login` | Vẫn ở trang đăng nhập; 2 dải đỏ: `The Password field is required.` và `The Email Address field is required.` | P1 | REQ-LOGIN-10, REQ-LOGIN-11 | CRM_LOGIN_TC_011 | [run_1787215085](../../../executions/login/web/run_1787215085/execution_report.md)<br><sub>20-08-2026</sub> |
| 6 | ✅ PASS | Đăng nhập `admin@example.com` với mật khẩu sai `Wrong@123` | Không vào Dashboard; đúng 1 dải đỏ `Invalid email or password` | P1 | REQ-LOGIN-14 | CRM_LOGIN_TC_013 | [run_1787215085](../../../executions/login/web/run_1787215085/execution_report.md)<br><sub>20-08-2026</sub> |

### Nhóm: Bảo vệ phiên

| # | Trạng thái | Hạng mục kiểm tra | Kết quả kỳ vọng | Priority | REQ ID | TC ID liên quan | Execution ID |
|---|---|---|---|---|---|---|---|
| 7 | ✅ PASS | Chưa đăng nhập, gõ thẳng `https://crm.anhtester.com/admin/clients` | Bị đưa về `/admin/authentication`, không thoáng thấy dữ liệu khách hàng nào | P1 | REQ-LOGIN-17 | CRM_LOGIN_TC_021 | [run_1787215085](../../../executions/login/web/run_1787215085/execution_report.md)<br><sub>20-08-2026</sub> |

### Nhóm: Quên mật khẩu

| # | Trạng thái | Hạng mục kiểm tra | Kết quả kỳ vọng | Priority | REQ ID | TC ID liên quan | Execution ID |
|---|---|---|---|---|---|---|---|
| 8 | ✅ PASS | Bấm liên kết `Forgot Password?` dưới nút Login | Mở `/admin/authentication/forgot_password`, tiêu đề `Forgot Password`, 1 ô `Email Address`, nút `Confirm` | P2 | REQ-LOGIN-23 | CRM_LOGIN_TC_027 | [run_1787215085](../../../executions/login/web/run_1787215085/execution_report.md)<br><sub>20-08-2026</sub> |

### Nhóm: Đăng xuất

| # | Trạng thái | Hạng mục kiểm tra | Kết quả kỳ vọng | Priority | REQ ID | TC ID liên quan | Execution ID |
|---|---|---|---|---|---|---|---|
| 9 | ✅ PASS | Đăng nhập Admin, bấm ảnh đại diện góc trên phải | Menu xổ xuống: `My Profile` · `My Timesheets` · `Edit Profile` · `Language` · `Logout` (mục cuối) | P1 | REQ-LOGIN-29 | CRM_LOGIN_TC_032 | [run_1787215085](../../../executions/login/web/run_1787215085/execution_report.md)<br><sub>20-08-2026</sub> |
| 10 | ✅ PASS | Bấm `Logout` khi không có bộ đếm giờ nào chạy | Không có hộp thoại xác nhận; về thẳng `/admin/authentication` với biểu mẫu rỗng | P1 | REQ-LOGIN-31 | CRM_LOGIN_TC_035 | [run_1787215085](../../../executions/login/web/run_1787215085/execution_report.md)<br><sub>20-08-2026</sub> |
| 11 | ✅ PASS | Sau khi đăng xuất, gõ `/admin/clients` rồi bấm Back | Cả hai lần đều về `/admin/authentication`, không hiện lại dữ liệu đã tải trước đó | P1 | REQ-LOGIN-32, REQ-LOGIN-33 | CRM_LOGIN_TC_036 | [run_1787215085](../../../executions/login/web/run_1787215085/execution_report.md)<br><sub>20-08-2026</sub> |

### Không áp dụng cho module này
- **Data Table/List** — trang đăng nhập không có bảng dữ liệu
- **CRUD Lifecycle** — module không tạo/sửa/xoá bản ghi nghiệp vụ
- **Status Flow** — chỉ có 2 trạng thái (có phiên / không phiên), đã phủ bằng mục 7 và 11
- **Notification** — đăng nhập/đăng xuất thành công không hiện thông báo nổi; lỗi hiện bằng dải đỏ đã phủ ở mục 5, 6
- **Modal/Dialog** — hộp thoại xác nhận chỉ bật khi đang có bộ đếm giờ (`CRM_LOGIN_TC_034`), thuộc Vòng 2 — cắt khỏi Smoke

### Phần đã cắt khỏi Smoke (chạy ở bộ TC chi tiết)
- Ghi nhớ đăng nhập / cookie `Remember me` (`TC_008`, `TC_009`, `TC_037`) — cần xoá cookie và DevTools, quá 2 phút
- Định dạng email, giá trị biên, chuỗi tấn công (`TC_012`, `TC_017`, `TC_045`→`TC_048`) — Vòng 2
- CSRF, HTTPS, hết hạn phiên 1 giờ (`TC_024`, `TC_025`, `TC_039`, `TC_026`, `TC_051`) — Vòng 3, cần DevTools hoặc chờ > 60 phút
- Bàn phím, responsive, đa trình duyệt (`TC_038`, `TC_049`, `TC_050`) — Vòng 4

### Ký nhận

| Môi trường | Build / Version | Người thực hiện | Ngày | Kết quả (Pass/Fail/Blocked) |
|---|---|---|---|---|
|  |  |  |  |  |
