# Format TC API, Mã HTTP, Cấu Trúc File, Từ Vựng

## 1. Format Bảng TC — 11 Cột API

```markdown
| TC ID | REQ ID | Risk Level | Priority | Mục đích kiểm tra | Mô tả | Tiền điều kiện | Dữ liệu test | Các bước thực hiện | Kết quả mong đợi | Tags |
```

Workflow phía sau tìm cột **theo tên ở header**, nên phải viết đúng tên, không đổi thứ tự tuỳ ý. Cột automation (`Automatable` · `Type` · `Auto Status`) nằm ở `automation_matrix.md`.

### 1.1. TC ID — 2 format hợp lệ, đọc danh mục dự án trước khi chọn

**BẮT BUỘC đọc `docs/testcases/README.md` (danh mục dự án)** trước khi cấp TC ID mới — dự án có convention rồi thì **dùng lại**, không tự đặt format mới.

#### Format 1 — Theo section (chỉ giữ cho bộ TC cũ)

Format `<PREFIX>_<SECTION><nhóm>_<STT>`:
- **PREFIX** = viết tắt module/endpoint (VD `PDF` cho ký PDF, `KYSO` cho ký số chung, `LOGIN` cho login). Convention dự án: dùng UPPERCASE, không quá 8 ký tự.
- **SECTION** = chữ cái theo layer test — A/B/C/D/E/F/G/H/I/J/K (xem mục 3)
- **Nhóm** = số 1, 2, 3... nếu section có nhiều sub-section (VD `A1`, `A2` cho validate từng field; `E1`, `E2` cho các variant happy path)
- **STT** = số thứ tự trong nhóm, 2 chữ số zero-padding (`01`, `02`, ..., `09`, `10`)

**Ví dụ:**
- `PDF_A1_01` — Ký PDF, Section A (Validate input), field 1, TC số 1
- `PDF_E_07d` — Ký PDF, Section E (Success), không có nhóm, TC số 7 variant d
- `LOGIN_B_02` — Login, Section B (Master data), không có nhóm, TC số 2

**Quy tắc:**
- ✅ Không xóa TC nào (deprecate → tag `@Deprecated` + tiền tố `🗑️ Deprecated (<TICKET-ID>, <ngày>) —` ở đầu `Mục đích kiểm tra`)
- ✅ Không đánh lại từ 1 khi bổ sung — luôn +1 vào STT cuối
- ✅ Thêm variant → dùng suffix chữ (`_07a`, `_07b`, `_07c`), không đánh lại số
- ✅ Không chèn giữa — nhóm mới dùng số nhóm tiếp theo

#### Format 2 — Theo dự án (⭐ bắt buộc cho bộ TC mới)

Format `<HỆ_THỐNG>_<MODULE>_TC_<nnn>`:
- **HỆ_THỐNG** = viết tắt hệ thống, thường là project name (VD `PARTNERHUB`)
- **MODULE** = viết tắt module nghiệp vụ (VD `LOGIN`, `AUTH`, `KYSO_PDF`)
- **TC** = literal `TC`
- **nnn** = 3 chữ số zero-padding (`001`, `002`, ..., `099`, `100`)

**Ví dụ:**
- `PARTNERHUB_LOGIN_TC_001` — dự án Partner Hub, module LOGIN, TC số 1
- `PARTNERHUB_KYSO_PDF_TC_015` — Partner Hub, module ký số PDF, TC số 15

**Ghi chú:**
- Format 2 **KHÔNG có ký hiệu Section** trong TC ID → section (A/B/C/D/E...) chỉ là **cấu trúc file**, TC ID chạy theo thứ tự tăng dần toàn module không phân biệt section
- `/generate-traceability-matrix`, `/generate-automation-api`, `/export-to-xray` đọc theo Format 2

#### Chọn Format nào?

| Tình huống | Chọn |
|---|---|
| Bộ TC cũ đang dùng Format 1 | Giữ Format 1, không đổi mã đã phát hành. `/export-to-xray` không đọc được format này |
| Bộ TC đã dùng Format 2 | Format 2, nối tiếp dải |
| Bộ TC mới | **Format 2** |
| API là mặt khác của module đã có web (chung prefix) | Bám theo format module đó đã dùng |

Đọc `docs/testcases/README.md` (danh mục) để biết dải TC ID đã dùng — TC ID mới **nối tiếp**, không mở dải mới.

### 1.2. REQ ID

- **Bắt buộc mỗi dòng.** TC không trỏ về REQ nào là TC mồ côi.
- Chưa có requirement thì ghi `⚠️ Chưa có REQ` và báo user chạy `/generate-requirements-from-api`. Không tự coi URL là REQ.
- Một TC cover nhiều REQ thì phân cách bằng `,`.

### 1.2a. Risk Level

- **Bắt buộc mỗi dòng:** `High` · `Medium` · `Low`, theo tiêu chí ở `test_design_api.md` mục 4.
- Rủi ro = khả năng xảy ra × tác động. Ghi căn cứ cả hai trục ở đầu file.

### 1.2b. Priority

- **Bắt buộc mỗi dòng:** `P1` · `P2` · `P3`. Đây là thứ tự chạy, khác `Risk Level` và khác Severity của bug.

| Giá trị | Dùng cho |
|---|---|
| `P1` | Luồng thành công chính, xác thực cơ bản, lỗi chặn release |
| `P2` | Validate, phân quyền, nghiệp vụ, trạng thái |
| `P3` | Biên hiếm gặp, ngoại lệ hạ tầng, phi chức năng |

### 1.2c. Tags

- Cách nhau bằng dấu cách. Luôn có `@API`.
- Nhóm chạy: `@Smoke` · `@Regression` · `@CriticalPath`. Trạng thái: `@NeedsVerify` · `@AppDeviation` · `@Deprecated` · `@KnownBug:<BUG_ID>`. Gây gián đoạn: `@Disruptive`. Tầm ảnh hưởng: `@HighImpact`. Loại: `@Security` · `@Permission` · `@Boundary`.

### 1.3. Mục đích kiểm tra (Test purpose)

- Bắt buộc mở đầu **"Kiểm tra ..."** — KHÔNG "Verify/Test/Ensure"
- Ngắn gọn 1 câu, đủ ý — thường mô tả THEO **field/rule + trạng thái/giá trị test**:
  - `Kiểm tra validate trường providerUsername khi không truyền`
  - `Kiểm tra ký PDF thành công với signatureDisplayType = TEXT_ONLY`
  - `Kiểm tra ký PDF thành công file đúng 10MB (boundary max)`
  - `Kiểm tra trạng thái REJECTED khi người dùng hủy - luồng RSSP CA`
- Có gắn `(boundary)` cuối khi test giá trị biên
- Có ghi rõ **luồng đặc biệt trong ngoặc** khi API có nhiều flow (`- luồng RSSP CA`, `- luồng RAR Hub`)

### 1.4. Mô tả (Description)

**Khác skill UI v3** — cột Mô tả ở API testcase **ghi ngắn 1 câu diff so với happy path**:

```markdown
| Mô tả |
|---|
| Không truyền file trong request |
| Truyền providerUsername = null |
| Truyền chuỗi không phải Base64 hợp lệ |
| Ký thành công chỉ hiển thị text |
| CA bị down, không thể gửi yêu cầu ký |
```

Mục đích: reader nhìn cột Mô tả biết ngay TC này DIFF cái gì so với happy path, không cần đọc chi tiết Steps.

### 1.5. Tiền điều kiện (Pre-condition)

- Nếu = pre-condition chung → ghi `HMAC hợp lệ, file X hợp lệ, ...` (thông tin ngắn, gom vào 1 dòng)
- Nếu có delta → ghi thẳng: `luồng RSSP CA`, `providerCode = VNPT`, `CTS đã expired`
- **KHÔNG viết `Pre-condition chung`** như skill UI v3 — API testcase pre-condition ngắn hơn và biến thiên nhiều theo TC

### 1.6. Dữ liệu test (Test Data) — CỘT RIÊNG

**Khác skill UI v3** — API testcase **BẮT BUỘC có cột "Dữ liệu test" riêng** vì:
- API có nhiều field cần specify cùng lúc (VD `providerCode: "VNPT"`, `providerUsername: "user_A"`, `credentialId: "CERT_01"`)
- Test data thường có cấu trúc phức tạp (base64, JSON, file path)
- Nếu nhét trong Steps sẽ rối, khó review

**Cách ghi:**
- Mỗi field trên 1 dòng dạng `<field>: <giá trị>`
- Dùng `<br>` xuống dòng trong cell Markdown
- Ghi rõ format nếu quan trọng (VD `file: test.docx (500KB)`, `providerPasswordEncrypted: encrypted bằng key sai`)
- Test data cụ thể — **KHÔNG dùng "hợp lệ", "đúng"**:
  - ✅ `file: large_file.pdf (10.1MB)`
  - ✅ `providerCode: "INVALID_PROVIDER"`
  - ❌ `file: PDF vượt dung lượng`
  - ❌ `providerCode: sai`

### 1.7. Các bước thực hiện (Test Steps)

- Đánh số `1.`, `2.`, `3.` — **mỗi bước 1 hành động**
- Dùng `<br>` xuống dòng trong cell
- Bắt đầu bằng động từ chuẩn API: `Truyền`, `Gọi API`, `Đính kèm`, `Không truyền`, `Thêm`, `Kiểm tra`, `Poll`, `Chờ`
- Không lặp lại data đã ghi ở cột Dữ liệu test — chỉ ghi hành động:
  - ✅ `1. Không truyền providerUsername ở body<br>2. Các thông tin khác hợp lệ<br>3. Gọi API ký PDF`
  - ❌ `1. Truyền providerUsername = null (đã ghi ở Dữ liệu test)`

### 1.8. Kết quả mong đợi (Expected Result) — BẮT BUỘC 3 phần

Mọi TC API **BẮT BUỘC** có đủ 3 phần trong Expected Result:

```
1. Gọi API thành công/thất bại
2. HTTP <status code>
3. Response:
`{...JSON body — cấu trúc tùy nghiệp vụ, có message rõ ràng...}`
```

**Rule chi tiết:**
- Đánh số `1.`, `2.`, `3.` — mỗi phần 1 dòng
- **HTTP status code cụ thể** — không viết chung chung "HTTP error"
- **Response JSON đầy đủ** — dùng backtick inline code `` `{"...":"..."}` ``. Cấu trúc JSON (fields, error code prefix, message wording) **tùy convention dự án** — VD một dự án dùng `{"code":"RSP-XXX","message":"...","requestId":"..."}`, dự án khác dùng `{"error":"...","details":[...]}`
- **Business error code là GỢI Ý, không bắt buộc:**
  - Nếu dự án có prefix chuẩn (VD `RSP-101`, `MSG-002`, `AUTH-401`) → ghi vào JSON để phân biệt các case cùng HTTP status
  - Nếu dự án chưa có prefix → chỉ cần message rõ ràng trong Response JSON
- Cấp con dùng `-` cho detail, `+` cho sub-detail (giống rule đa cấp của skill UI v3):
  ```
  1. Gọi API thành công
  - transactionStatus = "WAITING_FOR_CONFIRMATION"
  - Response trả transactionId
  + Verify: transactionId là UUID hợp lệ
  + Dùng transactionId gọi API tra cứu → status = COMPLETED
  ```

**Ví dụ chuẩn:**

```markdown
| Kết quả mong đợi |
|---|
| 1. Gọi API thất bại<br>2. HTTP 400<br>3. Response:<br>`{"code":"RSP-101","message":"Dữ liệu request không hợp lệ","requestId":"app-20260608-001","detail":{"file":"Không được để trống"},"timestamp":"2026-06-08T10:00:00+07:00"}` |
```

**Ghi chú cuối file:** requestId + timestamp là data mẫu, thực tế khác mỗi lần gọi — ghi note ở đầu hoặc cuối file để reader biết.

### 1.9. Ví dụ TC hoàn chỉnh

> **Lưu ý:** Ví dụ chỉ để minh hoạ. Cấu trúc Response JSON và mã lỗi theo convention của từng dự án.

```markdown
| CRM_DOC_TC_001 | REQ-DOC-03 | High | P2 | Kiểm tra validate trường file khi không gửi file | Không truyền file trong request | Token hợp lệ, các trường khác hợp lệ | file: không đính kèm | 1. Không đính kèm file vào field file<br>2. Các thông tin khác hợp lệ<br>3. Gọi API tải tài liệu | 1. Gọi API thất bại<br>2. HTTP 400<br>3. Response:<br>`{"code":"VAL-101","message":"Dữ liệu request không hợp lệ","detail":{"file":"Không được để trống"}}` | @API @Regression @NegativeCase |
```

---

## 2. HTTP Status Codes — Bảng semantic chuẩn (BẮT BUỘC dùng đúng semantic)

Mọi TC API phải dùng HTTP status **đúng ngữ nghĩa** (semantic). Business error code trong Response JSON là **tùy dự án**, không bắt buộc format cụ thể.

| HTTP Status | Ý nghĩa (semantic) | Khi nào dùng | Business code minh họa (file mẫu Ký số PDF) |
|---|---|---|---|
| **200 / 201** | Success | Happy path, tạo resource mới thành công | `RSP-000` |
| **400 Bad Request** | Validate nghiệp vụ (đã parse đúng kiểu, vi phạm rule) | Field required/format/range sai | `RSP-101`, `RSP-102` |
| **400 Bad Request** | Parse body sai kiểu | Truyền `abc` vào field Integer, JSON malformed | `RSP-105` |
| **401 Unauthorized** | Authentication fail | Signature sai, token hết hạn, không có token | `RSP-201` |
| **403 Forbidden** | Authorization fail (không có quyền) | Chưa được cấp quyền endpoint, **BOLA/IDOR** (user A truy cập resource user B) | `RSP-208` |
| **404 Not Found** | Endpoint / resource không tồn tại | URL sai, transactionId/id không có | `RSP-301`, `RSP-302` |
| **405 Method Not Allowed** | Sai HTTP method | Gọi GET vào endpoint POST | `RSP-104` |
| **406 Not Acceptable** | Accept header không match server hỗ trợ | Server trả `application/json`, client gửi `Accept: application/xml` | tùy dự án |
| **409 Conflict** | Conflict state | Trạng thái không phù hợp, duplicate record, race condition, request-id duplicate | `RSP-401` |
| **413 Payload Too Large** | File/body vượt size limit | Upload file > max | tùy dự án |
| **415 Unsupported Media Type** | Sai Content-Type | Gửi `application/json` khi yêu cầu `multipart/form-data` | `RSP-103` |
| **429 Too Many Requests** | Rate limit vượt | Gửi request quá nhanh, brute force login | tùy dự án |
| **500 Internal Server Error** | Lỗi nội bộ | Storage down, DB error, code bug | `RSP-521` |
| **502 Bad Gateway** | Downstream lỗi | Downstream service down/unknown | `RSP-501` |
| **504 Gateway Timeout** | Downstream timeout | Response quá thời gian chờ | `RSP-502` |

**Rule về semantic HTTP status:**
- ✅ HTTP status phải khớp **ngữ nghĩa** — VD lỗi validate → 400, lỗi auth → 401, lỗi downstream → 502
- ❌ Không được HTTP 200 cho case fail (VD gộp lỗi vào response 200 với `success: false`)
- ❌ Không được HTTP 500 khi thực chất là 400 (validate người dùng) hoặc 502 (downstream)

**Business error code (cột minh họa):** chỉ là ví dụ từ file mẫu Ký số PDF. Nếu dự án của bạn có convention error code khác (VD `AUTH-001`, `VALIDATION-002`, không có prefix, dùng enum...) → dùng convention đó, không bắt buộc theo bảng này.

---

## 3. Cấu Trúc File Output — Theo Layer Test

**File chính:** `docs/testcases/<module>/api/test_cases_<module>_api.md` — theo `CLAUDE.md` mục 6b.

### 3.1. Cấu trúc chuẩn (ví dụ)

```markdown
# Testcase API <Tên API>

> **API:** `<METHOD> <endpoint_path>`
> **Content-Type:** `<content_type>`
> **Prefix mã lỗi:** `<PREFIX>` (nếu dự án có — VD `RSP`, `AUTH`, `MSG`... bỏ dòng này nếu không dùng)
> **Ngày tạo:** DD/MM/YYYY

---

## Pre-condition chung

<block text 3-5 điều kiện — HMAC/token/gateway/CTS/file...>

---

## Mục lục

- [A. Validate dữ liệu đầu vào](#a-validate-dữ-liệu-đầu-vào)
- [B. Sai master data / reference data](#b-sai-master-data--reference-data)
- [C. Sai nghiệp vụ - <domain>](#c-sai-nghiệp-vụ)
- [D. Xác thực & phân quyền](#d-xác-thực--phân-quyền)
- [E. Luồng thành công](#e-luồng-thành-công)
  - [E1. <variant 1>](#e1)
  - [E2. Boundary values](#e2)
  - [E3. Truyền dữ liệu dư thừa](#e3)
  - [E4. File/data & ký tự đặc biệt](#e4)
  - [E5. Trim khoảng trắng](#e5)
- [F. Edge cases (downstream/network)](#f)
- [G. Trạng thái giao dịch (chỉ API async)](#g)
- [I. HMAC Authentication *(xem file dùng chung)*](#i)
- [J. Validate Response Output & Request format](#j)
- [K. Verify visual (chỉ API sinh file)](#k)

---

## A. Validate dữ liệu đầu vào     ← Section A: từng field
### A1. <field 1>                   (mỗi field 1 sub-section)
### A2. <field 2>
...

## B. Sai master data / reference data
> Dữ liệu đầu vào đúng format nhưng giá trị không tồn tại trong hệ thống.

## C. Sai nghiệp vụ - <domain>       (VD Chứng thư số, Tài khoản, Giao dịch)
> Dữ liệu đúng format, tồn tại trong hệ thống, nhưng vi phạm quy tắc nghiệp vụ.

## D. Xác thực & phân quyền
> Test app-level permission. Password nhà cung cấp → Section A. HMAC → Section I.

## E. Luồng thành công
### E1. <Happy path cơ bản>          (mỗi variant chính 1 nhóm — VD từng enum value)
### E2. Boundary values              (min/max/edge của size, length, position)
### E3. Truyền dữ liệu dư thừa       (verify hệ thống bỏ qua field thừa/không thuộc context)
### E4. File & ký tự đặc biệt        (Unicode filename, file format edge, multi-page)
### E5. Trim khoảng trắng            (tất cả field text có space đầu/cuối)

## F. Edge cases (thất bại / ngoại lệ hệ thống)
> Downstream lỗi, timeout, network, idempotency.

## G. Kiểm tra trạng thái giao dịch  ← chỉ khi API async
### G1. Happy path - <flow 1>
### G2. Happy path - <flow 2>        (nếu có nhiều flow VD RSSP CA vs RAR Hub)
### G3. Luồng thất bại               (REJECTED / EXPIRED / FAILED)
### G4. Webhook & tải file kết quả

## I. HMAC Authentication            ← file dùng chung, chỉ link không lặp

## J. Validate Response Output & Request format
### J1. Content-Type & Method
### J2. Validate part <required_1>   (khi multipart)
### J3. Validate part <required_2>
### J4. Response format & Security

## K. Verify visual                  ← chỉ khi API sinh file (PDF/Excel/DOCX)
> Manual verify trên Adobe Reader / Excel / MS Word.
```

### 3.2. Quy tắc section

- **Order CỨNG** A → B → C → D → E → F → G → I → J → K — reader quen với thứ tự này
- **SKIP section không áp dụng** — VD API sync không cần G, API JSON không cần J2/J3, API không sinh file không cần K
- **1 module = 1 file duy nhất** — dù >100 TC vẫn giữ 1 file (giống rule skill UI v3)
- **Tối đa 2 tầng heading** dưới section — `## A` → `### A1` (không có `#### A1a`)
- Bộ TC mới: biến thể cấp TC ID nối tiếp dải, không dùng suffix. Bộ TC cũ theo Format 1 mới giữ suffix `_a`, `_b`, `_c`

### 3.3. Warning box đầu section (BẮT BUỘC khi có business rule đặc biệt)

> **Lưu ý:** Nội dung trong các ví dụ dưới (RSSP CA / RAR Hub / VNPT / BKAV / CTS / providerUsername...) là **ví dụ từ file mẫu Ký số PDF**. Với API khác, thay bằng business rule tương ứng của dự án. Warning box chỉ **BẮT BUỘC** khi section có business rule phức tạp, phân biệt luồng, hoặc dependency — không phải mọi section đều cần.

Dùng 3 loại warning box:

**`> **Quy tắc:**`** — Giải thích business rule quan trọng, phân biệt luồng (ví dụ):
```markdown
> **Quy tắc:** Khi ký qua **luồng RSSP CA**, trường `providerUsername` là **bắt buộc**. Không truyền/null/rỗng → lỗi validate.
> - **Luồng RAR Hub:** `providerUsername` **không bắt buộc**, hệ thống bỏ qua.
```

**`> **Ghi chú:**`** — Note thêm về scope, exception, dependencies (ví dụ):
```markdown
> **Ghi chú:**
> - **Provider A, B:** field `password` **bắt buộc**. Không truyền/null/rỗng → lỗi validate.
> - **Provider C, D:** field `password` **không bắt buộc**, BE không check.
```

**`> **Điều kiện tiên quyết:**`** — Precondition cho toàn section (ví dụ):
```markdown
> **Điều kiện tiên quyết:** Auth hợp lệ, file input hợp lệ, resource dependency đã sẵn sàng.
> **Luồng xử lý:** API tiếp nhận → validate → xử lý → gọi downstream → trả kết quả.
> **Kỳ vọng chung:** HTTP 200, response có trường status = `<giá trị success của dự án>`.
```

### 3.4. Bảng phân biệt error code (khuyến nghị khi dự án có ≥2 code dễ nhầm)

> **Điều kiện áp dụng:** Chỉ dùng bảng này khi dự án có convention error code (VD prefix `RSP-`, `AUTH-`, `MSG-`) và có ≥2 code dễ nhầm lẫn. Dự án không có prefix error code → **bỏ qua** phần này.

Đặt ở cuối section liên quan, format (ví dụ từ file mẫu):

```markdown
> **Ghi chú phân biệt RSP-101 vs RSP-105:**
> - **RSP-101** — Lỗi validate nghiệp vụ: giá trị đã được parse đúng kiểu dữ liệu nhưng vi phạm rule (null, rỗng, âm, vượt range). Message: `"Dữ liệu request không hợp lệ"`.
> - **RSP-105** — Lỗi parse body: giá trị không deserialize được sang kiểu mong đợi (VD truyền số thập phân vào Integer). Lỗi ở tầng JSON deserialization. Message: `"Dữ liệu request body không hợp lệ: <tên trường>"`.
> - Các case bị ảnh hưởng: PDF_A10_03, PDF_A10_04, PDF_A11_03, PDF_A11_04, PDF_A12_07, PDF_A12_08.
```

Rule:
- Liệt kê **danh sách TC ID cụ thể** bị ảnh hưởng để reviewer/dev tra được
- Đặt ở CUỐI section, không đầu (để user đọc bảng TC trước rồi mới đến giải thích)

---

## 7. Từ Vựng Chuẩn Hóa API

### 7.1. Hành động Test Steps

| Ý nghĩa | Từ chuẩn |
|---|---|
| Gửi request | `Gọi API <tên>` |
| Truyền field | `Truyền <field> = <value>` |
| Không truyền field | `Không truyền <field>` |
| Đính kèm file | `Đính kèm file <name> vào field <part_name>` |
| Header | `Truyền header <name> = <value>` |
| Poll status | `Poll API status đến khi <trạng thái>` |
| Chờ điều kiện | `Chờ <điều kiện>` (VD `Chờ quá timeout`) |
| Verify manual | `Mở bằng <tool>`, `Kiểm tra <element>` |

### 7.2. Kết quả Expected

| Ý nghĩa | Từ chuẩn |
|---|---|
| API success | `Gọi API thành công` |
| API fail | `Gọi API thất bại` |
| Async accepted | `transactionStatus = "WAITING_FOR_CONFIRMATION"` |
| Async done | `transactionStatus = "COMPLETED"` |
| Async fail states | `"REJECTED"` / `"EXPIRED"` / `"FAILED"` |
| Không lỗi | `Hệ thống bỏ qua <field/part> thừa` |
| Verify format | `Response đúng cấu trúc: <JSON template>` |
| Trim | `Hệ thống trim → "<giá trị đã trim>"` |

### 7.3. Message trong Response — dùng chuẩn convention dự án

> **Rule chung:** Message phải rõ ràng, tiếng Việt, không viết chung chung. Wording cụ thể **tùy convention dự án**.

Ví dụ từ file mẫu Ký số PDF (không bắt buộc theo):
- Message business: `"Dữ liệu request không hợp lệ"`
- Message parse: `"Dữ liệu request body không hợp lệ: <field>"`
- Message downstream: `"Lỗi hệ thống downstream"` / `"Không tìm thấy chứng thư số"`
- Message timeout: `"Hệ thống ngoài phản hồi quá thời gian chờ"`

---
