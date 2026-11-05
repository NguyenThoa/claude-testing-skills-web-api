# Kỹ Thuật Thiết Kế Kiểm Thử — Bám ISTQB CTFL v4.0

> File này bám nội dung syllabus ISTQB CTFL v4.0, diễn giải theo thực tế dự án. Đây không phải chứng nhận tuân thủ, và số mục có thể cần đối chiếu lại khi syllabus đổi phiên bản.

## 1. Quy trình và testware

| Hoạt động (CTFL 1.4) | Câu hỏi phải trả lời | Testware trong dự án |
|---|---|---|
| Test analysis | Cần test **cái gì**? Test basis có lỗi không? | `AMB-*`, Q&A, danh sách luồng |
| Test design | Test **như thế nào**, phủ đến đâu? | Bảng Decision Table, State Transition, test case mức cao, bảng 4 vòng |
| Test implementation | Có **đủ để chạy** chưa? | File TC 10 cột, dữ liệu, `Tags`, `automation_matrix.md` |
| Truy vết (CTFL 1.4.4) | REQ nào đã phủ, TC nào mồ côi? | `REQ ID`, Bảng Đối Soát Coverage, RTM |

Tìm ra lỗi trong requirement ở bước phân tích là **kết quả kiểm thử có giá trị** (kiểm thử sớm, CTFL 1.3), không phải vật cản phải vượt qua.

## 2. Chọn kỹ thuật

| Nhóm (CTFL 4.2–4.5) | Kỹ thuật | Bắt buộc khi | Tiêu chí phủ |
|---|---|---|---|
| Hộp đen | **Equivalence Partitioning** | Field có miền giá trị phân nhóm được | Mọi partition, cả hợp lệ và không hợp lệ, có ≥ 1 TC |
| Hộp đen | **Boundary Value Analysis** | Field có min/max | Rủi ro `Low` · `Medium`: BVA 2 giá trị (`min-1` · `min` · `max` · `max+1`). Rủi ro `High`: BVA 3 giá trị (thêm `min+1` · `max-1`) |
| Hộp đen | **Decision Table** | ≥ 3 điều kiện kết hợp cho một kết quả | Mọi cột khả thi. > 20 tổ hợp: rút gọn pairwise và ghi lý do |
| Hộp đen | **State Transition** | Entity có ≥ 3 trạng thái hoặc có status flow | Mọi chuyển đổi hợp lệ. Rủi ro `High`: thêm mọi chuyển đổi không hợp lệ phải bị chặn |
| Dựa trên kinh nghiệm | **Error Guessing** | Luôn luôn | Danh sách lỗi hay gặp ở `Scenarios Chuyên Sâu` và bug cũ của module |
| Dựa trên kinh nghiệm | **Exploratory** | Rủi ro `High` hoặc requirement yếu | Đề xuất session có charter, thời lượng, người chạy; không thay thế TC |
| Dựa trên kinh nghiệm | **Checklist-based** | Smoke, hotfix, release | Mode CHECKLIST |
| Dựa trên phối hợp | **User story, tiêu chí chấp nhận** | Nguồn là ticket | Mỗi tiêu chí chấp nhận có ≥ 1 TC; tiêu chí không kiểm chứng được phải thành `AMB` |
| Hộp trắng | Statement, branch | **Không thuộc manual TC** | Thuộc unit test của dev; ghi ở phần ngoài phạm vi |

## 3. Loại kiểm thử

| CTFL 2.2 | Trong 4 vòng |
|---|---|
| Functional testing | V1, V2 |
| Non-functional (ISO/IEC 25010) | V4, và `Security` ở V3 |
| Confirmation testing | `/retest-fixed-bugs` |
| Regression testing | Nhánh `Regression` ở V4 — mỗi bug đã đóng có 1 TC chống tái phát, trỏ về mã bug; chọn phạm vi bằng `/select-regression-tests` |

## 4. Kinh nghiệm thực tế khi áp dụng

- **Expected Result phải kiểm chứng được và đến từ test basis.** "Hiển thị đúng", "hoạt động bình thường" không phải là kết quả mong đợi.
- **Mỗi TC chứng minh một mục tiêu.** Fail thì phải biết ngay cái gì hỏng.
- **TC độc lập:** không phụ thuộc kết quả TC khác. Dữ liệu cần có đưa vào `Pre-condition`.
- **Dữ liệu cụ thể nhưng không phải dữ liệu thật của khách hàng.**
- **Phủ 100% REQ không có nghĩa là đủ.** Soát thêm bảng 4 vòng, ISO/IEC 25010, và chiều ngược: một TC không được là chỗ dựa duy nhất của nhiều REQ.
- **Không đếm TC để đo chất lượng.** Nhiều TC trùng lặp làm tăng chi phí bảo trì và làm loãng kết quả.
- **Người viết không tự duyệt.** Bộ TC rủi ro `High` nên qua `/review-testcases` hoặc một reviewer độc lập.

---

## Bảng Field-Level Validation Checklist (15 Field Types)

Khi form/UI có các input fields, agent **BẮT BUỘC** phải liệt kê từng trường và sinh validation TCs riêng theo loại:

| Loại Field | Validation cần test |
|---|---|
| **Text (Name, Address...)** | Required/Optional · Min/Max length · Whitespace-only · Ký tự đặc biệt (`<>&"'`) · XSS injection (`<script>alert(1)</script>`) · SQL injection (`' OR 1=1--`) · Unicode/Emoji · Leading/trailing spaces |
| **Email** | Format hợp lệ (`user@domain.com`) · Thiếu `@` · Thiếu domain · Domain không hợp lệ · Nhiều `@` · Ký tự đặc biệt trước `@` · Max length · Case sensitivity · Email đã tồn tại (nếu unique) |
| **Phone** | Chỉ số · Prefix hợp lệ (ví dụ: `+84`, `0`) · Min/Max length · Chữ cái xen lẫn · Dấu `-`, `.`, khoảng trắng · Mã vùng không hợp lệ |
| **Date / DateTime** | Format đúng (dd/MM/yyyy, ISO...) · Ngày không tồn tại (`31/02`, `30/02`) · Năm nhuận (`29/02/2024`) · Quá khứ / tương lai · Min/max date · Timezone |
| **Number / Currency** | Min/Max value · Số âm · Số 0 · Số thập phân · Ký tự không phải số · Overflow · Leading zeros · Định dạng currency |
| **Dropdown / Select** | Giá trị mặc định · Tất cả options hợp lệ · Option disabled · Thay đổi selection · Required validation |
| **Checkbox / Radio** | Trạng thái mặc định · Check/Uncheck · Required validation · Nhóm radio (chỉ chọn 1) |
| **File Upload** | File type hợp lệ/không hợp lệ · Max size · File rỗng (0 KB) · Tên file ký tự đặc biệt · Multiple files · Kéo thả vs nút chọn |
| **Password** | Min/Max length · Yêu cầu ký tự đặc biệt · Yêu cầu chữ hoa/thường · Yêu cầu số · Copy-paste bị chặn? · Hiện/ẩn password · Confirm password khớp/không khớp |
| **Textarea** | Max length · Line breaks · HTML tags · Resize (nếu UI cho phép) · Character counter (nếu có) |
| **OTP / MFA Code** | Auto-focus ô tiếp theo · Paste chuỗi OTP · Hết hạn timeout · Vượt số lần nhập sai (retry limit/lockout) · Re-send OTP rate limit |
| **Date Range / Time Picker** | Ngày kết thúc < Ngày bắt đầu · Khung giờ trùng lặp (time conflict) · Giới hạn khoảng ngày (VD: max 30 ngày) · Quá khứ/Tương lai restriction |
| **Rich Text Editor (WYSIWYG)** | Sanitize HTML tags nguy hiểm (`<script>`, `<iframe>`) · Paste văn bản kèm format/ảnh · Character counter tính theo text thô vs HTML markup |
| **Multi-Select / Tag Input** | Giới hạn số lượng tag · Tag trùng lặp · Xóa tag bằng Backspace/nút X · Tag có ký tự đặc biệt |
| **Range Slider / Stepper** | Giới hạn min/max · Bước nhảy (step increment violation) · Nhập tay trực tiếp so với kéo slider |

### Template TC cho Text field có max = N

| # | `Test Summary` mẫu |
|---|---|
| 1 | `Kiểm tra validate <Trường> - nhập <= N ký tự (positive)` |
| 2 | `Kiểm tra validate <Trường> - nhập > N ký tự (max negative)` |
| 3 | `Kiểm tra validate <Trường> - nhập đúng N ký tự (boundary)` |
| 4 | `Kiểm tra validate <Trường> - bỏ trống` (nếu required) |
| 5 | `Kiểm tra validate <Trường> - chỉ toàn khoảng trắng` |
| 6 | `Kiểm tra validate <Trường> - có khoảng trắng đầu cuối (trim)` |
| 7 | `Kiểm tra unique <Trường>` (nếu required unique) |

Email · Phone · URL bổ sung: `format hợp lệ` (3–5 mẫu) + `format sai` (5–8 mẫu).

## Bảng Component-Level Checklist (Ngoài form input — BẮT BUỘC rà soát)

Form input chỉ là một phần của app. Khi module có các thành phần sau, agent **BẮT BUỘC** sinh TCs theo checklist tương ứng:

| Component | Checklist cần test |
|---|---|
| **Giao diện tĩnh của màn hình** | Đủ thành phần theo evidence (nhãn nguyên văn, thứ tự field, nút, liên kết, tiêu đề) · trạng thái mặc định từng ô (rỗng / tick sẵn / option đang chọn) · con trỏ đang ở ô nào khi vừa mở · định dạng hiển thị (tiền tệ, ngày, giờ, badge) · trạng thái rỗng · trạng thái đang tải · văn bản gợi ý trong ô (placeholder) · tooltip |
| **Data Table / List** | Sort từng cột (asc/desc) · Filter đơn + kết hợp nhiều filter · Search (khớp một phần, không dấu/có dấu, không có kết quả) · Pagination (trang đầu/cuối, đổi page size, nhảy trang) · Empty state (chưa có data) · Danh sách lớn (100+ bản ghi) · Bulk action (chọn tất cả, chọn một phần, thao tác hàng loạt) · Refresh giữ/mất filter đang áp |
| **CRUD Lifecycle** | Create → hiển thị đúng trong list · View detail khớp data đã tạo · Edit → lưu → verify data cập nhật (cả trong list và detail) · Delete → confirm dialog (Cancel giữ nguyên / OK xóa) · Xóa bản ghi đang được liên kết (foreign key) · Tạo trùng unique field · Edit đồng thời 2 người (concurrent) |
| **Permission / Role** | Đối chiếu **Ma trận Phân quyền** trong requirements: mỗi role × mỗi hành động = 1 TC · Truy cập URL trực tiếp khi không có quyền (bypass UI) · Element ẩn/disable đúng theo role · API trả 403 khi gọi trái quyền |
| **Modal / Dialog** | Mở/đóng bằng nút X, nút Cancel, phím ESC, click ra ngoài · Data trong modal reset hay giữ khi mở lại · Submit trong modal lỗi → modal không đóng, hiện lỗi · Nhiều modal chồng nhau (nếu có) |
| **Notification / Toast** | Nội dung đúng theo từng hành động · Tự đóng sau timeout / đóng tay · Nhiều notification liên tiếp · Toast lỗi khác toast thành công (màu/icon) |
| **Trạng thái (Status Flow)** | Đối chiếu **Ma trận Trạng thái** trong requirements: mỗi transition hợp lệ = 1 TC · Mỗi transition KHÔNG hợp lệ = 1 TC (verify bị chặn) · Hành động cho phép/khóa theo từng trạng thái |

> Component nào không có trong module → ghi chú "Không áp dụng" trong phần tổng kết coverage, KHÔNG lặng lẽ bỏ qua.

---

## Quy Tắc Bắt Buộc Áp Dụng Kỹ Thuật Thiết Kế (Khi nào PHẢI dùng)

Agent không được chỉ "nhắc tên" kỹ thuật — phải áp dụng theo điều kiện kích hoạt:

| Kỹ thuật | Điều kiện BẮT BUỘC áp dụng | Cách làm |
|---|---|---|
| **EP + BVA** | Mọi field có ràng buộc min/max/format | Mỗi partition ≥1 TC; biên test tại `min-1, min, max, max+1` |
| **Decision Table** | Có **≥3 điều kiện kết hợp** ảnh hưởng đến 1 output (VD: loại KH × hạn mức × trạng thái → được duyệt?) | Lập bảng đầy đủ tổ hợp → mỗi rule (cột) = 1 TC. Nếu >20 tổ hợp → dùng pairwise và ghi chú lý do rút gọn |
| **State Transition** | Entity có **≥3 trạng thái** hoặc có status flow (Draft → Pending → Approved...) | Vẽ bảng transition → TC cho mọi transition hợp lệ + TC verify mọi transition không hợp lệ bị chặn |

**Ví dụ Decision Table (3 điều kiện → 1 output):**

```markdown
| Rule | Loại KH = VIP | Đơn > 10 triệu | Có mã giảm giá | → Giảm giá |
|---|---|---|---|---|
| R1 | Yes | Yes | Yes | 20% |
| R2 | Yes | Yes | No  | 15% |
| R3 | Yes | No  | -   | 10% |
| R4 | No  | Yes | Yes | 10% |
| R5 | No  | No  | No  | 0%  |
→ Mỗi rule R1-R5 = 1 TC với test data cụ thể
```

**Ví dụ State Transition (đơn hàng):**

```markdown
| Từ \ Đến | Pending | Confirmed | Shipped | Cancelled |
|---|---|---|---|---|
| Draft     | ✅ TC_x | ❌ TC_y (verify chặn) | ❌ | ✅ |
| Pending   | -       | ✅ | ❌ | ✅ |
| Confirmed | ❌      | -  | ✅ | ❌ (verify chặn) |
→ Mỗi ô ✅ và ❌ đều là 1 TC
```

---

## Rà Soát Đặc Tính Chất Lượng — ISO/IEC 25010:2023 (chống bỏ sót loại test)

> **Mục đích:** trả lời câu hỏi *"bộ TC này có bỏ sót loại kiểm thử nào không"* bằng một khung có tên gọi chung, thay vì cảm tính. Chạy **một lượt ở cuối**, sau khi đã sinh xong TC — **không** dùng làm khung sinh TC.

ISO/IEC 25010:2023 (Product quality model) có **9 đặc tính**. So với bản 2011 quen thuộc: `Usability` → **Interaction Capability**, `Portability` → **Flexibility**, và thêm mới **Safety**.

| # | Đặc tính | Đặc tính con chính | QA chức năng làm được gì bằng manual TC | Nếu ngoài phạm vi |
|---|---|---|---|---|
| 1 | **Functional Suitability**<br>Phù hợp chức năng | Completeness · Correctness · Appropriateness | ⭐ **Phần chính của mọi bộ TC** — đã phủ qua Positive/Negative/Boundary | Không bao giờ ngoài phạm vi |
| 2 | **Performance Efficiency**<br>Hiệu quả hiệu năng | Time behaviour · Resource utilization · Capacity | Chỉ quan sát được mức thô: trang tải quá lâu, danh sách 1000 dòng bị treo | Đội hiệu năng / công cụ tải — ghi vào mục 2.2 Master Test Plan |
| 3 | **Compatibility**<br>Tương thích | Co-existence · Interoperability | Đa trình duyệt · đa độ phân giải · import/export đúng định dạng · tích hợp bên thứ ba | Ghi rõ trình duyệt/thiết bị nào **không** kiểm |
| 4 | **Interaction Capability**<br>Khả năng tương tác (bản 2011: Usability) | Learnability · Operability · **User error protection** · Inclusivity · User assistance | ⭐ Làm được nhiều: thông báo lỗi có dễ hiểu không · chặn thao tác sai · điều hướng bàn phím · nhãn/tooltip · trạng thái rỗng | A11y chuyên sâu (WCAG đầy đủ) cần công cụ riêng |
| 5 | **Reliability**<br>Tin cậy | Faultlessness · Availability · Fault tolerance · **Recoverability** | Mất mạng giữa chừng · session hết hạn · submit lại sau lỗi · dữ liệu có mất không sau khi khôi phục | Đo uptime/MTBF thuộc vận hành |
| 6 | **Security**<br>An toàn thông tin | Confidentiality · Integrity · Authenticity · **Accountability** · Resistance | Phân quyền theo role · truy cập URL trực tiếp khi chưa đăng nhập · dữ liệu người này có lộ sang người kia không · nhật ký thao tác | Pentest, quét lỗ hổng — **luôn** ghi rõ ai làm |
| 7 | **Maintainability**<br>Bảo trì | Modularity · Reusability · Analysability · Modifiability · Testability | 🚫 **Không kiểm được bằng manual TC** — đây là đặc tính của mã nguồn | Code review / static analysis — không thuộc QA chức năng |
| 8 | **Flexibility**<br>Linh hoạt (bản 2011: Portability) | Adaptability · **Scalability** · Installability · Replaceability | Responsive trên nhiều kích thước màn hình · cài đặt/nâng cấp · đổi ngôn ngữ, múi giờ, đơn vị tiền | Scalability hạ tầng thuộc đội vận hành |
| 9 | **Safety**<br>An toàn (mới ở bản 2023) | Operational constraint · Fail safe · **Hazard warning** | Chỉ áp dụng cho hệ thống mà lỗi gây thiệt hại thật (y tế, tài chính, thiết bị): có cảnh báo trước thao tác không hồi lại được không · có xác nhận trước khi xoá/chuyển tiền không | ➖ Không áp dụng với đa số app nghiệp vụ thông thường |

### Cách dùng — 3 quy tắc

1. **Chấm từng đặc tính, không bỏ trống ô nào:** `✅ Có TC` (dẫn TC ID) · `➖ Ngoài phạm vi` (**phải ghi ai chịu trách nhiệm**) · `🔴 Thiếu` (phải bổ sung trước khi xuất).
2. 🚫 **KHÔNG sinh TC cho đủ 9 ô.** Đặc tính không áp dụng với module này thì chấm `➖` kèm lý do — TC sinh ra chỉ để lấp bảng là TC rác, và nó làm loãng bộ TC thật.
3. **Ô `➖` là dữ liệu đầu vào cho `/generate-master-test-plan` mục 2.2 (Ngoài phạm vi).** Đây là giá trị lớn nhất của bảng này: biến "QA quên test" thành "đã xem xét và thống nhất không test" — hai chuyện hoàn toàn khác nhau khi có sự cố production.

### Bảng xuất kèm output (đặt cuối tài liệu TC)

```markdown
## Rà soát đặc tính chất lượng (ISO/IEC 25010:2023)

| Đặc tính | Trạng thái | TC ID / Lý do |
|---|---|---|
| Functional Suitability | ✅ Có TC | TC_001–TC_048 |
| Performance Efficiency | ➖ Ngoài phạm vi | Không có công cụ tải — đội Hạ tầng, đợt sau |
| Compatibility | ✅ Có TC | TC_049–TC_052 (Chrome, Edge, 1366×768) |
| Interaction Capability | ✅ Có TC | TC_053–TC_060 (thông báo lỗi, điều hướng bàn phím, trạng thái rỗng) |
| Reliability | 🔴 Thiếu | Chưa có TC session hết hạn giữa chừng khi điền form → **bổ sung trước khi xuất** |
| Security | ✅ Có TC | TC_061–TC_070 (phân quyền 3 role, truy cập URL trực tiếp) |
| Maintainability | ➖ Không áp dụng | Đặc tính của mã nguồn, không kiểm bằng manual TC |
| Flexibility | ✅ Có TC | TC_071–TC_074 (responsive 1366/1920, đổi ngôn ngữ) |
| Safety | ➖ Không áp dụng | App nghiệp vụ, lỗi không gây thiệt hại vật lý |
```

> ⚠️ Ghi **tên đặc tính** theo chuẩn, **KHÔNG ghi số điều khoản**. Và **không** tuyên bố *"tuân thủ ISO/IEC 25010"* — câu đúng là *"rà soát theo mô hình chất lượng ISO/IEC 25010:2023"*.

---

## Scenarios Chuyên Sâu & Non-Functional Checklist (Áp dụng nâng cao)

> Đây là phần **chi tiết hoá** của bảng đặc tính bên trên — 5 nhóm dưới đây map lần lượt vào Functional Suitability (1), Reliability (5), Interaction Capability (4) và Flexibility (8).

Agent phải tích hợp thêm các tình huống kiểm thử nâng cao khi phân tích module:

1. **Race Condition & Double Submit:**
   - Double click liên tiếp nút Save/Submit (ngăn tạo 2 bản ghi trùng)
   - Concurrent editing: 2 tabs/users cùng sửa 1 bản ghi đồng thời
2. **Session & Network Resilience:**
   - Session timeout / Token hết hạn giữa chừng khi đang điền form
   - Network interruption (mất mạng khi submit payload, slow 3G timeout, retry logic)
3. **Localization & UTF-8 / Emoji:**
   - Nhập tiếng Việt đầy đủ dấu (`Tiếng Việt có dấu phức tạp ỨỜÁ...`)
   - Nhập emoji (`😀🎉🚀`) và ký tự đa ngôn ngữ (RTL, tiếng Trung, Nhật, Ả Rập)
4. **Keyboard Accessibility (A11y):**
   - Điều hướng bằng phím `Tab` theo thứ tự hợp lý, kích hoạt bằng `Enter`/`Space`
   - Hiển thị viền focus state rõ ràng
5. **HTTP Status Codes (Cho API Test Cases):**
   - Assert đầy đủ các status codes tiêu chuẩn: `200/201 Success`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`, `422 Unprocessable Entity`, `429 Rate Limit`, `500/503 Server Error`.

---

