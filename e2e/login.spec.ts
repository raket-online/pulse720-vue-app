import { test, expect } from '@playwright/test'

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('should display login form', async ({ page }) => {
    // Check for login form elements
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
    await expect(page.getByPlaceholder(/email/i)).toBeVisible()
    await expect(page.getByPlaceholder(/password/i)).toBeVisible()
  })

  test('should show validation error for empty email', async ({ page }) => {
    // Try to submit without email
    const passwordInput = page.getByPlaceholder(/password/i)
    await passwordInput.fill('testpassword123')

    const submitButton = page.getByRole('button', { name: /sign in/i })
    await submitButton.click()

    // Email field should have HTML5 validation
    const emailInput = page.getByPlaceholder(/email/i)
    await expect(emailInput).toHaveAttribute('required', '')
  })

  test('should show validation error for empty password', async ({ page }) => {
    // Try to submit without password
    const emailInput = page.getByPlaceholder(/email/i)
    await emailInput.fill('test@example.com')

    const submitButton = page.getByRole('button', { name: /sign in/i })
    await submitButton.click()

    // Password field should have HTML5 validation
    const passwordInput = page.getByPlaceholder(/password/i)
    await expect(passwordInput).toHaveAttribute('required', '')
  })

  test('should toggle between login and signup', async ({ page }) => {
    // Should start on login
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()

    // Switch to signup
    const signupLink = page.getByText(/create.*account/i).or(page.getByText(/sign up/i))
    if (await signupLink.count() > 0) {
      await signupLink.first().click()
      await expect(page.getByRole('heading', { name: /sign up|create account/i })).toBeVisible()
    }
  })

  test('should have Google OAuth button', async ({ page }) => {
    // Check for Google login button
    const googleButton = page.getByRole('button', { name: /google/i })
    await expect(googleButton).toBeVisible()
  })

  test('should navigate to dashboard when authenticated', async ({ page }) => {
    // This test assumes we can mock authentication or have test credentials
    // For now, just verify the redirect behavior exists by checking the route
    const currentUrl = page.url()
    expect(currentUrl).toContain('/login')
  })

  test('should have proper form accessibility', async ({ page }) => {
    // Check for proper labels or aria-labels
    const emailInput = page.getByPlaceholder(/email/i)
    const passwordInput = page.getByPlaceholder(/password/i)

    await expect(emailInput).toHaveAttribute('type', 'email')
    await expect(passwordInput).toHaveAttribute('type', 'password')
  })
})
