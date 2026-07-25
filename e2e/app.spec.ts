import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('demo login, dashboard and accessible shell', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(
    page.getByRole('heading', { name: 'Commercial operations dashboard' }),
  ).toBeVisible();
  await expect(page.getByText('Demo mode')).toBeVisible();

  const accessibilityScanResults = await new AxeBuilder({ page }).exclude('.chart').analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});

test('customers can be filtered and created in demo mode', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('link', { name: /Customers/ }).click();
  await page.getByPlaceholder('Company, city or contact').fill('Northwind');
  await expect(page.getByText('Northwind Manufacturing')).toBeVisible();

  await page.getByLabel('Company').fill('Zenith Field Services');
  await page.getByLabel('Contact').fill('Lia Gomez');
  await page.getByLabel('Email').fill('lia.gomez@example.com');
  await page.getByLabel('Segment').fill('Services');
  await page.getByLabel('City').fill('Rio de Janeiro');
  await page.getByRole('button', { name: 'Save customer' }).click();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.getByText('Zenith Field Services')).toBeVisible();
});

test('role based access denies analyst user management', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').selectOption('analyst@example.com');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.goto('/users');
  await expect(page.getByRole('heading', { name: 'Access denied' })).toBeVisible();
});

test('logout returns to login', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('link', { name: /Profile/ }).click();
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(
    page.getByRole('heading', { name: 'Sign in to Enterprise Operations' }),
  ).toBeVisible();
});

test('mobile viewport keeps protected dashboard navigation usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/login');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(
    page.getByRole('heading', { name: 'Commercial operations dashboard' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Toggle navigation' }).click();
  await expect(page.getByRole('link', { name: /Customers/ })).toBeVisible();
});
