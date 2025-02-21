import { test, expect } from '@playwright/test';

test.use({
  storageState: 'storageState.json',
});

test.describe('Listagem de Funcionários', () => {
  test('Deve garantir que tenha o funcionário logado e adicionado ao localStorage para garantir que tenha funcionário alocado para reserva', async ({ page }) => {
      await page.goto('http://localhost:5173/reserva');

      const funcionarioLogado = await page.evaluate(() => {
          return JSON.parse(localStorage.getItem('dadosFuncionario') || '[]');
      });

      const funcionarioTesteEsperado = {
        id: 1,
        login: 'jhonatan',
        nome: 'Jhonatan',
        cargo: 'GERENTE'
      }

      expect(funcionarioLogado).toEqual(funcionarioTesteEsperado);
  });
});
