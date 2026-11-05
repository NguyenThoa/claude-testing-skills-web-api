# Nhánh Document Analysis và kết hợp tài liệu với UI

### 3.2. Nhánh Document Analysis — phân tích tài liệu có sẵn

#### Bước 0 — Đọc được file đã, đừng đoán

Mỗi định dạng có cách đọc riêng. **KHÔNG** dùng `Read` thẳng cho định dạng nhị phân:

| Định dạng | Cách xử lý bắt buộc |
|---|---|
| `.md`, `.txt`, `.html`, `.xml`, `.json` | `Read` trực tiếp. File `.doc` export từ Jira thực chất là HTML → `Read` rồi bóc tag |
| `.docx`, `.dotx` | **Ủy quyền cho skill `docx`** — là ZIP/OOXML, `Read` thẳng ra rác |
| `.xlsx`, `.xlsm`, `.csv`, `.tsv` | **Ủy quyền cho skill `xlsx`** |
| `.pdf` | **Ủy quyền cho skill `pdf`** |
| `.pptx` | **Ủy quyền cho skill `pptx`** |
| Ảnh (mockup, screenshot) | `Read` — công cụ hiển thị ảnh trực tiếp |
| URL Jira/Confluence | **KHÔNG tự fetch.** Route sang `/fetch-jira-requirements` + `skills-jira-integration`. Nếu MCP chưa authorize → **dừng và báo user**, tuyệt đối không bịa nội dung ticket |

> ⚠️ Nếu không đọc được file bằng bất kỳ cách nào → **báo user và dừng**. Không suy đoán nội dung từ tên file.

#### Bước 1 — Trích xuất theo thứ tự

1. **Metadata:** Ticket ID, Type, Priority, Status, Reporter, Assignee, Fix Version, Sprint, Labels, Epic cha
2. **User Story:** dạng "As a… I want… So that…" — trích **nguyên văn**, không diễn đạt lại
3. **Scope:** module/page/component bị ảnh hưởng. Ghi rõ cả phần **ngoài phạm vi** nếu tài liệu có nêu
4. **Acceptance Criteria:** gán `REQ-<MODULE>-<SỐ>` cho **từng rule đủ nhỏ để test độc lập** (theo mục 2 + 2.1)
5. **Dependencies:** ticket/feature được reference trong AC hoặc comment — đọc và tóm tắt
6. **Comments:** thường chứa quyết định nghiệp vụ mới nhất, **đè lên** phần mô tả gốc. KHÔNG được bỏ qua
7. **Attachments:** mockup, file CSV/XLSX đính kèm — xem bước 2
8. **Lịch sử thay đổi** (nếu có): AC nào được sửa gần đây → vùng rủi ro cao

#### Bước 2 — Khai thác file bảng (CSV/XLSX) — nguồn Field Spec tốt nhất

File bảng đính kèm thường **giá trị hơn cả phần mô tả**. Tìm và khai thác:

| Loại bảng | Dùng để sinh |
|---|---|
| Danh sách field/cột kèm kiểu dữ liệu, bắt buộc, độ dài | **Field Specifications** (mục 6.3) — gần như map 1:1 |
| Bảng thông báo lỗi / message key | **Validation Messages** (mục 6.4) |
| Ma trận role × chức năng | **Ma trận Phân quyền** (mục 6.5) |
| Bảng trạng thái × hành động | **Ma trận Trạng thái** (mục 6.6) |
| Data mẫu / test data | Đầu vào cho `/generate-test-data` — ghi chú lại, không đưa vào requirements |

Khi trích từ file bảng, **ghi rõ vị trí nguồn**: `<tên file> · sheet <tên> · dòng <n>`.

#### Bước 3 — Đối chiếu chéo các nguồn (BẮT BUỘC khi có ≥ 2 nguồn)

Lập bảng đối chiếu trước khi viết requirements:

| Hạng mục | Ticket mô tả | Comment | Mockup | File đính kèm | Kết luận |
|---|---|---|---|---|---|
| VD: độ dài tối đa của Tên | không nói | 255 | — | 200 | ⚠️ Xung đột → AMB |

**Thứ tự ưu tiên khi các nguồn mâu thuẫn** (dùng làm mặc định, luôn ghi rõ đã chọn nguồn nào và vì sao):

```
1. Comment/quyết định mới nhất có ghi ngày   ← mới nhất thắng
2. AC trong phần mô tả ticket                 ← cam kết chính thức
3. File đặc tả đính kèm (CSV/XLSX/DOCX)
4. Mockup/wireframe                           ← dễ lỗi thời nhất
```

❗ **Xung đột KHÔNG được tự giải quyết im lặng** — mọi mâu thuẫn đều phải thành một `AMB-<MODULE>-XX` kèm Assumption tạm, kể cả khi đã chọn được nguồn ưu tiên.

#### Bước 4 — Xử lý tài liệu thiếu (rất hay gặp)

| Tình huống | Cách xử lý |
|---|---|
| Ticket **không có AC nào**, chỉ 1–2 dòng mô tả | ❌ KHÔNG tự viết AC thay PO. Ghi nhận đúng những gì có, rồi liệt kê **danh sách câu hỏi cần clarify** dạng `AMB-<MODULE>-XX` mức 🔴 High. Nêu rõ trong Overview: *"Ticket chưa có AC — tài liệu này chưa đủ để sinh test case"* |
| AC viết dạng mơ hồ ("hoạt động đúng", "như module cũ") | Gán REQ ID bình thường **nhưng** kèm ngay 1 `AMB-<MODULE>-XX` hỏi tiêu chí cụ thể |
| Tham chiếu "giống module X" | Nếu module X đã có `<X>/REQUIREMENTS_<X>_SUMMARY.md` → trích REQ tương ứng và **link chéo**. Nếu chưa có → `AMB-<MODULE>-XX`, không tự suy diễn |
| Thiếu hoàn toàn thông tin phân quyền/trạng thái | Ghi "Không đề cập trong tài liệu" (khác với "Không áp dụng") + `AMB-<MODULE>-XX` |

### 3.3. Khi có cả tài liệu và UI thực tế

Chạy 3.2 trước để nắm **ý định**, rồi 3.1 để đối chiếu **thực tế**. Mọi lệch pha đều phải ghi nhận, phân loại rõ:

| Kiểu lệch | Nghĩa là | Xử lý |
|---|---|---|
| Tài liệu có, UI chưa có | Tính năng chưa build hoặc build thiếu | REQ vẫn giữ, ghi trạng thái `Chưa implement` |
| UI có, tài liệu không nói | Tính năng ngoài tài liệu (scope creep / di sản) | Vẫn gán REQ, nguồn ghi `UI thực tế — ngoài tài liệu` + `AMB-<MODULE>-XX` |
| Cả hai có nhưng khác nhau | Xung đột thật | `AMB-<MODULE>-XX` 🔴 High, ghi cả hai giá trị nguyên văn |

### 3.3.1. Tài liệu bán phần — chia vùng trước khi recon

Tình huống thực tế phổ biến nhất: QA đưa được **một phần** tài liệu (spec của 2/8 màn hình, file Excel chỉ có danh sách field, mockup cũ 6 tháng trước), phần còn lại phải tự khám phá.

Sai lầm hay gặp là xử lý cả module theo **một** cách: hoặc tin tài liệu rồi recon qua loa, hoặc bỏ tài liệu rồi recon lại từ đầu. Cả hai đều tốn công và đều sai.

**Bước 1 — Lập Bản đồ phủ tài liệu cho module, TRƯỚC khi mở browser:**

| Vùng chức năng | Tài liệu phủ | Mức phủ | Chiến lược recon |
|---|---|---|---|
| Form tạo mới | `field_spec.xlsx` sheet "Customer" dòng 3–28 | 🟩 Đầy đủ | **Đối chiếu** — mở form kiểm từng dòng spec, tìm lệch |
| Danh sách & lọc | Mockup `list_v1.png` (2026-02) | ⚠️ Nghi lỗi thời | **UI thắng** — recon đầy đủ, mọi lệch ghi `AMB` |
| Phân quyền | — | ⬜ Trắng | **Recon đầy đủ** như mode UI thuần |
| Import Excel | Ticket ABC-12 mô tả 3 dòng | 🟨 Một phần | **Bổ khuyết** — tài liệu cho luồng chính, recon lấy validation + error |

**Bước 2 — Recon theo đúng chiến lược từng vùng:**

| Mức phủ | Việc phải làm | Việc được rút gọn |
|---|---|---|
| 🟩 **Đầy đủ** | Mở màn hình, kiểm **từng** rule tài liệu nêu có đúng trên UI không. Lệch → `AMB` | Không cần dò lại từ đầu những rule đã ghi rõ và đã khớp |
| 🟨 **Một phần** | Recon **đầy đủ** phần tài liệu không nói (thường là: validation message, edge case, phân quyền) | Phần tài liệu đã nêu rõ và khớp UI → trích dẫn, không mô tả lại |
| ⬜ **Trắng** | Recon đầy đủ 9 bước mục 3.1 | Không rút gọn gì |
| ⚠️ **Nghi lỗi thời** | Recon đầy đủ như ⬜. Tài liệu chỉ dùng làm **danh sách câu hỏi**: "chỗ này tài liệu nói X, thực tế thế nào?" | Không rút gọn gì |

**Bước 3 — Ghi nguồn phân biệt được 4 mức** (cột `Nguồn` của mỗi REQ):

| Giá trị cột `Nguồn` | Nghĩa |
|---|---|
| `Tài liệu · <file> · <vị trí>` | Chỉ có trong tài liệu, **chưa** mở UI kiểm |
| `Tài liệu + kiểm chứng thực tế` | Tài liệu nêu, đã mở UI xác nhận khớp — **mức tin cậy cao nhất** |
| `UI thực tế` / `Kiểm chứng thực tế` | Chỉ có ở UI, tài liệu không nói |
| `API · <method> <endpoint>` | Lấy từ tầng network (mục 3.1.1) |

**Luật cứng của nhánh này:**
- ❌ **Không** dùng tài liệu bán phần để suy ra vùng nó không phủ. Spec form tạo mới **không** nói gì về form sửa — dù hai form nhìn giống nhau
- ❌ Vùng ⬜ Trắng **không** được rút gọn recon với lý do "module này chắc giống module kia"
- ✅ **Bản đồ phủ tài liệu phải nằm trong tài liệu đầu ra** (một mục ngay sau Tổng quan) — người đọc cần biết phần nào tin được từ spec, phần nào do agent quan sát
- ✅ Tài liệu ⚠️ nghi lỗi thời mà **khớp** UI → nâng lên `Tài liệu + kiểm chứng thực tế`; **lệch** → `AMB-<MODULE>-XX` kèm nguyên văn cả hai bên
- ✅ Khi `/discover-system` đã chạy: đọc `docs/requirements/_discovery/doc_inventory.md` — Bản đồ phủ tài liệu cấp hệ thống đã có sẵn ở đó, chỉ cần chi tiết hoá xuống cấp vùng chức năng
