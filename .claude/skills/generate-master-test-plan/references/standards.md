## Chuẩn tham chiếu — vì sao cần và ghi thế nào

Template bám khung **Test Plan** của **ISO/IEC/IEEE 29119-3** (chuẩn hiện hành về tài liệu kiểm thử, thay thế họ IEEE 829 — bản 829-2008 đã bị thay thế, *superseded*) và phủ đủ **nội dung điển hình của test plan** mà **ISTQB CTFL v4.0** liệt kê ở mục *5.1.1 Purpose and Content of a Test Plan*. Nhiều khách hàng Nhật/Mỹ vẫn quen **khung Test Plan 16 mục của IEEE 829-1998** — nên plan ánh xạ sang **cả ba**.

**Mục đích:** khi nghiệm thu hợp đồng, audit, hoặc người duyệt có chứng chỉ ISTQB hỏi *"plan này theo chuẩn nào, có thiếu mục nào không"* — trả lời bằng một trang.

### Ba nguồn có bản chất khác nhau — ghi đúng quan hệ

| Nguồn | Bản chất | Câu được phép viết trong plan |
|---|---|---|
| **ISO/IEC/IEEE 29119-3** | Chuẩn tài liệu kiểm thử | *"Biên soạn **theo cấu trúc** ISO/IEC/IEEE 29119-3 — Test Plan"* |
| **ISTQB CTFL v4.0** | **Giáo trình** chứng chỉ, liệt kê *"typical content"* kèm *"e.g."* — không phải chuẩn để tuyên bố tuân thủ. Chính giáo trình trỏ sang 29119-3 để xem chi tiết | *"Phủ đủ nội dung điển hình của test plan theo ISTQB CTFL v4.0, mục 5.1.1"* |
| **IEEE 829-1998** | Chuẩn cũ, đã bị thay thế | *"Ánh xạ sang khung Test Plan của IEEE 829-1998 để tham khảo"* |

> ⚠️ **KHÔNG** viết *"tuân thủ ISO/IEC/IEEE 29119"* hay *"đạt chuẩn ISTQB"*. Tuân thủ là kết luận của đánh giá viên; ISTQB không cấp chứng nhận cho tài liệu.

### Nội dung điển hình theo ISTQB CTFL v4.0 — mục 5.1.1 (nguyên văn giáo trình)

Đã đối chiếu với bản giáo trình **v4.0 phát hành 21-04-2023**. Mọi dòng dưới đây **phải có mục tương ứng** trong plan:

| ISTQB CTFL v4.0 — 5.1.1 | Mục trong plan |
|---|---|
| Context of testing — scope · test objectives · constraints · test basis | 2.1 · 2.2 · 1.1 · 2.3 · 1.2 |
| Assumptions and constraints of the test project | 2.3 |
| Stakeholders — roles · responsibilities · relevance to testing · hiring and training needs | 2.4 · 6 |
| Communication — forms and frequency of communication · documentation templates | 2.4 |
| Risk register — product risks · project risks | 8.2 · 8.1 |
| Test approach — test levels · test types · test techniques · test deliverables · entry criteria and exit criteria · independence of testing · metrics to be collected · test data requirements · test environment requirements · deviations from the organizational test policy and test strategy | 3.1 · 3.2 (+ 3.2.1 phi chức năng) · 3.3 · 10 · 4.1–4.2 · 3.4 · 3.6 · 5.2 · 5.1 · 12.2 |
| Budget and schedule | 7.3 · 7.1 · 7.2 |

Các điểm của **mục 5.1.3 Entry Criteria and Exit Criteria** được đưa vào template:
- Tiêu chí vào gồm **đủ nguồn lực** (người, công cụ, môi trường, dữ liệu, ngân sách, thời gian) · **đủ testware** · **chất lượng ban đầu** (smoke đã pass)
- Tiêu chí vào/ra **nên định nghĩa theo từng cấp độ kiểm thử** → cột *Tiêu chí riêng* ở mục 3.1
- **Hết thời gian/ngân sách cũng là tiêu chí ra hợp lệ** nếu stakeholder đã xem xét và chấp nhận rủi ro → ghi chú bắt buộc ở mục 4.2

### Bảng ánh xạ ba chuẩn

| Mục trong plan | ISO/IEC/IEEE 29119-3 — Test Plan | ISTQB CTFL v4.0 — 5.1.1 | IEEE 829-1998 — Test Plan |
|---|---|---|---|
| Kiểm soát tài liệu | Document-specific information — Unique identification · Issuing organization · Approval authority · Change history | — | Test plan identifier |
| 1.1 Mục tiêu kiểm thử | Introduction — Scope · Context of the testing — Project/test sub-process | Context of testing — test objectives | Introduction |
| 1.2 Cơ sở kiểm thử | Context of the testing — Test item(s) | Context of testing — test basis | Introduction |
| 2.1 Trong phạm vi | Context of the testing — Test item(s) · Test scope | Context of testing — scope | Test items · Features to be tested |
| 2.2 Ngoài phạm vi | Context of the testing — Test scope (phần loại trừ) | Context of testing — scope | Features not to be tested |
| 2.3 Giả định & ràng buộc | Context of the testing — Assumptions and constraints | Assumptions and constraints of the test project · Context of testing — constraints | — |
| 2.4 Các bên liên quan & giao tiếp | Context of the testing — Stakeholders · Testing communication | Stakeholders — roles, relevance to testing · Communication — forms and frequency of communication, documentation templates | — |
| 3.1 Cấp độ kiểm thử | Test strategy — Test sub-processes | Test approach — test levels | Approach |
| 3.2 Loại kiểm thử | Test strategy — Test sub-processes | Test approach — test types | Approach |
| 3.2.1 Kiểm thử phi chức năng | Test strategy — Test sub-processes · Test design techniques | Test approach — test types | Approach |
| 3.3 Kỹ thuật thiết kế test | Test strategy — Test design techniques | Test approach — test techniques | Approach |
| 3.4 Mức độc lập của kiểm thử | Staffing — Roles, activities, and responsibilities | Test approach — independence of testing | Responsibilities |
| 3.5 Retest & regression | Test strategy — Retesting and regression testing | Test approach — test types | Approach |
| 3.6 Chỉ số theo dõi | Test strategy — Metrics to be collected | Test approach — metrics to be collected | — |
| 3.7 Chiến lược tự động hoá | Test strategy — Test sub-processes | Test approach — test types *(kim tự tháp kiểm thử: CTFL v4.0 mục 5.1.6)* | Approach |
| 4.1 Tiêu chí vào | Test strategy | Test approach — entry criteria | — |
| 4.2 Tiêu chí ra | Test strategy — Test completion criteria | Test approach — exit criteria | Item pass/fail criteria |
| 4.3 Tạm dừng & tiếp tục | Test strategy — Suspension and resumption criteria | — | Suspension criteria and resumption requirements |
| 5.1 Môi trường kiểm thử | Test strategy — Test environment requirements | Test approach — test environment requirements | Environmental needs |
| 5.2 Quản lý dữ liệu kiểm thử | Test strategy — Test data requirements | Test approach — test data requirements | Environmental needs |
| 5.3 Công cụ | Test strategy — Test environment requirements | — *(công cụ: CTFL v4.0 chương 6)* | Environmental needs |
| 6. Nhân lực & phân công | Staffing — Roles, activities, and responsibilities · Hiring needs · Training needs | Stakeholders — responsibilities, hiring and training needs | Responsibilities · Staffing and training needs |
| 7.1 Lịch trình & mốc | Schedule | Budget and schedule | Schedule |
| 7.2 Ước lượng công sức | Testing activities and estimates | Budget and schedule | Testing tasks |
| 7.3 Ngân sách | Testing activities and estimates | Budget and schedule | — |
| 8.1 Rủi ro dự án | Risk register — Project risks | Risk register — project risks | Risks and contingencies |
| 8.2 Rủi ro sản phẩm (tóm tắt) | Risk register — Product risks | Risk register — product risks | Risks and contingencies |
| 9. Quản lý lỗi | — *(không có mục riêng trong Test Plan; báo cáo sự cố là tài liệu riêng — Incident Report)* | — *(quản lý lỗi: CTFL v4.0 mục 5.5)* | — *(Test incident report là tài liệu riêng)* |
| 10. Sản phẩm bàn giao | Test strategy — Test deliverables | Test approach — test deliverables | Test deliverables |
| 11. Phê duyệt | Document-specific information — Approval authority | — | Approvals |
| 12.2 Điểm làm khác chính sách & chiến lược chung | Test strategy — Deviations from the Organizational Test Strategy | Test approach — deviations from the organizational test policy and test strategy | — |

> ⚠️ **Hai bản IEEE 829 có cấu trúc KHÁC nhau.** Khung 16 mục phẳng ở cột cuối là **829-1998**. Bản **829-2008** tách thành Master Test Plan và Level Test Plan với dàn mục lồng nhau — khách yêu cầu đúng 829-2008 → **xin file template của khách** rồi ánh xạ theo file đó.
>
> ⚠️ **Tên mục 29119-3** ghi theo khung Test Plan của chuẩn; giữa các bản phát hành có điều chỉnh tên gọi. Agent **không có** bản chuẩn để tra → trước khi đem đi audit, người có bản chuẩn phải **đối chiếu lại cột này** — ghi việc đó vào danh sách ô còn treo. Cột **ISTQB** đã đối chiếu nguyên văn giáo trình v4.0; bản sửa lỗi v4.0.1 **chưa** đối chiếu.
>
> ⚠️ **Mục 9 Quản lý lỗi và 3.7 Tự động hoá là phần mở rộng** so với khung chuẩn — thêm vì PM/khách cần thấy ngay trong plan *lỗi được phân loại, xử lý thế nào* và *tự động hoá tới đâu*. Không mục nào của 29119-3 bị bỏ; chỉ thêm. Mục 12.1 phải ghi rõ hai mục này là mở rộng, **không** gán cho chúng một tên mục chuẩn không có thật.
>
> ⚠️ **Quy tắc ghi chuẩn:** ghi **tên mục**, **KHÔNG ghi số điều khoản** (`clause 7.3.2`) của 29119-3 và 829. Riêng ISTQB được ghi số mục giáo trình (`5.1.1`) vì đã đối chiếu trực tiếp bản v4.0.

---
