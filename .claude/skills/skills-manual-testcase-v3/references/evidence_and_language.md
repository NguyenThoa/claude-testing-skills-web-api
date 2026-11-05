# Evidence & Ngôn Ngữ Kiểm Chứng

## Quy Tắc Đối Chiếu Evidence (BẮT BUỘC — áp dụng cả 4 modes, chạy TRƯỚC batch đầu tiên)

Tài liệu requirements là **mô tả bằng chữ**; ảnh trong `docs/requirements/<module>/<nền-tảng>/evidence/` là **bằng chứng**. Sinh TC chỉ từ chữ dẫn tới bịa bố cục, nhãn, thứ tự tab, định dạng hiển thị — và không ai phát hiện được vì TC đọc vẫn rất thuyết phục.

**Hai câu hỏi khác nhau, đừng trộn:**

| Câu hỏi | Nguồn |
|---|---|
| Hệ thống **đang** hiển thị gì? | DOM thật > Ảnh evidence > Tài liệu chữ |
| Hệ thống **phải** làm gì? | Requirement đã duyệt (test basis) |

### 1. Mở toàn bộ evidence trước khi sinh TC

- Liệt kê `docs/requirements/<module>/<nền-tảng>/evidence/` của **nền tảng đang sinh TC** (tài liệu cũ chưa có tầng nền tảng: `docs/requirements/<module>/evidence/`) rồi **mở TỪNG ảnh bằng `Read`**. Không được bỏ ảnh nào vì "tên file nghe không liên quan"
- Ảnh của module liên quan (VD Projects tham chiếu Customers) cũng mở nếu TC chạm tới
- **Chưa mở evidence thì chưa được ghi dòng TC đầu tiên**

### 2. Xung đột giữa tài liệu và ảnh → phân loại trước khi viết

App đang chạy có thể đang sai. Viết Expected Result theo hành vi hiện tại khi nó trái requirement thì bộ TC sẽ **xác nhận luôn cái bug**. Vì vậy phải phân loại, không mặc định bên nào thắng:

| Loại xung đột | Ví dụ | Expected Result viết theo | Bắt buộc kèm |
|---|---|---|---|
| **Hành vi, quy tắc nghiệp vụ, thông báo** có trong requirement đã duyệt | Tài liệu: tối đa 100 ký tự, app nhận 255 | **Requirement** | Dòng `⚠️ Lệch với app: <hiện trạng> — <tên ảnh>`, tag `@NeedsVerify`, mở `AMB-<MODULE>-nn`, báo user vì có thể là bug |
| **Trình bày** mà requirement không phải nguồn chính thức, hoặc tài liệu rõ ràng đã cũ | Nhãn nút, thứ tự cột sau khi đổi giao diện | **Ảnh / DOM** | `ASM-<MODULE>-nn` kèm tên ảnh, báo user để cập nhật requirement |
| **Tài liệu không đề cập** | Hành vi chỉ thấy trên app | **Ảnh / DOM**, coi là giả định | `ASM-<MODULE>-nn`, tag `@NeedsVerify` |

`Requirement đã duyệt` = REQ có `✅` ở cột `Duyệt`, hoặc tài liệu mà user xác nhận trong chat là đã duyệt. REQ `⏳` chép từ chính UI không dùng để chấm UI sai. REQ `⏳` lấy từ tài liệu mà lệch app → vẫn viết theo tài liệu như dòng đầu, `AMB` hỏi PO bên nào đúng.

Không tự xử lý im lặng. Mọi xung đột phải xuất hiện ở phần tóm tắt cuối.

### 3. Evidence thiếu / cắt cụt → gắn `@NeedsVerify`, KHÔNG suy diễn

Ảnh chụp theo viewport thường **cắt mất phần dưới** của form dài (nút Save, checkbox cuối, rich text editor). Vùng không có ảnh chống lưng:

- TC vẫn được viết, nhưng **bắt buộc gắn tag `@NeedsVerify`** và ghi `⚠️ chưa có evidence` trong cột `Expected Result`
- Liệt kê ở mục **"Vùng chưa có evidence"** trong index, kèm đề xuất recon bổ sung theo chuẩn 7.2.1 của skill `skills-requirements-analyzer`
- **NGHIÊM CẤM** viết Expected Result khẳng định chắc chắn về thứ tự Tab, vị trí phần tử, nhãn nút, định dạng hiển thị khi không nhìn thấy trong ảnh

### 4. Bốn nhóm TC BẮT BUỘC phải có evidence chống lưng

| Nhóm TC | Vì sao không được suy diễn |
|---|---|
| Bố cục & thứ tự (tab order, thứ tự cột, thứ tự field) | Bố cục 2 cột làm thứ tự Tab **khác hẳn** thứ tự đọc từ trên xuống |
| Nhãn nguyên văn (nút, tiêu đề, thông báo, tooltip) | Sai một chữ là TC fail giả |
| Giá trị mặc định (checkbox tick sẵn, option đang chọn, multi-select chọn sẵn) | Đây là chỗ tài liệu hay lỗi thời nhất |
| Định dạng hiển thị (tiền tệ `$1,403.00`, giờ `100:00`, ngày `dd-mm-yyyy`, badge màu, avatar) | Assert sai định dạng là fail hàng loạt |

### 5. Có Playwright MCP → đọc DOM, đừng chỉ nhìn ảnh

Ảnh là **bằng chứng lưu trữ**; DOM là **nguồn chính xác**. Ảnh độ phân giải thường **không phân biệt nổi** `disabled` với `không tick`, không đếm được option nào đang `selected` trong multi-select bị cắt, không đọc được `value` hay `data-*`. Khi có Playwright MCP, sau khi mở ảnh hãy đọc thẳng DOM để chốt các con số:

```js
// Mẫu: chốt option, giá trị mặc định, trạng thái khoá — một lượt
() => {
  const q = s => document.querySelector(s);
  const sel = q('#<select_id>');
  return {
    options: [...sel.options].map(o => ({ v: o.value, text: o.text.trim(), subtext: o.getAttribute('data-subtext') })),
    selectedIndex: sel.selectedIndex,
    selectedValues: [...sel.options].filter(o => o.selected).map(o => o.value),
    checkboxes: [...document.querySelectorAll('<scope> input[type=checkbox]')]
      .map(c => ({ name: c.name, checked: c.checked, disabled: c.disabled })),
    fieldOrder: [...document.querySelectorAll('<form> input:not([type=hidden]), <form> select, <form> textarea')]
      .filter(e => e.offsetParent !== null).map(e => e.id || e.name)
  };
}
```

Những thứ **chỉ DOM mới chốt được**: số `<option>` thật (kể cả option rỗng) · `selectedIndex` · danh sách option đang `selected` · `disabled` vs `checked` · `data-subtext` / `data-*` · thứ tự focus thật của form · phần tử ẩn bằng class nhưng vẫn nằm trong DOM.

### 6. Trạng thái phần tử — đọc kỹ ảnh, đừng chỉ đọc nhãn

Checkbox **xám mờ = disabled**, khác hoàn toàn **không tick**. Phát hiện phần tử disabled trong ảnh nghĩa là có **business rule phụ thuộc** mà requirements có thể đã bỏ sót → sinh TC cho cả hai chiều (bật điều kiện → mở khoá; tắt điều kiện → khoá lại) và mở `AMB-<MODULE>-XX`.

---

## Quy Tắc Ngôn Ngữ Kiểm Chứng (BẮT BUỘC — áp dụng cả 4 modes)

> 🚨 Mục trên vừa nói **DOM là nguồn chính xác** — đúng, nhưng đó là luật cho khâu **khảo sát**. Mục này là luật cho khâu **viết TC**, và hai khâu đó KHÔNG dùng chung ngôn ngữ. Agent đọc DOM để **biết sự thật**; TC viết ra để **người khác kiểm chứng lại sự thật đó**.

Người chạy manual TC là **tester**, không phải người viết automation. Họ chấm PASS/FAIL bằng thứ **nhìn thấy trên màn hình**. Một Expected Result kiểu `body.className` chứa `user-id-2` bắt tester mở DevTools, gõ lệnh, đọc chuỗi — và tệ hơn: nó **không phát biểu được yêu cầu nghiệp vụ nào**. Người dùng đâu quan tâm class của thẻ `body`; họ quan tâm mình có vào được Dashboard không.

### 1. Câu hỏi bắt buộc trước khi viết mỗi dòng Expected Result

> **"Người dùng thật sẽ thấy điều này bằng cách nào?"**

Trả lời được bằng mắt thường → viết đúng cái nhìn thấy. Không trả lời được → thuộc nhóm ẩn, xử lý theo mục 3.

### 2. Bảng chuyển ngữ — DOM ❌ → Quan sát được ✅

| ❌ Ngôn ngữ DOM / DevTools | ✅ Viết trong manual TC |
|---|---|
| `document.title` chứa `Dashboard` · `body.className` chứa `user-id-2` | Vào được trang Dashboard, thanh tiêu đề trình duyệt ghi `Dashboard` |
| `input#email.checkValidity()` = `false` | Trình duyệt hiện cảnh báo ngay cạnh ô Email, biểu mẫu **không** gửi đi (trang không nạp lại, dữ liệu đã nhập còn nguyên) |
| Có `input#email[type=email]`, `input#password[type=password]`, `button[type=submit]` | Thấy đủ ô `Email Address`, ô `Password` (gõ vào hiện dấu chấm che), nút `Login` |
| `document.activeElement.id` = `email` | Con trỏ nhấp nháy sẵn trong ô Email, gõ được ngay không cần bấm chuột |
| `offsetParent` = `null`, hộp `0×0` | Không nhìn thấy trên màn hình |
| Đếm `.g-recaptcha` = `0`, `iframe[src*=recaptcha]` = `0` | Trên trang không có ô "Tôi không phải người máy", không có ảnh đố |
| `POST` trả `303`, header `location: /admin/` | Trang tự chuyển sang Dashboard |
| Thân request chứa 4 tham số `csrf_token_name`, `email`… | *(→ nhóm ẩn, xem mục 3)* |

**Nguyên tắc rút ra:** mã HTTP, header, thuộc tính DOM, selector, tab Network **là phương tiện agent dùng lúc khảo sát để chốt sự thật** — không phải ngôn ngữ để giao việc cho tester.

### 3. Nhóm ẩn — tách xuống `Ghi chú kỹ thuật`, gắn `@TechCheck`

Có những yêu cầu **thật sự không có biểu hiện nhìn thấy được**: cookie `autologin`, mã chống CSRF, header `Strict-Transport-Security`, chuyển hướng HTTP→HTTPS, mã `500` thân rỗng. Bỏ đi là mất vết kiểm bảo mật. Cách xử lý:

1. **Expected Result chính** vẫn viết bằng ngôn ngữ quan sát được — phát biểu **hệ quả nghiệp vụ** của cơ chế ẩn đó
2. Phần cấp kỹ thuật tách xuống một dòng riêng mở đầu bằng **`🔧 Ghi chú kỹ thuật (cần DevTools):`**
3. TC gắn tag **`@TechCheck`** để tester biết cần công cụ, và người lập bộ chạy biết TC này giao cho ai

```markdown
✅ Đúng:
| Expected Result |
| 3. Đăng nhập thành công, vào Dashboard<br>4. Đóng hẳn trình duyệt rồi mở lại `crm.anhtester.com/admin/` → **vẫn đang đăng nhập**, không phải nhập lại<br><br>🔧 Ghi chú kỹ thuật (cần DevTools): tồn tại cookie `autologin` khớp hình thái `a:2:{s:7:"user_id";...;s:3:"key";s:16:"<16 ký tự hex>";}`. 🔒 Chỉ ghi hình thái, KHÔNG chép giá trị thật |

❌ Sai (bắt tester đọc cookie mà không nói để làm gì):
| 6. Tồn tại cookie `autologin` khớp hình thái `a:2:{...}` — phần `key` dài đúng 16 ký tự hex |
```

> **Thước đo:** che dòng `🔧 Ghi chú kỹ thuật` đi, TC **vẫn phải chạy và chấm được**. Không chấm được nghĩa là chưa tìm ra hệ quả nghiệp vụ — quay lại tìm, đừng để phần kỹ thuật gánh cả TC.

### 4. Action cũng theo luật này

Steps viết bằng **thao tác người dùng làm được**, không phải lệnh console.

| ❌ | ✅ |
|---|---|
| `5. Đọc mã trạng thái và header location của POST /admin/authentication` | `5. Quan sát trang sau khi bấm Login` |
| `1. Xác nhận $(".started-timers-top").find("li.timer").length > 0` | `1. Xác nhận trên thanh đầu trang đang hiện ít nhất 1 bộ đếm giờ chạy` |
| `4. Đọc document.querySelector('#email').getAttribute('value')` | `4. Nhìn ô Email sau khi trang nạp lại`<br>+ `🔧 Ghi chú kỹ thuật`: xem HTML máy chủ trả về (View Source), thẻ `input#email` phải mang `value=...` |

### 5. Ngoại lệ hợp lệ — được dùng ngôn ngữ kỹ thuật ở TC chính

| Trường hợp | Vì sao |
|---|---|
| `Auto Type` = `API` | TC gốc đã ở tầng giao thức, người chạy là người gọi API |
| Mode CHECKLIST mục dành riêng cho DevOps / security review | Người tick là kỹ sư, không phải tester nghiệp vụ |
| Tên nguyên văn của **nhãn hiển thị** (`Invalid email or password`, nút `Login`, tiêu đề `Forgot Password`) | Đây là thứ tester **đọc trên màn hình**, không phải DOM — vẫn bắt buộc ghi nguyên văn |
| URL đầy đủ (`https://crm.anhtester.com/admin/`) | Tester đọc được trên thanh địa chỉ |

### 6. Selector CSS/XPath — KHÔNG thuộc về manual TC

Selector là tài sản của tầng automation, sống trong Page Object. Nhét `.dropdown-menu > li.header-logout` vào manual TC gây hai hại: tester không dùng được, và khi UI đổi thì selector sai nằm rải trong tài liệu TC không ai đi sửa.

- Thông tin selector thu được lúc recon → ghi vào **`docs/requirements/<module>/REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md`** (mục kỹ thuật), workflow automation đọc từ đó
- Manual TC chỉ mô tả **vị trí nhìn thấy**: "mục `Logout` cuối cùng trong menu ảnh đại diện góc trên bên phải"

### 7. Self-Quality Gate — tiêu chí bổ sung

Trước khi xuất, agent rà lại **toàn bộ** cột `Action` và `Expected Result`:

- [ ] Không còn `document.`, `querySelector`, `checkValidity`, `offsetParent`, `className`, `getAttribute`, `$(`, `input#`, `[type=` ở phần TC chính
- [ ] Không còn mã HTTP / tên header ở phần TC chính (trừ `Auto Type` = `API`)
- [ ] Mọi phần kỹ thuật còn lại nằm dưới `🔧 Ghi chú kỹ thuật (cần DevTools):` và TC đó có tag `@TechCheck`
- [ ] Che hết dòng `🔧 Ghi chú kỹ thuật` → mọi TC vẫn chạy và chấm được

---

