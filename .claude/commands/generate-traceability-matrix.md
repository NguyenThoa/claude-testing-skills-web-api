---
description: Sinh ma trận truy vết (RTM) Requirements ↔ Test Cases ↔ Automation Scripts — chỉ ra requirement chưa cover, TC chưa automate, và orphan tests.
skills:
  - skills-coverage-traceability
  - skills-requirements-analyzer
  - skills-rbt-manual-testing
---

# Workflow: Sinh Ma Trận Truy Vết (RTM)

> **BẮT BUỘC (MANDATORY SKILL):** Bạn PHẢI nạp và đọc kỹ nội dung của skill **`skills-coverage-traceability`** (tại `.claude/skills/skills-coverage-traceability/SKILL.md`) trước khi bắt đầu.

## ⚠️ Nguyên tắc thực thi

- **Tất cả output bằng Tiếng Việt**
- **KHÔNG bịa mapping** — không chắc thì để trống và đưa vào mục "cần xác nhận"
- Mapping suy luận (theo tên/mô tả, không có ID) phải đánh dấu ⚠️ và tách riêng khỏi mapping có ID
- KHÔNG tự ý sửa file TC/test gốc để thêm ID — chỉ đề xuất

## Input cần thu thập

| Nguồn | Bắt buộc? | Ghi chú |
|---|---|---|
| Requirements (markdown/Jira export/user stories) | Cần ≥2 nguồn | Có thể lấy từ `/fetch-jira-requirements` |
| Manual test cases (markdown/Excel/CSV) | Cần ≥2 nguồn | |
| Automation scripts (path thư mục test) | Cần ≥2 nguồn | Agent tự scan `.spec.ts`, `*Test.java`, `.py` |
| Checklist (`docs/checklists/**/checklist_*.md`) | Nguồn phụ — không tính vào "≥2 nguồn" | Agent tự quét — smoke/regression lấy file mới nhất theo ngày, post-hotfix lấy mọi file, release lấy file của mốc (luật ở skill, bảng *Nguồn trong `docs/`*) |

> Có đủ 3 nguồn → RTM 3 tầng đầy đủ. Chỉ có 2 nguồn → RTM 2 chiều, ghi chú rõ phần thiếu. Chỉ có 1 nguồn → dừng, hỏi user bổ sung.

## Các bước thực hiện

### Bước 1: Thu thập & Trích xuất
1. Đọc từng nguồn, xác định format ID (`REQ-xxx`, `TC_xxx`, tên test method, mã mục checklist `CL-…-<nn>`)
2. Liệt kê đầy đủ: REQ IDs, TC IDs, test methods (kèm file path), mục checklist có `REQ ID`
3. Nếu TC/test không có ID chuẩn → ghi nhận để đề xuất bổ sung ID ở output

### Bước 2: Mapping
1. Map bằng ID trước (chuẩn nhất)
2. Map bằng nội dung cho phần không có ID → đánh dấu ⚠️
3. Ghi nhận quan hệ n-n đầy đủ
4. Mục checklist → cột `Checklist`. REQ chỉ có mục checklist, 0 TC → 🟠 **Chỉ có checklist** (không tính là đã cover)

### Bước 3: Tính Metrics & Phát Hiện Gap
1. Requirement Coverage / Automation Coverage / Orphan Tests
2. Phân loại: 🔴 REQ chưa cover → 🟠 REQ chỉ có checklist → 🟡 TC chưa automate → ⚪ orphan tests
3. **⬛ Module chưa có tài liệu — điểm mù của RTM, BẮT BUỘC kiểm:**
   Đọc `docs/requirements/README.md`, liệt kê module có `Trạng thái recon` = ⬜ / 🟨 / ⏸️.
   Những module này **không có REQ nào**, nên RTM tính đúng theo công thức vẫn ra coverage cao — trong khi cả một module chưa ai chạm tới. Không nêu ra thì con số RTM **gây hiểu nhầm nghiêm trọng**.
   Chưa có file danh mục (chưa chạy `/discover-system`) → ghi rõ: *"Chưa khảo sát cấp hệ thống — không kết luận được RTM đã phủ hết hệ thống hay chưa"*.

### Bước 4: Xuất RTM (CHECKPOINT)
1. Sinh RTM theo template trong skill, ghi vào **`docs/traceability/traceability_matrix.md`** (toàn hệ thống) hoặc `docs/traceability/<module>/traceability_matrix_<module>.md` (một module) — ghi đè tại chỗ, header có Ngày sinh · Phạm vi · Mốc git (`git log -1 --format=%h`)
2. Nếu user cần import Excel → sinh thêm file `.csv` cùng tên, cùng thư mục
3. Có RTM cũ ở vị trí khác → nhắc user gỡ, **không** tự xoá
4. **⏸️ Trình bày kết quả** — nhấn mạnh mục 🔴, 🟠 và mục ⚠️ cần user xác nhận
5. Đề xuất bước tiếp theo: khảo sát module còn ⬜ (`/generate-requirements-from-website`), sinh TC lấp gap (`/generate-testcases-from-requirements`), automate TC ưu tiên cao (`/generate-automation-from-testcases`)

## Output

- File `docs/traceability/traceability_matrix.md` (hoặc `docs/traceability/<module>/traceability_matrix_<module>.md`):
  - Header Ngày sinh · Phạm vi · Mốc git
  - Bảng tổng quan metrics
  - Ma trận chi tiết REQ ↔ TC ↔ Automation
  - Danh sách ⬛ **module chưa có tài liệu** (nằm ngoài phạm vi RTM) — đặt **trên** mọi metric khác, kèm cảnh báo coverage % chỉ tính trên module đã có tài liệu
  - Danh sách 🔴 REQ chưa cover (kèm đề xuất)
  - Danh sách 🟠 REQ chỉ có checklist (kèm đề xuất sinh TC)
  - Danh sách 🟡 TC chưa automate (xếp theo priority)
  - Danh sách ⚪ orphan tests
  - Mục ⚠️ mapping suy luận cần xác nhận
- File `.csv` cùng tên (nếu user yêu cầu)

> 📊 **Xem trực quan:** mở `scripts/execution-viewer/bundle.html` rồi kéo thả `traceability_matrix.md` vào → tab **Độ phủ automation**. Trang này tự tính lại chỉ số từ bảng "Ma trận chi tiết" (không đọc bảng Tổng quan), tách riêng trạng thái **automate một phần** và **chỉ có checklist**, và xuất Excel nhiều sheet. Nhắc user điều này ở bước bàn giao.
