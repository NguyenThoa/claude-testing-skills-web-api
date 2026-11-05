# Quy Tắc Xuất File & Theo Dõi Tiến Độ

> Áp dụng mọi mode. Đường dẫn và tên file theo `CLAUDE.md` mục 6b.

### 1. Write-first — KHÔNG render bảng TC ra chat

- Agent ghi TC **thẳng vào file** bằng công cụ Write/Edit sau mỗi batch
- **NGHIÊM CẤM** in toàn bộ bảng TC ra chat rồi mới ghi file (user phải chờ 2 lần cho cùng một nội dung)
- Chat **chỉ** hiển thị:
  - Dòng tiến độ ngắn sau mỗi batch: `✅ Batch 2/4 — Validation form (18 TC) → web/test_cases_<module>_web.md`
  - **Bảng Đối Soát Coverage** (tiêu chí 6) ở cuối
  - Tóm tắt: tổng số TC · số file · đường dẫn file · điểm cần user review
- Muốn xem nội dung → user tự mở file. Chỉ trích dẫn tối đa **3–5 dòng TC mẫu** ra chat khi cần minh họa

### 2. Cấu trúc thư mục

```
docs/testcases/
├── README.md                                   ← DANH MỤC toàn hệ thống
└── <module>/
    ├── TEST_CASES_<TÊN_MODULE>_SUMMARY.md      ← INDEX — tên bất biến, KHÔNG chứa dòng TC
    └── web/                                    ← tầng nền tảng (web · api)
        ├── test_cases_<module>_web.md          ← MAIN — 10 cột (Manual QA/BA/PM đọc). 1 module × 1 nền tảng = 1 file duy nhất
        └── automation_matrix.md                ← Metadata automation (Auto QA đọc)
```

> Bản cũ tra bằng **lịch sử git** — `docs/` KHÔNG có thư mục `archive/` (`CLAUDE.md`).

> ⚠️ **Dự án mới** — trước khi ghi bộ TC đầu tiên: check `docs/testcases/README.md` tồn tại chưa. Chưa có → **tạo ngay** với bảng danh mục rỗng, rồi mới ghi TC. Thiếu file này thì không ai biết prefix TC ID nào đã bị chiếm.

**Quy tắc file — 1 module luôn 1 file duy nhất:**

| Điều kiện | Xử lý |
|---|---|
| Bất kỳ số TC nào (kể cả >40, >100) | **1 file `test_cases_<module>_<nền-tảng>.md`** — KHÔNG tách thành nhiều file `parts/` (ngoại lệ đã ghi ở `CLAUDE.md`, người dùng chốt 13-10-2026) |
| TC nhiều gây khó đọc | **Chia nhỏ section chức năng bên trong cùng file** (VD I.2 Thêm → thêm I.2.5, I.2.6 sub-heading; hoặc gom bulk action thành ### riêng trong I.1) |
| Nhiều module | Mỗi module một **thư mục riêng**, mỗi nền tảng 1 file `test_cases_<module>_<nền-tảng>.md`, KHÔNG gộp nhiều module vào 1 file |

> **Lý do 1 module = 1 file:** Reader (QA/BA/PM) cần Ctrl+F một phát tìm được TC bất kỳ trong module. Tách file phá luồng đọc, phải nhớ TC nào ở part nào. Section I.X.Y trong cùng 1 file đã đủ để tổ chức 100+ TC.

### 3. Automation Matrix — file riêng

**`docs/testcases/<module>/web/automation_matrix.md`** — tạo cùng bộ TC, chấm `Automatable` theo `automation_criteria.md`. Cột `Tag` và `Priority` lấy đúng giá trị ở bảng chính:

```markdown
# Automation Matrix — <Module>

| TC ID | Test Summary | Automatable | Type | Tag | Priority | Auto Status | Code file |
|---|---|---|---|---|---|---|---|
| CRM_CUST_TC_019 | Kiểm tra validate Email - nhập > 255 ký tự | Yes | UI | @Regression, @NegativeCase | P2 | ❌ Todo | - |
```

- **Automatable:** Yes / No / Partial
- **Type:** UI / API / UI+API
- **Tag:** `@Smoke` / `@Regression` / `@Security` / `@BusinessRule` / `@Permission` / `@Search` / `@Filter` / `@Pagination` / `@Layout` / `@AuditLog` / `@Session` / `@Concurrency` / `@Resilience` / `@UX` / `@NegativeCase` / `@Integration`
- **Priority:** P1 (Smoke + Critical) / P2 (Regression) / P3 (Edge case)
- **Auto Status:** ❌ Todo / ⏳ In-progress / ✅ Done / 🚫 Skip

### 4. Chạy theo batch — không dừng hỏi giữa chừng

- Chia theo **VÒNG** của **Bản Đồ Loại Kiểm Thử — 4 Vòng**: `V1 Smoke` → `V2 Functional` → `V3 Technical` → `V4 Non-functional`. Mỗi batch 15–25 TC
- Vòng 2 thường đông TC → chia con **bên trong vòng** theo nhóm chức năng (validation form / data table / CRUD / status flow). KHÔNG trộn TC của hai vòng khác nhau vào một batch
- Agent **chạy thẳng hết mọi batch trong 1 lượt**, KHÔNG dừng hỏi "có tiếp tục không" sau mỗi batch
- Trước khi sinh, agent công bố kế hoạch batch để user biết tổng khối lượng:
  ```
  Kế hoạch: 5 batch · ~46 TC · 1 file · độ hạt GỘP (mặc định)
  V1 Smoke        (≈9 TC)   — UI cơ bản, mở form, hiển thị, nhập hợp lệ, lưu, đối chiếu
  V2a Validation  (≈14 TC)  — required + 15 loại field
  V2b CRUD & luồng(≈11 TC)  — sửa, xoá, phụ thuộc, đoán lỗi
  V3 Technical    (≈8 TC)   — phân quyền, bảo mật cơ bản  [@TechCheck]
  V4 Non-func     (≈4 TC)   — responsive, bàn phím
  ```
  Dòng kế hoạch **BẮT BUỘC** nêu độ hạt đang dùng — user đọc một dòng là biết sẽ nhận ~46 TC hay ~85 TC và chặn lại được ngay nếu không hợp ý.
- Ngoại lệ được phép dừng: phát hiện requirement mâu thuẫn nghiêm trọng làm sai hàng loạt TC phía sau

### 5. File index (luôn có)

File `docs/testcases/<module>/TEST_CASES_<TÊN_MODULE>_SUMMARY.md` **là index** — giữ nguyên tên, không đổi thành `*_index.md`, **không** chứa dòng TC:

```markdown
# Test Cases — <Module> (tổng <N> TC · <K> nền tảng)

| Thông tin | Nội dung |
|---|---|
| Nguồn requirement | [REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md](../../requirements/<module>/REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md) |
| Dải TC ID đã dùng | `CRM_CUST_TC_001` → `CRM_CUST_TC_094` — chung mọi nền tảng |

## Bản đồ tài liệu
| Nền tảng | File | Nhóm chức năng | Số TC | TC ID | REQ bao phủ |
|---|---|---|---|---|---|
| Web | [web/test_cases_customers_web.md](web/test_cases_customers_web.md) | Danh sách · tạo/sửa · validation | 52 | 001–052 | REQ-CUST-01 → 26 |
| API | [api/test_cases_customers_api.md](api/test_cases_customers_api.md) | `/api/customers` | 18 | 077–094 | REQ-CUST-01 · 34 → 45 |

## Bảng Đối Soát Coverage (toàn module)
<gộp coverage của mọi file nền tảng — có cột theo nền tảng: REQ khai áp N nền tảng thì phải có ≥ 1 TC ở **mỗi** nền tảng đó>
```

- Mỗi file nền tảng **BẮT BUỘC** có link ngược về index, link tới file requirements của **cùng nền tảng** (`../../../requirements/<module>/<nền-tảng>/requirements_<module>_<nền-tảng>.md`)
- Bảng Đối Soát Coverage **chỉ nằm ở index**, không nhân bản vào từng file nền tảng
- REQ dùng chung ≥ 2 nền tảng mà thiếu TC ở một nền tảng đã khai → coverage của nền tảng đó là ❌, **không** được tính là "đã phủ" nhờ TC của nền tảng khác
- **Cập nhật `docs/testcases/README.md`** (danh mục) sau khi sinh xong: số TC, REQ bao phủ, ngày cập nhật

### 6. task.md — theo dõi tiến độ

Khi tổng TC dự kiến **>30** hoặc có **≥2 module**, agent **BẮT BUỘC** tạo `task.md` (nhất quán với các workflow automation trong repo) và cập nhật sau mỗi batch:

```markdown
# Task: Sinh TC module Customers
- [x] Batch 1 — Validation form (24 TC) → part1
- [x] Batch 2 — Data table & filter (18 TC) → part1
- [ ] Batch 3 — CRUD & phân quyền (đang chạy)
- [ ] Batch 4 — Non-functional
- [ ] Quality Gate + Bảng Đối Soát Coverage
```

> Nếu môi trường có sẵn task list của Claude Code → dùng luôn task list thay cho `task.md` để user thấy tiến độ trực tiếp trên UI.

