import { test, expect } from '@playwright/test';

test.use({
  storageState: 'storageState.json',
});

test.describe('Gestão de Reservas', () => {

  test.describe('Listagem de Reservas', () => { 

    test('Deve garantir que o título da página de listagem de reservas tenha o nome especificado', async ( { page } ) => {
      await page.goto('http://localhost:5173/listagem-reservas');
    
      await expect(page).toHaveTitle('Restaurante La Saveur - Listagem de Reservas');
 
    });
  });

  test.describe('Cancelamento de Reservas', () => {
    test('Deve garantir que quando selecionado o botão de cancelar reserva e confirmar a operação, o status da reserva seja alterado para cancelado', async ({ page }) => {
      await page.goto('http://localhost:5173/listagem-reservas');
      
      await page.waitForSelector('table.table-striped tbody tr');
  
      const rows = await page.locator('table.table-striped tbody tr');
  
      for (let i = 0; i < await rows.count(); i++) {
          const row = rows.nth(i);
  
          const cancelButton = row.locator('button:has-text("Cancelar Reserva")');
  
          if (await cancelButton.isVisible()) {
              const statusCell = row.locator('td.status');
              const status = await statusCell.textContent();
              
              if (status && status.trim() !== 'Cancelada') {
                  await cancelButton.click();
  
                  const confirmButton = page.locator('.swal2-confirm');
                  await expect(confirmButton).toBeVisible();
                  await confirmButton.click();
  
                  await page.waitForSelector(`table.table-striped tbody tr >> text="Cancelada"`);
  
                  await expect(statusCell).toHaveText('Cancelada');
  
                  break;
              }
          }
      }
  });  

  });



});
