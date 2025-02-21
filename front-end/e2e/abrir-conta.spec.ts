import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.use({
    storageState: 'storageState.json',
});

test.describe('Abrir Conta', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${BASE_URL}/abrir-conta`);
    });

    test('Deve carregar a página de abrir conta corretamente', async ({ page }) => {
        await expect(page.locator('h1')).toHaveText('Abrir conta');
        await expect(page.locator('#abrir-conta')).toBeVisible();
        await expect(page.locator('#button-abrir-conta')).toBeVisible();
    });

    test('Deve exibir erro ao tentar abrir conta sem preencher os campos obrigatórios', async ({ page }) => {
        await page.click('#button-abrir-conta');
        
        const erroNomeCliente = page.locator('#nomeCliente:invalid');
        const erroMesa = page.locator('#mesa:invalid');
        
        await expect(erroNomeCliente).toBeVisible();
        await expect(erroMesa).toBeVisible();
    });

    test('Deve permitir preencher os campos e submeter o formulário corretamente', async ({ page }) => {
        await page.fill('#nomeCliente', 'João Silva');
        await page.selectOption('#mesa', { index: 1 });
        await page.click('#button-abrir-conta');

        await expect(page.locator('.swal2-title')).toHaveText('Conta aberta com sucesso');
    });
    
});