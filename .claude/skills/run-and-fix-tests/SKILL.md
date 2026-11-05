---
name: run-and-fix-tests
description: Chạy suite automation có sẵn, phân loại failure theo root cause và tự sửa nhóm sửa được cho đến khi xanh. Hỗ trợ 2 mode — RUN (chạy + báo cáo) và FIX (chạy + sửa + chạy lại).
---

> **Rule phải đọc trước:** `.claude/rules/automation_rules.md` · `.claude/rules/reporting_rules.md` · `.claude/rules/playwright_rules.md` hoặc `.claude/rules/selenium_rules.md` theo framework đang dùng. Các rule này chỉ tự nạp khi đã mở file khớp `paths`, nên workflow phải tự đọc.

> **Skill nền tảng cần nạp trước:** `skills-test-report-analyzer` · `skills-locator-healer-agent` · `skills-flaky-test-analyzer` · `skills-test-data-generator` · `skills-bug-reporter` — đọc `.claude/skills/<tên-skill>/SKILL.md` của từng skill trước khi bắt đầu.

# Workflow: Chạy & Khắc Phục Test Suite

> **BẮT BUỘC (MANDATORY SKILLS):** Nạp và đọc kỹ trước khi bắt đầu:
> - **`skills-test-report-analyzer`** (`.claude/skills/skills-test-report-analyzer/SKILL.md`) — phân loại failure theo root cause
> - **`skills-locator-healer-agent`** (`.claude/skills/skills-locator-healer-agent/SKILL.md`) — sửa nhóm locator gãy
> - **`skills-flaky-test-analyzer`** (`.claude/skills/skills-flaky-test-analyzer/SKILL.md`) — sửa nhóm chập chờn

Workflow dành cho **suite đã tồn tại** — chạy regression/smoke hằng ngày, phân loại lỗi, tự sửa phần QA sửa được, và tách riêng phần phải báo dev.

## Workflow này khác gì các workflow lân cận?

| | Workflow này | `analyze-test-report` | `generate-automation-from-testcases` |
|---|---|---|---|
| **Điểm bắt đầu** | Suite code có sẵn, chưa chạy | Report **đã có** | Manual TC, chưa có code |
| **Có chạy test không** | ✅ Chạy, và chạy lại sau khi sửa | ❌ Chỉ đọc report | ✅ Chạy trong lúc sinh code |
| **Có sửa code không** | ✅ Mode FIX | ❌ Chỉ đề xuất | ✅ Auto-heal khi sinh |
| **Dùng khi** | "Chạy regression đi", "suite đỏ, xử lý giùm" | "Đọc giùm report này" | "Automate bộ TC này" |

## ⚠️ Nguyên tắc thực thi

- **Kiểm môi trường trước khi mở trình duyệt, gọi API hoặc chạy test:** phân loại host theo mục *Môi trường production* của `CLAUDE.md` và ghi kết quả vào report. Không có dấu hiệu môi trường test thì dừng, hỏi user
- **Tất cả output bằng Tiếng Việt**
- 🚨 **CẤM tuyệt đối: sửa test cho xanh khi nguyên nhân là bug của app.** Không nới lỏng assertion, không đổi expected value theo actual, không thêm retry để né, không `skip`/`.only`/`@Ignore` để giấu. Nhóm 🐛 App Bug giữ nguyên assertion: chưa có bug thì sang `/create-bug-report`, có bug đang mở thì gắn `@KnownBug:<BUG_ID>` theo `automation_rules.md` mục 6.1
- **KHÔNG đoán category** — phải đọc error message + stack trace thực tế của từng test fail
- Lỗi 🌐 Environment → **DỪNG, báo user**. Không sửa test để né môi trường hỏng
- ⚠️ Sau khi user duyệt danh sách sửa → agent tự sửa + verify, KHÔNG hỏi lại giữa chừng (tối đa 3 vòng)
- Chạy trên môi trường dùng chung → tuân thủ cleanup data, cấm thao tác phá huỷ

## 2 Chế độ (Mode)

| Mode | Khi nào sử dụng | Output |
|---|---|---|
| **RUN** (mặc định) | Cần biết suite đang xanh/đỏ ra sao | Kết quả chạy + phân loại failure + đề xuất |
| **FIX** | Muốn agent sửa luôn nhóm sửa được | Như RUN + code đã sửa + kết quả chạy lại |

> User nói "sửa luôn", "fix cho xanh", "xử lý giùm" → tự động **Mode FIX**.

## Input cần thu thập

| Input | Bắt buộc? | Cách lấy |
|---|---|---|
| **Phạm vi chạy** | ⭕ Mặc định toàn suite | User chỉ định tag (`@smoke`), module, hoặc file cụ thể |
| **Lệnh chạy** | ⭐ Bắt buộc | Agent **tự suy** từ `package.json` / `pom.xml` / `pytest.ini`. Chỉ hỏi user khi không suy được |
| **Report lần chạy trước** | Tùy chọn | Trong `reports/` — để so trend |

## Các bước thực hiện

### Bước 1: Xác Định Stack & Lệnh Chạy

1. Đọc `package.json` / `pom.xml` / `pyproject.toml` để xác định runner và script có sẵn
2. Dựng lệnh chạy theo phạm vi user yêu cầu:

```bash
# Playwright TS — toàn suite / theo tag / theo file
npx playwright test --reporter=list
npx playwright test --grep @smoke
npx playwright test tests/login.spec.ts

# Maven + TestNG
mvn test
mvn test -Dgroups=smoke

# Pytest
python -m pytest -v
python -m pytest -m smoke
```

3. **Headless được phép** ở bước này — suite đã debug PASS trước đó. Chỉ mở headed khi cần inspect DOM ở Bước 4

### Bước 2: Chạy Suite (Baseline)

1. Chạy, ghi lại toàn bộ output và đường dẫn report sinh ra trong `reports/`
2. **Nếu suite chạy không nổi** (lỗi compile, thiếu dependency, config sai) → dừng, báo user lỗi hạ tầng trước khi nói chuyện test
3. **Nếu 100% PASS** → xuất báo cáo ngắn, KẾT THÚC. Không "tìm việc để sửa"

### Bước 3: Phân Loại Failure

Áp dụng bảng category trong `skills-test-report-analyzer`, đọc log thực tế từng test:

| Category | Sửa được trong workflow này? | Hướng xử lý |
|---|---|---|
| 🌐 **Environment** | ❌ **DỪNG NGAY** | Báo user, không đụng code. Toàn suite đỏ thường là đây |
| 🐛 **Application Bug** | ❌ **KHÔNG sửa assertion** | Chưa có bug → `/create-bug-report`. Có bug đang mở → gắn `@KnownBug:<BUG_ID>` + expected-fail chặt (`automation_rules.md` mục 6.1) |
| 🐞 **`@KnownBug` fail đúng assertion** | Không cần sửa | Xếp nhóm **Đang phơi bug**, không tính PASS. Kiểm bug còn mở; bug đã đóng → chuyển dòng dưới |
| 🎉 **`@KnownBug` bỗng PASS** | ❌ Không tự gỡ tag | Runner báo đỏ vì expected-fail không còn đúng → `/retest-fixed-bugs`. Bug FIXED mới gỡ tag và expected-fail |
| 🎯 **Locator gãy** | ✅ | Skill `skills-locator-healer-agent` (Bước 5). Element mất hẳn hoặc đổi nghĩa thì không phải locator gãy: xếp 🐛 và đối chiếu REQ |
| ⏱️ **Flaky / Timing** | ✅ | Skill `skills-flaky-test-analyzer` |
| 📊 **Test data** | ✅ | Sửa data generation — random + traceable |
| 🧪 **Test script lỗi** | ✅ | Sửa code test |

**Gom nhóm theo root cause chung** — 8 test cùng gãy ở `LoginPage.login()` là **1 vấn đề**, không phải 8.

> Test `@KnownBug` fail ở chỗ khác assertion phơi bug (VD locator gãy) thì xếp theo lỗi thật, không xếp nhóm Đang phơi bug.
>
> Ranh giới 🐛 vs 🧪: app trả kết quả **sai so với spec** → App Bug. Test **hiểu sai spec** hoặc viết sai cú pháp → Script lỗi. Không chắc → xếp 🐛 và hỏi user, an toàn hơn là sửa nhầm.

### Bước 4: Báo Cáo & Xin Duyệt (CHECKPOINT)

1. Xuất `reports/run_and_fix_report.md`:
   - Bảng tổng quan PASS/FAIL/SKIP/FLAKY/Đang phơi bug + pass rate + duration. Pass rate không tính nhóm Đang phơi bug
   - Bảng phân loại failure (gom nhóm, kèm root cause)
   - Danh sách **sẽ sửa** vs danh sách **không sửa** (kèm lý do)
2. **⏸️ DỪNG LẠI** — trình bày. Mode RUN → **KẾT THÚC**. Mode FIX → hỏi user duyệt danh sách sửa

### Bước 5: Sửa (Mode FIX — chỉ sau khi user duyệt)

Sửa theo thứ tự: 🎯 Locator → 📊 Data → 🧪 Script → ⏱️ Flaky. Gắn `@KnownBug` cho test 🐛 đã có bug đang mở nằm trong danh sách user duyệt.

- **Locator:** mở browser headed (viewport theo `--viewport-size` lúc launch, KHÔNG resize), điều hướng đến đúng trạng thái test fail, inspect DOM thực tế, thay locator trong **Page class**. TUYỆT ĐỐI KHÔNG đoán
- **Data:** thay hardcoded bằng random traceable (`prefix_testName_timestamp`), bổ sung cleanup nếu môi trường dùng chung
- **Script:** sửa cú pháp, import, assertion viết sai — **không** đổi kỳ vọng nghiệp vụ
- **Flaky:** thay hard sleep bằng smart wait, gỡ phụ thuộc thứ tự chạy

Mỗi thay đổi ghi vào báo cáo dạng `file:line` + code cũ → code mới.

### Bước 6: Chạy Lại & Vòng Lặp

1. Chạy lại **chỉ phần đã sửa** trước cho nhanh, sau đó chạy lại toàn phạm vi ban đầu
2. Test vừa sửa phải PASS **2 lần liên tiếp** mới tính là ổn định

| Kết quả | Hành động |
|---|---|
| Xanh hết, chỉ còn nhóm Đang phơi bug hoặc 🐛 chờ báo bug | → Bước 7 |
| Còn đỏ, root cause **mới** | Quay lại Bước 3 — **tối đa 3 vòng** |
| Còn đỏ, root cause **cũ lặp lại** | Sửa sai hướng → dùng `Edit` hoàn tác đúng thay đổi đó, báo user |
| Hết 3 vòng vẫn đỏ | DỪNG, báo user hiện trạng + phân tích còn lại |

### Bước 7: Báo Cáo Cuối

Cập nhật `reports/run_and_fix_report.md` thêm:
- Bảng trước/sau: pass rate baseline → pass rate cuối
- Danh sách file đã sửa + tóm tắt từng thay đổi
- Nhóm 🐛 App Bug chưa có bug → gợi ý `/create-bug-report` · nhóm Đang phơi bug kèm mã bug · test `@KnownBug` bỗng PASS → gợi ý `/retest-fixed-bugs`
- Nhóm không sửa được + lý do

## Output

### Mode RUN
- `reports/run_and_fix_report.md`: tổng quan, phân loại failure gom nhóm, đề xuất xử lý theo thứ tự

### Mode FIX
- Tất cả output Mode RUN, cộng thêm:
  - Code đã sửa (kèm `file:line`, code cũ → mới)
  - Kết quả chạy lại (baseline → cuối)
  - Trạng thái: ✅ ĐÃ XANH / ⚠️ CÒN BUG APP / ❌ CHƯA XỬ LÝ XONG

## Workflow liên quan

| Tình huống sau khi chạy | Workflow |
|---|---|
| Còn bug app cần báo dev | `/create-bug-report` |
| Locator gãy diện rộng do UI đổi | `/heal-locators` |
| Test xanh nhưng nghi ngờ chất lượng code | `/review-automation-code` |
| Cần đối chiếu TC nào chưa automate | `/generate-traceability-matrix` |
