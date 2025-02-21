import { test, expect } from '@playwright/test';
import { pegaDataEntreSegundaEQuarta, pegaDatasAleatoriaEntreQuintaEDomingo } from './PO/gera-datas.ts';

test.use({
    storageState: 'storageState.json',
});
test.describe('Gestão de Reservas', () => {
    test.describe('Cadastro de Reservas', () => { 
        test('Deve garantir que o título da página de cadastro de reservas tenha o nome especificado', async ( { page } ) => {
          await page.goto('http://localhost:5173/reserva');
        
          await expect(page).toHaveTitle('Restaurante La Saveur - Reservar');
     
        });
        test('Deve carregar a tela de cadastro com campos de entrada', async ({ page }) => {
            await page.goto('http://localhost:5173/reserva');
            
            // await expect(page.locator('select#funcionario')).toBeVisible();
            await expect(page.locator('input#nomeCliente')).toBeVisible();
            await expect(page.locator('input#dataReserva')).toBeVisible();
            await expect(page.locator('input#horaReserva')).toBeVisible();
            await expect(page.locator('select#mesa')).toBeVisible();
        });


        // test('Deve garantir que seja possível selecionar um option de funcionário com os funcionários já cadastrados no banco de dados', async ( { page } ) => {
        //     await page.goto('http://localhost:5173/reserva');
          
        //     const optionsFuncionario = await page.locator('#funcionario option');
        //     const secondOptionValue = await optionsFuncionario.nth(1).getAttribute('value');

        //     await page.selectOption('#funcionario', secondOptionValue!);

        //     const selectedOption = await page.locator('#funcionario option:checked');
        //     await expect(selectedOption).toHaveText(await optionsFuncionario.nth(1).innerText());
       
        // });

        test('Deve exibir mensagem de erro quando a hora selecionada for antes de 11:00', async ({ page }) => {
            await page.goto('http://localhost:5173/reserva');
            
            await page.fill('input#nomeCliente', 'João Silva');
            
            await page.fill('input[type="date"]', pegaDatasAleatoriaEntreQuintaEDomingo());
            await page.locator('input[type="date"]').blur();
            
            await page.fill('input#horaReserva', '10:30');
            
            await page.locator('input#horaReserva').blur();
            
            const errorMessage = await page.locator('div.mensagem-erro >> text=Value must be 11:00 or later');
            
            expect(await errorMessage.isVisible()).toBe(true);
        });   
        test('Deve exibir mensagem de erro quando a data selecionada for anterior ao dia atual', async ({ page }) => {
            await page.goto('http://localhost:5173/reserva');
            
            await page.fill('input#nomeCliente', 'João Silva');
            
            await page.fill('input[type="date"]', '2023-12-12');
            await page.locator('input[type="date"]').blur();
            
            await page.fill('input#horaReserva', '16:30');
            
            await page.locator('input#horaReserva').blur();

            const today = new Date();

            const errorMessage = await page.locator(`div.mensagem-erro >> text=A data de solicitação da reserva deve ser posterior à data atual.`);
            
            expect(await errorMessage.isVisible()).toBe(true);
        });
        test('Deve exibir mensagem de erro quando a data selecionada for um dia entre segunda-feira e quarta-feira', async ({ page }) => {
            await page.goto('http://localhost:5173/reserva');
            
            await page.fill('input#nomeCliente', 'João Silva');
            
            await page.fill('input[type="date"]', pegaDataEntreSegundaEQuarta());
            await page.locator('input[type="date"]').blur();
            
            await page.fill('input#horaReserva', '16:30');
            
            await page.locator('input#horaReserva').blur();

            const errorMessage = await page.locator(`div.mensagem-erro >> text=Solicitação de reserva só é permitido para: quinta-feira, sexta-feira, sábado, domingo.`);
            
            expect(await errorMessage.isVisible()).toBe(true);
        });
        
        test('Deve salvar corretamente quando os dados forem corretos.', async ({ page }) => {
            await page.goto('http://localhost:5173/reserva');
            
            await page.fill('input#nomeCliente', 'João Silva');
            await page.fill('input#telefoneCelular', '(22)98876-5923');
            const dataParaTeste = pegaDatasAleatoriaEntreQuintaEDomingo();
            await page.fill('input[type="date"]', dataParaTeste);
            await page.locator('input[type="date"]').blur();
            await page.fill('input#horaReserva', '16:30');
            await page.locator('input#horaReserva').blur();
        
            await page.waitForResponse((response) =>
                response.url().includes(`http://localhost:8080/mesas/disponiveis?dataReserva=${dataParaTeste}%2016:30:00`) && response.status() === 200
            );
        
            const optionsMesa = await page.locator('#mesa option');
            const firstMesaValue = await optionsMesa.nth(1).getAttribute('value');
            await page.selectOption('#mesa', firstMesaValue!);
        
            await page.click('button#salvarReserva');
        
            const swalTitle = await page.locator('.swal2-title');
            await expect(swalTitle).toBeVisible();
            await expect(swalTitle).toHaveText('Reserva cadastrada com sucesso');
        
            const swalHtml = await page.locator('.swal2-html-container');
            await expect(swalHtml).toContainText('Data:');
            await expect(swalHtml).toContainText('Mesa:');
            await expect(swalHtml).toContainText('Cliente:');
            await expect(swalHtml).toContainText('Funcionário:');
        
            const okButton = await page.locator('.swal2-confirm');
            await okButton.click();
        
            await expect(swalTitle).toBeHidden();
        });        
        
    });
});