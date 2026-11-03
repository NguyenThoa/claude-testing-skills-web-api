# Danh mục Test Cases — AnhTester Book Management (`BK`)

> **Điểm vào tầng test case của hệ thống Book.** Đọc file này trước khi đụng tới `docs/testcases/_book-api/`: module nào đã có TC · dải TC ID nào đã chiếm · mã kế tiếp · độ phủ so với requirements.
>
> ⚠️ Hệ thống **riêng**, không liên quan Perfex CRM — danh mục CRM ở [../README.md](../README.md), **không** dùng chung dải TC ID.

| Mục | Giá trị |
|---|---|
| Hệ thống | AnhTester Book Management — `https://book.anhtester.com` (production, server duy nhất) |
| Tiền tố TC ID | `BK_` → `BK_<MODULE>_TC_<3 số>` — dải **chung mọi nền tảng** của module |
| Nguồn requirements | [`docs/requirements/_book-api/README.md`](../../requirements/_book-api/README.md) |
| Nền tảng | API · Android (`AUTH` 20-09-2026 · `USER` · `BOOK` 26-09-2026, bổ sung 20-10-2026) · **Web** (thêm 25-09-2026) · iOS chưa khảo sát |
| Môi trường | **Không** dùng chung (user chốt 14-08-2026) — TC vẫn chỉ ghi/xoá bản ghi do chính lượt chạy tạo, **dọn** sau khi chạy |
| Ngày cập nhật | 20-10-2026 |

---

## 1. Danh mục module đã có test cases

| Module | Prefix TC ID | Dải đã dùng | Mã kế tiếp | Số TC | Nền tảng | Độ hạt | REQ bao phủ | Tài liệu | Cập nhật |
|---|---|---|---|---|---|---|---|---|---|
| Xác thực & Phiên (`AUTH`) | `BK_AUTH_TC_` | `001` → `210` | `211` | 210 | Mobile 75 · API 50 · Web 85 | GỘP | Mobile 62/62 · API 48/48 · Web 72/72 | [TEST_CASES_AUTH_SUMMARY.md](auth/TEST_CASES_AUTH_SUMMARY.md) | 20-10-2026 |
| Người dùng (`USER`) | `BK_USER_TC_` | `001` → `160` | `161` | 160 | Web 50 · API 57 · Mobile 53 | GỘP | Web 42/42 · API 81/81 · Mobile 50/50 | [TEST_CASES_USER_SUMMARY.md](user/TEST_CASES_USER_SUMMARY.md) | 20-10-2026 |
| Sách (`BOOK`) | `BK_BOOK_TC_` | `001` → `191` | `192` | 191 | Web 59 · API 76 · Mobile 56 | GỘP | Web 52/52 · API 98/98 · Mobile 54/54 | [TEST_CASES_BOOK_SUMMARY.md](book/TEST_CASES_BOOK_SUMMARY.md) | 20-10-2026 |

## 2. Độ phủ so với requirements

| Module | REQ có tài liệu | REQ đã có ≥ 1 TC | Độ phủ | Ghi chú |
|---|---|---|---|---|
| `AUTH` | 126 (API 40 · Android 14 · Web 24 · dùng chung `Android · API · Web` 8 · `Android · Web` 40) | Mobile 62 · API 48 · Web 72 | **100%** (126/126) | REQ dùng chung có TC ở **mọi** nền tảng đã khai · Mobile 75 TC (3 part — Part 03 My Profile · Setting account · Exit app) · `@KnownBug`: API 7 · Mobile 3 (`038` · `196` ↔ BUG REQ122 · `205`) · Web 5 · ⚠️ TC API chờ `/update-testcases-from-impact` theo `DEMO-AMB-2509` |
| `USER` | 131 (Web 3 · API 77 · Android 12 · dùng chung mục 3.1 4 · `Android · Web` 33 · `30` 🟡) | Web 42 · API 81 · Mobile 50 | **100%** (131/131) | API 57 TC (3 part) neo 1:1 REQ API · 9 `@KnownBug` API · Mobile 53 TC (2 part) · 5 `@KnownBug` Mobile (`139` · `141` · `142` · `152` · `155`) · `32` → `35` Android theo giả định (4 TC `@NeedsVerify`) · REQ chưa khai Android (`37` → `40` chặn bởi REQ-129) không tính vào cột Mobile |
| `BOOK` | 158 (Web 9 · API 94 · Android 12 · dùng chung `Web · API` 1 · `Android · Web · API` 3 · `Android · Web` 39 · `03` · `34` 🟡) | Web 52 · API 98 · Mobile 54 | **100%** (158/158) | API 76 TC (3 part) · 20 `@KnownBug` API · Web 3 `@KnownBug` · Mobile 56 TC (2 part) · 7 `@KnownBug` Mobile (`143` · `162` · `173` · `175` → `177` · `187`) — tạo sách Android lỗi (REQ-147) nên `SM-A` · `SM-C` tạo qua web / API |
| `CAT` · `PROMO` · `FILE` · `ADDR` · `SYS` · `DASH` | 0 | 0 | — | Chưa sinh REQ |

## 3. Nhật ký danh mục

| Ngày | Thay đổi |
|---|---|
| 20-10-2026 | `AUTH` — `/generate-testcases-from-requirements` Mode QUICK chế độ **BỔ SUNG**: thêm `auth/mobile/parts/part_03_mobile_ho_so.md` **+17 TC** (`BK_AUTH_TC_194` → `210`) cho My Profile · Setting account · Exit app trên Android. Phủ `REQ-BK-AUTH-122` → `126` và vế Android của 11 REQ `Android · Web` (index mục 3.3) → `AUTH` Mobile **62/62**, module **126/126**. +2 TC `@KnownBug` (`196` — REQ-122, bug `BUG_auth_1792454704_REQ122` · `205` — REQ-118). Tổng hệ thống **554 TC** |
| 20-10-2026 | `/generate-testcases-from-requirements` Mode QUICK chế độ **BỔ SUNG** (Mobile lượt 2) theo REQ Android 20-10-2026 — `USER` **+11 TC** (`150` → `160`, `155` tách từ `152` khi review, `156` theo REQ-131, `157` → `160` theo `AMB-BK-USER-22`) · tách file Mobile `USER` thành 2 part · `BOOK` **+11 TC** (`181` → `191`, `191` đo bàn phím sau khi khởi động lại emulator), sửa Expected `BK_BOOK_TC_142` · `143`. File Mobile `BOOK` vượt 50 TC → tách 2 part ở `book/mobile/parts/`. Phủ `USER` Mobile 45/45 · `BOOK` Mobile 53/53. +3 TC `@KnownBug` (`BK_USER_TC_152` · `155` · `BK_BOOK_TC_187`). Tổng hệ thống **561 TC** (gồm 17 TC `AUTH` cùng ngày) |
| 26-09-2026 | `/generate-testcases-from-requirements` Mode QUICK chế độ **BỔ SUNG** — thêm mặt **Mobile (Android)** cho `USER` **+42 TC** (`108` → `149`, `user/mobile/test_cases_user_mobile.md`, 58 biến thể) · `BOOK` **+45 TC** (`136` → `180`, `book/mobile/test_cases_book_mobile.md`, 58 biến thể). Độ hạt GỘP · rủi ro Cao → Đầy đủ. Phủ `USER` Mobile 40/40 · `BOOK` Mobile 43/43 REQ khai Android. Mở 43/43 ảnh evidence Android, không xung đột nội dung. 9 TC `@KnownBug` Mobile. Tổng hệ thống **522 TC** |
| 25-09-2026 | **Chỉnh bộ TC API `USER` · `BOOK` theo REQ mặt API** (`DEMO-AMB-2509B`): `USER` 31 → **57 TC** (`051` → `107`) · `BOOK` 30 → **76 TC** (`060` → `135`), mỗi module tách 3 part ở `api/parts/` (> 40 TC), bỏ file `api/test_cases_*_api.md` cũ. Neo **1:1** REQ API, hết dòng `⚠️ Chưa có REQ`. Phủ `USER` API 81/81 · `BOOK` API 98/98. 29 TC `@KnownBug` mới theo kỳ vọng PO chốt. Web: `BK_USER_TC_036` · `037` đổi biên Name 250 → 191. `AUTH`: **đã chỉnh** `BK_AUTH_TC_037` · `038` (Mobile) · `153` · `154` (Web) đổi biên Name 250 → 191 (`REQ-BK-AUTH-73` 🟡); `038` · `154` thêm `@KnownBug` |
| 25-09-2026 | `/generate-testcases-api` **USER + BOOK** mặt API: `USER` +31 TC (`051`→`081`) · `BOOK` +30 TC (`060`→`089`), mỗi module 1 file `api/`. Kiểm chứng gọi thật (dữ liệu tự tạo + dọn sạch, 0 sót). TC neo tạm REQ Web · 26 TC `⚠️ Chưa có REQ`. Phát hiện mới F-26 → F-31 ở `api_map.md`. Tổng hệ thống **363 TC**. **Việc tiếp:** `/generate-requirements-from-api user`·`book` để neo 1:1, rồi `/update-testcases-from-impact` |
| 25-09-2026 | Thêm **nền tảng Web**: `AUTH` +85 TC (`BK_AUTH_TC_109` → `193`, chế độ BỔ SUNG, 3 part ở `auth/web/parts/`) · `USER` khởi tạo **50 TC** (`user/web/`) · `BOOK` khởi tạo **59 TC** (2 part ở `book/web/parts/`). Sinh **sau** khi chốt toàn bộ AMB (`DEMO-AMB-2509`). Tổng hệ thống **302 TC** · phủ **215/215** REQ |
| 20-09-2026 | `AUTH`: tách `TC_069` · `TC_082` (gánh nhiều REQ không có TC chống lưng) → thêm `BK_AUTH_TC_106` → `108`. API **50 TC**, module **108 TC** |
| 20-09-2026 | `/generate-testcases-api auth`: thêm **47 TC API · 89 biến thể** (`BK_AUTH_TC_059` → `105`) ở `auth/api/parts/`. Module `AUTH` đủ **105 TC · 86/86 REQ** |
| 20-09-2026 | Khởi tạo danh mục. Sinh bộ TC **Mobile (Android)** module `AUTH` bằng `/generate-testcases-from-requirements` Mode QUICK, độ hạt GỘP — **58 TC · 95 biến thể**, 2 part ở `auth/mobile/parts/`, chiếm dải `BK_AUTH_TC_001` → `058`. Phủ 46/46 REQ Mobile. TC API chưa sinh — nối tiếp từ `BK_AUTH_TC_059` |
