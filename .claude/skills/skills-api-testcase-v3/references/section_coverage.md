# Đặc Thù Các Section Và Case API

## 4. Đặc thù các Section (BẮT BUỘC bao phủ)

### Section A — Validate input (mỗi field 1 sub-section)

Với mỗi field trong request:

| Test type | Test purpose template |
|---|---|
| Không truyền | `Kiểm tra validate <field> khi không truyền` |
| Null | `Kiểm tra validate <field> khi giá trị null` |
| Rỗng | `Kiểm tra validate <field> khi giá trị rỗng` |
| Sai format | `Kiểm tra validate <field> khi <format sai cụ thể>` |
| Boundary max negative | `Kiểm tra validate <field> khi vượt <limit> ký tự/bytes` |
| Sai kiểu dữ liệu | `Kiểm tra validate <field> khi truyền <kiểu sai> thay <kiểu đúng>` |
| Xung đột với field khác | `Kiểm tra validate <field> khi <field khác> = X yêu cầu <field> nhưng thiếu` |

**10 loại field cho request body** (BẮT BUỘC — liệt kê từng field, sinh negative TC riêng theo loại):

| Loại field | Test cần có |
|---|---|
| **String** | Required · min/max length · whitespace-only · ký tự đặc biệt (`<>&"'`) · XSS injection · SQL injection · Unicode/Emoji · leading/trailing spaces |
| **Email** | Format hợp lệ · thiếu `@` · thiếu domain · domain sai · nhiều `@` · ký tự đặc biệt · case sensitivity · max length · unique |
| **Phone** | Chỉ số · prefix hợp lệ · min/max length · chữ cái xen · dấu cách/`-`/`.` |
| **Number / Integer** | Min/max value · số âm · số 0 · thập phân (nếu là Integer) · overflow · ký tự không phải số · leading zeros |
| **Boolean** | Truyền `true`/`false` · truyền `"true"`/`"false"` (string) · truyền `1`/`0` (số) · truyền null · truyền chuỗi bất kỳ |
| **Date / DateTime** | Format đúng (ISO 8601, `dd/MM/yyyy`) · ngày không tồn tại · năm nhuận · quá khứ/tương lai · min/max date · timezone |
| **Enum** | Giá trị hợp lệ (mọi option) · giá trị ngoài enum · case sensitivity · viết thường/hoa · giá trị số thay text |
| **Array** | Rỗng `[]` · null · vượt max items · phần tử trùng lặp · phần tử null xen giữa · nested Object sai schema |
| **Nested Object** | Missing required field trong nested · sai schema · deep nesting · null vs `{}` |
| **File (multipart)** | Không attach · file rỗng 0 byte · vượt max size · sai type/extension · tên file Unicode/ký tự đặc biệt · corrupted file · password-protected · multiple files (nếu chỉ nhận 1) |

**Rule:**
- Mỗi field 1 sub-section trong Section A (`### A1. <field>`, `### A2. <field>`...)
- Mỗi field có tối thiểu: 1 positive + 3–5 negative (không truyền, null, rỗng, sai format/type, boundary)
- Field có luồng đặc biệt (bắt buộc trong flow A, không bắt buộc trong flow B) → tách sub-sub (mục 3 skill)
- **KHÔNG gộp** validate nhiều field vào 1 TC

Nếu field có luồng đặc biệt (bắt buộc trong luồng A, không bắt buộc trong luồng B) → tách sub-sub (ví dụ):
```
### A3. <field name>
#### A3a. <field name> - Luồng/Provider <A> bắt buộc
#### A3b. <field name> - Luồng/Provider <B> không bắt buộc
```
Áp dụng cho: mọi field có rule khác nhau theo variant của request (VD provider, tenant, feature flag, user role).

### Section B — Master data / Reference data

Test giá trị đúng format nhưng **không tồn tại** trong hệ thống:
- FK không tồn tại (VD `credentialId: "CERT_INVALID_999"`)
- Master data đã disabled
- Cross-provider check (user thuộc provider A, credentialId thuộc provider B)

### Section C — Business rule

Test giá trị đúng format, tồn tại, nhưng **vi phạm quy tắc nghiệp vụ**:
- Entity ở trạng thái không cho phép (CTS expired/revoked/suspended/inactive)
- Ownership mismatch (CTS không thuộc user)
- Quota vượt / limit

### Section D — Authorization (app-level + user-level BOLA/IDOR)

**D1. App-level permission:**
- App chưa được phân quyền endpoint → 403
- App bị disable → 403
- Rate limit vượt → 429

**D2. BOLA / IDOR — Broken Object Level Authorization (BẮT BUỘC khi API có resource-level auth):**

Test user A không có quyền truy cập resource của user B:
- `GET /users/{id}` — user A gọi với `id` của user B → phải 403 hoặc 404 (không được 200 trả data user B)
- `PUT /users/{id}` — user A sửa thông tin user B → phải 403/404
- `DELETE /resources/{id}` — user A xóa resource user B → phải 403/404
- Đổi `id` trong PUT body (khác `id` trong path) — verify server dùng `id` trong path, không tin body

**🚨 Rule khi test BOLA/IDOR:**
- **CHỈ dùng 2 tài khoản do chính suite/session tự tạo** (`userA`, `userB`) — không lấy `id` từ API danh sách rồi test lên user thật
- Cả 2 tài khoản tạo mới, `email`/`username` có prefix `auto_` + timestamp để dễ dọn
- Sau test xong: dọn dữ liệu 2 user (DELETE) và bản ghi liên quan

**D3. Mass Assignment (nếu API nhận body):**
- Gửi kèm field đặc quyền (`role: "admin"`, `is_admin: true`, `verified: true`, `balance: 999999`)
- Verify API bỏ qua field không thuộc DTO, hoặc reject request
- Cover cho endpoint POST/PUT/PATCH

**Note:** Password nhà cung cấp → Section A. HMAC/auth headers → Section I (file dùng chung).

### Section E — Luồng thành công (5–7 nhóm)

| Sub-section | Nội dung | Bắt buộc? |
|---|---|---|
| **E1** | Happy path cơ bản — cho từng variant chính (mọi enum value, mọi flow chính) | ✅ luôn |
| **E2** | Boundary values (min/max size, length, position; boundary equals limit) | ✅ luôn |
| **E3** | Truyền dữ liệu dư thừa (bị bỏ qua) — verify hệ thống bỏ qua field thừa/không thuộc context | ✅ luôn (nếu API nhận body) |
| **E4** | File/data & ký tự đặc biệt — Unicode filename, file format khác nhau, Unicode text | ✅ nếu có file/text tự do |
| **E5** | Trim khoảng trắng — tất cả field text có space đầu/cuối → verify trim tự động | ✅ nếu có field text |
| **E6** | Pagination & Filtering & Sorting — cho GET List endpoint | ✅ nếu là GET List |
| **E7** | PUT vs PATCH semantics — nếu API có cả 2 method | ✅ nếu có cả PUT + PATCH |

**Rule chung:**
- E1 phải cover **mọi enum value / mọi flow chính** — không được chỉ test 1 variant rồi coi như đủ
- E3 verify tính flexibility — hệ thống không lỗi khi client gửi thừa
- E5 test 1 field/TC hoặc test nhiều field cùng lúc trong 1 TC "trim đồng thời"

### E6 — Pagination & Filtering & Sorting (cho GET List)

Bắt buộc khi endpoint là GET List (trả về array + pagination):

| Nhóm test | Ví dụ |
|---|---|
| **Pagination** | `page=1&limit=20` (default) · `page=1&limit=100` · `page=999` (vượt total) · `limit=0` · `limit=-1` · `limit=max+1` |
| **Sorting** | `sort=name&order=asc` · `order=desc` · sort by nhiều column · sort field không tồn tại · order value sai |
| **Filtering** | Filter theo status/date/name · filter nhiều điều kiện · filter không match (empty result) · filter với ký tự đặc biệt/SQL injection |
| **Search** | Partial match · case-insensitive · có dấu / không dấu · Unicode · empty string · chỉ khoảng trắng |
| **Empty result** | Filter/search không có kết quả → 200 với array rỗng + total = 0 (không phải 404) |
| **Large result** | Danh sách 1000+ bản ghi → performance ổn định, pagination đúng |

### E7 — PUT vs PATCH semantics (nếu API có cả 2)

| Method | Semantic |
|---|---|
| **PUT** | Gửi **đầy đủ** fields → update toàn bộ. **Reset** missing optional fields về default/null |
| **PATCH** | Gửi **partial** fields → chỉ update field chỉ định. **Giữ nguyên** field không gửi |

Test cases:
- **PUT thiếu optional field** → verify field bị reset về default (không phải giữ giá trị cũ)
- **PATCH thiếu optional field** → verify field giữ nguyên giá trị cũ
- **PUT thiếu required field** → 400 (validation fail)
- **PATCH chỉ truyền field cần đổi** → 200, các field khác giữ nguyên
- **PATCH truyền empty body `{}`** → 200 no-op (hoặc 400 tùy dự án)

### Section F — Edge cases (downstream & network)

- Downstream service down (CA, TSA, OCSP, CRL, Gateway)
- Timeout (client, server, downstream)
- Storage lỗi
- Callback/webhook fail
- Concurrent request (X-Request-Id duplicate → 409, phiên cũ EXPIRED không ảnh hưởng phiên mới)

### Section G — Trạng thái giao dịch (CHỈ khi API async)

Bắt buộc khi API trả `transactionStatus = WAITING_FOR_CONFIRMATION` rồi client phải poll:

| Sub | Nội dung |
|---|---|
| G1 | Happy path - flow 1 (WAITING → COMPLETED) |
| G2 | Happy path - flow 2 (nếu có multi-flow) |
| G3 | Luồng thất bại (REJECTED / EXPIRED / FAILED / các nguyên nhân khác) |
| G4 | Webhook + tải file kết quả (nếu API sinh output) |

**Rule Webhook:** Verify Webhook body format, không chứa file content (chỉ trạng thái + metadata).

### Section I — Authentication headers

Nếu dự án có common auth (HMAC, JWT chuẩn), **tách ra file dùng chung** thay vì lặp trong mỗi file API:
- Đặt ở module auth: `docs/testcases/<module-auth>/api/test_cases_<module-auth>_api.md`
- File API chính chỉ **link** đến file common, không lặp lại TC

### Section J — Request/Response format

| Sub | Nội dung |
|---|---|
| J1 | Content-Type & HTTP Method (405, 415) |
| J2 | Validate part `<required_1>` (VD `metadata` — nếu multipart) |
| J3 | Validate part `<required_2>` (VD `file` — nếu multipart) |
| J4 | Response format & Security (echo X-Request-Id, part dư, extra field JSON bị bỏ qua) |

### Section H — OWASP API Security Testing (BẮT BUỘC bao phủ)

> Bổ sung vào Section D (BOLA), Section A (Injection), Section F (Rate limit) — không cần section riêng, gắn tag `@Security` cho các TC này.

| Nhóm | Test cases |
|---|---|
| **Injection** | SQL injection trong query params (`?id=1 OR 1=1`) · SQL injection trong body fields · XSS trong text fields (`<script>alert(1)</script>`) · Command injection (nếu API xử lý shell) |
| **BOLA / IDOR** | Section D2 — chỉ dùng userA/userB tự tạo |
| **Mass Assignment** | Section D3 — gửi field đặc quyền trong body |
| **Auth Bypass** | Không token → 401 · Token hết hạn → 401 · Token role thấp gọi API role cao → 403 · Token bị tamper → 401 · Bearer với chuỗi rỗng → 401 |
| **ReDoS** | Truyền chuỗi > 10.000 chars vào field validate regex → phải reject nhanh, không hang |
| **Sensitive Data Exposure** | Response KHÔNG chứa: password/hash/secretKeys · Internal IDs / stack traces · Server info (`X-Powered-By`, `Server` header) · Credentials trong URL |
| **Rate Limiting** | Section F — 429 khi vượt limit · brute force login lock account |
| **CORS & Headers** | `Access-Control-Allow-Origin` không được `*` với credentials · `Content-Type` sai → 415 · `Accept` sai → 406 |

### Section K — Verify visual (CHỈ khi API sinh file)

Cho các case cần manual verify trên tool ngoài (Adobe Reader / Excel / MS Word):
- Layout output (position, size, orientation)
- Font/Unicode rendering
- Data integrity (nội dung gốc không thay đổi)
- Chain-of-trust (VD Adobe báo "Signature is VALID")

**Note ở đầu section:** "Các case verify visual cần thực hiện manual trên <tool> sau khi giao dịch COMPLETED."

---

## 5. Đặc thù case API mà UI TC không có

### 5.1. Idempotency

- `X-Request-Id` gửi 2 lần cùng giá trị → lần 2 trả 409 hoặc trả lại kết quả cache của lần 1 (tùy business)
- Test 2 phiên bản: cùng payload / khác payload

### 5.2. Concurrent transaction

- Tạo transaction mới khi transaction cũ chưa xác nhận → 409 hoặc thành công tùy business
- Phiên cũ EXPIRED → phiên mới thành công

### 5.3. Async flow polling

- Poll API status cho đến khi COMPLETED / REJECTED / EXPIRED / FAILED
- Kiểm tra timeout polling (poll quá lâu)
- Kiểm tra trạng thái không public không lộ ra client (chỉ 5 trạng thái public)

### 5.4. Webhook

- Webhook body format
- Webhook retry khi callbackUrl fail
- Webhook không chứa nội dung nhạy cảm (file, signature)

### 5.5. Content-Type variations

- `application/json` vs `multipart/form-data` vs `application/x-www-form-urlencoded`
- Missing Content-Type → 415
- Wrong charset → cần verify

---
