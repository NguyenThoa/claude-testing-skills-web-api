# Xu hướng lỗi & vấn đề lặp lại — Perfex CRM · Book (`_book-api`)

| Mục | Giá trị |
|---|---|
| Ngày lập | 26-10-2026 |
| Phạm vi | Mọi hệ thống trong `docs/`: Perfex CRM (`login`, `customers` · web) và Book (`_book-api`: `auth`, `book`, `user` · web / mobile / api) |
| Nguồn dữ liệu | 10 bug (9 lỗi thật + 1 ⚪ không phải lỗi) · 5 lần chạy bộ TC · 741 TC — `python scripts/quality-insights/qi.py trends` |
| Giới hạn dữ liệu | Số bug khớp danh mục `docs/bugs/README.md` (6) + `docs/bugs/_book-api/README.md` (4). **Book chưa có lần chạy bộ TC nào** trong `docs/executions/`: 4 lỗi Book sinh từ lượt khảo sát requirements mobile, không từ lượt thực thi, nên mục E/G chỉ có dữ liệu Perfex CRM. Cả hai hệ thống đều **dưới ngưỡng cỡ mẫu**: báo cáo này nêu *quan sát*, không nêu xu hướng tăng/giảm |
| Người lập | Anh Tester (agent hỗ trợ: Claude Code) |

## 1. Kết luận chính

1. **Vấn đề lặp lại lớn nhất: trên Android, app Book không gửi được dữ liệu.** Cùng một kiểu hỏng xuất hiện ở **3 module**: lưu hồ sơ (`auth`), cập nhật user (`user`), tạo sách (`book`). 3/3 file bug ghi *web làm được với cùng thao tác*, 2/3 hiện cùng một thông báo `Error in processing request`. Đây là **3 lỗi thật, trong đó 2 Critical, nhiều khả năng chung một nguyên nhân**: [BUG_auth_1792454704_REQ122](../bugs/_book-api/auth/mobile/BUG_auth_1792454704_REQ122.md) · [BUG_user_1792454701_TC152](../bugs/_book-api/user/mobile/BUG_user_1792454701_TC152.md) · [BUG_book_1792454702_TC143](../bugs/_book-api/book/mobile/BUG_book_1792454702_TC143.md). Nguyên nhân gốc **cần Dev xác minh**.
2. **Điểm nóng Perfex CRM: `login` · web.** 5 lỗi mở (điểm 8,5), tuổi trung bình **71 ngày**, **4 TC fail liên tục** qua các lần chạy. Lỗi Critical HTTPS ([BUG_login_1785678750_TC039](../bugs/login/web/BUG_login_1785678750_TC039.md)) đã mở **85 ngày** và từng retest `NOT_FIXED` 1 lần. Không có lỗi `login` nào được đóng nhờ sửa.
3. **Form đăng nhập quản lý giá trị ô sai ở 2 màn hình** (`STATE`). Trang đăng nhập **mất** email cần giữ ([TC016](../bugs/login/web/BUG_login_1787226514_TC016.md)), trang Quên mật khẩu **giữ** email cần xoá ([TC029](../bugs/login/web/BUG_login_1787226517_TC029.md)). Cùng một loại lỗi, nên sửa cùng lượt.
4. **3 TC `customers` fail mà chưa có bug, nhưng không phải lỗi rò rỉ.** Đọc chi tiết FAIL của [run_1791926209](../executions/customers/web/run_1791926209/execution_report.md) thì cả 3 đều là **TC sai giả định hoặc mô tả giao diện chưa có evidence** (`TEST-ISSUE`), chức năng chạy đúng. Việc cần làm là sửa TC, không phải báo bug.
5. **Lỗi theo tháng không đọc thành xu hướng được:** tháng 08 là lúc test Perfex CRM, tháng 09–10 là lúc test Book. "Tháng 08 có 5 lỗi, tháng 10 có 2" **không** có nghĩa chất lượng đang tốt lên.

## 2. Nhóm nguyên nhân gốc

> Mỗi lỗi một loại chính (bảng 1.2 của `skills-quality-insights`). Căn cứ trích từ file bug. Loại có `(?)` là chưa chắc, kèm câu hỏi cho Dev ở mục 4.

| Loại | Số lỗi | Mã bug | Căn cứ (trích file bug) |
|---|---|---|---|
| `PLATFORM` | 3 | `BUG_auth_1792454704_REQ122` · `BUG_user_1792454701_TC152` · `BUG_book_1792454702_TC143` | *"Web cập nhật được với cùng thao tác"* · *"Web lưu được với cùng thao tác"* · *"Web tạo được sách với cùng dữ liệu"*. Ô *Nền tảng* của từng file |
| `ERROR-HANDLING` | 1 | `BUG_book_1792454703_TC187` | *"Thông báo nổi chỉ có biểu tượng `!` đỏ … không có chữ"*. Vế *không lưu được* **chưa tách** được nguyên nhân (file bug tự ghi) |
| `STATE` | 2 | `BUG_login_1787226514_TC016` · `BUG_login_1787226517_TC029` | *"Controller … không truyền lại `email` đã nhập"* · *"biểu mẫu Quên mật khẩu submit qua AJAX"*, ô không reset |
| `VALIDATION` | 1 | `BUG_login_1787226516_TC028` | *"thiếu bước validate 'trường bắt buộc' trước khi … tra cứu email trong DB"* |
| `SECURITY-CONFIG` | 1 | `BUG_login_1785678750_TC039` | *"đang lắng nghe cả cổng 80 và 443 … thiếu rule redirect vĩnh viễn"* |
| `REQ-GAP` (?) | 1 | `BUG_login_1787226513_TC004` | File bug tự đề xuất *"xác nhận lại với PO"*: route `/` không có trang chủ công khai *"có thể là quyết định thiết kế có chủ đích"* |
| `REQ-GAP` | 1 (⚪) | `BUG_login_1787226515_TC018` | Đã đóng *không phải lỗi* ngày 19-09-2026 |

### 2.1 Vấn đề lặp lại (qua ngưỡng 1.3)

| # | Vấn đề | Lỗi | Vì sao gọi là lặp lại |
|---|---|---|---|
| R1 | **App Book trên Android không gửi được dữ liệu lên server**: lưu, cập nhật, tạo mới đều thất bại, thông báo lỗi chung chung hoặc rỗng | 3 `PLATFORM` + 1 `ERROR-HANDLING` liên quan (`TC187` cũng là thao tác lưu trên Android) | 3 module · cùng dấu hiệu nguyên văn `Error in processing request` (2 lỗi) · cả 3 file bug tự ghi *"Quan sát chung của cụm lỗi: trên Android mọi thao tác gửi dữ liệu đã thử đều lỗi"* |
| R2 | **Form `login` xử lý giá trị ô sau khi gửi không nhất quán** | 2 `STATE` | 2 màn hình (đăng nhập, Quên mật khẩu) · cùng module |

### 2.2 Điểm nóng

| Đơn vị | Vì sao |
|---|---|
| `login` · web | Điểm mở cao nhất (8,5) · 1 Critical · 4 TC 🔁 fail liên tục · lỗi già nhất (85 ngày) |
| `_book-api/book` · mobile | Điểm mở 6 · 1 Critical · nằm trong vấn đề R1 |

### 2.3 TC fail chưa có bug: đã phân loại

| TC | Phân loại | Căn cứ (mục *Chi tiết TC FAIL* của run_1791926209) |
|---|---|---|
| `CRM_CUST_TC_022` | `TEST-ISSUE`: **TC sai giả định dữ liệu** | 4 khách hàng có sẵn trên môi trường dùng chung mang đúng chuỗi `' OR 1=1--` ở ô VAT. Ô tìm kiếm khớp theo nghĩa đen, chỉ ra 4/2.782 dòng, **không** trả toàn bộ bảng |
| `CRM_CUST_TC_027` | `TEST-ISSUE`: **mô tả giao diện chưa có evidence** (`@NeedsVerify`) | *"Chức năng lọc chạy đúng; 3 điểm lệch là mô tả giao diện"* |
| `CRM_CUST_TC_006` | `TEST-ISSUE` (?): có thể là lỗi giao diện mức Low | Dòng đầu danh sách `Currency` trống chữ, nhãn `System Default` chỉ hiện khi đóng ô. Report gợi ý review TC trước, PO coi là lỗi thì báo bug Low |

TC chuyển sang BLOCKED (`CRM_LOGIN_TC_014`, `CRM_LOGIN_TC_050`) là do **thiếu tiền đề**: chưa có tài khoản test riêng trong `.env`, và Playwright MCP chỉ mở Chrome. Không do hệ thống xuống cấp.

## 3. Số liệu (nguyên văn `qi.py trends`)

> ⚠️ **Cỡ mẫu**
>
> - `_book-api`: 4 lỗi thật trên 2 tháng — dưới ngưỡng (5 lỗi · 3 tháng), chỉ gọi là quan sát, không gọi là xu hướng tăng/giảm
> - hệ thống mặc định: 5 lỗi thật trên 1 tháng — dưới ngưỡng (5 lỗi · 3 tháng), chỉ gọi là quan sát, không gọi là xu hướng tăng/giảm

### A. Lỗi theo module × nền tảng

| Đơn vị | Tổng lỗi thật | 🔴 Crit | 🟠 Major | 🟡 Minor | 🟢 Triv | Đang mở | Điểm mở (trọng số) | Tuổi TB lỗi mở (ngày) | Retest NOT_FIXED / số lần retest | ⚪ Không phải lỗi |
|---|---|---|---|---|---|---|---|---|---|---|
| `login` · web | 5 | 1 | 0 | 3 | 1 | 5 | 8.5 | 71 | 1 / 1 | 1 |
| `_book-api/book` · mobile | 2 | 1 | 0 | 1 | 0 | 2 | 6 | 18 | 0 / 0 | 0 |
| `_book-api/user` · mobile | 1 | 1 | 0 | 0 | 0 | 1 | 5 | 6 | 0 / 0 | 0 |
| `_book-api/auth` · mobile | 1 | 0 | 1 | 0 | 0 | 1 | 3 | 30 | 0 / 0 | 0 |

> Điểm mở = Σ trọng số severity của lỗi chưa đóng (Critical 5 · Major 3 · Minor 1 · Trivial 0,5).

### B. Lỗi phát hiện theo tháng — tách từng hệ thống

| Hệ thống | Tháng | Critical | Major | Minor | Trivial | Tổng |
|---|---|---|---|---|---|---|
| `_book-api` | 09-2026 | 1 | 1 | 0 | 0 | 2 |
| `_book-api` | 10-2026 | 1 | 0 | 1 | 0 | 2 |
| mặc định | 08-2026 | 1 | 0 | 3 | 1 | 5 |

### C. Danh sách lỗi (nguyên liệu để gom nhóm nguyên nhân gốc)

| Mã bug | Đơn vị | Severity | Trạng thái | Tuổi (ngày) | REQ | Tiêu đề | Gợi ý nguyên nhân (trích file bug) |
|---|---|---|---|---|---|---|---|
| [BUG_book_1792454702_TC143](../bugs/_book-api/book/mobile/BUG_book_1792454702_TC143.md) | `_book-api/book` · mobile | 🔴 Critical | 🔴 Đang mở | 30 | REQ-BK-BOOK-147 (+2) | BOOK · Android — Create book chỉ hiện thông báo đang tải rồi mất, không tạo được sách | — |
| [BUG_login_1785678750_TC039](../bugs/login/web/BUG_login_1785678750_TC039.md) | `login` · web | 🔴 Critical | 🔴 Đang mở | 85 | REQ-LOGIN-44 | Login — Trang đăng nhập phục vụ được qua HTTP thuần, không ép chuyển hướng sang HTTPS và k | Web server (Nginx/Apache) đang lắng nghe cả cổng 80 và 443 và trả cùng một document root, thiếu rule redirect vĩnh viễn  |
| [BUG_user_1792454701_TC152](../bugs/_book-api/user/mobile/BUG_user_1792454701_TC152.md) | `_book-api/user` · mobile | 🔴 Critical | 🔴 Đang mở | 6 | REQ-BK-USER-129 (+1) | USER · Android — Update user báo `Error in processing request`, thay đổi không được lưu | — |
| [BUG_auth_1792454704_REQ122](../bugs/_book-api/auth/mobile/BUG_auth_1792454704_REQ122.md) | `_book-api/auth` · mobile | 🟠 Major | 🔴 Đang mở | 30 | REQ-BK-AUTH-122 (+1) | AUTH · Android — Save Profile báo `Error in processing request`, hồ sơ không được cập nhật | — |
| [BUG_book_1792454703_TC187](../bugs/_book-api/book/mobile/BUG_book_1792454703_TC187.md) | `_book-api/book` · mobile | 🟡 Minor | 🔴 Đang mở | 6 | REQ-BK-BOOK-155 (+1) | BOOK · Android — Save changes thất bại hiện thông báo lỗi rỗng (chỉ biểu tượng `!`), không | — |
| [BUG_login_1787226513_TC004](../bugs/login/web/BUG_login_1787226513_TC004.md) | `login` · web | 🟡 Minor | 🔴 Đang mở | 67 | REQ-LOGIN-04 | Login — Bấm logo trên trang đăng nhập không dẫn về trang chủ công khai (URL gốc luôn redir | Route `/` chưa được cấu hình trả về một trang landing công khai riêng — có thể là quyết định thiết kế có chủ đích (hệ th |
| [BUG_login_1787226514_TC016](../bugs/login/web/BUG_login_1787226514_TC016.md) | `login` · web | 🟡 Minor | 🔴 Đang mở | 67 | REQ-LOGIN-16 | Login — Ô Email không giữ lại giá trị vừa nhập sau khi đăng nhập thất bại | Controller xử lý POST đăng nhập thất bại không truyền lại `email` đã nhập vào biến của view khi render lại form (thiếu ` |
| [BUG_login_1787226516_TC028](../bugs/login/web/BUG_login_1787226516_TC028.md) | `login` · web | 🟡 Minor | 🔴 Đang mở | 67 | REQ-LOGIN-25 | Login — Bỏ trống email ở trang Quên mật khẩu báo sai bản chất lỗi (`Email not found` thay  | Form Quên mật khẩu thiếu bước validate "trường bắt buộc" trước khi chạy thẳng vào bước tra cứu email trong DB — trường r |
| [BUG_login_1787226515_TC018](../bugs/login/web/BUG_login_1787226515_TC018.md) | `login` · web | 🟢 Trivial | ⚪ Không phải lỗi | — | REQ-LOGIN-14 | Login — Email quá dài (260 ký tự) trả thông báo lỗi khác với thông báo sai thông tin đăng  | Validate `valid_email` server-side chạy **trước** bước so khớp thông tin đăng nhập, và trả về message riêng thay vì gộp  |
| [BUG_login_1787226517_TC029](../bugs/login/web/BUG_login_1787226517_TC029.md) | `login` · web | 🟢 Trivial | 🔴 Đang mở | 67 | REQ-LOGIN-26 | Login — Ô Email ở trang Quên mật khẩu không tự reset sau khi submit email không tồn tại | Khác với biểu mẫu đăng nhập chính (submit bằng full-page reload), biểu mẫu Quên mật khẩu submit qua **AJAX** — quan sát  |

### D. Cụm lỗi cùng REQ

- Không có REQ nào mang ≥ 2 lỗi

### E. Xu hướng từng TC qua các lần chạy

| Nhóm | Đơn vị | TC | Chuỗi kết quả (cũ → mới) | Bug trỏ tới |
|---|---|---|---|---|
| 🔁 Fail liên tục | `login` · web | `CRM_LOGIN_TC_004` | FAIL → FAIL | BUG_login_1787226513_TC004 |
| 🔁 Fail liên tục | `login` · web | `CRM_LOGIN_TC_016` | FAIL → FAIL | BUG_login_1787226514_TC016 |
| 🔁 Fail liên tục | `login` · web | `CRM_LOGIN_TC_028` | FAIL → FAIL | BUG_login_1787226516_TC028 |
| 🔁 Fail liên tục | `login` · web | `CRM_LOGIN_TC_039` | FAIL → FAIL | BUG_login_1785678750_TC039 |
| ❌ Fail (1 lần chạy) | `customers` · web | `CRM_CUST_TC_006` | FAIL | **chưa có** |
| ❌ Fail (1 lần chạy) | `customers` · web | `CRM_CUST_TC_022` | FAIL | **chưa có** |
| ❌ Fail (1 lần chạy) | `customers` · web | `CRM_CUST_TC_027` | FAIL | **chưa có** |
| ❌ Fail (1 lần chạy) | `login` · web | `CRM_LOGIN_TC_029` | FAIL | BUG_login_1787226517_TC029 |
| ✅ Vừa hết fail | `login` · web | `CRM_LOGIN_TC_018` | FAIL → PASS | BUG_login_1787226515_TC018 |
| ⚠️ Chuyển sang BLOCKED | `login` · web | `CRM_LOGIN_TC_014` | BLOCKED → PASS → BLOCKED | **chưa có** |
| ⚠️ Chuyển sang BLOCKED | `login` · web | `CRM_LOGIN_TC_050` | PASS → BLOCKED | **chưa có** |

### F. Lỗ hổng quy trình

**TC đang fail mà chưa có bug** (lỗi đang rò rỉ khỏi sổ):

- `CRM_CUST_TC_006` (`customers` · web) — ❌ Fail (1 lần chạy)
- `CRM_CUST_TC_022` (`customers` · web) — ❌ Fail (1 lần chạy)
- `CRM_CUST_TC_027` (`customers` · web) — ❌ Fail (1 lần chạy)

**Bug còn mở nhưng mọi TC liên quan đã PASS ở lần chạy gần nhất** (ứng viên `/retest-fixed-bugs`):

- Không có

### G. Tỉ lệ đạt theo lần chạy

| Đơn vị | Run | Ngày | Loại | Số TC | PASS | FAIL | BLOCKED | SKIPPED | Pass rate* |
|---|---|---|---|---|---|---|---|---|---|
| `login` · web | [run_1787215085](../executions/login/web/run_1787215085/execution_report.md) | 20-08-2026 | tc | 41 | 32 | 6 | 2 | 1 | 80.0% |
| `login` · web | [run_1789759574](../executions/login/web/run_1789759574/execution_report.md) | 19-09-2026 | tc | 13 | 13 | 0 | 0 | 0 | 100.0% |
| `login` · web | [run_1791925499](../executions/login/web/run_1791925499/execution_report.md) | 14-10-2026 | tc | 19 | 14 | 3 | 2 | 0 | 73.7% |
| `customers` · web | [run_1791926209](../executions/customers/web/run_1791926209/execution_report.md) | 14-10-2026 | tc | 30 | 27 | 3 | 0 | 0 | 90.0% |
| `login` · web | [run_1793011272](../executions/login/web/run_1793011272/execution_report.md) | 26-10-2026 | tc | 5 | 4 | 1 | 0 | 0 | 80.0% |

> \* Pass rate không tính SKIPPED. Các lần chạy thường có **phạm vi khác nhau** (cột *Số TC*) — không đọc cột này như một đường xu hướng; xu hướng thật nằm ở mục E (cùng TC qua các lần).

## 4. Đề xuất hành động

| # | Việc | Đối tượng | Command | Ưu tiên |
|---|---|---|---|---|
| 1 | Gửi Dev **3 lỗi R1 như một sự cố chung**, nhờ xác minh có cùng nguyên nhân không. Sau khi sửa, retest **cả 3 trong một lượt** kèm regression các thao tác gửi dữ liệu khác trên Android | `BUG_auth_…REQ122` · `BUG_user_…TC152` · `BUG_book_…TC143` (+ `TC187`) | `/retest-fixed-bugs` mode FULL | Cao |
| 2 | Chốt thời hạn sửa cho lỗi Critical đã mở 85 ngày (Master Test Plan mục 9.4 vẫn để `❓`) | `BUG_login_1785678750_TC039` | `/generate-master-test-plan` (cập nhật mục 9.4) | Cao |
| 3 | Gửi Dev R2 thành một việc: rà cách form `login` giữ hoặc xoá giá trị ô sau khi gửi | `BUG_login_…TC016` · `BUG_login_…TC029` | (Dev) · sau đó `/retest-fixed-bugs` | Trung bình |
| 4 | PO xác nhận `REQ-LOGIN-04`: logo về trang chủ công khai hay về cổng khách hàng. Cố ý thì sửa REQ và TC, đóng bug | `BUG_login_1787226513_TC004` | `/update-requirements-from-ticket` | Trung bình |
| 5 | Sửa 3 TC `customers` theo phân loại ở 2.3 | `CRM_CUST_TC_006` · `022` · `027` | `/review-testcases` mode FIX | Trung bình |
| 6 | Gỡ chặn 2 TC BLOCKED: khai `TC014_EMAIL`/`TC014_PASSWORD` vào `.env`, chạy tay trên Edge + Firefox | `CRM_LOGIN_TC_014` · `CRM_LOGIN_TC_050` | `/execute-test-cases` | Thấp |
| 7 | Bắt đầu chạy bộ TC của Book và ghi vào `docs/executions/`. Không có lần chạy thì lần phân tích sau vẫn không có xu hướng TC cho Book | `_book-api` · mọi nền tảng | `/execute-test-cases` | Trung bình |

## 5. Phương pháp

- Số liệu: `scripts/quality-insights/qi.py trends`. Thang điểm và trọng số: [`.claude/skills/skills-quality-insights/references/scoring.md`](../../.claude/skills/skills-quality-insights/references/scoring.md)
- Gom nhóm nguyên nhân gốc: agent đọc từng file bug (*Actual Result*, *Nghi ngờ root cause*, ô *Nền tảng*). Không gán nguyên nhân nào không có trong file bug
- Báo cáo **không** nói: lỗi đang tăng hay giảm (dưới ngưỡng cỡ mẫu); nguyên nhân kỹ thuật của R1 (cần Dev xác minh); chất lượng Book trên web/api (chưa có lần chạy)
- Báo cáo **không** sửa file bug, TC hay execution report nào
