# Phiếu `plans/` chỉ giữ 2 file

- **Loại:** Quyết định
- **Ngày:** 03-11-2026
- **Nguồn:** user tự xoá `docs/` và `plans/` (coi là dữ liệu dự án), sau đó đưa lại 2 file phiếu

`plans/master-test-plan/` chỉ còn:
- `test_plan.config.yaml` — **phiếu trống** để điền: giữ tên ô + chú thích, đã xoá hết giá trị dự án cũ. Mục *Công cụ* điền sẵn quy ước team (lỗi và kết quả = file markdown trong repo, ticket = Google Sheet).
- `test_plan.template.yaml` — **mẫu đã điền đủ** của hệ thống hư cấu ShopMini, chỉ để tham khảo cách điền (không phải "khung rỗng").

Ba plan mẫu (`test_plan_crm_example.*`, `test_plan_release_example.md`) và toàn bộ `docs/` mẫu đã bị xoá có chủ đích.

**Vì sao:** user không cần dữ liệu dự án mẫu; `/generate-master-test-plan` vẫn cần khung phiếu để ghi câu trả lời.

**Áp dụng thế nào:** **không** khôi phục plan mẫu hay `docs/` mẫu từ git. `docs/` sẽ được skill tự tạo lại ở lần chạy đầu tiên.
