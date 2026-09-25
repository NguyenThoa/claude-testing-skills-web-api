# Danh mục Test Cases — AnhTester Book Management (`BK`)

> **Điểm vào tầng test case của hệ thống Book.** Đọc file này trước khi đụng tới `docs/testcases/_book-api/`: module nào đã có TC · dải TC ID nào đã chiếm · mã kế tiếp · độ phủ so với requirements.
>
> ⚠️ Hệ thống **riêng**, không liên quan Perfex CRM — danh mục CRM ở [../README.md](../README.md), **không** dùng chung dải TC ID.

| Mục | Giá trị |
|---|---|
| Hệ thống | AnhTester Book Management — `https://book.anhtester.com` (production, server duy nhất) |
| Tiền tố TC ID | `BK_` → `BK_<MODULE>_TC_<3 số>` — dải **chung mọi nền tảng** của module |
| Nguồn requirements | [`docs/requirements/_book-api/README.md`](../../requirements/_book-api/README.md) |
| Nền tảng | API · Android · **Web** (thêm 25-09-2026) · iOS chưa khảo sát |
| Môi trường | **Không** dùng chung (user chốt 14-08-2026) — TC vẫn chỉ ghi/xoá bản ghi do chính lượt chạy tạo, **dọn** sau khi chạy |
| Ngày cập nhật | 25-09-2026 |

---

## 1. Danh mục module đã có test cases

| Module | Prefix TC ID | Dải đã dùng | Mã kế tiếp | Số TC | Nền tảng | Độ hạt | REQ bao phủ | Tài liệu | Cập nhật |
|---|---|---|---|---|---|---|---|---|---|
| Xác thực & Phiên (`AUTH`) | `BK_AUTH_TC_` | `001` → `193` | `194` | 193 | Mobile 58 · API 50 · Web 85 | GỘP | Mobile 46/46 · API 48/48 · Web 72/72 | [TEST_CASES_AUTH_SUMMARY.md](auth/TEST_CASES_AUTH_SUMMARY.md) | 25-09-2026 |
| Người dùng (`USER`) | `BK_USER_TC_` | `001` → `107` | `108` | 107 | Web 50 · API 57 | GỘP | Web 42/42 · API 81/81 | [TEST_CASES_USER_SUMMARY.md](user/TEST_CASES_USER_SUMMARY.md) | 25-09-2026 |
| Sách (`BOOK`) | `BK_BOOK_TC_` | `001` → `135` | `136` | 135 | Web 59 · API 76 | GỘP | Web 52/52 · API 98/98 | [TEST_CASES_BOOK_SUMMARY.md](book/TEST_CASES_BOOK_SUMMARY.md) | 25-09-2026 |

## 2. Độ phủ so với requirements

| Module | REQ có tài liệu | REQ đã có ≥ 1 TC | Độ phủ | Ghi chú |
|---|---|---|---|---|
| `AUTH` | 121 (API 40 · Android 9 · Web 35 · dùng chung `Android · API · Web` 8 · `Android · Web` 29) | Mobile 46 · API 48 · Web 72 | **100%** (121/121) | REQ dùng chung có TC ở **mọi** nền tảng đã khai · `@KnownBug`: API 7 · Mobile 1 · Web 5 · ⚠️ TC API chờ `/update-testcases-from-impact` theo `DEMO-AMB-2509` |
| `USER` | 119 (Web 37 · API 77 · dùng chung `Web · API` 4 · `30` 🟡) | Web 42 · API 81 | **100%** (119/119) | API 57 TC (3 part) neo 1:1 REQ API · 9 `@KnownBug` (`061` · `062` · `071` · `088` · `089` · `090` · `092` · `097` · `105`) · Web `036` · `037` đổi biên 250 → 191 |
| `BOOK` | 146 (Web 46 · API 94 · dùng chung `Web · API` 4 · `03` · `34` 🟡) | Web 52 · API 98 | **100%** (146/146) | API 76 TC (3 part) neo 1:1 REQ API · 20 `@KnownBug` · 1 `@NeedsVerify` (`120`) · Web 3 `@KnownBug` |
| `CAT` · `PROMO` · `FILE` · `ADDR` · `SYS` · `DASH` | 0 | 0 | — | Chưa sinh REQ |

## 3. Nhật ký danh mục

| Ngày | Thay đổi |
|---|---|
| 25-09-2026 | **Chỉnh bộ TC API `USER` · `BOOK` theo REQ mặt API** (`DEMO-AMB-2509B`): `USER` 31 → **57 TC** (`051` → `107`) · `BOOK` 30 → **76 TC** (`060` → `135`), mỗi module tách 3 part ở `api/parts/` (> 40 TC), bỏ file `api/test_cases_*_api.md` cũ. Neo **1:1** REQ API, hết dòng `⚠️ Chưa có REQ`. Phủ `USER` API 81/81 · `BOOK` API 98/98. 29 TC `@KnownBug` mới theo kỳ vọng PO chốt. Web: `BK_USER_TC_036` · `037` đổi biên Name 250 → 191. `AUTH`: **đã chỉnh** `BK_AUTH_TC_037` · `038` (Mobile) · `153` · `154` (Web) đổi biên Name 250 → 191 (`REQ-BK-AUTH-73` 🟡); `038` · `154` thêm `@KnownBug` |
| 25-09-2026 | `/generate-testcases-api` **USER + BOOK** mặt API: `USER` +31 TC (`051`→`081`) · `BOOK` +30 TC (`060`→`089`), mỗi module 1 file `api/`. Kiểm chứng gọi thật (dữ liệu tự tạo + dọn sạch, 0 sót). TC neo tạm REQ Web · 26 TC `⚠️ Chưa có REQ`. Phát hiện mới F-26 → F-31 ở `api_map.md`. Tổng hệ thống **363 TC**. **Việc tiếp:** `/generate-requirements-from-api user`·`book` để neo 1:1, rồi `/update-testcases-from-impact` |
| 25-09-2026 | Thêm **nền tảng Web**: `AUTH` +85 TC (`BK_AUTH_TC_109` → `193`, chế độ BỔ SUNG, 3 part ở `auth/web/parts/`) · `USER` khởi tạo **50 TC** (`user/web/`) · `BOOK` khởi tạo **59 TC** (2 part ở `book/web/parts/`). Sinh **sau** khi chốt toàn bộ AMB (`DEMO-AMB-2509`). Tổng hệ thống **302 TC** · phủ **215/215** REQ |
| 20-09-2026 | `AUTH`: tách `TC_069` · `TC_082` (gánh nhiều REQ không có TC chống lưng) → thêm `BK_AUTH_TC_106` → `108`. API **50 TC**, module **108 TC** |
| 20-09-2026 | `/generate-testcases-api auth`: thêm **47 TC API · 89 biến thể** (`BK_AUTH_TC_059` → `105`) ở `auth/api/parts/`. Module `AUTH` đủ **105 TC · 86/86 REQ** |
| 20-09-2026 | Khởi tạo danh mục. Sinh bộ TC **Mobile (Android)** module `AUTH` bằng `/generate-testcases-from-requirements` Mode QUICK, độ hạt GỘP — **58 TC · 95 biến thể**, 2 part ở `auth/mobile/parts/`, chiếm dải `BK_AUTH_TC_001` → `058`. Phủ 46/46 REQ Mobile. TC API chưa sinh — nối tiếp từ `BK_AUTH_TC_059` |
