# MEMORY — Bản đồ bộ nhớ của repo

> **Đọc sau `CLAUDE.md`, trước khi bắt tay vào bất kỳ việc gì.** File này chỉ là **bản đồ**: mỗi dòng trỏ tới một file nhớ. Đọc bản đồ → mở **đúng** file liên quan tới việc đang làm, không mở hết.
>
> Phát hiện bài học, bẫy, quyết định của user hay điều cần nhớ → ghi **ngay** vào đúng nhóm bên dưới **và** thêm một dòng vào bản đồ này. Quy tắc ghi: [`_HUONG_DAN.md`](_HUONG_DAN.md).

## Nhóm bộ nhớ

| Thư mục | Chứa gì | Khi nào mở |
|---|---|---|
| [`team/`](team/) | Quyết định & quy ước của Team QA Chí Doanh | Mọi việc — đây là luật riêng của team |
| [`repo/`](repo/) | Cấu trúc khung repo, skill, viewer, phiếu `plans/` | Khi sửa / thêm skill, script, tài liệu khung |
| [`lessons/`](lessons/) | Bài học & bẫy kỹ thuật đã gặp | Trước khi chạy lệnh, sửa file hàng loạt, viết script |
| [`systems/`](systems/) | Kiến thức về hệ thống đang test — theo hệ thống × module | Khi recon, viết REQ/TC, chạy test trên hệ thống đó |

---

## team/ — Quyết định của team

- [Công cụ: không Jira, ticket từ Google Sheet, kết quả lưu .md](team/cong-cu-ticket-va-ket-qua.md) — 03-11-2026 · nguồn ticket, nơi lưu bug/kết quả, mã ticket
- [Thương hiệu "Team QA Chí Doanh" — đổi gì, giữ gì](team/thuong-hieu-team.md) — 03-11-2026 · không đổi dữ liệu thật của hệ thống đang test · việc còn treo

## repo/ — Khung repo

- [Chỉ còn skill, không còn slash command](repo/skill-thay-slash-command.md) — 03-11-2026 · cách gọi `/tên-skill`, cột `Skill` trong báo cáo
- [Phiếu `plans/` chỉ giữ 2 file](repo/plans-phieu-dau-vao.md) — 03-11-2026 · phiếu trống + mẫu ShopMini, không khôi phục plan mẫu
- [Hai subagent review độc lập: testcase-reviewer · bug-report-reviewer](repo/subagent-review-doc-lap.md) — 03-11-2026 · tự gọi sau khi TC / bug chốt, chỉ báo cáo

## lessons/ — Bài học & bẫy

- [Ổ đĩa repo: git cần safe.directory, `sed -i` lỗi quyền](lessons/o-dia-git-va-sed.md) — 03-11-2026
- [Thay chữ hàng loạt dễ đụng dữ liệu thật của hệ thống](lessons/thay-chu-hang-loat.md) — 03-11-2026 · luôn soát diff trước khi chốt
- [Script Python phải chạy được trên 3.9](lessons/script-python-3-9.md) — 03-11-2026 · không dùng `\` trong biểu thức f-string

## systems/ — Hệ thống đang test

- [Cách tổ chức bộ nhớ hệ thống](systems/README.md) — chưa có hệ thống nào (`docs/` đã dọn ngày 03-11-2026)
