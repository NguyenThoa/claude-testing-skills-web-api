# scripts/quality-insights — xu hướng lỗi · rủi ro release · chọn test

Bộ công cụ của skill [`skills-quality-insights`](../../.claude/skills/skills-quality-insights/SKILL.md) · workflow `/analyze-defect-trends` · `/assess-release-risk` · `/select-regression-tests`. Thang điểm: [`references/scoring.md`](../../.claude/skills/skills-quality-insights/references/scoring.md). Không gắn với hệ thống nào.

| File | Chạy ở đâu | Làm gì |
|---|---|---|
| `qi.py` | Python 3.9+, **không cần thư viện ngoài** | Đọc thẳng `docs/` → bảng số liệu Markdown + JSON. Mọi con số kèm mã bug · run · TC · REQ |

## Lệnh con

```bash
# Dữ liệu thô — chạy đầu tiên để soát parser (số bug / run / TC có khớp danh mục không)
python scripts/quality-insights/qi.py collect -o reports/quality-insights/<YYYYMMDD>/data

# Xu hướng lỗi: lỗi theo module × nền tảng · theo tháng (tách hệ thống) · cụm cùng REQ · xu hướng từng TC qua các lần chạy · TC fail chưa có bug
python scripts/quality-insights/qi.py trends [--modules login,customers] [--system default] -o docs/quality-insights/_trends_data

# Rủi ro release: 5 yếu tố C·D·I·G·B → điểm 1–25 cho từng module × nền tảng
python scripts/quality-insights/qi.py risk --modules login,customers,projects --platform web --since 17-09-2026 -o docs/quality-insights/_risk_data
python scripts/quality-insights/qi.py risk --ticket PO-2026-09-19 -o …

# Chọn test: theo ticket (impact report) / REQ / module, trong quỹ phút
python scripts/quality-insights/qi.py select --ticket PO-2026-09-19 --modules customers,login --platform web --budget 45 -o docs/quality-insights/_select_data
python scripts/quality-insights/qi.py select --req REQ-LOGIN-16,REQ-LOGIN-25 -o …
```

| Tham số chung | Nghĩa |
|---|---|
| `--root` | Gốc project chứa `docs/` (mặc định thư mục hiện tại) |
| `--modules` | Tên **thư mục** module, ngăn bằng dấu phẩy. Với `select` có thay đổi: module không có REQ đổi là **module phụ thuộc** — chỉ lấy `@Smoke` / `@CriticalPath`. Với `risk`: module không có dữ liệu vẫn hiện, mang ⬛ |
| `--platform` | `web` · `mobile` · `api` |
| `--system` | `default` hoặc tên namespace (`_book-api`) |
| `--today` | Ngày tính tuổi lỗi (`DD-MM-YYYY`), mặc định hôm nay |
| `-o` | Đường dẫn **không đuôi** → ghi `<tên>.md` + `<tên>.json`. Link trong bảng tính tương đối từ thư mục của file này — ghi thẳng vào `docs/quality-insights/` thì link mở được từ báo cáo |

## Script đọc gì

| Nguồn | Trường |
|---|---|
| `docs/bugs/**/BUG_*.md` | `Severity` · `Trạng thái` (rơi về danh mục `README.md`) · `Test case liên quan` · `REQ ID liên quan` / `Requirement` (mã đầu ô là REQ chính; bỏ ghi chú sửa tham chiếu `*( … )*`) · `Ngày phát hiện` · bảng `Lịch sử retest` · dòng `Nghi ngờ root cause` |
| `docs/executions/**/run_*/execution_report.md` | Bảng có cột `TC ID` + `Kết quả` (biến thể `-a`/`-b` gộp về TC gốc, lấy kết quả xấu nhất) · `Loại nguồn` · `Bắt đầu → Kết thúc` |
| `docs/testcases/**/<web\|mobile\|api>/**/*.md` | Bảng TC có cột `Risk` — `REQ ID` · `Risk Level` · `Priority` · `Tags`. Bỏ qua `review/`, `impact/`, file index |
| `docs/requirements/**/impact/impact_<TICKET>.md` | Mục `## Tóm tắt`: dòng 🟢 · 🟡 · 🔴 (số trần `` `25` `` sau một REQ đầy đủ được mở thành `REQ-<PREFIX>-25`) |

## Giới hạn

- Chưa đọc `retest_report.md` — lịch sử retest lấy từ bảng trong file bug
- Không biết phụ thuộc giữa module — agent tự thêm qua `--modules` theo `system_map.md` / `RISK-*`
- Thời lượng/TC suy từ lần chạy trước; lần chạy có chờ người dùng gõ mật khẩu làm số phình lên
- Định dạng tài liệu đổi (đổi tên cột, đổi tiêu đề mục) → parser bỏ sót **im lặng**: luôn chạy `collect` và đối chiếu số với danh mục trước khi tin
