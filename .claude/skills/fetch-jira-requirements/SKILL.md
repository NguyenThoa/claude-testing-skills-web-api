---
name: fetch-jira-requirements
description: Lấy Requirements / User Stories từ Jira và Confluence qua MCP jira-cybertech, lưu thành file markdown làm nguồn cho bước phân tích. Chỉ đọc, không ghi lên Jira.
---

> **Skill nền tảng cần nạp trước:** `skills-jira-integration` — đọc `.claude/skills/skills-jira-integration/SKILL.md` trước khi bắt đầu.

# Workflow: Fetch Jira Requirements

Workflow này chỉ đọc Jira. Không tạo, sửa hay comment trên ticket.

## Các bước

1. **Xác định phạm vi.** Hỏi user nếu chưa rõ:

   | Đầu vào | Cách lấy |
   |---|---|
   | Một ticket, VD `PROJ-123` | `jira_get_issue`, `include` = `comments,remote_links` |
   | Project + loại issue | `jira_search`, JQL `project = PROJ AND issuetype = Story` |
   | JQL tuỳ chỉnh | `jira_search` |
   | Epic | `jira_search`, JQL `parent = PROJ-10` hoặc `"Epic Link" = PROJ-10` tuỳ cấu hình Jira |

2. **Lấy đủ nội dung.** Theo mục *Đọc dữ liệu* của skill. Có file đính kèm thì dùng `jira_download_attachments`. Có link Confluence thì đọc bằng `confluence_get_page`. Không đọc được phần nào thì ghi rõ, không bỏ qua im lặng.

3. **Lưu file** vào `docs/requirements/_discovery/sources/jira_<ISSUE-KEY>.md`, gồm:
   - Mã, tiêu đề, loại, trạng thái, Fix Version, ngày lấy.
   - Mô tả và tiêu chí chấp nhận giữ nguyên văn.
   - Comment có ảnh hưởng tới nghiệp vụ.
   - Danh sách đính kèm, Confluence và issue liên quan.
   - Phần chưa đọc được.

   🔒 Không ghi token hay mật khẩu xuất hiện trong ticket. Thay bằng mô tả hình thái, ví dụ `<16 ký tự hex>`.

4. **Bàn giao.** Tóm tắt bằng Tiếng Việt: số ticket, đường dẫn file, điểm mơ hồ phát hiện được, phần chưa đọc được. Bước tiếp theo:
   - Phân tích ticket mới: `/analyze-requirement-document`
   - Module đã có tài liệu và ticket làm đổi requirement: `/update-requirements-from-ticket`

## Khi có lỗi

Xử lý theo bảng *Lỗi thường gặp* trong skill. MCP chưa kết nối thì dừng và báo user.
