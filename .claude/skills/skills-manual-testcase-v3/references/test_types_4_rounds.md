## Bản Đồ Loại Kiểm Thử — 4 Vòng (BẮT BUỘC — khung sinh TC cho QUICK · FULL RBT · DELTA)

> Hai bảng checklist ngay bên dưới (Field-Level 15 loại · Component-Level) trả lời *"trường này / thành phần này phải test gì"*. Bảng này trả lời câu **khác hẳn**: ***"bộ TC đã đi qua đủ các LOẠI kiểm thử chưa, và theo thứ tự nào"*** — chống bỏ sót nguyên một lớp test. Lớp hay bị mất nhất: **giao diện ở Vòng 1**, vì phần validation vẫn đủ nên nhìn qua tưởng bộ TC đã kín.
>
> **Phân biệt với bảng ISO/IEC 25010 ở cuối skill:** 4 vòng là **khung tác nghiệp lúc sinh** — chia batch, đặt thứ tự, chấm thiếu-đủ theo nhánh. ISO 25010 là **khung rà soát lúc xuất** — đặc tính nào ngoài phạm vi, ai chịu trách nhiệm, nuôi mục 2.2 của Master Test Plan. Chạy **cả hai**, không cái nào thay được cái nào.

### Thứ tự bắt buộc

```
VÒNG 1 – SMOKE            → màn hình dựng được, luồng sống còn không vỡ
VÒNG 2 – FUNCTIONAL       → phần thân của mọi bộ TC (~60–70% số TC)
VÒNG 3 – TECHNICAL        → phần lớn cần DevTools/DB → tag @TechCheck
VÒNG 4 – NON-FUNCTIONAL   → phần lớn chấm ➖ ở app nghiệp vụ thường
```

Sinh **tuần tự V1 → V4**, không nhảy cóc. Lý do không phải hình thức: Vòng 1 fail thì **mọi TC Vòng 2 đều BLOCKED** — biết trong 10 phút đầu để dừng, thay vì chạy hết 40 TC rồi mới phát hiện form không mở được.

---

### VÒNG 1 — SMOKE

| Nhánh | Kích hoạt khi | TC phải có | Trỏ về |
|---|---|---|---|
| **UI cơ bản** | **Luôn luôn** | Màn hình hiển thị **đủ** thành phần theo evidence: nhãn nguyên văn, thứ tự field, nút, liên kết, tiêu đề. Trạng thái mặc định từng ô (rỗng / tick sẵn / option đang chọn / con trỏ đang ở đâu) | Gộp **Kiểu B** · 4 nhóm evidence bắt buộc |
| **Open form** | Có form / modal / trang con | Mở được bằng **mọi lối vào** (nút, menu, URL trực tiếp) · đóng được bằng X / Cancel / ESC / click ra ngoài | Component-Level → Modal/Dialog |
| **Display** | Có dữ liệu hiển thị | Định dạng hiển thị đúng (tiền tệ, ngày, giờ, badge, avatar) · trạng thái rỗng · trạng thái đang tải | 4 nhóm evidence bắt buộc |
| **Input valid data** | Có form nhập | Bộ dữ liệu hợp lệ **tối thiểu** (chỉ field bắt buộc) và bộ **đầy đủ** (mọi field) | Quy tắc Test Data |
| **Save** | Có hành động lưu | Lưu thành công → thông báo đúng → điều hướng đúng | Component-Level → CRUD |
| **Verify data** | Có lưu | Dữ liệu vừa lưu hiện đúng ở **danh sách** *và* ở **màn hình chi tiết** | Component-Level → CRUD |

> 🚨 **Nhánh `UI cơ bản` là chỗ bị bỏ sót nhiều nhất.** Bộ TC không có TC nào kiểm nhãn / thứ tự / trạng thái mặc định của màn hình là **thiếu hẳn một lớp**, dù phần validation đầy đủ đến đâu. Nhánh này **KHÔNG BAO GIỜ** được chấm `➖`.

---

### VÒNG 2 — FUNCTIONAL

| Nhánh | Kích hoạt khi | TC phải có | Trỏ về |
|---|---|---|---|
| **UI Behavior** | Có tương tác làm đổi giao diện | Field bật/tắt theo lựa chọn khác · nút khoá đến khi đủ điều kiện · bộ đếm ký tự · gợi ý autocomplete · nút hiện/ẩn mật khẩu | Quy Tắc Đối Chiếu Evidence mục 6 (disabled ≠ không tick) |
| **Required** | Có field bắt buộc | Bỏ trống **TỪNG** field bắt buộc → thông báo trỏ đúng field đó · bỏ trống tất cả | Bảng Field-Level |
| **Validation** | Mọi field có ràng buộc | Đối soát **đủ từng mục** của loại field tương ứng trong bảng 15 loại — mục bỏ qua phải ghi lý do | Bảng Field-Level |
| **Equivalence Partitioning** | Field có miền giá trị phân nhóm được | Mỗi partition ≥1 TC | Quy Tắc Bắt Buộc Áp Dụng Kỹ Thuật |
| **Boundary Value Analysis** | Field có min/max | `min-1` · `min` · `max` · `max+1` | nt |
| **Business Rule** | Có quy tắc nghiệp vụ | Mỗi rule ≥1 TC tuân thủ + ≥1 TC vi phạm (verify bị chặn) | nt |
| **Decision Table** | ≥3 điều kiện kết hợp → 1 output | Mỗi rule (cột) = 1 TC | nt |
| **State Transition** | Entity có ≥3 trạng thái | Mọi transition hợp lệ + mọi transition **bị chặn** | nt · Component-Level → Status Flow |
| **Dependency** | Field / màn hình phụ thuộc nhau | Đổi A → B đổi theo · xoá A đang được B tham chiếu · A rỗng thì B khoá | Component-Level → CRUD (khoá ngoại) |
| **Use Case / Scenario** | Có luồng nghiệp vụ nhiều bước | Chuỗi end-to-end **trong phạm vi module** (tạo → sửa → đổi trạng thái → tìm lại) | — |
| **Save / Edit / Delete** | Có CRUD | Toàn bộ CRUD Lifecycle, gồm huỷ giữa chừng và xoá bản ghi đang được liên kết | Component-Level → CRUD |
| **Error Guessing** | **Luôn luôn** | Bấm Lưu hai lần liên tiếp · dán dữ liệu lạ · bấm Back sau khi lưu · nạp lại trang giữa chừng · mở 2 tab cùng sửa | Scenarios Chuyên Sâu |

> `Positive` / `Negative` **KHÔNG phải nhánh riêng** — chúng là thuộc tính của mọi nhánh bên trên. Chấm ở mức bộ TC (Gate #4), **không** tạo batch riêng, **không** tạo dòng riêng trong bảng đối soát.

---

### VÒNG 3 — TECHNICAL

> ⚠️ Đa số nhánh vòng này **không kiểm được bằng mắt** → nội dung phải nằm dưới `🔧 Ghi chú kỹ thuật (cần DevTools):` và TC mang tag `@TechCheck` theo **Quy Tắc Ngôn Ngữ Kiểm Chứng**. Viết mã HTTP / câu SQL / tên bảng vào phần TC chính là **vi phạm Gate #8**.

> 🔑 **Bốn nhánh `API` · `Database` · `Integration` · `Logging/Audit` là thuộc tính CẤP DỰ ÁN, không phải cấp module.** QA có quyền gọi API hay không thì mọi module đều giống nhau — hỏi lại ở từng module là bắt user trả lời cùng một câu hàng chục lần.
>
> **Thứ tự bắt buộc:**
> 1. **Đọc `docs/requirements/README.md`** → bảng thuộc tính ở đầu file, dòng **`Năng lực kiểm thử của QA`**. Có sẵn thì **dùng luôn, KHÔNG hỏi lại** — chép nguyên lý do và người chịu trách nhiệm vào bảng đối soát 4 vòng
> 2. Chưa có dòng đó (dự án cũ, hoặc `/discover-system` chạy trước khi có luật này) → hỏi user **đúng một lần**, rồi **ghi ngay vào `docs/requirements/README.md`** trước khi sinh dòng TC đầu tiên
> 3. Trả lời của user **có thể kiểm chứng được** thì kiểm luôn thay vì tin lời: mở đúng trang nhật ký hoạt động của hệ thống, thử gọi một API đọc. Ghi **kết quả đo** kèm ngày vào README — nó chính xác hơn câu trả lời từ trí nhớ
>
> Mẫu dòng ghi vào bảng thuộc tính của `docs/requirements/README.md`:
>
> ```markdown
> | **Năng lực kiểm thử của QA** | Chốt <ngày> — dùng cho nhánh Vòng 3 của **mọi** bộ TC:<br>• Gọi API: ❌/✅ + ai chịu nếu ❌<br>• Truy vấn CSDL: ❌/✅ + ai chịu<br>• Kiểm tầng tích hợp: ❌/✅ + ai chịu<br>• Xem nhật ký hoạt động: ❌/✅ + đường dẫn đã thử + kết quả đo<br>• DevTools trình duyệt: ❌/✅ |
> ```
>
> Dòng này đổi khi **quyền của QA đổi** (được cấp tài khoản mới, mở quyền DB), không đổi theo module. Đổi thì cập nhật README và ghi vào Nhật ký danh mục — các bộ TC đã sinh có nhánh `➖` vì lý do cũ cần rà lại.

| Nhánh | Kích hoạt khi | TC phải có | Mặc định nếu không áp dụng |
|---|---|---|---|
| **Permission** | Có ≥2 role | Ma trận Phân quyền: mỗi role × mỗi hành động · truy cập URL trực tiếp khi không đủ quyền · phần tử ẩn/khoá đúng theo role | 🚫 **Không được `➖`** khi hệ thống có ≥2 role |
| **Security** | Luôn (mức cơ bản) | Truy cập khi chưa đăng nhập · dữ liệu người này có lộ sang người kia không · XSS/SQLi ở field text · phiên sau khi đăng xuất · nút Back sau đăng xuất | `➖` chỉ khi có đội security riêng — **bắt buộc ghi tên đội** |
| **API** | QA được phép gọi API | Mã trạng thái theo từng thao tác · gọi thẳng API bỏ qua UI · gọi thiếu/sai token | `➖` ghi *"QA không có quyền gọi API"* |
| **Database** | QA được phép truy vấn DB | Dữ liệu lưu đúng bảng/đúng kiểu · xoá mềm hay xoá cứng · dữ liệu rác còn lại sau khi huỷ giữa chừng | `➖` ghi *"không có quyền truy cập DB — đội Dev xác minh"* |
| **Integration** | Có tích hợp bên thứ ba | Bên thứ ba trả lỗi / quá hạn chờ / không phản hồi → app xử lý ra sao | `➖` ghi rõ hệ thống nào không kiểm |
| **Logging / Audit** | Có yêu cầu nhật ký thao tác | Thao tác quan trọng có ghi nhật ký (ai · lúc nào · đổi gì) · nhật ký không lộ dữ liệu nhạy cảm | `➖` ghi *"requirements không có yêu cầu audit"* |

---

### VÒNG 4 — NON-FUNCTIONAL & REGRESSION

> Ở app nghiệp vụ thông thường, **phần lớn vòng này chấm `➖` là kết quả ĐÚNG** — không phải thiếu sót. Nhưng `➖` phải **ghi ai chịu trách nhiệm**; ô `➖` ở đây chính là nguồn cho mục **2.2 Ngoài phạm vi** của `/generate-master-test-plan`. Đó là khác biệt giữa *"QA quên test"* và *"đã xem xét và thống nhất không test"*.

| Nhánh | Kích hoạt khi | TC phải có | Ghi chú |
|---|---|---|---|
| **Compatibility** | Có cam kết đa trình duyệt | Danh sách trình duyệt/phiên bản **đã chốt** × luồng chính | Ghi rõ trình duyệt nào **không** kiểm |
| **Responsive / UI Stability** | App có bản web đáp ứng | Các breakpoint **đã chốt** (VD 1920 · 1366 · 768 · 375) · không tràn ngang · không đè chữ · phóng to 125% | Phải chốt danh sách breakpoint — cấm ghi *"mọi kích thước màn hình"* |
| **Accessibility** | Luôn (mức cơ bản) | Tab theo thứ tự hợp lý · Enter/Space kích hoạt · viền focus nhìn thấy được · ảnh có văn bản thay thế | WCAG đầy đủ cần công cụ riêng → phần đó `➖` |
| **Performance** | Có ngưỡng thời gian đã cam kết | Chỉ mức quan sát thô: trang tải quá lâu · danh sách lớn bị treo | Đo tải thật → `➖`, ghi đội hiệu năng |
| **Regression** | Module đã từng có bug được đóng | Mỗi bug đã đóng = 1 TC chống tái phát, **trỏ về mã bug** | Nguồn: `docs/bugs/<module>/`. Đây chỉ là một phần của regression; phạm vi cho một thay đổi chọn theo impact analysis bằng `/select-regression-tests` |
| **E2E** | Luồng đi qua ≥2 module | Kịch bản xuyên module, dữ liệu chảy từ module này sang module kia | Luồng phức tạp → chuyển sang `/generate-cross-module-test-plan` |

> `Regression` và `E2E` nằm ở V4 chỉ để xếp lô sinh TC. Theo CTFL, regression là kiểm thử liên quan đến thay đổi (2.2.3), E2E là kiểm thử chức năng ở cấp System (2.2.1); không tính chúng vào phi chức năng.

---

### Độ sâu theo rủi ro — không phải chức năng nào cũng chạy đủ 4 vòng

Bảng 4 vòng ở trên chống **bỏ sót**. Mục này chống **thừa** — bơm 50 TC cho một trang "Giới thiệu" tĩnh cũng tai hại ngang bỏ quên lớp giao diện của màn thanh toán: nó ngốn công viết, công chạy, công bảo trì, và làm loãng bộ TC thật.

Cơ chế phân xử **không phải là cái mới** — đó chính là `Risk Level` vốn đã có ở cột bảng TC và ở Bước 5 của Mode FULL RBT. Mục này nối nó vào khung 4 vòng.

#### Chấm mức rủi ro — agent tự chấm, KHÔNG hỏi user

Rủi ro = **tác động × khả năng lỗi**. Chỉ xét tác động thì hầu hết module nghiệp vụ đều ra Cao, độ sâu không còn phân tầng. Chấm từng trục rồi tra ma trận.

**Trục 1 — Tác động: hỏng thì thiệt hại đến đâu**

| Mức | Điều kiện |
|---|---|
| **Cao** | Chỉ cần **MỘT** dấu hiệu: đụng tiền hoặc số liệu tài chính · đụng xác thực/phân quyền · đụng dữ liệu cá nhân khách hàng · có thao tác **không hồi lại được** (xoá cứng, gửi mail ra ngoài, chốt sổ) · là **cổng vào** module khác (hỏng thì chặn cả đợt kiểm thử) |
| **Thấp** | Phải đủ **CẢ BỐN**: chỉ hiển thị, không ghi dữ liệu · không có field nhập (hoặc chỉ có ô tìm kiếm) · hỏng thì không ai mất dữ liệu và không chặn việc gì · sửa lại được trong vài phút, không cần triển khai lại |
| **Trung bình** | Phần còn lại |

**Trục 2 — Khả năng lỗi: chức năng này dễ hỏng đến đâu**

| Mức | Điều kiện |
|---|---|
| **Cao** | Chỉ cần **MỘT** dấu hiệu: vừa đổi so với bản đã chạy ổn · logic nhiều nhánh, tính toán, trạng thái · tích hợp hệ thống ngoài hoặc xử lý bất đồng bộ · có lỗi gần đây (`docs/bugs/`, `/analyze-defect-trends`) |
| **Thấp** | Phải đủ **CẢ BA**, có bằng chứng: đã chạy ổn ít nhất một release · không đổi trong đợt này · không có bug trong kho lỗi. Hệ thống chưa từng release thì không được chấm Thấp |
| **Trung bình** | Phần còn lại, gồm cả **chức năng mới chưa có bản ổn định để so** mà không có dấu hiệu Cao nào, và khi **thiếu dữ liệu** — ghi rõ là giả định |

**Ma trận ra `Risk Level`**

| Tác động \ Khả năng lỗi | Thấp | Trung bình | Cao |
|---|---|---|---|
| **Cao** | Trung bình | Cao | Cao |
| **Trung bình** | Thấp | Trung bình | Cao |
| **Thấp** | Thấp | Thấp | Trung bình |

- **Căn cứ ghi cả hai trục:** `Tác động Cao (đụng tiền) · Khả năng Thấp (không đổi từ bản 2.3, 0 bug) → Trung bình`
- **Tác động Cao không bao giờ xuống dưới Trung bình** (đã thể hiện ở ma trận). TC của chức năng này mà `Risk Level` chưa tới `High` thì gắn thêm tag `@HighImpact`, để `/assess-release-risk` không tính thiếu tầm ảnh hưởng
- **Hơn khoảng 50% chức năng ra Cao** → phân tầng đã mất tác dụng: báo tại checkpoint, xếp hạng các chức năng Cao và đề xuất cái nào hạ xuống. Không tự hạ
- Bộ TC đã có không chấm lại hàng loạt; chấm lại khi một workflow sinh hoặc cập nhật chạm tới chức năng đó

> 🚨 **Lưỡng lự về tác động thì chấm mức CAO HƠN.** Chấm nhầm Cao chỉ tốn công viết thừa vài TC; chấm nhầm Thấp là bỏ lọt lỗi ra production. Lưỡng lự về khả năng lỗi thì chấm Trung bình: hạ trục này phải có bằng chứng, không hạ theo cảm giác.
>
> Agent **tự chấm và ghi căn cứ** — không thêm câu hỏi cho user. User phủ quyết ở **checkpoint Bước 4** (FULL RBT) hoặc ở dòng kế hoạch batch (QUICK); đó là lúc nhìn một bảng là chặn được, rẻ hơn nhiều so với chặn sau khi đã sinh xong.

#### Ba mức độ sâu

| | **Đầy đủ** (rủi ro Cao) | **Tiêu chuẩn** (Trung bình) | **Tối giản** (Thấp) |
|---|---|---|---|
| **V1 Smoke** | Đủ 6 nhánh | Đủ 6 nhánh | **Đủ 6 nhánh — KHÔNG rút** |
| **V2 Functional** | Đủ mọi nhánh có điều kiện kích hoạt | Đủ mọi nhánh có điều kiện kích hoạt | Chỉ `Required` · `Validation` của field **có ràng buộc thật**; phần còn lại `⏭️` |
| **V3 Technical** | Đủ 6 nhánh | `Permission` + `Security`; còn lại theo Năng lực kiểm thử của QA | `Permission` (nếu ≥2 role); còn lại `⏭️` |
| **V4 Non-functional** | Đủ 6 nhánh | `Responsive` + `Accessibility`; còn lại `⏭️` | Toàn bộ `⏭️` |
| **Số TC điển hình** (độ hạt GỘP, module cỡ Login) | 40–60 | 20–30 | 8–12 |

#### Bốn thứ KHÔNG BAO GIỜ rút, bất kể rủi ro thấp đến đâu

| Không rút | Vì sao |
|---|---|
| **Toàn bộ V1** | Bỏ V1 thì không biết chức năng **có chạy được không**. Sáu TC là cái giá rẻ nhất để biết điều đó |
| `V2 · Required` + `V2 · Validation` khi **có field nhập** | Có ô nhập là có người nhập sai. Trang "chỉ hiển thị" mà có ô nhập thì nó không còn là "chỉ hiển thị" — chấm lại mức rủi ro |
| `V3 · Permission` khi hệ thống có **≥2 vai trò** | Lỗi phân quyền không tỷ lệ với độ quan trọng của chức năng: một trang xem báo cáo tưởng vô hại vẫn có thể lộ dữ liệu cả công ty |
| `V3 · Security` khi chức năng chạm **dữ liệu của người dùng khác** | Cùng lý do trên |

#### Trạng thái thứ tư: `⏭️` — phân biệt với `➖`

Bảng đối soát 4 vòng có **bốn** trạng thái, không phải ba:

| Ký hiệu | Nghĩa | Bắt buộc ghi kèm |
|---|---|---|
| `✅` | Có TC | TC ID (kèm số biến thể nếu GỘP) |
| `➖` | **Không áp dụng** — không có thứ đó để kiểm (module không có CRUD, không có dropdown, không có tích hợp) | Lý do kỹ thuật |
| `⏭️` | **Cố ý bỏ** — có thứ đó, kiểm được, nhưng **quyết định không kiểm** vì rủi ro thấp | **Lý do + ai quyết định + điều kiện rà lại.** Ai quyết định là người đã chốt trong chat, chưa có thì `⏳ chờ duyệt`, không ghi agent |
| `🔴` | Thiếu — phải bổ sung trước khi xuất | — |

> 🚨 **`➖` và `⏭️` KHÔNG được dùng lẫn.** `➖` là **sự thật kỹ thuật** ("hệ thống không có cái đó"). `⏭️` là **một quyết định có người chịu trách nhiệm** ("có, nhưng chúng tôi chấp nhận rủi ro không kiểm"). Khi có sự cố production, hai câu đó dẫn tới hai cuộc họp hoàn toàn khác nhau. Ghi `➖` cho thứ thật ra là `⏭️` là **giấu quyết định** — nguy hiểm hơn cả bỏ trống ô.

Mẫu dòng `⏭️` đạt yêu cầu:

```markdown
| 4 | Compatibility | ⏭️ Cố ý bỏ | Trang tĩnh, rủi ro Thấp — chỉ kiểm Chrome. **Quyết định: QA lead, 11-09-2026.** Rà lại khi trang có thêm field nhập hoặc khi hệ thống cam kết hỗ trợ trình duyệt mới |
```

```markdown
❌ Không đạt: | 4 | Compatibility | ⏭️ | Không cần thiết |
```

#### Ghi mức độ sâu vào tài liệu TC

Ngay dưới tiêu đề bộ TC, thêm một dòng để người đọc biết bộ này **cố tình** dừng ở đâu:

```markdown
| **Mức rủi ro · độ sâu** | `Thấp` → **Tối giản** — V1 đủ 6 nhánh, V2 chỉ nhánh có ràng buộc, V3/V4 phần lớn `⏭️`.<br>Căn cứ chấm Thấp: chỉ hiển thị · không ghi dữ liệu · không có field nhập · hỏng không chặn việc gì.<br>**Nâng lên Tiêu chuẩn khi:** thêm bất kỳ field nhập nào, hoặc chức năng bắt đầu ghi dữ liệu |
```

> Dòng **"Nâng lên khi…"** là phần quan trọng nhất — nó biến quyết định rút gọn hôm nay thành thứ **tự hết hạn** khi chức năng lớn lên, thay vì một lựa chọn bị quên vĩnh viễn.

---

### Cách dùng — 5 quy tắc

1. **Chia batch theo VÒNG**, không chia tự do theo nhóm chức năng. Vòng 2 đông TC thì chia con **bên trong vòng đó** theo nhóm chức năng.
2. **Chấm từng nhánh, không bỏ trống ô nào** — **bốn** trạng thái: `✅ Có TC` (dẫn TC ID) · `➖ Không áp dụng` (không có thứ đó để kiểm — ghi lý do kỹ thuật) · `⏭️ Cố ý bỏ` (có nhưng rủi ro thấp — ghi **lý do + ai quyết định + điều kiện rà lại**) · `🔴 Thiếu` (phải bổ sung **trước khi xuất**). Xem mục **Độ sâu theo rủi ro** ở trên để biết khi nào được dùng `⏭️`.
3. 🚫 **KHÔNG sinh TC để lấp ô, cũng KHÔNG chạy đủ 4 vòng cho chức năng rủi ro Thấp.** Nhánh không có gì để kiểm thì `➖`; nhánh có mà không đáng đầu tư thì `⏭️`. TC sinh ra chỉ cho bảng đẹp là TC rác — cùng một luật với bảng ISO 25010.
4. **Ba nhánh KHÔNG BAO GIỜ được `➖`:** `UI cơ bản` (V1) · `Validation` (V2, khi có field nhập) · `Permission` (V3, khi có ≥2 role). Chấm `➖` ở ba chỗ này là dấu hiệu agent đang né việc.
5. **Độ hạt GỘP thì cột dẫn chứng ghi cả số biến thể** — `TC_001–TC_003 (3 TC · 11 biến thể)`. Gộp làm số TC giảm, nhưng **số biến thể không được giảm**; không ghi số biến thể thì không ai phát hiện được việc rụng case.

### Bảng xuất kèm output (đặt cuối tài liệu TC, **trước** bảng ISO 25010)

```markdown
## Đối soát loại kiểm thử (4 vòng)

| Vòng | Nhánh | Trạng thái | TC ID / Lý do |
|---|---|---|---|
| 1 | UI cơ bản | ✅ | TC_001–TC_003 (3 TC · 11 biến thể) |
| 1 | Open form · Display | ✅ | TC_004–TC_006 |
| 1 | Input valid · Save · Verify | ✅ | TC_007–TC_009 |
| 2 | Required | ✅ | TC_010–TC_012 |
| 2 | Validation | ✅ | TC_013–TC_028 (16 TC · 61 biến thể · đủ 7/7 mục bảng Password) |
| 2 | Error Guessing | 🔴 Thiếu | Chưa có TC bấm Lưu hai lần liên tiếp → **bổ sung trước khi xuất** |
| 3 | Permission | ✅ | TC_040–TC_047 (3 role × 3 hành động) |
| 3 | Database | ➖ | QA không có quyền truy cập DB — đội Dev xác minh |
| 4 | Responsive | ✅ | TC_050–TC_052 (1920 · 1366 · 768) |
| 4 | Performance | ➖ | Không có công cụ tải — đội Hạ tầng, đợt sau |
| 4 | Regression | ➖ | Module mới, chưa có bug nào được đóng |
```

---

