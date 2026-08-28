import { expect, test } from '@playwright/test';
import axe from 'axe-core';

test('landing and demo have no serious accessibility findings', async ({ page }) => {
  await page.addInitScript({ content: axe.source });
  for (const route of ['/', '/demo', '/backup', '/privacy', '/terms', '/404.html']) {
    await page.goto(route);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    const results = await page.evaluate(async () => (window as typeof window & { axe: typeof axe }).axe.run());
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  }
});

test('the first exercise can be created with a keyboard path', async ({ page }) => {
  await page.goto('/log');
  await page.getByRole('button', { name: 'Create first exercise' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', { name: 'Add an exercise' })).toBeVisible();
  await page.getByLabel('Exercise name').fill('Romanian deadlift');
  await page.getByRole('button', { name: 'Save exercise' }).click();
  await expect(page.getByRole('combobox', { name: 'Exercise' })).toHaveValue(/.+/);
});

test('the exercise dialog returns focus and the landing page survives 200% text', async ({ page }) => {
  await page.goto('/log');
  const opener = page.getByRole('button', { name: 'Create first exercise' });
  await opener.click();
  await page.getByRole('button', { name: 'Close exercise form' }).focus();
  await page.keyboard.press('Enter');
  await expect(opener).toBeFocused();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
});
