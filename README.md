# Team QA Chí Doanh — Claude Testing Skills 🚀

👋 Đây là bộ **Rules · Skills** dùng chung của **Team QA Chí Doanh** trên **Claude Code** (CLI, Desktop và extension VS Code).

Repo gom sẵn thiết lập, quy tắc hành vi (Rules) và các **skill** để cả team dùng AI Agent theo cùng một quy trình — cho cả **Manual Testing** lẫn **Automation Testing**, từ phân tích yêu cầu, thiết kế test case, thực thi, báo bug đến báo cáo release.

**Cách team làm việc:**

- 📋 **Ticket / user story nằm trên Google Sheet** — đọc bằng skill `/fetch-gsheet-requirements`.
- 📝 **Mọi kết quả lưu thành file `.md`** trong `docs/` — requirements, test case, execution report, bug report, báo cáo. Không đẩy lên công cụ ngoài.
- 🧩 **Mọi quy trình là skill** Gọi skill bằng cách gõ `/<tên-skill>` hoặc nói yêu cầu bằng lời để Claude tự chọn skill khớp.

> 🔌 **Lần đầu cài đặt?** Đọc **[SETUP_CLAUDE.md](SETUP_CLAUDE.md)** — add **Playwright MCP**, kết nối **Google Drive / Slack / GitHub / Claude in Chrome / Figma**, và setup **Cowork Schedule** để chạy task theo lịch.
>
> 🔄 **Cài xong rồi, chạy cái gì trước?** Đọc **[AI_FULL_FLOW_MANUAL.md](AI_FULL_FLOW_MANUAL.md)** — quy trình 8 chặng cho tình huống phổ biến nhất: hệ thống chỉ có UI, không tài liệu, không bộ test cases. Từ `/discover-system` → requirements → test cases → chạy tay → bug report → retest → ma trận truy vết → báo cáo release.
>
> 🤖 **Đã có bộ test cases, muốn viết script?** Đọc **[AI_FULL_FLOW_AUTOMATION.md](AI_FULL_FLOW_AUTOMATION.md)** — quy trình 8 chặng Automation: `/generate-automation-framework` → sinh script → review code → chạy & tự sửa → bảo trì khi UI/requirements đổi → RTM → lưu kết quả thành file `.md`.

---

## 👥 Thành Viên Team QA Chí Doanh

> ✏️ Điền tên thật của team vào bảng dưới.

| Thành viên | Vai trò | Phụ trách |
|---|---|---|
| `<Họ tên>` | QA Lead | Duyệt test plan, test case · báo cáo release |
| `<Họ tên>` | Automation Engineer | Framework · script automation · CI |
| `<Họ tên>` | Manual Tester | Viết & chạy test case · báo bug |
| `<Họ tên>` | Manual Tester | Viết & chạy test case · báo bug |

---

## 🌟 Tính Năng Nổi Bật

- **🔁 Quy Trình AI Hoàn Thiện (End-to-End):** Được xây dựng thành một quy trình ứng dụng AI khép kín — từ phân tích yêu cầu (Requirements), thiết kế test cases (Manual), đến viết script tự động (Automation), tích hợp CI/CD và báo cáo kết quả — tất cả đều có AI hỗ trợ.
- **📋 Manual Testing Tiêu Chuẩn Cao (AI-RBT Framework):**
  - Đánh giá rủi ro theo 3 mức độ `High / Medium / Low Risk`.
  - Checklist validation **15 loại Input Field Types** (Text, Email, Phone, Date, Number, Dropdown, Checkbox/Radio, File Upload, Password, Textarea, OTP/MFA, Date Range, Rich Text, Multi-Select, Range Slider).
  - Tích hợp Scenarios Chuyên Sâu & Non-Functional (Race Condition, Session/Network Resilience, Localization/UTF-8/Emoji, Keyboard A11y, HTTP Status Codes).
  - **AI Self-Quality Gate (7 Tiêu chí):** Đảm bảo Unique TC ID, Step-Expected 1-1, Concrete Test Data, Field Coverage, Automation Metadata Ready, Requirement Coverage (đối soát mọi REQ có ≥1 TC), và **Evidence-verified** (bắt buộc mở hết ảnh evidence trước khi sinh TC — đối soát ảnh nào chống lưng cho TC nào).
  - **Truy vết REQ ID xuyên suốt:** Requirements được gán mã `REQ-<MODULE>-<SỐ>` → mỗi TC có cột `REQ ID` → Bảng Đối Soát Coverage chứng minh "đủ case", sẵn sàng cho `/generate-traceability-matrix`.
- **🌐 API Testing & OWASP Security Standards:**
  - Bao phủ đủ **12 HTTP Status Codes** tiêu chuẩn (`200`, `201`, `400`, `401`, `403`, `404`, `406`, `409`, `413`, `415`, `429`, `500`).
  - Tích hợp **OWASP API Security Checklist** (BOLA/IDOR, Mass Assignment, SQLi/XSS, ReDoS, Sensitive Data Masking).
  - Response time SLA (< 2 giây), Dynamic Auth Token, Teardown/Cleanup test data tự động.
- **🧠 Tối ưu cho QA/Tester:** Tất cả các prompt, rule và skill đều được tinh chỉnh dựa trên tư duy và quy trình làm việc thực tế của cả **Manual Tester** lẫn **Automation Engineer**.
- **💻 Hỗ trợ Đa Nền Tảng:** Tương thích với các framework phổ biến như Web (Playwright, Selenium), Mobile (Appium), và API (Playwright API, REST Assured, Pytest Requests, Supertest).
- **🛡️ Tuân thủ Tiêu Chuẩn Cao (Strict Rules):** Đảm bảo AI luôn đi theo cấu trúc Page Object Model (POM), viết code rõ ràng, không đoán bừa locator và tự động sửa lỗi (Self-fix).
- **🇻🇳 Giao Tiếp Bằng Tiếng Việt:** AI được cấu hình để trao đổi, giải thích và báo cáo hoàn toàn bằng Tiếng Việt, thân thiện với người dùng Việt Nam.

---

## 📂 Cấu Trúc Thư Mục Chính

Repo chia làm 2 phần rõ rệt: **khung** (dùng lại cho mọi dự án) và **đầu ra** (dữ liệu của dự án đang làm).

```
claude-testing-skills-QA-CD/
│
│ ══════════ KHUNG — dùng lại cho mọi dự án ══════════
├── .claude/
│   ├── rules/               # 7 quy tắc bắt buộc AI phải tuân theo
│   ├── skills/              # 65 skill: 23 skill nền tảng (skills-*) + 42 skill workflow gọi bằng /tên-skill
│   ├── agents/              # 2 subagent review độc lập: testcase-reviewer · bug-report-reviewer (tự gọi sau khi sinh TC / bug)
│   └── settings.json        # Cấu hình quyền hạn cho Claude Code
├── plans/
│   └── master-test-plan/    # Phiếu YAML đầu vào cho skill /generate-master-test-plan (điền rồi gọi skill)
├── prompts/                 # Prompt mẫu 00–37 dùng nhanh (copy → paste → gửi)
├── scripts/
│   ├── testcases-viewer/    # Công cụ web xem/lọc test case
│   ├── execution-viewer/    # Công cụ web xem kết quả chạy, so sánh các lần chạy
│   ├── traceability-viewer/ # Công cụ web xem ma trận truy vết — độ phủ REQ theo module/Story, TC chưa automate, gap
│   ├── bugs-viewer/         # Công cụ web lọc bug theo Severity/Priority/Trạng thái, xem lịch sử retest
│   ├── design-compare/      # Bộ đo so thiết kế Figma ↔ UI thật (figma_extract.js · collect_dom.js · dc.py)
│   ├── gsheet/              # Đọc ticket từ Google Sheet → bản chụp .md (gsheet_fetch.py)
│   └── design-review-viewer/ # Công cụ web lọc DIFF thiết kế, xem ảnh Figma | App
├── CLAUDE.md                # Rule chung cho AI Agent (Claude Code đọc tự động)
├── memories/                # Bộ nhớ repo — MEMORY.md là bản đồ; team/ · repo/ · lessons/ · systems/
├── SETUP_CLAUDE.md          # Hướng dẫn cài Playwright MCP, Connectors & Cowork Schedule
├── AI_FULL_FLOW_MANUAL.md      # Quy trình 8 chặng Manual Testing — chạy skill nào, theo thứ tự nào
├── AI_FULL_FLOW_AUTOMATION.md  # Quy trình 8 chặng Automation — nối tiếp từ bộ TC đã review
│
│ ══════════ ĐẦU RA — dữ liệu của dự án đang làm ══════════
├── docs/
│   ├── requirements/
│   │   ├── README.md                          # DANH MỤC module: prefix đã chiếm, mã REQ kế tiếp
│   │   ├── _discovery/                        # bản đồ hệ thống: system_map.md (web + mobile) · api_map.md · sources/gsheet_*.md (bản chụp ticket)
│   │   └── <module>/                          # MỘT nghiệp vụ = MỘT thư mục, chung mọi nền tảng
│   │       ├── REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md       # INDEX — tên file bất biến: phần chung + Bản đồ tài liệu
│   │       ├── web/                           # TẦNG NỀN TẢNG — chỉ 3 tên: web · mobile · api
│   │       │   ├── requirements_<module>_web.md
│   │       │   ├── evidence/*.png             # ảnh chụp khi khảo sát
│   │       │   └── stories/                   # khi file nền tảng bị tách
│   │       ├── mobile/                        # requirements_<module>_mobile.md · evidence/android_*.png · ios_*.png
│   │       ├── api/                           # requirements_<module>_api.md — Endpoint Catalog
│   │       ├── analysis/                      # phân tích ticket của module
│   │       └── impact/                        # Impact Report theo ticket
│   ├── testcases/
│   │   ├── README.md                          # DANH MỤC bộ TC: prefix TC ID, độ phủ REQ↔TC
│   │   └── <module>/
│   │       ├── TEST_CASES_<TÊN_MODULE>_SUMMARY.md         # INDEX — tên file bất biến, không chứa dòng TC
│   │       └── web/ · mobile/ · api/          # test_cases_<module>_<nền-tảng>.md · parts/ khi > 40 TC
│   ├── checklists/                            # checklist tick tay — <module>/<nền-tảng>/checklist_<loại>_<YYYYMMDD>.md · _release/<nền-tảng>/
│   ├── executions/
│   │   ├── _release/<nền-tảng>/run_<timestamp>/  # chạy checklist release-readiness
│   │   └── <module>/<nền-tảng>/run_<timestamp>/
│   │       ├── execution_report.md
│   │       └── evidence/*.png
│   ├── traceability/traceability_matrix.md    # RTM — tên file bất biến, ghi đè tại chỗ
│   ├── bugs/                                  # Bug report sinh từ TC FAIL
│   │   ├── README.md                          # DANH MỤC bug — có cột Nền tảng
│   │   └── <module>/<nền-tảng>/BUG_<module>_<ts>_<TC_ID>.md
│   ├── design-reviews/                        # So thiết kế Figma ↔ UI thật — DIFF + ảnh đặt cạnh nhau
│   │   └── <module>/<nền-tảng>/run_<timestamp>/design_compare_report.md
│   └── user-guides/                           # Hướng dẫn sử dụng cho người dùng cuối
│       ├── README.md                          # DANH MỤC — module × role × phiên bản phần mềm
│       └── <module>/user_guide_<module>.md    # INDEX — tên file bất biến
```

> **Chuyển sang dự án mới:** chỉ cần xoá phần **ĐẦU RA** — `rm -rf docs memories/systems .playwright-mcp task.md .claude/settings.local.json`. Agent tự tạo lại cấu trúc `docs/` ở lần chạy skill đầu tiên. Chi tiết xem [CLAUDE.md](CLAUDE.md) mục 6b.

### `.claude/` — Bộ não của AI Agent trên Claude Code

| Thư mục         | Vai trò                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `skills/` — workflow | 42 skill workflow (không có tiền tố `skills-`), gọi bằng `/tên-skill`: `/discover-system`, `/fetch-gsheet-requirements`, `/compare-ui-from-figma-design`, `/generate-automation-web`, `/generate-automation-mobile`, `/generate-automation-api`, `/generate-testcases-api`, `/generate-requirements-from-website`, `/generate-requirements-from-mobile`, `/generate-requirements-from-api`, `/update-requirements-from-ticket`, `/generate-testcases-manual-rbt`, `/update-testcases-from-impact`, `/generate-automation-from-testcases`, `/update-automation-from-impact`, `/run-and-fix-tests`, `/heal-locators`, `/review-automation-code`, `/execute-test-cases`, `/retest-fixed-bugs`, `/analyze-test-report`, `/create-bug-report`, `/review-testcases`, `/generate-traceability-matrix`, `/generate-master-test-plan`, `/generate-test-progress-report`, `/generate-test-summary-report`, `/analyze-defect-trends`, `/assess-release-risk`, `/select-regression-tests`, `/generate-user-guide`, `/generate-api-mocks`... |
| `rules/`        | 7 quy tắc bắt buộc: automation chung, reporting (Allure), locator strategy, Playwright, Selenium, Appium, so thiết kế Figma                                                                                                                                                                                                                                                                                                                                                                |
| `skills/` — nền tảng | 23 skill nền tảng (tiền tố `skills-`), được skill workflow nạp: requirements analyzer, **figma design comparator**, automation engineer, manual testing, manual test executor, UI debug (web), **mobile debug (Appium — Native/Flutter/Hybrid)**, locator healer, test data generator, framework architect, **google sheet integration** (đọc ticket thay Jira), bug reporter, test report analyzer, **test progress reporter**, **test summary reporter**, **quality insights** (xu hướng lỗi · rủi ro release · chọn test), **user guide writer** (DOC/LIVE/VIDEO · ảnh + video có highlight · đa ngôn ngữ · HTML nhúng media), testcase reviewer, automation code reviewer, coverage traceability, api mocking...                                                                                                                              |
| `settings.json` | Cấu hình quyền hạn: cho phép/cấm các hành động cụ thể (đọc file, chạy test, push code...). Riêng `settings.local.json` là cấu hình **cục bộ từng máy** — đã gitignore, không commit                                                                                                                                                                                                                                                                 |

> **📌**Mỗi quy trình là một skill `.claude/skills/<tên-skill>/SKILL.md` (kebab-case; skill workflow **không** có tiền tố `skills-`, skill nền tảng có tiền tố `skills-`). Gọi skill bằng `/<tên-skill>` — VD `.claude/skills/generate-automation-from-testcases/SKILL.md` → `/generate-automation-from-testcases` — hoặc mô tả việc cần làm, Claude tự chọn skill có mô tả khớp.

---

## `plans/` — Phiếu Đầu Vào

Chứa phiếu người dùng **tự điền** — thứ agent không suy ra được từ hệ thống hay `docs/`. Các quy trình nhiều bước (AI-RBT 6 bước, automation, cross-module) đã nằm trọn trong skill, gọi bằng `/tên-skill`.

| Thư mục                   | Nội dung                                                                                                                         | Dùng với                     |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| `plans/master-test-plan/` | Phiếu `test_plan.config.yaml` (tên ô tiếng Việt, chú thích giá trị hợp lệ) + mẫu đã điền đủ `test_plan.template.yaml` (hệ thống hư cấu ShopMini — chỉ để tham khảo cách điền) | `/generate-master-test-plan` |

**Cách dùng:** Điền `plans/master-test-plan/test_plan.config.yaml` → gọi skill `/generate-master-test-plan`. Không muốn điền tay → gọi skill kèm tên mốc, agent hỏi một lượt rồi tự ghi vào phiếu.

### `prompts/` — Prompt Mẫu Dùng Nhanh

Dành cho tác vụ **đơn lẻ**, chỉ cần copy → thay `[...]` bằng dữ liệu thực → paste → gửi.

| #   | Prompt                                          | Mục đích                                                                |
| --- | ----------------------------------------------- | ----------------------------------------------------------------------- |
| 00  | `prompt_00_discover_system.txt`                 | **[Mới]** Khám phá hệ thống chưa có tài liệu — bản đồ module + prefix   |
| 01  | `prompt_01_generate_requirements.txt`           | Phân tích website sinh Requirements                                     |
| 02  | `prompt_02_generate_test_cases.txt`             | **[Mới]** Sinh manual TCs RBT chuẩn 15 field types & Quality Gate       |
| 03  | `prompt_03_create_framework_playwright.txt`     | Dựng framework Playwright TS                                            |
| 03  | `prompt_03_create_framework_selenium.txt`       | Dựng framework Selenium Java                                            |
| 03  | `prompt_03_create_framework_appium.txt`         | Dựng framework Appium Java (Mobile)                                     |
| 04  | `prompt_04_generate_script_playwright.txt`      | Viết test script Playwright TS                                          |
| 04  | `prompt_04_generate_script_selenium.txt`        | Viết test script Selenium Java                                          |
| 05  | `prompt_05_convert_manual_to_automation.txt`    | Chuyển manual TC sang automation                                        |
| 06  | `prompt_06_review_automation_code.txt`          | **[Mới]** Review chất lượng automation code theo Definition of Done     |
| 07  | `prompt_07_generate_test_data.txt`              | Sinh test data có cấu trúc                                              |
| 08  | `prompt_08_analyze_flaky_tests.txt`             | Phân tích test không ổn định                                            |
| 09  | `prompt_09_generate_api_tests.txt`              | **[Mới]** Viết test API 12 status codes & OWASP Security                |
| 10  | `prompt_10_create_bug_report.txt`               | **[Mới]** Sinh bug report chuẩn từ test FAIL, lưu file `.md` trong `docs/bugs/` |
| 11  | `prompt_11_analyze_test_report.txt`             | **[Mới]** Phân tích test report, gom nhóm failure theo root cause       |
| 12  | `prompt_12_review_testcases.txt`                | **[Mới]** Review chất lượng manual TCs theo rubric 6 tiêu chí · Mode AUTOMATION: TC nào làm automation được |
| 13  | `prompt_13_generate_traceability_matrix.txt`    | **[Mới]** Sinh ma trận truy vết RTM 3 tầng                              |
| 14  | `prompt_14_generate_api_mocks.txt`              | **[Mới]** Sinh API mocks + tests cho edge cases                         |
| 15  | `prompt_15_generate_checklist.txt`              | **[Mới]** Sinh checklist tick tay (smoke / regression / release)        |
| 16  | `prompt_16_execute_test_cases.txt`              | **[Mới]** Thực thi manual TC trên browser thật, xuất execution report   |
| 17  | `prompt_17_run_and_fix_tests.txt`               | **[Mới]** Chạy suite có sẵn, phân loại failure, tự sửa nhóm sửa được    |
| 18  | `prompt_18_heal_locators.txt`                   | **[Mới]** Rà & sửa locator trong Page Object sau khi UI đổi             |
| 19  | `prompt_19_update_automation_from_impact.txt`   | **[Mới]** Cập nhật script đã có theo Impact Report (delta mode)         |
| 20  | `prompt_20_analyze_requirement_document.txt`    | **[Mới]** Phân tích ticket/tài liệu → tài liệu phân tích, KHÔNG sinh TC |
| 21  | `prompt_21_update_requirements_from_ticket.txt` | **[Mới]** Cập nhật requirements từ ticket (delta mode) + Impact Report  |
| 22  | `prompt_22_generate_testcases_quick.txt`        | **[Mới]** Sinh manual TCs QUICK mode — 1 lượt, không qua 6 bước RBT     |
| 23  | `prompt_23_retest_fixed_bugs.txt`               | **[Mới]** Retest bug đã fix + regression quanh vùng fix                 |
| 24  | `prompt_24_generate_test_summary_report.txt`    | **[Mới]** Báo cáo tổng hợp tại mốc release — khuyến nghị go/no-go       |
| 25  | `prompt_25_generate_master_test_plan.txt`       | **[Mới]** Master Test Plan — phạm vi, tiêu chí vào/ra, lịch, rủi ro     |
| 26  | `prompt_26_generate_automation_mobile_flow.txt` | **[Mới]** Sinh automation Appium từ flow chạy thật — Native/Flutter/Hybrid |
| 27  | `prompt_27_update_testcases_from_impact.txt`    | **[Mới]** Cập nhật TC đã có theo Impact Report (delta mode), giữ TC ID  |
| 28  | `prompt_28_generate_user_guide.txt`             | **[Mới]** Hướng dẫn sử dụng cho người dùng cuối — tổ chức theo việc cần làm  |
| 29  | `prompt_29_generate_requirements_from_api.txt`  | **[Mới]** Sinh REQ cho module API từ Swagger/Scalar/Postman — kiểm chứng bằng gọi thật |
| 30  | `prompt_30_generate_requirements_from_mobile.txt` | **[Mới]** Sinh REQ cho module trên app mobile — Native/Flutter/Hybrid, qua Appium MCP |
| 31  | `prompt_31_generate_automation_api.txt`         | **[Mới]** Sinh automation API từ file TC API — fixture 2 tài khoản BOLA, dọn dữ liệu |
| 32  | `prompt_32_generate_test_progress_report.txt`   | **[Mới]** Báo cáo tiến độ một kỳ trong đợt — so với lịch plan, trở ngại, rủi ro mới |
| 33  | `prompt_33_compare_ui_from_figma_design.txt`  | **[Mới]** So thiết kế Figma với UI thật — WEB / MOBILE-WEB / MOBILE, ghi DIFF kèm ảnh khoanh đúng/sai |
| 34  | `prompt_34_analyze_defect_trends.txt`         | **[Mới]** Xu hướng lỗi & vấn đề lặp lại toàn dự án — nhóm nguyên nhân gốc, điểm nóng module × nền tảng |
| 35  | `prompt_35_assess_release_risk.txt`           | **[Mới]** Chấm rủi ro release theo module × nền tảng — 5 yếu tố minh bạch, không go/no-go |
| 36  | `prompt_36_select_regression_tests.txt`       | **[Mới]** Chọn + xếp hạng TC cho một thay đổi trong quỹ phút — danh sách dán thẳng cho `/execute-test-cases` |
| 37  | `prompt_37_fetch_gsheet_requirements.txt`     | **[Mới]** Lấy ticket / user story từ **Google Sheet** theo mã ticket · module · trạng thái → bản chụp `.md` |

> Danh mục đầy đủ chia theo 8 nhóm tra cứu: [`prompts/README.md`](prompts/README.md)

---

## ✳️ Hướng Dẫn Sử Dụng Trong Claude Code

### Cách 1: Claude Code CLI (Terminal)

1. **Clone repo này về máy** — hoặc chỉ copy thư mục `.claude` + file `CLAUDE.md`.

2. **Tích hợp vào dự án:** copy `.claude` và `CLAUDE.md` vào thư mục gốc của dự án Automation hoặc Manual Test đang làm.

3. **Mở terminal và khởi chạy Claude Code:**

   ```bash
   claude
   ```

   Claude Code tự nhận thư mục `.claude` và file `CLAUDE.md` ở thư mục gốc, áp dụng ngay Rule và Skill của team.

4. **Gọi skill:**
   Gõ `/` trong Claude Code để xem danh sách skill, chọn skill cần dùng. Ví dụ:
   ```
   /fetch-gsheet-requirements
   /generate-testcases-manual-rbt
   /generate-automation-from-testcases
   ```
   Hoặc nói thẳng yêu cầu (*"lấy ticket TK-12 trên sheet rồi phân tích"*) — Claude tự chọn skill có mô tả khớp.

### Cách 2: Claude Code trong VS Code

1. **Cài extension Claude Code** từ VS Code Marketplace.

2. **Mở dự án** đã chứa thư mục `.claude` trong VS Code.

3. **Mở Claude Code panel** (Ctrl+Shift+P → "Claude Code: Open").

4. **Bắt đầu trò chuyện** — Claude Code tự nhận cấu hình `.claude` và `CLAUDE.md`.

### Bước tiếp theo: Kết nối công cụ → [SETUP_CLAUDE.md](SETUP_CLAUDE.md)

Copy `.claude` vào dự án là AI đã có **Rule / Skill**. Để AI **mở được browser thật**, **đọc ticket trên Google Sheet riêng tư**, hay **gửi báo cáo vào Slack**, cần kết nối thêm công cụ.

📖 **Xem hướng dẫn đầy đủ tại [SETUP_CLAUDE.md](SETUP_CLAUDE.md):**

| Nội dung | Vì sao cần |
| --- | --- |
| **Cài Playwright MCP thủ công** (Developer → Local MCP Server) | **Bắt buộc** cho `/discover-system`, `/execute-test-cases`, `/generate-requirements-from-website`, `/generate-automation-web` — không có thì AI không mở được browser |
| **Connectors: Google Drive / Slack / GitHub / Claude in Chrome** | Đọc ticket trên Google Sheet riêng tư (sheet chia sẻ link thì không cần), gửi report vào Slack, đọc log CI từ GitHub Actions |
| **Cowork Schedule** — tự động chạy task theo lịch | Ví dụ sẵn: mỗi sáng đọc task từ Slack và ước lượng effort · cuối ngày tổng hợp kết quả GitHub Actions gửi vào kênh Slack |
| **Checklist nghiệm thu & bảng lỗi thường gặp** | Xử lý nhanh `spawn npx ENOENT` trên Windows, connector kẹt OAuth, task chạy sai múi giờ |

> ⚡ **Cài nhanh nhất:** nếu chỉ cần Playwright MCP cho Claude Code CLI, chạy đúng 1 lệnh ở thư mục gốc dự án:
>
> ```bash
> claude mcp add --scope project playwright -- npx -y @playwright/mcp --viewport-size "1600,750" --config ".claude/playwright-mcp-config.json"
> ```
>
> `1600×750` là viewport headed vừa màn hình 1920×1080 — cửa sổ browser **không nở được sau khi launch**, nên đặt ở đây chứ không resize sau. Màn hình khác thì tính lại theo công thức trong [SETUP_CLAUDE.md](SETUP_CLAUDE.md) mục 1.4.

---

## 📄 Giấy Phép & Nguồn Gốc

Repo dùng nội bộ cho **Team QA Chí Doanh** — kiểm tra điều khoản giấy phép của bản gốc trước khi chia sẻ repo ra ngoài team.

---

**Team QA Chí Doanh** 🎯
