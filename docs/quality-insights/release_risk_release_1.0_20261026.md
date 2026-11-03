# Rủi ro release — Perfex CRM · `release_1.0`

| Mục | Giá trị |
|---|---|
| Ngày lập | 26-10-2026, còn **24 ngày** tới code freeze (19-11-2026), 50 ngày tới release (15-12-2026) |
| Master Test Plan | [test_plan_release_1.0.md](../test-plans/test_plan_release_1.0.md) |
| Phạm vi | Theo plan mục 2.1: `login` · `customers` · `projects`, nền tảng **web**, hệ thống mặc định (Book `_book-api` không thuộc mốc này) |
| Thay đổi tính vào yếu tố C | Impact report từ **17-09-2026** (ngày lập plan): `PO-2026-09-19`. Thay đổi trước ngày lập plan đã nằm trong phạm vi plan, không tính lại |
| Lệnh | `qi.py risk --system default --modules login,customers,projects --platform web --since 17-09-2026` |
| Giới hạn dữ liệu | `customers` chỉ có **1** lần chạy · `projects` chưa có TC, chưa có lần chạy (⬛) |
| Người lập | Anh Tester (agent hỗ trợ: Claude Code) |

> ⛔ Báo cáo này **không** khuyến nghị go/no-go. Kết luận release thuộc `/generate-test-summary-report` (dự kiến 10-12-2026); bảng dưới là đầu vào cho báo cáo đó.

## 1. Kết luận chính

1. **Cả 3 module trong phạm vi đều chưa ở mức thấp:** 🔴 `login`, 🔴 `projects`, 🟠 `customers`.
2. **`login` · web 🔴: một lỗi Critical đang chặn tiêu chí exit #1** (*Bug Critical đang mở = 0*). [BUG_login_1785678750_TC039](../bugs/login/web/BUG_login_1785678750_TC039.md) (HTTPS) đã mở 85 ngày, thời hạn sửa vẫn để `❓` ở plan mục 9.4. Riêng về độ phủ thì `login` tốt nhất: 51/51 TC đã chạy ít nhất 1 lần.
3. **`projects` · web 🔴: không có bằng chứng kiểm thử nào.** Có 0 TC và 0 lần chạy. Mốc *"Hoàn tất viết và review TC `CUST`, `PRJ`"* (02-10-2026) đã **trễ 24 ngày** với `PRJ`. Nếu giữ nguyên thì tiêu chí exit #7 (*mỗi module × nền tảng trong phạm vi đã có TC và đã chạy*) chắc chắn không đạt.
4. **`customers` · web 🟠: có thay đổi mới nhưng thực thi còn mỏng.** 7 REQ đổi theo `PO-2026-09-19`, mới chạy **30/129 TC (23 %)**, còn **37 TC rủi ro High/Critical chưa chạy lần nào**. 3 TC fail ở lần chạy duy nhất đều là TC cần sửa, không phải lỗi app (xem [defect_trends_20261026.md](defect_trends_20261026.md) mục 2.3).

## 2. Bảng điểm (nguyên văn `qi.py risk`)

Impact report tính vào yếu tố C: `PO-2026-09-19`

| # | Đơn vị | C · Thay đổi | D · Lỗi mở | I · Bất ổn | G · Chưa chạy | B · Ảnh hưởng | Khả năng (1–5) | Tác động (1–5) | Điểm | Mức |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `login` · web | 0 | 3 | 2 | 0 | 2 | 2.7 | 3.7 | **10.0** | 🔴 Cao ¹ |
| 2 | `projects` · web | 0 | 0 | 2 ⬛ | 3 | 2 | 2.7 | 3.7 | **10.0** | 🔴 Cao ¹ |
| 3 | `customers` · web | 3 | 0 | 2 | 3 | 1 | 3.7 | 2.3 | **8.5** | 🟠 Trung bình |

> Mỗi yếu tố 0–3. Khả năng = 1 + (C+D+I+G)/12 × 4 · Tác động = 1 + B/3 × 4 · Điểm = Khả năng × Tác động (1–25) · 🔴 ≥ 15 · 🟠 8–14,9 · 🟢 < 8. ¹ Nâng mức: còn lỗi Critical mở, hoặc chưa có TC nào. ⬛ = thiếu dữ liệu, tính như có rủi ro.

### Căn cứ từng yếu tố

**`login` · web** — 🔴 Cao (10.0) — nâng lên Cao vì còn lỗi Critical đang mở

- C = 0: không có impact report trong phạm vi
- D = 3: 5 lỗi mở, điểm 8.5 · Critical: BUG_login_1785678750_TC039
- I = 2: tỉ lệ fail ở kết quả gần nhất 10% (51 TC) · 🔁 4 fail liên tục · 4 lần chạy
- G = 0: đã chạy 51/51 TC (100%)
- B = 2: 51% TC chấm High/Critical

**`projects` · web** — 🔴 Cao (10.0) — nâng lên Cao vì chưa có TC nào — không có bằng chứng kiểm thử

- C = 0: không có impact report trong phạm vi
- D = 0: 0 lỗi mở
- I = 2: ⬛ chưa có lần chạy bộ TC nào — tính 2 (thiếu dữ liệu ≠ an toàn)
- G = 3: ⬛ chưa có TC nào cho đơn vị này
- B = 2: ⬛ chưa chấm (không có TC) — tính 2

**`customers` · web** — 🟠 Trung bình (8.5)

- C = 3: 7 REQ đổi (REQ-CUST-42, REQ-CUST-43, REQ-CUST-53, REQ-CUST-73, REQ-CUST-79, REQ-CUST-80…) · ticket: PO-2026-09-19
- D = 0: 0 lỗi mở
- I = 2: tỉ lệ fail ở kết quả gần nhất 10% (30 TC) · 1 lần chạy
- G = 3: đã chạy 30/129 TC (23%) · 37 TC rủi ro High/Critical chưa chạy lần nào
- B = 1: 36% TC chấm High/Critical

## 3. Nhận định QA

| Đơn vị | Điểm máy | Nhận định QA |
|---|---|---|
| `login` · web | 🔴 (10,0, nâng vì Critical) | **Đồng ý 🔴.** Chỉ riêng lỗi Critical đã đủ chặn exit #1. 4 TC 🔁 fail liên tục đều đã có bug, nên không còn lỗi rò rỉ. Điểm khả năng thấp (2,7) vì không có thay đổi mới từ 17-09-2026: rủi ro `login` nằm ở **lỗi chưa sửa**, không nằm ở thay đổi |
| `projects` · web | 🔴 (10,0, nâng vì chưa có TC) | **Đồng ý 🔴, và đây là rủi ro lớn nhất về lịch.** Theo plan mục 2.1, `PRJ` có 104 REQ và 6 AMB 🔴 treo. `RISK-PRJ-01` (*điểm gom của 9 module qua 17 tab*) chưa có bằng chứng kiểm. 24 ngày tới code freeze phải đủ để sinh, review và chạy bộ TC đầu tiên |
| `customers` · web | 🟠 (8,5) | **Đồng ý 🟠.** C = 3 là đúng: 7 REQ đổi, trong đó `REQ-CUST-79` là REQ *đưa lại* vào phạm vi. Tác động thấp hơn hai module kia (B = 1, 36 % TC High/Critical), nhưng `RISK-CUST-01` (*entity trung tâm, hơn 10 module tham chiếu*) chỉ kiểm được khi `projects` có TC |

## 4. Rủi ro đã công bố ↔ bằng chứng

> Nguồn: plan mục 8.2 / `RISK-<MODULE>-nn`. *Đã thành lỗi?* = có bug mở trỏ tới vùng đó.

| Rủi ro | Đã thành lỗi? | Bằng chứng kiểm thử hiện có |
|---|---|---|
| `RISK-LOGIN-06`: module là cổng vào, hỏng thì chặn mọi module | Chưa | Đăng nhập Admin `CRM_LOGIN_TC_005` PASS ở [run_1793011272](../executions/login/web/run_1793011272/execution_report.md) (26-10-2026) |
| `RISK-LOGIN-01` · `RISK-LOGIN-02`: thiếu chống vét cạn · cookie không `HttpOnly` | Chưa có bug riêng | Plan kiểm soát bằng *ghi nhận hiện trạng*. Pentest ngoài phạm vi (plan mục 2.2) |
| `RISK-CUST-01`: entity trung tâm | Chưa | ⬛ Chưa kiểm cross-module, vì `projects` chưa có TC |
| `RISK-CUST-06` · `RISK-PRJ-03`: xoá bằng GET | Chưa | Không thấy lần chạy nào kiểm vùng này |
| `RISK-PRJ-01` · `RISK-PRJ-05`: điểm gom 9 module · số liệu tổng quan lệch | Chưa | ⬛ `projects` chưa có TC |

## 5. Đề xuất hành động: trước code freeze 19-11-2026

| # | Việc | Đối tượng | Command | Ưu tiên |
|---|---|---|---|---|
| 1 | Sinh và review bộ TC `projects` · web (trễ mốc 02-10-2026). Chốt 6 AMB treo trước, hoặc chốt bằng giả định | `projects` | `/generate-testcases-manual-rbt` → `/review-testcases` | Cao |
| 2 | Chốt thời hạn sửa và người chịu trách nhiệm cho lỗi Critical. Cập nhật plan mục 9.4 | `BUG_login_1785678750_TC039` | `/generate-master-test-plan` | Cao |
| 3 | Chạy nhóm TC đã chọn cho `PO-2026-09-19`: 41 TC ≈ 44 phút, gồm 11 TC bắt buộc trỏ REQ đổi và 9 TC smoke `login` | `customers` + smoke `login` | [test_selection_PO-2026-09-19_20261026.md](test_selection_PO-2026-09-19_20261026.md) → `/execute-test-cases` | Cao |
| 4 | Chạy dần 37 TC High/Critical còn lại của `customers` | `customers` | `/select-regression-tests --modules customers` → `/execute-test-cases` | Trung bình |
| 5 | Sau khi `projects` có TC: chạy cross-module `CUST` ↔ `PRJ` (`RISK-CUST-01`) | `customers` · `projects` | `/generate-cross-module-test-plan` | Trung bình |
| 6 | Lập lại báo cáo này mỗi tuần cùng báo cáo tiến độ, để thấy các ô ⬛ được lấp dần | cả mốc | `/assess-release-risk` | Thấp |

## 6. Phương pháp

- Điểm: 5 yếu tố 0–3. `Khả năng = 1 + (C+D+I+G)/12 × 4`, `Tác động = 1 + B/3 × 4`, `Điểm = Khả năng × Tác động`. Thang chi tiết: [`scoring.md`](../../.claude/skills/skills-quality-insights/references/scoring.md)
- ⬛ = thiếu dữ liệu, được tính như có rủi ro, **không** như an toàn
- Nhận định QA nằm **bên cạnh** điểm máy. Không có điểm nào bị sửa tay
- Báo cáo **không** sửa plan, bug hay TC. Các điều chỉnh plan đề xuất ở mục 5
