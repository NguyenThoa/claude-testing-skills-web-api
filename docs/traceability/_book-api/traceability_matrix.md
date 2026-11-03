# Ma Trận Truy Vết (RTM) — AnhTester Book Management (`BK`) · Tổng hợp

> **Tóm tắt:** 415/415 REQ đã có TC (100%) · 0 cặp REQ × nền tảng chưa có TC đúng nền tảng · **0/561 TC có script automation** · **chưa chạy TC nào** · 60 TC `@KnownBug` · **chỉ 3/9 module** nằm trong RTM này

| Thông tin | Nội dung |
|---|---|
| Ngày cập nhật | 20-10-2026 10:48 |
| Lần sinh gần nhất | `auth, user, book` — toàn bộ module đang có REQ + TC |
| Mốc git | `ed6525b` — từng module có mốc riêng ở Bản đồ tài liệu |
| Phạm vi | Namespace `_book-api` — hệ thống **riêng**, không liên quan Perfex CRM (RTM CRM ở [`../traceability_matrix.md`](../traceability_matrix.md)) |
| Nguồn đã quét | Automation: không tìm thấy script · Checklist: chưa có · Kết quả chạy: chưa có (`docs/executions/` chưa có thư mục Book) · Bug: `docs/bugs/_book-api/README.md` (4 bug đang mở — nối vào cột kết quả khi TC được chạy) |

## ⬛ Ngoài tầm nhìn của RTM — đọc trước mọi con số

| Nhóm | Số module | Module | Ý nghĩa |
|---|:-:|---|---|
| ⬜ Chưa khảo sát | 6 | `CAT` · `PROMO` · `FILE` · `ADDR` · `SYS` · `DASH` | Mới lập bản đồ (🟨), chưa có REQ — 19 endpoint API + 4 màn hình Android **không xuất hiện** trong mọi % (dự kiến 100 – 200 REQ) |
| 📐 Phủ theo giả định | — | `USER` REQ-32 → 35 (vế Android) | Khai Android theo `AMB-BK-USER-22`, TC `@NeedsVerify` — **được tính** là đã phủ trong Platform Coverage nhưng **chưa kiểm chứng** trên app |
| ⛔ Bị chặn bởi lỗi | — | `USER` REQ-37 → 40 · `BOOK` REQ-39 · 40 · 46 · 47 · 52 (vế Android) | Không khai Android vì tạo / sửa trên app đang lỗi (REQ-BK-USER-129 · BOOK-147 · 155) — **không** nằm trong mẫu số Platform Coverage |
| 📄 Có REQ, chưa có TC | 0 | — | — |
| 🕓 Chưa sinh RTM | 0 | — | — |
| 📱 Nền tảng chưa khảo sát | — | iOS (cả 3 module) | Không có REQ / TC iOS — máy khảo sát là Windows |

## 1. Độ phủ theo module

| Module | REQ trong phạm vi | Requirement Coverage | Platform Coverage (cặp) | TC | Automation | Lần chạy gần nhất |
|---|:-:|---|---|:-:|---|---|
| **Xác thực & Phiên** `AUTH` | 126 | `▰▰▰▰▰` 126/126 | `▰▰▰▰▰` 182/182 | 210 | `▱▱▱▱▱` 0/210 | — chưa chạy |
| **Người dùng** `USER` | 131 | `▰▰▰▰▰` 131/131 | `▰▰▰▰▰` 173/173 | 160 | `▱▱▱▱▱` 0/160 | — chưa chạy |
| **Sách** `BOOK` | 158 | `▰▰▰▰▰` 158/158 | `▰▰▰▰▰` 204/204 | 191 | `▱▱▱▱▱` 0/191 | — chưa chạy |
| **Tổng** | **415** | `▰▰▰▰▰` **415/415** | `▰▰▰▰▰` **559/559** | **561** | `▱▱▱▱▱` **0/561** | — |

## 2. Việc cần làm — gộp mọi module, xếp theo mức nghiêm trọng

| # | Việc | Module | Số lượng | Command |
|:-:|---|---|:-:|---|
| 1 | ▶️ Chạy TC lần đầu | `AUTH` · `USER` · `BOOK` | 561 TC | `/execute-test-cases` |
| 2 | 🟡 Automate TC Critical/High `Automation = Yes` | `AUTH` · `USER` · `BOOK` | 302 TC | `/generate-automation-from-testcases` |

## Bản đồ tài liệu

| Module | File RTM | Ngày sinh | Mốc git |
|---|---|---|---|
| `AUTH` | [auth/traceability_matrix_auth.md](auth/traceability_matrix_auth.md) | 20-10-2026 10:48 | `ed6525b` |
| `USER` | [user/traceability_matrix_user.md](user/traceability_matrix_user.md) | 20-10-2026 10:48 | `ed6525b` |
| `BOOK` | [book/traceability_matrix_book.md](book/traceability_matrix_book.md) | 20-10-2026 10:48 | `ed6525b` |
| `CAT` | — chưa có REQ | — | — |
| `PROMO` | — chưa có REQ | — | — |
| `FILE` | — chưa có REQ | — | — |
| `ADDR` | — chưa có REQ | — | — |
| `SYS` | — chưa có REQ | — | — |
| `DASH` | — chưa có REQ | — | — |
