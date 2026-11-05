# Anti-Patterns, Quality Gate, Output, Liên Kết

## 8. Anti-Patterns (NGHIÊM CẤM — cả 2 modes)

### Về Q&A (FULL RBT)
- ❌ Gộp nhiều bước chạy 1 lần
- ❌ Tự đoán API behavior khi chưa hỏi Dev/API Owner
- ❌ Chạy tiếp khi câu blocker chưa được BE Dev trả lời
- ❌ Ghi `ASM-XX` cho câu blocker (chỉ non-blocker mới ASM)
- ❌ Không xuất file `rbt_step_01_context.md` và `rbt_step_02_ambiguity_qna.md`

### Về format bảng TC
- ❌ Bỏ cột "Dữ liệu test" riêng, hoặc thiếu `REQ ID` · `Risk Level` · `Priority` · `Tags`
- ❌ Nhầm `Risk Level` với `Priority` hoặc Severity của bug
- ❌ Hạ Kết quả mong đợi theo hành vi hiện tại của API khi spec đã duyệt nói khác (`test_design_api.md` mục 2)
- ❌ Nhét metadata automation vào bảng chính (phải tách `automation_matrix.md`)
- ❌ Test purpose không bắt đầu "Kiểm tra"
- ❌ Bộ TC mới dùng TC ID khác `<HỆ_THỐNG>_<MODULE>_TC_<nnn>`. Section A–K chỉ là heading trong file, không nằm trong TC ID. Bộ TC cũ giữ format đã dùng
- ❌ Ghi cột Mô tả để trống (API testcase Mô tả **PHẢI** ghi 1 câu diff so với happy)
- ❌ Mix Anh-Việt trong bảng (`API failure`, `Invalid data`) → 100% Việt

### Về Expected Result API
- ❌ Chỉ ghi HTTP status, không ghi Response JSON đầy đủ
- ❌ Chỉ ghi Response JSON, không ghi HTTP status
- ❌ Response JSON không có message rõ ràng (chỉ có HTTP status trần)
- ❌ Response JSON đặt trong plain text không dùng inline code `` ` `` — mất format
- ❌ HTTP status không khớp **semantic** (VD dùng HTTP 500 cho lỗi validate user, dùng HTTP 200 cho case fail)
- ❌ Timestamp/requestId trong Response ghi giá trị cố định mà không note "data mẫu"

### Về cấu trúc file
- ❌ Bỏ Table of Contents đầu file (>50 TC bắt buộc phải có TOC)
- ❌ Bỏ warning box `> **Quy tắc:**` khi có business rule đặc biệt (VD phân biệt luồng)
- ❌ Bỏ bảng phân biệt error code khi dự án CÓ prefix error code và có ≥2 code dễ nhầm (chỉ áp dụng khi dự án có convention error code)
- ❌ Ghi test cases theo batch (VD "Batch 3: Validation") thay vì theo section A/B/C/D/E/F/G/J/K
- ❌ Tách TC API của 1 module thành nhiều file (dù >100 TC vẫn 1 file)
- ❌ Gộp nhiều module vào 1 file. Nhiều endpoint của cùng module nằm chung file, chia bằng heading
- ❌ Lặp lại TC HMAC/auth trong mỗi file API (phải tách file dùng chung)

### Về Section coverage — chỉ áp cho section mà `Risk Level` của endpoint yêu cầu (`test_design_api.md` mục 4)
- ❌ Bỏ Section E3 "Truyền dữ liệu dư thừa" (verify hệ thống bỏ qua)
- ❌ Bỏ Section E5 "Trim khoảng trắng" cho field text
- ❌ API async mà bỏ Section G "Trạng thái giao dịch"
- ❌ API multipart mà bỏ Section J2/J3 validate parts
- ❌ API sinh file (PDF/Excel/DOCX) mà bỏ Section K "Verify visual manual"
- ❌ Bỏ Idempotency test (X-Request-Id duplicate)
- ❌ Bỏ Concurrent transaction test (khi API async)

### Về test data & step
- ❌ Test Steps viết đoạn văn không đánh số
- ❌ Dữ liệu test mơ hồ ("hợp lệ", "sai") không có giá trị cụ thể
- ❌ Test data lặp lại trong Steps (đã có ở cột Dữ liệu test)
- ❌ Có ≥3 điều kiện kết hợp nhưng không lập Decision Table
- ❌ API async có ≥3 trạng thái nhưng không lập State Transition table

---

## 9. AI Self-Quality Gate — 6 Tiêu Chí

- [ ] **1. Unique TC ID** — Không trùng, đúng format `<HỆ_THỐNG>_<MODULE>_TC_<nnn>` (bộ TC cũ giữ format đã dùng)
- [ ] **2. Structure 3-part Expected Result** — Mọi TC có đủ (1) API success/fail (2) HTTP status (3) Response JSON đầy đủ
- [ ] **3. HTTP status đúng semantic** — Không có HTTP 500 cho lỗi validate user, không có HTTP 200 cho case fail. Nếu dự án có prefix error code → business code khớp với HTTP status semantic (không HTTP 400 kèm code server error)
- [ ] **4. Field Validation Coverage (Section A)** — Mọi input field có đủ TC: không truyền + null + rỗng + sai format + boundary
- [ ] **5. Section coverage** — Đủ section mà `Risk Level` của từng endpoint yêu cầu (`test_design_api.md` mục 4) + 4 thứ không bao giờ rút. Section rút theo rủi ro ghi `⏭️` kèm căn cứ, section không áp dụng ghi `➖`
- [ ] **6. TOC + Warning box + (Bảng phân biệt error code nếu có)** — (1) Mục lục đầu file với anchor links [BẮT BUỘC], (2) `> **Quy tắc:**` / `> **Ghi chú:**` đầu section khi có business rule đặc biệt [BẮT BUỘC khi có rule phức tạp], (3) Bảng phân biệt error code khi dự án CÓ convention error code và có ≥2 code dễ nhầm [KHUYẾN NGHỊ, không bắt buộc với mọi dự án]

Xuất kèm **Bảng Đối Soát Coverage:**

```markdown
| Section | Số TC | Phủ được | Ghi chú |
|---|---|---|---|
| A. Validate input | 45 | 13 fields × avg 3.5 case | ✅ |
| B. Master data | 6 | Provider + Credential + Cross-provider | ✅ |
| C. Business rule | 6 | Ví dụ CTS: Expired/Revoked/Suspended/Inactive/Wrong-owner (tùy nghiệp vụ) | ✅ |
| D. Auth app-level | 1 | App không quyền endpoint | 🟡 THIẾU rate limit — bổ sung |
| E1-E5 Success | 30 | 4 enum × basic + boundary + dư thừa + trim | ✅ |
| F. Edge cases | 10 | CA/TSA/OCSP/CRL/Storage/Callback | ✅ |
| G. Status flow | 8 | WAITING/COMPLETED/REJECTED/EXPIRED/FAILED + Webhook | ✅ |
| J. Format | 8 | Content-Type + Method + Parts + Extra field | ✅ |
| K. Visual verify | 8 | Adobe Reader | ✅ Manual |
```

---

## 10. Checklist Self-Review 15 Mục (chạy TRƯỚC khi commit)

- [ ] 1. Header đủ metadata — Endpoint, Method, Content-Type, Ngày tạo (Prefix error code nếu dự án có)
- [ ] 2. Pre-condition chung block đầu file
- [ ] 3. Table of Contents với anchor links đầu file
- [ ] 4. TC ID không trùng, đúng format `<HỆ_THỐNG>_<MODULE>_TC_<nnn>` (bộ TC cũ giữ format đã dùng)
- [ ] 5. Đúng 11 cột, `REQ ID` · `Risk Level` · `Priority` · `Tags` không để trống, tag `@API` ở mọi dòng
- [ ] 6. Mục đích kiểm tra bắt đầu "Kiểm tra ..." cho 100% TC
- [ ] 7. Mô tả ghi 1 câu diff so với happy path (không để trống)
- [ ] 8. Dữ liệu test có giá trị cụ thể — không "hợp lệ" / "đúng"
- [ ] 9. Test Steps đánh số + `<br>`
- [ ] 10. Kết quả mong đợi đủ 3 phần (API success/fail + HTTP + Response JSON)
- [ ] 11. Response JSON dùng inline code `` ` `` để giữ format
- [ ] 12. Warning box `> **Quy tắc:**` / `> **Ghi chú:**` đầu section khi có business rule đặc biệt
- [ ] 13. Bảng phân biệt error code khi dự án CÓ convention error code và có ≥2 code dễ nhầm (bỏ qua nếu dự án không dùng prefix error code)
- [ ] 14. Section E theo độ sâu — rủi ro `High` đủ E1 (cơ bản mọi variant) + E2 (boundary) + E3 (dư thừa) + E4 (file/Unicode) + E5 (trim); `Medium`, `Low` rút sub nào thì ghi `⏭️` kèm căn cứ
- [ ] 15. Nếu API async → có Section G với đủ 5 trạng thái + Webhook + Tải file kết quả

---

## 11. Output Format

### Mode QUICK

| Output | Mô tả |
|---|---|
| Mục Assumptions | `ASM-XX` — giả định đã áp dụng |
| File `docs/testcases/<module>/api/test_cases_<module>_api.md` | Bảng TC 11 cột API + TOC + Warning box + Bảng phân biệt error code |
| File `automation_matrix.md` | Metadata automation |
| Bảng Đối Soát Coverage | Section × số TC × phủ được |

### Mode FULL RBT

| Bước | Output |
|---|---|
| 1 | File `docs/requirements/<module>/analysis/rbt_step_01_context.md` |
| 2 | File `docs/requirements/<module>/analysis/rbt_step_02_ambiguity_qna.md` (Q&A đánh dấu 🔴/🟡) |
| 3 | Section decomposition + Dependencies |
| 4 | Traceability Matrix + High-Level Scenarios |
| 5 | Test Cases chi tiết theo format API v3 |
| 6 | File `docs/testcases/<module>/api/test_cases_<module>_api.md` + `automation_matrix.md` + Coverage Report |

Tất cả output bằng **Tiếng Việt**, format **Markdown**, tuân thủ **Write-first**: ghi thẳng vào file, chat chỉ tiến độ + bảng đối soát + tóm tắt đường dẫn.

---

## 12. Liên Kết Tham Khảo

### File mẫu & convention
- **Ví dụ đường dẫn một bộ TC API:** `docs/testcases/<module>/api/test_cases_<module>_api.md`
- **Ví dụ file convention viết TC của dự án (nếu có):** `docs/conventions/testcase_writing_guide.md`
- **CLAUDE.md dự án:** [CLAUDE.md](../../../../CLAUDE.md) — Tech stack, TC ID convention, Allure metadata

### Workflow dự án (chuỗi API)
- **`/discover-system` (nhánh API):** [discover-system/SKILL.md](../../discover-system/SKILL.md) — khám phá + `api_map.md` + prefix module
- **`/generate-requirements-from-api`:** [generate-requirements-from-api/SKILL.md](../../generate-requirements-from-api/SKILL.md) — sinh REQ từ spec, có kiểm chứng gọi thật
- **`/generate-testcases-api`:** [generate-testcases-api/SKILL.md](../../generate-testcases-api/SKILL.md) — workflow chính, dùng skill này để sinh TC
- **`/generate-automation-api`:** [generate-automation-api/SKILL.md](../../generate-automation-api/SKILL.md) — sinh automation từ TC

### Skill song song & liên quan
- **Skill manual UI v3 (song song):** [skills-manual-testcase-v3](../../skills-manual-testcase-v3/SKILL.md)
- **Skill sinh REQ (đã tích hợp mục 9 của skill này):** [skills-requirements-analyzer](../../skills-requirements-analyzer/SKILL.md) — quy ước đánh mã REQ/AMB/RISK (Section 2 + 2.1), quy trình xử lý spec đa định dạng (Section 3.2 Bước 0), đối chiếu chéo nguồn (Section 3.3), framework AMB/RISK (Section 4), Nhật ký thay đổi (Section 6.9), chuẩn Evidence (Section 7.2.1)
- **Skill sinh test data (đã tích hợp mục 10 của skill này):** [skills-test-data-generator](../../skills-test-data-generator/SKILL.md) — 3 nguyên tắc Unique/Deterministic/Traceable, Unique Data Pattern, 4 Data Categories (Positive/Negative/Boundary/Edge), Multi-Step Data Pipeline (Cross-Module), Field Classification, Combinatorial Data Generation
- **Skill sinh automation:** [skills-qa-automation-engineer](../../skills-qa-automation-engineer/SKILL.md) — sinh REST Assured / Playwright API từ TC
- **Skill coverage:** [skills-coverage-traceability](../../skills-coverage-traceability/SKILL.md) — RTM Requirements ↔ TC ↔ Automation

### Rules dự án
- **Automation rules:** [.claude/rules/automation_rules.md](../../../rules/automation_rules.md)
- **Reporting rules:** [.claude/rules/reporting_rules.md](../../../rules/reporting_rules.md) — Allure metadata, output `reports/`, không stdout
