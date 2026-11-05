---
name: generate-testcases-manual-rbt
description: Sinh manual test cases chất lượng cao theo quy trình Risk-Based Testing 6 bước có Q&A, format v3 10 cột bám ISTQB — cho module phức tạp, rủi ro cao hoặc requirement chưa rõ.
---

> **Skill nền tảng cần nạp trước:** `skills-manual-testcase-v3` — đọc `.claude/skills/skills-manual-testcase-v3/SKILL.md`, rồi đọc `references/mode_full_rbt.md` và các file nó chỉ định **ở đúng bước cần dùng**. Không đọc trước toàn bộ. Chỉ mở `skills-requirements-analyzer` khi phải phân tích lại giao diện, và chỉ đọc mục liên quan.

# Workflow: Sinh Manual Test Cases theo Risk-Based Testing (FULL RBT)

Dùng **Mode FULL RBT**. Toàn bộ quy tắc nằm trong skill, workflow này chỉ chốt nhịp làm việc.

| Bước | Việc chính | Đọc thêm | Dừng chờ user |
|---|---|---|---|
| 1. Bối cảnh | Kiểm bộ TC đã có, chốt độ hạt, mở hết evidence, tóm tắt scope, xuất `rbt_step_01_context.md` | `evidence_and_language.md` · `granularity.md` | Xác nhận scope |
| 2. Phân tích & Q&A | Xác định luồng, phát hiện `AMB`, xuất `rbt_step_02_ambiguity_qna.md` | — | ⏸️ **Trả lời Q&A** |
| 3. Phân rã | Module, phụ thuộc, ánh xạ vào mục I.x | `format_v3.md` | Không |
| 4. Truy vết & rủi ro | Ma trận REQ, gap, kịch bản theo 4 vòng, chấm rủi ro và độ sâu | `test_types_4_rounds.md` | ⏸️ **Duyệt scenario và mức rủi ro** |
| 5. Sinh TC | Sinh V1 → V4 theo batch, áp dụng kỹ thuật theo rủi ro, chạy thẳng hết | `test_design_techniques.md` · `output_files.md` | Không |
| 6. Đóng gói | Ghi file, chạy Quality Gate | `quality_gates.md` · `automation_criteria.md` | Không |

## Nguyên tắc

- Chạy tuần tự, không gộp bước. Chưa có requirement thì hỏi user trước.
- Không tự trả lời thay BA. Câu blocker chưa có trả lời thì không đi tiếp.
- Mọi output bằng Tiếng Việt, ghi vào file. Chat chỉ báo tiến độ và bảng đối soát.

## Output

`rbt_step_01_context.md` · `rbt_step_02_ambiguity_qna.md` · File TC 10 cột · `automation_matrix.md` · index + Traceability + Bảng Đối Soát Coverage · bảng 4 vòng · bảng ISO/IEC 25010 · báo cáo Quality Gate.
