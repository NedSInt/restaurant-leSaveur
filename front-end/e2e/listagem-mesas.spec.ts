import { test, expect } from '@playwright/test';
import { pegaProximoDiaFinalDeSemana, pegaProximaQuintaOuSexta } from './PO/gera-datas.ts';

test.use({
    storageState: 'storageState.json',
});

test.describe('Gestão de Mesas', () => {
    test.describe('Listagem de Mesas', () => {
        test('Deve garantir que apareça apenas 8 options de mesa quando a data selecionada for durante a semana', async ({ page }) => {
            await page.goto('http://localhost:5173/reserva');

            await page.fill('input#nomeCliente', 'João Silva');

            const dataTeste = pegaProximaQuintaOuSexta();

            await page.fill('input[type="date"]', dataTeste);
            await page.locator('input[type="date"]').blur();

            await page.fill('input#horaReserva', '13:00');
            await page.locator('input#horaReserva').blur();
            
            await page.waitForResponse((response) =>
            response.url().includes(`http://localhost:8080/mesas/disponiveis?dataReserva=${dataTeste}%2013:00:00`) && response.status() === 200
            );

            const countOptions = await page.locator('select#mesa option').count()

            expect(countOptions).toEqual(8);
        });

        test.skip('Deve garantir que apareça apenas 11 options de mesa quando a data selecionada for final de semana', async ({ page }) => {
            await page.goto('http://localhost:5173/reserva');

            await page.fill('input#nomeCliente', 'João Silva');

            const dataTeste = pegaProximoDiaFinalDeSemana()
            await page.fill('input[type="date"]', dataTeste);
            await page.locator('input[type="date"]').blur();

            await page.fill('input#horaReserva', '12:00');
            await page.locator('input#horaReserva').blur();
            
            await page.waitForResponse((response) =>
                response.url().includes(`http://localhost:8080/mesas/disponiveis?dataReserva=${dataTeste}%2012:00:00`) && response.status() === 200
            );

            const countOptions = await page.locator('select#mesa option').count()

            expect(countOptions).toEqual(11);
        });

    });
});