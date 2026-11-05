# 🎯 MODE 2: FULL RBT — 6 Bước Có Q&A

## Mục đích

Quy trình bài bản, tuần tự cho module phức tạp. Bao gồm Ambiguity analysis, module decomposition, Traceability Matrix, sinh TC chi tiết.

> ⚠️ **BẮT BUỘC chạy tuần tự** từng bước. KHÔNG gộp nhiều bước 1 lần. Mỗi bước phải hoàn thành + user xác nhận trước khi qua bước sau.
>
> **KHÔNG BỎ BƯỚC NÀO. KHÔNG TỰ QUYẾT ĐỊNH THAY CÂU TRẢ LỜI BA.**

---

### Bước 1: Context & Role-play (Khởi tạo ngữ cảnh)

**Mục đích:** Thiết lập vai trò Senior QA Engineer và nạp bối cảnh dự án.

**Agent phải:**
1. Yêu cầu user cung cấp:
   - Tên dự án / tính năng
   - Mô tả hệ thống hiện tại
   - Mục tiêu kiểm thử MVP
   - Tài liệu yêu cầu (Requirements, User Stories, Figma, PDF...)
2. Đọc kỹ tài liệu, xác nhận đã hiểu bối cảnh
3. **Mở evidence** — Liệt kê `docs/requirements/<module>/web/evidence/`, `Read` từng ảnh, ghi Danh mục Evidence (đủ / cắt cụt / thiếu)
4. Tóm tắt scope kiểm thử
5. **XUẤT FILE `rbt_step_01_context.md`** (BẮT BUỘC — để user gửi BA/PO review):
   - Path: `docs/requirements/<module>/analysis/rbt_step_01_context.md`
   - Nội dung: bối cảnh dự án · scope kiểm thử · Danh mục Evidence · câu hỏi context cần confirm (nếu có)
   - Format Markdown, tiếng Việt, có bảng đánh dấu điểm cần BA/PO xác nhận
6. **DỪNG — Chờ user xác nhận** trước khi sang Bước 2 (user có thể forward file cho BA/PO offline)

**Output:**
- File `docs/requirements/<module>/analysis/rbt_step_01_context.md` (BA/PO đọc & xác nhận)
- Chat: link file + tóm tắt scope + Danh mục Evidence ngắn

**Template `rbt_step_01_context.md`:**

```markdown
# Bước 1 — Context & Scope | Module <Tên module>

> **Ngày:** DD-MM-YYYY · **Người phân tích:** AI Agent (skills-manual-testcase-v3)
> **File dành cho:** BA / PO / QA Lead review & xác nhận trước khi sinh test case
> **Trạng thái:** ⏳ Chờ xác nhận

## 1. Bối cảnh dự án
- **Tên dự án:** ...
- **Module:** ...
- **Mục tiêu MVP:** ...
- **Hệ thống hiện tại (nếu có):** ...

## 2. Nguồn tài liệu
| Loại | Đường dẫn / Tham chiếu |
|---|---|
| Requirement | Jira `<TICKET-ID>` (qua `jira-cybertech`) · [Confluence pageId XXXX](...) |
| User Story | ... |
| Figma / Mockup | ... |

## 3. Scope kiểm thử
### Trong scope
- ...

### Ngoài scope
- ...

## 4. Danh mục Evidence

| Ảnh | Màn hình / Trạng thái | Đầy đủ? | Ghi chú |
|---|---|---|---|
| `E01_list_page.png` | Danh sách - default | ✅ | full-page |
| `E02_add_popup_1920.png` | Popup Thêm mới | 🔴 CẮT CỤT | thiếu nút Save phía dưới |
| (không có) | Popup xác nhận Xóa | 🔴 THIẾU | cần recon bổ sung |

## 5. Câu hỏi context cần BA/PO xác nhận (nếu có)
> Chỉ liệt kê câu liên quan phạm vi / mục tiêu / hệ thống. Câu về logic nghiệp vụ → Bước 2.

| # | Câu hỏi | Trả lời của BA |
|---|---|---|
| C1 | Module này có phải là MVP release đầu tiên hay đã có version cũ? | ⏳ |
| C2 | Có phụ thuộc module nào khác không (VD Customer, Permission)? | ⏳ |

## 6. Xác nhận
- [ ] BA/PO đã xem file này
- [ ] Scope đúng, không thiếu tính năng
- [ ] Evidence đã đầy đủ (hoặc đã note các vùng thiếu)
- [ ] Có thể chuyển sang Bước 2 (Analysis & Q&A)

**Ký xác nhận:** ______  **Ngày:** ______
```

---

### Bước 2: Analysis & QnA (Phân tích yêu cầu) — 🔴 QUAN TRỌNG NHẤT

**Mục đích:** Phân tích tài liệu để phát hiện điểm mờ, mâu thuẫn, thiếu sót.

**Agent phải:**

1. **Xác định các luồng:**
   - Happy Path
   - Alternate Paths (luồng rẽ nhánh)
   - Exception Paths (luồng ngoại lệ)

2. **Phát hiện Ambiguities:**
   - Requirement thiếu (không quy định max length, timeout, hành vi mất mạng...)
   - Requirement mâu thuẫn
   - Requirement chưa rõ ràng
   - **Xung đột tài liệu ↔ evidence** — bắt buộc đưa vào Q&A

3. **Đặt câu hỏi Q&A — agent TỰ SINH từ requirement + evidence, KHÔNG dùng template cứng**

   Agent đọc kỹ requirement/user story/evidence rồi tự sinh câu hỏi. Không có danh sách 10 câu bắt buộc — mỗi module ngữ cảnh khác nhau, câu hỏi phải bám vào module đó.

   **Nguồn để sinh câu hỏi (agent bắt buộc rà soát đủ):**
   - Ambiguities `AMB-<MODULE>-nn` phát hiện được trong requirement
   - Xung đột tài liệu ↔ evidence (VD tài liệu ghi "5 status" nhưng ảnh chỉ thấy 3)
   - Vùng requirement mô tả bằng chữ nhưng không có evidence chống lưng
   - Rule nghiệp vụ nhắc mờ nhạt (VD "check permission" mà không nói role nào có gì)
   - Field validate không quy định rõ (max length, format, unique, required)
   - Trạng thái + state transition (khi entity có ≥3 trạng thái)
   - Cấu hình hệ thống chạm tới module (timeout, page size, browser, tenant scope)

   **Đánh số Q1, Q2, ... theo thứ tự phát hiện.** Mỗi câu kèm:
   - Ngữ cảnh (đoạn requirement hoặc `AMB-<MODULE>-nn` liên quan)
   - Ảnh hưởng nếu không trả lời (số TC bị sai, loại TC bị chặn)
   - Đề xuất default nếu là non-blocker

4. **Agent TỰ PHÂN LOẠI mỗi câu — Blocker hay Non-blocker:**

   | Loại | Định nghĩa | Xử lý khi user không trả lời |
   |---|---|---|
   | 🔴 **Blocker** | Không có câu trả lời thì **sai hàng loạt TC** — VD: business logic, permission matrix, state transition rule, validate rule của field required, format hiển thị field quan trọng, xung đột doc↔evidence chưa gỡ | **BẮT BUỘC chờ trả lời**. Không được ghi ASM. Nếu BA chưa trả lời được → dừng skill, thông báo user rõ đang chờ câu nào |
   | 🟡 **Non-blocker** | Có default hợp lý, không trả lời vẫn sinh được TC — VD: session timeout, page size mặc định, browser support, export Excel yes/no, cosmetic UX | Nhắc lại 1 lần. Nếu vẫn không có → **ghi `ASM-<MODULE>-nn` với default** và chạy tiếp |

   Agent phải **đánh dấu rõ 🔴/🟡 vào từng câu hỏi** khi trình cho user, để user biết câu nào bắt buộc trả lời.

5. **XUẤT FILE `rbt_step_02_ambiguity_qna.md`** (BẮT BUỘC — để user forward BA/PO trả lời):
   - Path: `docs/requirements/<module>/analysis/rbt_step_02_ambiguity_qna.md`
   - Nội dung: Danh sách luồng · Ambiguities `AMB-<MODULE>-nn` · Q&A đánh số Q1..QN đánh dấu 🔴/🟡 · chừa cột "Trả lời của BA" để BA điền
   - Format Markdown, tiếng Việt, mỗi Q1 kèm ngữ cảnh + ảnh hưởng + đề xuất default (non-blocker)

6. **DỪNG LẠI — Chờ user/BA trả lời** trước khi qua Bước 3. User có thể forward file cho BA/PO offline; sau khi BA điền xong, user gửi lại cho agent để tổng hợp.

**Output:**
- File `docs/requirements/<module>/analysis/rbt_step_02_ambiguity_qna.md` (BA/PO điền câu trả lời)
- Chat: link file + tóm tắt số câu 🔴/🟡 + tóm tắt Ambiguities cần chú ý

**Template `rbt_step_02_ambiguity_qna.md`:**

```markdown
# Bước 2 — Analysis & Q&A | Module <Tên module>

> **Ngày:** DD-MM-YYYY · **Người phân tích:** AI Agent (skills-manual-testcase-v3)
> **File dành cho:** BA / PO / Dev Lead trả lời câu hỏi trước khi sinh test case
> **Trạng thái:** ⏳ Chờ BA trả lời
> **Ghi chú cho BA:** Câu 🔴 Blocker BẮT BUỘC trả lời (không có thì không sinh TC được). Câu 🟡 Non-blocker nếu không trả lời sẽ dùng default đề xuất.

## 1. Các luồng đã xác định
### Happy Path
- ...

### Alternate Paths
- ...

### Exception Paths
- ...

## 2. Ambiguities đã phát hiện

| Mã | Điểm mờ / mâu thuẫn | Nguồn | Q liên quan |
|---|---|---|---|
| AMB-CUST-01 | Requirement ghi "5 status" nhưng ảnh chỉ thấy 3 | requirements.md L45 vs E02.png | Q3 |
| AMB-CUST-02 | Không quy định max length của trường Mô tả | - | Q7 |

## 3. Câu hỏi Q&A (BA/PO điền cột "Trả lời")

| # | Loại | Câu hỏi | Ngữ cảnh | Ảnh hưởng nếu không trả lời | Default đề xuất | Trả lời của BA |
|---|---|---|---|---|---|---|
| Q1 | 🔴 Blocker | Ma trận role × action (view/add/edit/delete/toggle) của module? | AMB-CUST-01, section 3.2 requirement | Không viết được I.7 Phân quyền (~15 TC) | - | ⏳ |
| Q2 | 🔴 Blocker | Enum trạng thái đầy đủ + rule chuyển trạng thái? | E02.png chỉ thấy 3 status, doc ghi 5 | Sai bảng I.5 State Transition (~10 TC) | - | ⏳ |
| Q3 | 🟡 Non-blocker | Session timeout cấu hình bao nhiêu phút? | - | Sai I.8 Session (~3 TC) | 30 phút idle | ⏳ |
| Q4 | 🟡 Non-blocker | Max length của trường Mô tả? | AMB-CUST-02 | Validate boundary sai | 500 ký tự | ⏳ |

## 4. Xung đột tài liệu ↔ evidence (nếu có)

| Điểm | Tài liệu ghi | Ảnh cho thấy | Xử lý |
|---|---|---|---|
| Status enum | 5 status | 3 status (E02.png) | Chờ Q2 |

## 5. Xác nhận
- [ ] BA/PO đã điền 100% câu 🔴 Blocker
- [ ] Đã confirm xung đột tài liệu ↔ evidence (nếu có)
- [ ] Câu 🟡 Non-blocker: điền hoặc để agent dùng default
- [ ] Có thể chuyển sang Bước 3 (Decomposition)

**Ký xác nhận:** ______  **Ngày:** ______
```

> [!IMPORTANT]
> **Đây là điểm nghẽn quan trọng nhất.** Nếu agent bỏ qua bước này và tự đoán logic, TC sẽ sai nghiêm trọng. Agent PHẢI dừng lại và đợi user phản hồi cho câu blocker.

---

### Bước 3: Decomposition (Phân rã hệ thống)

**Mục đích:** Chia tính năng phức tạp thành các Module / Sub-module nhỏ, dễ quản lý.

**Agent phải:**
1. Phân rã theo 1 trong 2 cách:
   - **Theo UI:** Header, Data Table, Form popup, Sidebar...
   - **Theo luồng:** Flow tạo mới, Flow chỉnh sửa, Flow xóa...
2. Mô tả ngắn gọn chức năng từng Module
3. Chỉ ra Dependencies giữa các Module

**Output:** Danh sách Modules/Sub-modules + Dependencies.

---

### Bước 4: Traceability (Đảm bảo độ bao phủ)

**Mục đích:** Thiết lập ma trận truy vết để đảm bảo 100% requirements được phủ test scenarios.

**Agent phải:**
1. Map mỗi Module/Rule với mã Yêu cầu (REQ-01, REQ-02...)
2. Cross-check xem có yêu cầu nào bị thiếu trong danh sách phân rã (Gap Analysis)
3. Liệt kê High-Level Test Summarys cho từng Module, **xếp theo 4 vòng** (xem **Bản Đồ Loại Kiểm Thử — 4 Vòng**):
   - **V1 Smoke:** giao diện cơ bản · mở form · hiển thị · nhập hợp lệ · lưu · đối chiếu dữ liệu
   - **V2 Functional:** hành vi giao diện · bắt buộc · validation · EP · BVA · quy tắc nghiệp vụ · bảng quyết định · chuyển trạng thái · phụ thuộc · kịch bản nghiệp vụ · CRUD · đoán lỗi
   - **V3 Technical:** phân quyền · bảo mật · API · CSDL · tích hợp · nhật ký
   - **V4 Non-functional:** tương thích · đáp ứng · bàn phím/trợ năng · hiệu năng · hồi quy · xuyên module
   > Chấm sơ bộ mỗi nhánh `✅ sẽ sinh` / `➖ không áp dụng (lý do kỹ thuật)` / `⏭️ cố ý bỏ (lý do + ai quyết + điều kiện rà lại)` **ngay ở bước này** — đây là lúc user review rẻ nhất, trước khi sinh TC chi tiết.
4. **Chấm mức rủi ro từng Module** theo bảng tiêu chí mục **Độ sâu theo rủi ro** — agent tự chấm, ghi căn cứ, KHÔNG hỏi user — rồi nêu **độ sâu tương ứng** (Đầy đủ / Tiêu chuẩn / Tối giản) kèm số TC ước tính. Chấm ở bước này để user phủ quyết ngay tại checkpoint, không phải sau khi đã sinh xong
5. **Chờ user review** danh sách scenarios, bảng 4 vòng và mức rủi ro trước khi sinh test case chi tiết

**Output:** Traceability Matrix + High-Level Test Summarys + mức rủi ro · độ sâu từng Module.

---

### Bước 5: RBT & TC Generation (Sinh Test Case chi tiết)

**Mục đích:** Sinh test cases chi tiết theo chiến lược Risk-Based Testing.

**Agent phải:**
1. Áp **mức rủi ro đã được user duyệt ở Bước 4** (user sửa mức nào thì theo mức user sửa) — mức rủi ro quyết định độ sâu:
   - **Cao** → độ sâu **Đầy đủ**: đủ mọi nhánh của cả 4 vòng (40–60 TC)
   - **Trung bình** → độ sâu **Tiêu chuẩn**: V1 + V2 đủ, V3 giới hạn ở `Permission`/`Security`, V4 giới hạn ở `Responsive`/`Accessibility` (20–30 TC)
   - **Thấp** → độ sâu **Tối giản**: V1 đủ 6 nhánh (**không rút**), V2 chỉ nhánh có ràng buộc thật, V3/V4 phần lớn `⏭️` (8–12 TC)
   > ⚠️ Lưỡng lự về tác động thì chấm **mức cao hơn**; hạ khả năng lỗi phải có bằng chứng. Hơn khoảng 50% module ra Cao thì báo và xếp hạng lại tại checkpoint. Bốn thứ không bao giờ rút: toàn bộ V1 · `Required`+`Validation` khi có field nhập · `Permission` khi ≥2 vai trò · `Security` khi chạm dữ liệu người dùng khác.
2. Sinh test case với đầy đủ fields:
   - Module / Sub-module
   - **REQ ID** (mã requirement mà TC cover — lấy từ Traceability Matrix ở Bước 4)
   - Test Summary
   - Pre-condition
   - Action (**đánh số 1,2,3 — mỗi bước 1 hành động**, theo Quy Tắc Trình Bày Action)
   - Expected Results (đánh số khớp 1-1 với steps)
   - Test Data (**phải cụ thể**, không dùng placeholder chung chung)
   - Priority
3. **Sinh tuần tự theo 4 vòng** — V1 Smoke → V2 Functional → V3 Technical → V4 Non-functional. Mỗi batch **nằm trọn trong một vòng**, không trộn vòng.
   Vòng 1 luôn mở đầu bằng nhánh `UI cơ bản` (nhãn nguyên văn · thứ tự field · trạng thái mặc định) — đây là lớp bị bỏ sót nhiều nhất.
   Bao phủ đa dạng trong từng vòng:
   - Happy Path
   - Negative Path (giá trị biên, vượt ký tự)
   - Edge Cases (timeout, mất kết nối...)
4. **Áp dụng kỹ thuật theo Quy Tắc Bắt Buộc:** EP+BVA cho field có ràng buộc; **Decision Table** khi ≥3 điều kiện kết hợp; **State Transition** khi có status flow (xem section Quy Tắc Bắt Buộc Áp Dụng Kỹ Thuật)
5. **Validation chuyên biệt từng trường (Field-Level Validation):**
   - Liệt kê **tất cả input fields** trên form/UI đang test
   - Sinh validation TCs **riêng cho TỪNG trường** theo đặc tính riêng (15 loại input field types)
   - **KHÔNG** gộp validation của **các trường khác nhau** vào 1 TC — biến thể **cùng một trường** thì gộp theo độ hạt đã chốt (xem mục Độ Hạt Test Case)
6. **Bao phủ Component-Level Checklist:** Data Table/List, CRUD Lifecycle, Permission/Role (đối chiếu Ma trận Phân quyền), Modal/Dialog, Notification, Status Flow (đối chiếu Ma trận Trạng thái)
7. **Tích hợp Scenarios Chuyên Sâu & Non-Functional:** Race Condition/Double Submit, Session/Network Resilience, Localization/UTF-8/Emoji, Keyboard Accessibility (A11y), HTTP Status Codes.
8. Nếu scenarios quá nhiều → chia batch theo **Module → Vòng**, sinh lần lượt từng Module nhưng **chạy thẳng hết** theo Quy Tắc Xuất File mục 3 — KHÔNG dừng hỏi giữa các batch. Checkpoint của FULL RBT chỉ nằm ở Bước 2 và Bước 4

**Output:** Danh sách Test Cases chi tiết có Risk Level.

---

### Bước 6: Đóng gói & Quality Gate

**Mục đích:** Ghi bộ TC hoàn chỉnh và tự kiểm định trước khi bàn giao.

**Agent phải:**
1. Rà bảng 10 cột theo `format_v3.md`: TC ID không trùng và nối tiếp số lớn nhất của module · `REQ ID`, `Risk Level`, `Priority` đủ mỗi dòng · `Action` khớp `Test Data` và `Expected Result` · **không bỏ sót** TC nào đã sinh ở Bước 5.
2. Ghi file theo `output_files.md`:
   - `docs/testcases/<module>/<nền-tảng>/test_cases_<module>_<nền-tảng>.md`
   - `docs/testcases/<module>/<nền-tảng>/automation_matrix.md`, chấm theo `automation_criteria.md`
   - `docs/testcases/<module>/TEST_CASES_<TÊN_MODULE>_SUMMARY.md`, gồm Bản đồ tài liệu, Bảng Đối Soát Coverage, Nhật ký thay đổi có mốc git
3. Cập nhật danh mục `docs/testcases/README.md`.
4. Chạy Self-Quality Gate (`quality_gates.md`), xuất các bảng đối soát, báo rõ phần chưa đạt.

**Output:** File TC + Automation Matrix + index + các bảng đối soát.
