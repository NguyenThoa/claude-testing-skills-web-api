# Sinh Test Data Cho TC API

## 10. 🎲 Sinh Test Data Cho API TC (Bám theo `skills-test-data-generator`)

> Bổ sung từ skill `skills-test-data-generator` — quy tắc sinh test data cho cột "Dữ liệu test" của TC API.

### 10.1. 3 Nguyên tắc bắt buộc cho Test Data API

Mọi data trong cột "Dữ liệu test" của TC API phải đảm bảo:

| Nguyên tắc | Ý nghĩa | Cách áp dụng |
|---|---|---|
| **Unique** | Không trùng trong suite/session | Dùng timestamp / UUID / counter |
| **Deterministic** | Cùng seed → cùng data (khi cần replay) | Ghi rõ trong TC nếu có seed |
| **Traceable** | Nhìn data biết ngay TC nào tạo ra | Prefix `auto_<module>_<tc_id>_<timestamp>` |

### 10.2. Unique Data Pattern cho API

Format chuẩn:

```
<prefix>_<module>_<tc_id>_<timestamp>
```

**Ví dụ theo loại data:**

| Loại | Format | Ví dụ |
|---|---|---|
| Email | `auto_<module>_<tc>_<timestamp>@yopmail.com` | `auto_kyso_a1_01_1712049200@yopmail.com` |
| Username | `user_<module>_<tc>_<timestamp>` | `user_login_b_02_1712049200` |
| Phone | Prefix hợp lệ + số ngẫu nhiên | `0912345678`. Không chắc là số ảo: không chạy luồng gửi SMS trên cổng thật |
| Password | Sinh ngẫu nhiên đủ ràng buộc, hoặc lấy từ `.env` | `<12 ký tự: hoa, thường, số, ký tự đặc biệt>` |
| Mã business (order, transaction) | `AUTO_<TC>_<TIMESTAMP>` | `AUTO_PDF_E_01_1712049200` |

**Rule tránh PII thật:**
- KHÔNG dùng email/phone/CMND thật của người dùng thật
- Email test dùng `@yopmail.com` — hộp thư công khai, chỉ dùng cho dữ liệu test. Hệ thống chặn email dùng một lần thì hỏi user domain thay thế
- Số điện thoại: prefix hợp lệ (`0912`, `0987`) + số random, KHÔNG dùng số của khách hàng thật

### 10.3. 4 Data Categories cho API TC

Mỗi endpoint có 4 nhóm data:

**✅ Positive Data (Happy Path — Section E1):**
- Valid format, đủ mọi field required
- Trong constraints (min length ≤ x ≤ max length)
- Business values thực tế (VD: `providerCode` từ danh sách provider hợp lệ)

**❌ Negative Data (Section A):**
- Missing required fields (không truyền)
- Invalid format (email sai `@`, phone chứa chữ, JSON malformed)
- Invalid type (String vào Integer, số thập phân vào Integer)
- Already existing values (duplicate unique field)
- Values ngoài enum

**🔲 Boundary Values (Section E2 + A):**
- Min length (VD 1 ký tự)
- Max length (VD 255 ký tự)
- Min + 1, Max - 1
- Empty string `""` vs null vs không truyền
- Zero, negative numbers
- Đúng max (boundary equals limit)

**⚡ Edge Cases (Section E4 + F + H):**
- Unicode / emoji / RTL text
- Very long strings (`> 10.000 chars` — ReDoS test)
- SQL injection patterns (`' OR 1=1--`)
- XSS payloads (`<script>alert(1)</script>`)
- HTML tags trong text
- Leading/trailing whitespace (Section E5 Trim)

### 10.4. Output Data Format cho TC API

Trong cột "Dữ liệu test" của TC, ghi data cụ thể theo cấu trúc:

```markdown
| Dữ liệu test |
|---|
| providerCode: "VNPT"<br>providerUsername: "auto_kyso_e01_1712049200"<br>credentialId: "CERT_01"<br>file: sample.pdf (1MB) |
```

Cho **Test Data Matrix ở phần cuối file** (tách riêng, tham chiếu bởi nhiều TC), dùng format JSON:

```json
{
  "positive": [
    { "provider": "VNPT", "username": "auto_kyso_e01_1712049200", "expected": "success" }
  ],
  "negative": [
    { "provider": "", "expected_status": 400, "expected_message": "providerCode không được để trống" },
    { "provider": "INVALID_PROVIDER", "expected_status": 400, "expected_message": "Nhà cung cấp không tồn tại" }
  ],
  "boundary": [
    { "signatureDisplayText": "<255 ký tự>", "note": "Max length boundary" },
    { "signatureDisplayText": "<256 ký tự>", "expected_status": 400, "note": "Vượt max" }
  ]
}
```

### 10.5. Multi-Step Data Pipeline (Cross-Module) — QUAN TRỌNG cho API test

Nhiều API test cần chuỗi phụ thuộc: `login → tạo user → lấy token → tạo resource → test permission`. Chain này phải rõ trong TC.

**Data Chain Pattern:**

```
Step 1: POST /auth/login → Output: {token, user_id}
    ↓ (Reference)
Step 2: POST /users → Input: {token} → Output: {user_id_B}
    ↓ (Reference)
Step 3: GET /users/{user_id_B} → Input: {token của user A + user_id_B}
    → Verify: user A không xem được user B (BOLA/IDOR)
```

**Ghi trong TC:**
- Cột `Tiền điều kiện`: `Đã có userA và userB do suite tạo — xem Setup Section`
- Cột `Các bước thực hiện`: từng step có kèm data reference `{token_A}`, `{user_id_B}`
- Setup Section đầu file: mô tả chain data tạo trước khi test

### 10.6. Field Classification cho request body

Khi TC API test body phức tạp (nhiều field), phân loại field:

| Loại field | Định nghĩa | Cách sinh data trong TC |
|---|---|---|
| **Dimension** | Giá trị thuộc bộ combo test (mỗi combo = 1 TC riêng) | Lấy chính xác từ combo — KHÔNG random |
| **Supporting** | Field bắt buộc nhưng không phải điểm test của TC hiện tại | Random + unique + traceable (VD `user_<tc_id>_<timestamp>`) |
| **Reference** | ID/code từ output API call trước | Copy từ output step trước — ghi `{tên_reference}` |
| **Computed** | Tính từ formula/business rule (VD signature hash) | Ghi công thức trong TC + expected value cụ thể |

**Ví dụ TC sign PDF:**
- **Dimension** (đang test): `signatureDisplayType = "TEXT_ONLY"` (đây là điểm test)
- **Supporting**: `providerUsername`, `credentialId` — dùng data test bất kỳ (unique + traceable)
- **Reference**: `token` — từ API `/auth/login` chạy ở Setup
- **Computed**: `X-Signature` HMAC — tính từ payload + secret, ghi rõ công thức

### 10.7. Combinatorial Data — cho API có ma trận kết hợp

Khi API có nhiều dimension kết hợp (VD: 4 provider × 4 signatureType × 2 tsaExpected = 32 combo), sinh Test Data Matrix riêng:

```markdown
## Test Data Matrix — Combinatorial

| Combo | provider | signatureType | tsaExpected | TC ID | Expected |
|---|---|---|---|---|---|
| C01 | VNPT | TEXT_ONLY | true | PDF_E_C01 | Success + TSA timestamp |
| C02 | VNPT | TEXT_ONLY | false | PDF_E_C02 | Success no TSA |
| C03 | VNPT | IMAGE_ONLY | true | PDF_E_C03 | Success image + TSA |
| ... | | | | | |
```

**Rule cho Combinatorial:**
- Dimension values PHẢI đúng 100% theo ma trận — KHÔNG random
- Mỗi combo dùng data riêng (supporting field random unique)
- Mỗi combo PHẢI có expected output cụ thể
- Nếu >20 combo → dùng **pairwise testing** để giảm số combo, ghi chú lý do rút gọn
- Traceable: format `auto_combo{XX}_<module>_<timestamp>`

### 10.8. Constraints — data KHÔNG được vi phạm

Test data trong TC API PHẢI:
- Respect validation rules từ spec (đọc kỹ min/max/pattern/enum)
- Match format field (date `dd/MM/yyyy` hoặc ISO 8601, phone theo prefix, base64 đúng chuẩn)
- Không duplicate giữa TC — mỗi TC có unique data riêng để chạy parallel không conflict
- **KHÔNG chứa PII thật** — email/phone/CMND/số tài khoản của khách hàng thật là tuyệt đối cấm
- Data ghi/xóa: chỉ nhắm vào bản ghi có prefix `auto_` do chính suite tạo (theo Rule 3 luật vàng mục 8)

---
