---
name: generate-application-test-plan
description: Khám phá ứng dụng web, sinh test scenarios theo rủi ro, đối chiếu scenario với REQ để cảnh báo phần thiếu. Hỗ trợ 2 mode — PLAN (chỉ scenario) và FULL (scenario rồi điều phối các workflow chuẩn sinh REQ, TC, automation).
---

> **Skill nền tảng cần nạp trước:** `skills-qa-automation-engineer` · `skills-requirements-analyzer` · `skills-ui-debug-agent` — đọc `.claude/skills/<tên-skill>/SKILL.md` của từng skill trước khi bắt đầu.

# Workflow: Khám Phá Ứng Dụng & Sinh Test Plan

> **BẮT BUỘC (MANDATORY SKILL):** Bạn PHẢI nạp và đọc kỹ nội dung của skill **`skills-qa-automation-engineer`** (tại `.claude/skills/skills-qa-automation-engineer/SKILL.md`) trước khi bắt đầu. Ngoài ra, tham khảo thêm skill **`skills-requirements-analyzer`** và **`skills-ui-debug-agent`** để hỗ trợ phân tích UI.

Workflow này giúp agent tự động khám phá một ứng dụng web, phân tích cấu trúc, xác định các modules/user flows quan trọng, và sinh ra Test Plan hoàn chỉnh.

## ⚠️ Nguyên tắc thực thi

- **Tất cả output bằng Tiếng Việt**
- **KHÔNG đoán** cấu trúc app — phải inspect DOM thực tế qua MCP/browser tools
- **Phải chờ user xác nhận** scope tại Bước 2 trước khi sinh chi tiết
- Nếu user chưa cung cấp URL → hỏi trước khi bắt đầu

## 2 Chế độ (Mode)

| Mode | Khi nào sử dụng | Output |
|---|---|---|
| **PLAN** (mặc định) | User cần khám phá app, lập test plan, xác định scenarios | Modules, User Flows, Test Scenarios, Priority |
| **FULL** | User yêu cầu thêm test case, automation hoặc nói "full automation suite" | Như PLAN, rồi gọi các workflow chuẩn sinh REQ, TC, automation cho module đã chọn |

> Nếu user nói "generate full automation suite", "bootstrap automation", hoặc yêu cầu code → tự động chuyển sang **Mode FULL**.

## ⚠️ Chọn đúng workflow — đừng nhầm với `/discover-system`

Hai workflow cùng bắt đầu bằng "khám phá app" nhưng **đi về hai đích khác nhau**:

| Mục tiêu của user | Workflow đúng | Đầu ra |
|---|---|---|
| *"Hệ thống này không có tài liệu, tôi cần **tài liệu requirements**"* | **`/discover-system`** → rồi `/generate-requirements-from-website` từng module | `docs/requirements/` — có **REQ ID** truy vết được |
| *"Tôi cần biết **test cái gì trước**, lập kế hoạch kiểm thử"* | **Workflow này** | `test_scenarios_<mốc hoặc YYYYMMDD>.md` — scenarios + priority, **không** cấp REQ ID |

> 📌 **Đã chạy `/discover-system` rồi thì đọc `docs/requirements/_discovery/system_map.md` ở Bước 1** — bản đồ module, entity, phụ thuộc và risk đã có sẵn, không cần crawl lại từ đầu. Chỉ bổ sung phần workflow này cần thêm: user flow chi tiết và scenario.
>
> Ngược lại, workflow này **không thay thế** được `/discover-system`: nó không cấp prefix, không ghi `docs/requirements/README.md`, nên chạy xong vẫn phải khám phá lại nếu sau đó cần sinh requirements.

## Các bước thực hiện

### Bước 1: Tiếp nhận & Khám phá ứng dụng (Recon)

1. Nhận URL ứng dụng từ user
2. Sử dụng **MCP browser tools** (Playwright MCP) để mở ứng dụng:
   - `browser_navigate` → URL
   - `browser_wait_for` → chờ page load (KHÔNG resize — viewport đã đúng từ `--viewport-size` lúc launch)
   - `browser_snapshot` → thu thập cấu trúc DOM
3. Khám phá **navigation menus**, sidebar, header để xác định các modules chính
4. Lần lượt truy cập từng module chính, dùng `browser_snapshot` để ghi nhận:
   - Tên module / trang
   - Các thành phần UI chính (forms, tables, buttons, modals)
   - Các action có thể thực hiện (CRUD, search, filter, export...)
5. Nếu app yêu cầu đăng nhập → dùng fixture sẵn có hoặc tài khoản trong `.env`. Thiếu biến thì báo tên biến, không hỏi giá trị trong chat

### Bước 2: Phân tích & Xác nhận scope (Analysis — CHECKPOINT)

1. Tổng hợp kết quả khám phá thành danh sách:
   - **Modules đã phát hiện** (tên, mô tả ngắn, số lượng features)
   - **User Flows chính** (Happy Path cho mỗi module)
   - **Dependencies** giữa các modules (nếu có)
2. Đánh giá **Risk Level** sơ bộ cho mỗi module bằng ma trận hai trục tác động × khả năng lỗi (`skills-manual-testcase-v3/references/test_types_4_rounds.md`, mục *Chấm mức rủi ro*). Mức của module lấy theo chức năng cao nhất, ghi căn cứ cả hai trục. Khi sinh TC sẽ chấm lại từng chức năng
3. **⏸️ DỪNG LẠI — Trình bày cho user review:**
   - Danh sách modules + risk level
   - User flows đã xác định
   - Hỏi user: "Bạn muốn tập trung vào modules nào? Có flow nào cần bổ sung?"
4. **Chờ user xác nhận** scope trước khi sang Bước 3

### Bước 3: Sinh Test Scenarios & Priority

1. Với mỗi module/flow đã được user xác nhận, sinh test scenarios:
   - **Happy Path** — luồng chính thành công
   - **Negative Path** — nhập sai, thiếu dữ liệu, lỗi validation
   - **Edge Cases** — boundary values, concurrent access, empty states
2. Gán **Priority** cho mỗi scenario dựa trên Risk Level:
   - **P1 (Critical)** — Core flows, regression blockers, dữ liệu nhạy cảm
   - **P2 (High)** — Main features, tính năng sử dụng thường xuyên
   - **P3 (Low)** — Secondary features, UI/UX checks, nice-to-have, cosmetic checks
3. Gán mã `SCN-<MODULE>-<nn>`, dùng prefix ở `docs/requirements/README.md`. Module chưa có prefix thì dùng tên tạm và ghi rõ cần chạy `/discover-system` để cấp prefix. Mã SCN **không** phải REQ: không vào RTM, không dùng tính độ phủ

### Bước 4: Đối chiếu Scenario ↔ REQ (CHECKPOINT cảnh báo)

> **Có REQ không có nghĩa là REQ đã đủ.** Sinh TC chỉ từ REQ thì phần REQ bỏ sót cũng không có TC, trong khi RTM vẫn báo phủ đủ. Scenario lấy từ app thật là nguồn đối chiếu độc lập.

1. Với mỗi module trong phạm vi, đọc `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md`, theo `## Bản đồ tài liệu` đọc file nền tảng, rồi so từng scenario:
   ```markdown
   ⚠️ Đối chiếu Scenario ↔ REQ — module <module>
   | Scenario | Tìm thấy trong app | REQ tương ứng | Kết luận |
   |---|---|---|---|
   | SCN-CUST-04 Xuất Excel danh sách | Có nút Export | — | 🔴 Chưa có REQ |
   | SCN-CUST-07 Khoá khách hàng | Có menu Khoá | REQ-CUST-12 | ✅ |

   Nguồn REQ: <số từ ticket> từ ticket, <số từ UI> từ khảo sát UI · Trạng thái khảo sát: <ở danh mục> · <n>/<tổng> scenario chưa có REQ
   ```
   Dòng `✅` phải ghi mã REQ để người đọc kiểm được. Không chắc thì ghi `❔`, xử lý như `🔴`, không ghi `✅`.
2. **Cảnh báo cả module**, kể cả khi mọi scenario đều khớp:
   - Chưa khảo sát UI, đang khảo sát dở, hoặc REQ chỉ đến từ ticket → nêu rõ, đề xuất `/generate-requirements-from-website`
   - Toàn bộ REQ chép từ UI → nêu rõ chưa có nguồn nào cho thấy tính năng còn thiếu, PO cần rà
3. **⏸️ DỪNG, user chọn cách xử lý từng dòng `🔴` và `❔`:**

   | Lựa chọn | Kết quả |
   |---|---|
   | **Bổ sung REQ** (mặc định) | Thêm REQ `⏳` rồi mới sinh TC cho scenario đó |
   | **Cố ý chưa làm** | `⏭️` kèm lý do, người quyết định, điều kiện rà lại |
   | **Scenario sai** | Bỏ scenario, ghi lý do |

   Không chặn cứng: user vẫn được chạy tiếp, nhưng quyết định và phần còn hở phải ghi vào file scenario và báo cáo cuối. Không tự chọn thay user.

> ⚠️ **Giới hạn phải nêu trong báo cáo:** bước này bắt được thứ có trên app mà thiếu REQ, **không** bắt được tính năng chưa ai làm. Nó cũng không thay Bảng đối soát 4 vòng khi sinh TC.

### Bước 5: Đóng gói kế hoạch (Mode PLAN)

1. Ghi file `docs/test-plans/scenarios/test_scenarios_<mốc hoặc YYYYMMDD>.md`, là ảnh chụp tại một thời điểm, không sửa tại chỗ:
   - **Tổng quan ứng dụng** — mục đích, tech stack (nếu xác định được), URL
   - **Danh sách Modules** — bảng gồm: Module, Mô tả, Risk Level, Số scenarios
   - **User Flows** — mô tả từng flow chính (steps)
   - **Test Scenarios** — bảng: `| ID | Module | Scenario | Priority | Loại (Happy/Negative/Edge) | REQ tương ứng |`
   - **Đối chiếu Scenario ↔ REQ** — bảng, cảnh báo và quyết định ở Bước 4
   - **Automation Candidates** — gợi ý sơ bộ kèm lý do; chốt bằng `/review-testcases` mode AUTOMATION khi đã có TC
   - **Việc tiếp theo** — module theo thứ tự rủi ro, kèm lệnh tiếp theo của từng module
2. Mode PLAN → **KẾT THÚC** tại đây. **Không** sinh TC

### Bước 6: Điều phối các workflow chuẩn (Mode FULL)

> Chỉ thực hiện khi ở **Mode FULL**. Workflow này **không tự viết** TC hay code: TC viết riêng ở đây sẽ thiếu đối chiếu evidence và quality gate, code không chạy thì trái Definition of Done.

Chỉ chạy cho module user chọn ở Bước 2, bắt đầu từ module rủi ro cao. Gọi lần lượt, **giữ nguyên mọi checkpoint** của từng workflow:

| # | Điều kiện | Workflow | Ghi chú |
|---|---|---|---|
| 1 | Chưa có REQ, hoặc có dòng chọn *Bổ sung REQ* | `/generate-requirements-from-website` | Đánh tiếp mã, REQ mới là `⏳`. Sau đó chạy lại Bước 4 cho module |
| 2 | Có REQ, chưa có file TC web | `/generate-testcases-from-requirements` | **Chỉ sinh khi module đã có REQ.** Không ghi `REQ ID` trống. Scenario chỉ để tham khảo, Expected lấy từ REQ |
| 3 | Đã có file TC web | **Không** sinh lại cả file | Sinh lại làm TC ID đánh lại từ đầu, vỡ truy vết. REQ mới chưa có TC → `/generate-testcases-from-requirements` chế độ BỔ SUNG. REQ đã đổi → `/update-testcases-from-impact` |
| 4 | Có TC, user cần automation | `/generate-automation-web` mode TC | Inspect DOM thật, chạy và PASS 2 lần theo workflow đó. Chưa có framework thì `/generate-automation-framework` trước |

User chưa muốn làm requirements → dừng ở Bước 5, không sinh TC.

## Output

### Mode PLAN
- File `docs/test-plans/scenarios/test_scenarios_<mốc hoặc YYYYMMDD>.md`

### Mode FULL
- File scenario như Mode PLAN
- REQ, TC, code và report nằm đúng chỗ của từng workflow đã gọi
- Báo cáo cuối: từng module đã qua bước nào · dòng `⏭️` và phần còn hở · module chưa làm và lý do
