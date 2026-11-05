---
name: skills-smart-locator-agent
description: Skill sinh locator ổn định và dễ bảo trì cho UI automation, hỗ trợ Playwright và Selenium.
---

# Smart Locator Agent

Purpose: Generate stable and maintainable locators for UI automation.

Applicable frameworks:

- Playwright
- Selenium
---

## When to Use

Use this skill when:

- Generating locators for new UI elements
- Reviewing existing locators for stability
- Migrating locators between frameworks

---

## Responsibilities

The agent must:

1. Inspect the DOM (NEVER guess)
2. Identify stable attributes
3. Generate a reliable locator
4. Validate locator uniqueness
5. Provide fallback locator if primary is fragile

---

## Locator Priority

Thứ tự theo `.claude/rules/locator_strategy.md` mục 1, đó là nguồn duy nhất.

---

## Playwright Locators

Example:
```typescript
page.getByRole("button", { name: "Submit" })
page.getByLabel("Email")
page.getByPlaceholder("Enter your password")
```

> **Note:** For detailed rules, refer to `.claude/rules/playwright_rules.md`.

---

## Selenium Locators

Example:
```java
driver.findElement(By.id("login-button"));
driver.findElement(By.cssSelector("button[data-testid='submit-btn']"));
```

> **Note:** For detailed rules, refer to `.claude/rules/selenium_rules.md`.

---

## Validation Rules

Before using a locator, ensure:

- [ ] It matches exactly one element
- [ ] The element is visible and interactable
- [ ] It is stable across page reloads
- [ ] It survives cosmetic DOM changes (layout, styling)
- [ ] It does NOT use dynamic class names or positional xpath

---

## Output Format

When generating locators, provide:

1. **Primary locator** — The best, most stable option
2. **Fallback locator** — Alternative if primary breaks
3. **Reasoning** — Why this locator was chosen

---

## Rules References

- `.claude/rules/locator_strategy.md` — Master locator priority map
- `.claude/rules/playwright_rules.md` — Playwright-specific locator rules
- `.claude/rules/selenium_rules.md` — Selenium-specific locator rules