import { expect, test } from '@playwright/test';

test('@claim:offline-reload works offline after the first visit', async ({ page, context }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { level: 1, name: 'Log today’s sets' })).toBeVisible();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await page.waitForFunction(async () => {
    const script = document.querySelector<HTMLScriptElement>('script[src*="/assets/"]');
    return Boolean(script && await caches.match(script.src));
  });
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'Increase to 62.5 kg' })).toBeVisible();
});

test('@claim:local-only demo workout data causes no cross-origin requests', async ({ page }) => {
  const outgoing: string[] = [];
  page.on('request', (request) => outgoing.push(request.url()));
  await page.goto('/demo');
  const rows = page.locator('[data-set]');
  for (let index = 0; index < 3; index += 1) await rows.nth(index).locator('[data-field="reps"]').fill('10');
  await page.getByRole('button', { name: 'Save workout and see next load' }).click();
  await expect(page.locator('[data-result]').getByRole('heading', { name: 'Add reps at 62.5 kg' })).toBeVisible();
  const productOrigin = new URL(page.url()).origin;
  expect(outgoing.filter((url) => new URL(url).origin !== productOrigin)).toEqual([]);
});

test('@claim:progression-rule notes change the next-load decision', async ({ page }) => {
  await page.goto('/demo');
  const rows = page.locator('[data-set]');
  for (let index = 0; index < 3; index += 1) await rows.nth(index).locator('[data-field="reps"]').fill('12');
  await rows.nth(1).getByText('Grip slipped', { exact: true }).click();
  await page.getByRole('button', { name: 'Save workout and see next load' }).click();
  await expect(page.locator('[data-result]').getByRole('heading', { name: 'Hold at 62.5 kg' })).toBeVisible();
  await expect(page.locator('[data-result]').getByText('Hold because a limiting chip was selected. Repeat the load before adding reps.')).toBeVisible();
});

test('@claim:csv-export exports one row for every saved set', async ({ page }) => {
  await page.goto('/demo');
  await page.goto('/backup?demo=1');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  let csv = '';
  for await (const chunk of stream) csv += chunk.toString();
  expect(csv.split('\n').filter(Boolean)).toHaveLength(7);
  expect(csv).toContain('date,exercise,set,load,unit,reps,tags,note,next_action,next_load');
});

test('@claim:encrypted-backup hides workout text and restores its format', async ({ page }) => {
  await page.goto('/demo');
  await page.goto('/backup?demo=1');
  await page.getByLabel('Backup password').fill('sample-password');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download encrypted backup' }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  let content = '';
  for await (const chunk of stream) content += chunk.toString();
  const backup = JSON.parse(content);
  expect(backup).toMatchObject({ format: 'set-note-progression-encrypted', algorithm: 'AES-GCM' });
  expect(content).not.toContain('Barbell bench press');
  const filePath = await download.path();
  if (!filePath) throw new Error('Encrypted backup did not finish downloading.');
  await page.getByLabel('Backup file').setInputFiles(filePath);
  await page.getByLabel('Password (only for encrypted files)').fill('sample-password');
  await page.getByRole('button', { name: 'Import backup' }).click();
  await expect(page.getByText('Backup imported into this browser.')).toBeVisible();
  expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain('sample-password');
});

test('@claim:paid-unlimited a verified license removes the three-exercise limit', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Add exercise' }).click();
  await page.getByLabel('Exercise name').fill('Cable fly');
  await page.getByRole('button', { name: 'Save exercise' }).click();
  await expect(page.getByText('The free log holds three exercises.')).toBeVisible();
  await page.route('https://api.sociobot.in/**', (route) => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }),
  }));
  await page.goto('/backup?demo=1#license');
  await page.getByLabel('Have a license? Paste it here').fill('test-license-token');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByText('Unlimited exercises are active.')).toBeVisible();
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Add exercise' }).click();
  await page.getByLabel('Exercise name').fill('Cable fly');
  await page.getByRole('button', { name: 'Save exercise' }).click();
  await expect(page.getByRole('option', { name: 'Cable fly' })).toBeAttached();
});
