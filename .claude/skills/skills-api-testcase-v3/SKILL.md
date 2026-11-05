---
name: skills-api-testcase-v3
description: Skill sinh manual test cases cho API endpoint theo format v3 API 11 cột, có cột "Dữ liệu test" riêng, tương thích Xray — cấu trúc A/B/C/D/E/F/G/I/J/K theo layer test, thiết kế bám ISTQB CTFL v4.0 và rủi ro. Có 2 modes QUICK và FULL RBT, bắt buộc Q&A cho mọi điểm mơ hồ.
---

# API Testcase v3 — Skill sinh manual TC cho API endpoint

## Description

Skill này chuyên **sinh manual testcase cho API endpoint** (REST/gRPC). Song song với [`skills-manual-testcase-v3`](../skills-manual-testcase-v3/SKILL.md) (dùng cho UI CRUD).

**Format chung với skill manual v3:** `TC ID` · `REQ ID` · `Risk Level` · `Priority` · `Tags`, nên RTM, Quality Insights và `/export-to-xray` đọc được cả hai.

**Riêng của API:**

| Khía cạnh | API |
|---|---|
| Bảng TC | `TC ID \| REQ ID \| Risk Level \| Priority \| Mục đích kiểm tra \| Mô tả \| Tiền điều kiện \| Dữ liệu test \| Các bước thực hiện \| Kết quả mong đợi \| Tags` |
| Cột "Mô tả" | Ghi 1 câu khác biệt so với happy path |
| Kết quả mong đợi | Thành công/thất bại + HTTP status + Response JSON |
| Cấu trúc section | A/B/C/D/E/F/G/I/J/K theo layer test |
| Mục lục | Bắt buộc có anchor đầu file |
| Section K | Khi API sinh file cần kiểm bằng mắt |

**Nguyên tắc cốt lõi (giống skill manual v3):**
- **Human Strategy** — Con người xác định chiến lược, mức độ rủi ro
- **AI Execution** — AI phân tích, viết TCs, rà soát lỗ hổng
- **Human Verification** — Con người kiểm tra trước khi chốt
- **KHÔNG đoán ngầm** — Requirement mơ hồ thì hỏi (FULL RBT) hoặc ghi `ASM-XX` (QUICK)

**Ví dụ đường dẫn một bộ TC API:** `docs/testcases/<module>/api/test_cases_<module>_api.md`.

---

## Chuỗi Workflow API Trong Dự Án

Skill này nằm ở tầng **testcase** của chuỗi workflow API sau (theo command chuẩn dự án):

```
/discover-system (nhánh API) → /generate-requirements-from-api → /generate-testcases-api → /generate-automation-api
       api_map.md                  REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md        test_cases_<module>_api.md   code + reports/
```

| Tầng | Workflow dự án | Skill này đóng vai trò |
|---|---|---|
| Khám phá | [`/discover-system`](../discover-system/SKILL.md) (nhánh API) | Trước skill này — cấp module + prefix |
| Requirements | [`/generate-requirements-from-api`](../generate-requirements-from-api/SKILL.md) | Trước skill này — cấp REQ ID để neo TC |
| **Testcases** | [`/generate-testcases-api`](../generate-testcases-api/SKILL.md) | **← Skill này** — sinh TC neo vào REQ |
| Automation | [`/generate-automation-api`](../generate-automation-api/SKILL.md) | Sau skill này — sinh code từ TC |

**Ghi chú:** Skill này **có thể** chạy khi chưa có 2 tầng trước, nhưng TC sinh ra sẽ **không có REQ** để neo — báo user rõ, ghi `⚠️ Chưa có REQ` vào cột `REQ ID` khi cần.

---

## When to Use

Dùng skill này khi:
- Sinh manual TC cho REST API endpoint (JSON hoặc multipart/form-data)
- Sinh TC cho API async (có transaction status flow WAITING/COMPLETED/REJECTED/EXPIRED/FAILED)
- Sinh TC cho API có authentication headers (JWT, Bearer, HMAC, X-API-Key... — tùy dự án)
- Sinh TC cho API có multiple downstream services (tùy nghiệp vụ)

> **Ghi chú về nghiệp vụ:** Nội dung nghiệp vụ (business error code prefix, tên field, tên provider, luồng đặc thù) là **tùy từng dự án**. Skill này chỉ chuẩn hóa **cấu trúc file + rule format**; các ví dụ về CTS/HMAC/RSSP CA/RAR Hub/VNPT/BKAV/tsaExpected... lấy từ file mẫu Ký số PDF chỉ để **minh họa cách tổ chức**, không phải nghiệp vụ bắt buộc cho mọi API.

**KHÔNG** dùng skill này khi:
- Sinh TC cho UI CRUD form/list → dùng [`skills-manual-testcase-v3`](../skills-manual-testcase-v3/SKILL.md)
- Sinh automation code từ TC → dùng [`skills-qa-automation-engineer`](../skills-qa-automation-engineer/SKILL.md)
- Sinh test data → dùng [`skills-test-data-generator`](../skills-test-data-generator/SKILL.md)

---

## Mode Routing — User CHỌN mode khi gọi

Agent **KHÔNG tự chọn mode**. Nếu user không chỉ định, agent BẮT BUỘC hỏi:

```
Bạn muốn sinh theo chế độ nào?
1. QUICK  — Sinh 1 lượt, ghi ASM cho các điểm mơ hồ. Phù hợp API đơn giản, spec đã rõ.
2. FULL RBT — 6 bước tuần tự có Q&A với BE Dev / API Owner. Phù hợp API phức tạp (async, multi-provider, HMAC).
```

Chi tiết 2 modes giống hệt [skills-manual-testcase-v3](../skills-manual-testcase-v3/SKILL.md) — chỉ khác nội dung sinh ra (format bảng + cấu trúc file).

---

## Bản đồ đọc tiếp

Đọc đúng file cần dùng, không nạp hết. Số mục giữ nguyên.

| Mục | Nội dung | File trong `references/` | Đọc khi |
|---|---|---|---|
| 1 · 2 · 3 · 7 | Bảng 11 cột, mã HTTP, cấu trúc file, từ vựng | `format_api.md` | Luôn đọc khi sinh TC |
| ISTQB | Nguồn của Expected, kỹ thuật, độ sâu theo rủi ro, kinh nghiệm thực tế | `test_design_api.md` | Luôn đọc khi sinh TC |
| 4 · 5 | Đặc thù section, case API | `section_coverage.md` | Khi thiết kế TC |
| 6 | Xuất file, tiến độ | `output_files.md` | Trước khi ghi file |
| 8 · 9 | Quy tắc gọi API thật, phân tích spec | `real_api_and_spec.md` | **Trước request đầu tiên** |
| 10 | Test data, ma trận kết hợp | `test_data.md` | Khi điền dữ liệu |
| Mode 1 | QUICK | `mode_quick.md` | Mode QUICK |
| Mode 2 | FULL RBT | `mode_full_rbt.md` | Mode FULL RBT |
| Anti-Patterns · Gate · Output | Tự kiểm định | `quality_gates.md` | Trước khi bàn giao |
