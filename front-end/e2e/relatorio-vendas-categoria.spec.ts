import { test, expect } from '@playwright/test';

test.use({
  storageState: 'storageState.json',
});
test.skip('Relatório de Vendas por Categoria', () => {
  test('Deve gerar o gráfico corretamente ao submeter o filtro com as datas que possuem vendas', async ({ page }) => {
    await page.goto('http://localhost:5173/relatorio-vendas/categoria');

    await expect(page.locator('h1')).toHaveText('Relatório de Vendas por Período e Categoria');

    const dataInicial = new Date();
    dataInicial.setDate(1);
    const dataFinal = new Date();
    dataFinal.setDate(dataFinal.getDate());

    const dataInicialFormatada = dataInicial.toISOString().split('T')[0]
    const dataFinalFormatada = dataFinal.toISOString().split('T')[0]

    await page.fill('#startDate', dataInicialFormatada);
    await page.fill('#endDate', dataFinalFormatada);

    await page.click('button[type="submit"]');

    // await page.waitForResponse((response) =>
    //     response.url().includes(`http://localhost:8080/reservas/relatorio?dataMinima=${dataInicialFormatada}%2000:00:00&dataMaxima=${dataFinalFormatada}%2000:00:000`) && response.status() === 200
    // );  

    const canvas = page.locator('#reservationsChart');
    await expect(canvas).toBeVisible();

    const chartIsEmpty = await page.evaluate(() => {
      const canvas = document.getElementById('reservationsChart') as HTMLCanvasElement;
      const context = canvas.getContext('2d');
      if (!context) return false;
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      return imageData.data.some((pixel) => pixel !== 0);
    });

    expect(chartIsEmpty).toBe(true);
  });

  test('Deve exibir mensagem de erro quando não encontrar nenhuma venda', async ({ page }) => {
    await page.goto('http://localhost:5173/relatorio-vendas/categoria');

    await page.fill('#startDate', '2000-12-01');
    await page.fill('#endDate', '2000-12-31');

    await page.click('button[type="submit"]');

    const swalTitle = await page.locator('.swal2-title');
    await expect(swalTitle).toBeVisible();
    await expect(swalTitle).toHaveText('Nenhum dado encontrado');
  });
});
