---
name: generate-master-test-plan
description: Sinh Master Test Plan cấp quản lý — kiểm soát tài liệu, phạm vi theo module × nền tảng, cấp độ & loại kiểm thử (kể cả phi chức năng), chiến lược tự động hoá, tiêu chí vào/ra, môi trường, dữ liệu kiểm thử, quản lý lỗi, nhân lực, lịch, ước lượng & ngân sách, rủi ro. Đầu vào là phiếu YAML do người dùng đưa, hoặc agent hỏi một lượt rồi ghi thành docs/test-plans/test_plan_<slug>.input.yaml. Bám ISO/IEC/IEEE 29119-3 và đủ nội dung điển hình của ISTQB CTFL v4.0. KHÔNG phải danh sách test scenario.
---

> **Skill nền tảng cần nạp trước:** `skills-test-summary-reporter` · `skills-requirements-analyzer` · `skills-manual-testcase-v3` — đọc `.claude/skills/<tên-skill>/SKILL.md` của từng skill trước khi bắt đầu.

# Workflow: Master Test Plan

> **BẮT BUỘC (MANDATORY SKILL):** Bạn PHẢI nạp **`skills-test-summary-reporter`** — mục **Tiêu chí Exit** là **nguồn duy nhất** định nghĩa bộ tiêu chí ra mặc định. Plan này công bố tiêu chí **trước**, `/generate-test-progress-report` theo dõi **trong đợt**, `/generate-test-summary-report` chấm lại **sau**. Ba bên phải khớp, nếu không thì lúc release sẽ cãi nhau về chuẩn.

Tài liệu quản lý một đợt kiểm thử: **ai làm gì, trong phạm vi nào, tốn bao nhiêu công sức, khi nào bắt đầu được, khi nào coi là xong.**

## ⚠️ Chọn đúng workflow

| User cần | Workflow đúng | Đầu ra |
|---|---|---|
| *"Test cái gì trước, có những kịch bản nào"* | `/generate-application-test-plan` | Scenario + priority, **không** quản lý |
| *"Hệ thống có module nào"* | `/discover-system` | Bản đồ module + prefix |
| *"Tài liệu kế hoạch để gửi PM/khách ký"* | **Workflow này** | Master Test Plan |
| *"Tuần này test tới đâu rồi"* | `/generate-test-progress-report` | Báo cáo tiến độ một kỳ |
| *"Có release được không"* | `/generate-test-summary-report` | Báo cáo tổng hợp cuối mốc |

> Workflow này **không sinh test scenario, không sinh TC**. Nó nói *cách tổ chức việc kiểm thử*, không nói *kiểm thử cái gì cụ thể*.

## ⚠️ Nguyên tắc thực thi

- **Tất cả output bằng Tiếng Việt**, viết cho PM/khách hàng đọc
- **KHÔNG BỊA** lịch, nhân lực, ngày mốc, tên người, công sức, ngân sách — agent không có cách nào biết. Thiếu thì để `❓ Chờ <ai> cung cấp`, **không** điền số cho đủ chỗ
- **Hai nguồn dữ liệu, không trộn vai:** thứ suy ra được lấy từ `docs/` (module, nền tảng, độ phủ, môi trường đã khảo sát, năng lực QA, vùng đã loại) — thứ chỉ người biết lấy từ **phiếu YAML đầu vào**. Không hỏi lại thứ `docs/` đã có
- Tiêu chí exit mặc định lấy **nguyên văn** từ `skills-test-summary-reporter` — không rút gọn câu chữ. Dự án muốn thêm thì thêm ở bảng **bổ sung**, không sửa bảng mặc định
- Thang **Severity / Priority** mặc định ở mục 9 lấy **nguyên văn** từ `skills-bug-reporter` mục *Severity & Priority Guide* — cùng lý do: tiêu chí exit #1, #2 đếm bug theo Severity, thang lệch là đếm lệch. Dự án dùng thang riêng thì khai ở phiếu, không sửa bảng mặc định
- **KHÔNG bịa thời hạn xử lý lỗi (SLA)** — không có mặc định; phiếu trống → `❓`
- **Phạm vi khai theo cặp module × nền tảng** (`web` · `api`) — cùng đơn vị mà báo cáo tiến độ và báo cáo tổng hợp dùng
- **KHÔNG bịa số điều khoản chuẩn** — xem mục Chuẩn tham chiếu
- 🔒 URL, tài khoản, token nằm ở `.env` — **không** ghi vào plan, **không** ghi vào phiếu YAML

---

> **Đọc khi cần:** `references/standards.md` (chuẩn tham chiếu và cách ghi) · `references/config_form.md` (các ô của phiếu YAML, đọc ở Bước 2).

## Bước 0: Xác định mốc, phiếu và plan đã có

| Tình huống | Xử lý |
|---|---|
| User không truyền gì | Hỏi tên mốc. Có `docs/test-plans/test_plan_<slug>.input.yaml` của mốc đó → dùng làm phiếu. Chưa có → hỏi user: đưa đường dẫn phiếu hay trả lời theo Bước 2 nhánh B |
| User truyền đường dẫn một phiếu YAML | Đọc phiếu đó |
| User chỉ nói tên mốc, phiếu chính đang là mốc khác | Tìm bản lưu `docs/test-plans/test_plan_<slug>.input.yaml`. Không có → hỏi user có muốn điền phiếu cho mốc này không; **không** tự dùng phiếu của mốc khác |
| User nói tên mốc **khác** `Mã mốc` trong phiếu chính | Báo lệch, hỏi user dùng cái nào — không tự chọn |
| `docs/test-plans/test_plan_<slug>.md` **chưa có** | Lập mới |
| `docs/test-plans/test_plan_<slug>.md` **đã có** | **KHÔNG** viết lại — sang mục **Cập nhật plan giữa đợt** |

Slug: chữ thường, không dấu, nối bằng `_` — `release_2.0` · `sprint_12` · `uat_dot_2`. Cùng slug là **hợp đồng nối** giữa ba tài liệu:

```
docs/test-plans/test_plan_<slug>.md                  ← plan (workflow này)
docs/test-plans/test_plan_<slug>.input.yaml          ← phiếu đầu vào
docs/executions/test_progress_<slug>_<YYYYMMDD>.md   ← báo cáo tiến độ từng kỳ (/generate-test-progress-report)
docs/executions/test_summary_<slug>_<timestamp>.md   ← báo cáo tổng hợp (/generate-test-summary-report)
```

---

## Bước 1: Tự đọc repo trước khi đọc phiếu

> 📂 **Repo có hai kiểu thư mục cùng tồn tại** — tầng nền tảng mới `<module>/<nền-tảng>/` và kiểu cũ `<module>/`. Mọi lượt đọc `docs/testcases/` · `docs/executions/` · `docs/bugs/` phải quét **cả hai**, nếu không plan sẽ báo 0 bug / 0 lần chạy cho module làm theo kiểu cũ.

| Đọc gì | Lấy ra | Dùng cho mục |
|---|---|---|
| `docs/requirements/README.md` — **bảng thuộc tính đầu file** | Tên hệ thống · **Môi trường dùng chung** · **Vai trò & tài khoản** · **Năng lực kiểm thử của QA** | 2.3 · 3.2 · 4.1 · 5.1 · 5.2 |
| `docs/requirements/README.md` — danh mục · Vùng chưa cấp prefix · Trạng thái REQ | Module · prefix · trạng thái recon · số REQ · **AMB 🔴 treo** · REQ ⚪ ra ngoài phạm vi (kèm **lý do**) | 1.2 · 2.1 · 2.2 · 4.1 · 8.1 |
| `docs/requirements/_*/README.md` (namespace) | Danh mục riêng từng hệ thống | 2.1 |
| `docs/requirements/_discovery/system_map.md` (+ `api_map.md`) | Nền tảng từng module · phụ thuộc · **Vùng chưa xác minh** · **Vùng loại khỏi phạm vi** · module bị chặn | 2.1 · 2.2 · 3.2 · 8.1 |
| `docs/requirements/<module>/…` — metadata · mục `RISK-<MODULE>-xx` · Nhật ký thay đổi | `Trình duyệt khảo sát` / `Nguồn spec` · **rủi ro sản phẩm đã ghi** · tên + phiên bản tài liệu làm cơ sở | 1.2 · 5.1 · 8.2 |
| `docs/testcases/README.md` | Module đã có TC · số TC theo nền tảng · REQ bao phủ | 2.1 |
| `docs/testcases/<module>/TEST_CASES_<TÊN_MODULE>_SUMMARY.md` → file nền tảng (kiểu cũ: chính index) | ⭐ **Bảng ISO/IEC 25010** — ô `➖` kèm người chịu · **Bảng 4 vòng** · kỹ thuật đã dùng · bộ chạy đề xuất · TC phi chức năng đã có (tag, nhóm Non-functional) · rủi ro RBT | 2.2 · 3.2 · 3.2.1 · 3.3 · 3.5 · 3.7 · 8.2 |
| `docs/executions/<module>/<nền-tảng>/run_*/` · kiểu cũ `docs/executions/<module>/run_*/` | Module × nền tảng **đã từng chạy** | 2.1 |
| `docs/bugs/README.md` → `BUG_*.md` (cả hai kiểu thư mục) | Bug đang mở theo Severity · Priority · trạng thái đang dùng | 4.1 · 4.2 · 8.1 · 9 |
| `.claude/skills/skills-bug-reporter/SKILL.md` — *Severity & Priority Guide* · *4 trạng thái retest* | Thang Severity/Priority mặc định **nguyên văn** · kết quả retest | 9 |
| `docs/traceability/traceability_matrix.md` (nếu có — file chung: độ phủ theo module + ⬛ module ngoài RTM; cần từng REQ thì theo `## Bản đồ tài liệu` sang file module. RTM kiểu cũ ở chỗ khác vẫn đọc) | Độ phủ REQ ↔ TC ↔ Automation | 2.1 · 3.6 |
| `docs/executions/test_summary_*.md` của **mốc trước** | *Yếu tố cản trở & Bài học* · **thời lượng thực tế** đợt trước (dữ liệu cho ước lượng `tỷ lệ`/`ngoại suy`) | 4.1 · 5 · 7.2 · 8.1 · 9 |
| Project automation (`package.json` · `pom.xml` · `pyproject.toml`) · file CI (`.github/workflows/` · `.gitlab-ci.yml` · `Jenkinsfile`) | Đã có framework automation chưa · đã có pipeline chưa · số script hiện có | 3.2 · 3.7 · 5.3 · 8.1 |

> ⭐ **Mục 2.2 lấy từ repo trước, phiếu YAML bổ sung sau.** Ô `➖` của bảng 25010, *Vùng loại khỏi phạm vi* của `system_map.md` và REQ ⚪ đều là quyết định **đã được ghi lại lúc nhìn kỹ hệ thống**.
>
> ⚠️ **REQ ⚪ bị loại vì hạn chế môi trường** (VD *"không chạy trên môi trường dùng chung"*) mà phiếu khai `Dùng chung với đội khác: không` → **không** tự đưa lại vào phạm vi. Liệt kê ở 2.1 thành bảng *REQ cần quyết định lại*, theo ô `Đưa lại REQ bị loại vì môi trường`.

---

## Bước 2: Đọc phiếu đầu vào — hoặc hỏi một lượt (CHECKPOINT)

### Nhánh A — có phiếu YAML

1. **Parse** — lỗi cú pháp YAML → báo **số dòng** kèm nguyên nhân thường gặp (thụt lề bằng Tab · lệch cột trong danh sách · giá trị có `": "` hoặc `" #"` chưa đặt trong ngoặc kép), dừng. Chuẩn hoá Unicode NFC trước khi đọc
2. **Kiểm tra giá trị** — đối chiếu bảng *Cấu trúc và giá trị hợp lệ* ở mục Phiếu cấu hình (`Nền tảng`, `Mức độ`, `Kỹ thuật`, `Vai trò`, `Bộ tiêu chí ra`, các ô `có` · `không`, ngày…). Gặp tên ô không có trong bảng → báo user, không tự diễn giải. Sai giá trị → liệt kê kèm số dòng, **không** tự đoán
3. **Đối chiếu với repo** — liệt kê mâu thuẫn, **không** tự chọn bên nào:

   | Mâu thuẫn | Ví dụ |
   |---|---|
   | Module không có trong danh mục | `Phạm vi` khai `INVOICE` nhưng `docs/requirements/README.md` không có prefix này |
   | Nền tảng module không có | Khai `CUST` × `api` nhưng `system_map.md` chỉ ghi web |
   | Môi trường khác bản đã khảo sát | Phiếu `Dùng chung với đội khác: không`, README ghi `CÓ` → **hợp lệ**, ghi vào 2.3 là môi trường đợt này khác môi trường khảo sát, kèm rủi ro lệch tài liệu |
   | Lịch vô lý | `Bắt đầu thực thi` sớm hơn `Môi trường sẵn sàng` · `Phát hành` sớm hơn `Đóng băng mã nguồn` · `Hồi quy từ` sau `Hồi quy đến` |
   | Nhân lực không phủ phạm vi | Cặp module × nền tảng không ai phụ trách |
   | Mâu thuẫn nội bộ | `Loại kiểm thử` → `Tự động hoá: không` nhưng `Nhân lực` có người vai trò `tự động hoá` · hoặc `Chiến lược tự động hoá` có dữ liệu · `Kỹ thuật: ba điểm` mà `Chi tiết ba điểm` trống · `Phi chức năng` khai loại mà `Loại kiểm thử` ghi `không` · `Có dữ liệu thật của khách hàng: có` mà `Cách che dữ liệu` trống · `Thang riêng` có dữ liệu mà `Thang Severity`/`Thang Priority` đều `mặc định` |
   | Lệch công cụ | `Hệ thống CI` khác file CI thật trong repo · `Công cụ` → `Quản lý lỗi` không có Jira mà `Quy trình trạng thái: mặc định` vẫn nhắc đồng bộ Jira |

4. **Chỉ hỏi user** khi: thiếu `Mốc` hoặc `Phạm vi` → `Trong phạm vi` (không lập được plan) · sai cú pháp · sai giá trị · mâu thuẫn ở bước 3. Mọi ô trống khác → ghi `❓`, **không** hỏi

### Nhánh B — không có phiếu

Hỏi **một lượt**, gom theo đúng các nhóm của phiếu (bỏ câu repo đã trả lời):

| # | Nhóm | Câu hỏi |
|---|---|---|
| 1 | `Mốc` | Tên đợt · số build · hệ thống thuộc đợt |
| 2 | `Phạm vi` | Module × nền tảng trong đợt · ngoài phạm vi bổ sung (kèm ai chịu) · có đưa lại REQ ⚪ bị loại vì hạn chế môi trường không |
| 3 | `Lịch` | Duyệt kế hoạch · xong TC · môi trường sẵn sàng · bắt đầu · đóng băng mã nguồn · hồi quy · nghiệm thu · phát hành · **tần suất báo cáo tiến độ** |
| 4 | `Nhân lực` · `Cần tuyển thêm người` | QA Lead · kiểm thử viên × phạm vi · người làm tự động hoá · nhu cầu đào tạo, tuyển thêm |
| 5 | `Môi trường` · `Dữ liệu kiểm thử` · `Công cụ` | Ai dựng · có dùng chung · trình duyệt/thiết bị · dữ liệu nền lấy từ đâu, có dữ liệu thật không, che thế nào, ai dọn · công cụ quản lý lỗi/kết quả và **nguồn chính khi lệch** |
| 6 | `Cấp độ kiểm thử` · `Độc lập kiểm thử` · `Loại kiểm thử` · `Phi chức năng` | Đợt gồm cấp độ nào, ai làm · đội test độc lập tới mức nào · hồi quy · kiểm thử lại lỗi · liên module · tự động hoá · nghiệm thu (ai làm) · cách chạy API · loại phi chức năng nào, đo gì, ngưỡng bao nhiêu |
| 6b | `Chiến lược tự động hoá` | *(chỉ khi có tự động hoá)* Tự động cái gì, không tự động cái gì · chạy khi nào, trên CI nào · ai bảo trì |
| 7 | `Mục tiêu` | Mục tiêu đo được của đợt — hoặc để agent đề xuất |
| 8 | `Ước lượng` · `Ngân sách` | Kỹ thuật ước lượng + con số · có ngân sách riêng không |
| 8b | `Quản lý lỗi` | Dùng quy trình trạng thái và thang Severity/Priority mặc định không · ai phân loại lỗi, họp bao lâu một lần · thời hạn phản hồi/sửa theo Severity |
| 9 | `Tiêu chí` | Bộ tiêu chí ra mặc định hay riêng/bổ sung · ai được chấp nhận dừng khi hết thời gian · ngưỡng tạm dừng |
| 10 | `Kiểm soát tài liệu` · `Bên liên quan` · `Mẫu tài liệu` · `Phê duyệt` · `Chuẩn tổ chức` | Ai lập, ai review · mức phân loại tài liệu · ai nhận gì, tần suất, kênh · mẫu riêng · ai duyệt · mẫu của khách · có Test Policy/Test Strategy tổ chức |

Nhận câu trả lời → **ghi vào `docs/test-plans/test_plan_<slug>.input.yaml`** theo các nhóm và tên ô ở `references/config_form.md`, kèm chú thích giá trị hợp lệ — rồi đi tiếp như Nhánh A. Lần cập nhật sau có phiếu để sửa, không phải hỏi lại từ đầu.

> ### ⚠️ Mục "Ngoài phạm vi" là mục có giá trị pháp lý cao nhất trong plan
>
> Khi có sự cố production, câu hỏi đầu tiên luôn là *"sao QA không test cái này?"*. Plan ghi rõ *"hiệu năng và bảo mật không thuộc phạm vi đợt này"* thì đó là **quyết định đã được thống nhất từ trước**, không phải QA bỏ sót. Module có **nền tảng API mà đợt này không kiểm** phải ghi ở 2.2, không được im lặng chỉ khai phần web.

---

## Bước 3: Tính toán từ dữ liệu đã có

| Mục | Tính gì | Quy tắc |
|---|---|---|
| 7.2 | `ba điểm`: E = (a + 4m + b) / 6 · SD = (b − a) / 6 cho từng hạng mục · **E tổng** = cộng E · **SD tổng** = cộng SD các hạng mục (cách cộng thận trọng — ghi rõ trong plan) | Làm tròn 1 chữ số thập phân · ghi công thức trong plan để người duyệt tính lại được |
| 7.2 | `tỷ lệ` / `ngoại suy` | Chỉ tính khi có số thật: tỷ lệ của tổ chức, hoặc thời lượng thực tế trong `test_summary_*` / `test_progress_*` mốc trước. Không có → `❓`, **không** tự đặt tỷ lệ |
| 7.2 | Đối chiếu công sức với nhân lực × số ngày làm việc giữa `Bắt đầu thực thi` và `Đóng băng mã nguồn` | Thiếu công sức → đưa thành rủi ro ở 8.1, **không** tự sửa con số |
| 7.1 | Thứ trong tuần của các mốc | Mốc rơi vào cuối tuần → ghi chú, cân nhắc rủi ro |
| 4.1 | Trạng thái từng tiêu chí vào **tại ngày lập** | Lấy từ repo; điều kiện tương lai → `❓` kèm ngày dự kiến |
| 9 | Bug đang mở theo Severity × Priority tại ngày lập | Đếm từ `docs/bugs/` — cả hai kiểu thư mục |
| 3.7 | Kích hoạt chạy khớp lịch 7.1 | Bộ `trước phát hành` phải chạy **trước** ngày `Hồi quy đến`; bộ gắn build phải có môi trường sẵn sàng. Lệch → rủi ro 8.1 |

---

## Bước 4: Xuất Master Test Plan

**Trước khi ghi plan:** chép nguyên file phiếu đã dùng (kể cả chú thích) thành `docs/test-plans/test_plan_<slug>.input.yaml` (ghi đè bản lưu cũ của cùng slug — lịch sử nằm ở git và Lịch sử thay đổi của plan).

File: `docs/test-plans/test_plan_<slug>.md` — thư mục **`docs/test-plans/`** (tạo nếu chưa có), cắt ngang mọi module và nền tảng. Plan là tài liệu lập **trước** đợt nên **không** đặt trong `docs/executions/` — nơi chứa kết quả thực thi. **Một mốc một plan**, kể cả khi đợt gồm nhiều hệ thống — phân biệt bằng cột *Hệ thống* ở 2.1.

> **Mẫu đầy đủ của plan:** đọc `references/plan_template.md` trước khi ghi file.

---

## Bàn giao

**Checklist:**

- [ ] Plan ở `docs/test-plans/test_plan_<slug>.md`, **bản lưu phiếu** ở `docs/test-plans/test_plan_<slug>.input.yaml` — cùng slug, là phiếu đã dùng, còn đủ chú thích
- [ ] Phiếu **không** chứa URL có token, mật khẩu, API key
- [ ] Mọi dòng của bảng *Nội dung điển hình theo ISTQB CTFL v4.0 — 5.1.1* đều có mục tương ứng **có nội dung** (hoặc `❓` nằm trong danh sách ô treo)
- [ ] 1.1 mỗi mục tiêu có cột **Đo bằng**
- [ ] 1.2 liệt kê tài liệu cơ sở **kèm phiên bản/ngày**
- [ ] 2.1 khai theo **module × nền tảng**, số liệu lấy từ danh mục
- [ ] 2.2 không trống; mỗi dòng có **người chịu trách nhiệm** và **nguồn quyết định**; đủ ô `➖` bảng 25010 · *Vùng loại khỏi phạm vi* · REQ ⚪
- [ ] REQ ⚪ bị loại vì hạn chế môi trường cũ **không** bị tự đưa lại — nằm ở bảng *REQ cần quyết định lại*
- [ ] Đã quét **cả** tầng nền tảng lẫn kiểu cũ ở `testcases/` · `executions/` · `bugs/`
- [ ] 3.1 mọi cấp độ có cột *Tiêu chí vào/ra* — không để trống
- [ ] 3.4 mức độc lập đã ghi — hoặc `❓` trong danh sách treo
- [ ] 3.2.1 đủ **6 loại** phi chức năng; loại `có` có ngưỡng đo được hoặc `❓` — không số bịa
- [ ] 3.7 có hiện trạng đọc từ repo · phạm vi tự động/không tự động · kích hoạt chạy — hoặc ghi `Không áp dụng`
- [ ] Tiêu chí exit mặc định **khớp nguyên văn** `skills-test-summary-reporter`; tiêu chí dự án thêm nằm ở **bảng bổ sung**, không chen vào bảng mặc định
- [ ] 4.2 có ghi chú *dừng khi hết thời gian/ngân sách* kèm **người có quyền chấp nhận**
- [ ] 5 tách **5.1 Môi trường · 5.2 Dữ liệu kiểm thử · 5.3 Công cụ**; 5.2 nêu rõ có dữ liệu thật của khách hàng không
- [ ] 9.2 · 9.3 thang mặc định **khớp nguyên văn** `skills-bug-reporter`; 9.4 thời hạn xử lý không có số bịa; số bug đang mở đếm từ `docs/bugs/`
- [ ] 7.2 có kỹ thuật ước lượng + giả định; three-point có công thức; đã đối chiếu với năng lực nhân lực
- [ ] 7.3 đã điền hoặc ghi rõ *không có ngân sách riêng*
- [ ] 8.1 rủi ro dự án tách bạch 8.2 rủi ro sản phẩm; 8.2 có link về tài liệu nguồn
- [ ] Mọi ô không suy ra được là `❓`, **không có số bịa**; danh sách ô treo nằm **đầu** tài liệu
- [ ] Đầu tài liệu có mục **Kiểm soát tài liệu**: trạng thái đúng 1 trong 4 giá trị · người lập · người review · người phê duyệt · mức phân loại
- [ ] 12.1 đủ dòng cho mọi mục và mục con; cột IEEE 829 ghi **829-1998**; ghi rõ 3.7 và 9 là phần mở rộng
- [ ] 12.2 đã điền hoặc ghi `Không áp dụng` — nhắc cả **Test Policy** lẫn **Test Strategy**
- [ ] **Không** có số điều khoản 29119-3/829; **không** câu "tuân thủ ISO/IEC/IEEE 29119" hay "đạt chuẩn ISTQB"

**Báo cáo cho user:** số cặp module × nền tảng · số ô treo (liệt kê) · mâu thuẫn giữa phiếu và repo (nếu có) · công sức ước lượng so với năng lực · rủi ro dự án đáng chú ý nhất · đường dẫn plan + phiếu · nhắc gửi duyệt trước khi thực thi.

---

## Cập nhật plan giữa đợt

Phạm vi/lịch/nhân lực đổi → **sửa `docs/test-plans/test_plan_<slug>.input.yaml` rồi chạy lại workflow**, không viết plan lại từ đầu. Plan là tài liệu được duyệt — viết đè làm mất dấu vết thứ đã thống nhất.

1. So **dữ liệu** phiếu mới với bản lưu `test_plan_<slug>.input.yaml` (bỏ qua chú thích) và plan hiện có → liệt kê **đúng các mục đổi**, cho user xác nhận
2. Sửa đúng các mục đó trong `test_plan_<slug>.md`, giữ nguyên tên file
3. Tăng phiên bản: đổi nội dung (phạm vi · lịch · nhân lực) → tăng số phụ `v1.0 → v1.1`; đổi phạm vi lớn hoặc đổi bộ tiêu chí exit → tăng số chính `v2.0`
4. Thêm dòng vào **Lịch sử thay đổi**: mục nào · đổi gì · ai sửa
5. Trạng thái về `🟨 Draft`, thêm dòng mới ở bảng **Phê duyệt** (mục 11) — bản duyệt cũ **không** tự áp cho bản mới
6. ⚠️ **Đổi tiêu chí exit sau khi đã thực thi** → ghi rõ lý do và thời điểm. Báo cáo tổng hợp sẽ nêu việc này — đổi ngưỡng sau khi đã thấy số là đúng thứ `skills-test-summary-reporter` cấm
