# Test Cases — Module Sách (`BOOK`) · Book — tổng 135 TC · 2 nền tảng (Web · API) · độ hạt GỘP

| Thông tin | Nội dung |
|---|---|
| **Hệ thống** | AnhTester Book Management — mã hệ thống `BK` (namespace `_book-api/`) · danh mục TC: [../README.md](../README.md) |
| **Module** | Sách — `Book Management` · prefix `BOOK` |
| **Nguồn requirement** | Index [REQUIREMENTS_BOOK_SUMMARY.md](../../../requirements/_book-api/book/REQUIREMENTS_BOOK_SUMMARY.md) · [web/requirements_book_web.md](../../../requirements/_book-api/book/web/requirements_book_web.md) (48 REQ) · [api/requirements_book_api.md](../../../requirements/_book-api/book/api/requirements_book_api.md) (94 REQ) · dùng chung 4 REQ ở index mục 3 — **0 AMB treo** (chốt 25-09-2026, `DEMO-AMB-2509` · `DEMO-AMB-2509B`) |
| **Mode sinh** | QUICK (`/generate-testcases-from-requirements`) · độ hạt **GỘP** (mặc định) |
| **Ngày sinh** | 25-09-2026 |
| **Dải TC ID** | `BK_BOOK_TC_001` → `BK_BOOK_TC_135` (Web `001`→`059` · API `060`→`135`; `090`→`135` bổ sung 25-09-2026 khi có REQ mặt API — nối tiếp, không chèn giữa) |
| **Mã kế tiếp** | `BK_BOOK_TC_136` — **KHÔNG đánh lại từ 001** |
| **Phạm vi REQ** | Web: 52/52 REQ (48 riêng Web + 4 dùng chung). API: **98/98** REQ (94 riêng API + 4 dùng chung) — 5 endpoint `/api/book*`. Ngoài phạm vi viết TC: quản lý danh mục ⚙ (module `CAT`) · **tạo / sửa khuyến mãi** (module `PROMO` — khuyến mãi tác động lên giá bán của **mọi** sách nên TC **không** tạo) · tải ảnh bìa (module `FILE`) · mở khoá slug bằng `Change` · mặt Android |
| **Mức rủi ro · độ sâu** | `Cao` → **Đầy đủ** — đủ 6 nhánh V1, mọi nhánh V2 có điều kiện kích hoạt, V3/V4 chấm từng nhánh.<br>Căn cứ chấm Cao: đụng **giá tiền** (giá gốc, giá bán sau khuyến mãi — đang có lỗi giá âm) · thao tác **không hồi lại được** (xoá sách) · mọi người dùng sửa/xoá được sách người khác.<br>**Hạ xuống Tiêu chuẩn khi:** không bao giờ — module có tiền luôn giữ mức Cao |
| **Môi trường** | `https://book.anhtester.com` — **production, server duy nhất**. **Không** dùng chung (user chốt 14-08-2026) nhưng chỉ ghi/xoá sách do chính lượt chạy tạo |
| **Trình duyệt chuẩn** | Google Chrome (desktop) · viewport `1600×750` · `en-US` |

## Cách đọc bộ TC này

Cùng quy ước với module `AUTH` — xem [TEST_CASES_AUTH_SUMMARY.md › Cách đọc bộ TC này](../auth/TEST_CASES_AUTH_SUMMARY.md#cách-đọc-bộ-tc-này): biến thể `a`/`b`/`c`, **Bảng kiểm**, `🔧 Ghi chú kỹ thuật` (`@TechCheck`), `⚠️ chưa có evidence` (`@NeedsVerify`), `🐞 Kỳ vọng FAIL` (`@KnownBug`).

---

## Dữ liệu dùng chung

### Trạng thái xuất phát

| Ký hiệu | Trạng thái | Cách đưa về |
|---|---|---|
| `B0` | **Khách**, ở `https://book.anhtester.com/book-management`, tab `All`, `Sort By: Feature` | Avatar → `Logout`, rồi menu trái `Book` |
| `B1` | **`TK-B` đang đăng nhập**, ở `/book-management` | Từ `B0`: avatar → đăng nhập `TK-B` → menu trái `Book` |

### Tài khoản & sách test

| Ký hiệu | Dữ liệu | Tạo bởi | Dùng cho |
|---|---|---|---|
| `TK-B` | Name `Auto Book Owner 1790150600` · `auto_book_1790150600@auto.test` · `Auto@12345` | Sign up ở setup (hoặc `POST /api/register`) | `B1` |
| `S-A` | `Auto Book 1790150601 Tiếng Việt` · slug `auto-book-1790150601-tieng-viet` · `Technology` · `50000` | `TC_027` | TC_002 · 007 · 016 · 028 · 029 · 051 |
| `S-B` | `Auto Book 1790150602` · `Technology` · `50000` | setup (`New book`) | TC_030 · 031 · 053 · 054 |
| `S-C` | `Auto Book 1790150603` · `Technology` · `50000` — **đổi tên** thành `Auto Book 1790150603 Renamed` trước `TC_055` | setup | TC_055 → 056 → 032 (xoá) |
| Tệp | `auto_book_cover.png` (PNG ≈ 1 KB) · `auto_note.txt` (văn bản) | QA chuẩn bị sẵn | Mọi TC tạo sách · TC_047 |

Số `17901506xx` = mốc mẫu `1790150600` + độ lệch — khi chạy thay bằng `T + xx`, ghi `T` vào đầu execution report.

### Thứ tự chạy

```
Setup   : Sign up TK-B → đăng nhập → New book S-B · S-C (đổi tên S-C thành "… Renamed")
Part 02 V1: TC_024 → 026 → 027 (tạo S-A) → 028 → 029 → 030 → 031 → (055 → 056 →) 032 (xoá S-C)
Part 01   : TC_001 → 023   (cần S-A cho 002 · 007 · 016)
Part 02 V2: TC_033 → 054 · 057 → 059
Teardown: xoá qua Modify → Delete mọi sách `Auto Book 17901506xx` còn lại · xoá danh mục `Auto Cat …` qua ⚙ (module CAT)
          → xoá TK-B bằng API (token của chính nó) → báo số tạo / số dọn / còn sót (kể cả ảnh bìa — RISK-BK-BOOK-03)
```

### Dọn dữ liệu — BẮT BUỘC sau mỗi lượt (`RISK-BK-BOOK-01` · `03`)

| Độ lệch | Bản ghi | Tạo bởi |
|---|---|---|
| `00` | `TK-B` | setup — xoá cuối bằng API |
| `01` · `02` · `03` | `S-A` · `S-B` · `S-C` | TC_027 · setup (`S-C` đã xoá ở TC_032) |
| `04` | Sách `Auto Book 1790150604 Cat` + danh mục **mới** `Auto Cat 1790150604` | TC_050 |
| `05` | `Auto Book 1790150605 Flow` — tự xoá trong TC | TC_059 |
| `06` · `07` | `… Twice` (có thể 2 bản) · tên chuỗi tấn công | TC_057 · 058 |
| `98` · `99` | Chip danh mục tự gõ / sách lỗi — chỉ tồn tại nếu form **cho qua** ngoài dự kiến | TC_035 → 046 |
| — | Ảnh bìa `$book-image/auto-book-17901506xx…` — xoá sách **không** xoá ảnh (`AMB-BK-BOOK-16` ✅) | Mọi TC tạo sách — dọn ở module `FILE` |

🚫 **Không** bấm bút / mở chi tiết / xoá sách nào không có tiền tố `Auto Book 17901506`.

---

## Dữ liệu dùng chung (API)

| Ký hiệu | Cách tạo | Dùng cho |
|---|---|---|
| `userA` | `POST /api/register` `…_a_<T>@auto.test` → `POST /api/login` → `tokenA` · `GET /api/me` → `id` | Chủ sở hữu sách · thao tác ghi |
| `userB` | như `userA` (`…_b_<T>@auto.test`) → `tokenB` | Mục tiêu BOLA (`TC_085` · `089`) |
| `userC` | như `userA` (`…_c_<T>@auto.test`) | Chủ sách bị xoá — `TC_134` |
| Sách của lượt chạy | `POST /api/book` (tokenA) `name:"Auto BookAPI <tag> <T>"` · `categories:["auto_bookapi_cat_<tag>_<T>"]` · `price` 50.000 (trừ khi TC nêu) → tra `id`/`slug` bằng `GET /api/book?search={"name":{"equals":"<tên>"}}` | `bookA` (`ok`) · `bookB` (`desc`) · `bookD` · `bookS` · `bookU` · `bookP1` `bookP2` `bookP3` (giá 1.000 · 70.000 · 1.000.000) · `bookN` · `bookA2` · … — **mỗi TC ghi/xoá dùng sách đích riêng** |

`<T>` = Unix timestamp lúc bắt đầu lượt, ghi vào đầu execution report. Tên sách và danh mục mang `<T>` để truy vết **và** né ràng buộc trùng tên (F-29).

**Thứ tự chạy (API):** Setup `userA` · `userB` · `userC` → tạo sách nền (`bookA` · `bookB` · `bookD` · `bookS` · `bookU` · `bookP1–3`) → nhóm đọc công khai (`060`→`065` · `090`→`101` · `078`→`080`) → `POST` (`066`→`077` · `102`→`121`, mỗi TC tên sách riêng) → `PATCH` (`081`→`085` · `122`→`133`) → `DELETE` (`086`→`089` · `134`) → `135` → Teardown. `TC_121` (`@RunOnce`) **chạy tay, một lần** — không nằm trong regression.

**Dọn dữ liệu — BẮT BUỘC (API), theo thứ tự:** (1) `DELETE /api/book/{id}` **mọi** sách `Auto BookAPI *<T>*` do phiên tạo (tìm bằng `search` theo `name contains <T>` **và** theo `categories some name contains <T>` để bắt sách tên rỗng / tên lạ) · (2) `DELETE /api/category-book/{name}` **từng** danh mục có tên chứa `<T>` (`GET /api/category-book` → lọc) — **sau** khi sách đã xoá, vì xoá danh mục còn sách bị chặn · (3) xoá `userA` · `userB` · `userC` bằng token của chính nó · (4) báo **tạo / dọn / còn sót** cho **từng loại** (sách · danh mục · tài khoản). 🚫 Không xoá sách / danh mục / tài khoản có sẵn — kể cả danh mục tên rỗng có sẵn (`RISK-BK-BOOK-08`). Lượt kiểm chứng 25-09-2026: sách **46/46** · danh mục **40/40** · tài khoản **5/5** · sót **0**.

🔒 **Chống lộ dữ liệu:** `auth.email` của sách khác là dữ liệu người thật — không in / đính vào báo cáo (`RISK-BK-BOOK-05`). `TC_097`: **không** chép chuỗi `error`.

---

## Bản đồ tài liệu

> File này là **index** — không chứa dòng TC.

| Nền tảng | File | Nhóm chức năng | Số TC | TC ID | REQ bao phủ |
|---|---|---|---|---|---|
| Web | [web/parts/part_01_web_danh_sach.md](web/parts/part_01_web_danh_sach.md) | Danh sách · sắp xếp · tab danh mục · Filter (từ khoá, khoảng giá) · quyền khách / đăng nhập | 23 | 001–023 | `01 → 21` · `51` |
| Web | [web/parts/part_02_web_tao_sua_xoa.md](web/parts/part_02_web_tao_sua_xoa.md) | Tạo sách (validation, slug, giá, danh mục, ảnh, khuyến mãi) · chi tiết · sửa · xoá | 36 | 024–059 | `22 → 50` · `52` |
| API | [api/parts/part_01_api_doc_danh_sach_chi_tiet.md](api/parts/part_01_api_doc_danh_sach_chi_tiet.md) | `GET /api/book` · `GET /api/book/{id}` (đọc công khai) | 21 | 060–065 · 078–080 · 090–101 | `REQ-BK-BOOK-01` · `42` · `53 → 82` · `144 → 146` |
| API | [api/parts/part_02_api_tao.md](api/parts/part_02_api_tao.md) | `POST /api/book` | 32 | 066–077 · 102–121 | `REQ-BK-BOOK-51` · `52` · `83 → 113` · `137` · `139` · `140` · `142` · `143` |
| API | [api/parts/part_03_api_sua_xoa.md](api/parts/part_03_api_sua_xoa.md) | `PATCH` · `DELETE /api/book/{id}` · quy ước chung | 23 | 081–089 · 122–135 | `REQ-BK-BOOK-114 → 136` (trừ `137+`) · `138` · `141` |
| Android · iOS | — | Chưa có REQ — không sinh TC | — | — | — |

Tổng Web: **59 TC · 73 biến thể** + **10 mục Bảng kiểm**. Tổng API: **76 TC** (`060`→`135`, 3 part vì > 40 TC). Toàn module **135 TC**.

> **Neo REQ mặt API:** từ 25-09-2026 module `BOOK` **có REQ mặt API** (94 REQ + 4 dùng chung) — mọi TC API neo **1:1** vào REQ API. TC gộp nhiều REQ (`TC_061` · `064` · `065` · `073` · `098` · `108` · `109` · `126` …) ghi **biến thể → REQ** ở cột Expected; biến thể FAIL map về đúng REQ. 20 TC `@KnownBug` (`068` · `070` · `073` · `097` · `098` · `101` · `102` · `103` · `105` · `107` · `116` · `117` · `118` · `119` · `121` · `122` · `127` · `131` · `132` · `133`) theo kỳ vọng đã chốt bằng `DEMO-AMB-2509B`; 1 TC `@NeedsVerify` (`120`).

---

## Assumptions đã áp dụng

| Mã | Điểm chưa rõ | Giả định đã áp dụng | TC bị ảnh hưởng |
|---|---|---|---|
| ASM-BK-BOOK-01 | Slug với nhiều khoảng trắng liền nhau / ký tự đặc biệt — chỉ khảo sát tên có dấu tiếng Việt | Gộp khoảng trắng thành **một** `-` và bỏ ký tự đặc biệt | TC_033 `b` `c` |
| ASM-BK-BOOK-02 | Biên "7 ngày" của nhãn `New` — không tạo được sách lùi ngày trên production để thử đúng biên | Chỉ kiểm 2 lớp: tạo **hôm nay** (có New) và **quá 7 ngày** (không New, dùng sách có sẵn). Ngày thứ 7 **không** kiểm | TC_007 |
| ASM-BK-BOOK-03 | `Price from` gõ chữ — chỉ biết ô là ô số | Ô **không** nhận ký tự chữ | TC_018 bước 3 |
| ASM-BK-BOOK-04 | Tạo sách với danh mục tự gõ (`REQ-52`) — quyết định PO chưa kiểm chứng | Danh mục mới xuất hiện ở hàng tab và ô Categories, số sách `1` | TC_050 |

| ASM-BK-BOOK-05 | Danh sách từ khoá "tên thư viện truy cập dữ liệu" dùng cho `TC_097` (REQ-146) | **Dev cung cấp**; TC đọc từ cấu hình, không ghi vào `docs/` | TC_097 |
| ASM-BK-BOOK-06 | `TC_120` (`name` rỗng) — hệ thống đã có sách tên rỗng nên chỉ thấy lỗi trùng | Giữ kỳ vọng "không phải 2xx"; gắn `@NeedsVerify` cho tới khi có thể kiểm nhánh "rỗng, chưa trùng" | TC_120 |

**Không** phát hiện xung đột tài liệu ↔ ảnh. Ảnh `web_book_category_tab_selected_viewport.png` (sách `13 Th08 2026` **không** có `New`) và `web_book_filter_price_range_lost_from_viewport.png` (sách `21 Th09 2026` **có** `New`) **khớp** quyết định 7 ngày của `AMB-BK-BOOK-03` → TC_007-c có evidence.

---

## Bảng Đối Soát Coverage (Web 52/52 REQ)

| REQ ID | Mô tả ngắn | TC IDs (số biến thể) | Loại case |
|---|---|---|---|
| REQ-BK-BOOK-01 | Khách xem danh sách | TC_001 | P |
| REQ-BK-BOOK-02 | Thẻ sách đủ thông tin | TC_002 | UI (Bảng kiểm 5 mục) |
| REQ-BK-BOOK-03 🟡 | Nhãn New — trong 7 ngày | TC_007 (3) | P · N · EP |
| REQ-BK-BOOK-04 | Mặc định sắp theo lượt xem | TC_005 | P |
| REQ-BK-BOOK-05 | Menu Sort 4 mục + Newest | TC_008 | UI · P |
| REQ-BK-BOOK-06 | Giá tăng dần | TC_009 | P |
| REQ-BK-BOOK-07 | Giá giảm dần | TC_010 | P |
| REQ-BK-BOOK-08 | Sort ghi lên URL | TC_011 | P |
| REQ-BK-BOOK-09 | Cuộn tải thêm | TC_012 | P |
| REQ-BK-BOOK-10 | Tab danh mục kèm số | TC_006 | UI |
| REQ-BK-BOOK-11 | Chọn tab lọc | TC_014 | P |
| REQ-BK-BOOK-12 | Filter mở / đóng | TC_015 | UI Behavior |
| REQ-BK-BOOK-13 | Tìm theo từ khoá | TC_016 (3) | P · EP |
| REQ-BK-BOOK-14 | Không phân biệt hoa thường | TC_017 | P |
| REQ-BK-BOOK-15 | Gợi ý khoảng giá | TC_018 | UI |
| REQ-BK-BOOK-16 | Lọc giá từ | TC_019 | P |
| REQ-BK-BOOK-17 | Lọc khoảng giá | TC_020 | P · 🐞 `@KnownBug` |
| REQ-BK-BOOK-18 | Dòng mô tả khoảng giá | TC_021 | UI |
| REQ-BK-BOOK-19 | Từ khoá + giá lên URL | TC_022 | P |
| REQ-BK-BOOK-20 | Khách không có nút ghi | TC_003 · 023 (2) | Permission · Security |
| REQ-BK-BOOK-21 | Đã đăng nhập có nút ghi | TC_004 | Permission |
| REQ-BK-BOOK-22 | Form Create đủ thành phần | TC_024 | UI (Bảng kiểm 5 mục) |
| REQ-BK-BOOK-23 | Create khoá khi chưa đổi | TC_026 | UI Behavior |
| REQ-BK-BOOK-24 | Slug tự sinh | TC_033 (3) | P · EP |
| REQ-BK-BOOK-25 | Slug khoá mặc định | TC_034 | UI |
| REQ-BK-BOOK-26 | Thiếu ảnh | TC_035 | N |
| REQ-BK-BOOK-27 | Thiếu giá | TC_036 (2) | N |
| REQ-BK-BOOK-28 | Thiếu danh mục | TC_037 | N |
| REQ-BK-BOOK-29 | Giá tối thiểu 1.000 | TC_038 (3) · 039 (2) | **B** — `-1000` · `0` · **`999`** · **`1000`** · `1001` |
| REQ-BK-BOOK-30 | Giá tối đa 100 tỷ | TC_040 · 041 (2) | **B** — **`100000000000`** · **`100000000001`** · rất lớn |
| REQ-BK-BOOK-31 | Định dạng giá | TC_042 (2) | P |
| REQ-BK-BOOK-32 | Categories liệt kê + lọc | TC_043 | P |
| REQ-BK-BOOK-33 | Chip tự gõ | TC_044 | P |
| REQ-BK-BOOK-34 🟡 | Tên danh mục ≤ 24 ký tự | TC_045 · 046 (2) | **B** — **`24`** · **`25`** · `28` |
| REQ-BK-BOOK-35 | Tệp không phải ảnh | TC_047 | N |
| REQ-BK-BOOK-36 | Ảnh hợp lệ xem trước | TC_048 | P |
| REQ-BK-BOOK-37 | Khuyến mãi còn hiệu lực | TC_049 | P · `@TechCheck` |
| REQ-BK-BOOK-38 | Available mặc định bật | TC_025 | UI |
| REQ-BK-BOOK-39 | Tạo sách thành công | TC_027 · 057 · 058 · 059 | P · Error Guessing · Security |
| REQ-BK-BOOK-40 | Sách mới đầu Newest | TC_028 | P |
| REQ-BK-BOOK-41 | Trang chi tiết | TC_029 · 059 | P |
| REQ-BK-BOOK-42 | Lượt xem tăng 1 | TC_051 | P |
| REQ-BK-BOOK-43 | Sách không tồn tại | TC_052 · 059 | N |
| REQ-BK-BOOK-44 | Modify điền sẵn | TC_030 | UI |
| REQ-BK-BOOK-45 | Sửa tên sinh lại slug | TC_053 | Dependency |
| REQ-BK-BOOK-46 | Lưu thay đổi | TC_031 · 059 | P |
| REQ-BK-BOOK-47 | Tắt Available → UNAVAILABLE | TC_054 | State |
| REQ-BK-BOOK-48 | Hộp xoá ghi tên hiện tại | TC_055 | P · 🐞 `@KnownBug` |
| REQ-BK-BOOK-49 | Cancel không xoá | TC_056 | N |
| REQ-BK-BOOK-50 | Xác nhận xoá | TC_032 · 059 | P |
| REQ-BK-BOOK-51 🆕 | Giá bán không âm | TC_013 | N · 🐞 `@KnownBug` |
| REQ-BK-BOOK-52 🆕 | Danh mục tự gõ sinh danh mục mới | TC_050 | P · `@NeedsVerify` |

**Tổng:** 52/52 REQ có ≥ 1 TC ✅. Phép thử 6b: TC gánh ≥ 2 REQ duy nhất là `TC_059` (5 REQ) — mọi REQ có TC khác chống lưng ✅.

### Bảng trạng thái — sách (`AVAILABLE` / `UNAVAILABLE`)

| Từ \ Hành động | Create (bật) | Create (tắt) | Modify tắt | Modify bật | Delete |
|---|---|---|---|---|---|
| — (chưa có) | ✅ → AVAILABLE · TC_025 · 027 | ⏭️ chưa có REQ — ma trận ghi *chưa thử*, rà lại khi khảo sát bổ sung | — | — | — |
| AVAILABLE | — | — | ✅ → UNAVAILABLE · TC_054 | — | ✅ · TC_032 · 059 |
| UNAVAILABLE | — | — | — | ⏭️ chưa có REQ (*chưa thử*) | ✅ · xoá `S-B` ở teardown |

---

## Bảng Đối Soát Coverage (API 98/98 REQ)

| REQ ID | Mô tả ngắn | TC IDs | Loại case |
|---|---|---|---|
| REQ-BK-BOOK-01 | Không cần đăng nhập vẫn xem được danh sách sách (dùng chung — TC Web: TC_001) | TC_060 | P |
| REQ-BK-BOOK-42 | Mở chi tiết sách với `view=true` tăng lượt xem đúng 1 (dùng chung — TC Web: TC_051) | TC_079 | P |
| REQ-BK-BOOK-51 | Giá bán hiển thị không âm (dùng chung — TC Web: TC_013) | TC_117 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-52 | Tạo sách với tên danh mục chưa có sinh danh mục mới (dùng chung — TC Web: TC_050) | TC_074 | P |
| REQ-BK-BOOK-53 | Danh sách trả `list` và `pagination` đúng hình dạng | TC_060 | P |
| REQ-BK-BOOK-54 | `auth` là chủ sách hoặc `null` | TC_060 | P |
| REQ-BK-BOOK-55 | Mặc định `limit`=10 · `page`=1 · sắp `updatedAt` giảm dần | TC_090 | P |
| REQ-BK-BOOK-56 | `limit` cắt đúng số bản ghi và tính `totalPage` | TC_065 | P |
| REQ-BK-BOOK-57 | `limit` ngoài khoảng [1 ; 10000] bị từ chối | TC_065 | P |
| REQ-BK-BOOK-58 | `limit` = 10000 hợp lệ (biên trên) | TC_065 | P |
| REQ-BK-BOOK-59 | `limit` sai kiểu bị từ chối | TC_065 | P |
| REQ-BK-BOOK-60 | `page` chuyển sang trang khác trả bản ghi khác | TC_065 | P |
| REQ-BK-BOOK-61 | `page` < 1 bị từ chối | TC_065 | P |
| REQ-BK-BOOK-62 | `page` sai kiểu bị từ chối | TC_065 | P |
| REQ-BK-BOOK-63 | `page` vượt tổng số trang trả danh sách rỗng, không lỗi | TC_065 | P |
| REQ-BK-BOOK-64 | `sort` nhận 9 giá trị, `sortBy` sắp đúng chiều | TC_061 | P |
| REQ-BK-BOOK-65 | `sort` ngoài enum bị từ chối | TC_061 | P |
| REQ-BK-BOOK-66 | `sortBy` chỉ nhận `asc` hoặc `desc` | TC_061 | P |
| REQ-BK-BOOK-67 | `search` JSON: lọc theo `name` chứa chuỗi, không phân biệt hoa thường | TC_062 | P |
| REQ-BK-BOOK-68 | `search` JSON: lọc theo `description` và `slug` | TC_091 | P |
| REQ-BK-BOOK-69 | `search` JSON: lọc theo danh mục | TC_063 | P |
| REQ-BK-BOOK-70 | `search` JSON: lọc theo `status` | TC_092 | P |
| REQ-BK-BOOK-71 | `search` JSON: lọc theo giá gốc `price` (`gte` · `gte` + `lte`) | TC_064 | P |
| REQ-BK-BOOK-72 | `search` JSON: lọc `currentPrice` đủ hai đầu `gte` + `lte` | TC_064 | P |
| REQ-BK-BOOK-73 | `search` JSON: `OR` là hợp | TC_093 | P |
| REQ-BK-BOOK-74 | `search` chuỗi thường khớp tên · mô tả · slug, không phân biệt hoa thường | TC_094 | P |
| REQ-BK-BOOK-75 | `search` JSON sai cú pháp được coi là chuỗi thường | TC_095 | P |
| REQ-BK-BOOK-76 | `search` JSON tham chiếu trường hoặc toán tử không tồn tại bị từ chối | TC_096 | P |
| REQ-BK-BOOK-77 | Chi tiết sách trả đủ 13 khoá | TC_078 | P |
| REQ-BK-BOOK-78 | `{id}` nhận cả `id` lẫn `slug` | TC_099 | P |
| REQ-BK-BOOK-79 | Endpoint đọc công khai bỏ qua header `Authorization` | TC_078 | P |
| REQ-BK-BOOK-80 | `view` sai kiểu bị từ chối | TC_100 | P |
| REQ-BK-BOOK-81 | `id` không tồn tại trả 404 | TC_080 | P |
| REQ-BK-BOOK-82 | Sách không có ảnh có `picture` = `[]` ở cả chi tiết lẫn danh sách | TC_101 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-83 | Tạo sách thành công trả **201** | TC_102 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-84 | Sách vừa tạo đọc lại đúng dữ liệu | TC_066 | P |
| REQ-BK-BOOK-85 | Slug tự sinh từ tên: chữ thường, bỏ dấu, nối `-` | TC_103 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-86 | Slug tự đặt được lưu nguyên văn | TC_104 | P |
| REQ-BK-BOOK-87 | Trùng tên sách bị từ chối, không phân biệt hoa thường | TC_075 | P |
| REQ-BK-BOOK-88 | Trùng slug bị từ chối với thông báo nói về slug | TC_105 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-89 | Tạo sách khi không có / sai scheme xác thực bị từ chối | TC_067 | P |
| REQ-BK-BOOK-90 | Tạo sách với token không hợp lệ bị từ chối | TC_067 | P |
| REQ-BK-BOOK-91 | Thiếu `name` bị từ chối | TC_069 | P |
| REQ-BK-BOOK-92 | `name` sai kiểu bị từ chối | TC_069 | P |
| REQ-BK-BOOK-93 | `name` tối đa 191 ký tự | TC_106 | P |
| REQ-BK-BOOK-94 | `status` ngoài enum bị từ chối | TC_072 | P |
| REQ-BK-BOOK-95 | Thiếu `status` bị từ chối | TC_107 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-96 | Thiếu `categories` bị từ chối | TC_108 | P |
| REQ-BK-BOOK-97 | `categories` rỗng bị từ chối | TC_071 | P |
| REQ-BK-BOOK-98 | `categories` sai kiểu bị từ chối | TC_108 | P |
| REQ-BK-BOOK-99 | Danh mục trùng lặp trong mảng được gộp | TC_109 | P |
| REQ-BK-BOOK-100 | Tên danh mục tối đa 191 ký tự | TC_109 | P |
| REQ-BK-BOOK-101 | Thiếu `price` bị từ chối | TC_070 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-102 | `price` sai kiểu bị từ chối | TC_110 | P |
| REQ-BK-BOOK-103 | `price` lớn hơn 100.000.000.000 bị từ chối | TC_111 | P |
| REQ-BK-BOOK-104 | Giá gốc dưới 1.000 (kể cả âm) bị từ chối | TC_073 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-105 | Giá gốc đúng bằng 1.000 (biên dưới) được chấp nhận | TC_073 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-106 | `description` tối đa 65.535 ký tự | TC_112 | P |
| REQ-BK-BOOK-107 | `pictures` sai kiểu bị từ chối | TC_113 | P |
| REQ-BK-BOOK-108 | `pictures` trỏ tệp không tồn tại vẫn tạo được sách, không sinh ảnh | TC_113 | P |
| REQ-BK-BOOK-109 | `promotions` chứa id không tồn tại bị từ chối | TC_114 | P |
| REQ-BK-BOOK-110 | Trường ngoài schema và trường server tự tính bị bỏ qua | TC_076 | P |
| REQ-BK-BOOK-111 | Tạo sách nhận đủ 3 content-type khai trong spec | TC_068 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-112 | Body JSON sai cú pháp bị từ chối, body lỗi **không** phải JSON | TC_115 | P |
| REQ-BK-BOOK-113 | Chuỗi tấn công và Unicode ở `name` · `description` lưu nguyên văn | TC_077 | P |
| REQ-BK-BOOK-114 | Sửa sách thành công trả **201** | TC_122 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-115 | Cập nhật một phần: chỉ gửi field cần đổi | TC_081 | P |
| REQ-BK-BOOK-116 | Body `{}` không đổi gì và không lỗi | TC_123 | P |
| REQ-BK-BOOK-117 | Đổi `name` không sinh lại `slug` | TC_081 | P |
| REQ-BK-BOOK-118 | Đổi sang tên của sách khác bị từ chối; giữ nguyên tên thì được | TC_124 | P |
| REQ-BK-BOOK-119 | Đổi `status` được lưu | TC_082 | P |
| REQ-BK-BOOK-120 | `status` ngoài enum khi sửa bị từ chối | TC_125 | P |
| REQ-BK-BOOK-121 | Đổi `price` được lưu | TC_126 | P |
| REQ-BK-BOOK-122 | `price` sai kiểu hoặc quá lớn khi sửa bị từ chối | TC_126 | P |
| REQ-BK-BOOK-123 | Giá gốc dưới 1.000 (kể cả âm) khi sửa bị từ chối | TC_127 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-124 | `categories` rỗng khi sửa bị từ chối | TC_128 | P |
| REQ-BK-BOOK-125 | Đổi `slug` được lưu | TC_129 | P |
| REQ-BK-BOOK-126 | Sửa sách khi không có / sai token bị từ chối | TC_083 | P |
| REQ-BK-BOOK-127 | Sửa `id` không tồn tại trả 404 | TC_084 | P |
| REQ-BK-BOOK-128 | Người dùng đã đăng nhập sửa được sách của người khác, chủ sách không đổi | TC_085 | P |
| REQ-BK-BOOK-129 | Trường ngoài schema bị bỏ qua khi sửa | TC_130 | P |
| REQ-BK-BOOK-130 | Sửa sách nhận `form-urlencoded` · `multipart` cho field chuỗi; field số bị từ chối | TC_131 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-131 | Xoá sách thành công | TC_086 | P |
| REQ-BK-BOOK-132 | Xoá sách khi không có / sai token bị từ chối | TC_087 | P |
| REQ-BK-BOOK-133 | Xoá `id` không tồn tại, và xoá lần thứ hai, trả 404 | TC_088 | P |
| REQ-BK-BOOK-134 | Người dùng đã đăng nhập xoá được sách của người khác | TC_089 | P |
| REQ-BK-BOOK-135 | Sách của người dùng đã bị xoá vẫn tồn tại với `auth` = `null` | TC_134 | P |
| REQ-BK-BOOK-136 | Body lỗi kiểm tra dữ liệu có hình dạng `msg` + `fields` | TC_135 | P |
| REQ-BK-BOOK-137 | Sách không gắn khuyến mãi có giá bán bằng giá gốc | TC_116 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-138 | Sửa `price` tính lại giá bán | TC_132 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-139 | `price` = 100.000.000.000 được chấp nhận | TC_118 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-140 | `price` số lẻ được lưu nguyên | TC_119 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-141 | Sửa `categories` thay thế toàn bộ danh sách | TC_133 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-142 | `name` rỗng bị từ chối | TC_120 | P · `@NeedsVerify` |
| REQ-BK-BOOK-143 | Tên danh mục rỗng bị từ chối | TC_121 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-144 | `lengthData` bằng số phần tử thực trả về | TC_098 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-145 | `limit` phải là số nguyên | TC_098 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-146 | Body lỗi 400 của bộ lọc không lộ thông tin nội bộ | TC_097 | Kỳ vọng chưa đạt · `@KnownBug` |

**Tổng:** 98/98 REQ có ≥ 1 TC ✅ · không REQ nào 🔴. TC gộp nhiều REQ — biến thể → REQ: `TC_060` (bước 1–2→`53` · bước 3→`54`) · `TC_061` (`a·b`→`64` · `c`→`65` · `d`→`66`) · `TC_064` (`a·b`→`71` · `c`→`72`) · `TC_065` (`a`→`56` · `b`→`60` · `c·f`→`57·61` · `d`→`57` · `e`→`59` · `g`→`62` · `h`→`63` · `i`→`58`) · `TC_067` (`a`→`89` · `b·c`→`90`) · `TC_069` (`a`→`91` · `b`→`92`) · `TC_073` (`a·b·c`→`104` · `d`→`105`) · `TC_078` (`a·b`→`77·79`) · `TC_098` (`a·b`→`144` · `c`→`145`) · `TC_108` (`a`→`96` · `b·c`→`98`) · `TC_109` (`a`→`99` · `b→e`→`100`) · `TC_113` (`a`→`107` · `b`→`108`) · `TC_126` (`a`→`121` · `b·c`→`122`) · `TC_081` (bước 3→`115` · bước 3–4 slug→`117`).

---

## Bảng Đối Soát Evidence

Đã mở **19/19** ảnh ở [`requirements/_book-api/book/web/evidence/`](../../../requirements/_book-api/book/web/evidence/).

| Ảnh evidence | Màn hình / trạng thái | TC dựa vào | Đầy đủ? |
|---|---|---|---|
| `web_book_list_guest_viewport.png` | Khách — không New book / bút / ⚙ | TC_001 · 003 | ✅ |
| `web_book_list_logged_in_viewport.png` | Đã đăng nhập — New book, bút, ⚙ | TC_002 · 004 · 005 · 006 | ✅ |
| `web_book_sort_menu_open_viewport.png` | Menu Sort By 4 mục | TC_008 | ✅ |
| `web_book_category_tab_selected_viewport.png` | Tab `Test 11` chọn · thẻ `13 Th08 2026` không có New | TC_014 · 007-c | ✅ |
| `web_book_filter_search_uppercase_viewport.png` | Tìm `DORAEMON` · `Price not specified` | TC_015 · 016-c · 017 · 021 | ✅ |
| `web_book_filter_price_range_lost_from_viewport.png` | Khoảng giá — vẫn có giá âm · thẻ `21 Th09 2026` có New | TC_020 · 021 · 013 | ✅ |
| `web_book_create_default_fullpage.png` | Form tạo mặc định | TC_024 · 025 · 026 | ✅ |
| `web_book_create_missing_required_fullpage.png` | Thiếu ảnh · giá · danh mục | TC_035 · 036-a · 037 | ✅ |
| `web_book_create_categories_open_viewport.png` | Danh sách Categories | TC_043 | ✅ |
| `web_book_create_freetext_category_chip_viewport.png` | Chip ngôi sao 28 ký tự + lỗi | TC_044 · 046-b | ✅ |
| `web_book_create_filled_fullpage.png` | Form đủ, slug tự sinh, ảnh xem trước | TC_033-a · 042-a · 048 | 🟡 Ảnh thu nhỏ bị header dính che một phần |
| `web_book_create_success_toast_viewport.png` | `Book created successfully.` giữ tab `Test` | TC_027 | ✅ |
| `web_book_detail_own_viewport.png` | Chi tiết sách tự tạo | TC_029 · 007-b | ✅ |
| `web_book_modify_default_fullpage.png` | Modify điền sẵn | TC_030 | ✅ |
| `web_book_modify_success_toast_viewport.png` | `Book updated successfully.` | TC_031 · 028 · 007-a | ✅ |
| `web_book_unavailable_card_no_mark_element.png` | Thẻ UNAVAILABLE không dấu hiệu | TC_054 (ghi chú) | ✅ |
| `web_book_delete_confirm_stale_name_viewport.png` | Hộp xoá hiện tên cũ | TC_055 | ✅ |
| `web_book_delete_success_toast_viewport.png` | `Deleted successfully.` | TC_032 | ✅ |
| `web_book_detail_deleted_not_found_viewport.png` | `No Data` sau xoá | TC_052 · 059 | 🟡 Không bắt kịp thông báo `Book not found.` — câu đọc bằng DOM |
| *(đọc DOM / network, không ảnh)* | Sort giá · URL sort · cuộn 36→72 · lọc giá từ · slug khoá · giá biên · file `.txt` · khuyến mãi · lượt xem · slug sinh lại · `status` · Cancel xoá | TC_009 · 011 · 012 · 019 · 034 · 038 · 040 · 041-a · 047 · 049 · 051 · 053 · 054 · 056 | ✅ theo số liệu ghi trong AC |

### Vùng chưa có evidence — TC / biến thể gắn `@NeedsVerify`

| TC | Phần chưa có evidence | Đề xuất recon bổ sung |
|---|---|---|
| TC_010 · 012 · 019 | Giá giảm dần · đếm 72 thẻ · giá từng thẻ khi lọc `from` | Chụp + đếm |
| TC_016-b · 018 | Tìm theo slug · ô giá không nhận chữ | 1 ảnh / trạng thái |
| TC_023-b · 033 `b` `c` · 036-b · 039-b · 041-b | URL sửa sách khi là khách · slug đặc biệt · giá chữ · `1001` · giá rất lớn | Chốt `ASM-BK-BOOK-01` · `03` |
| TC_045 · 046-a · 050 | Biên danh mục 24 / 25 · tạo danh mục mới (quyết định PO) | Chạy thật, chụp ảnh |
| TC_047 · 049 · 057 · 058 | Tệp `.txt` · bảng khuyến mãi · Create 2 lần · tên chuỗi tấn công | 1 ảnh / trạng thái |

---

## Đối soát loại kiểm thử (4 vòng)

| Vòng | Nhánh | Trạng thái | TC ID / Lý do |
|---|---|---|---|
| 1 | UI cơ bản | ✅ | TC_001 · 002 · 006 · 024 · 025 · 030 (6 TC · 10 mục Bảng kiểm) |
| 1 | Open form | ✅ | TC_024 (`New book`) · 030 (bút) · 029 (chi tiết) · khách mở URL: TC_023 |
| 1 | Display | ✅ | TC_002 (giá `50.000 ₫`, giá gạch, ngày `dd ThMM yyyy`) · 042 (định dạng `VNĐ`) · 052 (trạng thái rỗng `No Data`) |
| 1 | Input valid data | ✅ | TC_027 (đủ ô bắt buộc) · 059 (vòng đời) |
| 1 | Save | ✅ | TC_027 · 031 · 032 — thông báo + điều hướng giữ bộ lọc |
| 1 | Verify data | ✅ | TC_028 (danh sách) · 029 (chi tiết) · 031 bước 4 |
| 2 | UI Behavior | ✅ | TC_015 · 026 · 034 · 048 · 053 |
| 2 | Required | ✅ | TC_035 · 036 · 037 (3 TC · 4 biến thể) — Book name: ⏭️ câu lỗi chưa lấy được (ngoài phạm vi requirements) |
| 2 | Validation | ✅ | TC_038 → 047 (10 TC · 16 biến thể) — đối soát bảng 15 loại bên dưới |
| 2 | Equivalence Partitioning | ✅ | TC_007 (lớp ngày) · 016 (lớp nơi khớp từ khoá) · 033 (lớp tên → slug) |
| 2 | Boundary Value Analysis | ✅ | Giá TC_038 · 039 · 040 · 041 (`999`/`1000` · `100000000000`/`100000000001`) · tên danh mục TC_045 · 046 (`24`/`25`) |
| 2 | Business Rule | ✅ | Giá bán không âm TC_013 · lọc 2 đầu TC_020 · lượt xem +1 TC_051 · New 7 ngày TC_007 |
| 2 | Decision Table | ➖ | Không có quy tắc ≥ 3 điều kiện kết hợp — các lỗi bắt buộc của form tạo là độc lập từng ô |
| 2 | State Transition | ✅ | Bảng trạng thái ở mục Coverage — 4 chuyển có REQ ✅ · 2 chuyển ⏭️ chưa có REQ |
| 2 | Dependency | ✅ | TC_033 · 053 (tên → slug) · 050 (chip → danh mục) · 059 (xoá → link chi tiết chết) |
| 2 | Use Case / Scenario | ✅ | TC_059 |
| 2 | Save / Edit / Delete | ✅ | TC_027 · 031 · 054 · 032 · 056 (huỷ xoá) · 055 |
| 2 | Error Guessing | ✅ | TC_057 (Create 2 lần) · 047 (tệp sai loại) · 036-b (chữ vào ô số) |
| 3 | Permission | ✅ | TC_003 · 004 · 023 — đủ **10/10** ô *đã kiểm chứng* của ma trận Web. 2 ô *suy diễn* (sửa sách người khác · ⚙): 🚫 cố ý **không** thao tác trên dữ liệu người khác. Cột *Vai trò khác*: ➖ không có vai trò (`AMB-BK-01` ✅) |
| 3 | Security | ✅ | TC_003 · 023 · 058 (XSS tên sách) · email người đăng công khai: PO chốt là cố ý (`AMB-BK-BOOK-13`) — TC_029 xác nhận |
| 3 | API | ✅ (25-09-2026) | Mặt API có **76 TC** ở [`api/parts/`](api/parts/) — 5 endpoint, phủ **98/98** REQ. Gồm: auth 401 (`067` · `083` · `087`) · BOLA F-02 (`085` · `089`) · giá bán bất thường F-35 (`116` · `117` `@KnownBug`) · giá không tính lại F-36 (`132`) · giá gốc âm F-04 (`073` · `127`) · danh mục cộng dồn F-37 (`133`) · danh mục sinh tự động (`074`) · bộ lọc JSON (`062` → `064` · `091` → `096`) · Mass Assignment (`076` · `130`) · sách mồ côi F-06 (`134`) · content-type F-41 (`068` · `131`) |
| 3 | Database | ➖ | QA **không** có quyền truy vấn CSDL — đội Dev xác minh |
| 3 | Integration | ➖ | Không có tích hợp bên thứ ba — ảnh lưu ở module `FILE`, khuyến mãi ở `PROMO` cùng hệ thống |
| 3 | Logging / Audit | ➖ | Requirements không có yêu cầu nhật ký thao tác |
| 4 | Compatibility | ⏭️ Cố ý bỏ | Chỉ Chrome desktop. **Quyết định:** phạm vi khảo sát 25-09-2026 — QA lead chốt danh sách trình duyệt. **Rà lại khi:** có cam kết đa trình duyệt |
| 4 | Responsive / UI Stability | ⏭️ Cố ý bỏ | Chỉ viewport `1600×750`; bố cục khách khác đăng nhập (ghi nhận, chưa có REQ). **Rà lại khi:** chốt danh sách breakpoint |
| 4 | Accessibility | ⏭️ Cố ý bỏ | Chưa có REQ trợ năng; nút bút / ⚙ **không** có nhãn truy cập (ghi chú automation). **Quyết định:** đề xuất bỏ ở đợt này — cần QA lead / PO xác nhận. **Rà lại khi:** PO chốt yêu cầu trợ năng |
| 4 | Performance | ➖ | Không có ngưỡng cam kết — đội hiệu năng (chưa phân công). Cuộn vô tận 750+ sách chỉ quan sát ở TC_012 |
| 4 | Regression | ➖ | `docs/bugs/_book-api/` chưa có bug nào được đóng |
| 4 | E2E | ✅ | TC_023 (Book → Sign in — xuyên `AUTH`) · 050 (Book → danh mục `CAT`) · 059 |

### Đối soát Validation theo bảng 15 loại field (form tạo sách)

| Ô | Loại | Mục của bảng | Kết quả |
|---|---|---|---|
| Book name | Text | Bắt buộc ⏭️ câu lỗi chưa lấy được (Create khoá khi form trống — TC_026) · Ký tự đặc biệt / XSS ✅ 058 · Unicode ✅ 033-a · Max length · SQLi · khoảng trắng đầu/cuối ➖ chưa có REQ | 2 ✅ · 1 ⏭️ · 3 ➖ |
| Slug name book | Text (khoá) | Tự sinh ✅ 033 · Khoá ✅ 034 · Sửa tay qua `Change` ➖ ngoài phạm vi requirements | 2 ✅ |
| Regular price | Number / Currency | Bắt buộc ✅ 036 · Min / Max ✅ 038 → 041 · Số âm ✅ 038-a · Số 0 ✅ 038-b · Thập phân ✅ 042-b · Ký tự không phải số ✅ 036-b · Định dạng tiền ✅ 042 · Leading zeros ➖ không có REQ | 7/8, 1 ➖ |
| Categories | Multi-Select / Tag | Bắt buộc ✅ 037 · Chọn có sẵn ✅ 043 · Tag tự gõ ✅ 044 · Độ dài tag ✅ 045 · 046 · Xoá tag bằng `×` ✅ 044 · Giới hạn số tag · tag trùng ➖ không có REQ | 5 ✅ · 2 ➖ |
| Picture | File Upload | Bắt buộc ✅ 035 · Loại không hợp lệ ✅ 047 · Hợp lệ ✅ 048 · Dung lượng tối đa · nhiều tệp · kéo thả · tệp 0 KB ➖ ngoài phạm vi requirements (*chưa thử*) | 3 ✅ · 4 ➖ |
| Description | Textarea | ➖ chưa có REQ giới hạn (ngoài phạm vi) | — |
| Available book | Checkbox | Mặc định ✅ 025 · Tắt / lưu ✅ 054 | 2/2 |
| Price from / to | Number | Gợi ý ✅ 018 · Chỉ nhận số ✅ 018 · Từ ✅ 019 · Khoảng ✅ 020 | 4/4 |

---

## Rà soát đặc tính chất lượng (ISO/IEC 25010:2023)

| Đặc tính | Trạng thái | TC ID / Lý do |
|---|---|---|
| Functional Suitability | ✅ Có TC | TC_001 → TC_059 |
| Performance Efficiency | ➖ Ngoài phạm vi | Không có ngưỡng cam kết — đội hiệu năng (chưa phân công) |
| Compatibility | ➖ Ngoài phạm vi | Chỉ Chrome desktop — QA lead chốt danh sách trình duyệt |
| Interaction Capability | ✅ Có TC | TC_026 (chặn thao tác khi form trống) · 035 → 037 (lỗi trỏ đúng ô) · 052 (trạng thái rỗng) · 056 (huỷ xoá). Trợ năng: ➖ QA lead / PO |
| Reliability | ✅ Có TC (một phần) | TC_057 (Create 2 lần). Mất mạng khi tải ảnh / tạo sách: ➖ chưa có REQ — QA lead |
| Security | ✅ Có TC | TC_003 · 023 · 058. Pentest / BOLA mặt API: ➖ chờ REQ API — QA lead |
| Maintainability | ➖ Không áp dụng | Đặc tính của mã nguồn |
| Flexibility | ➖ Ngoài phạm vi | Responsive / đổi ngôn ngữ chưa khảo sát — QA lead |
| Safety | ✅ Có TC | Có xác nhận trước thao tác không hồi lại được (xoá): TC_055 · 056. Giá bán âm hiển thị công khai là rủi ro tài chính → TC_013 `@KnownBug` |

---

## Đối soát cột Automation

| Nền tảng | Yes | Partial | No | ⏸️ Hoãn |
|---|---|---|---|---|
| Web | 57 | 2 | 0 | 17 (`@NeedsVerify` — nằm trong Yes / Partial) |
| API | 75 | 1 | 0 | 1 (`TC_120` `@NeedsVerify`) — 20 TC `@KnownBug` chạy được, **dự kiến FAIL** |

### Điều kiện cần chuẩn bị

| # | Điều kiện | Ai cấp | Trạng thái | TC phụ thuộc |
|---|---|---|---|---|
| 1 | Tệp `auto_book_cover.png` (≈ 1 KB) · `auto_note.txt` trong thư mục test data | QA | ⏳ Cần tạo khi dựng automation | Mọi TC tạo sách · TC_047 |
| 2 | Xoá danh mục `Auto Cat …` (module `CAT`) và ảnh bìa (module `FILE`) ở teardown | QA | ⏳ Chưa có REQ `CAT` / `FILE` — tạm ghi *còn sót* | TC_050 · mọi TC tạo sách |
| 4 | Danh sách từ khoá "tên thư viện truy cập dữ liệu" (`ASM-BK-BOOK-05`) | Dev | ⏳ Chưa có | TC_097 |
| 5 | Dev dọn sách tên rỗng và danh mục tên rỗng có sẵn (nếu muốn kiểm nhánh "rỗng, chưa trùng") | Dev | ⏳ Chưa có | TC_120 · 121 |
| 3 | Nhãn truy cập cho nút bút / ⚙ (hiện không có) | Dev | ⏳ Chưa có — tạm bắt theo thẻ chứa tên sách | TC_004 · 030 · 031 · 053 → 056 · 059 |

### TC Partial · No · Hoãn

| TC ID | Automation | Trục chặn | Điều kiện · phần kiểm tay · lý do |
|---|---|---|---|
| BK_BOOK_TC_049 | Partial | 1 · Expected cốt lõi nằm ở request | Automation đọc tham số request (bắt `page.on('request')`); nội dung bảng khuyến mãi kiểm tay · ⏸️ Hoãn — `@NeedsVerify` |
| BK_BOOK_TC_057 | Partial | 2 · Chạy lại có cùng kết quả | Hai lần bấm dưới 1 giây phụ thuộc tốc độ công cụ — assert số thẻ sau cùng · ⏸️ Hoãn — `@NeedsVerify` |
| BK_BOOK_TC_010 · 012 · 016 · 018 · 019 · 023 · 033 · 036 · 039 · 041 · 045 · 046 · 047 · 050 · 058 | Yes · ⏸️ Hoãn | — | `@NeedsVerify` — biến thể đã có evidence automate ngay |

| BK_BOOK_TC_121 | Partial | 2 · Không chạy lại được | `@RunOnce` — tạo danh mục tên rỗng **không xoá được**; chạy tay một lần, không đưa vào regression |

ℹ️ 3 TC Web `@KnownBug` (TC_013 · 020 · 055) và 20 TC API `@KnownBug` **vẫn automate** — test FAIL chính là thứ phơi bug.

---

## Bộ chạy đề xuất

| Bộ | TC | Thời gian ước tính | Ghi chú |
|---|---|---|---|
| **Smoke** (V1) | TC_024 → 032 (tạo `S-A` trước) → TC_001 → 006 | ~25 phút | Fail ở đây → dừng |
| **Smoke API** | TC_060 · 066 · 081 · 086 | ~3 phút | `@Smoke` mặt API |
| API đầy đủ | TC_060 → 135 (trừ `121`) | ~25 phút | Teardown (sách → danh mục → tài khoản) bắt buộc; `@KnownBug` dự kiến FAIL |
| API `@KnownBug` | TC_068 · 070 · 073 · 097 · 098 · 101 · 102 · 103 · 105 · 107 · 116 · 117 · 118 · 119 · 122 · 127 · 131 · 132 · 133 | ~4 phút | Chạy riêng để tách khỏi kết quả hồi quy |
| Regression đầy đủ | TC_001 → 059 theo *Thứ tự chạy* | ~2,5 giờ | Kết thúc bằng teardown |
| Bảo mật & quyền | TC_003 · 004 · 023 · 058 | ~10 phút | `@Security` |
| Lỗi đã biết | TC_013 · 020 · 055 | ~10 phút | `@KnownBug` — mở bug bằng `/create-bug-report` |
| `@TechCheck` | TC_005 · 025 · 048 · 049 · 054 · 056 | — | Phần 🔧 cần DevTools → Network |

---

## Nhật ký thay đổi

| Ngày | Thay đổi | Mốc git |
|---|---|---|
| 25-09-2026 | **Chỉnh bộ TC API theo REQ mặt API** (`/generate-requirements-from-api book` + `DEMO-AMB-2509B`): 30 → **76 TC** (`BK_BOOK_TC_060` → `135`; thêm `090` → `135` = 46 TC), tách `api/test_cases_book_api.md` thành **3 part** ở `api/parts/` (> 40 TC). Neo **1:1** REQ API — bỏ mọi dòng `⚠️ Chưa có REQ`. Phủ **98/98** REQ. **Sửa kỳ vọng:** `TC_066` · `081` bỏ ràng buộc status `200` → **2xx** (kiểm `201` riêng ở `102` · `122` `@KnownBug` — spec đúng); `TC_064` **hết `@KnownBug`** (API lọc đúng hai đầu — lỗi mất cận dưới ở **web**); `TC_070` (thiếu `price`) · `073` (giá âm) đổi thành `@KnownBug` theo quyết định PO; `TC_074` (danh mục không tồn tại) đổi thành kiểm **sinh danh mục mới** (thiết kế, `REQ-52`). `TC_075` thêm biến thể HOA. `TC_077` bỏ biến thể description 10.000 ký tự (→ `112`). Thêm 20 TC `@KnownBug` (`068` · `070` · `073` · `097` · `098` · `101` · `102` · `103` · `105` · `107` · `116` → `119` · `121` · `122` · `127` · `131` → `133`), 1 `@NeedsVerify` (`120`). Bỏ `@NeedsVerify` ở các biến thể đã gọi thật | `b30eb57` (trước khi sửa) |
| 25-09-2026 | `/generate-testcases-api book` — thêm mặt **API**: **30 TC** (`BK_BOOK_TC_060` → `089`, 1 file `api/`), độ hạt GỘP. Kiểm chứng ~15 request thật (dữ liệu tự tạo + dọn sạch). Neo tạm REQ Web (20 REQ) · 14 TC `⚠️ Chưa có REQ`. Phát hiện mới F-28 (thiếu price vẫn tạo) · F-29 (trùng tên sách) · F-30 (minItems categories) ghi `api_map.md`. @KnownBug: `064` (lọc khoảng giá F-17) · `073` (giá âm F-04). Module `BOOK` **89 TC** | `b30eb57` (trước khi tạo) |
| 25-09-2026 | Khởi tạo bộ TC **Web** bằng `/generate-testcases-from-requirements` Mode QUICK, độ hạt GỘP, rủi ro Cao → Đầy đủ. **59 TC · 73 biến thể · 10 mục Bảng kiểm**, 2 part, chiếm dải `BK_BOOK_TC_001` → `059`. Phủ **52/52** REQ Web (gồm `REQ-51` · `52` mới và `03` · `34` 🟡 của `DEMO-AMB-2509`). Đã mở 19/19 ảnh evidence, không xung đột. 3 TC `@KnownBug` · 17 TC `@NeedsVerify` · 6 TC `@TechCheck` · 4 Assumption | `b30eb57` (trước khi tạo) |
