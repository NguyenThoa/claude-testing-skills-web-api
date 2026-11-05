---
name: generate-testcases-from-requirements
description: Sinh manual test cases nhanh từ requirements (QUICK mode — không qua quy trình 6 bước), format v3 10 cột bám ISTQB.
---

> **Skill nền tảng cần nạp trước:** `skills-manual-testcase-v3` — đọc `.claude/skills/skills-manual-testcase-v3/SKILL.md`, rồi đọc tiếp `references/mode_quick.md` và các file mà nó chỉ định. Không nạp thêm skill khác.

# Workflow: Sinh Manual Test Cases Nhanh từ Requirements

Dùng **Mode QUICK**: một lượt, không dừng hỏi giữa chừng, mọi điểm mơ hồ ghi `ASM-<MODULE>-nn`. Toàn bộ quy tắc nằm trong skill, workflow này chỉ chốt đầu vào và cách gọi.

## Tham số

```
/generate-testcases-from-requirements <đường dẫn requirements> [GỘP|TÁCH]
```

| Giá trị | Ý nghĩa | Số TC điển hình (module cỡ login) |
|---|---|---|
| *(bỏ trống)* · `GỘP` | ⭐ **Mặc định.** Biến thể cùng trường, cùng loại phản hồi nằm chung 1 TC dưới dạng Bảng biến thể | 35–45 |
| `TÁCH` | Mỗi biến thể một TC riêng | 75–90 |

Hai độ hạt phủ REQ như nhau. Chọn `TÁCH` khi khách hàng tính công theo số TC, cần pass-rate từng biến thể, hoặc module cần vết thực thi rời để kiểm định.

## Các bước

1. Thực hiện theo `references/mode_quick.md`, tuân thủ 10 quy tắc ở mục 4 của skill.
2. Trước batch đầu tiên, công bố ra chat: nhánh đã chọn ở Bước 0 · mức rủi ro + căn cứ · độ sâu · độ hạt · kế hoạch batch theo 4 vòng.
3. Chạy thẳng hết mọi batch. Chỉ dừng khi phát hiện requirement mâu thuẫn nghiêm trọng làm sai hàng loạt TC phía sau.
4. Ghi file theo `references/output_files.md` và chạy `references/quality_gates.md`. Không in bảng TC ra chat.

## Khi nào chuyển sang FULL RBT

Đề xuất chuyển **trước batch đầu tiên** và chờ user chọn khi có một trong các dấu hiệu: requirement mơ hồ phải hỏi Q&A · scope > 3 module · logic nhiều điều kiện chồng chéo · rủi ro `High` ở phần lớn chức năng · user yêu cầu Traceability Matrix hoặc đánh giá rủi ro.

## Output

File TC 10 cột · `automation_matrix.md` · index · Bảng Đối Soát Coverage · Bảng Đối Soát Evidence · bảng 4 vòng · bảng ISO/IEC 25010 · tóm tắt kèm phần chưa đạt và các xung đột với requirement.
