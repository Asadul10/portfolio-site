import { test, expect } from '@playwright/test';

test.describe('Contact Page', () => {
  test('should load contact page successfully', async ({ page }) => {
    await page.goto('/contact');
    
    // Check if the page loads without errors
    await expect(page).toHaveTitle(/Contact/);
    
    // Check if page title is visible
    await expect(page.locator('h1')).toContainText('Get In Touch');
    
    // Check if contact form is present
    await expect(page.locator('form')).toBeVisible();
    
    // Check if form fields are present
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
  });

  test('should validate contact form', async ({ page }) => {
    await page.goto('/contact');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Check if validation errors appear
    await expect(page.locator('text=Name must be at least 2 characters')).toBeVisible();
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
    await expect(page.locator('text=Message must be at least 10 characters')).toBeVisible();
  });

  test('should submit contact form successfully', async ({ page }) => {
    await page.goto('/contact');
    
    // Fill out the form
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('textarea[name="message"]', 'This is a test message for the contact form.');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Check if success message appears
    await expect(page.locator('text=Message sent successfully!')).toBeVisible();
  });

  test('should have contact information', async ({ page }) => {
    await page.goto('/contact');
    
    // Check if contact information is present
    await expect(page.locator('text=Email')).toBeVisible();
    await expect(page.locator('text=GitHub')).toBeVisible();
    await expect(page.locator('text=LinkedIn')).toBeVisible();
    
    // Check if contact links are present
    await expect(page.locator('a[href*="mailto:"]')).toBeVisible();
    await expect(page.locator('a[href*="github.com"]')).toBeVisible();
    await expect(page.locator('a[href*="linkedin.com"]')).toBeVisible();
  });
});
