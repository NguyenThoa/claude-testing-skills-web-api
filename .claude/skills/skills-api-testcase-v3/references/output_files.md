# Quy Tắc Xuất File API

## 6. Quy Tắc Xuất File & Theo Dõi Tiến Độ (BẮT BUỘC)

### 6.1. Write-first — KHÔNG render bảng TC ra chat

- Agent ghi TC **thẳng vào file** bằng Write/Edit sau mỗi batch
- Chat chỉ hiển thị:
  - Tiến độ ngắn: `✅ Batch 3/8 — Section E1 Happy path (12 TC) → I.E1`
  - Bảng Đối Soát Coverage cuối
  - Tóm tắt: tổng TC · section · path file
- Trích tối đa **3–5 dòng TC mẫu** ra chat khi cần minh hoạ

### 6.2. Cấu trúc thư mục

```
docs/testcases/
├── README.md                                       ← DANH MỤC toàn hệ thống (có bảng API)
└── <module>/
    ├── TEST_CASES_<TÊN_MODULE>_SUMMARY.md          ← INDEX — tên bất biến, KHÔNG chứa dòng TC
    └── api/
        ├── test_cases_<module>_api.md              ← MAIN — 1 module = 1 file
        └── automation_matrix.md                    ← Metadata automation (tách riêng)
```

**Quy tắc:**
- 1 module = 1 file duy nhất (dù >100 TC vẫn giữ), nhiều endpoint chia bằng heading
- Bản cũ tra bằng lịch sử git, không có thư mục `archive/`
- Auth dùng chung (VD HMAC) → TC nằm ở module auth, Section I của module khác chỉ link tới

### 6.3. Chạy theo batch — không dừng hỏi giữa chừng (QUICK)

Batch plan mẫu cho API endpoint điển hình:

```
Kế hoạch: 8 batch · ~90 TC · 1 file. Chỉ gồm section mà `Risk Level` yêu cầu (`test_design_api.md` mục 4)
1. Section A — Validate input (~35 TC theo từng field)
2. Section B — Master data (~5 TC)
3. Section C — Business rule (~6 TC)
4. Section D — Auth app-level (~2 TC)
5. Section E1-E5 — Success variants (~25 TC)
6. Section F — Edge cases downstream (~8 TC)
7. Section G — Status flow (nếu async, ~10 TC)
8. Section J + K — Format & Visual verify (~10 TC)
```

Agent chạy thẳng hết mọi batch, KHÔNG dừng hỏi. Chỉ dừng khi phát hiện requirement mâu thuẫn nghiêm trọng.

### 6.4. Automation Matrix — file riêng

`docs/testcases/<module>/api/automation_matrix.md`:

```markdown
| TC ID | Mục đích | Automatable | Type | Tag | Priority | Auto Status | Code file |
|---|---|---|---|---|---|---|---|
| CRM_KYSO_TC_001 | Validate file không truyền | Yes | API | @Regression, @NegativeCase | P2 | ❌ Todo | - |
| CRM_KYSO_TC_042 | Verify visual TEXT_ONLY Adobe | Manual | UI+Manual | @Manual, @Visual | P3 | 🚫 Skip auto | - |
```

**Type mới cho API:**
- `API` — automation REST Assured / Playwright API
- `API+Manual` — mix (VD verify Adobe sau khi API COMPLETED)
- `Manual` — pure manual (VD verify visual PDF trong Adobe)

**Tag mới:**
- `@Async` — TC cần polling
- `@Webhook` — TC verify webhook
- `@HMAC` — TC liên quan authentication headers
- `@Downstream` — TC verify downstream failure

---
