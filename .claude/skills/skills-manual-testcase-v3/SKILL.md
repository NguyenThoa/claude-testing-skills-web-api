---
name: skills-manual-testcase-v3
description: Master skill duy nhất để sinh, cập nhật manual test cases web — format v3 10 cột tương thích Xray, 4 modes QUICK · FULL RBT · CHECKLIST · DELTA, thiết kế kiểm thử bám ISTQB CTFL v4.0 và rủi ro sản phẩm. Dùng khi cần viết test case, checklist, phân tích requirement để lập test case, hoặc sửa bộ test case theo ticket. API dùng skills-api-testcase-v3.
---

# Manual Testcase v3 — Master Skill

Một skill cho toàn bộ vòng đời manual test case trên web. File này là **lõi**: quy tắc luôn áp dụng và bản đồ đọc tiếp. Nội dung chi tiết nằm trong `references/`, **chỉ đọc file mà mode đang chạy cần**.

> **Người quyết, AI thực hiện:** con người chốt chiến lược, mức rủi ro chấp nhận được và nghiệp vụ; AI phân tích, viết, rà lỗ hổng; con người duyệt trước khi chốt. Không đoán ngầm: chỗ mơ hồ phải thành câu hỏi (`AMB-<MODULE>-nn`) hoặc giả định ghi rõ (`ASM-<MODULE>-nn`).

## 1. Chọn mode

| Mode | Dùng khi | Workflow | Dừng chờ user |
|---|---|---|---|
| **QUICK** | Requirement đã rõ, module đơn giản | `/generate-testcases-from-requirements` | Không; mơ hồ ghi `ASM` |
| **FULL RBT** | Module phức tạp, rủi ro cao, requirement chưa rõ | `/generate-testcases-manual-rbt` | Bước 2 và Bước 4 |
| **CHECKLIST** | Smoke, post-hotfix, regression, release-readiness | `/generate-checklist-test` | Không |
| **DELTA** | Requirement của bộ TC **đã có** vừa đổi | `/update-testcases-from-impact` | Theo workflow |

Không xác định được mode thì hỏi user một câu. Requirement mơ hồ hoặc rủi ro cao mà đang ở QUICK thì đề xuất FULL RBT **trước** batch đầu tiên.

## 2. Bản đồ đọc tiếp

Đọc **đúng thứ tự** dưới đây, không nạp thêm file khác nếu không cần.

| Mode | File trong `references/` |
|---|---|
| QUICK | `mode_quick.md` → `format_v3.md` → `evidence_and_language.md` → `test_types_4_rounds.md` → `test_design_techniques.md` → `granularity.md` → `output_files.md` → `quality_gates.md` |
| FULL RBT | `mode_full_rbt.md` → các file như QUICK, đọc đúng ở bước cần dùng |
| CHECKLIST | `mode_checklist.md` → `evidence_and_language.md` (mục evidence) |
| DELTA | `mode_delta.md` → `format_v3.md` → `evidence_and_language.md` |
| Chấm automation | `automation_criteria.md` |

Tra nhanh theo tên mục được các skill khác nhắc tới:

| Mục | File |
|---|---|
| Quy Tắc Đối Chiếu Evidence · Quy Tắc Ngôn Ngữ Kiểm Chứng | `evidence_and_language.md` |
| Bản Đồ Loại Kiểm Thử — 4 Vòng · Độ sâu theo rủi ro | `test_types_4_rounds.md` |
| Field-Level (15 loại) · Component-Level · Kỹ thuật thiết kế · ISO/IEC 25010 · Scenarios Chuyên Sâu | `test_design_techniques.md` |
| Độ Hạt Test Case — GỘP / TÁCH | `granularity.md` |
| Quy Tắc Xuất File · File index · Automation Matrix | `output_files.md` |
| Self-Quality Gate · Anti-Patterns · Output Format | `quality_gates.md` |
| Mã checklist & mã mục | `mode_checklist.md` |

## 3. Format bảng TC — 10 cột

```markdown
| TC ID | REQ ID | Risk Level | Priority | Test Summary | Pre-condition | Action | Test Data | Expected Result | Tags |
```

| Cột | Quy tắc ngắn | Vì sao giữ |
|---|---|---|
| `TC ID` | `<HỆ_THỐNG>_<MODULE>_TC_<3 số>`, tiền tố tra ở `docs/requirements/README.md`. Đã phát hành thì không đổi | Khoá nối script, RTM, execution report |
| `REQ ID` | Bắt buộc mỗi dòng | Truy vết; TC không có REQ là TC mồ côi |
| `Risk Level` | `High` · `Medium` · `Low` | Rủi ro sản phẩm = khả năng × tác động; nuôi `/assess-release-risk` |
| `Priority` | `P1` · `P2` · `P3` | Thứ tự chạy; khớp 3 Test Set trên Xray |
| `Test Summary` | Mở đầu bằng "Kiểm tra ..." | Trường Summary của Xray |
| `Pre-condition` | `Pre-condition chung` + phần khác biệt | Xray Pre-Condition |
| `Action` | Đánh số, mỗi bước 1 hành động | Xray Step: Action |
| `Test Data` | Khớp số với `Action`, giá trị cụ thể | Xray Step: Data |
| `Expected Result` | Đánh số khớp bước, chi tiết dùng `-` và `+` | Xray Step: Expected |
| `Tags` | `@Smoke` · `@Regression` · `@CriticalPath` · `@TechCheck` · `@NeedsVerify` · `@AppDeviation` · `@Disruptive` · `@Deprecated` · `@KnownBug:<BUG_ID>` · `@HighImpact` · `@PersonalOnly` · tag nền tảng | Lọc phạm vi chạy, RTM |

- **`Risk Level` ≠ `Priority` ≠ Severity:** Risk Level là rủi ro chức năng được test, chấm trước khi chạy. Priority là thứ tự chạy. Severity thuộc về **bug**, chấm sau khi lỗi xảy ra. TC rủi ro `High` có thể là `P2` nếu không thuộc luồng chặn release.
- **Cột automation** (`Automatable` · `Type` · `Auto Status`) nằm ở `automation_matrix.md`, không nhét vào bảng chính.
- Chi tiết từng cột, cấu trúc mục I.1 → I.10 và từ vựng: `references/format_v3.md`.

## 4. Quy tắc luôn áp dụng

1. **Bước 0 mọi lượt sinh:** kiểm module đã có bộ TC chưa.

   | Tình huống | Làm gì |
   |---|---|
   | Chưa có | Sinh mới |
   | REQ đã có TC vừa đổi | Không sinh, chuyển **DELTA** |
   | Có REQ chưa có TC | Chế độ **BỔ SUNG**: chỉ sinh cho REQ đó, TC ID nối tiếp dải, giữ nguyên độ hạt, không chạm dòng cũ, ghi Nhật ký kèm mốc git |
   | User muốn sinh lại cả module | Dừng, hỏi user. Chỉ làm khi chưa có script, execution report hoặc RTM trỏ vào bộ TC |

2. **Test basis quyết định đúng sai.** Requirement đã duyệt là nguồn của Expected Result; app đang chạy chỉ cho biết hiện trạng. Không hạ Expected Result theo hành vi hiện tại của app (`references/evidence_and_language.md`).
3. **Mở hết evidence trước dòng TC đầu tiên.** Vùng không có evidence thì gắn `@NeedsVerify`, không suy diễn.
4. **Sinh theo 4 vòng, ghi theo mục chức năng.** Thứ tự sinh V1 → V4; khi ghi file, TC vào đúng mục I.x.
5. **Chấm rủi ro theo hai trục tác động × khả năng lỗi trước khi quyết độ sâu,** ghi căn cứ cả hai trục. Lưỡng lự về tác động thì chấm cao hơn; hạ khả năng lỗi phải có bằng chứng. Bốn thứ không rút: toàn bộ V1 · `Required` + `Validation` khi có field nhập · `Permission` khi ≥ 2 vai trò · `Security` khi chạm dữ liệu người dùng khác.
6. **Kỹ thuật theo điều kiện, không theo cảm tính:** EP + BVA, Decision Table, State Transition (`references/test_design_techniques.md`).
7. **Không xoá, không đánh lại mã.** TC bị gỡ giữ dòng, gắn tag `@Deprecated` + tiền tố `🗑️ Deprecated (<TICKET-ID>, <ngày>) —` ở `Test Summary`.
8. **Write-first.** Ghi thẳng vào file theo `CLAUDE.md` mục 6b, chat chỉ báo tiến độ. Một module trên một nền tảng là **một file**, chia bằng mục I.x.
9. **Chạy Quality Gate trước khi bàn giao** và báo cả phần chưa đạt.
10. **Sửa bộ TC cũ giữ nguyên format của file đó.** Chỉ chuyển sang v3 khi user yêu cầu, và không đổi TC ID.

## 5. Bám quy trình ISTQB

Bám nội dung ISTQB CTFL v4.0, không phải chứng nhận tuân thủ. Bảng đầy đủ: `references/test_design_techniques.md`.

| Hoạt động ISTQB | Trong skill này | Sản phẩm |
|---|---|---|
| Test analysis — xác định test condition từ test basis | Bước 1–3, phát hiện `AMB`, phân rã | Câu hỏi Q&A, danh sách luồng |
| Quản lý rủi ro sản phẩm | Bước 4, chấm `Risk Level` | Mức rủi ro + căn cứ + độ sâu |
| Test design — chọn kỹ thuật, đo độ phủ | Bước 4–5, 4 vòng | Test case, bảng đối soát |
| Test implementation — dữ liệu, bộ chạy | Bước 6, `Tags`, `Priority` | File TC, `automation_matrix.md` |
| Truy vết | `REQ ID`, Bảng Đối Soát Coverage | Đầu vào `/generate-traceability-matrix` |
| Test execution · completion | **Không thuộc skill này** | `/execute-test-cases`, `/generate-test-summary-report` |
