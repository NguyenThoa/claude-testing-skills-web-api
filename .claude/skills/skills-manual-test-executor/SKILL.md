---
name: skills-manual-test-executor
description: Skill thực thi manual test cases trực tiếp trên browser thật qua Playwright MCP — chạy từng bước theo TC, đối chiếu Expected vs Actual, chấm PASS/FAIL/BLOCKED/SKIPPED, thu evidence (ảnh + video từng TC) và xuất execution report (xuất HTML nhúng sẵn ảnh + video khi được yêu cầu). Dành cho tester manual, KHÔNG sinh code automation.
---

# Manual Test Executor

## Description

Skill biến bộ manual test cases thành **kết quả kiểm thử thật**. Agent mở browser, chạy đúng từng bước ghi trong TC, quan sát UI thực tế, đối chiếu với Expected Result, chấm trạng thái và xuất báo cáo.

**Dành cho tester manual thuần** — không cần biết code, không sinh script automation.

**Nguyên tắc cốt lõi:**
- **Chạy thật, không suy đoán:** mọi kết luận PASS/FAIL phải dựa trên quan sát UI thực tế qua snapshot/screenshot
- **TC là chuẩn, không phải hệ thống:** khi thực tế lệch TC → ghi FAIL. **TUYỆT ĐỐI KHÔNG sửa TC cho khớp thực tế**
- **An toàn dữ liệu trước tốc độ:** môi trường dùng chung thì thao tác phá huỷ bị chặn, dữ liệu tạo ra phải dọn

---

## When to Use

Sử dụng skill này khi:

- Đã có bộ manual test cases (từ `skills-rbt-manual-testing`) và cần **chạy kiểm chứng thật**
- Cần chạy smoke/regression bằng tay trước release
- Cần thực thi checklist (từ CHECKLIST mode) trên môi trường thật
- Cần báo cáo kết quả PASS/FAIL có evidence cho PO/QA lead
- Cần kiểm chứng nhanh một nhóm TC sau khi dev fix bug

**KHÔNG** sử dụng skill này khi:

- Cần sinh code automation → `skills-qa-automation-engineer`
- Cần phân tích report **đã có sẵn** từ automation (Playwright/Allure/JUnit) → `skills-test-report-analyzer`
- Chỉ cần inspect DOM / lấy locator → `skills-ui-debug-agent`
- Chưa có TC, cần sinh TC trước → `skills-rbt-manual-testing`

---

## Vị trí trong chuỗi công việc

```
skills-rbt-manual-testing          skills-manual-test-executor          skills-bug-reporter
  test_cases_*.md          ──→      execution_report.md         ──→      bug_*.md (mỗi TC FAIL)
  checklist_*.md                            │
                                            └──→  skills-test-report-analyzer
                                                  (khi có nhiều FAIL cần gom nhóm root cause)
```

---

## Input cần thu thập

| Input | Bắt buộc? | Ghi chú |
|---|---|---|
| File TC hoặc checklist | ⭐ Bắt buộc | VD `docs/testcases/customers/web/test_cases_customers_web.md` · `docs/testcases/customers/web/parts/part_01_web_danh_sach.md` · `docs/checklists/customers/web/checklist_smoke_20261009.md` · `docs/checklists/_release/web/checklist_release_release_2.0.md`. User đưa file **index** → đọc `## Bản đồ tài liệu`, chỉ lấy file `web/` |
| Phạm vi chạy | ⭐ Bắt buộc | Toàn bộ file · theo tag (`@Smoke`) · theo TC ID range · theo nhóm chức năng |
| Môi trường & tài khoản | ⭐ Bắt buộc | URL, tài khoản đăng nhập, build/version đang test |
| Mức độ dùng chung của môi trường | ⭐ Bắt buộc | Dùng chung → bật auto-skip TC phá huỷ; môi trường riêng → có thể chạy đầy đủ |
| Quay video | Tuỳ chọn — mặc định **`Có`** | `Có` · `Chỉ giữ FAIL` · `Không` — xem bảng **Bật / tắt** ở mục *Video quay màn hình*. User không nói → `Có`, **không** hỏi thêm |

> Thiếu phạm vi chạy → agent **hỏi** thay vì mặc định chạy toàn bộ (bộ TC có thể tới hàng trăm TC).
>
> TC mang tag `@Deprecated` (chức năng đã gỡ) **bị loại khỏi phạm vi ngay lúc lọc** — không chạy, không tính vào tổng, **không** tính SKIPPED (SKIPPED là nợ kiểm thử, còn TC này không còn gì để kiểm). Header report ghi số TC Deprecated đã loại.

---

## Thứ tự thao tác browser (BẮT BUỘC)

Tuân thủ Browser Rules của dự án:

```
navigate → wait_for(page_load) → snapshot → interact → screenshot(on_fail)
```

- **Headed mode bắt buộc** — tester phải nhìn được agent đang làm gì
- **KHÔNG** gọi `browser_resize` — viewport đã đúng từ `--viewport-size` lúc launch MCP server. Phóng viewport vượt cửa sổ OS làm trang bị cắt bên phải, tester mất tầm nhìn (xem [`.claude/rules/playwright_rules.md`](../../rules/playwright_rules.md) mục 1)
- **KHÔNG** gọi `browser_navigate` lại nếu đã ở đúng trang — tránh reload làm mất trạng thái đang test
- Dùng `snapshot` để đọc trạng thái UI và verify; `screenshot` để lưu bằng chứng

---

## 4 Trạng thái kết quả

| Trạng thái | Khi nào | Bắt buộc kèm |
|---|---|---|
| ✅ **PASS** | **Mọi** Expected Result đánh số đều đã verify khớp thực tế | — |
| ❌ **FAIL** | Ít nhất 1 Expected Result không khớp thực tế | Screenshot tại bước fail + ghi rõ Actual vs Expected |
| ⚠️ **BLOCKED** | Không chạy được vì lý do **ngoài phạm vi TC**: pre-condition không dựng được, môi trường lỗi, TC phụ thuộc kết quả TC khác đã fail, hoặc có Expected không quan sát được | Ghi rõ nguyên nhân chặn |
| ⏭️ **SKIPPED** | Cố ý bỏ qua: TC thao tác phá huỷ trên môi trường dùng chung, TC ngoài phạm vi chạy đã chọn | Ghi rõ lý do skip |

> **Quy tắc vàng:** không verify được một Expected → TC là **BLOCKED**, KHÔNG phải PASS. Cấm suy đoán "chắc là đúng".

---

## Quy tắc Auto-Skip TC nguy hiểm (môi trường dùng chung)

Agent **tự động chuyển SKIPPED** và **KHÔNG thực thi** khi TC có bất kỳ dấu hiệu sau:

> ⚠️ `Automation = No` **KHÔNG** phải dấu hiệu bỏ qua — cột đó chỉ nói TC không làm automation, còn chạy tay vẫn chạy bình thường. Chỉ tag `@PersonalOnly` mới đưa TC ra khỏi `/execute-test-cases`.

| Dấu hiệu | Ví dụ |
|---|---|
| Tag `@PersonalOnly` — QA tự chạy và tự theo dõi ngoài workflow (TC chạy quá lâu, cần thao tác tay đặc biệt…) | TC_026 (chờ 65 phút) |
| Steps chứa thao tác xoá hàng loạt | `Mass Delete`, `Select All`, chọn nhiều bản ghi rồi xoá |
| Steps gọi trực tiếp URL phá huỷ | `/admin/clients/delete/{id}` trên thanh địa chỉ |
| Steps tải lên tệp thực thi | `.exe`, `.sh`, `.bat` |
| Steps sinh **khối lượng** dữ liệu lớn | import hàng trăm dòng, tạo hàng loạt bản ghi bằng vòng lặp |

> ⚠️ Nhập **một chuỗi dài vào một field** (VD 256 ký tự vào ô max 255) **KHÔNG** phải dấu hiệu nguy hiểm — đó là TC giá trị biên (BVA `max+1`), chỉ tạo tối đa một bản ghi và được dọn như mọi dữ liệu khác. Bỏ qua nó là rụng cả lớp kiểm tra biên mà không ai biết.

Ghi vào report: `⏭️ SKIPPED — thao tác phá huỷ trên môi trường dùng chung, cần chạy tay có giám sát`.

> Môi trường **test riêng** → tester khai báo lúc bắt đầu, agent tắt quy tắc này và ghi rõ trong header report.

---

## TC đặc biệt — cách chạy và chấm

| Loại TC | Cách chạy | Cách chấm |
|---|---|---|
| **Độ hạt GỘP — Bảng biến thể** (Kiểu A, mã `a`, `b`, `c`…) | Chạy **từng biến thể**, cùng chuỗi steps, đổi giá trị theo bảng | PASS khi **mọi** biến thể PASS. Biến thể lệch → TC `FAIL`, cột `Bước fail` ghi `<số bước> · biến thể <mã>`, chi tiết FAIL ghi mã đầy đủ `<TC ID>-<mã>` (VD `CRM_LOGIN_TC_012-c`) ở dòng `Bước fail`. Heading `### FAIL #n — <TC ID> · <kịch bản>` giữ **TC ID trần** — `scripts/execution-viewer` nối chi tiết FAIL với bảng kết quả theo TC ID. Nhiều biến thể fail → liệt kê đủ trong dòng `Bước fail` |
| **Độ hạt GỘP — Bảng kiểm** (Kiểu B, mục `1`, `2`, `3`…) | Đối chiếu từng mục trên cùng màn hình | PASS khi mọi mục đạt. Mục lệch → ghi số mục + REQ của mục đó |
| **`@TechCheck`** — có dòng `🔧 Ghi chú kỹ thuật (cần DevTools):` | Chấm phần TC chính như bình thường. Phần 🔧: agent kiểm **nếu làm được** bằng công cụ đang có (`browser_evaluate`, `browser_network_requests`, xem cookie) | Phần chính quyết định PASS/FAIL. Phần 🔧 kiểm được mà lệch → `FAIL`. Không kiểm được → vẫn chấm theo phần chính, cột Ghi chú ghi `🔧 chưa kiểm — <lý do>`. 🔒 Ghi **hình thái**, không chép giá trị cookie/token thật vào report |
| **`@NeedsVerify`** — Expected ghi `⚠️ chưa có evidence` | Chạy bình thường, **ghi lại nguyên văn** điều quan sát được ở chỗ chưa có evidence | Khớp Expected → `PASS`, ghi chú *"đã xác nhận trên UI — đề nghị gỡ `@NeedsVerify`"*. Lệch → `FAIL` kèm ghi chú *"Expected chưa có evidence — đối chiếu lại TC trước khi báo bug"*; mục Đề xuất trỏ `/review-testcases`, **không** trỏ thẳng `/create-bug-report` |
| **Mục checklist** (nguồn `checklist_*.md`) | Mỗi mục `#` là một đơn vị chạy — thao tác theo cột `Hạng mục kiểm tra`, đối chiếu cột `Kết quả kỳ vọng` | Xem mục **Chạy checklist** ngay dưới. Kết quả ghi vào execution report; chạy xong cập nhật **đúng hai cột** `Trạng thái` · `Execution ID` của checklist (luật 5). Bảng ký nhận của checklist do người chịu trách nhiệm tự điền |

### Chạy checklist — 5 luật để kết quả nối được về sau

| # | Luật | Vì sao |
|---|---|---|
| 1 | Cột `TC ID` của report ghi **mã mục** `<Mã checklist>-<nn>` (VD `CL-smoke_20261009-03`) — lấy `Mã checklist` ở header checklist; checklist cũ không có dòng đó thì tự ghép `CL-` + phần tên file sau `checklist_`. **Cấm** ghi `#3` trần | `#3` trùng giữa mọi checklist — viewer, RTM và báo cáo tổng hợp sẽ nối nhầm mục của hai checklist khác nhau |
| 2 | Header ghi `Loại nguồn` = `Checklist <loại>` + `Mã checklist`; bảng kết quả thêm 3 cột `Priority` · `REQ ID` · `TC ID liên quan` chép từ checklist | Báo cáo tổng hợp phân loại lần chạy theo `Loại nguồn` — thiếu là lần chạy smoke 12 mục bị coi như lần chạy bộ TC và thay số của cả module |
| 3 | **Checklist Release-readiness** (`docs/checklists/_release/<nền-tảng>/`): report ghi vào `docs/executions/_release/<nền-tảng>/<run_id>/`, bảng kết quả thêm cột **`Module`** chép từ checklist | Một lần chạy trải nhiều module — `_release` là module giả, cột `Module` quy từng mục về đúng module cho bug và báo cáo tổng hợp |
| 4 | Mục checklist FAIL → bug đặt ở `docs/bugs/<module của mục>/<nền-tảng>/`, trỏ về `TC ID liên quan` (nếu có) **và** mã mục | Bug phải trỏ về TC đang có hiệu lực; mục REQ-based không có TC thì mã mục + REQ ID là neo duy nhất |
| 5 | Xuất report xong → mở lại file checklist, với **mọi mục đã chạy** ghi `Trạng thái` = nhãn kết quả (`✅ PASS` · `❌ FAIL` · `⚠️ BLOCKED` · `⏭️ SKIPPED`) và `Execution ID` = `[<run_id>](../../../executions/<module>/<nền-tảng>/<run_id>/execution_report.md)<br><sub>DD-MM-YYYY</sub>`; sửa dòng header `Trạng thái lấy từ:` sang lần chạy này. **Không** đụng cột khác, không đụng bảng ký nhận. Mục không chạy giữ nguyên giá trị cũ | Người mở checklist thấy ngay mục nào đã đạt, mục nào còn phải chạy, và bấm sang được report làm bằng chứng. Ghi đè cột khác là làm checklist lệch khỏi phiên bản đã được dùng để chạy |

---

## Quy tắc Fail-Forward

Khi một TC FAIL:

1. **Chụp screenshot ngay tại bước fail** (không chụp sau khi đã điều hướng đi nơi khác)
2. Ghi lại: bước số mấy, Expected là gì, Actual quan sát được là gì
3. Khôi phục trạng thái sạch (đóng modal, quay về trang danh sách) rồi **chạy tiếp TC sau**
4. **KHÔNG** dừng cả buổi chạy chỉ vì 1 TC fail

**Ngoại lệ — dừng và báo user ngay:**

| Điều kiện dừng | Vì sao |
|---|---|
| 3 TC liên tiếp FAIL cùng một nguyên nhân hạ tầng | Đăng nhập hỏng, server 500, mất mạng — chạy tiếp chỉ tạo báo cáo rác |
| Không đăng nhập được ngay từ đầu | Toàn bộ suite không chạy được |
| Phát hiện thao tác của mình đã ảnh hưởng dữ liệu người khác | Ưu tiên dừng và khắc phục |

---

## Quản lý Test Data & Cleanup (BẮT BUỘC)

- Mọi dữ liệu tạo ra phải **traceable**: `Auto_<Module>_<timestamp>`, `auto_<loại>_<timestamp>@auto.test`
- Agent **ghi sổ** mọi bản ghi đã tạo trong lúc chạy (tên + ID + nơi tạo)
- Cuối buổi chạy: **dọn sạch** toàn bộ dữ liệu đã tạo
- Report **bắt buộc** có mục "Dữ liệu đã tạo & dọn dẹp" — bản nào chưa xoá được phải ghi rõ để người khác xử lý

> Không bao giờ tạo dữ liệu mà không có kế hoạch xoá tương ứng.

---

## Evidence (Screenshot)

| Tình huống | Chụp? |
|---|---|
| TC FAIL | ✅ **Bắt buộc** — chụp ngay tại bước fail |
| Milestone quan trọng (tạo bản ghi thành công, hoàn tất luồng chính) | ✅ Nên chụp |
| Mỗi bước của mọi TC | ❌ **KHÔNG** — chụp tràn lan làm report nặng và khó đọc |

Lưu tại: `docs/executions/<module>/<nền-tảng>/<run_id>/evidence/<TC_ID>_<mô_tả>.png` — chạy checklist thì `<TC_ID>` là mã mục (`CL-smoke_20261009-03_<mô_tả>.png`); checklist release thì `<module>` là `_release`

---

## Video quay màn hình (mặc định BẬT)

Mỗi TC đã chạy có **một video** quay toàn bộ thao tác — ảnh chụp chỉ chứng minh trạng thái cuối, video chứng minh **đường đi tới đó** (dev xem lại đúng thao tác gây lỗi, không phải đoán từ Steps).

```
docs/executions/<module>/<nền-tảng>/<run_id>/      (retest: retest_<timestamp>/)
├── execution_report.md
├── evidence/<TC_ID>_<mô_tả>.png
└── video/<TC_ID>.webm                ← NGANG CẤP với evidence/
```

### Bật / tắt — input `Quay video` của từng lần chạy

| Giá trị | Khi nào chọn | Làm gì |
|---|---|---|
| **`Có`** (mặc định) | Mọi lần chạy, trừ khi user nói khác | Quay mọi TC đã chạy, giữ hết |
| **`Chỉ giữ FAIL`** | Bộ TC lớn, chỉ cần video cho chỗ lỗi — tiết kiệm dung lượng repo | Vẫn **quay mọi TC** (chưa chạy thì chưa biết TC có fail không), chấm xong TC `✅ PASS` thì **xoá ngay** file video của TC đó; giữ `❌ FAIL` và `⚠️ BLOCKED`. Cột `Video` của TC PASS ghi `—` |
| **`Không`** | User nói *"không quay video"*, *"tắt video"*, *"không cần video"*… | Bỏ hết bước quay, **không** tạo thư mục `video/`, **không** thêm cột `Video` / dòng `Video` vào report |

- Lấy theo **lời user ở lần chạy đó** — không nhớ sang lần chạy sau; lần sau không nói thì lại `Có`
- Header report **luôn** có ô `Video` ghi đúng giá trị đã dùng: `Có — 1 video/TC tại video/ (WebM 1600×750)` · `Chỉ giữ FAIL/BLOCKED — đã xoá video TC PASS` · `Không — tắt theo yêu cầu user`. Người đọc report thấy không có video thì biết là **cố ý**, không phải quên
- Đổi ý giữa buổi (*"từ giờ tắt video"*) → áp từ TC kế tiếp, ghi vào header `Có (TC_001 → TC_012), Không từ TC_013`

**Công cụ:** `browser_start_video` · `browser_video_chapter` · `browser_stop_video` của Playwright MCP — chỉ có khi `.claude/playwright-mcp-config.json` khai `"capabilities": ["devtools"]` (đã bật sẵn, không cần tắt — tool chỉ chạy khi được gọi). `Quay video` khác `Không` mà không thấy các tool này → config chưa nạp: **dừng, báo user khởi động lại Claude Code** hoặc chạy với `Quay video: Không`. User chọn chạy không video thì header ghi `Video | Không — chưa nạp tool quay (<lý do>)`, không lặng lẽ bỏ.

| Bước | Làm gì |
|---|---|
| 1. Đăng nhập **trước**, ngoài video | Bước đăng nhập đầu buổi **không** quay — mật khẩu không bao giờ vào video |
| 2. Bắt đầu TC | `browser_start_video` · `filename` = `docs/executions/<module>/<nền-tảng>/<run_id>/video/<TC_ID>.webm` (tương đối, tính từ gốc project — thư mục tự tạo) · `size` = viewport đang chạy (`{width:1600,height:750}` theo `--viewport-size`) — để nguyên khổ, chữ trên video mới đọc được |
| 3. Thẻ mở đầu | `browser_video_chapter` · `title` = `<TC_ID>` · `description` = Test Scenario · `duration` = `1500` — người xem biết video thuộc TC nào. TC gộp: thêm một thẻ cho **mỗi biến thể** (`title` = `<TC ID>-<mã>`) |
| 4. Chạy TC | Dựng Pre-Condition → các bước → verify như bình thường. FAIL thì chụp ảnh **trong lúc vẫn đang quay** |
| 5. Dừng | `browser_stop_video` **sau khi chấm trạng thái, trước khi khôi phục trạng thái sạch** — phần dọn dẹp không thuộc TC |
| 6. Kiểm file | Video **đầu tiên** của buổi: kiểm file có thật ở đúng `video/` của run. Không thấy → MCP đang chạy ở thư mục project khác (`filename` tương đối bị tính từ gốc project đó): dừng, báo user khởi động lại Claude Code để server `playwright` của `.mcp.json` dự án này chạy — **không** chép tay file từ project khác về |

| Tình huống | Xử lý |
|---|---|
| ⏭️ SKIPPED | Không quay — TC không chạy |
| ⚠️ BLOCKED | Có quay — video là bằng chứng vì sao không dựng được Pre-Condition |
| TC mở tab mới | MCP tự quay tab đó ra file thứ hai `<TC_ID>-1.webm` — ghi **đủ** các file vào report |
| `browser_start_video` báo *"Browser is already in use … use --isolated"* trong khi `browser_navigate` vẫn chạy | Máy đang chạy **2 server Playwright MCP cùng tên `playwright`** — server global (cấu hình Claude Desktop) giữ Chrome, tool quay video lại do server project xử lý nên nó mở thêm Chrome trên cùng profile và bị khoá. **Quay dự phòng trên đúng trang đang chạy** bằng `browser_run_code_unsafe` — cùng API mà tool quay video dùng, đường dẫn **tuyệt đối**: `async (page) => { await page.screencast.start({ path: '<gốc project>/docs/executions/…/video/<TC_ID>.webm', size: { width: 1600, height: 750 } }); await page.screencast.showChapter('<TC_ID>', { description: '<Test Scenario>', duration: 1500 }); }` · dừng: `await page.screencast.stop()`. Cách này chỉ quay đúng trang đó — tab khác không vào video. Ghi lý do vào ô `Video` ở header, mục Đề xuất nhắc user thêm `"capabilities": ["devtools"]` vào file cấu hình Playwright của server global (hoặc gỡ server global) rồi khởi động lại |
| Bước làm lộ giá trị bí mật **dạng rõ** (bật "hiện mật khẩu" với mật khẩu thật, trang hiện token / API key) | `browser_stop_video` trước bước đó, làm bước, rồi quay tiếp sang `<TC_ID>_p2.webm`; cột Ghi chú ghi *"video tạm dừng ở bước n — lộ bí mật"*. Ô mật khẩu đang che `•••` thì cứ quay |
| Chạy checklist | `<TC_ID>` là mã mục: `video/CL-smoke_20261009-03.webm` |

**Ghi vào report:**

- Header: `| Video | Có — 1 video/TC tại video/ (WebM 1600×750) |`
- Bảng mục 2: thêm cột **cuối** `Video` = `[▶](video/<TC_ID>.webm)` (nhiều file thì `[▶](…) · [▶ tab 2](video/<TC_ID>-1.webm)`) · TC SKIPPED ghi `—`. `scripts/execution-viewer` đọc bảng theo **tên cột**, cột thêm vào không làm hỏng việc đọc
- Chi tiết FAIL / REG: thêm dòng `| Video | <video src="video/<TC_ID>.webm" title="<TC_ID> — <mô tả chỗ fail>" controls></video> |` ngay dưới dòng `Evidence` — người đọc HTML xem được tại chỗ

> 🔒 Video ghi lại **mọi thứ** hiện trên màn hình — trên môi trường dùng chung là cả dữ liệu khách hàng của người khác, và **không** che được sau khi quay như ảnh. Cùng quy tắc với ảnh evidence: không đưa lên repo công khai. Chỉ mở trang danh sách nhiều dữ liệu khi TC thật sự cần.

---

## Xuất report sang HTML (khi user yêu cầu)

User bảo *"xuất HTML"*, *"chuyển MD sang HTML"*, *"gửi file HTML"*… cho `execution_report.md` / `retest_report.md` / bug report → **luôn** nhúng ảnh + video vào một file duy nhất, đặt **cạnh** file `.md`:

```bash
python scripts/user-guide/md2html.py docs/executions/<module>/<nền-tảng>/<run_id>/execution_report.md docs/executions/<module>/<nền-tảng>/<run_id>/execution_report.html --standalone
```

- `--standalone` nhúng mọi ảnh (cả link `[ảnh](evidence/x.png)` lẫn `![](…)`) và mọi video (`<video>` lẫn link `[▶](video/x.webm)`) — gửi riêng file HTML là xem được hết, không cần kèm thư mục `evidence/` `video/`
- Trong bảng: ảnh thu nhỏ (bấm phóng to) và trình phát nhỏ · ngoài bảng: khổ đầy đủ
- Video lớn hơn `--max-video-mb` (mặc định 50) **không** nhúng, chỉ giữ link + in cảnh báo → báo user con số, hỏi nâng ngưỡng hay gửi kèm thư mục `video/`
- Script in `⚠️ không thấy file:` → link trong report đang gãy: sửa report, xuất lại — **không** gửi HTML có ảnh/video trống
- WebM xem được trên Chrome · Edge · Firefox; **Safari không phát WebM** — người nhận dùng Safari thì đổi sang MP4 trước (`scripts/user-guide/webm2mp4.py <thư mục video> --keep`, sửa đuôi link trong report thành `.mp4`) rồi mới xuất

---

## Quy trình thực thi

1. **Xác nhận phạm vi & môi trường** — đọc file TC, lọc TC theo phạm vi user chọn, đếm số TC sẽ chạy, công bố kế hoạch
2. **Chuẩn bị:** tạo `run_id` (`run_<timestamp>`), tạo thư mục `evidence/` và — khi `Quay video` ≠ `Không` — `video/` (ngang cấp), khởi tạo file report
3. **Đăng nhập & khởi tạo môi trường:** navigate → wait_for(page_load) → đăng nhập → verify vào được hệ thống. Không vào được → dừng ngay, báo user
4. **Chạy từng TC theo thứ tự:**
   - Kiểm tra quy tắc Auto-Skip → khớp thì `SKIPPED`, sang TC tiếp (không quay video)
   - `Quay video` ≠ `Không`: `browser_start_video` → `video/<TC_ID>.webm` + thẻ `browser_video_chapter` (mục **Video quay màn hình**)
   - Đọc Pre-Condition → dựng điều kiện; không dựng được → `BLOCKED`. Pre-Condition ghi *"trình duyệt sạch"* / *"chưa đăng nhập"* / *"cửa sổ ẩn danh"* → **xoá cookie** (`page.context().clearCookies()`) trước khi chạy — phiên của TC trước còn nhớ URL vừa ghé, sẽ đổi chỗ trang chuyển tới sau đăng nhập và làm TC fail giả. Lượt chạy bị ảnh hưởng giữ làm bằng chứng (`<TC_ID>_lan1_<lý_do>.webm`), ghi vào mục Đề xuất như **phát hiện ngoài TC**
   - Thực hiện **đúng từng bước** trong Test Steps, không tự thêm/bớt bước
   - Sau mỗi bước có Expected tương ứng: `snapshot` để verify
   - Đối chiếu **toàn bộ** Expected Result → chấm trạng thái
   - FAIL → screenshot + ghi Actual
   - `browser_stop_video` (`Chỉ giữ FAIL`: TC PASS thì xoá video vừa quay) → khôi phục trạng thái sạch → tiếp
   - Ghi kết quả vào report **ngay sau mỗi TC** (không dồn tới cuối — mất điện là mất hết)
5. **Cập nhật tiến độ** sau mỗi 5–10 TC: `Đã chạy 12/36 — PASS 10 · FAIL 1 · BLOCKED 0 · SKIPPED 1`
6. **Teardown:** xoá toàn bộ dữ liệu đã tạo, đối chiếu số liệu hệ thống trước/sau
7. **Xuất execution report** hoàn chỉnh + đề xuất bước tiếp theo

---

## Output — Execution Report

File: `docs/executions/<module>/<nền-tảng>/<run_id>/execution_report.md` — checklist Release-readiness: `docs/executions/_release/<nền-tảng>/<run_id>/execution_report.md`

```markdown
# Execution Report — <Module> · <Loại chạy>

| Thông tin | Nội dung |
|---|---|
| Run ID | run_1785700456 |
| Nền tảng | `web` — một lần chạy thuộc đúng một nền tảng, quyết định thư mục `docs/executions/<module>/<nền-tảng>/` |
| Loại nguồn | `Bộ TC` — hoặc `Checklist <loại>` · `<Mã checklist>` (VD `Checklist smoke · CL-smoke_20261009`). Báo cáo tổng hợp dựa vào ô này để **không** cộng kết quả checklist vào pass rate của bộ TC |
| Nguồn TC | docs/testcases/customers/web/parts/part_01_web_danh_sach.md |
| Phạm vi | 36 TC (toàn bộ Part 1) · loại 2 TC `@Deprecated` |
| Môi trường | `<URL môi trường test>` — `<Staging/UAT/Production>` |
| Build / Version | (nếu có) |
| Tài khoản | `<tài khoản test>` (`<role>`) |
| Người thực hiện | <tên tester> (agent hỗ trợ) |
| Bắt đầu → Kết thúc | 02-08-2026 09:15 → 10:40 (85 phút) |
| Môi trường dùng chung? | Có — auto-skip TC phá huỷ đang BẬT |
| Video | Có — 1 video/TC tại `video/` (WebM 1600×750) |

## 1. Tổng kết

| Trạng thái | Số lượng | Tỷ lệ |
|---|---|---|
| ✅ PASS | 30 | 83.3% |
| ❌ FAIL | 3 | 8.3% |
| ⚠️ BLOCKED | 1 | 2.8% |
| ⏭️ SKIPPED | 2 | 5.6% |
| **Tổng** | **36** | 100% |

> **Pass rate (không tính SKIPPED):** 30/34 = 88.2%

## 2. Kết quả từng TC

| TC ID | Test Scenario | Kết quả | Bước fail | Ghi chú | Video |
|---|---|---|---|---|---|
| CRM_CUST_TC_001 | Bảng hiển thị đủ 9 cột | ✅ PASS | — | — | [▶](video/CRM_CUST_TC_001.webm) |
| CRM_CUST_TC_011 | Search chuỗi SQL injection | ❌ FAIL | 4 · biến thể `b` | Xem chi tiết #1 | [▶](video/CRM_CUST_TC_011.webm) |
| CRM_CUST_TC_030 | Modal Bulk Actions | ⏭️ SKIPPED | — | Thao tác phá huỷ, môi trường dùng chung | — |

> **Lần chạy checklist** — bảng mục 2 đổi thành (cột `Module` chỉ có ở checklist Release-readiness):
>
> | TC ID | Hạng mục kiểm tra | Module | Kết quả | Priority | REQ ID | TC ID liên quan | Ghi chú | Video |
> |---|---|---|---|---|---|---|---|---|
> | CL-release_release_2.0-03 | Tạo KH mới đủ field bắt buộc | customers | ✅ PASS | P1 | REQ-CUST-02 | CRM_CUST_TC_005 | — | [▶](video/CL-release_release_2.0-03.webm) |
>
> Heading chi tiết FAIL giữ mẫu `### FAIL #n — <mã mục> · <hạng mục>`.

## 3. Chi tiết TC FAIL

### FAIL #1 — CRM_CUST_TC_011 · Search chuỗi SQL injection

| | |
|---|---|
| REQ ID | REQ-CUST-04 |
| Priority | High |
| Bước fail | Bước 4 · biến thể `b` (`' OR 1=1--`) — biến thể `a`, `c` PASS |
| **Expected** | Bảng hiển thị trạng thái "không có kết quả", trang không báo lỗi |
| **Actual** | Trang hiện thông báo lỗi cơ sở dữ liệu, bảng không hiển thị |
| 🔧 Ghi chú kỹ thuật | Tab Network: request tìm kiếm trả mã `500` |
| Evidence | ![](evidence/CRM_CUST_TC_011_step4_error500.png) |
| Video | <video src="video/CRM_CUST_TC_011.webm" title="CRM_CUST_TC_011 — biến thể b, lỗi ở bước 4" controls></video> |
| Tái hiện được? | Có — thử lại 2 lần đều lỗi |

## 4. TC BLOCKED

| TC ID | Nguyên nhân chặn | Cần gì để chạy được |
|---|---|---|

## 5. Dữ liệu đã tạo & dọn dẹp

| Dữ liệu | ID | Nơi tạo | Đã xoá? |
|---|---|---|---|
| Auto_Customer_1785700456 | 12130 | /admin/clients | ✅ |

> Đối chiếu số liệu hệ thống: `Total Customers` trước 1431 → sau 1431 ✅ môi trường trả về nguyên trạng.

## 6. Đề xuất bước tiếp theo

- FAIL #1 (High) → sinh bug report bằng `/create-bug-report`
- 2 TC SKIPPED cần chạy tay có giám sát trên môi trường riêng
```

---

## Anti-Patterns (NGHIÊM CẤM)

- ❌ Chấm PASS khi **chưa verify hết** các Expected Result đánh số
- ❌ Suy đoán kết quả ("chắc là đúng") mà không snapshot quan sát thực tế
- ❌ **Sửa nội dung TC cho khớp hành vi thực tế** — lệch thì ghi FAIL, TC chỉ được sửa qua `/review-testcases`
- ❌ Tự thêm/bớt bước so với Test Steps rồi vẫn chấm PASS
- ❌ Thực thi TC có thao tác phá huỷ trên môi trường dùng chung
- ❌ Tạo dữ liệu test mà không dọn, hoặc dọn nhầm dữ liệu người khác
- ❌ Dừng cả buổi chạy chỉ vì 1 TC fail (trừ 3 điều kiện dừng đã nêu)
- ❌ Chụp screenshot mọi bước của mọi TC → report nặng, khó đọc
- ❌ Bỏ quay video khi user không yêu cầu tắt, hoặc tắt mà không ghi ô `Video` ở header — người đọc không biết thiếu video là cố ý hay quên
- ❌ Quay cả bước đăng nhập gõ mật khẩu — đăng nhập đầu buổi luôn nằm **ngoài** video
- ❌ Đặt video ngoài `<run_id>/video/` (vào `evidence/`, `.playwright-mcp/`, thư mục project khác) — report trỏ link tương đối, HTML xuất ra sẽ thiếu video
- ❌ Xuất report sang HTML mà không `--standalone` — người nhận mở ra thấy ảnh/video trống
- ❌ Dồn ghi kết quả tới cuối buổi thay vì ghi ngay sau mỗi TC
- ❌ Báo cáo pass rate mà tính cả SKIPPED vào mẫu số (làm đẹp số liệu sai lệch)
- ❌ Chạy TC `@Deprecated`, hoặc đếm nó vào SKIPPED
- ❌ Tự bỏ qua TC giá trị biên vì "chuỗi dài" — chuỗi dài vào một field không phải thao tác phá huỷ
- ❌ TC gộp FAIL mà không ghi **mã biến thể** — người sửa không biết case nào hỏng
- ❌ TC `@NeedsVerify` lệch Expected rồi đề xuất báo bug ngay — Expected chưa có evidence, phải đối chiếu lại TC trước
- ❌ Bỏ qua mục "Dữ liệu đã tạo & dọn dẹp" trong report
- ❌ Chạy checklist mà ghi `#3` trần ở cột `TC ID`, hoặc bỏ trống ô `Loại nguồn` — kết quả checklist sẽ bị nối nhầm và cộng lẫn vào số của bộ TC
