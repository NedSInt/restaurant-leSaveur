import { test, expect } from '@playwright/test';

test('Realizar login e salvar o estado', async ({ page }) => {
    await page.goto('http://localhost:5173/login');

    await page.fill('input[id="login"]', 'jhonatan');
    await page.fill('input[id="senha"]', 'TESTE');

    await page.click('button[type="submit"]');

    await page.waitForNavigation();

    await page.context().storageState({ path: 'storageState.json' });
});
