# Danh mục Bug Report — Book (Anh Tester)

> **Điểm vào tầng bug của namespace `_book-api`.** Danh mục riêng của hệ thống thứ hai trong repo — mã bug, trạng thái, TC liên quan **không** dùng chung sổ với danh mục hệ thống mặc định ở [`docs/bugs/README.md`](../README.md) (Perfex CRM).
>
> Mắt xích thứ tư của chuỗi truy vết: [`requirements/_book-api/`](../../requirements/_book-api/README.md) → [`testcases/_book-api/`](../../testcases/_book-api/README.md) → executions → bugs.

| Mục | Giá trị |
|---|---|
| Hệ thống | Book — Anh Tester (`https://book.anhtester.com` — **production**) · app Android `book.anhtester.com` `1.0` |
| Quy ước mã bug | `BUG_<module>_<timestamp>_<TC_ID>` — `timestamp` epoch giây lúc sinh, `TC_ID` mã TC ngắn (VD `TC152`). REQ chưa có TC thì hậu tố `REQ<số>` (VD `REQ122`) |
| Đường dẫn file | `docs/bugs/_book-api/<module>/<nền-tảng>/BUG_<module>_<timestamp>_<TC_ID>.md` — `<nền-tảng>` chỉ nhận `web` · `mobile` · `api` |
| Ngày cập nhật | 20-10-2026 |

---

## 1. Danh mục bug

| Mã bug | Module | Nền tảng | Tiêu đề ngắn | Severity | Priority | Trạng thái | TC liên quan | Ngày phát hiện |
|---|---|---|---|---|---|---|---|---|
| [BUG_user_1792454701_TC152](user/mobile/BUG_user_1792454701_TC152.md) | `USER` | `mobile` | Update user trên Android báo `Error in processing request`, không lưu | 🔴 Critical | P1 | 🔴 **Đang mở** | `BK_USER_TC_152` (a · b) — `REQ-BK-USER-129` | 20-10-2026 |
| [BUG_book_1792454702_TC143](book/mobile/BUG_book_1792454702_TC143.md) | `BOOK` | `mobile` | Create book trên Android chỉ hiện `Uploading book...` rồi mất, không tạo sách | 🔴 Critical | P1 | 🔴 **Đang mở** | `BK_BOOK_TC_143` — `REQ-BK-BOOK-147` | 26-09-2026 |
| [BUG_book_1792454703_TC187](book/mobile/BUG_book_1792454703_TC187.md) | `BOOK` | `mobile` | Save changes trên Android thất bại hiện thông báo lỗi rỗng (chỉ `!`) | 🟡 Minor | P2 | 🔴 **Đang mở** | `BK_BOOK_TC_187` — `REQ-BK-BOOK-155` | 20-10-2026 |
| [BUG_auth_1792454704_REQ122](auth/mobile/BUG_auth_1792454704_REQ122.md) | `AUTH` | `mobile` | Save Profile trên Android báo `Error in processing request`, hồ sơ không đổi | 🟠 Major | P2 | 🔴 **Đang mở** | `BK_AUTH_TC_196` (a · b — thêm 20-10-2026, sau khi mở bug) — `REQ-BK-AUTH-122` (web đối chiếu `BK_AUTH_TC_174`) | 26-09-2026 |

> **Cụm lỗi ghi dữ liệu trên Android.** 4 bug trên cùng một quan sát: trên app Android `1.0` **mọi thao tác gửi dữ liệu** đã thử đều lỗi (Save Profile · Create book · Update user · Save changes), còn **Delete** (user, sách) chạy được; web làm được cùng các thao tác. Nguyên nhân **cần Dev xác minh** — chưa quan sát được request (không proxy, WebView không bật gỡ lỗi). Mỗi bug giữ file riêng vì mỗi bug neo một REQ/TC riêng và retest độc lập.

---

## 2. Thống kê theo trạng thái

| Trạng thái | Số lượng | Ý nghĩa |
|---|---|---|
| 🔴 Đang mở | 4 | Đã xác nhận, chưa fix |
| 🟡 Đã fix, chờ retest | 0 | Dev báo fix xong → chạy `/retest-fixed-bugs` |
| 🟢 Đã đóng | 0 | Retest FIXED |
| ⚪ Đóng — không phải lỗi | 0 | Kiểm chứng lại cho thấy là hành vi đúng thiết kế |
| ⚠️ Cần rà lại | 0 | Tham chiếu lệch hoặc evidence mất — chưa dùng được |

---

## 3. Ghi chú riêng namespace

| Điểm | Chi tiết |
|---|---|
| Evidence | Cụm bug Android sinh từ **khảo sát requirements** (`/generate-requirements-from-mobile`), chưa có lần chạy `executions/_book-api/`. Bug link thẳng tới ảnh gốc trong `docs/requirements/_book-api/<module>/mobile/evidence/`, **không** nhân bản ảnh. Lần chạy sau có evidence riêng thì retest link sang `executions/` |
| Môi trường | **Production** — retest không tạo dữ liệu thừa; bản ghi test tạo ra phải dọn ngay sau khi dùng. Agent không nhập mật khẩu — bước đăng nhập do tester làm |
| Quy tắc chung | Như mục 3 của [`docs/bugs/README.md`](../README.md) — mỗi bug 1 file, không xoá file bug, không đổi hậu tố, retest thêm dòng lên đầu `Lịch sử retest` |

---

## 4. Nhật ký danh mục

| Ngày | Thay đổi |
|---|---|
| 20-10-2026 | Khởi tạo danh mục namespace `_book-api`. `/create-bug-report` cho cụm lỗi ghi dữ liệu trên Android (chốt lỗi theo `DEMO-AMB-2609` · `DEMO-AMB-2010`): mở 4 bug — `USER` TC_152 · `BOOK` TC_143 · `BOOK` TC_187 · `AUTH` REQ-122 (chưa có TC). Không đẩy Jira |
