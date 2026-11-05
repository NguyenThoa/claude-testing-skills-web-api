# Thiết Kế Kiểm Thử API — Bám ISTQB CTFL v4.0

> Bám nội dung syllabus ISTQB CTFL v4.0 (đã đối chiếu bản v4.0.1), diễn giải cho test API. Đây không phải chứng nhận tuân thủ, số mục cần đối chiếu lại khi syllabus đổi phiên bản.

## 1. Quy trình và testware

| Hoạt động (CTFL 1.4) | Với API phải trả lời | Testware |
|---|---|---|
| Test analysis | Spec có mâu thuẫn, thiếu auth, thiếu mã lỗi không? | `AMB-*`, Q&A, ma trận auth |
| Test design | Phủ field, trạng thái, quyền đến đâu? | Decision Table, State Transition, bảng độ phủ |
| Test implementation | Có dữ liệu, tài khoản, thứ tự chạy chưa? | File TC 11 cột, Test Data Matrix, 2 tài khoản BOLA |
| Truy vết (CTFL 1.4.4) | REQ nào đã phủ? | `REQ ID`, Bảng Đối Soát Coverage |

## 2. Nguồn của Expected Result

Requirement và spec đã duyệt là test basis. API thật chỉ cho biết hiện trạng.

| Tình huống | Expected Result viết theo | Bắt buộc kèm |
|---|---|---|
| Spec nói một đằng, API trả một nẻo | **Spec / REQ đã duyệt** | Dòng `⚠️ Lệch với API: <hiện trạng>`, tag `@AppDeviation`, mở `AMB-<MODULE>-nn`, báo user vì có thể là bug |
| Spec không đề cập | Hành vi đã gọi thật, coi là giả định | `ASM-<MODULE>-nn`, tag `@NeedsVerify` |
| Chưa được gọi thật | Spec | Tag `@NeedsVerify` |

Spec sinh tự động chưa chắc đã được duyệt. Nghi ngờ thì hỏi API Owner.

## 3. Chọn kỹ thuật

| Nhóm (CTFL 4.2–4.5) | Kỹ thuật | Bắt buộc khi | Tiêu chí phủ |
|---|---|---|---|
| Hộp đen | **Equivalence Partitioning** | Mọi field trong request, enum, kiểu dữ liệu | Mọi partition hợp lệ và không hợp lệ có ≥ 1 TC |
| Hộp đen | **Boundary Value Analysis** | Field có min/max, kích thước file, phân trang | `Low` · `Medium`: BVA 2 giá trị. `High`: BVA 3 giá trị |
| Hộp đen | **Decision Table** | ≥ 3 điều kiện kết hợp; vai trò × hành động × chủ sở hữu | Mọi cột khả thi. > 20 tổ hợp: bỏ cột không khả thi, gộp cột, rồi chọn theo rủi ro và ghi lý do |
| Hộp đen | **State Transition** | API async, entity có status flow | Mọi chuyển đổi hợp lệ. `High`: thêm mọi chuyển đổi không hợp lệ, mỗi TC một chuyển đổi |
| Kinh nghiệm | **Error Guessing** | Luôn luôn | Bảng mục 5 và bug cũ của module |
| Kinh nghiệm | **Exploratory** | Rủi ro `High` hoặc spec yếu | Đề xuất session có charter, thời lượng, phiếu ghi session và buổi debrief; không thay thế TC |
| Phối hợp | **Tiêu chí chấp nhận** | Nguồn là ticket | Mỗi tiêu chí có ≥ 1 TC |

## 4. Độ sâu theo rủi ro

Chấm từng endpoint, ghi căn cứ cả hai trục: rủi ro = tác động × khả năng lỗi. Dùng trục khả năng lỗi, ma trận và các chốt an toàn ở `skills-manual-testcase-v3/references/test_types_4_rounds.md`, mục *Chấm mức rủi ro*. Trục tác động lấy theo dấu hiệu dưới đây. Endpoint tác động High mà `Risk Level` chưa tới `High` thì gắn thêm tag `@HighImpact`.

| Mức | Dấu hiệu tác động | Section phải có khi `Risk Level` ra mức này |
|---|---|---|
| **High** | Chạm tiền, xác thực, phân quyền, dữ liệu cá nhân; ghi dữ liệu không hoàn tác được; gọi bên thứ ba | A · B · C · D · E · F · J, thêm G nếu async, K nếu sinh file |
| **Medium** | Ghi dữ liệu thông thường | A · C · D · E · J, F khi có downstream |
| **Low** | Chỉ đọc dữ liệu công khai | A · D (mức cơ bản) · E · J |

**Không bao giờ rút, dù rủi ro thấp:**
- Thiếu hoặc sai xác thực (401) trên endpoint có yêu cầu auth.
- BOLA/IDOR khi endpoint truy cập tài nguyên theo `id`.
- Sai kiểu và thiếu field bắt buộc.
- Không lộ dữ liệu nhạy cảm trong response và thông báo lỗi.

## 5. Kinh nghiệm thực tế

| Chủ đề | Phải kiểm |
|---|---|
| **Phân biệt 401 và 403** | Chưa xác thực khác chưa có quyền. Trả sai mã là lỗi |
| **BOLA/IDOR** | Tự tạo 2 tài khoản của mình. Không dùng `id` lấy từ dữ liệu người khác |
| **Idempotency** | Gửi lại cùng request: có tạo trùng không? Có cùng kết quả không? |
| **Đồng thời** | Hai request cập nhật cùng bản ghi. Kiểm 409 hoặc quy tắc đã chốt |
| **Downstream** | Bên thứ ba lỗi hoặc quá hạn: mã lỗi đúng, không treo, không lộ stack trace |
| **Hợp đồng response** | Đúng schema, kiểu, field bắt buộc. Không chỉ kiểm mã HTTP |
| **Mã lỗi** | Cùng HTTP status nhưng khác nguyên nhân phải phân biệt được |
| **Trạng thái sau lỗi** | Request lỗi không để lại dữ liệu dở. Gọi API đọc để kiểm chứng |
| **Giới hạn** | Payload quá lớn, rate limit, phân trang vượt khoảng |
| **Không kiểm trên production** | Mọi TC ghi dữ liệu hoặc gửi ra ngoài chỉ chạy trên môi trường được phép |
| **Gây gián đoạn** | Brute force, vượt rate limit, tải lớn: tag `@Disruptive`, chỉ chạy khi user duyệt (`skills-requirements-analyzer` mục 3.4.4) |

- **Mỗi TC chứng minh một mục tiêu.** Một request chứng minh được nhiều REQ vẫn phải tách TC.
- **TC độc lập:** dữ liệu cần có đưa vào `Tiền điều kiện` hoặc tự tạo trong bước đầu.
- **Hiệu năng tải thật và kiểm thử xâm nhập chuyên sâu** không thuộc manual TC. Ghi rõ ở phần ngoài phạm vi và ai chịu trách nhiệm.
- **Bộ TC rủi ro `High`** nên qua `/review-testcases` hoặc một reviewer độc lập.
