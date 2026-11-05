# Mode QUICK — Sinh Test Cases Nhanh

Sinh một lượt cho module có requirement đã rõ. **Không dừng hỏi Q&A**, mọi điểm mơ hồ phải ghi `ASM-<MODULE>-nn`.

## Quy trình

0. **Kiểm bộ TC đã có** theo Bước 0 ở `SKILL.md`. Nêu nhánh đã chọn ở dòng kế hoạch.
1. **Đọc requirement.** Có REQ ID thì dùng nguyên. **Chưa có REQ thì dừng, không tự cấp mã**: có ticket hoặc tài liệu → `/analyze-requirement-document`, chỉ có hệ thống đang chạy → `/generate-requirements-from-website`. Hai workflow này ghi mã vào danh mục nên không trùng. Nguồn: tài liệu trong `docs/requirements/` hoặc Jira/Confluence khi user đưa ticket.
2. **Mở toàn bộ evidence** (`evidence_and_language.md`). Ghi lại ảnh cắt cụt và vùng không có ảnh.
3. **Ghi Assumptions** ở đầu file: `ASM-<MODULE>-nn | Điểm chưa rõ | Giả định đã áp dụng | TC bị ảnh hưởng`. Xung đột tài liệu với ảnh phải xử lý theo bảng phân loại ở `evidence_and_language.md`.
4. **Chấm `Risk Level` và chọn độ sâu** (`test_types_4_rounds.md`), ghi căn cứ vào dòng kế hoạch. User phủ quyết tại đây.
5. **Chốt độ hạt GỘP / TÁCH** (`granularity.md`). Mặc định GỘP.
6. **Lập kế hoạch 4 vòng:** chấm từng nhánh `✅ sẽ sinh` / `➖ không áp dụng + lý do` / `⏭️ cố ý bỏ + lý do + ai quyết + điều kiện rà lại`. Nhánh V3 `API` · `Database` · `Integration` · `Logging/Audit` lấy theo dòng `Năng lực kiểm thử của QA` ở `docs/requirements/README.md`. Công bố kế hoạch batch ra chat. Agent không tự đứng tên quyết định `⏭️`: ô `ai quyết` ghi người đã chốt trong chat, chưa có thì ghi `⏳ chờ duyệt` và liệt kê lúc bàn giao. Mục `⏳` chưa được trừ khỏi mẫu số tiêu chí exit #8.
7. **Thiết kế và sinh TC** tuần tự V1 → V4, áp dụng kỹ thuật, 15 loại field, Component-Level và Scenarios Chuyên Sâu (`test_design_techniques.md`).
8. **Ghi file** theo `format_v3.md` và `output_files.md`, kèm `automation_matrix.md` chấm theo `automation_criteria.md`.
9. **Chạy Self-Quality Gate** (`quality_gates.md`) và ghi các bảng đối soát.

## Output

| Output | Nội dung |
|---|---|
| Mục Assumptions | `ASM-<MODULE>-nn`, gồm xung đột tài liệu với evidence |
| File TC | Bảng 10 cột, chia theo mục I.x |
| `automation_matrix.md` | Chấm automation từng TC |
| Bảng Đối Soát Coverage | REQ × số TC × đủ Positive / Negative / Boundary × nền tảng (ở index) |
| Bảng Đối Soát Evidence | Ảnh × màn hình × TC dựa vào × đủ hay cắt cụt |
| Bảng 4 vòng + bảng ISO/IEC 25010 | Cuối file TC |
| Vùng chưa có evidence | Màn hình không có ảnh + TC `@NeedsVerify` |
