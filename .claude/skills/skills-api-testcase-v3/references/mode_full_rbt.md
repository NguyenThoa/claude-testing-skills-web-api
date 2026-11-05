# 🎯 MODE 2: FULL RBT — 6 Bước Có Q&A

Giống hệt workflow của [skills-manual-testcase-v3](../../skills-manual-testcase-v3/SKILL.md) — chỉ khác **nội dung Q&A tập trung vào API** và **output file theo format API**.

## Bước 1: Context & Role-play

**Agent phải:**
1. Yêu cầu user cung cấp:
   - Tên endpoint / API domain
   - Business context (module nào, use case nào)
   - Spec tài liệu (Swagger, Confluence, Postman collection)
   - Có Base URL staging test không
2. Đọc kỹ spec, xác nhận hiểu bối cảnh
3. **Đọc evidence:** response mẫu, log Postman/Insomnia, screenshot debug
4. Tóm tắt scope API: endpoint · content-type · async/sync · downstream
5. **Xuất file `rbt_step_01_context.md`** (BẮT BUỘC — path: `docs/requirements/<module>/analysis/`)
6. **DỪNG — Chờ user xác nhận** trước khi sang Bước 2

**Output:** File `rbt_step_01_context.md` + tóm tắt scope trong chat.

## Bước 2: Analysis & QnA — 🔴 QUAN TRỌNG NHẤT

**Agent phải:**

1. **Xác định các luồng:**
   - Happy Path (sync response 200)
   - Async flow (WAITING → COMPLETED/REJECTED/EXPIRED/FAILED)
   - Downstream failure paths
   - Alternative flows (VD RSSP CA vs RAR Hub)

2. **Phát hiện Ambiguities:**
   - Field required/optional chưa rõ theo flow
   - Response error format chưa rõ (dự án có prefix error code không, structure JSON ra sao) — CHỈ hỏi nếu dự án có convention error code
   - Xung đột spec ↔ response mẫu
   - Trạng thái async chưa liệt kê đủ
   - Retry/timeout policy chưa rõ
   - Idempotency behavior chưa spec

3. **Đặt câu hỏi Q&A — agent TỰ SINH, KHÔNG dùng template cứng**

   **Nguồn để sinh câu hỏi (agent bắt buộc rà soát đủ):**
   - Field validate không quy định rõ (max length, format regex, unique, required)
   - Enum values chưa liệt kê đầy đủ
   - HTTP status semantic chưa rõ (VD lỗi validate → 400 hay 422?)
   - Response error format của dự án (có prefix error code không? structure JSON ra sao?) — chỉ hỏi nếu dự án có convention
   - Async flow: các trạng thái transition + rule
   - Downstream services của dự án — failure behavior (tùy nghiệp vụ, VD: gateway/CA/payment/notification/…)
   - Content-Type / Method / Header requirements
   - Idempotency policy (VD X-Request-Id behavior)
   - Rate limit / quota
   - Webhook: có không, format, retry
   - Master data validation rule (tồn tại/disabled)

4. **Agent TỰ PHÂN LOẠI mỗi câu — Blocker hay Non-blocker:**

   | Loại | Định nghĩa | Xử lý khi user không trả lời |
   |---|---|---|
   | 🔴 **Blocker** | Không có câu trả lời → sai hàng loạt TC — business rule, permission, state transition, validate rule của field required, HTTP status semantic, xung đột doc↔evidence | BẮT BUỘC chờ. Cấm ghi ASM. BA/Dev chưa trả lời → dừng skill |
   | 🟡 **Non-blocker** | Có default hợp lý — session timeout, retry policy, cosmetic error message wording | Nhắc lại 1 lần → không có → ghi `ASM-XX` với default |

5. **Xuất file `rbt_step_02_ambiguity_qna.md`** (BẮT BUỘC — để user forward BA/Dev/API Owner)

6. **DỪNG — Chờ user/BA trả lời** trước khi qua Bước 3.

**Output:** File `rbt_step_02_ambiguity_qna.md` + tóm tắt số câu 🔴/🟡 trong chat.

## Bước 3: Decomposition (Phân rã API)

**Agent phải:**
1. Phân rã API theo layer test:
   - Input fields (Section A)
   - Master data (Section B)
   - Business rules (Section C)
   - Auth (Section D + I)
   - Happy paths (Section E)
   - Edge cases (Section F)
   - Async flow (Section G nếu có)
   - Request/Response format (Section J)
   - Manual verify (Section K nếu có)
2. Chỉ ra Dependencies giữa các layer
3. Map với cấu trúc file — layer nào rơi vào section nào

**Output:** Danh sách section + dependencies.

## Bước 4: Traceability

**Agent phải:**
1. Map mỗi section với business rule / API spec section
2. Gap Analysis — có rule nào trong spec chưa được phân rã?
3. High-Level Scenarios cho từng section
4. **DỪNG — Chờ user review** danh sách scenarios

**Agent phải thêm:** **Chấm `Risk Level` từng endpoint và chọn độ sâu** theo `test_design_api.md` mục 4, ghi căn cứ, để user duyệt cùng danh sách kịch bản.

**Output:** Traceability Matrix + High-Level Scenarios + mức rủi ro và độ sâu từng endpoint.

## Bước 5: TC Generation

**Agent phải:**
1. Sinh test case với 11 cột theo format API v3, theo độ sâu đã duyệt ở Bước 4
2. Bao phủ đa dạng: Positive / Negative / Boundary / Edge
3. Áp dụng EP+BVA / Decision Table / State Transition theo `test_design_api.md` mục 3
4. **Chạy 8 batch** theo bảng Batch → Section (mục 6.3)
5. Tích hợp Non-Functional (Idempotency, Concurrent, Downstream, Localization, Trim)

**Output:** Danh sách TC chi tiết theo format API v3.

## Bước 6: Template Mapping

**Agent phải:**
1. Chuẩn hóa toàn bộ TC vào bảng 11 cột API
2. Đảm bảo:
   - TC ID theo `<HỆ_THỐNG>_<MODULE>_TC_<nnn>`, không trùng, nối tiếp dải
   - `REQ ID` · `Risk Level` · `Priority` · `Tags` đủ mỗi dòng
   - Test purpose bắt đầu **"Kiểm tra ..."**
   - Test Steps đánh số + `<br>`, Expected khớp cấu trúc 3 phần (Success/Fail + HTTP + Response JSON)
   - **TOC đầu file + Warning box đầu section + Bảng phân biệt error code khi cần**
3. **Ghi file:**
   - `docs/testcases/<module>/api/test_cases_<module>_api.md` — main
   - `docs/testcases/<module>/api/automation_matrix.md`
4. Cập nhật `docs/testcases/README.md` (danh mục)
5. **Chạy Self-Quality Gate 6 tiêu chí** (mục 9)

**Output:** File TC hoàn chỉnh + Automation Matrix + Coverage Report.

---
