---
paths:
  - "**/*.spec.ts"
  - "**/*.spec.js"
  - "**/*.test.ts"
  - "**/*.java"
  - "**/test_*.py"
  - "**/pages/**"
  - "**/playwright.config.*"
  - "**/pom.xml"
---

# Quy Tắc Chung cho QA Automation

> Áp dụng cho mọi tác vụ automation testing, bất kể framework (Playwright, Selenium).

## 1. Kiến Trúc & Framework

- Bắt buộc sử dụng mô hình **Page Object Model (POM)**.
- Phân tách rõ ràng:
  - **Page classes:** Khai báo locators + methods tương tác UI
  - **Test classes:** Chứa logic kiểm thử + assertions
  - **Test data:** Tách riêng khỏi code chức năng (JSON, DataProvider, Utils)
- Assertions chỉ đặt trong Test classes, KHÔNG đặt trong Page classes.

## 2. Sinh Dữ Liệu Test (Test Data)

- Tất cả trường yêu cầu unique (Email, Username, Mã KH...) **phải sinh động**, không hardcode.
- Sử dụng UUID, Timestamp hoặc thư viện Faker.
- Dữ liệu phải **traceable** — nhìn vào DB biết ngay test nào tạo ra:
  ```
  Format: [prefix]_[testName]_[timestamp]_[random]
  Ví dụ:  auto_createCustomer_20260402_A3F2@yopmail.com
  ```
- Hỗ trợ chạy parallel: mỗi test method có data riêng biệt, không conflict.
- **Parallel là mặc định, không phải tuỳ chọn** — framework sinh ra luôn bật sẵn (mặc định 5 luồng). Test đỏ khi chạy song song là **test sai**, phải sửa test data / khử shared state, KHÔNG hạ số luồng để giấu. Chi tiết: `skills-framework-architect/references/CODE_TEMPLATES.md` § 8.

## 3. Chất Lượng Code

- Không logic trùng lặp — tạo helper methods cho các hành động lặp đi lặp lại.
- Code phải đơn giản, dễ đọc, dễ bảo trì.
- Trước khi deliver code:
  - Xóa toàn bộ `console.log`, `System.out.println`, `print()` sinh ra khi debug
  - Xóa code bị comment (`//`, `/* */`)
  - Xóa locator / biến không sử dụng (unused code)

## 4. Quản Lý File & Thư Mục

- KHÔNG tự động xóa file source khi chưa xác nhận với user.
- Kiểm tra cấu trúc thư mục hiện có trước khi tạo file mới — tránh duplicate.
- Đặt file đúng thư mục theo kiến trúc project (xem `.claude/skills/skills-framework-architect/references/PROJECT_STRUCTURE.md`).

## 5. Quy Tắc Đặt Tên

### Java

| Thành phần | Quy tắc | Ví dụ |
|---|---|---|
| Page class | PascalCase + hậu tố `Page` | `LoginPage.java`, `CartPage.java` |
| Test class | PascalCase + hậu tố `Test` | `LoginTest.java`, `CartTest.java` |
| Test method | Bắt đầu bằng `test` + mô tả hành vi | `testLoginWithValidCredentials()` |
| Locator biến | lowerCamelCase + hậu tố mô tả element | `loginButton`, `usernameInput` |
| Utils class | PascalCase + mô tả chức năng | `DataGenerator.java`, `WaitHelper.java` |

### TypeScript / Playwright

| Thành phần | Quy tắc | Ví dụ |
|---|---|---|
| Page class | PascalCase + hậu tố `Page` | `LoginPage.ts`, `CartPage.ts` |
| Test file | kebab-case + `.spec.ts` | `login.spec.ts`, `cart.spec.ts` |
| Test block | `test('mô tả hành vi')` | `test('đăng nhập thành công')` |
| Locator biến | lowerCamelCase hoặc readonly | `readonly loginButton` |
| Utils | PascalCase hoặc kebab-case | `DataGenerator.ts`, `data-generator.ts` |

## 6. Assertions (Kiểm Tra Kết Quả)

- Mỗi test case **BẮT BUỘC** có ít nhất 1 assertion ở cuối.
- Nên có assertion xen kẽ ở các bước quan trọng.
- Assert phải mô tả rõ expected behavior:
  ```java
  // Java/TestNG
  Assert.assertTrue(dashboardPage.isDisplayed(), "Dashboard phải hiển thị sau khi đăng nhập");
  ```
  ```typescript
  // Playwright
  await expect(page.getByText('Đăng nhập thành công')).toBeVisible();
  ```

### 6.1. Test đang phơi bug (`@KnownBug`)

Test đỏ vì app sai so với TC thì không hạ assertion, không xoá, không skip.

| Trạng thái | Điều kiện | Xử lý |
|---|---|---|
| Đỏ chưa có bug | Chưa rõ nguyên nhân, hoặc chưa có bug report | **Cấm commit.** Phân tích, sửa test hoặc mở bug |
| `@KnownBug:<BUG_ID>` | Có bug đang mở, TC đúng theo REQ | Giữ nguyên assertion, đánh dấu expected-fail chặt, được commit |
| Bug đã sửa | Test bỗng PASS | Pipeline báo đỏ để buộc gỡ tag và expected-fail |

```typescript
// Playwright
test('CRM_CUST_TC_018 - ...', async ({ page }) => {
  test.fail(true, '<BUG_ID>');
  // assertion giữ nguyên theo TC
});
```
```python
# pytest
@pytest.mark.xfail(strict=True, raises=AssertionError, reason="<BUG_ID>")
```
```java
// TestNG
@Test(expectedExceptions = AssertionError.class, description = "@KnownBug:<BUG_ID>")
```

- **Không dùng `skip`, `fixme`, hay `xfail` không `strict`** — bug được sửa mà không ai biết
- Sau khi gắn, mở report kiểm test fail **đúng assertion phơi bug**. `test.fail()` nhận mọi lỗi, kể cả locator gãy
- Báo cáo tách nhóm **Đang phơi bug**: không tính PASS, bug vẫn đếm vào tiêu chí exit
- Runner có thể ghi các test này là pass hoặc skip. Trước khi đẩy kết quả lên Xray phải chuyển chúng thành FAIL

## 7. Report

Mọi script sinh ra phải tuân thủ [`reporting_rules.md`](reporting_rules.md): tên test Tiếng Việt, Description/Severity/Tags/TC ID, step `Arrange`/`Act`/`Assert` trong Test Body, screenshot cuối **mọi** test (cả PASS), KHÔNG attachment `stdout`.

## 8. Tính Độc Lập Của Test (Test Independence)

- Mỗi test case phải **độc lập** — không phụ thuộc kết quả test khác.
- Setup/teardown rõ ràng (`@BeforeMethod/@AfterMethod` hoặc `beforeEach/afterEach`).
- Không chia sẻ state giữa các test methods.