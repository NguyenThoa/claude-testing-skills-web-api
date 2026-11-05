---
name: skills-requirements-analyzer
description: Kỹ năng phân tích website, đặc tả API (OpenAPI/Swagger/Scalar/Postman/tài liệu API) hoặc tài liệu nghiệp vụ và sinh ra tài liệu Yêu cầu (Requirements Document/User Stories) chuẩn mực — có gán mã REQ ID truy vết được, một prefix cho mỗi nghiệp vụ dù chạy trên bao nhiêu nền tảng, phát hiện Ambiguity/Risk, kèm ma trận phân quyền và trạng thái.
---

# Kỹ năng Phân tích Yêu cầu (Requirements Analyzer)

Kỹ năng này cung cấp các hướng dẫn chi tiết để AI (Claude Code) có thể chuyển đổi giao diện web (DOM/HTML), đặc tả API, hoặc tài liệu (Jira ticket, .doc, user story) thành tài liệu Yêu cầu rõ ràng, chi tiết, **truy vết được**, phục vụ trực tiếp cho QA, Tester và Developer.

## 1. Mục tiêu cốt lõi
- Xây dựng tài liệu yêu cầu bám sát thực tế hệ thống đang chạy hoặc tài liệu gốc.
- **Mọi yêu cầu đều có mã REQ ID** — để test cases, automation và RTM truy vết ngược được.
- Đảm bảo tính bao quát: Happy Path, Edge Cases, phân quyền, trạng thái, thông báo lỗi.
- Phát hiện và ghi nhận có hệ thống các điểm mơ hồ (Ambiguity) và rủi ro (Risk).

---

## 2. Quy Ước Đánh Mã (BẮT BUỘC — dùng xuyên suốt toàn chuỗi)

| Loại | Format | Ví dụ | Dùng ở đâu |
|---|---|---|---|
| **Requirement** | `REQ-<MODULE>-<SỐ>` | `REQ-LOGIN-01` | Từng yêu cầu chức năng, business rule, validation rule |
| **Story** | `STORY-<MODULE>-<SỐ>` | `STORY-PRJ-03` | Nhóm REQ thành đơn vị công việc (backlog view) — xem mục 5 |
| **Ambiguity** | `AMB-<MODULE>-<SỐ>` | `AMB-LOGIN-03` | Điểm mơ hồ cần clarify với PO/BA |
| **Risk** | `RISK-<MODULE>-<SỐ>` | `RISK-PRJ-02` | Rủi ro sản phẩm hoặc dự án, kèm khả năng · tác động · mức |

**Quy tắc:**
- Mỗi yêu cầu **đủ nhỏ để test được độc lập** — nếu 1 câu chứa nhiều rule, tách thành nhiều REQ
- REQ ID **không đổi** sau khi đã phát hành tài liệu (chỉ thêm mới, không đánh lại số)
- Test cases sinh ra ở bước sau **PHẢI ghi REQ ID** vào cột `REQ ID` — đây là mắt xích để kiểm chứng "đủ case" và chạy `/generate-traceability-matrix`
- **AMB và RISK mang prefix module, đánh số RIÊNG từng module từ `01`** — giống hệt REQ. Module mới luôn bắt đầu `AMB-<MODULE>-01` · `RISK-<MODULE>-01`, **không** nối tiếp số của module khác. ❌ `AMB-15` trần: mã không có prefix thì hai module đánh số độc lập sẽ va nhau (đã xảy ra — `AMB-15` vừa là câu hỏi của `LOGIN` vừa là của `CUST`, grep ra hai nghĩa)
- Hệ thống thứ hai trong namespace `_<hệ-thống>/` thêm mã hệ thống như REQ: `AMB-<HỆ_THỐNG>-<MODULE>-<SỐ>` · `RISK-<HỆ_THỐNG>-<MODULE>-<SỐ>`
- AMB/RISK **cấp hệ thống** (tầng khám phá, cắt ngang nhiều module, chưa quy được về module nào): `AMB-SYS-<SỐ>` · `RISK-SYS-<SỐ>` cho hệ thống mặc định, `AMB-<HỆ_THỐNG>-<SỐ>` cho namespace. `SYS` là prefix **dành riêng**, không cấp cho module. Khi quy được về module → mở mã mới ở module đó, dòng cũ ghi `→ chuyển thành AMB-<MODULE>-NN`
- Nhắc tới AMB/RISK ở tài liệu **cắt ngang** (danh mục README, test plan, báo cáo) → luôn ghi **đủ mã có prefix**, không viết tắt `AMB-15`

**Phân vai REQ vs STORY (quan trọng):**
- `REQ` là **lớp truy vết duy nhất** — bất biến, mọi test case / automation / RTM đều neo vào đây
- `STORY` chỉ là **lớp nhóm việc** — được phép đổi tên, gộp, tách lại theo cách team vận hành mà **không** ảnh hưởng tới REQ ID hay test case đã viết
- ❌ **TUYỆT ĐỐI KHÔNG** đánh lại số REQ khi tách file hay gom Story. REQ ID gắn với *hành vi*, không gắn với *vị trí trong tài liệu*

### 2.1. Nối tiếp mã REQ giữa các lần chạy (BẮT BUỘC — chống đụng mã)

Cùng một module có thể được phân tích **nhiều lần bằng nhiều workflow khác nhau** (`/generate-requirements-from-website` từ UI, `/analyze-requirement-document` từ Jira ticket, `/fetch-jira-requirements`…). Nếu mỗi lần đều đánh lại từ `01`, các dải mã sẽ đụng nhau và **RTM map sai hoàn toàn**.

**Quy trình bắt buộc TRƯỚC KHI gán REQ ID đầu tiên:**

1. **Đọc danh mục toàn hệ thống — LUÔN LÀM ĐẦU TIÊN:**
   ```
   docs/requirements/README.md
   ```
   Bảng danh mục cho biết: module nào đã có tài liệu · **prefix nào đã bị chiếm** · mã kế tiếp của từng module. Module mới **phải chọn prefix chưa có trong danh sách**.
   > ⚠️ **File không tồn tại (dự án mới)** → **tạo ngay** theo mục 5.7.1 trước khi đi tiếp. KHÔNG bỏ qua bước này rồi ghi thẳng tài liệu module.
2. **Kiểm tra tài liệu module:**
   ```
   docs/requirements/<module>/REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md
   ```
3. **Nếu CHƯA có** → đánh số từ `01`.
4. **Nếu ĐÃ có** → tìm số REQ lớn nhất đang dùng và **đánh tiếp từ số kế tiếp**. Ví dụ module đã dùng tới `REQ-PRJ-65` → yêu cầu mới bắt đầu từ `REQ-PRJ-66`.
   > Số lớn nhất lấy trên **mọi** nơi: `Mã kế tiếp` ở danh mục · index · file nền tảng · `stories/` · `<module>/analysis/*.md`. File phân tích ticket cũ có thể chứa mã chưa vào tài liệu module, bỏ qua là đụng mã. Áp cả bước 3: chưa có index nhưng `analysis/` đã có mã thì đánh tiếp, không bắt đầu từ `01`.
5. **Ghi rõ nguồn** vào cột `Nguồn` của mỗi REQ mới: `Ticket ABC-123` / `UI thực tế` / `AC#2` — để biết mã đến từ đợt phân tích nào.
6. **Cập nhật ngược 2 nơi** (thiếu một trong hai là lần chạy sau đánh sai số):
   - Bảng metadata của tài liệu module:
     ```markdown
     | Dải mã đã dùng | REQ-PRJ-01 → REQ-PRJ-78 (đợt 1: UI recon 01→65 · đợt 2: ticket ABC-123 66→78) |
     | Mã kế tiếp     | REQ-PRJ-79 — KHÔNG đánh lại từ 01 |
     ```
   - **Bảng danh mục** trong `docs/requirements/README.md`: cột `REQ đã dùng`, `Mã kế tiếp`, `AMB treo`, `Cập nhật`

**Ràng buộc bổ sung:**
- ❌ Không "tái sử dụng" mã của REQ đã bị xoá — mã đã cấp là **vĩnh viễn chết**, kể cả khi yêu cầu đó không còn
- ✅ `<MODULE>` phải **giống hệt** giữa các đợt (`PRJ` thì mãi là `PRJ`, không lúc `PRJ` lúc `PROJECT`)
- ✅ Cùng nguyên tắc này áp cho `AMB-<MODULE>-XX` và `RISK-<MODULE>-XX` — đánh tiếp **trong module**, không đánh lại, không nối số của module khác
- ⚠️ Nếu yêu cầu mới **thay đổi hành vi của một REQ cũ** (không phải thêm mới): **giữ nguyên mã cũ**, sửa nội dung, và ghi chú `Cập nhật bởi ticket ABC-123` — không cấp mã mới cho cùng một hành vi

### 2.2. Một nghiệp vụ = một prefix, dù chạy trên bao nhiêu nền tảng (BẮT BUỘC)

Một hệ thống thường có nhiều **mặt**: web, API công khai cho đối tác. Cùng một nghiệp vụ (Đăng nhập, Khách hàng, Đơn hàng) xuất hiện ở nhiều mặt. Tách prefix theo nền tảng sẽ nhân đôi REQ cho **cùng một rule** — sửa rule ở web quên sửa ở API, RTM báo phủ đủ trong khi hai bản đã lệch nhau.

| Quy tắc | Chi tiết |
|---|---|
| **Prefix gắn với nghiệp vụ, không gắn với nền tảng** | Đăng nhập trên web hay API đều là `LOGIN`. ❌ `LOGIN_WEB` · `LOGIN_APP` · `MLOGIN` · `APILOGIN` |
| **Một module = một thư mục, một index, một dải mã** | Web, API cùng nghiệp vụ chung `docs/requirements/<module>/` và chung dải REQ; nội dung riêng từng nền tảng nằm ở tầng `web/` · `api/` (mục 5.3). ❌ `docs/requirements/login_api/` · ❌ dải `REQ-LOGIN-M01` |
| Cột **`Nền tảng`** | Giá trị: `Web` · `API`, nối bằng ` · ` khi áp nhiều nền tảng, hoặc `Tất cả` = mọi nền tảng module đang có. **Bắt buộc** ở REQ trong index (REQ dùng chung); file `web/` và `api/` không cần — nền tảng suy từ file |
| Rule **giống nhau** trên ≥ 2 nền tảng → **1 REQ, nằm ở index** | "Khoá tài khoản sau 5 lần sai" · `Tất cả` — thường là rule nằm ở server |
| Rule **khác nhau** → **REQ riêng cho từng nền tảng, nằm ở file nền tảng đó** | Web giữ lại email sau khi đăng nhập lỗi, API xử lý khác → 1 REQ ở `web/`, 1 REQ ở `api/`. Mỗi REQ vẫn là một rule kiểm độc lập (4.3.4) |
| Khác biệt **không rõ chủ đích** → `AMB-<MODULE>-XX` | Message lỗi web khác API · độ dài tối đa khác nhau · API nhận giá trị mà UI chặn → hỏi PO *"cố ý hay lỗi?"*. Mặc định nghi là lỗi |
| **Chưa khảo sát nền tảng nào thì không khai REQ cho nền tảng đó** | REQ khảo sát trên web ghi `Web`, **không** ghi `Tất cả` khi chưa gọi API. Nền tảng chưa kiểm là `❔`, không phải "chắc cũng giống" — cùng tinh thần "không suy role B từ role A" (3.1.2) |
| Mở rộng REQ sang nền tảng mới | Kiểm chứng xong trên nền tảng mới → **chuyển dòng REQ cũ** từ file nền tảng lên index và sửa cột `Nền tảng` (**giữ nguyên mã**, không cấp mã mới), ghi Nhật ký (6.9) loại `🟢 Thêm` · tóm tắt *"Mở rộng nền tảng: + API — chuyển lên index"* · cột `TC cần xử lý` = `viết mới cho API`. Evidence cũ **ở lại** `web/evidence/` — ảnh thuộc nền tảng đã chụp ra nó |

> **Ngoại lệ duy nhất:** hệ thống **khác hẳn nghiệp vụ** nằm chung repo → namespace `_<hệ-thống>/` (CLAUDE.md mục 6b). API của **cùng** hệ thống **không** phải hệ thống khác — không mở namespace cho chúng.

---

## Bản đồ đọc tiếp

File này giữ phần luôn áp dụng: mục tiêu, quy ước mã, luật bắt buộc. **Chỉ đọc thêm file của nhánh đang chạy.** Số mục giữ nguyên nên các skill khác vẫn tra được.

| Mục | Nội dung | File trong `references/` | Đọc khi |
|---|---|---|---|
| 3.1 | UI Recon, Network, phân quyền thiếu account | `recon_ui_web.md` | Phân tích website |
| 3.2 · 3.3 | Tài liệu, kết hợp tài liệu với UI, chia vùng | `document_analysis.md` | Có tài liệu |
| 3.4 | Đặc tả API, ma trận auth, gọi thật kiểm chứng | `api_spec.md` | Có spec API |
| 4 · 4.3 | Ambiguity, Risk, Cổng Tự Soát REQ | `ambiguity_and_gate.md` | Trước khi ghi file |
| 5 | Ngưỡng tách, thư mục, danh mục, tầng khám phá | `file_structure.md` | Trước khi ghi file |
| 6 | Format tài liệu đầu ra | `output_format.md` | Khi viết tài liệu |

## 3. Quy trình trích xuất thông tin

Skill có **4 nhánh trích xuất** tuỳ theo nguồn đầu vào. Xác định nhánh **trước khi bắt đầu**:

| Nguồn đầu vào | Nhánh | Đặc điểm |
|---|---|---|
| Website đang chạy | **3.1 — UI Recon (web)** | Sự thật nằm ở hệ thống; xác minh bằng tương tác thật qua Playwright MCP |
| Jira ticket, .docx, .pdf, .xlsx/.csv, .xml, user story | **3.2 — Document Analysis** | Sự thật nằm ở văn bản; xác minh bằng trích dẫn nguyên văn |
| Có cả hai, tài liệu phủ **đầy đủ** module | Chạy **3.2 trước** (nắm ý định) → **3.1 sau** (đối chiếu thực tế) | Mọi lệch pha giữa 2 nguồn là ambiguity, xem 3.3 |
| Có cả hai nhưng tài liệu **chỉ phủ một phần** | **3.3.1 — Tài liệu bán phần** | Tình huống phổ biến nhất ở hệ thống thiếu tài liệu. Phải chia vùng trước khi recon |
| Đặc tả API — OpenAPI/Swagger UI/Scalar/Redoc, Postman collection, **tài liệu API dạng .docx/.pdf** | **3.4 — API Spec Analysis** | Spec là **lời khai**, response thật mới là **sự thật**. Xác minh bằng gọi thật có kiểm soát |

> 📌 **Hệ thống nhiều mặt** (web + API): mỗi nhánh ghi REQ của nền tảng mình vào tầng `web/` · `api/` của **cùng** thư mục module, REQ dùng chung ≥ 2 nền tảng lên index `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` — áp mục **2.2** và **5.3**. Nhánh chạy sau **đọc REQ đã có trước** để nối mã và nhận ra rule trùng, không sinh REQ song song.

> ⚠️ **Chưa biết hệ thống có những module nào** → đây chưa phải việc của skill này. Chạy `/discover-system` trước để có bản đồ hệ thống + prefix, rồi mới recon từng module (xem mục **5.8**).

## 7. Bắt buộc (Strict Rules)

### 7.1. Luật chung — áp cho MỌI nhánh

- Luôn viết bằng **Tiếng Việt**.
- **Mọi yêu cầu chức năng, business rule, validation rule đều phải có mã REQ ID** — tài liệu không có mã bị coi là chưa đạt.
- **Không tự suy diễn nghiệp vụ** nếu không có căn cứ từ UI/tài liệu → đưa vào Ambiguities kèm Assumption tạm.
- **Mọi khẳng định phải truy được về nguồn.** Cột `Nguồn` của mỗi REQ là bắt buộc, không được để trống hay ghi chung chung.
- **Luôn kiểm tra `docs/requirements/<module>/REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` trước khi gán mã REQ đầu tiên** và đánh tiếp từ số cuối cùng (mục 2.1) — áp cho MỌI workflow sinh REQ, không riêng nhánh nào.
- **Dự án mới, chưa có `docs/requirements/README.md` → PHẢI tạo file danh mục trước** khi ghi tài liệu module đầu tiên (mục 5.7.1). Thiếu file này, cơ chế chống trùng prefix và nối tiếp mã REQ im lặng không hoạt động.
- **Không bao giờ đánh lại số REQ ID** khi tách file, gom Story hay tái cấu trúc tài liệu.
- **Một nghiệp vụ = một prefix, dù chạy trên web hay API** (mục 2.2). Không mở prefix hay tài liệu riêng theo nền tảng; khác biệt giữa nền tảng thể hiện bằng cột `Nền tảng`, khác biệt không rõ chủ đích thành `AMB-<MODULE>-XX`.
- **Không khai REQ cho nền tảng chưa khảo sát** — `Tất cả` chỉ được ghi khi đã kiểm trên từng nền tảng module có.
- **Tầng nền tảng `web/` · `api/` luôn có** (mục 5.3): REQ chỉ áp một nền tảng ở file nền tảng đó, REQ dùng chung ở index, evidence ở `<nền-tảng>/evidence/`. Không tạo thư mục nền tảng nào khác ngoài 2 tên này.
- **Đếm số REQ trước khi ghi file** và áp đúng bảng ngưỡng tại mục 5.1 — không tự ý gộp hay tách ngoài quy tắc.
- Dù tách bao nhiêu file, **điểm vào luôn là `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md`** kèm mục `## Bản đồ tài liệu` (mục 5.5) — để các workflow phía sau không vỡ.
- **KHÔNG BAO GIỜ xoá dòng REQ** khỏi tài liệu — tính năng bị gỡ thì đổi trạng thái sang 🔴 Deprecated (mục 6.2). Xoá dòng là mất dấu vết và làm vỡ RTM.
- **Mọi thay đổi tài liệu đều phải ghi Nhật ký thay đổi** (mục 6.9), kèm cột `TC cần xử lý` — đây là mắt xích duy nhất báo cho tester biết test case nào đã stale.
- **Ba nơi phải luôn khớp nhau:** Nhật ký (6.9) ↔ Trạng thái REQ (6.2) ↔ Dải mã metadata (6.1).
- **Chạy Cổng Tự Soát REQ (mục 4.3) TRƯỚC KHI ghi file** — 9 câu hỏi bắt lỗi do chính agent viết sai. Bỏ qua bước này thì lỗi chỉ lộ ra ở tầng test case, khi đã quá muộn để truy nguồn.
- 🔒 **CẤM ghi giá trị bí mật thật vào bất kỳ tệp nào trong `docs/`** — mật khẩu, token, cookie xác thực, session id, API key, chuỗi ký của liên kết đặt lại mật khẩu. Ghi **hình thái** thay cho giá trị (mục 4.3.3). Lý do: `docs/` được commit, và lịch sử git **không xoá được bằng cách sửa file**. Credentials sống ở `.env` (đã `.gitignore`), tài liệu chỉ mô tả *hình dạng* của chúng.
- 🔒 **Trước khi ghi tài liệu đầu tiên của dự án, kiểm `docs/` có bị `.gitignore` chặn không.** Không chặn (mặc định nên vậy — tài liệu cần được commit) thì **mọi** thứ đưa vào `docs/` là công khai với người có quyền đọc repo: cân nhắc lại từng ảnh evidence và từng giá trị chép vào AC.
- **AMB và RISK cũng không được mồ côi.** Mục 6.8 đã buộc mọi REQ thuộc đúng một Story; áp cùng nguyên tắc cho AMB/RISK — mỗi mã hoặc gắn vào một Story, hoặc nằm trong bảng **Hạng mục cấp Epic** kèm lý do. Mã không xuất hiện ở đâu cả nghĩa là không ai chịu trách nhiệm xử lý nó.

### 7.2. Chỉ áp cho nhánh UI Recon web (3.1)

- Nếu có Playwright MCP: mở browser thật (`navigate → wait_for(page_load) → snapshot`) để capture giao diện — **KHÔNG đoán field/validation**. KHÔNG gọi `browser_resize`; viewport đã đúng từ `--viewport-size` lúc launch.
- Error messages ghi **nguyên văn từ UI thực tế**, không diễn đạt lại.
- **Trigger từng validation** để lấy message thật — không chép từ code cũ, không suy ra từ tên field.
- Cột `Nguồn` ghi `UI thực tế` (chỉ quan sát) hoặc `Kiểm chứng thực tế` (đã tương tác và xác nhận) — **phân biệt rõ hai mức này**. Có tài liệu kèm thì dùng thang 4 mức ở **3.3.1 Bước 3**.
- Lưu evidence screenshot vào `docs/requirements/<module>/web/evidence/` — **trong** thư mục nền tảng của module, không tách ra ngoài (mục 5.3).
- **Bật `browser_network_requests` trong suốt recon** (mục 3.1.1) — kể cả lúc submit form. Hệ thống không có tài liệu mà bỏ tầng network là bỏ mất validation server-side và trạng thái ẩn.
- 🚫 **CẤM gọi API trực tiếp** (curl / fetch / `browser_evaluate` gọi endpoint) để dò hành vi. Chỉ **quan sát thụ động** request do UI tự phát sinh — gọi thẳng API là kiểm thử xâm nhập, và không chứng minh được gì về hành vi UI.
- **Không đủ account cho mọi role → KHÔNG bỏ trống mục 6.5, cũng KHÔNG bịa.** Áp thang 3 mức bằng chứng ở mục 3.1.2, kèm dòng tổng `Đã kiểm chứng / Suy diễn / Chưa rõ`, và mỗi role thiếu account = 1 `AMB-<MODULE>-XX` 🔴.
- **Ô `❔` không được làm tròn thành `❌`** — "chưa kiểm chứng" khác hẳn "không có quyền".
- **Có tài liệu bán phần → lập Bản đồ phủ tài liệu TRƯỚC khi mở browser** (mục 3.3.1) và đưa vào tài liệu đầu ra ở mục 6.5.1. Không được recon cả module theo một chiến lược duy nhất.
- **Không dùng tài liệu của vùng này để suy ra vùng khác** — spec form tạo mới không nói gì về form sửa, dù hai form trông giống nhau.
- **Đọc `docs/requirements/_discovery/` trước khi recon nếu đã chạy `/discover-system`** (mục 5.8) — lấy route, prefix, bản đồ phủ tài liệu; **không tự đặt lại prefix**.
- **User hỏi "hệ thống có gì" (chưa biết module nào) → route sang `/discover-system`**, không tự crawl rồi sinh REQ lẫn hai tầng.

#### 7.2.1. Chuẩn Evidence (BẮT BUỘC) — evidence thiếu thì bước sinh TC sẽ bịa

Evidence là **nguồn sự thật** cho mọi workflow phía sau (`/generate-testcases-*`, `/generate-automation-*`). Ảnh cắt cụt khiến agent sinh TC phải suy diễn phần không nhìn thấy — và **không ai phát hiện được chỗ nào là suy diễn**.

| Quy tắc | Chi tiết |
|---|---|
| **Ảnh phải chứa trọn đối tượng cần chứng minh** | Mặc định `browser_take_screenshot(fullPage=true)`, vì form dài chụp viewport luôn bị cắt mất nút Save, checkbox cuối, editor. **Mục đích của luật là không cắt cụt đối tượng — không phải chụp càng nhiều càng tốt.** Đối tượng là một widget nằm trọn trong viewport (thanh đầu trang, dropdown, hộp thoại) thì chụp viewport/element là **đủ và đúng phạm vi** — xem luật vệ sinh dữ liệu bên dưới |
| **Chụp theo trạng thái, không chỉ trạng thái mặc định** | Mỗi trạng thái động = 1 ảnh riêng: dropdown **đang mở** (thấy đủ options), field sau khi **đổi giá trị điều khiển** (Billing Type → Total Rate hiện), checkbox **disabled vs enabled**, form **sau khi submit lỗi** (thấy message inline) |
| **🔍 BẮT BUỘC mở lại ảnh xác nhận trước khi ghi danh mục** | Chụp xong phải **`Read` lại chính tệp đó** và xác nhận nó thật sự thể hiện trạng thái sắp khai. Rất hay gặp: bấm mở dropdown nhưng ảnh chụp trước khi menu kịp render, hoặc thao tác mở thất bại mà không ai biết → danh mục ghi *"menu đang mở"* trong khi ảnh là menu đóng. Dòng danh mục sai **nguy hiểm hơn không có ảnh**, vì nó tạo cảm giác REQ đã có bằng chứng |
| **Chụp đủ mọi tab** | Form/trang nhiều tab → mỗi tab 1 ảnh full-page. Tab chưa active thì nội dung bên trong **không render đúng** |
| **Bảng danh sách chụp cả phần điều khiển** | Phải thấy: toàn bộ hàng tiêu đề, dropdown page size, mọi nút thanh công cụ (kể cả nút icon không nhãn), ô tìm kiếm, khu vực phân trang |
| **Đặt tên nêu rõ trạng thái VÀ phạm vi chụp** | `<màn_hình>_<trạng_thái>_<fullpage\|viewport>.png` — VD `project_new_form_default_fullpage.png`, `dashboard_logout_menu_open_viewport.png`. Hậu tố phải khớp cách chụp thật; đặt `_fullpage` cho ảnh viewport là khai sai |
| **🔒 Vệ sinh dữ liệu — evidence là tệp sẽ được commit** | Ảnh chụp hệ thống thật thường kéo theo **dữ liệu không liên quan tới REQ**: tên khách hàng, số tiền, email, nhật ký hoạt động, nội dung công việc. Luật: **chụp đúng phạm vi đối tượng cần chứng minh, không chụp thừa.** Đối tượng nằm trong viewport mà ảnh full-page kéo theo cả trang dữ liệu nghiệp vụ → **chụp viewport**, và ghi một dòng lý do trong Danh mục Evidence. Buộc phải full-page mà không tránh được dữ liệu nhạy cảm → báo user trước khi commit |
| **Ghi bảng Danh mục Evidence vào tài liệu** | Mỗi ảnh 1 dòng: tên tệp · màn hình · trạng thái · REQ mà nó làm bằng chứng. REQ không có ảnh nào chống lưng thì cột `Nguồn` **không được** ghi `Kiểm chứng thực tế` |
| **Ảnh KHÔNG thay được việc đọc DOM** | Ảnh không cho biết `disabled` hay chỉ là `không tick`, không đếm được option nào `selected`, không đọc được `value` / `data-*`. Những dữ kiện này **bắt buộc đọc bằng `browser_evaluate`** và **chép nguyên số liệu vào Acceptance Criteria** — vì ảnh lưu lại cũng không kiểm chứng lại được |
| **DOM cũng KHÔNG thay được ảnh** | Chiều ngược lại cũng đúng: đếm được phần tử trong DOM **không** chứng minh người dùng nhìn thấy nó. Hai nguồn bổ sung cho nhau, không thay thế nhau — xem mục **4.3.5** |

**Dữ kiện bắt buộc đọc từ DOM (ảnh không thể hiện được):**

| Dữ kiện | Vì sao ảnh không đủ |
|---|---|
| Số `<option>` thật của mỗi `<select>` | Option rỗng đầu danh sách không hiển thị trên UI nhưng vẫn đếm khi automation |
| Option nào đang `selected` (nhất là multi-select) | Multi-select hiển thị dạng chuỗi bị cắt `...` — không đếm được |
| `disabled` vs `checked` của từng checkbox | Xám mờ trên ảnh có thể là disabled, cũng có thể chỉ là màu nhạt |
| `value` của option (ánh xạ nhãn ↔ giá trị) | Không bao giờ hiện trên UI, nhưng automation phải chọn theo `value` |
| Thứ tự focus thật của form | Bố cục nhiều cột làm thứ tự Tab khác thứ tự đọc từ trên xuống |
| Phần tử ẩn bằng class nhưng vẫn trong DOM | Ảnh chỉ cho biết "không thấy", không cho biết "không tồn tại" |
| `offsetParent` + `getBoundingClientRect()` của **mọi** phần tử khai là "dùng được" | Đếm được node **không** nghĩa là người dùng bấm được — node có thể bị tổ tiên `display:none` (responsive, quyền, trạng thái). Bắt buộc theo mục **4.3.5** |
| Số phần tử **lồng bên trong** khi khai vị trí ("mục cuối cùng", "dòng đầu") | `X li:last-child` bắt cả `<li>` ở submenu; phải dùng `X > li:last-child`. Sai chỗ này thì locator trong TC trỏ nhầm phần tử |
| Giá trị **đầy đủ** của `document.title` và `body.className` | Thường có phần động (số đếm thông báo, token theo trình duyệt/cấu hình) — chép thiếu là AC assert khớp tuyệt đối sẽ đỏ. Xem mục **4.3.7** |
| Viewport đang đo (`innerWidth × innerHeight`) | Mọi kết luận về hiển thị **chỉ đúng với viewport đó** — phải ghi vào AC, và phần tử responsive cần recon riêng ở viewport khác |

**Checklist trước khi đóng recon:**
- Mọi REQ có cột `Nguồn` = `UI thực tế` / `Kiểm chứng thực tế` đều phải truy được về ít nhất 1 ảnh trong Danh mục Evidence **hoặc 1 lần đọc DOM có ghi số liệu trong Acceptance Criteria**. Không truy được → hạ về `Chưa kiểm chứng` + mở `AMB-<MODULE>-XX`.
- **Mọi ảnh trong Danh mục Evidence đã được `Read` lại** và xác nhận đúng trạng thái đang khai.
- **Đã chạy Cổng Tự Soát REQ (mục 4.3)** trên toàn bộ REQ vừa sinh.

### 7.3. Chỉ áp cho nhánh Document Analysis (3.2)

- **KHÔNG đọc file nhị phân bằng `Read`** — ủy quyền đúng skill theo bảng ở mục 3.2 Bước 0. Không đọc được thì **dừng và báo user**, không suy đoán từ tên file.
- **KHÔNG tự viết AC thay PO/BA.** Tài liệu thiếu AC → ghi nhận đúng thực trạng + `AMB-<MODULE>-XX` 🔴 High (mục 3.2 Bước 4). Đây là luật tương đương với "không đoán locator" của nhánh UI.
- **Trích dẫn nguyên văn** mọi rule, message, giá trị ngưỡng — cấm diễn đạt lại rồi gán REQ.
- **Ghi vị trí nguồn cụ thể** trong cột `Nguồn`, đủ để người review mở đúng chỗ mà đối chiếu:
  ```
  ✅ Ticket ABC-123 · AC#4          ✅ field_spec.xlsx · sheet "Fields" · dòng 12
  ✅ Comment của PO ngày 15-07-2026  ❌ "theo tài liệu"   ❌ "trong ticket"
  ```
- **KHÔNG bỏ qua comments** — comment thường là quyết định mới nhất và **đè lên** phần mô tả gốc.
- **Xung đột giữa các nguồn KHÔNG được tự giải quyết im lặng** — luôn thành `AMB-<MODULE>-XX`, kể cả khi đã áp thứ tự ưu tiên ở mục 3.2 Bước 3.
- Phân biệt **"Không đề cập trong tài liệu"** (tài liệu thiếu → cần hỏi) với **"Không áp dụng"** (đã cân nhắc và xác định không liên quan). Hai câu này nghĩa khác hẳn nhau.
- **KHÔNG tự fetch URL Jira/Confluence** — route sang `/fetch-jira-requirements`. MCP chưa authorize thì báo user, tuyệt đối không bịa nội dung ticket.

### 7.4. Chỉ áp cho nhánh API Spec Analysis (3.4)

- **Lấy spec bản gốc bằng tải thô** (`curl` → `sources/`), **KHÔNG dùng `WebFetch`** — kết quả đã qua xử lý, spec lớn bị cắt âm thầm. Đếm số operation đối chiếu trang tài liệu trước khi dùng (3.4.1).
- **Trang tài liệu (Swagger UI, Scalar, Redoc) là renderer, không phải spec** — tìm URL spec gốc hoặc khối spec nhúng inline; Swagger UI nhiều spec thì hỏi phạm vi, snapshot từng spec.
- **Ma trận auth lập theo TỪNG operation** — `security: []` ghi đè cấp gốc; Postman thì auth cấp dưới đè cấp trên (3.4.3).
- **Gọi thật chỉ khi `Gọi API: ✅`** ở danh mục, và tuân **tuyệt đối** bảng quy tắc dữ liệu 3.4.4: không ghi/xoá bản ghi không do phiên này tạo, BOLA/IDOR chỉ bằng 2 tài khoản tự tạo, dọn sạch và báo số tạo/dọn.
- Luật "cấm gọi API trực tiếp" của 7.2 **không** áp cho nhánh này — nhưng cũng **không** được mang quyền gọi API sang nhánh UI.
- **Spec ↔ thực tế lệch → REQ theo spec + `AMB-<MODULE>-XX` 🔴 nguyên văn cả hai** (3.4.5). Không tự hạ REQ theo hành vi thật, không giấu lệch pha.
- **JSON mẫu trong tài liệu văn bản là ví dụ, không phải schema** — không suy `required`/kiểu/độ dài từ ví dụ (3.4.6). Không đặt OpenAPI tự dựng vào `sources/`.
- **Mọi operation trong phạm vi phải có ≥ 1 REQ** trong Endpoint Catalog, hoặc ghi lý do loại khỏi phạm vi.
- 🔒 Request/response chép vào tài liệu **phải che** token, cookie, mật khẩu, dữ liệu cá nhân — ghi hình thái (4.3.3).
