---
name: skills-coverage-traceability
description: Skill sinh ma trận truy vết (RTM) Requirements ↔ Test Cases ↔ Automation Scripts — chỉ ra requirement chưa được cover, TC chưa được automate, và test mồ côi không map về requirement nào.
---

# Coverage & Traceability Matrix

Purpose: Xây dựng Requirements Traceability Matrix (RTM) để trả lời 3 câu hỏi: requirement nào chưa có test? TC nào chưa automate? test nào đang mồ côi?

---

## When to Use

Sử dụng skill này khi:

- User yêu cầu "ma trận truy vết", "RTM", "coverage report", "requirement nào chưa có test"
- Trước release — cần chứng minh độ phủ test cho stakeholder
- Sau khi sinh TC/automation — cần đối soát với requirements
- Audit bộ test cũ: tìm test thừa (mồ côi) và requirement bị bỏ sót

---

## Input Sources

| Nguồn | Định dạng chấp nhận | Cách nhận diện |
|---|---|---|
| **Requirements** | Markdown, Jira export, user stories, file phân tích từ `skills-requirements-analyzer` | ID dạng `REQ-xxx`, `US-xxx`, hoặc heading đánh số |
| **Manual Test Cases** | Markdown, Excel/CSV | ID dạng `TC_xxx` |
| **Automation Scripts** | `.spec.ts`, `*Test.java`, `.py` | Tên test method/block, annotation/tag chứa TC ID |
| **Checklist** *(nguồn phụ)* | `docs/checklists/<module>/<nền-tảng>/checklist_*.md` · `docs/checklists/_release/<nền-tảng>/checklist_release_*.md` | Cột `REQ ID` của từng mục · mã mục `<Mã checklist>-<nn>` (quy tắc ở skill `skills-rbt-manual-testing`, mục *Mã checklist & mã mục*) |

> Nếu thiếu 1 trong 3 nguồn → vẫn sinh RTM 2 chiều với nguồn có sẵn, ghi chú rõ phần thiếu. Nếu TC/test không có ID chuẩn → đề xuất bổ sung ID trước, hoặc map tạm theo tên/mô tả (đánh dấu ⚠️ map suy luận).

**Nguồn trong `docs/` — đọc theo `## Bản đồ tài liệu`, không dừng ở index:**

| Nguồn | Đọc thế nào |
|---|---|
| Requirements | `docs/requirements/<module>/REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` (REQ dùng chung) → theo `## Bản đồ tài liệu` đọc **mọi** file `<nền-tảng>/requirements_<module>_<nền-tảng>.md` và `stories/` |
| Test cases | `docs/testcases/<module>/TEST_CASES_<TÊN_MODULE>_SUMMARY.md` → theo `## Bản đồ tài liệu` đọc **mọi** file `<nền-tảng>/test_cases_<module>_<nền-tảng>.md` và `parts/` |

| Checklist | Glob `docs/checklists/**/checklist_*.md`. Checklist là ảnh chụp theo thời điểm — smoke · regression: lấy file **mới nhất theo ngày** trong từng `<module>/<nền-tảng>/` · post-hotfix: lấy **mọi** file (mỗi file một ticket, vùng rà khác nhau) · release: lấy file của mốc đang làm, không chỉ định thì mốc mới nhất — quy từng mục về module theo cột `Module` |

⚠️ Index test cases **không chứa dòng TC** — chỉ đọc index là báo độ phủ 0% sai. Tài liệu cũ chưa có tầng nền tảng (không có bản đồ) thì đọc như tài liệu một file.

---

## Mapping Rules

1. **Map bằng ID là chuẩn nhất** — TC ghi `REQ-001` trong cột Requirement; automation ghi TC ID trong tag/annotation:
   ```typescript
   // Playwright — tag trong tên test
   test('TC_LOGIN_01 - đăng nhập thành công', ...)
   ```
   ```java
   // TestNG — description hoặc groups
   @Test(description = "TC_LOGIN_01")
   ```
2. **Map bằng nội dung khi thiếu ID** — so khớp mô tả TC với tên test method; kết quả đánh dấu ⚠️ cần người xác nhận
3. **1 requirement có thể map nhiều TC** và ngược lại — RTM là quan hệ n-n
4. **KHÔNG bịa mapping** — không chắc thì để trống và liệt kê vào mục "cần xác nhận"
5. **Checklist là nguồn phụ, KHÔNG thay TC.** Mục checklist map về REQ qua cột `REQ ID` và ghi vào cột `Checklist` của ma trận. REQ **chỉ** có mục checklist, không có TC nào → trạng thái 🟠 **Chỉ có checklist**: không tính vào Requirement Coverage, không xếp chung 🔴 (đã có người rà, chỉ chưa có cách rà lặp lại được) — đề xuất sinh TC. Mục checklist TC-based đã có `TC ID liên quan` thì REQ đã được phủ qua TC, cột `Checklist` chỉ để tra
6. **TC mang tag `@Deprecated`** (chức năng đã gỡ — tiền tố `🗑️ Deprecated (…) —` ở `Test Scenario`) **không** được tính là đang phủ REQ và **không** vào mẫu số Automation Coverage. Liệt kê riêng: script automation còn trỏ vào TC `@Deprecated` là **script cần gỡ / skip**, không phải orphan

---

## Coverage Metrics

| Metric | Công thức | Ý nghĩa |
|---|---|---|
| **Requirement Coverage** | # REQ có ≥1 TC / tổng REQ | Requirement nào chưa được test |
| **Platform Coverage** | # cặp (REQ × nền tảng REQ khai) có ≥1 TC trên đúng nền tảng đó / tổng số cặp | REQ khai `Web · Android` mà chỉ có TC web → nền tảng Android **chưa phủ**, không được tính là đã phủ nhờ TC web |
| **Automation Coverage** | # TC có ≥1 script / tổng TC | TC nào còn chạy tay |
| **REQ chỉ có checklist** | # REQ có mục checklist nhưng 0 TC | Vùng đã rà nhanh nhưng chưa có TC để chạy lại, chưa automate được |
| **Orphan Tests** | # test không map về REQ nào | Test thừa hoặc requirement chưa được ghi nhận |

---

## Workflow

1. **Thu thập** — đọc 3 nguồn input chính + checklist (nguồn phụ); xác định format ID của từng nguồn
2. **Trích xuất** — liệt kê toàn bộ REQ ID, TC ID, test method (kèm file path)
3. **Map** — nối 3 tầng theo Mapping Rules; tách riêng mapping chắc chắn và mapping suy luận ⚠️
4. **Tính metrics** — 3 chỉ số coverage
5. **Phát hiện gap:**
   - REQ không có TC → gap nghiêm trọng nhất, đề xuất sinh TC (dùng `skills-rbt-manual-testing`) — có mục checklist thì xếp 🟠, chưa có gì thì 🔴
   - TC không có automation → đề xuất thứ tự automate theo priority của TC
   - Test mồ côi → đề xuất: bổ sung requirement, gắn ID, hoặc xóa nếu thừa
6. **Xuất RTM** — ghi vào **vị trí cố định** (bảng dưới), kèm CSV cùng tên nếu user cần import Excel

### Nơi ghi file

| Phạm vi | Đường dẫn |
|---|---|
| Toàn hệ thống (mặc định) | `docs/traceability/traceability_matrix.md` |
| Một module | `docs/traceability/<module>/traceability_matrix_<module>.md` |

- **Ghi đè tại chỗ** — không thêm ngày/phiên bản vào tên file; bản cũ tra bằng **lịch sử git** (cùng luật với index requirements/testcases)
- RTM một module **không** ghi đè file toàn hệ thống — RTM một phần đè lên bản toàn hệ thống là các workflow sau đọc thiếu module mà không biết
- Workflow đọc RTM (`/generate-test-summary-report`, `/generate-test-progress-report`, `/update-testcases-from-impact`, `/update-automation-from-impact`, `/generate-master-test-plan`) đọc file toàn hệ thống trước, không có thì file của module đang làm
- RTM cũ nằm chỗ khác (`traceability_matrix.md` ở gốc repo hay rải trong `docs/`) → vẫn đọc được; lần sinh mới ghi về vị trí chuẩn, **nhắc user gỡ file cũ** (không tự xoá)

---

## RTM Template

```markdown
# Ma Trận Truy Vết (RTM) — <Tên dự án/module>

| Thông tin | Nội dung |
|---|---|
| Ngày sinh | 09-10-2026 14:10 |
| Phạm vi | Toàn hệ thống · 6 module · web + api |
| Mốc git | `da94292` — commit lúc sinh RTM; TC/script sửa sau mốc này thì RTM đã cũ |

## Tổng quan Coverage
| Metric | Giá trị |
|---|---|
| Requirement Coverage | 18/20 (90%) |
| Automation Coverage | 35/50 TC (70%) |
| REQ chỉ có checklist | 1 |
| Orphan Tests | 3 |

## Ma trận chi tiết
| REQ ID | Mô tả ngắn | TC IDs | Automation | Checklist | Trạng thái |
|---|---|---|---|---|---|
| REQ-001 | Đăng nhập email | TC_LOGIN_01, TC_LOGIN_02 | login.spec.ts (2/2) | CL-smoke_20261009-01 | ✅ Full |
| REQ-002 | Quên mật khẩu | TC_PW_01 | — | — | 🟡 Manual only |
| REQ-003 | Khóa account sau 5 lần sai | — | — | — | 🔴 NOT COVERED |
| REQ-004 | Đổi ngôn ngữ giao diện | — | — | CL-regression_20261005-14 | 🟠 Checklist only |

## 🔴 Requirements chưa được cover (ưu tiên xử lý)
| REQ ID | Mô tả | Đề xuất |
|---|---|---|
| REQ-003 | ... | Sinh TC bằng /generate-testcases-from-requirements |

## 🟠 REQ chỉ có checklist (đã rà nhanh, chưa có TC)
| REQ ID | Mục checklist | Đề xuất |
|---|---|---|
| REQ-004 | CL-regression_20261005-14 | Sinh TC bằng /generate-testcases-from-requirements |

## 🟡 TC chưa automate (đề xuất thứ tự theo priority)
| TC ID | Priority | Ghi chú |
|---|---|---|

## ⚪ Orphan tests (không map về REQ nào)
| Test | File | Đề xuất |
|---|---|---|

## ⚠️ Mapping suy luận — cần người xác nhận
| REQ | TC/Test | Căn cứ suy luận |
|---|---|---|
```

---

## Quality Checklist

- [ ] Mọi REQ/TC/test trong nguồn input đều xuất hiện trong RTM (không bỏ sót)
- [ ] Mapping suy luận được tách riêng, không trộn với mapping có ID
- [ ] REQ chỉ có checklist xếp 🟠, **không** tính vào Requirement Coverage
- [ ] File ghi đúng `docs/traceability/…`, header có Ngày sinh · Phạm vi · Mốc git
- [ ] Metrics tính đúng, khớp số dòng trong ma trận
- [ ] Gap có đề xuất hành động kèm command/skill cụ thể
- [ ] Không tự ý sửa file TC/test khi chưa được yêu cầu

---

## Rules References

- `.claude/skills/skills-requirements-analyzer/SKILL.md` — Nguồn requirements chuẩn
- `.claude/skills/skills-rbt-manual-testing/SKILL.md` — Sinh TC lấp gap
- `.claude/skills/skills-testcase-reviewer/SKILL.md` — Review chất lượng TC hiện có
