import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page loads without errors
    await expect(page).toHaveTitle(/Asadul Islam Arif/);
    
    // Check if hero section is visible
    await expect(page.locator('h1')).toContainText('Hi, I\'m Asadul Islam Arif');
    
    // Check if navigation is present
    await expect(page.locator('nav')).toBeVisible();
    
    // Check if featured projects section is present
    await expect(page.locator('text=Featured Projects')).toBeVisible();
  });

  test('should navigate to different pages', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation links
    await page.click('text=Projects');
    await expect(page).toHaveURL('/projects');
    
    await page.click('text=About');
    await expect(page).toHaveURL('/');
    
    await page.click('text=Writing');
    await expect(page).toHaveURL('/writing');
    
    await page.click('text=Contact');
    await expect(page).toHaveURL('/contact');
  });

  test('should toggle dark mode', async ({ page }) => {
    await page.goto('/');
    
    // Check if theme toggle button exists
    const themeToggle = page.locator('button[aria-label="Toggle theme"]');
    await expect(themeToggle).toBeVisible();
    
    // Click theme toggle
    await themeToggle.click();
    
    // Check if dark mode is applied (body should have dark class)
    await expect(page.locator('body')).toHaveClass(/dark/);
  });

  test('should have working project links', async ({ page }) => {
    await page.goto('/');
    
    // Check if project cards are present
    const projectCards = page.locator('[data-testid="project-card"]');
    await expect(projectCards).toHaveCount(3); // Should have 3 featured projects
    
    // Click on first project card
    await projectCards.first().click();
    
    // Should navigate to project detail page
    await expect(page).toHaveURL(/\/projects\/.+/);
  });
});
