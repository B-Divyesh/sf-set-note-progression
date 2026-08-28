import { expect, test, type Page } from '@playwright/test';

const checkoutUrl = 'https://api.sociobot.in/api/v1/products/set-note-progression/checkout';

async function createExercise(page: Page, options: { name?: string; sets?: string; increment?: string } = {}): Promise<void> {
  await page.getByRole('button', { name: /Create first exercise|Add exercise/ }).click();
  await page.getByLabel('Exercise name').fill(options.name ?? 'Standing press');
  if (options.sets) await page.getByLabel('Working sets').fill(options.sets);
  if (options.increment) await page.getByLabel('Load increase').fill(options.increment);
  await page.getByRole('button', { name: 'Save exercise' }).click();
}

async function demoSessionCount(page: Page): Promise<number> {
  return page.evaluate(() => new Promise<number>((resolve, reject) => {
    const request = indexedDB.open('demo:set-note-progression');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const count = db.transaction('sessions').objectStore('sessions').count();
      count.onerror = () => reject(count.error);
      count.onsuccess = () => { db.close(); resolve(count.result); };
    };
  }));
}

test('cold desktop and 390px first screens show the audience, action, and three facts', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'The test covers both required viewport sizes itself.');
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    for (const locator of [
      page.locator('.hero .lede'),
      page.getByRole('link', { name: 'Try it with sample data' }),
      page.locator('.plain-facts'),
    ]) {
      await expect(locator).toBeVisible();
      const box = await locator.boundingBox();
      expect(box, 'required first-read content should have a layout box').not.toBeNull();
      expect(box!.y + box!.height, `content must fit within ${viewport.width}×${viewport.height}`).toBeLessThanOrEqual(viewport.height);
    }
  }
});

test('@claim:checkout-redirect the $19 buy action reaches Dodo Live checkout', async ({ page, request }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'One live identity probe is sufficient.');
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Buy unlimited exercises' })).toHaveAttribute('href', checkoutUrl);
  const response = await request.get(checkoutUrl, { maxRedirects: 0 });
  expect(response.status()).toBe(303);
  expect(response.headers()['location']).toMatch(/^https:\/\/checkout\.dodopayments\.com\/session\//);
});

test('quarter-unit increases stay exact after save and reload', async ({ page }) => {
  await page.goto('/log');
  await createExercise(page, { name: 'Quarter-step press', sets: '1', increment: '0.25' });
  const row = page.locator('[data-set]').first();
  await row.locator('[data-field="load"]').fill('60');
  await row.locator('[data-field="reps"]').fill('12');
  await page.getByRole('button', { name: 'Save workout and see next load' }).click();
  await expect(page.locator('[data-result]').getByRole('heading', { name: 'Increase to 60.25 kg' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { level: 2, name: 'Increase to 60.25 kg' })).toBeVisible();
});

test('free text is clearly saved-only and never described as an absent note', async ({ page }) => {
  await page.goto('/log');
  await createExercise(page, { sets: '1' });
  const row = page.locator('[data-set]').first();
  await expect(page.getByLabel('Set detail (saved only; does not change the rule)')).toBeVisible();
  await row.locator('[data-field="load"]').fill('60');
  await row.locator('[data-field="reps"]').fill('12');
  await page.getByLabel('Set detail (saved only; does not change the rule)').fill('Grip slipped badly');
  await page.getByRole('button', { name: 'Save workout and see next load' }).click();
  await expect(page.locator('[data-result]').getByRole('heading', { name: 'Increase to 62.5 kg' })).toBeVisible();
  await expect(page.locator('[data-result]').getByText('no limiting chip selected')).toBeVisible();
});

test('@claim:demo-isolation demo edits and licenses never enter real state and are discarded on exit', async ({ page }) => {
  await page.route('https://api.sociobot.in/**', (route) => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }),
  }));
  await page.goto('/?demo=1');
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  expect(await demoSessionCount(page)).toBe(2);

  for (const input of await page.locator('[data-field="reps"]').all()) await input.fill('10');
  await page.getByRole('button', { name: 'Save workout and see next load' }).click();
  await expect.poll(() => demoSessionCount(page)).toBe(3);
  await page.goto('/backup?demo=1#license');
  await page.getByLabel('Have a license? Paste it here').fill('demo-only-license');
  await page.getByRole('button', { name: 'Verify license' }).click();
  expect(await page.evaluate(() => ({
    real: localStorage.getItem('sb_license:set-note-progression'),
    demo: localStorage.getItem('demo:sb_license:set-note-progression'),
  }))).toEqual({ real: null, demo: 'demo-only-license' });

  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/log$/);
  await expect(page.getByRole('heading', { name: 'No exercises yet' })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('sb_license:set-note-progression'))).toBeNull();
  await page.goto('/backup');
  await expect(page.getByText('Unlimited exercises are active.')).toHaveCount(0);
  await page.goto('/demo');
  await expect.poll(() => demoSessionCount(page)).toBe(2);
  expect(await page.evaluate(() => localStorage.getItem('demo:sb_license:set-note-progression'))).toBeNull();
});

test('@claim:license-restore a pasted license restores access in a fresh browser store', async ({ page }) => {
  await page.route('https://api.sociobot.in/**', (route) => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }),
  }));
  await page.goto('/backup');
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
  await page.getByLabel('Have a license? Paste it here').fill('portable-license-token');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByText('Unlimited exercises are active.')).toBeVisible();
  await page.reload();
  await expect(page.getByText('Unlimited exercises are active.')).toBeVisible();
});

test('exercise mistakes can be closed, rejected, edited, and deleted', async ({ page }) => {
  await page.goto('/log');
  await page.getByRole('button', { name: 'Create first exercise' }).click();
  await page.getByLabel('Exercise name').fill('   ');
  await page.getByRole('button', { name: 'Save exercise' }).click();
  await expect(page.getByText('Enter an exercise name with at least one visible character.')).toBeVisible();
  await page.getByRole('button', { name: 'Close exercise form' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeHidden();

  await createExercise(page, { name: 'Press typo' });
  await page.getByRole('button', { name: 'Edit exercise' }).click();
  await page.getByLabel('Exercise name').fill('Standing press');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('option', { name: 'Standing press' })).toBeAttached();

  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Delete exercise' }).click();
  await expect(page.getByRole('heading', { name: 'No exercises yet' })).toBeVisible();
});

test('reps above 99 are rejected without saving a workout', async ({ page }) => {
  await page.goto('/log');
  await createExercise(page, { sets: '1' });
  const row = page.locator('[data-set]').first();
  await row.locator('[data-field="load"]').fill('60');
  await row.locator('[data-field="reps"]').fill('100');
  await page.getByRole('button', { name: 'Save workout and see next load' }).click();
  await expect(page.getByText('Reps must be a whole number from 1 to 99. Correct the marked set.')).toBeVisible();
  await expect(page.locator('[data-result]')).toHaveCount(0);
  await expect(page.getByText('Saved workouts will appear here after you log every set.')).toBeVisible();
});

test('landing links and buttons meet the 44px touch target baseline at 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const undersized = await page.locator('a, button').evaluateAll((elements) => elements
    .filter((element) => {
      const style = getComputedStyle(element);
      return style.visibility !== 'hidden' && style.display !== 'none';
    })
    .map((element) => {
      const rect = element.getBoundingClientRect();
      return { label: element.textContent?.trim() || element.getAttribute('aria-label'), width: rect.width, height: rect.height };
    })
    .filter(({ width, height }) => width < 44 || height < 44));
  expect(undersized).toEqual([]);
});
