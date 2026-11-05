# Format v3 — Bảng TC, Cấu Trúc File, Từ Vựng

## 1. Bảng TC — 10 cột

```markdown
| TC ID | REQ ID | Risk Level | Priority | Test Summary | Pre-condition | Action | Test Data | Expected Result | Tags |
|---|---|---|---|---|---|---|---|---|---|
```

Script Xray và các workflow tìm cột **theo tên ở header**, nên phải viết đúng tên, không đổi thứ tự tuỳ ý.

### Risk Level

- **Bắt buộc mỗi dòng:** `High` · `Medium` · `Low`.
- Kế thừa mức rủi ro của chức năng (`test_types_4_rounds.md`, mục *Độ sâu theo rủi ro*). TC được nâng hoặc hạ so với chức năng thì ghi lý do ở dòng `⚠️` cuối `Expected Result`.
- Theo ISTQB: mức rủi ro = khả năng xảy ra × tác động. Tra ma trận ở mục trên, ghi căn cứ **cả hai trục** ở đầu file, không chấm theo cảm tính.

### Tags

- Cách nhau bằng dấu cách: `@Regression @NegativeCase`.
- Nhóm chạy: `@Smoke` · `@Regression` · `@CriticalPath`.
- Tầm ảnh hưởng: `@HighImpact` — chức năng tác động Cao mà `Risk Level` chưa tới `High` vì khả năng lỗi thấp.
- Trạng thái: `@NeedsVerify` (Expected chưa có căn cứ) · `@AppDeviation` (Expected theo REQ/spec đã duyệt, app đang lệch, chưa có bug) · `@TechCheck` · `@Deprecated` · `@KnownBug:<BUG_ID>` (TC đúng theo REQ, app đang sai, bug đang mở — gỡ khi bug đóng). Mở bug xong thì đổi `@AppDeviation` thành `@KnownBug:<BUG_ID>`.
- Gây gián đoạn: `@Disruptive` — chỉ chạy khi user duyệt, xem `skills-requirements-analyzer` mục 3.4.4.
- Nền tảng khi module có ≥ 2 nền tảng: `@Web` · `@API`.

### 2.1. TC ID

Format **`<HỆ_THỐNG>_<MODULE>_TC_<3 số>`** — VD `CRM_CUST_TC_001` (prefix chốt ở `docs/requirements/README.md`, dùng cố định cho mọi module):
- **`<MODULE>`** = prefix REQ của module (VD `CUST`), tra ở `docs/requirements/README.md`
- **`<3 số>`** = số thứ tự **liên tục trong cả module**, không reset theo section
- Số section `I.X.Y` **chỉ nằm ở tiêu đề mục** (`## I.2 Thêm mới` → `### I.2.1 Validate từng trường`), KHÔNG nhét vào TC ID

VD: TC đầu tiên của mục `I.2.1 Validate từng trường` là `CRM_CUST_TC_015` nếu I.1 đã dùng 001 → 014.

**Quy tắc:**
- ✅ Không xóa TC nào (deprecate → tag `@Deprecated` + tiền tố `🗑️ Deprecated (<TICKET-ID>, <ngày>) —` ở đầu `Test Summary`)
- ✅ Không đánh lại số khi bổ sung — TC mới luôn lấy **số kế tiếp sau số lớn nhất của module**, dù chèn vào section nào. Số trong một section vì vậy có thể không liền nhau — chấp nhận được
- ✅ Thêm nhóm mới → dùng số nhóm tiếp theo ở **tiêu đề mục**, không chèn giữa
- ✅ TC ID là khoá nối sang `allure.label('testId', ...)`, RTM và execution report → đã phát hành thì không đổi

### 2.2. REQ ID

- **BẮT BUỘC mỗi dòng** — mã requirement mà TC cover (`REQ-CUST-01`)
- 1 TC có thể cover nhiều REQ → phân cách `,`
- Lấy từ tài liệu requirements của module. Agent không tự cấp mã ở bước sinh TC
- TC không trỏ về REQ nào = **TC mồ côi** → phải xem lại

### 2.3. Priority

- **BẮT BUỘC mỗi dòng**, một trong 3 giá trị:
  - `P1` — Smoke + Critical: luồng chính, chặn release nếu hỏng
  - `P2` — Regression: validate, luồng thất bại nghiệp vụ, phân quyền
  - `P3` — Edge case: ngoại lệ UI, biên hiếm gặp, phi chức năng
- Cột `Priority` trong `automation_matrix.md` **lấy đúng giá trị** ở bảng chính, không chấm lại

### 2.4. Test Summary

- Bắt buộc mở đầu bằng **"Kiểm tra ..."** — KHÔNG "Verify/Test/Ensure"
- Ngắn gọn 1 câu, đủ ý
- Dùng dấu `-` để tách phần chính và điều kiện phụ:
  - `Kiểm tra validate Email - nhập > 255 ký tự`
  - `Kiểm tra validate Tên - nhập đúng 255 ký tự (boundary)`

> Bảng không còn cột `Description`. Chú thích quan trọng (`Chờ BA confirm` / `Cần đồng bộ với REQ-XXX` / `@NeedsVerify`) ghi ở **dòng cuối cột Expected Result**, bắt đầu bằng `⚠️`.

### 2.5. Pre-condition

- Nếu = pre-condition chung → ghi `Pre-condition chung`
- Nếu có delta → `Pre-condition chung, <delta>` (VD: `Pre-condition chung, mở popup Thêm mới`)
- Nếu điều kiện riêng biệt → ghi thẳng (VD: `Bản ghi có yêu cầu đang chờ xử lý`)

### 2.6. Action (Manual Test Step)

- Đánh số `1.`, `2.`, `3.` — **mỗi bước 1 hành động**
- Dùng `<br>` xuống dòng trong cell
- Bắt đầu bằng động từ chuẩn: `Click`, `Nhập`, `Chọn`, `Paste`, `Truy cập`, `Kiểm tra`, `Xóa bỏ trống`
- **Chỉ chứa hành động**, không nhét dữ liệu test vào đây (dữ liệu nằm ở cột `Test Data`)
- Tương ứng với trường **`Manual Action: Action`** của Xray

### 2.7. Test Data (Manual Test Step Data)

- Đánh số `1.`, `2.`, `3.` — **khớp 1-1 với Action**
- Bước nào không có dữ liệu test thì ghi `(không có)`
- Dùng `<br>` xuống dòng trong cell
- Chứa dữ liệu cụ thể, không ghi chung chung: `012345678912`, `001199012345`
- Tương ứng với trường **`Manual Action: Data`** của Xray

### 2.7. Expected Result

**Rule đánh số 3 cấp — BẮT BUỘC phân biệt cấp to/cấp bé:**

| Cấp | Ký hiệu | Ý nghĩa | Ghi trong cell |
|---|---|---|---|
| **Cấp 1 — Main** | `1.`, `2.`, `3.` | Kết quả chính khớp 1-1 với Action (step số nào có kết quả quan sát được → main expected cùng số đó) | `1. Lưu thành công` |
| **Cấp 2 — Sub-item** | `-` (gạch ngang) | Chi tiết cụ thể của Main expected — VD field nào hiển thị, giá trị nào, message nào | `- ABC: giá trị mới` |
| **Cấp 3 — Sub-sub** | `+` (dấu cộng) | Chi tiết bé hơn nữa của Sub-item — VD trong list ABC, phần tử BCN | `+ BCN` |

**Xuống dòng trong cell Markdown:** dùng `<br>` giữa mọi dòng (kể cả giữa cấp).

**Ví dụ chuẩn:**

```markdown
| Action | Expected Result |
|---|---|
| 1. Điền form đầy đủ<br>2. Click Button Lưu | 1. Lưu thành công<br>- Popup đóng<br>- Message "Thêm mới thành công."<br>- Bản ghi mới xuất hiện đầu danh sách với các field:<br>+ Mã: giá trị vừa nhập<br>+ Tên: giá trị vừa nhập<br>+ Trạng thái: "Hoạt động"<br>2. Quay về màn danh sách<br>- URL: `/module-a` |
```

**Rule kèm theo:**
- Main expected (`1.`) **BẮT BUỘC khớp số** với Action — step 2 có kết quả → main expected `2. ...`
- 1 Main có thể có 0, 1, hoặc nhiều sub-item (`-`)
- 1 sub-item (`-`) có thể có 0, 1, hoặc nhiều sub-sub (`+`)
- **KHÔNG được dồn nhiều thông tin vào 1 dòng main** khi có thể tách ra sub-item — reader cần thấy được cấu trúc kết quả
- **KHÔNG được nhảy cấp** — không có Main mà đã có `-`; không có `-` mà đã có `+`
- Message trong nháy kép có dấu `.` cuối:
  - ✅ `Hiển thị cảnh báo "Tên ứng dụng không được bỏ trống."`
  - ❌ `Báo lỗi tên ứng dụng`

**❌ Sai (gộp tất cả 1 cấp, khó đọc):**
```
1. Lưu thành công, popup đóng, message "Thêm mới thành công.", bản ghi mới ở đầu list với Mã/Tên/Trạng thái đúng
2. Quay về màn danh sách với URL /module-a
```

**✅ Đúng (phân cấp rõ ràng):**
```
1. Lưu thành công
- Popup đóng
- Message "Thêm mới thành công."
- Bản ghi mới xuất hiện đầu danh sách:
+ Mã: giá trị vừa nhập
+ Tên: giá trị vừa nhập
+ Trạng thái: "Hoạt động"
2. Quay về màn danh sách
- URL: `/module-a`
```

### 2.8. Ví dụ TC hoàn chỉnh

```markdown
| CRM_CUST_TC_046 | REQ-CUST-05 | High | P2 | Kiểm tra tìm kiếm với chuỗi chứa mã script | Pre-condition chung | 1. Dán vào ô tìm kiếm<br>2. Click nút Tìm kiếm | 1. `<script>alert('xss')</script>`<br>2. (không có) | 1. Ô tìm kiếm nhận chuỗi, không hiện hộp thoại nào<br>2. Không thực thi script<br>- Hiển thị thông báo "Từ khóa không hợp lệ." hoặc danh sách rỗng | @Regression @NegativeCase |
```
---

## 3. Cấu Trúc File Output — Theo Chức Năng Nghiệp Vụ

**File chính:** `docs/testcases/<module>/web/test_cases_<module>_web.md` (tầng nền tảng `web/` · `api/` theo `CLAUDE.md`)

**File index:** `docs/testcases/<module>/TEST_CASES_<TÊN_MODULE>_SUMMARY.md` — tổng hợp, Bản đồ tài liệu, Nhật ký thay đổi; KHÔNG chứa dòng TC

```
# I. <Tên module>

> **Module:** ...
> **Nguồn:** Jira `<TICKET-ID>` · [Confluence pageId XXXX](...)
> **Evidence:** E01, E02...
> **Ngày sinh TC:** DD-MM-YYYY · **Format:** v3 (10 cột)

## Cấu trúc file
<bảng section overview + ASCII tree>

## Pre-condition chung
<block text 2-4 điều kiện>

## I.1 Giao diện màn <Module>              ← Batch 1
    ### Layout tổng quan
    ### Danh sách (data table)
    ### Tìm kiếm
    ### Filter
    ### Phân trang
    ### Chức năng phụ (Xuất Excel / Refresh / Bulk action)
    ### Xem chi tiết readonly       (nếu detail = popup từ row)

## I.2 Thêm mới                            ← Batch 2 (CRUD)
    ### I.2.1 Validate từng trường  (1 bảng con/field)
    ### I.2.2 Luồng chính - Thêm thành công
    ### I.2.3 Luồng thất bại - Nghiệp vụ (trùng mã, quota, FK)
    ### I.2.4 Ngoại lệ - UI (Hủy/X/spam/timeout/mất mạng/concurrent)

## I.3 Sửa                                 ← Batch 2 (CRUD)
    ### I.3.1 Validate từng trường  (ghi DELTA nếu giống I.2.1)
    ### I.3.2 Luồng chính - Sửa thành công
    ### I.3.3 Luồng thất bại
    ### I.3.4 Ngoại lệ

## I.4 Xóa                                 ← Batch 2 (CRUD)
    ### I.4.1 Xóa thành công
    ### I.4.2 Xóa thất bại (FK, không quyền)
    ### I.4.3 Ngoại lệ (Hủy popup confirm)

## I.5 Thay đổi trạng thái                 ← Batch 3 (Status flow, nếu có)
    ### I.5.1 Ma trận State Transition (bảng)
    ### I.5.2 Chuyển trạng thái hợp lệ
    ### I.5.3 Chuyển trạng thái bị chặn
    ### I.5.4 Ngoại lệ

## I.6 Xem chi tiết                        ← Batch 4 (chỉ khi detail = trang riêng)
    ### I.6.1 Giao diện trang chi tiết
    ### I.6.2 Hiển thị dữ liệu đúng
    ### I.6.3 Action trên trang chi tiết

## I.7 Phân quyền                          ← Batch 5
    ### Có quyền
    ### Không có quyền

## I.8 Session hết hạn                     ← Batch 6

## I.9 Ngoại lệ chung (reload/back/multi-tab)  ← Batch 6

## I.10 Đồng bộ API                        ← nếu module nhận data từ API ngoài
```

### 3.1. Quy tắc section

- **Order CỨNG**, nhưng cho phép **SKIP số** khi không áp dụng (VD module cấu hình chỉ có Sửa → chỉ có I.3, không có I.2/I.4)
- **Tối đa 3 tầng heading:** `I.2` → `I.2.1` → dòng TC `<HỆ_THỐNG>_<MODULE>_TC_<3 số>` (KHÔNG có `I.2.1.1` là heading)
- Khi luồng chính có sub-flow phức tạp → **dùng cột Test Summary để phân biệt**, KHÔNG chia tiếp sub-section:
  - `CRM_CUST_TC_030 | Kiểm tra Thêm thành công - có upload logo`
  - `CRM_CUST_TC_031 | Kiểm tra Thêm thành công - không upload logo`
- **Sửa dùng chung form với Thêm:** I.3.1 chỉ ghi **DELTA** (VD "sửa mã đã tồn tại"), không lặp lại toàn bộ validate

### 3.2. Phân biệt "Luồng thất bại nghiệp vụ" vs "Ngoại lệ UI" (QUAN TRỌNG)

| Loại | Định nghĩa | Ví dụ | Nằm ở section |
|---|---|---|---|
| **Luồng thất bại (nghiệp vụ)** | Backend/business rule reject | Trùng mã, vượt quota, FK conflict, dữ liệu ràng buộc, business permission | I.X.3 |
| **Ngoại lệ (UI/hạ tầng)** | Hành vi UI/network/concurrency | Hủy, X, ESC, spam click, backend timeout, mất mạng, concurrent 2 tab, reload giữa chừng | I.X.4 |

Không được dồn 2 loại vào 1 section — mỗi loại có target reader khác (dev khắc phục business logic vs QA test resilience).

### 3.3. "Xem chi tiết" — khi nào tách section?

| Kịch bản | Xử lý |
|---|---|
| Detail = **readonly popup/panel** click từ row list | **Gộp vào I.1** (### Xem chi tiết readonly) |
| Detail = **trang riêng có URL** với action (Duyệt/Từ chối/Export detail) | **Tách section I.6** riêng |

---
## 4. Sinh theo vòng, ghi theo mục

Sinh theo **vòng** để không sót lớp kiểm thử. Ghi theo **mục chức năng** để người đọc tìm được TC. Một batch nằm trọn trong một vòng, nhưng khi ghi file phải đưa từng TC về đúng mục.

| Vòng | Nội dung chính | Mục trong file |
|---|---|---|
| **V1 Smoke** | Giao diện cơ bản, mở form, hiển thị, nhập hợp lệ, lưu, đối chiếu | I.1 và mục "Luồng chính" của I.2 → I.4 |
| **V2 Functional** | Validation, quy tắc nghiệp vụ, CRUD, trạng thái, phụ thuộc, đoán lỗi | I.1 (table, filter, tìm kiếm), I.2 → I.6 |
| **V3 Technical** | Phân quyền, bảo mật, API, CSDL, tích hợp, nhật ký | I.7, I.10 và phần ngoại lệ liên quan |
| **V4 Non-functional** | Tương thích, đáp ứng, trợ năng, hiệu năng, hồi quy, xuyên module | I.8, I.9 và mục mới cuối file khi cần |

**Không** tạo mục kiểu "Batch 1: Validation" trong file.

---

## 6. Từ Vựng Chuẩn Hóa (BẮT BUỘC — cả 2 modes)

### 6.1. Component name (100% tiếng Việt trong bảng TC)

| Loại | Cách gọi chuẩn | Ví dụ |
|---|---|---|
| Ô nhập text | `Textbox` | Textbox tìm kiếm, Textbox Tên ứng dụng |
| Dropdown | `Droplist` | Droplist Trạng thái |
| Nút | `Button` | Button Tìm kiếm, Button Lưu thông tin |
| Icon | `Icon` | Icon X, Icon Cấp lại key (⟳) |
| Radio | `Radio button` | Radio button "Qua RAR Hub" |
| Checkbox | `Checkbox` | Checkbox Đồng ý điều khoản |
| Switch on/off | `Switch` | Switch trạng thái ứng dụng |
| Modal/dialog | `Popup` | Popup Thêm mới, popup xác nhận |
| Vùng text dài | `Textarea` | Textarea Mô tả |
| Ngày | `Date picker` | Date picker Ngày sinh |
| Toast/notification | `Message` / `Thông báo` | Message "Cập nhật thành công" |

### 6.2. Hành động (Action)

| Ý nghĩa | Từ chuẩn |
|---|---|
| Nhấn chuột | `Click` (KHÔNG "Bấm") |
| Nhập text | `Nhập` |
| Chọn dropdown/radio/checkbox | `Chọn` |
| Dán từ clipboard | `Paste` |
| Vào URL | `Truy cập` |
| Xem/kiểm tra element | `Kiểm tra` |
| Xóa nội dung để trống | `Xóa bỏ trống` |
| Thay đổi value | `Thay đổi` / `Sửa` |
| Ngắt kết nối | `Ngắt mạng` |
| Nhấn phím | `Nhấn phím <tên phím>` (VD `Nhấn F5`, `Nhấn Enter`) |

### 6.3. Kết quả (Expected Result)

| Ý nghĩa | Từ chuẩn |
|---|---|
| UI element hiện ra | `Hiển thị ...` |
| Cho phép hành động | `Cho phép ...` |
| Chặn hành động | `Không cho ...` / `Bị chặn` / `Không được phép` |
| Báo lỗi | `Hệ thống báo lỗi "..."` / `Hiển thị cảnh báo "..."` |
| Thông báo thành công | `Thông báo "... thành công."` |
| Điều hướng | `Chuyển đến trang ...` / `Redirect về ...` |
| Không có tác dụng | `Không có phản ứng` / `Không có tác dụng` |
| Trim tự động | `Hệ thống trim space trước khi lưu` |

### 6.4. Trạng thái nghiệp vụ (tiếng Việt, KHÔNG dùng English enum)

- ✅ `Hoạt động` / `Đã khóa` / `Chờ duyệt` / `Đã duyệt` / `Đã hủy`
- ❌ `ACTIVE` / `INACTIVE` / `PENDING`

Action cũng tiếng Việt:
- ✅ `Khóa` / `Mở khóa` / `Duyệt` / `Hủy` / `Cấp lại key`
- ❌ `Enable/Disable` / `Approve/Reject`

### 6.5. Message chuẩn (validate)

- **Bỏ trống:** `"<Trường> không được bỏ trống."`
- **Vượt max:** `"<Trường> không quá X ký tự."`
- **Sai format:** `"<Trường> không đúng định dạng."`
- **Trùng:** `"<Trường> đã tồn tại."`
- **Không có kết quả tìm kiếm:** `"Không tìm thấy <đối tượng> phù hợp."`
- **Cập nhật OK:** `"Cập nhật thành công."` / `"Thêm mới thành công."` / `"Xóa thành công."`

---

## Quy Tắc Trình Bày Action (BẮT BUỘC — áp dụng QUICK, FULL RBT & DELTA)

> Mode CHECKLIST KHÔNG dùng steps đánh số — xem Quy Tắc Viết Mục Checklist ở Mode 3.

- **Mỗi bước 1 hành động, đánh số thứ tự rõ ràng** `1. 2. 3.` — trong cell Markdown dùng `<br>` xuống dòng
- **Expected Result đánh số khớp 1-1** với step tương ứng (step nào có kết quả quan sát được thì có expected cùng số)
- KHÔNG viết steps thành đoạn văn liền, KHÔNG gộp nhiều hành động vào 1 số

```markdown
✅ Đúng:
| Action | Expected Result |
| 1. Mở trang /login<br>2. Nhập email: test_login_01@yopmail.com<br>3. Nhập password: Test@123<br>4. Click nút "Đăng nhập" | 1. Trang login hiển thị đủ 2 field + nút<br>4. Chuyển đến /dashboard, hiển thị "Xin chào" |

❌ Sai:
| Mở trang login rồi nhập email và password hợp lệ sau đó bấm đăng nhập | Đăng nhập thành công |
```

## Quy tắc Test Data (áp dụng cho cả 4 modes)

```
❌ Sai: "Nhập mã số hợp lệ"
✅ Đúng: "Nhập mã: KH-2026-0012"

❌ Sai: "Nhập email hợp lệ"
✅ Đúng: "Nhập email: test_khachhang_01@domain.com"

❌ Sai: "Nhập giá trị vượt giới hạn"
✅ Đúng: "Nhập 256 ký tự vào trường Name (max: 255)"
```

