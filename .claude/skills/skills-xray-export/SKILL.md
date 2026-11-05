---
name: skills-xray-export
description: Skill chuyên dụng đồng bộ và đẩy toàn diện tài sản kiểm thử lên Jira Xray Server/Data Center (Test Plans, Test Sets, Pre-Conditions, Tests với Manual Steps chuẩn PUT, Description và Link Traceability).
---

# Skills Xray Export — Quản Lý & Đẩy Toàn Diện Lên Jira Xray Server

Skill này đóng gói toàn bộ quy trình, chuẩn API, cấu trúc dữ liệu và script tự động để xuất/đồng bộ bộ kiểm thử lên hệ thống **Jira Xray Server / Data Center** (CyberTech Jira Server: `https://jira.cybertech.vn`), tuân thủ chuẩn thực chiến đã được kiểm chứng.

Các mã trong tài liệu này chỉ là **ví dụ** — thay bằng mã thật của dự án:
- **Project:** `PROJ`
- **Story gốc:** `PROJ-123`
- **Test Plan:** `PROJ-300`
- **Test Sets phân loại Priority:** `PROJ-201` (P1), `PROJ-202` (P2), `PROJ-203` (P3)
- **Test Case:** `PROJ-401`, `PROJ-402`
- **Pre-Condition:** `PROJ-501`

---

## 1. Kiến Trúc 5 Tầng Chuẩn Xray (5-Tier Xray Architecture)

Mọi bộ test khi đồng bộ lên Jira Xray cần thiết lập đầy đủ 5 thực thể liên kết chặt chẽ:

```
                  ┌──────────────────────────────────────────────┐
                  │          Story / Requirement Issue           │
                  │               (VD: PROJ-123)                 │
                  └───────┬──────────────────────────────▲───────┘
                          │                              │
                          │ relates to                   │ relates to
                          ▼                              │
                  ┌───────────────┐              ┌───────┴──────┐
                  │   Test Plan   │              │   Test Set   │
                  │  (PROJ-300)   │              │ (P1, P2, P3) │
                  └───▲───────▲───┘              └───▲────▲───▲─┘
                      │       │                      │    │   │
           tested by  │       │ tested by (Tests)    │    │   │ contains (Xray API)
                      │       └──────────────────────┘    │   │
                      │                                   │   │
                      │ contains tests (Xray API)         │   │
                      └─────────────────┬─────────────────┘   │
                                        │                     │
                                  ┌─────┴─────────────────────┴────┐
                                  │           Test Issue           │
                                  │         (VD: PROJ-401)         │
                                  └───────┬────────────────────────┘
                                          │
                                          │ associated Pre-Condition
                                          │ (customfield_10708)
                                          ▼
                                  ┌────────────────────────────────┐
                                  │      Pre-Condition Issue       │
                                  │         (VD: PROJ-501)         │
                                  └────────────────────────────────┘
```

---

## 2. Các Bẫy Kỹ Thuật Bắt Buộc Ghi Nhớ (Jira Server vs Xray Cloud)

1. **Thêm Manual Step dùng `PUT`, không dùng `POST`**:
   - `POST /rest/raven/1.0/api/test/{key}/step` trả về **HTTP 405 Method Not Allowed**.
   - Endpoint chuẩn là: `PUT /rest/raven/1.0/api/test/{key}/step`.
   - Mỗi lần gọi `PUT` chỉ truyền **1 step đơn lẻ** `{ step, data, result }`, không truyền mảng `[]`.
2. **Bulk import JSON không tồn tại trên Jira Server**:
   - Endpoint `POST /rest/raven/1.0/import/test/bulk` trả về **HTTP 404 Not Found** (chỉ có trên Cloud).
   - Trên Server phải dùng chuỗi REST API: Tạo Issue `Test` → PUT từng Step → Gán vào Test Set/Test Plan.
3. **Liên kết Pre-Condition với Test**:
   - `PUT /rest/raven/1.0/api/precondition/{key}` và `POST /rest/raven/1.0/api/test/{key}/preconditions` dễ bị HTTP 405.
   - Cách ổn định nhất là cập nhật trực tiếp qua trường **`customfield_10708`** bằng Jira Core REST API:
     ```json
     PUT /rest/api/2/issue/{testKey}
     { "fields": { "customfield_10708": ["PRE_KEY"] } }
     ```
4. **Gán Test vào Test Set**:
   - `POST /rest/raven/1.0/api/testset/{setKey}/test` bắt buộc nhận body dạng object chứa thuộc tính `add`:
     ```json
     { "add": ["PROJ-401", "PROJ-402"] }
     ```
     Nếu gửi trực tiếp mảng JSON `[...]` Java Jackson serializer sẽ báo lỗi HTTP 500 (`Can not deserialize instance of CollectionBean out of START_ARRAY token`). Cú pháp này hoàn toàn đồng nhất với API thêm Test vào Test Plan (`/rest/raven/1.0/api/testplan/{planKey}/test`).
5. **Định dạng Description của Test Issue**:
   - Tránh nhồi nhét bảng markdown phức tạp vào `description` của Test Issue vì sẽ làm vỡ giao diện chi tiết của Xray.
   - Định dạng chuẩn ngắn gọn:
     ```text
     Pre-condition: {Nội dung tiền điều kiện}

     Test Case ID: {Mã_TC}
     Requirement: {Mã_Story}
     Phân nhóm: {Tên_Module_hoặc_Phần_kê_khai}
     ```
6. **Không liên kết `Tests` trực tiếp từng Test Case vào Story**:
   - Khi đã có 3 Test Sets (P1, P2, P3) và Test Plan, Story chỉ cần liên kết `Relates` tới Test Plan và các Test Sets.
   - Tuyệt đối không tạo Issue Link type `Tests` giữa Story và hàng trăm Test Cases riêng lẻ để tránh làm ngập tràn giao diện của Story.

---

## 2b. File Cache Khi Chạy Export

Script tự sinh `.cache_<STORY-KEY>.json` trong thư mục skill để lần chạy sau không tạo trùng Test và Pre-Condition. File này chứa dữ liệu Jira thật nên đã được `.gitignore` chặn, không commit và không chép vào tài liệu.

- **Cấu trúc:** xem `references/cache_example.json` (dữ liệu mẫu). `createdTests` nối TC ID với mã Test, `preMap` nối nội dung tiền điều kiện với mã Pre-Condition.
- **Tìm Story của một TC:** dùng khi tự đồng bộ TC đã đổi, xem `/export-to-xray` mục *Tự đồng bộ khi test case đổi*.
- **Xoá cache an toàn:** lần chạy sau script tìm lại Test và Pre-Condition trên Jira theo TC ID và nội dung.

---

## 3. Bản Đồ Custom Fields Xray Trên CyberTech Jira Server

| Field ID | Tên hiển thị trên Jira | Kiểu dữ liệu / Mục đích sử dụng |
|---|---|---|
| `customfield_10702` | **Test Type** | Option `{ "value": "Manual" }` (Bắt buộc gán khi tạo Test) |
| `customfield_10705` | **Manual Test Steps** | Cấu trúc steps của Xray (được quản lý qua API `/rest/raven/1.0/api/test/{key}/step`) |
| `customfield_10706` | **Step Count** | Tự động tính số step |
| `customfield_10707` | **Test Sets association** | Danh sách Test Sets chứa Test này |
| `customfield_10708` | **Pre-Conditions association** | Mảng mã Pre-Condition liên kết: `["PROJ-501"]` |
| `customfield_10709` | **Test Plans association** | Danh sách Test Plans chứa Test này |
| `customfield_10721` | **Pre-Condition Type** | Option `{ "value": "Manual" }` |
| `customfield_10722` | **Conditions** | Nội dung điều kiện của Pre-Condition |
| `customfield_10724` | **Tests with Pre-Condition** | Mảng Tests liên kết trong Pre-Condition |
| `customfield_10726` | **Tests associated with Test Plan** | Danh sách Tests thuộc Test Plan |

---

## 4. Quy Trình 5 Bước Thực Thi Đẩy Lên Xray

Khi nhận lệnh đẩy toàn diện lên Xray cho một Story/Task (VD: `/export-to-xray` hoặc prompt tương đương):

### Bước 1: Khởi tạo Pre-Conditions
1. Đọc danh sách Pre-conditions từ tài liệu test cases (`docs/testcases/...`).
2. Với mỗi Pre-condition duy nhất:
   - Tạo issue type `Pre-Condition`:
     ```json
     {
       "fields": {
         "project": { "key": "PROJ" },
         "issuetype": { "name": "Pre-Condition" },
         "summary": "Đã mở form cần kiểm thử, chưa thao tác dữ liệu.",
         "description": "Đã mở form cần kiểm thử, chưa thao tác dữ liệu.",
         "customfield_10721": { "value": "Manual" },
         "customfield_10722": "Đã mở form cần kiểm thử, chưa thao tác dữ liệu."
       }
     }
     ```
   - Lưu lại map `{ [preConditionText]: preConditionKey }`.

### Bước 2: Khởi tạo 3 Test Sets theo Priority (P1, P2, P3)
1. Kiểm tra qua JQL xem các Test Set cho Story đã tồn tại chưa:
   `project = PROJ AND issuetype = "Test Set" AND summary ~ "P1" AND summary ~ "PROJ-123"`, rồi chọn đúng Test Set có tên khớp mẫu ở mục 2 dưới đây
2. Nếu chưa, tạo 3 Test Sets:
   - `P1`: `[PROJ-123] Test Set — P1 (Smoke & Critical Path)`
   - `P2`: `[PROJ-123] Test Set — P2 (Regression & Business Validation)`
   - `P3`: `[PROJ-123] Test Set — P3 (Edge Cases & Non-Functional)`
3. Lưu lại map `{ P1: keySet1, P2: keySet2, P3: keySet3 }`.

### Bước 3: Tạo Test Issue & Nạp Manual Steps
Với mỗi test case:
1. Tạo issue type `Test`:
   - Summary: `[{TC_ID}] {Tiêu đề test case}`
   - Priority: `High` (P1) / `Medium` (P2) / `Low` (P3)
   - Description: Chuẩn format 3 khối (Pre-condition, Metadata ID/Req, Phân nhóm).
   - Custom field: `customfield_10702 = { value: "Manual" }`.
   - Pre-condition: Gán `customfield_10708 = [preKey]`.
2. Đẩy Manual Test Steps từng bước (Action / Data / Expected Result):
   - Gọi `PUT /rest/raven/1.0/api/test/{testKey}/step`:
     ```json
     {
       "step": "Kiểm tra tiêu đề màn hình",
       "data": "",
       "result": "Tiêu đề hiển thị đúng tên màn hình"
     }
     ```
3. Gán Test vào Test Set tương ứng (P1/P2/P3):
   - Gọi `POST /rest/raven/1.0/api/testset/{targetSetKey}/test` với body `{ "add": [testKey] }`.

Không tạo link `Tests` trực tiếp từ Story tới từng Test — xem mục 2, bẫy 6.

### Bước 4: Tạo Test Plan chuẩn mẫu
1. Tổng hợp thông tin Story, Subtasks, Đợt phát hành, Danh mục và Độ phủ REQ.
2. Xây dựng bản mô tả Description chuẩn Wiki Markup 5 mục:
   - `1. THÔNG TIN TÀI LIỆU THAM CHIẾU` (Bảng Sprint, Story, Subtasks, Confluence, Test Sets)
   - `2. PHẠM VI TÍNH NĂNG CẦN KIỂM THỬ` (Bảng Story, Màn hình, Menu, Chức năng, Nội dung, Mô tả)
   - `3. MỤC TIÊU KIỂM THỬ` (Danh sách gạch đầu dòng mục tiêu chất lượng)
   - `4. KẾ HOẠCH KIỂM THỬ` (Môi trường test, Nhóm kiểm thử chính, Test data gợi ý, Lịch trình chi tiết)
   - `5. TIÊU CHÍ HOÀN THÀNH` (Tỷ lệ pass P1/P2/P3, xử lý blocker/critical)
3. Tạo issue type `Test Plan`:
   - Summary: `TPL - {Phiên bản FixVersion} - {Mã Story} {Tên Tính Năng}`
   - Time Tracking: Ước lượng tổng giờ kiểm thử (VD: `51h`).
   - FixVersion / Labels đồng bộ.
4. Thiết lập liên kết:
   - Link `relates to` tới Story.
   - Link `tested by` (Issue Link type `Tests`) tới các Test Sets P1, P2, P3.
   - Gán danh sách Test Cases vào Test Plan qua API: `POST /rest/raven/1.0/api/testplan/{planKey}/test`.

### Bước 5: Xác minh và Báo cáo Tổng kết
1. Kiểm tra lại toàn bộ liên kết trên Jira API:
   - Story có liên kết `relates to` tới Test Plan và các Test Sets, không có link `Tests` tới từng Test Case.
   - Test Plan hiển thị danh sách Test Sets và Tests.
   - Mỗi Test Issue mở ra hiển thị đúng Manual Steps, Pre-Condition và Test Set.
2. Xuất file tổng hợp báo cáo và link trực tiếp cho người dùng.
