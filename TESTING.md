# Testing Guide

This project uses **Vitest** for unit/component tests and **Playwright** for end-to-end tests.

## Unit & Component Tests (Vitest)

### Running Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode (for development)
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

Tests are located next to the files they test in `__tests__` directories:

- Service tests: `src/services/__tests__/*.test.ts`
- Component tests: `src/components/**/__tests__/*.test.ts`
- Store tests: `src/stores/__tests__/*.test.ts`

#### Example Service Test

```typescript
import { describe, it, expect, vi } from 'vitest'
import { createPillar } from '../pillar'
import { supabase } from '@/lib/supabase'

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

describe('createPillar', () => {
  it('should create a pillar successfully', async () => {
    // Test implementation
  })
})
```

#### Example Component Test

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PillarCard from '../PillarCard.vue'

describe('PillarCard', () => {
  it('renders pillar title correctly', () => {
    const wrapper = mount(PillarCard, {
      props: {
        pillar: mockPillar,
      },
    })
    expect(wrapper.text()).toContain('Test Pillar')
  })
})
```

### Test Setup

- **Environment**: happy-dom (lightweight DOM implementation)
- **Globals**: Vitest globals enabled (describe, it, expect)
- **Setup file**: `src/test/setup.ts` (mocks environment variables)
- **Coverage**: v8 provider with HTML reports

## End-to-End Tests (Playwright)

### Running E2E Tests

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# View last test report
npm run test:e2e:report
```

### Writing E2E Tests

E2E tests are located in the `e2e/` directory at the project root.

#### Example E2E Test

```typescript
import { test, expect } from '@playwright/test'

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('should display login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
  })
})
```

### E2E Test Configuration

- **Browser**: Chromium (can be extended to Firefox, WebKit)
- **Base URL**: http://localhost:5173 (auto-starts dev server)
- **Traces**: Captured on first retry
- **Screenshots**: Captured on failure
- **Reports**: HTML reports in `playwright-report/`

## Test Coverage Goals

| Type | Target | Current |
|------|--------|---------|
| Services | 80%+ | 🎯 In progress |
| Components | 70%+ | 🎯 In progress |
| Stores | 80%+ | 📝 TODO |
| E2E Critical Paths | 100% | 📝 TODO |

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npm test -- --run
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

## Best Practices

### Unit Tests
- ✅ Test public APIs, not implementation details
- ✅ Use meaningful test descriptions
- ✅ Mock external dependencies (Supabase, APIs)
- ✅ Test error cases, not just happy paths
- ✅ Keep tests fast and isolated

### Component Tests
- ✅ Test user interactions, not internals
- ✅ Test accessibility (ARIA roles, labels)
- ✅ Test emitted events
- ✅ Use semantic queries (getByRole, getByText)
- ✅ Avoid testing CSS classes when possible

### E2E Tests
- ✅ Test critical user journeys
- ✅ Use Page Object Model for complex flows
- ✅ Test in isolation (independent tests)
- ✅ Use test data that's easy to clean up
- ✅ Focus on integration, not implementation

## Debugging Tests

### Vitest
```bash
# Run tests in debug mode
npm test -- --reporter=verbose

# Run specific test file
npm test src/services/__tests__/pillar.test.ts

# Update snapshots
npm test -- -u
```

### Playwright
```bash
# Debug mode with browser UI
npm run test:e2e -- --debug

# Run specific test file
npm run test:e2e e2e/login.spec.ts

# Run in headed mode
npm run test:e2e -- --headed
```

## Mocking Supabase

All service tests mock the Supabase client to avoid hitting the real database:

```typescript
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
    }),
  },
}))
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
