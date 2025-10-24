import { test, expect } from '@playwright/test';

test.describe('Projects Page', () => {
  test('should load projects page successfully', async ({ page }) => {
    await page.goto('/projects');
    
    // Check if the page loads without errors
    await expect(page).toHaveTitle(/Projects/);
    
    // Check if page title is visible
    await expect(page.locator('h1')).toContainText('My Projects');
    
    // Check if search input is present
    await expect(page.locator('input[placeholder="Search projects..."]')).toBeVisible();
    
    // Check if category tabs are present
    await expect(page.locator('text=All')).toBeVisible();
    await expect(page.locator('text=Web Apps')).toBeVisible();
    await expect(page.locator('text=Cybersecurity Labs')).toBeVisible();
  });

  test('should filter projects by category', async ({ page }) => {
    await page.goto('/projects');
    
    // Click on Web Apps category
    await page.click('text=Web Apps');
    
    // Check if only Web Apps projects are shown
    const projectCards = page.locator('[data-testid="project-card"]');
    await expect(projectCards).toHaveCount(1); // Should have 1 Web Apps project
    
    // Click on Cybersecurity Labs category
    await page.click('text=Cybersecurity Labs');
    
    // Check if only Cybersecurity Labs projects are shown
    await expect(projectCards).toHaveCount(1); // Should have 1 Cybersecurity Labs project
  });

  test('should search projects', async ({ page }) => {
    await page.goto('/projects');
    
    // Search for "dashboard"
    await page.fill('input[placeholder="Search projects..."]', 'dashboard');
    
    // Check if only matching projects are shown
    const projectCards = page.locator('[data-testid="project-card"]');
    await expect(projectCards).toHaveCount(1); // Should have 1 project with "dashboard"
    
    // Clear search
    await page.fill('input[placeholder="Search projects..."]', '');
    
    // Check if all projects are shown again
    await expect(projectCards).toHaveCount(4); // Should have all 4 projects
  });

  test('should navigate to project detail page', async ({ page }) => {
    await page.goto('/projects');
    
    // Click on first project card
    const firstProject = page.locator('[data-testid="project-card"]').first();
    await firstProject.click();
    
    // Should navigate to project detail page
    await expect(page).toHaveURL(/\/projects\/.+/);
    
    // Check if project detail content is visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Back to Projects')).toBeVisible();
  });
});
