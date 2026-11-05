---
name: analyze-flaky-tests
description: Phân tích automation tests không ổn định (flaky), xác định root cause và tự động khắc phục. Hỗ trợ 2 mode — ANALYZE (chỉ báo cáo) và FIX (báo cáo + tự sửa code).
---

> **Rule phải đọc trước:** `.claude/rules/automation_rules.md` · `.claude/rules/locator_strategy.md` · `.claude/rules/playwright_rules.md` hoặc `.claude/rules/selenium_rules.md` theo framework đang dùng. Các rule này chỉ tự nạp khi đã mở file khớp `paths`, nên workflow phải tự đọc.

> **Skill nền tảng cần nạp trước:** `skills-flaky-test-analyzer` · `skills-smart-locator-agent` · `skills-locator-healer-agent` — đọc `.claude/skills/<tên-skill>/SKILL.md` của từng skill trước khi bắt đầu.

# Workflow: Phân Tích & Khắc Phục Flaky Tests

> **BẮT BUỘC (MANDATORY SKILL):** Bạn PHẢI nạp và đọc kỹ nội dung của skill **`skills-flaky-test-analyzer`** (tại `.claude/skills/skills-flaky-test-analyzer/SKILL.md`) trước khi bắt đầu. Ngoài ra, tham khảo thêm skill **`skills-smart-locator-agent`** và **`skills-locator-healer-agent`** khi cần sửa/thay locator.

Workflow này giúp agent tự động phân tích các automation test không ổn định (lúc pass lúc fail), xác định root cause chính xác, và (tùy mode) tự động sửa code để stabilize test.

## ⚠️ Nguyên tắc thực thi

- **Kiểm môi trường trước khi mở trình duyệt, gọi API hoặc chạy test:** phân loại host theo mục *Môi trường production* của `CLAUDE.md` và ghi kết quả vào report. Không có dấu hiệu môi trường test thì dừng, hỏi user
- **Tất cả output bằng Tiếng Việt**
- **KHÔNG đoán** nguyên nhân — phải phân tích log, code, và DOM thực tế
- **Phải chờ user xác nhận** danh sách fix tại Bước 3 trước khi sửa code (Mode FIX)
- Nếu user chưa cung cấp test file/error log → hỏi trước khi bắt đầu
- ⚠️ Sau khi user xác nhận fix → agent tự sửa + verify, KHÔNG hỏi lại trong quá trình fix

## 2 Chế độ (Mode)

| Mode | Khi nào sử dụng | Output |
|---|---|---|
| **ANALYZE** (mặc định) | User cần hiểu nguyên nhân flaky, chưa muốn sửa code | Báo cáo phân tích + Đề xuất fix |
| **FIX** | User muốn agent tự sửa code luôn | Như ANALYZE + Code đã sửa + Kết quả verify |

> Nếu user nói "sửa luôn", "fix giùm", "khắc phục test này", hoặc yêu cầu agent sửa code → tự động chuyển sang **Mode FIX**.

## Input cần thu thập

Agent cần ít nhất **1 trong các input** sau từ user:

| Input | Cách lấy | Độ ưu tiên |
|---|---|---|
| **Test file path** | User cung cấp hoặc agent tìm trong project | ⭐ Bắt buộc |
| **Error log / stack trace** | User paste hoặc agent chạy test để thu thập | ⭐ Bắt buộc |
| **CI/CD log** | User cung cấp URL hoặc file log | Tùy chọn |
| **Test report** (HTML/JSON) | Playwright report, Allure, TestNG report | Tùy chọn |
| **Lịch sử fail** | Số lần fail / tổng số lần chạy | Tùy chọn |

## Các bước thực hiện

### Bước 1: Thu thập thông tin & Tái hiện lỗi (Detect & Reproduce)

1. **Đọc test file** bằng `Read`:
   - Xác định framework (Playwright / Selenium / Pytest / TestNG)
   - Ghi nhận cấu trúc: Page Objects, fixtures, helper functions
   - Đánh dấu các vùng code nghi ngờ (waits, locators, assertions, setup/teardown)

2. **Chạy test** để tái hiện lỗi (nếu chưa có error log):
   - Chạy test **10 lần liên tiếp**, tắt retry. Test lỗi 10% vẫn có 73% khả năng qua 3 lần, 35% qua 10 lần:
     ```bash
     # Playwright
     npx playwright test <test_file> --retries=0 --repeat-each=10 --reporter=list

     # Pytest
     python -m pytest <test_file> -v --count=10   # cần pytest-repeat

     # Maven/TestNG
     mvn test -Dtest=<TestClass> -Dsurefire.rerunFailingTestsCount=0
     ```
   - Ghi nhận pattern: Fail lần nào? Fail ở step nào? Error message giống hay khác nhau?

3. **Thu thập evidence:**
   - Error log / stack trace từ mỗi lần chạy
   - Screenshots (nếu test có capture on failure)
   - Console log / Network log (nếu liên quan đến API calls)

### Bước 2: Phân tích Root Cause (Inspect & Classify)

1. **Đọc error log** và phân loại theo bảng root cause:

| Category | Dấu hiệu nhận biết | Ví dụ Error |
|---|---|---|
| 🎯 **Locator không ổn định** | `ElementNotFound`, `No matching element`, selector chứa dynamic class/index | `Locator('.css-1a2b3c')` fail vì class thay đổi mỗi build |
| ⏱️ **Timing / Race condition** | `Timeout`, `Element not visible`, test pass khi chạy chậm (debug mode) | `expect(element).toBeVisible()` timeout vì animation chưa xong |
| 📊 **Test data conflict** | `Duplicate key`, `Already exists`, fail khi chạy parallel | 2 test cùng tạo user `test@email.com` |
| 🔄 **State dependency** | Pass khi chạy độc lập, fail khi chạy cùng suite | Test B phụ thuộc data mà Test A tạo ra |
| 🌐 **Environment / Network** | `ECONNREFUSED`, `503`, `CORS error`, fail trên CI nhưng pass local | API server chậm, CDN timeout |
| 🖼️ **UI Animation / Transition** | `Element is not clickable`, `intercept`, fail ngẫu nhiên khi click | Modal animation chưa hoàn thành, overlay che button |
| 📱 **Viewport / Responsive** | Element bị ẩn, scroll không tới, fail ở resolution khác | Button nằm ngoài viewport trên CI (headless 800x600) |
| 🧹 **Cleanup / Teardown** | Fail ở lần chạy thứ 2+, pass lần đầu | Test không cleanup data → lần sau bị conflict |
| 🐛 **Lỗi sản phẩm chập chờn** | Locator, wait, data đều đúng. Ở lần fail, app thật sự trả sai so với REQ | Thỉnh thoảng lưu đơn trả 500, tổng tiền sai khi hai request chạy gần nhau |

> 🐛 không phải lỗi của test. **Cấm** sửa bằng retry, nới assertion hay tăng timeout. Giữ nguyên test, chuyển `/create-bug-report` kèm tần suất x/y và log của lần fail. Không gắn `@KnownBug`, vì expected-fail chặt sẽ đỏ ở lần test pass; ghi mã bug vào báo cáo flaky và báo user.

2. **Inspect code** chi tiết, kiểm tra từng anti-pattern:

   **Locator check:**
   - [ ] Có dùng dynamic class (`css-xxx`, `sc-xxx`, `MuiXxx-root`)? → ❌
   - [ ] Có dùng positional xpath (`//div[3]/button[2]`)? → ❌
   - [ ] Locator có unique không? (kiểm tra trên DOM thực tế nếu cần)

   **Wait strategy check:**
   - [ ] Có `waitForTimeout()` / `Thread.sleep()` / `time.sleep()`? → ❌
   - [ ] Có `waitForSelector()` khi `expect()` đã đủ? → ⚠️
   - [ ] Assertion có timeout phù hợp không?

   **Test data check:**
   - [ ] Data có hardcoded không? (`test@email.com`, `user123`)
   - [ ] Data có unique per run không? (timestamp / random)
   - [ ] Có cleanup data sau test không?

   **Test independence check:**
   - [ ] Test có phụ thuộc thứ tự chạy không?
   - [ ] Test có share state qua global variable không?
   - [ ] Setup/Teardown có đầy đủ không?

3. **Nếu cần inspect DOM thực tế** (locator issue):
   - Mở browser bằng MCP: `browser_navigate` → `browser_wait_for` → `browser_snapshot`
   - So sánh locator trong code vs DOM thực tế
   - Xác định locator thay thế ổn định hơn (dùng skill `skills-smart-locator-agent`)

### Bước 3: Lập báo cáo & Đề xuất fix (Report — CHECKPOINT)

1. **Tạo file** `docs/quality-insights/flaky_analysis_<YYYYMMDD>.md` (gọi tắt `flaky_analysis.md` bên dưới) với cấu trúc:

   ```markdown
   # Báo Cáo Phân Tích Flaky Test

   ## Tổng quan
   - **Test file:** <path>
   - **Framework:** Playwright / Selenium / ...
   - **Tần suất fail:** X/Y lần chạy
   - **Mức độ nghiêm trọng:** 🔴 Critical / 🟡 Medium / 🟢 Low

   ## Root Cause Analysis

   | # | Vị trí (Line) | Category | Mô tả vấn đề | Mức độ |
   |---|---|---|---|---|
   | 1 | test.ts:45 | ⏱️ Timing | waitForTimeout(3000) thay vì smart wait | 🔴 |
   | 2 | page.ts:12 | 🎯 Locator | .css-1abc dynamic class | 🟡 |

   ## Đề xuất Fix

   | # | Vấn đề | Code hiện tại | Code đề xuất | Lý do |
   |---|---|---|---|---|
   | 1 | Hard sleep | `waitForTimeout(3000)` | `expect(el).toBeVisible()` | Smart wait tự retry |
   | 2 | Dynamic class | `.css-1abc` | `getByRole('button', {name: 'Submit'})` | Semantic, không phụ thuộc CSS |
   ```

2. **⏸️ DỪNG LẠI — Trình bày cho user review:**
   - Danh sách root causes đã xác định
   - Bảng đề xuất fix (code cũ → code mới)
   - Hỏi: "Bạn đồng ý với phân tích này không? Tôi tiến hành sửa code luôn hay chỉ cần báo cáo?"

3. Nếu user chọn **Mode ANALYZE** → **KẾT THÚC** tại đây
4. Nếu user đồng ý fix → chuyển sang Bước 4

### Bước 4: Tự động sửa code (Auto-Fix — Mode FIX)

> Chỉ thực hiện khi ở **Mode FIX** và user đã xác nhận

1. **Sửa code** theo thứ tự ưu tiên (fix nghiêm trọng nhất trước):

   **Fix Locator:**
   - Dùng skill `skills-locator-healer-agent` để thay thế locator hỏng
   - Tuân thủ locator priority trong `.claude/rules/locator_strategy.md`
   - Verify locator mới trên DOM thực tế trước khi commit vào code

   **Fix Timing:**
   ```
   ❌ page.waitForTimeout(3000)
   ✅ await expect(page.getByRole('button')).toBeVisible()

   ❌ Thread.sleep(5000)
   ✅ wait.until(ExpectedConditions.visibilityOfElementLocated(...))
   ```

   **Fix Test Data:**
   ```
   ❌ const email = "test@email.com"
   ✅ const email = `auto_${Date.now()}@yopmail.com`
   ```

   **Fix Test Independence:**
   - Thêm setup/teardown để tạo và cleanup data riêng
   - Loại bỏ dependency giữa các test cases
   - Đảm bảo mỗi test tự tạo precondition riêng

2. **Sử dụng** `Edit` để áp dụng thay đổi
3. **Ghi chú** mỗi thay đổi vào file `flaky_analysis.md`

### Bước 5: Verify & Đảm bảo ổn định (Verify Stability)

> Chỉ thực hiện khi ở **Mode FIX**

1. **Chạy test 10 lần liên tiếp** sau khi fix, cùng số worker với CI:
   ```bash
   # Playwright
   npx playwright test <test_file> --retries=0 --repeat-each=10

   # Pytest
   python -m pytest <test_file> -v --count=10   # cần pytest-repeat

   # Maven
   mvn test -Dtest=<TestClass>   # thêm tạm @Test(invocationCount = 10), gỡ sau khi verify
   ```

2. **Đánh giá kết quả:**

   | Kết quả | Hành động |
   |---|---|
   | ✅ **10/10 PASS** | Test đã ổn định → cập nhật file `flaky_analysis.md`, báo cáo thành công |
   | ⚠️ **7–9/10 PASS** | Vẫn còn flaky → quay lại Bước 2 phân tích lần fail, fix tiếp (tối đa 3 vòng) |
   | ❌ **Dưới 7/10 PASS** | Fix sai hướng → dùng `Edit` hoàn tác đúng thay đổi vừa sửa, phân tích lại root cause. Không dùng lệnh git đổi trạng thái code |

3. **Stability Checklist** (phải đạt toàn bộ trước khi kết thúc):
   - [ ] Locator unique và ổn định qua nhiều lần reload
   - [ ] Không có hard sleep / fixed delay
   - [ ] Test data unique + traceable mỗi lần chạy
   - [ ] Test độc lập — không phụ thuộc thứ tự chạy
   - [ ] Test pass **10/10 lần liên tiếp**
   - [ ] Không còn debug log / commented code

4. **Cập nhật file** `flaky_analysis.md`:
   - Thêm section "Kết quả sau fix" với bảng kết quả chạy
   - Đánh dấu trạng thái: ✅ STABILIZED / ⚠️ PARTIALLY FIXED / ❌ STILL FLAKY

## Xử lý các tình huống đặc biệt

| Tình huống | Cách xử lý |
|---|---|
| **Test chỉ fail trên CI** | So sánh env CI vs local (viewport, timezone, headless, resources). Kiểm tra viewport `1920x1080` có được set trên CI không |
| **Test fail khi chạy parallel** | Kiểm tra test data isolation, shared state, database locks. Đề xuất unique data per worker |
| **Test fail sau deploy mới** | Kiểm tra DOM changes, API response changes. Dùng `skills-locator-healer-agent` để update locators |
| **Test fail ngẫu nhiên không pattern** | Thu thập thêm data (chạy 10+ lần), kiểm tra memory leak, resource exhaustion |
| **Multiple tests cùng flaky** | Tìm common factor (shared fixture, shared page object, shared config) |
| **Test fail do external API** | Đề xuất mock/stub external dependencies, retry logic cho API calls |

## Output

### Mode ANALYZE
- File `flaky_analysis.md`:
  - Tổng quan test (file, framework, tần suất fail)
  - Root Cause Analysis (bảng phân loại)
  - Đề xuất fix chi tiết (code cũ → code mới)
  - Stability checklist

### Mode FIX
- Tất cả output của Mode ANALYZE, cộng thêm:
  - Code đã được sửa (các file đã thay đổi)
  - Kết quả verify (10 lần chạy PASS/FAIL)
  - Trạng thái cuối: STABILIZED / PARTIALLY FIXED / STILL FLAKY