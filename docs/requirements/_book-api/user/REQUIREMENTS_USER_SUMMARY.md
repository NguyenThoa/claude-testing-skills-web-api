# Đặc tả Yêu cầu — Module Người dùng (`USER`)

> Điểm vào cấp hệ thống: [../README.md](../README.md) · Bản đồ API: [../_discovery/api_map.md](../_discovery/api_map.md) mục 2.2 · API: [api/requirements_user_api.md](api/requirements_user_api.md) · Bản đồ app: [../_discovery/modules/module_02_nguoi_dung.md](../_discovery/modules/module_02_nguoi_dung.md)

| Mục | Giá trị |
|---|---|
| **Hệ thống** | AnhTester Book Management — mã hệ thống `BK` (namespace `_book-api/`) |
| **Module** | Người dùng — quản lý tài khoản người dùng (danh sách, tìm/lọc, thêm, sửa, khoá/mở, xoá). Hồ sơ **của chính mình** (My Profile, Setting account) thuộc module `AUTH` |
| **Prefix** | `USER` → mã REQ `REQ-BK-USER-<nn>` · TC ID `BK_USER_TC_<nnn>` |
| **Nền tảng** | **Web** ✅ (25-09-2026) · **API** ✅ (25-09-2026 — 5 operation `GET/POST /api/user` · `GET/PATCH/DELETE /api/user/{id}`) · Android ⬜ chỉ có bản đồ · iOS ❔ |
| **Nguồn phân tích** | Web: thao tác thật trên `https://book.anhtester.com/user-management` (Chrome, Playwright MCP) ngày 25-09-2026 · API: spec OpenAPI (snapshot 19-09-2026, `sha256` trùng bản tải lại 25-09-2026) + ≈ 360 request gọi thật ngày 25-09-2026 — chi tiết ở file nền tảng |
| **Ngày phân tích** | 25-09-2026 |
| **Tài khoản dùng khảo sát** | Khách + 2 tài khoản tự tạo `auto_web_<timestamp>_a|b@auto.test` — sửa/xoá **chỉ** trên 2 tài khoản này |
| **Môi trường dùng chung** | **KHÔNG** (user chốt 14-08-2026) — vẫn chỉ ghi/xoá bản ghi do phiên tạo |
| **Tổng số REQ** | **119** — `web/` 38 · `api/` 77 · dùng chung 4 (`01` · `33` · `35` · `38` — `Web · API`) |
| **Dải mã đã dùng** | `REQ-BK-USER-01` → `REQ-BK-USER-119` (đợt 1 Web `01 → 42` · đợt 2 API `43 → 115` · đợt 3 chốt AMB `DEMO-AMB-2509B` `116 → 119`) · `AMB-BK-USER-01` → `AMB-BK-USER-17` · `RISK-BK-USER-01` → `RISK-BK-USER-08` · `STORY-BK-USER-01` → `12` |
| **Mã kế tiếp** | Đợt phân tích sau bắt đầu từ `REQ-BK-USER-120` · `AMB-BK-USER-18` · `RISK-BK-USER-09` — **KHÔNG đánh lại từ 01** |
| **Ambiguity còn treo** | **0** — 17/17 AMB đã chốt 25-09-2026 (`01 → 07`: `DEMO-AMB-2509` · `08 → 17`: `DEMO-AMB-2509B` — cùng là dữ liệu dạy học demo) · AMB cấp hệ thống tham chiếu (`AMB-BK-01` · `02` · `08` · `12`) cũng đã chốt |

---

## 1. Tổng quan

Màn hình `User Management` là **danh sách người dùng công khai**: khách chưa đăng nhập vẫn xem, tìm và lọc được toàn bộ người dùng kèm email, số điện thoại, địa chỉ (cùng bản chất F-01 của mặt API). Đăng nhập bằng **bất kỳ** tài khoản tự đăng ký nào cũng thêm, sửa, khoá, xoá được người dùng **khác** (F-02) — chỉ riêng dòng của chính mình bị khoá thao tác.

Mặt **API** (`/api/user*`) làm được đúng những việc đó và **hơn** — tạo không cần biết mật khẩu, đổi mật khẩu của người khác không cần mật khẩu cũ, tự sửa/xoá chính mình — vì không có mô hình vai trò (`AMB-BK-01` ✅). Chi tiết ở [api/requirements_user_api.md](api/requirements_user_api.md).

Người dùng có một trạng thái nghiệp vụ: **Active / Inactive** (công tắc `Active for login`). Inactive thì không đăng nhập được (REQ-BK-AUTH-100).

### Trong phạm vi

- Danh sách: cột, sắp xếp mặc định và theo cột, số dòng mỗi trang, phân trang
- Tìm kiếm theo từ khoá · bộ lọc nâng cao (Field · Operator · Value · AND/OR)
- Nút thao tác theo trạng thái đăng nhập · thêm · sửa · khoá/mở · xoá người dùng

### Ngoài phạm vi

| Vùng | Lý do |
|---|---|
| My Profile · Setting account | Thuộc module `AUTH` (REQ-BK-AUTH-101 → 119) dù nằm dưới breadcrumb `User management` |
| Tải ảnh đại diện (Upload photo) | Quy tắc đã chốt (3.0 MB · 7 định dạng) nhưng **để ngoài phạm vi** đợt kiểm thử web này — khảo sát cùng module `FILE` (`AMB-BK-USER-05` ✅) |
| Bộ lọc với Field kiểu ngày (`Created At` · `Updated At`) và `Is Active` | Chưa thử — chỉ thử `Email` và `Phone` |
| Android | Chỉ có bản đồ ở tầng khám phá — chạy `/generate-requirements-from-mobile user` |
| Tải lên ảnh đại diện qua API (`/api/file`) | Thuộc module `FILE` |
| Vai trò khác ngoài "người dùng tự đăng ký" | Hệ thống **không có** mô hình vai trò — `AMB-BK-01` · `AMB-BK-USER-01` ✅ chốt 25-09-2026 |

---

## Bản đồ tài liệu

| Nền tảng | File | Story | REQ bao phủ |
|---|---|---|---|
| Chung ≥ 2 nền tảng | Index — mục 3 | — | `REQ-BK-USER-01` · `33` · `35` · `38` (4) |
| Web | [web/requirements_user_web.md](web/requirements_user_web.md) | STORY-BK-USER-01 → 06 | `REQ-BK-USER-02` → `42` trừ `33` · `35` · `38` (38) |
| API | [api/requirements_user_api.md](api/requirements_user_api.md) | STORY-BK-USER-07 → 12 | `REQ-BK-USER-43` → `REQ-BK-USER-119` (77) |

Tự kiểm: `4 + 38 + 77 = 119` = dải `01 → 119` ✔ — mỗi REQ nằm ở đúng 1 file.

| Nội dung | Ở đâu |
|---|---|
| Metadata · Tổng quan & phạm vi (1) · REQ dùng chung (3) · Ma trận phân quyền (6) · Ma trận trạng thái (7) · Phân rã Story (10) · AMB & RISK (11) · Nhật ký (13) | **File này** |
| Trình duyệt khảo sát · Bảng REQ · Field Spec · Validation · Luồng · Phi chức năng · Ghi chú automation · Danh mục Evidence · Dữ liệu test | [web/requirements_user_web.md](web/requirements_user_web.md) |
| Endpoint Catalog · Bảng REQ · Field Spec JSON · Validation (body lỗi nguyên văn) · Luồng · Phi chức năng · Nhật ký kiểm chứng request · Dữ liệu tạo/dọn | [api/requirements_user_api.md](api/requirements_user_api.md) |

---

## 3. Yêu cầu dùng chung (Web · API)

Bốn REQ dưới đây sinh ở đợt Web (25-09-2026), **chuyển lên index** cùng ngày khi kiểm khớp trên API; mã giữ nguyên, AC viết lại ở mức **rule** rồi thêm vế **Web** / **API**. Ảnh evidence ở lại `web/evidence/`.

| REQ ID | Tên yêu cầu | Nền tảng | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|---|
| REQ-BK-USER-01 | Không cần đăng nhập vẫn xem được danh sách người dùng | Web · API | Hành vi hiện tại — **cùng bản chất F-01** (`AMB-BK-02` ✅ cố ý) | Chưa đăng nhập / không gửi token → danh sách người dùng trả về, mỗi bản ghi có tên · **email** · **số điện thoại** · **địa chỉ**. **Web:** mở `/user-management` → bảng hiển thị; network `GET /api/user?sortBy=desc&sort=updatedAt&page=1&limit=5&search=` → 200 (không token). **API:** `GET /api/user?limit=2&page=1` không `Authorization` → **200** · `list` có đủ các khoá (REQ-43) | 🟢 | 25-09-2026 · + API | Web: Kiểm chứng thực tế · `web_user_list_guest_viewport.png` · API: Spec (`security: []`) + kiểm chứng thực tế · GET /api/user → 200 (K-01) |
| REQ-BK-USER-33 | Email đã tồn tại bị từ chối khi tạo người dùng | Web · API | Rule do server quyết định | Tạo người dùng với email của tài khoản **đã có** (kể cả viết HOA) → bị từ chối với thông báo `Email already exists.`, **không** tạo bản thứ hai. **Web:** `Save` → dưới ô Email `Email already exists.` + thông báo nổi cùng câu · hộp thoại **vẫn mở**, dữ liệu giữ nguyên · `POST /api/user` → **422**. **API:** `POST /api/user` (Bearer hợp lệ) → **422** · `msg` = `Email already exists.` · `fields.email` chứa cùng câu · mật khẩu của tài khoản có sẵn **không** đổi | 🟢 | 25-09-2026 · + API | Web: Kiểm chứng thực tế · `web_user_add_email_exists_viewport.png` · API: Spec + kiểm chứng thực tế · POST /api/user → 422 (K-42) |
| REQ-BK-USER-35 | Tài khoản vừa tạo đăng nhập được bằng mật khẩu đã đặt | Web · API | Tác tạo dùng được (skill 4.3.8) | Tài khoản tạo (Active bật) → đăng nhập đúng email + mật khẩu đã đặt lúc tạo → thành công. **Web:** Sign in → Dashboard · `Login successfully.` · **API:** `POST /api/login` → **200** | 🟢 | 25-09-2026 · + API | Web: Kiểm chứng thực tế · API · POST /api/login → 200 · API: Kiểm chứng thực tế · POST /api/login → 200 (K-35) |
| REQ-BK-USER-38 | Để trống mật khẩu khi cập nhật thì mật khẩu không đổi | Web · API | Rule do server quyết định | (1) Cập nhật người dùng với `password` rỗng → (2) đăng nhập bằng mật khẩu **cũ** → đăng nhập được. **Web:** 2 ô mật khẩu trống → request gửi `password: ""`. **API:** `PATCH /api/user/{id}` body `{name, email, password: ""}` → **200** → `POST /api/login` mật khẩu cũ → **200** | 🟢 | 25-09-2026 · + API | Web: Kiểm chứng thực tế · API · POST /api/login → 200 sau Update · API: Kiểm chứng thực tế · PATCH → 200 (K-67) |

---

## 6. Ma trận Phân quyền

Hệ thống **không** lộ khái niệm vai trò trên web (không chọn vai trò khi tạo người dùng, không có màn hình phân quyền). Cột có căn cứ: **Khách** và **người dùng tự tạo** (đăng ký hoặc tạo qua Add user).

| Hành động (Web) | Khách | Đã đăng nhập (tài khoản tự tạo) | Vai trò khác (nếu có) |
|---|---|---|---|
| Xem danh sách (kèm email · phone · địa chỉ) | ✅ (REQ-01) | ✅ | — |
| Tìm kiếm · lọc · sắp xếp | ✅ (REQ-08 · 15 · 10) | ✅ (REQ-08) | — |
| Thêm người dùng (`New user`) | ❌ — không có nút (REQ-19) | ✅ (REQ-34) | — |
| Sửa người dùng **khác** | ❌ — không có ⋮ (REQ-19) | ✅ (REQ-23 · 37) | — |
| Xoá người dùng **khác** | ❌ — không có ⋮ (REQ-19) | ✅ (REQ-23 · 42) | — |
| Sửa / xoá **chính mình** từ danh sách | — | ❌ — Edit/Delete khoá (REQ-22) | — |

```
Tổng 18 ô = Đã kiểm chứng 11 · Suy diễn 0 · Chưa rõ 0 · Không áp dụng 7
Ô "không áp dụng" là [Sửa/xoá chính mình × Khách] — khách không có tài khoản.
Và cột "Vai trò khác" × 6 hành động — hệ thống không có vai trò nào khác (AMB-BK-USER-01 · AMB-BK-01 ✅ 25-09-2026).
Ô "Đã đăng nhập × Sửa/Xoá người dùng khác" chỉ thử trên tài khoản do chính phiên tạo.
```


### Ma trận phân quyền — mặt API

| Operation (API) | Không token | Token hợp lệ (tài khoản tự tạo) | Vai trò khác (nếu có) |
|---|---|---|---|
| `GET /api/user` · `GET /api/user/{id}` | ✅ 200 (REQ-01 · 67) | ✅ 200 | — |
| `POST /api/user` | ❌ 401 (REQ-71 · 72) | ✅ 201 (REQ-69) | — |
| `PATCH /api/user/{id}` — người dùng **khác** | ❌ 401 (REQ-102) | ✅ 200 — kể cả đổi mật khẩu của họ (REQ-97 · 104) | — |
| `PATCH /api/user/{id}` — **chính mình** | — | ✅ 200 (REQ-105) | — |
| `DELETE /api/user/{id}` — người dùng **khác** | ❌ 401 (REQ-111) | ✅ 200 (REQ-114) | — |
| `DELETE /api/user/{id}` — **chính mình** | — | ✅ 200 (REQ-110 — dùng ở bước dọn dữ liệu) | — |

```
Tổng 18 ô = Đã kiểm chứng 10 · Suy diễn 0 · Chưa rõ 0 · Không áp dụng 8
Ô "không áp dụng": cột "Vai trò khác" × 6 hành động (hệ thống không có vai trò — AMB-BK-01 ✅) và
[PATCH · DELETE chính mình] × Không token (không có tài khoản để gọi).
Mọi ô ghi/xoá chỉ thử trên tài khoản do chính lượt chạy tạo.
```

---

## 7. Ma trận Trạng thái

Entity người dùng có trạng thái `isActive` (hiển thị `Active` / `Inactive`).

| Trạng thái hiện tại | Hành động cho phép | Trạng thái kế tiếp | Ai được thực hiện | Hệ quả |
|---|---|---|---|---|
| — (chưa có) | Add user với `Active for login` bật (mặc định) | Active | Người dùng đã đăng nhập bất kỳ | Đăng nhập được (REQ-35) |
| — (chưa có) | Add user với `Active for login` tắt | Inactive | Người dùng đã đăng nhập bất kỳ | ❔ Chưa thử |
| — (chưa có) | Tự đăng ký (Sign up) | Active | Khách | Đăng nhập được (REQ-BK-AUTH-03) |
| Active | Update → tắt `Active for login` | Inactive | Người dùng đã đăng nhập, **trừ** chính tài khoản đó | Không đăng nhập được — `User account is disabled.` (REQ-39 · AUTH-100) |
| Inactive | Update → bật `Active for login` | Active | Như trên | Đăng nhập lại được (REQ-40) |
| Active · Inactive | Delete | (đã xoá) | Như trên | Biến mất khỏi danh sách (REQ-42) |

### Bổ sung mặt API

| Trạng thái hiện tại | Hành động (API) | Trạng thái kế tiếp | Hệ quả quan sát |
|---|---|---|---|
| — (chưa có) | `POST /api/user` không `isActive` | Active | Đăng nhập được (REQ-82 · 35) |
| — (chưa có) | `POST /api/user` `isActive: false` | Inactive | `POST /api/login` → 403 `User account is disabled.` (REQ-83) |
| Active | `PATCH` `isActive: false` | Inactive | Đăng nhập → 403 (REQ-99) · `GET /api/me` bằng token cũ → 403 · **refresh token vẫn cấp được access token mới** (REQ-109 ❌ F-34 — token mới cũng bị 403 ở `/api/me`) |
| Inactive | `PATCH` `isActive: true` | Active | Đăng nhập lại được (REQ-100) |
| Active · Inactive | `DELETE` | (đã xoá) | Refresh token bị xoá (REQ-113) · access token cũ → 401 `User no longer exists` · sách của họ còn với `auth` = `null` (REQ-BK-BOOK-135) |

Phiên **đang mở** của người dùng vừa bị chuyển Inactive **không** bị cắt — hết khi access token hết hạn (`AMB-BK-USER-03` ✅ chốt 25-09-2026). Không cấp REQ.

---

## 10. Phân rã Epic / Story

| Story ID | Tên Story | REQ bao phủ | Số REQ | AMB / RISK liên quan | Ghi chú phạm vi |
|---|---|---|---|---|---|
| STORY-BK-USER-01 | Danh sách · tìm kiếm · sắp xếp · phân trang | REQ-BK-USER-01 → 10 | 10 | AMB-BK-USER-04 · 07 · RISK-BK-USER-01 · 02 · 03 | Khách và người dùng đăng nhập |
| STORY-BK-USER-02 | Bộ lọc nâng cao | REQ-BK-USER-11 → 18 | 8 | AMB-BK-USER-06 | Field · Operator · Value · AND/OR |
| STORY-BK-USER-03 | Quyền thao tác theo trạng thái đăng nhập | REQ-BK-USER-19 → 23 | 5 | AMB-BK-USER-01 | Nút New user · ⋮ · khoá thao tác trên chính mình |
| STORY-BK-USER-04 | Thêm người dùng | REQ-BK-USER-24 → 35 | 12 | AMB-BK-USER-02 · 05 | Hộp thoại Add user |
| STORY-BK-USER-05 | Sửa người dùng · khoá/mở | REQ-BK-USER-36 → 40 | 5 | AMB-BK-USER-03 | Hộp thoại Update user · `Active for login` |
| STORY-BK-USER-06 | Xoá người dùng | REQ-BK-USER-41 → 42 | 2 | RISK-BK-USER-04 | Hộp thoại Confirm delete |
| STORY-BK-USER-07 | Danh sách · tìm kiếm · sắp xếp · phân trang — API | REQ-BK-USER-43 → 65 · 116 → 119 | 27 | AMB-BK-USER-08 · 12 · 14 · RISK-BK-USER-05 · 06 · 08 | `GET /api/user` — mặt API |
| STORY-BK-USER-08 | Chi tiết người dùng — API | REQ-BK-USER-66 → 68 | 3 | — | `GET /api/user/{id}` |
| STORY-BK-USER-09 | Tạo người dùng — API | REQ-BK-USER-69 → 90 | 22 | AMB-BK-USER-09 · 10 · 15 · 16 | `POST /api/user` |
| STORY-BK-USER-10 | Sửa người dùng — API | REQ-BK-USER-91 → 109 | 19 | AMB-BK-USER-09 · 11 · 13 | `PATCH /api/user/{id}` |
| STORY-BK-USER-11 | Xoá người dùng — API | REQ-BK-USER-110 → 114 | 5 | AMB-BK-USER-17 · RISK-BK-USER-07 | `DELETE /api/user/{id}` |
| STORY-BK-USER-12 | Quy ước chung của module — API | REQ-BK-USER-115 | 1 | — | Error envelope 422 |

**Tổng: 12 Story / 119 REQ** — Web `10 + 8 + 5 + 12 + 5 + 2 = 42` · API `27 + 3 + 22 + 19 + 5 + 1 = 77` → `42 + 77 = 119 ✔` · mọi REQ thuộc đúng một Story, không mồ côi, không trùng.

### Đối chiếu AMB / RISK

| Nhóm | Mã | Nằm ở đâu |
|---|---|---|
| AMB thuộc Story | AMB-BK-USER-01 → 17 | phân bổ ở bảng Story |
| AMB cấp Epic | — | — |
| RISK thuộc Story | RISK-BK-USER-01 → 08 | phân bổ ở bảng Story |
| RISK cấp Epic | — | — |

### Hạng mục cấp Epic (cố ý không gán vào Story nào)

| Hạng mục | Lý do |
|---|---|
| Ma trận phân quyền (6) · Ma trận trạng thái (7) | Cắt ngang Story 03 · 04 · 05 · 06 |
| Tham chiếu `AMB-BK-01` · `AMB-BK-02` · `AMB-BK-12` | AMB **cấp hệ thống**, sở hữu ở `api_map.md` / `system_map.md` — module chỉ tham chiếu |

### Thứ tự triển khai đề xuất

1. **STORY-BK-USER-01 Danh sách** — nền cho mọi Story khác (tìm dòng dữ liệu test)
2. **STORY-BK-USER-04 Thêm** — tạo dữ liệu test cho Story 05 · 06 (tránh đụng dữ liệu người khác)
3. **STORY-BK-USER-05 Sửa · khoá/mở** — phụ thuộc Story 04; nối với REQ-BK-AUTH-100
4. **STORY-BK-USER-06 Xoá** — dùng để dọn dữ liệu cuối mỗi TC
5. **Mặt API (Story 07 → 12):** cùng thứ tự — `09 Tạo` trước để có dữ liệu cho `10` · `11` · `08`; `07` (đọc) chạy trước cùng với `08`; REQ ghi `❌ lệch` chạy như `@KnownBug`
6. **STORY-BK-USER-02 Bộ lọc** · **STORY-BK-USER-03 Quyền** — `AMB-BK-USER-01` ✅ chốt: không có vai trò, hành vi hiện tại là thiết kế — TC viết theo hiện trạng

---

## 11. Điểm Mơ Hồ & Rủi Ro

### 11.1. Ambiguities

| Mã | Câu hỏi | Nguy cơ | Mức độ | Assumption tạm | Trạng thái | Kết luận |
|---|---|---|---|---|---|---|
| AMB-BK-USER-01 | Hệ thống có vai trò quản trị không? Người dùng tự đăng ký có được **sửa/xoá người dùng khác** như hiện tại (REQ-23)? Xin tài khoản vai trò khác (nếu có) để kiểm 6 ô `❔` của ma trận phân quyền. *(Cùng gốc `AMB-BK-01` · F-02.)* | Bất kỳ ai tự đăng ký cũng xoá/khoá được mọi tài khoản — kể cả tài khoản quản trị | 🔴 | Hành vi hiện tại là thiết kế của hệ thống thực hành — TC viết theo hiện trạng, gắn `assumption-based` | ✅ Đã chốt 25-09-2026 | Hệ thống **không có** mô hình vai trò (theo `AMB-BK-01`) — mọi người dùng đã đăng nhập ngang quyền; sửa/xoá người dùng khác là **thiết kế** của hệ thống thực hành. REQ-23 giữ nguyên; cột *Vai trò khác* của ma trận phân quyền → **Không áp dụng** (DEMO-AMB-2509) |
| AMB-BK-USER-02 | Add user trên web **bắt buộc** Password (REQ-28), trong khi `POST /api/user` cho bỏ trống và gán mật khẩu mặc định (F-07). Rule đúng là gì? | Tạo qua API ra tài khoản mật khẩu đoán được; hai nền tảng lệch nhau | 🟡 | Web đúng — Password bắt buộc; F-07 là lỗi API | ✅ Đã chốt 25-09-2026 | Web đúng — Password **bắt buộc**; F-07 (API gán mật khẩu mặc định) là **lỗi API**, xử lý khi sinh REQ mặt API. REQ-28 giữ nguyên (DEMO-AMB-2509) |
| AMB-BK-USER-03 | Chuyển người dùng sang Inactive có **cắt phiên đang mở** của họ không (spec: *"Sửa user + thu hồi refresh token cũ"*)? Bấm vào dòng (con trỏ hình bàn tay) không mở gì — có trang/hộp chi tiết người dùng không? | Người bị khoá vẫn thao tác tiếp tới khi token hết hạn (6 ngày); không viết được TC chi tiết người dùng | 🟡 | Không cắt phiên · không có trang chi tiết — không cấp REQ | ✅ Đã chốt 25-09-2026 | **Không** cắt phiên đang mở — phiên hết khi access token hết hạn (cùng `AMB-BK-AUTH-06`) · **không có** trang chi tiết người dùng. Trùng Assumption, không cấp REQ (DEMO-AMB-2509) |
| AMB-BK-USER-04 | Số dòng mỗi trang **không** được giữ khi rời trang rồi quay lại (REQ-07). Cố ý? | Người dùng phải chọn lại mỗi lần | 🟡 | Cố ý — REQ-07 theo quan sát | ✅ Đã chốt 25-09-2026 | **Cố ý** — REQ-07 giữ nguyên (DEMO-AMB-2509) |
| AMB-BK-USER-05 | Upload photo (Add/Update user, My Profile): giới hạn thật là 3.0 MB? Định dạng ngoài danh sách bị chặn thế nào? Ảnh cũ bị xoá khi đổi ảnh? | Không viết được TC tải ảnh; rác tệp trên server | 🟡 | Chưa cấp REQ — cần một lượt khảo sát riêng (liên quan module `FILE`) | ✅ Đã chốt 25-09-2026 | Giới hạn **3.0 MB**, đúng 7 định dạng ghi dưới ô; ảnh cũ **không** bị xoá khi đổi (dọn ở module `FILE`). Tải ảnh đại diện **để ngoài phạm vi** đợt kiểm thử web này — khảo sát cùng module `FILE` (DEMO-AMB-2509) |
| AMB-BK-USER-06 | Ô tìm kiếm và bộ lọc nâng cao **không dùng cùng lúc** được — mở bộ lọc thì ô tìm kiếm biến mất, cả hai dùng chung tham số `search` (REQ-11). Cố ý? | Người dùng tưởng đang lọc kết hợp với từ khoá cũ | 🟡 | Cố ý — hai chế độ loại trừ nhau | ✅ Đã chốt 25-09-2026 | **Cố ý** — hai chế độ loại trừ nhau. REQ-11 giữ nguyên (DEMO-AMB-2509) |
| AMB-BK-USER-07 | Ngày giờ hiển thị `25 Th09 2026` + `12:58 AM` — trộn tháng tiếng Việt với giờ 12h AM/PM, theo múi giờ trình duyệt. Quy ước hiển thị chuẩn là gì? | TC so ngày giờ lệch theo máy chạy | 🟡 | Giữ hiện trạng; TC chỉ so **ngày**, không so giờ | ✅ Đã chốt 25-09-2026 | Quy ước chuẩn: ngày `dd ThMM yyyy` + giờ 12h theo múi giờ trình duyệt — trùng hiện trạng. TC chỉ so **ngày** (DEMO-AMB-2509) |
| AMB-BK-USER-08 | Bộ lọc JSON của `GET /api/user?search=` chấp nhận điều kiện trên **trường nội bộ** của bản ghi (không thuộc 9 khoá công khai) — cố ý hay lỗi? (F-32) | Lộ dữ liệu nhạy cảm của mọi người dùng qua endpoint **công khai** | 🔴 | Là lỗi bảo mật — chỉ 9 khoá công khai được làm điều kiện lọc | ✅ Đã chốt 25-09-2026 | **Lỗi bảo mật** — chỉ 9 khoá công khai (REQ-43) được phép lọc; trường khác → 400. **Sinh `REQ-BK-USER-116`** (kỳ vọng, hiện chưa đạt — **cần Dev xác minh**). TC chỉ kiểm **status**, **không** đọc/ghi lại nội dung, không dò giá trị (DEMO-AMB-2509B) |
| AMB-BK-USER-09 | Độ dài tối đa của `name`: web cho tới **250** (REQ-30), API chặn từ **192** ký tự (400 `Invalid data.` không `fields`). Giới hạn đúng là bao nhiêu? (cùng `AMB-BK-AUTH-33`) | Người dùng nhập 200 ký tự, web cho qua, server báo lỗi khó hiểu | 🟠 | Giới hạn thật của cột lưu trữ (191) là chính thức | ✅ Đã chốt 25-09-2026 | Giới hạn chính thức **191** ký tự. **Sửa `REQ-BK-USER-30`** 🟡 (web phải chặn từ 192 — hiện chưa đạt) · sinh `REQ-BK-USER-76` · `108` (API) (DEMO-AMB-2509B) |
| AMB-BK-USER-10 | `name` rỗng: web chặn (`Name is required.`), API tạo được tài khoản tên rỗng (K-38) | Hai nền tảng lệch nhau; tài khoản không có tên | 🟠 | API lỗi (nghi lỗi mặc định) | ✅ Đã chốt 25-09-2026 | **Lỗi API** — `name` rỗng phải bị từ chối. **Sinh `REQ-BK-USER-75`** (kỳ vọng, chưa đạt) (DEMO-AMB-2509B) |
| AMB-BK-USER-11 | `PATCH /api/user/{id}` **không** thu hồi refresh token cũ dù spec mô tả *"revoke old refresh tokens"* — sau đổi mật khẩu / khoá tài khoản cookie cũ vẫn làm mới được token (F-34) | Người bị khoá hoặc bị đổi mật khẩu vẫn giữ phiên làm mới | 🟠 | Spec đúng, hệ thống lỗi | ✅ Đã chốt 25-09-2026 | **Lỗi** — sửa người dùng phải thu hồi refresh token. **Sinh `REQ-BK-USER-109`** (kỳ vọng, chưa đạt). Nhánh xoá người dùng (`REQ-113`) **đã đúng** (DEMO-AMB-2509B) |
| AMB-BK-USER-12 | Body 400 của bộ lọc sai cú pháp mang chuỗi `error` có đường dẫn máy chủ và tên thư viện truy cập dữ liệu (F-33) | Lộ thông tin nội bộ giúp tấn công | 🟡 | Là lỗi | ✅ Đã chốt 25-09-2026 | **Lỗi** — body lỗi không được lộ chi tiết nội bộ. **Sinh `REQ-BK-USER-117`** (kỳ vọng, chưa đạt) (DEMO-AMB-2509B) |
| AMB-BK-USER-13 | API cho người dùng **tự sửa / tự xoá chính mình** (`PATCH` · `DELETE` → 200), web khoá Edit/Delete dòng của chính mình (REQ-22) | Hai nền tảng lệch nhau | 🟡 | Cố ý — web khoá để tránh tự khoá/tự xoá nhầm, API không chặn | ✅ Đã chốt 25-09-2026 | **Cố ý** — không phải lỗi. `REQ-BK-USER-22` (web) và `REQ-BK-USER-105` (API) đều **giữ nguyên** (DEMO-AMB-2509B) |
| AMB-BK-USER-14 | `pagination.lengthData` ở `USER` bằng `limit` yêu cầu, ở `BOOK` bằng số phần tử thực; `limit=1.5` được nhận | Client tính số dòng sai; hai endpoint cùng dạng khác nghĩa | 🟡 | `lengthData` = số phần tử thực; `limit` phải là số nguyên | ✅ Đã chốt 25-09-2026 | Theo Assumption. **Sinh `REQ-BK-USER-118`** · **`REQ-BK-USER-119`** (kỳ vọng, chưa đạt) · `BOOK` chỉ lệch ở `limit` số lẻ (DEMO-AMB-2509B) |
| AMB-BK-USER-15 | `POST /api/user` kiểm dữ liệu **trước** kiểm token (không token + body sai → 422 thay vì 401) (F-26) | Lộ thông tin cấu trúc dữ liệu cho người chưa đăng nhập | 🟡 | Lỗi — xác thực phải chạy trước | ✅ Đã chốt 25-09-2026 | **Lỗi** — **sinh `REQ-BK-USER-90`** (kỳ vọng, chưa đạt) (DEMO-AMB-2509B) |
| AMB-BK-USER-16 | Không có chính sách mật khẩu (1 ký tự vẫn tạo được); `password` rỗng trả 400 (không phải 422) | TC biên mật khẩu không có căn cứ | 🟡 | Không có chính sách (trùng `AMB-BK-AUTH-08`) | ✅ Đã chốt 25-09-2026 | **Không có** chính sách độ dài/độ mạnh — không cấp REQ biên. `password` rỗng phải bị từ chối (**`REQ-BK-USER-80`**, AC không assert mã 400) (DEMO-AMB-2509B) |
| AMB-BK-USER-17 | Spec khai `400`/`422` cho `DELETE /api/user/{id}` nhưng không quan sát được điều kiện phát sinh | TC lỗi cho `DELETE` không có căn cứ | 🟢 | Khai thừa | ✅ Đã chốt 25-09-2026 | **Khai thừa** — không cấp REQ (DEMO-AMB-2509B) |

**AMB cấp hệ thống tham chiếu** (sở hữu ở [`api_map.md` mục 4](../_discovery/api_map.md#4-khoảng-trống-của-spec-amb--cần-chốt-trước-khi-sinh-tc) · [`system_map.md` mục 8](../_discovery/system_map.md#8-ambiguity-cấp-hệ-thống-phát-sinh-ở-mặt-mobile)) — **đều đã chốt 25-09-2026**: `AMB-BK-01` không có mô hình vai trò · `AMB-BK-02` danh sách người dùng công khai là **cố ý** (REQ-01 là hành vi đúng) · `AMB-BK-12` lỗi điều hướng Android (không áp dụng web).

### 11.2. Risks

| Mã | Rủi ro | Mô tả | Mitigation |
|---|---|---|---|
| RISK-BK-USER-01 | Dữ liệu cá nhân lọt vào evidence | Danh sách công khai hiện email · phone · địa chỉ của người thật; ảnh chụp bị commit vào repo | Làm mờ mọi dòng không phải dữ liệu test trước khi chụp (web mục 1) · TC chụp ảnh theo dòng đã lọc bằng email test |
| RISK-BK-USER-02 | Đếm dòng sai | Bảng chèn `<tr>` rỗng khi ít kết quả | Automation lọc `tr` có > 1 ô; assert theo nội dung dòng |
| RISK-BK-USER-03 | Dữ liệu rác lớn trên server duy nhất | ≈ 2.700 người dùng, phần lớn tài khoản test cũ; thứ tự thay đổi liên tục (sắp theo `Updated`) | Mọi TC tìm dữ liệu bằng email riêng `auto_user_<timestamp>`; không assert tổng số / số trang cụ thể |
| RISK-BK-USER-04 | Tài khoản test cuối cùng luôn sót | Không tự xoá chính mình từ giao diện (REQ-22) → tài khoản dùng để xoá người khác không tự dọn được | TC tạo 2 tài khoản và xoá chéo; tài khoản còn lại dọn ở teardown bằng API (token của chính nó) — việc của tầng automation, không phải recon UI |
| RISK-BK-USER-05 | Dữ liệu nhạy cảm qua bộ lọc công khai | Điều kiện lọc trên trường nội bộ (F-32, `AMB-BK-USER-08`) | TC của REQ-116 chỉ kiểm **status**, không đọc nội dung, không dò giá trị; không ghi chi tiết kỹ thuật vào báo cáo |
| RISK-BK-USER-06 | `limit=10000` kéo toàn bộ người dùng | Một request trả email · điện thoại · địa chỉ của mọi người (≈ 2,7 nghìn bản ghi) | TC chỉ đếm `list.length`, **không** lưu / in nội dung; ảnh chụp và log không chứa dữ liệu này |
| RISK-BK-USER-07 | Tài khoản Inactive khó dọn | Tài khoản bị khoá không đăng nhập được nên không xoá bằng token của chính nó | Teardown xoá bằng token của `userA` (cũng do phiên tạo) — **không** dùng token của tài khoản có sẵn |
| RISK-BK-USER-08 | Body lỗi 400 lộ thông tin máy chủ | `error` chứa đường dẫn thư mục và tên thư viện (F-33) | Không chép `error` vào report / Allure / evidence; assert theo `msg` |

---

## 13. Nhật ký Thay đổi

| Ngày | Nguồn | REQ ảnh hưởng | Loại | Tóm tắt thay đổi | TC cần xử lý |
|---|---|---|---|---|---|
| 25-09-2026 | DEMO-AMB-2509B (chốt AMB giả lập — dữ liệu dạy học demo) | REQ-BK-USER-116 → 119 · 30 | 🟢 Thêm · 🟡 Sửa | Chốt `AMB-BK-USER-08` → `17`. **Thêm** `116` (bộ lọc chỉ nhận 9 trường công khai) · `117` (body 400 không lộ nội bộ) · `118` (`lengthData` = số phần tử thực) · `119` (`limit` số nguyên) — cả bốn kỳ vọng, hiện chưa đạt. **Sửa** `30` (web): Name tối đa 250 → **191** ký tự (web chưa đạt). Các REQ API `75` · `79` · `90` · `92` · `109` là kỳ vọng chưa đạt (`@KnownBug`) | `BK_USER_TC_036` · `037` → review (biên 250/251 → 191/192, `@KnownBug`) · TC API: neo lại REQ + thêm TC cho `116 → 119` (xem `docs/testcases/_book-api/user/`) |
| 25-09-2026 | `/generate-requirements-from-api` (spec không đổi — `sha256` trùng) | REQ-BK-USER-01 · 33 · 35 · 38 | 🟢 Thêm | **Mở rộng nền tảng: + API** — chuyển lên index (mục 3), `Nền tảng` = `Web · API`, mã giữ nguyên | viết mới cho API (TC web giữ nguyên) |
| 25-09-2026 | `/generate-requirements-from-api` — 5 operation `/api/user*`, ≈ 360 request gọi thật | REQ-BK-USER-43 → 115 | 🟢 Thêm | Khởi tạo mặt API: 73 REQ / 6 Story (`07 → 12`) · 10 AMB (`08 → 17`, 1 🔴) · 4 RISK (`05 → 08`). Phát hiện **F-32 → F-34** (1 🔴 · 2 🟠) và điểm đúng (xoá người dùng thu hồi refresh token; mass assignment bị chặn; ký tự đặc biệt lưu nguyên). Dọn 40/40 tài khoản tự tạo | viết mới — 31 TC API hiện có (`BK_USER_TC_051` → `081`) neo tạm vào REQ Web → neo lại theo REQ API |
| 25-09-2026 | DEMO-AMB-2509 (chốt AMB giả lập — dữ liệu dạy học demo) | — (REQ không đổi) | ✏️ Chốt AMB | Chốt toàn bộ `AMB-BK-USER-01` → `07` — cả 7 trùng Assumption, **không** REQ nào đổi. Ma trận phân quyền: cột *Vai trò khác* → không áp dụng (`AMB-BK-01`). Ma trận trạng thái: ghi kết luận phiên không bị cắt khi Inactive. Upload photo chốt quy tắc nhưng để ngoài phạm vi đợt này | — chi tiết [impact/impact_DEMO-AMB-2509.md](impact/impact_DEMO-AMB-2509.md) |
| 25-09-2026 | UI recon Web · `/generate-requirements-from-website` | REQ-BK-USER-01 → 42 | 🟢 Thêm | Khởi tạo tài liệu module từ khảo sát web: 42 REQ / 6 Story · 7 AMB (1 🔴) · 4 RISK · 17 ảnh evidence. Mặt API/Android chưa có REQ | — (viết TC mới, tag `@Web`) |
