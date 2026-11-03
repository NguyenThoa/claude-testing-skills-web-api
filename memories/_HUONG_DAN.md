# Hướng dẫn ghi bộ nhớ

## Khi nào ghi

Ghi **ngay lúc phát hiện**, không đợi cuối phiên:

| Loại | Ví dụ | Nhóm |
|---|---|---|
| **Quyết định của user** | "không dùng Jira", "TC ID dùng tiền tố `ERP_`" | `team/` |
| **Quy ước khung repo** | skill mới, viewer đọc cột nào, phiếu nào giữ | `repo/` |
| **Bài học / bẫy kỹ thuật** | lệnh lỗi trên máy này, cách sửa đã thử thành công | `lessons/` |
| **Kiến thức hệ thống đang test** | business rule ẩn, CAPTCHA, tài khoản test loại nào, màn hình hay lỗi | `systems/<hệ-thống>/` |

**Không ghi** thứ đã có sẵn trong `CLAUDE.md`, skill, `docs/` hay lịch sử git — chỉ ghi phần **không suy ra được** từ đó (lý do, bối cảnh, bẫy).

## Cách ghi

1. Tìm file cùng chủ đề trong bản đồ `MEMORY.md` → có rồi thì **cập nhật** file đó, không tạo file trùng.
2. Chưa có → tạo file mới theo mẫu dưới, tên **ASCII kebab-case không dấu, đọc là hiểu** (VD `team/tien-to-tc-id.md`, `systems/crm/login.md`).
3. Thêm **một dòng** vào đúng nhóm trong `MEMORY.md`: `- [Tiêu đề](đường/dẫn.md) — DD-MM-YYYY · gợi ý ngắn`.
4. Thông tin cũ sai / hết hiệu lực → sửa nội dung và ghi ngày sửa. **Xoá file chỉ khi user đồng ý.**

## Mẫu file

```markdown
# <Tiêu đề>

- **Loại:** Quyết định | Quy ước | Bài học | Hệ thống
- **Ngày:** DD-MM-YYYY (cập nhật: DD-MM-YYYY)
- **Nguồn:** user nói trong chat · phát hiện khi <làm việc gì>

<Nội dung — ngắn, cụ thể.>

**Vì sao:** <lý do / sự cố dẫn tới điều này>

**Áp dụng thế nào:** <khi nào dùng, làm gì cụ thể>
```

## Giữ bộ nhớ gọn

- Một file **một chủ đề**. File dài quá ~80 dòng → tách theo phần nhỏ hơn.
- `systems/` chia theo **hệ thống → module** (`systems/<hệ-thống>/_tong-quan.md` + `systems/<hệ-thống>/<module>.md`), dùng cùng tên module với `docs/`.
- 🔒 **Không** ghi mật khẩu, token, cookie, API key — chỉ ghi **hình thái** (`<16 ký tự hex>`). Thư mục này được commit.
- Ngày viết `DD-MM-YYYY`.
- Chuyển sang dự án mới: xoá `memories/systems/` (kiến thức của dự án cũ), **giữ** `team/` · `repo/` · `lessons/`.
