## Bổ sung module do user chỉ ra (Mode ADD)

> Kích hoạt khi user nói: *"còn thiếu module X"* · *"menu Báo cáo bạn chưa khảo sát"* · *"vào /admin/settings xem"* — tức **user biết có module mà agent không thấy được**.
>
> Khác với Delta bên dưới: ở đây **không crawl lại toàn hệ thống**, chỉ xử lý đúng phần user chỉ.

**Vì sao agent hay sót — hỏi lại user đúng câu để biết đường đi:**

| Nguyên nhân | Dấu hiệu | Cần user cung cấp |
|---|---|---|
| **Thiếu quyền** — account đang dùng không thấy menu | Module chỉ hiện với role cao hơn | Account có quyền, hoặc xác nhận "chỉ role X thấy" |
| **Menu chỉ hiện khi hover/click nhiều tầng** | Nằm ở menu cấp 3 trở lên | Đường đi menu: `Hệ thống → Cấu hình → Phân quyền` |
| **Route không có trong menu** | Vào được bằng URL trực tiếp | URL đầy đủ |
| **Chỉ vào được từ hành động trên bảng** | Bấm nút trong dòng dữ liệu mới ra | Mô tả thao tác để tới đó |
| **Cần dữ liệu mới hiện** | Danh sách rỗng nên không có nút/tab nào | Bản ghi mẫu để mở, hoặc xác nhận môi trường chưa có data |
| **Bị ẩn bởi feature flag / chưa bật** | Có API nhưng không có UI | Xác nhận tính năng đã bật chưa |

**Các bước:**

1. **Hỏi user đủ 2 thứ**: đường đi tới module (URL hoặc menu path) + lý do agent không thấy (theo bảng trên). Thiếu đường đi thì không tự đoán route
2. **Thử truy cập thật:**

| Kết quả | Xử lý |
|---|---|
| ✅ Vào được | Khảo sát như Bước 3, ghi nhận đầy đủ, `Nguồn` = `UI thực tế` |
| ❌ Không vào được (403 / không có quyền / chưa có data) | **Vẫn thêm vào danh mục** với `Trạng thái recon` = ⬜ và ghi rõ ở mục 7 của index: *"Chưa xác minh được — thiếu quyền, chờ account role X"*. `Nguồn` = **`User cung cấp — chưa xác minh UI`** |

3. **Cấp prefix** — đối chiếu danh sách prefix đã chiếm trong `README.md`, chọn prefix chưa dùng
4. **Ghi vào đúng file** theo bảng "Module mới xuất hiện — thêm vào đâu" ở phần Delta bên dưới
5. **Cập nhật 3 nơi**: bảng module ở index · `README.md` danh mục · **Nhật ký khám phá** (ghi rõ `Nguồn: user bổ sung`)
6. **Xem lại thứ tự khảo sát** ở mục 6 của index — module mới chen vào đâu, có `BLOCKED` module nào không

⚠️ **KHÔNG được ghi module user chỉ ra như thể đã tự khảo sát.** Vào được thì mới ghi `UI thực tế`; không vào được thì `User cung cấp — chưa xác minh UI`. Trộn hai cái là bước sinh TC sau đó sẽ tin nhầm vào thứ chưa ai nhìn thấy.

💡 **Rẻ nhất là chặn ngay ở checkpoint Bước 5** — lúc đó agent hỏi thẳng *"có module nào tôi không thấy được vì thiếu quyền?"*. Trả lời ở đó thì chưa file nào được ghi, không phải sửa gì cả.

### ADD một **mặt** mới cho hệ thống đã có bản đồ

User đưa thêm spec API cho hệ thống đã khám phá mặt web:

1. Bước 0 chỉ hỏi phần của mặt mới (bảng Bước 0, dòng Mặt API)
2. Chạy **đúng** Bước 3-A — **không** crawl lại web
3. Ghép vào module đã có theo 3-A.4 và bảng 4.1b. Prefix cũ giữ nguyên tuyệt đối
4. Checkpoint Bước 5 rút gọn: chỉ trình bảng ghép nền tảng + module mới (nếu có) + `F-nn` 🔴
5. Cập nhật cột `Nền tảng` ở `README.md` và `system_map.md`; mặt API thì tạo `api_map.md`. Module đang ✅ mà thêm mặt mới ⬜ → `Trạng thái recon` tổng về 🟨
6. Ghi Nhật ký khám phá: `Nguồn: user bổ sung mặt API`

---

## Chạy lại lần sau (Delta)

> Dùng khi **hệ thống đã thay đổi** (deploy tính năng mới) hoặc muốn **rà lại toàn bộ** — agent tự crawl và so sánh. User chỉ đích danh một module thì dùng Mode ADD ở trên cho nhanh.

Hệ thống có module mới, hoặc lần trước bỏ sót:

1. Bước 1 đọc `system_map.md` cũ → biết đã có gì. Có mục `## Bản đồ tài liệu` thì đọc tiếp các file trong `modules/`
2. Crawl lại, **so sánh** với bảng module cũ
3. Chỉ báo cáo **phần chênh**: module mới · module biến mất · route đổi · menu đổi tên
4. Ghi thêm dòng vào **Nhật ký khám phá**, **không** viết đè bảng cũ
5. Module biến mất khỏi UI → **không xoá dòng**, đổi trạng thái + ghi chú ngày — cùng nguyên tắc "không xoá REQ" ở skill mục 6.2

**Module mới xuất hiện — thêm vào đâu:**

| Tình huống | Xử lý |
|---|---|
| Bản đồ **chưa tách** và tổng module vẫn ≤ 8 | Thêm dòng vào `system_map.md` |
| Bản đồ **chưa tách** nhưng thêm xong vượt 8 | Tách ngay lần này — số `NN` giữ đúng thứ tự khảo sát đã chốt trước đó |
| Bản đồ **đã tách**, module mới thuộc nhóm đã có | Thêm vào file nhóm đó (nếu file đó chưa quá 3 module), cập nhật `## Bản đồ tài liệu` |
| Bản đồ **đã tách**, module mới độc lập | File mới `module_NN_<slug>.md` với `NN` = số kế tiếp — **không** đánh lại số các file cũ |

⚠️ **Không đổi tên file module đã có** chỉ vì thứ tự ưu tiên thay đổi. Thứ tự khảo sát cập nhật ở mục 6 của index; tên file giữ nguyên để link cũ không gãy.
