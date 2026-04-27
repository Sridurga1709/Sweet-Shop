# Sweet Shop — Playwright Test Framework

End-to-end test suite for [Sweet Shop](https://sweetshop.netlify.app), covering navigation, product browsing, basket, checkout, login, and responsive behaviour across 4 browsers.

---

## Documentation

| Document | Link |
|----------|------|
| Test Strategy | [Google Doc](https://docs.google.com/document/d/1IwOJM0l50EeEqcAxBxep3K_PrTYUo-panepnC_A14Yo/edit?tab=t.0) |
| Test Scenarios | [Google Doc](https://docs.google.com/document/d/1Vvod6VQNyA8KhC4E0WDj7SzqxRYHPcMP16rQmiDWneE/edit?tab=t.0) |
| Test Cases | [Google Doc](https://docs.google.com/document/d/1ZdiQqtRSXyyMgNMLNBWvbBIM8Uz9RyJU-1n6e6RLdGs/edit?tab=t.0) |
| Traceability Matrix | [reports/traceability-matrix.md](reports/traceability-matrix.md) |
| Execution Report | [reports/execution-report.md](reports/execution-report.md) |

---

## Project Structure

```
├── pages/               # Page Object Models
│   ├── BasePage.ts      # Shared nav, hamburger menu, basket counter
│   ├── HomePage.ts
│   ├── SweetsPage.ts
│   ├── BasketPage.ts
│   ├── LoginPage.ts
│   └── AboutPage.ts
├── tests/               # Spec files (one per feature area)
│   ├── navigation.spec.ts
│   ├── home.spec.ts
│   ├── sweets.spec.ts
│   ├── about.spec.ts
│   ├── login.spec.ts
│   ├── basket.spec.ts
│   ├── checkout.spec.ts
│   └── responsive.spec.ts
├── test-data/           # Shared test data (users, products)
│   ├── users.ts
│   └── products.ts
├── reports/             # Traceability matrix and execution report
├── playwright-report/   # HTML report (generated after each run)
├── playwright.config.ts
└── package.json
```

---

## Test Coverage

| Feature | Test Cases | Status |
|---------|-----------|--------|
| Navigation | 5 | 4 pass, 1 known defect |
| Home Page | 4 | All pass |
| Sweets Page | 5 | All pass |
| About Page | 6 | All pass |
| Login Page | 8 | 2 pass, 5 known defects, 1 skipped |
| Basket Page | 6 | 5 pass, 1 known defect |
| Checkout | 13 | All pass (TC-056 skipped on Firefox) |
| Responsive | 9 | All pass |
| **Total** | **56** | **41 pass · 6 expected fail · 4 skip** |

Tests marked `test.fail()` document **known application defects** — they are expected to fail and do not break CI.

---

## Browsers

| Project | Device |
|---------|--------|
| `chromium` | Desktop Chrome |
| `firefox` | Desktop Firefox |
| `mobile-chrome` | Pixel 5 |
| `mobile-safari` | iPhone 12 |

---

## Prerequisites

```bash
node -v   # v18 or higher recommended
npm install
npx playwright install
```

---

## Running Tests

```bash
# Run all tests across all browsers
npm test

# Chromium only (fastest)
npm run test:chrome

# Firefox only
npm run test:firefox

# Mobile Chrome only
npm run test:mobile

# Watch the browser while tests run
npm run test:headed

# Interactive UI mode (pick tests, see traces live)
npm run test:ui

# Debug mode (step through tests)
npm run test:debug

# P1 priority tests only
npm run test:p1

# Single spec file
npm run test:navigation
npm run test:login
npm run test:basket
npm run test:checkout
npm run test:about
npm run test:responsive

# Open the HTML report from the last run
npm run report
```

---

## Configuration

Key settings in `playwright.config.ts`:

| Setting | Value |
|---------|-------|
| Base URL | https://sweetshop.netlify.app |
| Retries | 1 |
| Action timeout | 10,000 ms |
| Navigation timeout | 30,000 ms |
| Screenshots | On failure only |
| Traces | On first retry |
| Video | Retained on failure |

---

## Known Defects

| ID | Area | Description |
|----|------|-------------|
| DEF-001 | Navigation | About link on `/basket` navigates to `/bout` instead of `/about` |
| DEF-002 | Login | Any credentials redirect to a UUID page — no session is created |
| DEF-003 | Basket | Empty Basket button (`href="#"`) does not clear items |
| DEF-004 | Basket | Decimal-priced products cause NaN in delivery total calculation |
| DEF-005 | Checkout | Firefox logs browser-specific console errors during checkout |