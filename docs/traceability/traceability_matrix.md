# Ma Trận Truy Vết (RTM) — Perfex CRM · Tổng hợp

> **Tóm tắt:** 124/124 REQ trong phạm vi đã có TC (100%) · **0/180 TC có script automation** · 51/180 TC đã chạy ít nhất 1 lần · **chỉ 2/23 module** nằm trong RTM này — `PRJ` có 104 REQ mà chưa có TC

| Thông tin | Nội dung |
|---|---|
| Ngày cập nhật | 14-10-2026 02:34 |
| Lần sinh gần nhất | `login, customers` — module khác (nếu có) giữ nguyên dòng cũ |
| Mốc git | `501decf` — từng module có mốc riêng ở Bản đồ tài liệu |
| Nguồn đã quét | Automation: **không tìm thấy script** trong repo · Checklist: chưa có · Kết quả chạy: `docs/executions/login/web/` (2 lần chạy) · Bug: `docs/bugs/README.md` |

## ⬛ Ngoài tầm nhìn của RTM — đọc trước mọi con số

| Nhóm | Số module | Module | Ý nghĩa |
|---|:-:|---|---|
| ⬜ Chưa khảo sát | 20 | `CONT` · `LEAD` · `TASK` · `EST` · `PROP` · `INV` · `PAY` · `CN` · `SUB` · `CTR` · `EXP` · `ITEM` · `TICK` · `ESTREQ` · `KB` · `REP` · `DASH` · `TODO` · `REM` · `PROF` | Không có REQ — không xuất hiện trong mọi % |
| 📄 Có REQ, chưa có TC | 1 | `PRJ` (104 REQ) | Tính vào thì Requirement Coverage toàn hệ thống chỉ còn **124/228 (54%)** |
| 🕓 Chưa sinh RTM | 0 | — | — |

## 1. Độ phủ theo module

| Module | REQ trong phạm vi | Requirement Coverage | TC | Automation | Lần chạy gần nhất |
|---|:-:|---|:-:|---|---|
| **Đăng nhập / Xác thực** `LOGIN` | 40 (+4 loại trừ) | `▰▰▰▰▰` 40/40 | 51 | `▱▱▱▱▱` 0/51 | `▰▰▰▰▱` 45 PASS · ❌ 6 FAIL |
| **Khách hàng** `CUST` | 84 | `▰▰▰▰▰` 84/84 | 129 | `▱▱▱▱▱` 0/129 | — chưa chạy |
| **Tổng** | **124** | `▰▰▰▰▰` **124/124** | **180** | `▱▱▱▱▱` **0/180** | 45 PASS · ❌ 6 FAIL · 129 chưa chạy |

## 2. Việc cần làm — gộp mọi module, xếp theo mức nghiêm trọng

| # | Việc | Module | Số lượng | Command |
|:-:|---|---|:-:|---|
| 1 | 🔴 Sinh TC cho module đã có REQ nhưng chưa có TC | `PRJ` | 104 REQ | `/generate-testcases-manual-rbt` |
| 2 | ❌ 5 TC FAIL đã có bug đang mở | `LOGIN` | 5 TC | `/retest-fixed-bugs` |
| 3 | ❌ 1 TC FAIL nhưng bug đã đóng | `LOGIN` | 1 TC | `/execute-test-cases` |
| 4 | ▶️ 129 TC chưa từng chạy | `CUST` | 129 TC | `/execute-test-cases` |
| 5 | 🟡 Automate TC Critical/High đã chấm `Automation = Yes` | `LOGIN` | 22 TC | `/generate-automation-from-testcases` |
| 6 | 🟡 Automate TC Critical/High đã chấm `Automation = Yes` | `CUST` | 41 TC | `/generate-automation-from-testcases` |

## Bản đồ tài liệu

| Module | File RTM | Ngày sinh | Mốc git |
|---|---|---|---|
| `LOGIN` | [login/traceability_matrix_login.md](login/traceability_matrix_login.md) | 14-10-2026 02:34 | `501decf` |
| `CUST` | [customers/traceability_matrix_customers.md](customers/traceability_matrix_customers.md) | 14-10-2026 02:34 | `501decf` |
| `PRJ` | — chưa sinh (chưa có TC) | — | — |

---
📊 Xem trực quan: mở `scripts/traceability-viewer/bundle.html` → kéo thả cả thư mục `docs/traceability/`.
