# Chỉ còn skill, không còn slash command

- **Loại:** Quy ước
- **Ngày:** 03-11-2026
- **Nguồn:** user yêu cầu đổi mọi chỗ nhắc "slash command" thành skill

- Repo **không có** `.claude/commands/`. Mọi quy trình là skill trong `.claude/skills/`: skill workflow (không tiền tố) gọi bởi user, skill nền tảng (tiền tố `skills-`) được workflow nạp.
- Gõ `/<tên-skill>` là **cú pháp gọi skill** của Claude Code — giữ nguyên trong tài liệu, nhưng gọi nó là "skill", không gọi "lệnh" / "slash command".
- Cột `Command` trong các bảng *việc cần làm* của skill đã đổi thành `Skill`. `scripts/traceability-viewer/bundle.html` đọc được **cả hai** tên cột (`/^(command|skill)$/i`).
- Số lượng hiện tại: 23 skill nền tảng + 42 skill workflow = 65 (README ghi số này — thêm/bớt skill thì sửa README).

**Vì sao:** user thấy repo đã bỏ commands, muốn tài liệu nói đúng thực tế.

**Áp dụng thế nào:** viết tài liệu / skill mới dùng từ "skill" và "gọi skill `/tên`". Thêm cột tham chiếu skill trong bảng báo cáo → đặt tên cột `Skill`.
