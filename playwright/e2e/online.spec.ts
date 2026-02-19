import { test, expect } from '../support/fixtures';

test('webapp deve estar online', async ({ app, page }) => {
  await app.orderLookup.open();

  await expect(page).toHaveTitle(/Velô by Papito/);
});