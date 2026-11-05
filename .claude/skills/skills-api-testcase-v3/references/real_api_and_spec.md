# Gọi API Thật Và Phân Tích Spec

## 8. 🚨 Quy Tắc Dữ Liệu Khi Gọi API Thật (BẮT BUỘC — đọc trước request đầu tiên)

> Bổ sung từ command `/generate-testcases-api` và `/generate-requirements-from-api` của dự án. Áp dụng khi skill có bước kiểm chứng bằng gọi thật (verify TC hoặc lấy Response mẫu chuẩn).

**Nếu môi trường cho phép gọi API thật (staging/dev, không phải production):**

Kiểm tra dòng `Năng lực kiểm thử của QA — Gọi API` ở `docs/requirements/README.md`:
- `Gọi API: ✅` → được gọi thật, tuân thủ 3 luật vàng dưới đây
- `Gọi API: ❌` hoặc chưa có → hỏi user 1 lần, ghi ngay vào danh mục. Vẫn ❌ → **KHÔNG gọi thật**, mọi TC dừng ở mức "theo spec"

### 3 Luật vàng (KHÔNG NGOẠI LỆ)

**Vi phạm từng luật này có thể xóa mất tài khoản gốc của hệ thống demo. Ba luật KHÔNG có ngoại lệ.**

1. **KHÔNG ghi/xoá bản ghi không do chính phiên này tạo ra**
   - Kể cả khi user nói "được xoá thoải mái"
   - **CẤM lấy `id` từ API danh sách rồi `PATCH`/`DELETE`**
   - Chỉ được ghi/sửa/xóa bản ghi mà chính phiên test tạo ra, tên có prefix `auto_<module>_<timestamp>`

2. **BOLA/IDOR chỉ kiểm bằng 2 tài khoản tự tạo** (`userA`, `userB`)
   - Không lấy user ID có sẵn trong hệ thống
   - Cả 2 tài khoản tạo mới bằng chính suite/session, email/username có prefix `auto_`
   - Token của A nhắm vào tài nguyên của B — verify server chặn (403/404)

3. **Dọn sạch bản ghi đã tạo**
   - Báo cáo cuối phải nêu rõ: số bản ghi **tạo** / **dọn** / **còn sót**
   - Lỡ đụng dữ liệu thật → **báo user ngay**, ghi mục **Sự cố** của `api_map.md`
   - Dùng try-finally / teardown để đảm bảo dọn ngay cả khi test fail

### Nguyên tắc bổ sung khi gọi thật để lấy Response mẫu chuẩn

- **Đọc trước, ghi sau** — ưu tiên GET (không thay đổi state). Chỉ POST/PUT/PATCH/DELETE khi cần verify hành vi
- **Che dữ liệu nhạy cảm** trong Response mẫu ghi vào TC — token, cookie, ID user thật, email, số điện thoại → thay bằng `<masked>`, `<uuid>`, `app-<timestamp>-<random>`
- **KHÔNG copy nguyên `requestId`/`timestamp` thật** vào TC — dùng data mẫu placeholder, note "data mẫu" ở cuối file
- **Test dữ liệu ở staging/dev** — CẤM gọi production, kể cả GET

### Bảng phân biệt spec ↔ hành vi thực

Khi gọi thật phát hiện lệch spec ↔ hành vi:
- Ghi thành **phát hiện `F-nn`** kèm bằng chứng nguyên văn (request + status + trích body đã che)
- Phân mức 🔴 (blocker, cần fix) / 🟠 (cần xem) / 🟡 (note)
- TC viết theo **spec** — cột `Nguồn` note `Spec — ❌ lệch thực tế (F-nn)` + tạo `AMB-XX` 🔴 hỏi cố ý hay lỗi
- **KHÔNG hạ TC theo hành vi thật** khi hành vi có vẻ sai — hỏi BA/Dev trước

---

## 9. 🔍 Phân Tích Dữ Liệu Spec API (Bám theo `skills-requirements-analyzer`)

> Bổ sung từ skill `skills-requirements-analyzer` — quy trình phân tích spec API để trước khi sinh TC.

### 9.1. Xử lý spec đa định dạng — KHÔNG đọc bừa

Mỗi định dạng có cách đọc riêng. **KHÔNG** dùng `Read` thẳng cho định dạng nhị phân:

| Định dạng | Cách xử lý bắt buộc |
|---|---|
| `.json`, `.yaml`, `.md` (OpenAPI, Swagger, Postman collection) | `Read` trực tiếp. Nếu URL → `curl -sSL -o <file>` rồi `Read`. **CẤM `WebFetch`** — kết quả đã bị cắt/tóm tắt |
| `.docx`, `.dotx` (API spec dạng Word) | Ủy quyền cho skill `docx` — là ZIP/OOXML, `Read` thẳng ra rác |
| `.xlsx`, `.csv` (bảng field spec/error code) | Ủy quyền cho skill `xlsx` — nguồn Field Spec tốt nhất |
| `.pdf` (API spec dạng PDF) | Ủy quyền cho skill `pdf` |
| URL Swagger UI / Scalar / Redoc | Tìm URL spec gốc (thường `/v2/api-docs`, `/v3/api-docs`, `/swagger/json`). VD: `https://x.com/swagger` → spec tại `https://x.com/swagger/json` |
| URL Confluence / Jira mô tả API | **KHÔNG tự fetch** — hỏi user hoặc route sang `/fetch-jira-requirements` |

**Không đọc được file → báo user và DỪNG.** Không suy đoán nội dung từ tên file/tên endpoint.

### 9.2. Đối chiếu chéo các nguồn (BẮT BUỘC khi có ≥2 nguồn)

Spec API thường đến từ nhiều nguồn: OpenAPI + Postman + tài liệu Word + comment developer. Trước khi viết TC, lập bảng đối chiếu:

| Hạng mục | OpenAPI spec | Postman collection | Tài liệu Word | Comment/Slack | Kết luận |
|---|---|---|---|---|---|
| VD: max length trường `name` | không nói | 255 | 200 | (không có) | ⚠️ Xung đột → AMB |
| VD: status khi trùng mã | `409` | `409` (có example) | `400` | dev nói `409` | ✅ Nhất quán: `409` |

**Thứ tự ưu tiên khi mâu thuẫn về hệ thống PHẢI làm gì** (default, luôn ghi rõ đã chọn nguồn nào):

```
1. Quyết định có ngày của PO hoặc API Owner  ← mạnh nhất
2. Requirement, tiêu chí chấp nhận đã duyệt
3. OpenAPI spec đã duyệt
4. Ví dụ trong Postman collection
5. Tài liệu chưa rõ trạng thái duyệt
```

**Response thực tế không nằm trong thang này** — nó trả lời hệ thống *đang* làm gì, không phải *phải* làm gì. Dùng nó làm chuẩn thì TC xác nhận luôn bug. Lệch với nguồn trong thang → ghi `F-nn` + `AMB`, Expected vẫn theo nguồn. Mọi nguồn đều im lặng → tạm dùng response thực tế, kèm `ASM` và `@NeedsVerify`. Dev chỉ nói miệng hoặc comment không có người chịu trách nhiệm thì chưa phải bậc 1.

❗ **Xung đột KHÔNG được tự giải quyết im lặng** — mọi mâu thuẫn thành `AMB-XX` kèm Assumption tạm, kể cả khi đã chọn được nguồn ưu tiên.

### 9.3. Framework Phát Hiện Ambiguity — AMB-XX

Với mỗi ambiguity, ghi đủ 5 cột: **Mã · Câu hỏi · Nguy cơ · Mức độ · Assumption tạm**:

| Mã | Câu hỏi | Nguy cơ nếu không giải quyết | Mức độ | Assumption tạm |
|---|---|---|---|---|
| AMB-01 | Max length `providerCode` là bao nhiêu? | Test boundary sai, có thể miss lỗi 500 khi vượt | 🔴 High | Test theo max 50 (thấy trong Postman) |
| AMB-02 | Response khi provider disabled: 400 hay 404? | Assert sai status, TC fail giả | 🟡 Medium | 400 theo spec, note lại |

**Các hướng phát hiện AMB cho API:**
- Từ khóa mơ hồ trong spec: "as needed", "if applicable", "similar to"
- Validation rules thiếu: min/max, format regex, required/optional, default value
- Response schema không đầy đủ (chỉ có 200, thiếu 400/500)
- Enum values chưa liệt kê đủ (VD `status` trong doc là `pending/approved` nhưng response thấy `rejected`)
- Behavior edge case chưa quy định: null vs empty, concurrent, timeout
- Threshold/config chưa xác định: rate limit bao nhiêu req/min, session timeout
- Phân quyền chưa rõ: role nào gọi được endpoint nào
- Async transition chưa rõ: có transition nào từ COMPLETED sang FAILED không?

### 9.4. Vòng đời AMB — bảng trạng thái

| Ký hiệu | Nghĩa | Hành động tiếp theo |
|---|---|---|
| ❓ | **Chờ trả lời** — đã gửi BE Dev/BA, chưa có phản hồi | Test theo Assumption tạm, gắn nhãn `assumption-based` trong TC |
| ✅ | **Đã trả lời** — ghi ngày + kết luận | Nếu kết luận sinh TC mới → viết bổ sung. Nếu khác Assumption → **TC dựa trên giả định phải sửa** |
| ⏭️ | **Bỏ qua** — Dev/BA xác nhận không cần làm rõ giai đoạn này | Ghi rõ lý do; test theo Assumption tạm và chấp nhận rủi ro |

> AMB đã ✅ hoặc ⏭️ **không được xoá khỏi bảng** — giữ lại để biết quyết định đến từ đâu.

### 9.5. Nhật Ký Thay Đổi (Changelog) — BẮT BUỘC khi spec đổi phiên bản

Đặt ở CUỐI file TC, thứ tự mới nhất lên trên:

| Ngày | Nguồn | TC ảnh hưởng | Loại | Tóm tắt thay đổi | Xử lý |
|---|---|---|---|---|---|
| 2026-09-15 | OpenAPI v2.3 | PDF_A1_05 → 08 | 🟡 Sửa | Max file size đổi từ 10MB → 20MB | Update boundary TC |
| 2026-09-10 | Comment BE 10/9 | PDF_C_04 | 🔴 Bỏ | Case cross-provider đã fix, không còn 502 | Archive TC |
| 2026-09-05 | OpenAPI v2.2 | PDF_E_07d → e | 🟢 Thêm | Support thêm provider "MISA" | Viết TC mới |

**Quy tắc ghi Nhật ký:**
- **Mọi** thay đổi spec đều phải có dòng — kể cả sửa message wording
- Cột `Nguồn` ghi version spec / ticket / comment date
- Cột `Xử lý` là **mắt xích cảnh báo** cho tester: `Update` / `Archive` / `Viết mới`

### 9.6. Chuẩn Evidence cho API TC

Evidence là **nguồn sự thật** để đối chiếu. Với API, evidence bao gồm:

| Loại evidence | Chuẩn ghi |
|---|---|
| **Response mẫu từ Postman** | Copy nguyên văn Response body (đã che dữ liệu nhạy cảm), lưu vào `docs/requirements/<module>/evidence/response_<endpoint>_<case>.json` |
| **Screenshot Postman/Insomnia** | Chụp full-page request + response, đặt tên `postman_<endpoint>_<case>_fullpage.png` |
| **Log từ dev** | Copy nguyên văn log (che token/PII), lưu vào `evidence/log_<case>.txt` |
| **cURL command** | Ghi vào TC dưới dạng inline code cho case phức tạp |

**Rule che dữ liệu nhạy cảm trong Evidence:**
- Token → `Bearer <masked>`
- User ID thật → `<user_uuid>`
- Email thật → `<email>` hoặc `auto_test@example.com`
- Số điện thoại → `<phone>`
- Số CMND/CCCD, số tài khoản ngân hàng → `<masked_pii>`

---
