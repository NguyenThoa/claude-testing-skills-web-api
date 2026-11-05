# 🚀 MODE 1: QUICK — Sinh 1 lượt, ghi Assumptions

## Mục đích

Sinh testcase **nhanh, đủ chất lượng** cho API đã có spec rõ. KHÔNG dừng hỏi Q&A, mọi điểm mơ hồ agent phải ghi `ASM-XX`.

## Quy trình (1 lượt duy nhất)

1. **Đọc spec API** — Swagger/OpenAPI / tài liệu Confluence / postman collection
2. **Đọc evidence** — nếu có response mẫu, log thực tế, screenshot Postman
3. **Ghi nhận Assumptions** — mục đầu output cho các điểm mơ hồ (`ASM-XX`)
4. **Xác định các thành phần API:**
   - Endpoint URL + Method + Content-Type
   - Required headers (auth, tracing)
   - Request body schema (fields + types + constraints)
   - Response schema (success + error variants)
   - Business flow (sync vs async)
   - Downstream dependencies
4b. **Chấm `Risk Level` từng endpoint và chọn độ sâu** theo `test_design_api.md` mục 4, ghi căn cứ vào dòng kế hoạch. User phủ quyết tại đây.
5. **Áp dụng kỹ thuật thiết kế** theo `test_design_api.md` mục 3:
   - **EP + BVA** cho mọi field có min/max/format
   - **Decision Table** khi có ≥3 điều kiện kết hợp
   - **State Transition** khi API async (WAITING → COMPLETED/REJECTED/EXPIRED/FAILED)
6. **Bao phủ theo độ sâu đã chọn ở bước 4b.** Loại nào thuộc section mà `Risk Level` yêu cầu thì sinh, phần rút ghi `⏭️` kèm căn cứ. 4 thứ không bao giờ rút vẫn phải có:
   - ✅ **Happy Path** — Request hợp lệ, response đúng schema + status code (Section E1)
   - ❌ **Negative — Validation** — Thiếu required fields, sai data type, vượt max length (Section A)
   - ❌ **Negative — Auth** — Không có token, token hết hạn, token sai role (Section D)
   - 🔲 **Boundary** — Min/max values, empty string, null, special characters (Section A + E2)
   - ⚡ **Edge Cases** — Concurrent requests, duplicate creation, large payload, Unicode/emoji (Section E4 + F)
   - 🔒 **Security** — SQL injection, XSS, IDOR, Mass Assignment, ReDoS, sensitive data exposure (Section H OWASP + D2/D3)
   - 📄 **Pagination & Filtering** — Phân trang, sắp xếp, tìm kiếm (Section E6, chỉ GET List)
7. **Chạy batch** theo các section đã chọn, thứ tự A → K (mục 6.3)
8. **Tích hợp Non-Functional** (khi thuộc độ sâu đã chọn):
   - Idempotency (VD X-Request-Id duplicate)
   - Concurrent transaction
   - Downstream failure (F)
   - Localization/Unicode (E4)
   - Trim (E5)
   - Rate limiting 429 (F + Section H)
9. **Xuất bảng Markdown 11 cột** theo format API v3 (`format_api.md` mục 1), đủ `REQ ID` · `Risk Level` · `Priority` · `Tags` mỗi dòng
10. **Chạy Self-Quality Gate 6 tiêu chí** (mục 9)

## Output QUICK

| Output | Nội dung |
|---|---|
| Mục Assumptions | `ASM-XX` — giả định đã áp dụng |
| File `docs/testcases/<module>/api/test_cases_<module>_api.md` | Bảng TC 11 cột API + TOC + Warning box + phân biệt error code |
| File `automation_matrix.md` | Metadata automation (Automatable, Type, Tag, Priority) |
| Bảng Đối Soát Coverage | Mỗi section × số TC × đủ Positive/Negative/Boundary/Edge |

---
