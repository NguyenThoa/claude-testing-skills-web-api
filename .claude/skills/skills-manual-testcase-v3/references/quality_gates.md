# Self-Quality Gate, Anti-Patterns, Output

> Chấm trên bộ TC đã ghi file. `Automation` và `Auto Type` trong file này là cột `Automatable` và `Type` của `automation_matrix.md`.

## 🛡️ AI Self-Quality Gate (Quy trình Tự Kiểm Định Chất Lượng)

Trước khi xuất kết quả cuối cùng cho user, Agent **BẮT BUỘC** tự rà soát qua 11 tiêu chí (0–10):
- [ ] **0. Độ hạt nhất quán:** Đã chốt GỘP hay TÁCH **trước** batch đầu và nêu ra chat. Toàn bộ bộ TC theo **một** độ hạt, không nửa gộp nửa tách. Nếu GỘP: mọi biến thể có mã riêng (`a`, `b`…), không TC nào quá 6 biến thể, không TC nào vi phạm bảng CẤM gộp.
- [ ] **1. Unique TC ID:** Đảm bảo không trùng mã TC ID và đúng quy tắc dự án (`PROJECT_MODULE_TC_001`).
- [ ] **2. 1-to-1 Step-Expected Matching:** Các bước `Action` đánh số rõ ràng (1,2,3 — mỗi bước 1 hành động) và khớp 1-1 với `Expected Result` đánh số tương ứng.
- [ ] **3. Concrete Test Data:** 100% test data chứa giá trị cụ thể, không còn từ ngữ mơ hồ ("hợp lệ", "dữ liệu đúng").
- [ ] **4. Field Validation Coverage (đối soát theo BẢNG, không đếm theo số):** với **TỪNG** input field, mở đúng dòng loại field trong **Bảng Field-Level Validation Checklist (15 loại)** và đối soát **đủ từng mục** của dòng đó. Mục nào không áp dụng phải **ghi lý do một dòng**, không được im lặng bỏ qua.
  > 🚨 `≥1 Positive + 2 Negative` là **sàn tối thiểu, KHÔNG phải mức đạt**. Trường Password có 7 mục trong bảng — sinh 3 TC rồi dừng là **trượt tiêu chí này**, dù về số lượng vẫn qua sàn. Đây chính là chỗ bộ TC bị nông mà vẫn xanh hết bảng.
  > Xuất kèm cột đối soát trong **Bảng Đối soát loại kiểm thử** dòng `V2 · Validation`: `đủ N/N mục bảng <loại field>`.
- [ ] **5. Automation Metadata Ready:** 100% test cases được gắn đầy đủ `Automation`, `Auto Type`, và `@Tag`. Cột `Automation` chấm theo [Tiêu chí chấm cột Automation](automation_criteria.md), **không** gắn `Yes` hàng loạt: TC chạm một tính năng ở bảng 3A mà vẫn `Yes` thì cách làm phải nằm trong bảng đó. Index có mục `## Đối soát cột Automation` — mọi TC `Partial` có điều kiện, mọi TC `No` có lý do, điều kiện đã gom thành danh sách cần chuẩn bị, TC vướng tạm thời ghi `⏸️ Hoãn` chứ không hạ cột.
  > Với **DELTA**: chỉ chấm lại TC đã sửa / thêm, cập nhật đúng các dòng đó trong mục đối soát.
- [ ] **6. Requirement Coverage (đối soát "đủ case"):** 100% REQ ID có **≥1 TC** trỏ về; REQ mức High Risk có đủ Positive + Negative + Boundary. Xuất **Bảng Đối Soát Coverage** kèm output:

```markdown
| REQ ID | Mô tả ngắn | Số TC | TC IDs | Đủ Positive/Negative/Boundary? |
|---|---|---|---|---|
| REQ-LOGIN-01 | Đăng nhập email | 5 | TC_001..TC_005 | ✅ |
| REQ-LOGIN-02 | Khóa sau 5 lần sai | 0 | — | 🔴 THIẾU — phải bổ sung trước khi xuất |
| REQ-LOGIN-27 · 40 | Gửi mail đặt lại · tự đăng nhập bằng cookie | 0 | — | ⚪ Ngoài phạm vi — `AMB-LOGIN-04` · `AMB-LOGIN-15` ⏭️, quyết định PO 18-08-2026 |
```
> Nếu có REQ nào 0 TC → agent PHẢI quay lại sinh bổ sung, KHÔNG được xuất kết quả có dòng 🔴.
>
> **Ngoại lệ — requirements đã loại khỏi phạm vi viết TC:** REQ ghi *ngoài phạm vi viết TC / kiểm thử*, REQ 🔴 Deprecated, phần thuộc mục `Ngoài phạm vi` của requirements, hoặc AMB `⏭️` quyết định *"bỏ qua, không viết TC"* / *"chuyển sang module X"* → **không** sinh TC (kể cả TC "cho đủ bảng" hay biến thể lén phủ phần đó), **không** tính 🔴. Ghi dòng `⚪ Ngoài phạm vi` kèm **mã quyết định** ở Bảng Đối Soát Coverage, và dòng *Phạm vi REQ* ở đầu index liệt kê các mã bị loại. Nhánh 4 vòng chỉ vắng vì phần đã loại → `⏭️` dẫn mã quyết định. Đây là nguồn mà `/review-testcases` đọc để **không** báo lại các phần đó thành gap.

  **6b. Phép thử chiều ngược — TC gánh nhiều REQ (BẮT BUỘC chạy, áp cả QUICK · FULL RBT · DELTA · `/generate-testcases-api`):**
  Bảng trên chỉ trả lời *"REQ nào chưa có TC"* — nó **không** bắt được TC gánh quá nhiều REQ. Với **mỗi TC có ≥ 2 REQ ID**, đếm số TC **của cùng nền tảng** trỏ về từng REQ đó:

  | Kết quả đếm trong một TC | Xử lý |
  |---|---|
  | Mọi REQ đều có TC khác chống lưng | ✅ Được giữ |
  | Đúng **1** REQ chỉ có mỗi TC này, các REQ còn lại có TC khác | ✅ Được giữ — FAIL của TC vẫn quy được về REQ đó. Ghi chú ở cột Ghi chú của Bảng Đối Soát Coverage |
  | **≥ 2** REQ chỉ có mỗi TC này | 🔴 **Vi phạm** bảng CẤM gộp (dòng *"Khác REQ ID mà mỗi REQ chỉ có đúng TC đó"*) → **tách**: TC gốc giữ 1 REQ, mỗi REQ còn lại một TC mới **cấp số nối tiếp dải** (không chèn giữa, không đánh lại) |

  > ⚠️ **Hay vi phạm nhất ở TC API**: một request chứng minh được nhiều REQ cùng lúc (VD `POST /api/login` không gửi token → `200` vừa là *"đăng nhập thành công"* vừa là *"đăng nhập không cần token"*). Gộp nghe hợp lý, nhưng khi FAIL không biết REQ nào hỏng, và RTM báo mỗi REQ "đã phủ" dù không TC nào **chỉ** kiểm nó. Mỗi REQ phải có một TC mà **Expected cốt lõi** của nó là đúng REQ đó.
  >
  > **Số TC ít hơn số REQ không phải là lỗi** (1 TC gộp nhiều biến thể, 1 REQ có nhiều TC) — nhưng khi thấy tỉ lệ này, **bắt buộc** chạy phép thử 6b trước khi trả lời user.

  Mẫu kiểm tự động (chạy trên file của **từng** nền tảng):

  ```python
  import glob, re, collections
  R = []
  for f in glob.glob('docs/testcases/<module>/<nền-tảng>/**/*.md', recursive=True):
      for line in open(f, encoding='utf-8'):
          if line.startswith('| <HỆ_THỐNG>_<MODULE>_TC_'):
              c = line.split(' | ')
              R.append((c[0][2:], re.findall(r'REQ-[\w-]+?-(\d+)', c[1])))
  cnt = collections.Counter(q for _, reqs in R for q in reqs)
  print([tc for tc, reqs in R if sum(cnt[q] == 1 for q in reqs) >= 2] or 'không vi phạm')
  ```

- [ ] **7. Evidence-verified:** đã mở **100%** ảnh trong `docs/requirements/<module>/<nền-tảng>/evidence/`; mọi TC thuộc 4 nhóm bắt buộc (bố cục/thứ tự · nhãn nguyên văn · giá trị mặc định · định dạng hiển thị) đều truy được về một tấm ảnh cụ thể **hoặc một lần đọc DOM cụ thể**. TC không truy được → gắn `@NeedsVerify` và liệt kê ở mục "Vùng chưa có evidence". Xuất kèm **Bảng Đối Soát Evidence**:

```markdown
| Ảnh evidence | Màn hình / trạng thái | TC dựa vào | Đầy đủ? |
|---|---|---|---|
| project_new_form_default_fullpage.png | Form tạo — mặc định | TC_041→050 | ✅ full-page |
| project_new_form_1920x1080.png | Form tạo — mặc định | TC_092→095 | 🔴 CẮT CỤT tại "Description" — thiếu editor, checkbox email, nút Save |
| (không có) | Form tạo — dropdown Customer đang mở | TC_060→063 | 🔴 THIẾU — TC gắn @NeedsVerify |
```
> Có dòng 🔴 → **vẫn xuất được** bộ TC, nhưng phải nêu rõ ở tóm tắt cuối và đề xuất recon bổ sung. KHÔNG được im lặng bỏ qua.

- [ ] **8. Ngôn ngữ kiểm chứng (theo **Quy Tắc Ngôn Ngữ Kiểm Chứng**):** grep toàn file, phần TC chính **không còn** `document.`, `querySelector`, `checkValidity`, `offsetParent`, `className`, `getAttribute`, `$(`, `input#`, `[type=`, mã HTTP, tên header, selector CSS/XPath (trừ TC có `Auto Type` = `API`). Mọi nội dung cấp kỹ thuật còn lại nằm dưới `🔧 Ghi chú kỹ thuật (cần DevTools):` và TC đó mang tag `@TechCheck`. **Phép thử cuối:** che hết dòng `🔧 Ghi chú kỹ thuật` → mọi TC vẫn chạy và chấm PASS/FAIL được.

- [ ] **9. Rà soát đặc tính chất lượng (ISO/IEC 25010:2023)** — áp dụng **QUICK · FULL RBT · DELTA**, KHÔNG áp dụng CHECKLIST: đã chấm đủ **9/9 đặc tính**, không ô nào trống. Ô `➖` có ghi **ai chịu trách nhiệm** (không chỉ ghi "ngoài phạm vi" trơn). Ô 🔴 phải bổ sung TC **trước khi xuất**. Bảng rà soát đặt ở cuối tài liệu TC.
  > Với **DELTA**: chỉ chấm lại đặc tính bị ticket chạm tới, giữ nguyên phần còn lại của bảng — không rà lại cả module.

- [ ] **10. Đối soát loại kiểm thử 4 vòng** (theo **Bản Đồ Loại Kiểm Thử — 4 Vòng**) — áp dụng **QUICK · FULL RBT · DELTA**, KHÔNG áp dụng CHECKLIST:
  - Đã chấm **mọi nhánh** của cả 4 vòng, không ô nào trống. Xuất **Bảng Đối soát loại kiểm thử** đặt cuối tài liệu TC, **trước** bảng ISO 25010
  - Ô `➖` ghi **lý do kỹ thuật**; ô `⏭️` ghi **lý do + ai quyết định + điều kiện rà lại**; ô 🔴 phải bổ sung TC **trước khi xuất**
  - **`➖` và `⏭️` không được dùng lẫn** — `➖` là sự thật kỹ thuật (hệ thống không có cái đó), `⏭️` là quyết định chấp nhận rủi ro. Ghi `➖` cho thứ thật ra là `⏭️` là **giấu quyết định**
  - Mức rủi ro đã chấm và **độ sâu tương ứng** (Đầy đủ / Tiêu chuẩn / Tối giản) phải ghi ở đầu tài liệu TC, kèm dòng **"Nâng lên khi…"**
  - **Ba nhánh không bao giờ được `➖`:** `UI cơ bản` (V1) · `Validation` (V2, khi có field nhập) · `Permission` (V3, khi có ≥2 role)
  - Độ hạt **GỘP** → cột dẫn chứng ghi **cả số TC và số biến thể**: `TC_001–TC_003 (3 TC · 11 biến thể)`. Thiếu số biến thể = không kiểm chứng được gộp có làm rụng case hay không
  > Với **DELTA**: chỉ chấm lại nhánh bị ticket chạm tới, giữ nguyên phần còn lại của bảng.

---

## Anti-Patterns riêng của format v3

### Về format bảng TC
- ❌ Thiếu cột trong 10 cột, đổi tên cột, hoặc nhét `Automatable` · `Auto Type` vào bảng chính
- ❌ Bỏ trống `REQ ID`, `Risk Level`, `Priority`; dùng `Priority` khác `P1` · `P2` · `P3`; dùng `Risk Level` khác `High` · `Medium` · `Low`
- ❌ Nhầm `Risk Level` với `Priority` hoặc Severity của bug
- ❌ `Test Summary` không bắt đầu bằng "Kiểm tra"
- ❌ Dồn dữ liệu test vào `Action` thay vì cột `Test Data`
- ❌ Thêm lại cột `Description` (chú thích ghi `⚠️` ở cuối `Expected Result`)
- ❌ TC ID theo số mục (VD `2.1.5`), đánh lại số khi chèn TC, hoặc xoá dòng TC
- ❌ Không có khối "Pre-condition chung" đầu file, lặp đầy đủ pre-condition ở mỗi TC

### Về Expected Result và test basis
- ❌ Hạ Expected Result theo hành vi hiện tại của app khi requirement đã duyệt nói khác
- ❌ Thấy tài liệu và ảnh mâu thuẫn nhưng tự chọn một bên rồi im lặng
- ❌ Viết Expected Result không kiểm chứng được ("hiển thị đúng", "hoạt động bình thường")

### Về Q&A (FULL RBT)
- ❌ Gộp nhiều bước chạy 1 lần trong FULL RBT (PHẢI tuần tự)
- ❌ Tự đoán business logic khi chưa hỏi (Bước 2)
- ❌ Bỏ qua bước phân tích Ambiguity
- ❌ Chạy tiếp khi câu blocker chưa được BA trả lời
- ❌ Ghi `ASM-<MODULE>-nn` cho câu blocker (chỉ non-blocker mới được ASM)
- ❌ **KHÔNG xuất file `rbt_step_01_context.md` ở Bước 1** — user cần file để forward BA/PO review scope offline
- ❌ **KHÔNG xuất file `rbt_step_02_ambiguity_qna.md` ở Bước 2** — user cần file để forward BA/PO điền câu trả lời offline
- ❌ Chỉ hiện Q&A trong chat mà không ghi ra file (BA/PO không dùng Claude Code, không đọc được chat)

### Về cấu trúc file
- ❌ Ghi test cases theo batch (VD "Batch 1: Validation") thay vì theo chức năng (I.1 → I.10)
- ❌ Dồn validate của mọi form vào 1 mega-section validation
- ❌ Chia sub-section quá 3 tầng (VD `I.2.1.1` là heading)
- ❌ Gộp "Luồng thất bại nghiệp vụ" với "Ngoại lệ UI" vào 1 section
- ❌ Bỏ cross-cutting Phân quyền/Session/Ngoại lệ chung cuối file
- ❌ Bỏ TC empty state (0 dữ liệu, tenant mới)
- ❌ Bỏ TC XSS + SQL injection cho searchbox/text public-facing
- ❌ Bỏ section Đồng bộ API khi module nhận data từ API bên ngoài

### Về test data & step
- ❌ Action viết đoạn văn không đánh số / gộp nhiều hành động vào 1 số
- ❌ Test data mơ hồ ("hợp lệ", "đúng") không có giá trị cụ thể
- ❌ Gộp validation nhiều field vào 1 TC (mỗi field phải có TC validation riêng)
- ❌ Dùng chung 1 bộ validation cho tất cả fields (Email ≠ Phone ≠ Date ≠ Text)
- ❌ Không liệt kê danh sách fields trước khi sinh validation TCs
- ❌ Có ≥3 điều kiện kết hợp nhưng không lập Decision Table
- ❌ Có status flow nhưng không lập bảng State Transition

### Về Expected Result đa cấp
- ❌ Gộp toàn bộ kết quả vào 1 cấp `1., 2., 3.` — khi có nhiều chi tiết bắt buộc dùng sub-item `-` và sub-sub `+`
- ❌ Dồn nhiều thông tin vào 1 dòng main dạng đoạn văn dài ("Lưu thành công, popup đóng, message X, bản ghi mới với Mã/Tên/Trạng thái đúng") — phải tách xuống sub-item để reader thấy cấu trúc
- ❌ Nhảy cấp — có `-` mà không có Main `1.`, hoặc có `+` mà không có Sub `-`
- ❌ Dùng ký hiệu khác thay `-` cho sub-item (VD `*`, `·`, `→`) hoặc khác `+` cho sub-sub — phải nhất quán trong toàn bộ file

## Anti-Patterns (NGHIÊM CẤM — áp dụng cho cả 4 modes)

- ❌ Gộp nhiều bước chạy 1 lần trong FULL RBT (PHẢI tuần tự)
- ❌ Tự đoán business logic khi chưa hỏi user (Bước 2 - FULL RBT)
- ❌ Bỏ qua bước phân tích Ambiguity (FULL RBT)
- ❌ Sinh test data chung chung / placeholder
- ❌ Rút gọn hoặc bỏ sót test case khi mapping sang bảng
- ❌ Sinh tất cả test cases 1 lần cho hệ thống lớn (phải chia module)
- ❌ Chỉ có Happy Path, thiếu Negative/Boundary cases (QUICK)
- ❌ Action mơ hồ, không ghi rõ dữ liệu nhập
- ❌ Gộp validation của **các trường khác nhau** vào 1 test case → FAIL không chỉ ra được trường nào hỏng
- ❌ Dùng chung 1 bộ validation cho tất cả fields (Email ≠ Phone ≠ Date ≠ Text)
- ❌ **Ghi dòng TC đầu tiên khi chưa chốt độ hạt GỘP/TÁCH** và chưa nêu ra chat
- ❌ Gộp mà **cắt bớt biến thể** — gộp là đổi cách trình bày, bỏ case là giảm độ phủ
- ❌ Gộp mà biến thể **không có mã riêng** (`a`, `b`, `c`…) → báo cáo FAIL không truy được về case nào
- ❌ Gộp TC `@Smoke` / `P1`, hoặc gộp TC được thiết kế để FAIL (mỗi cái gắn 1 bug riêng)
- ❌ Gộp các biến thể **khác loại phản hồi** (trình duyệt chặn với máy chủ báo lỗi; lỗi với thành công)
- ❌ Nhồi **quá 6 biến thể** vào một TC → ô bảng không ai đọc nổi, phải tách theo nhóm rủi ro
- ❌ **Đổi độ hạt của bộ TC đã có script / execution report / RTM trỏ vào** — cắt cả ba mối nối cùng lúc. Cần gọn thì sinh checklist, giữ nguyên bộ TC
- ❌ Bỏ qua security validation (XSS, SQL injection) cho text/textarea fields
- ❌ Không liệt kê danh sách fields trước khi sinh validation TCs
- ❌ Xuất TC không có cột `REQ ID` hoặc có REQ 0 TC mà không bổ sung (vi phạm tiêu chí 6 Quality Gate)
- ❌ Action viết đoạn văn liền không đánh số, hoặc gộp nhiều hành động vào 1 số
- ❌ Chỉ test form input mà bỏ qua Table/List, CRUD lifecycle, Permission, Status flow (Component-Level Checklist)
- ❌ Có ≥3 điều kiện kết hợp nhưng không lập Decision Table; có status flow nhưng không lập bảng State Transition
- ❌ QUICK mode đoán ngầm khi requirement mơ hồ mà không ghi vào mục Assumptions
- ❌ CHECKLIST mode viết mục thành test case có steps đánh số (nhầm mode — cần steps thì dùng QUICK/FULL)
- ❌ CHECKLIST mode viết mục mơ hồ kiểu "Kiểm tra chức năng hoạt động đúng" (không verify được)
- ❌ CHECKLIST mode liệt kê hết 15 loại validation cho mọi field → checklist phình to, mất tác dụng rà nhanh
- ❌ Checklist Smoke vượt 20 mục hoặc Release-readiness vượt 60 mục mà không tách module
- ❌ Xuất checklist thiếu cột `Trạng thái` / `Execution ID` hoặc thiếu bảng ký nhận (môi trường/build/người chạy)
- ❌ Ô `Trạng thái` khác `☐` mà không có `Execution ID` trỏ tới report thật — trạng thái bịa
- ❌ Sinh checklist mới trong khi đã có bộ TC chi tiết mà không rút gọn từ bộ TC đó (gây lệch nội dung)
- ❌ In toàn bộ bảng TC ra chat rồi mới ghi file (vi phạm Write-first — user chờ render 2 lần)
- ❌ Tách bộ TC mới thành nhiều file `parts/`, hoặc gộp nhiều module vào 1 file. 1 module × 1 nền tảng = 1 file
- ❌ Không sinh file index → không đối soát được coverage toàn module
- ❌ Dừng hỏi "có tiếp tục không" sau mỗi batch (đã chốt: chạy thẳng, chỉ báo tiến độ)
- ❌ Sinh >30 TC mà không tạo `task.md` / task list → user không theo dõi được tiến độ
- ❌ **Ghi dòng TC đầu tiên khi chưa mở hết ảnh trong `evidence/`** — lỗi gốc gây bịa bố cục/nhãn/mặc định
- ❌ Viết Expected Result khẳng định chắc chắn về thứ tự Tab, vị trí phần tử, nhãn nút, định dạng hiển thị khi **không nhìn thấy trong ảnh** mà không gắn `@NeedsVerify`
- ❌ Thấy tài liệu và ảnh mâu thuẫn nhưng **tự chọn một bên rồi im lặng** — phân loại theo bảng ở `evidence_and_language.md` mục 2: hành vi, quy tắc, thông báo đã có trong requirement đã duyệt → viết theo requirement, thêm `⚠️ Lệch với app`, `@NeedsVerify`, `AMB-<MODULE>-nn`; chỉ trình bày, hoặc tài liệu không đề cập → viết theo ảnh, thêm `ASM-<MODULE>-nn`; luôn báo user
- ❌ Đọc checkbox **xám mờ (disabled)** thành "không tick" — bỏ sót nguyên một business rule phụ thuộc
- ❌ Xuất bộ TC mà không kèm **Bảng Đối Soát Evidence** (tiêu chí 7 Quality Gate)
- ❌ Sinh TC cho đủ 9 ô của bảng đặc tính chất lượng — đặc tính không áp dụng thì chấm `➖` kèm lý do, TC lấp bảng là TC rác
- ❌ Chấm `➖ Ngoài phạm vi` trơn, không ghi **ai chịu trách nhiệm** — mất luôn giá trị của bảng khi đưa sang Master Test Plan mục 2.2
- ❌ **Chạy QUICK/FULL RBT sinh lại cả module đã có file TC** — sinh bộ thứ hai, TC ID đánh lại từ `001`, vỡ truy vết sang automation. REQ chưa có TC thì dùng chế độ **BỔ SUNG** (`SKILL.md` Bước 0), REQ đã đổi thì dùng Mode DELTA
- ❌ DELTA sinh lại cả file/module TC thay vì sửa đúng dòng bị ảnh hưởng
- ❌ DELTA đổi TC ID, đánh lại số, hoặc chèn số mới vào giữa dải đang dùng
- ❌ DELTA xoá dòng TC của chức năng bị gỡ (phải gắn tag `@Deprecated` + tiền tố `🗑️ Deprecated (<mã ticket>, <ngày>) —` ở `Test Summary`)
- ❌ Đánh dấu Deprecated **chỉ bằng chữ** mà không gắn tag `@Deprecated` — `/execute-test-cases`, RTM và Bảng Đối Soát Coverage lọc theo tag, thiếu tag thì TC của chức năng đã gỡ vẫn bị đem ra chạy và vẫn được đếm là đang phủ REQ
- ❌ DELTA sinh file `_improved` / `_v2` / `_new` hoặc thư mục `archive/` — index có tên bất biến, bản cũ nằm trong git
- ❌ DELTA sửa tại chỗ mà **không ghi mốc git**, hoặc sửa đè lên thay đổi chưa commit
- ❌ DELTA sửa TC theo suy đoán từ tên TC, không đọc nội dung REQ sau khi đổi
- ❌ DELTA tự viết TC cho REQ mới (🟢) — ngoài phạm vi, phải route sang QUICK / FULL RBT
- ❌ DELTA bỏ qua tác động lan toả (TC dùng field ở bước phụ · TC lấy TC vừa Deprecated làm precondition)
- ❌ DELTA xong mà không ghi **Nhật ký thay đổi** và không ghi **Delta TC List** — tầng automation mất input
- ❌ **Delta TC List chỉ nằm trong chat** — tầng automation thường chạy ở phiên khác, đóng phiên là mất. Phải ghi file `impact/delta_tc_<TICKET-ID>.md`
- ❌ **Delta TC List thiếu cột Nền tảng** — dải TC ID chung toàn module nên nhìn mã không biết TC thuộc web hay API; automation không biết sửa ở project nào
- ❌ **Bỏ TC `@NeedsVerify` khỏi Delta TC List** — automation tưởng TC không bị ảnh hưởng. Ghi dòng `⏸️ chưa sửa` để automation biết mà không chạm
- ❌ **Ghi Delta TC List ở Mode PLAN** — kế hoạch chưa duyệt có thể bị gạch bớt; automation chỉ được đọc thứ đã thật sự sửa
- ❌ **Bộ TC không có nhánh `UI cơ bản`** — không TC nào kiểm nhãn nguyên văn, thứ tự field, trạng thái mặc định của màn hình. Validation đầy đủ đến đâu cũng vẫn là thiếu hẳn một lớp
- ❌ **Nhảy cóc vòng** — sinh validation (V2) trước khi có TC mở form và lưu được (V1). V1 fail thì mọi TC V2 đều BLOCKED, chạy hết mới biết là quá muộn
- ❌ **Trộn TC của hai vòng vào một batch** — mất ranh giới chia việc và không chấm được bảng đối soát
- ❌ **Đọc lướt bảng 15 loại field rồi sinh 2–3 TC cho xong** — Password có 7 mục, Email có 9 mục; sinh 3 TC là trượt Gate #4 dù vẫn qua sàn `1 positive + 2 negative`
- ❌ **Chấm `➖` cho `UI cơ bản` / `Validation` / `Permission`** — ba nhánh này không bao giờ ngoài phạm vi khi điều kiện kích hoạt đã thoả
- ❌ **Ghi `➖` trơn không lý do, không tên người/đội chịu trách nhiệm** — biến "đã thống nhất không test" thành "QA quên test", đúng thứ bảng này sinh ra để chống
- ❌ **Hỏi lại user về quyền API / CSDL / nhật ký ở từng module** — đó là thuộc tính cấp dự án, đọc dòng `Năng lực kiểm thử của QA` ở `docs/requirements/README.md`; chưa có thì hỏi **một lần** rồi ghi vào đó ngay
- ❌ **Chạy đủ 4 vòng cho chức năng rủi ro Thấp** — bơm 50 TC cho một trang tĩnh chỉ hiển thị là lãng phí công viết, công chạy, công bảo trì, và làm loãng bộ TC thật. Chấm mức rủi ro trước, chọn độ sâu tương ứng
- ❌ **Rút gọn bằng cách bỏ Vòng 1** — V1 là thứ duy nhất trả lời "chức năng này có chạy được không". Rủi ro Thấp vẫn phải đủ 6 nhánh V1
- ❌ **Chấm `Thấp` cho chức năng có field nhập** — có ô nhập là có người nhập sai. Thiếu một trong bốn điều kiện là không được chấm Thấp
- ❌ **Dùng `➖` thay cho `⏭️`** — `➖` nghĩa là hệ thống không có thứ đó, `⏭️` nghĩa là có nhưng cố ý không kiểm. Ghi nhầm là **giấu một quyết định chấp nhận rủi ro**
- ❌ **Ghi `⏭️` mà không có điều kiện rà lại** — quyết định rút gọn phải **tự hết hạn** khi chức năng lớn lên, nếu không nó thành lỗ hổng bị quên vĩnh viễn
- ❌ **Sinh TC chỉ để lấp ô bảng 4 vòng** — TC rác làm loãng bộ TC thật, vi phạm đúng luật đã áp cho bảng ISO 25010
- ❌ **Gộp mà không công bố số biến thể** — Bảng Đối Soát Coverage đếm theo REQ nên không bắt được việc rụng biến thể
- ❌ **DELTA sửa xong Vòng 2 rồi dừng** — ticket thêm field mà chỉ sửa TC validation, quên cập nhật bảng kiểm thành phần màn hình ở `V1 · UI cơ bản`. Bộ TC thành ra mô tả một màn hình không còn tồn tại
- ❌ **DELTA rà lại toàn bộ bảng 4 vòng của cả module** — chỉ chấm lại nhánh ticket chạm tới; rà cả module là làm việc của `/generate-testcases-manual-rbt` và dễ kéo theo sửa ngoài phạm vi đã duyệt

---

## Output Format

### Mode QUICK

| Output | Mô tả |
|--------|--------|
| Mục Assumptions | Các giả định đã áp dụng khi requirement mơ hồ (ASM-<MODULE>-nn) — gồm cả xung đột tài liệu ↔ evidence |
| Bảng TC Markdown | Test Cases đầy đủ (có cột REQ ID), sẵn sàng copy sang Excel/Jira |
| Bảng Đối Soát Coverage | Mỗi REQ ID × số TC × đủ Positive/Negative/Boundary (tiêu chí 6) |
| **Bảng Đối Soát Evidence** | Mỗi ảnh × màn hình/trạng thái × TC dựa vào × đầy đủ hay cắt cụt (tiêu chí 7) |
| **Vùng chưa có evidence** | Danh sách màn hình/trạng thái không có ảnh chống lưng + TC bị gắn `@NeedsVerify` |
| **Bảng Đối soát loại kiểm thử (4 vòng)** | Mọi nhánh của V1–V4 × ✅/➖/⏭️/🔴 × TC ID (kèm số biến thể nếu GỘP) hoặc lý do (➖) · lý do + ai quyết + điều kiện rà lại (⏭️) (tiêu chí 10) |
| **Bảng rà soát đặc tính chất lượng** | 9 đặc tính ISO/IEC 25010:2023 × ✅/➖/🔴 × TC ID hoặc lý do (tiêu chí 9) |
| **Đối soát cột Automation** | Đếm Yes/Partial/No/⏸️ Hoãn theo nền tảng + điều kiện cần chuẩn bị + TC Partial/No/Hoãn kèm lý do (tiêu chí 5) |

### Mode FULL RBT

| Bước | Output |
|------|--------|
| 1 | Xác nhận bối cảnh + **Danh mục Evidence đã mở** |
| 2 | Luồng + Ambiguities + Câu hỏi Q&A (gồm xung đột tài liệu ↔ evidence) |
| 3 | Module Decomposition + Dependencies |
| 4 | Traceability Matrix + High-Level Scenarios **xếp theo 4 vòng** (mỗi nhánh chấm sơ bộ ✅/➖/⏭️) + **mức rủi ro · độ sâu** từng Module |
| 5 | Test Cases chi tiết (REQ ID + Risk Level + Test Data), sinh **tuần tự V1 → V4** |
| 6 | Bảng Markdown chuẩn (Jira/Excel ready) + Bảng Đối Soát Coverage + **Bảng Đối Soát Evidence** + **Bảng Đối soát loại kiểm thử (4 vòng)** + **Bảng rà soát đặc tính chất lượng (ISO/IEC 25010:2023)** + **Đối soát cột Automation** |

### Mode CHECKLIST

| Output | Mô tả |
|--------|--------|
| Header checklist | Loại checklist + module + số mục + thời gian chạy ước tính + **Mã checklist** + dòng **Trạng thái lấy từ** |
| Bảng Checklist | Nhóm theo Module → Nhóm chức năng, có cột `Trạng thái` (`☐` hoặc kết quả đã chạy), Priority, REQ ID, TC ID liên quan, `Execution ID` — Release-readiness thêm cột `Module` |
| Ghi chú "Không áp dụng" | Component có trong bảng chuẩn nhưng module không có → nêu rõ, không bỏ im lặng |
| Bảng ký nhận | Môi trường · Build/Version · Người thực hiện · Ngày · Kết quả |

> **Nơi ghi file — nhánh `docs/checklists/`, có tầng nền tảng như `testcases/`:**
>
> | Loại | Đường dẫn |
> |---|---|
> | Smoke · Regression (module) | `docs/checklists/<module>/<nền-tảng>/checklist_<loại>_<YYYYMMDD>.md` |
> | Post-hotfix | `docs/checklists/<module>/<nền-tảng>/checklist_post-hotfix_<TICKET-ID>.md` — gắn với bản vá, hai hotfix cùng ngày không đè nhau |
> | Release-readiness (cắt ngang nhiều module) | `docs/checklists/_release/<nền-tảng>/checklist_release_<mốc>.md` — `<mốc>` cùng slug với `docs/test-plans/test_plan_<mốc>.md`. Đợt release có nhiều nền tảng → **mỗi nền tảng một file**, vì mỗi lần chạy thuộc đúng một nền tảng |
>
> `_release/` đóng vai **module giả** cho mọi nhánh phía sau (`executions/_release/<nền-tảng>/`) — dấu `_` đầu = không phải module, workflow quét module bỏ qua. `<loại>` viết thường: `smoke` · `regression` · `post-hotfix` · `release`. Checklist là **ảnh chụp tại một thời điểm**, không sửa tại chỗ như bộ TC: lần rà mới sinh file mới theo ngày/ticket/mốc. Cùng ngày chạy lại đúng loại đó → ghi đè file của ngày đó (chưa ai tick). Nguồn TC-based **bỏ qua TC `@Deprecated`**.
>
> 📄 **Checklist là tài liệu đọc/in trực tiếp, KHÔNG nạp vào `scripts/testcases-viewer`.** Viewer đó chỉ đọc bảng test case chi tiết (`test_cases_*.md`); checklist cố tình không có `Action` / `Test Data` / `Risk Level` nên nạp vào chỉ ra bảng rỗng. Vì vậy header checklist **được phép** đặt Tiếng Việt cho người tick tay (`Hạng mục kiểm tra`, `Kết quả kỳ vọng`, `TC ID liên quan`) — nó không chịu hợp đồng đọc của viewer như bảng TC.

### Mode DELTA

| Output | Mô tả |
|--------|--------|
| `impact/impact_plan_<TICKET-ID>.md` | Bảng ánh xạ REQ → TC (✅ chắc chắn / ⚠️ suy luận / ❓ chưa có TC) + kế hoạch sửa từng TC + tác động lan toả |
| File nền tảng đã sửa (+ index cập nhật) | Sửa **tại chỗ**, tên file không đổi, TC ID giữ nguyên |
| Mốc git trước khi sửa | Hash commit của từng file nền tảng — ghi ở Nhật ký và `delta_tc_` để đối chiếu |
| **Bảng Đối soát loại kiểm thử (4 vòng)** | Cập nhật **chỉ nhánh ticket chạm tới** ở cuối index — phần còn lại giữ nguyên |
| **Đối soát cột Automation** | Chấm lại cột `Automation` của TC đã sửa / thêm, cập nhật đúng các dòng đó trong mục đối soát của index |
| Nhật ký thay đổi | Bảng ở cuối file TC: ngày · ticket · TC bị ảnh hưởng · **vòng · nhánh** · thay đổi · mốc git |
| **`impact/delta_tc_<TICKET-ID>.md`** | Delta TC List — **chỉ ghi ở APPLY**, cột **Nền tảng** + **Vòng · Nhánh** + hành động `✏️` / `➕` / `🗑️` / `⏸️`, ghi mốc git từng nền tảng. Input **bắt buộc** của `/update-automation-from-impact`; chat chỉ hiện tóm tắt + đường dẫn. Mẫu đầy đủ ở workflow `/update-testcases-from-impact` Bước 6 |
| Danh sách ngoài phạm vi | REQ 🟢 chưa có TC + workflow tiếp theo |

Tất cả output phải bằng **Tiếng Việt**, format **Markdown**, và tuân thủ **Quy Tắc Xuất File & Theo Dõi Tiến Độ**: ghi thẳng vào file (`docs/testcases/` hoặc `docs/checklists/`), chat chỉ hiện tiến độ + Bảng Đối Soát Coverage + tóm tắt đường dẫn file.

