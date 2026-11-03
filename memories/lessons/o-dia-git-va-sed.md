# Ổ đĩa repo: git cần safe.directory, `sed -i` lỗi quyền

- **Loại:** Bài học
- **Ngày:** 03-11-2026
- **Nguồn:** phát hiện khi sửa repo trên máy Linux của user

Repo nằm ở `/run/media/phuc-la/DATA2/...` — ổ gắn ngoài, file thuộc `root` với quyền `777`:

- `git status` báo *dubious ownership* → chạy git read-only kèm `git -c safe.directory='*' <lệnh>`. **Không** tự sửa `~/.gitconfig` của user.
- `sed -i` báo *preserving permissions … Operation not permitted* (có lúc vẫn ghi được, có lúc không — không tin được) → sửa file bằng công cụ Edit/Write hoặc script Python đọc–ghi, không dùng `sed -i`.

**Vì sao:** hệ thống file của ổ ngoài không cho đổi chủ sở hữu / quyền.

**Áp dụng thế nào:** mọi thao tác sửa file hàng loạt trên repo này dùng Python (`open().read()` → `replace` có `assert` đếm số lần khớp → `write`).
