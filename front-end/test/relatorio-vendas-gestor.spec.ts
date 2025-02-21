import { describe, it, expect, vi } from 'vitest';
import RelatorioVendasGestor from '../src/app/relatorio/relatorios-vendas/relatorio-venda-gestor.ts';
import Requisicao from '../src/app/requisicao.ts';
import UtilReservaData from '../src/app/UtilDataReserva.ts';

vi.mock('../src/app/requisicao', () => {
    return {
        default: {
            get: vi.fn(() => Promise.resolve([])),
        },
    };
});

describe('RelatorioVendasGestor', () => {

    const dataMinima = new Date('2024-10-10 00:00:00');
    const dataMaxima = new Date('2024-10-20 23:59:59');

    describe('consultarQuantidadeDeVendasEntreDatasEFormaPagamento', () => {
        it('deve fazer a chamada correta com os parâmetros de data formatados e retornar os dados de vendas por forma de pagamento', async () => {
            const respostaMock = [
                { formaPagamento: 'Cartão', totalVendas: 1000 },
                { formaPagamento: 'Dinheiro', totalVendas: 500 },
            ];
            
            Requisicao.get.mockResolvedValue(respostaMock);

            const gestor = new RelatorioVendasGestor();
            const vendas = await gestor.consultarQuantidadeDeVendasEntreDatasEFormaPagamento(dataMinima, dataMaxima);

            expect(Requisicao.get).toHaveBeenCalledWith('relatorio/vendas/forma-pagamento', {
                dataMinima: UtilReservaData.formatarDataParaRequisicao(dataMinima),
                dataMaxima: UtilReservaData.formatarDataParaRequisicao(dataMaxima),
            });
            expect(vendas).toEqual(respostaMock);
        });

        it('deve retornar um array vazio quando não houver vendas no intervalo de datas', async () => {
            Requisicao.get.mockResolvedValue([]);

            const gestor = new RelatorioVendasGestor();
            const vendas = await gestor.consultarQuantidadeDeVendasEntreDatasEFormaPagamento(dataMinima, dataMaxima);

            expect(vendas).toHaveLength(0);
        });
    });

    describe('consultarQuantidadeDeVendasEntreDatasEFuncionario', () => {
        it('deve fazer a chamada correta com os parâmetros de data formatados e retornar os dados de vendas por funcionário', async () => {
            const respostaMock = [
                { funcionario: 'Jhonatan', totalVendas: 2000 },
                { funcionario: 'Lucas', totalVendas: 1500 },
            ];
            
            Requisicao.get.mockResolvedValue(respostaMock);

            const gestor = new RelatorioVendasGestor();
            const vendas = await gestor.consultarQuantidadeDeVendasEntreDatasEFuncionario(dataMinima, dataMaxima);

            expect(Requisicao.get).toHaveBeenCalledWith('relatorio/vendas/funcionario', {
                dataMinima: UtilReservaData.formatarDataParaRequisicao(dataMinima),
                dataMaxima: UtilReservaData.formatarDataParaRequisicao(dataMaxima),
            });
            expect(vendas).toEqual(respostaMock);
        });
    });

    describe('consultarQuantidadeDeVendasEntreDatasECategoria', () => {
        it('deve fazer a chamada correta com os parâmetros de data formatados e retornar os dados de vendas por categoria', async () => {
            const respostaMock = [
                { categoria: 'Bebidas', totalVendas: 3000 },
                { categoria: 'Comidas', totalVendas: 2500 },
            ];
            
            Requisicao.get.mockResolvedValue(respostaMock);

            const gestor = new RelatorioVendasGestor();
            const vendas = await gestor.consultarQuantidadeDeVendasEntreDatasECategoria(dataMinima, dataMaxima);

            expect(Requisicao.get).toHaveBeenCalledWith('relatorio/vendas/categoria', {
                dataMinima: UtilReservaData.formatarDataParaRequisicao(dataMinima),
                dataMaxima: UtilReservaData.formatarDataParaRequisicao(dataMaxima),
            });
            expect(vendas).toEqual(respostaMock);
        });
    });

    describe('consultarQuantidadeDeVendasEntreDatasEDia', () => {
        it('deve fazer a chamada correta com os parâmetros de data formatados e retornar os dados de vendas por dia', async () => {
            const respostaMock = [
                { dia: '2024-10-10', totalVendas: 1500 },
                { dia: '2024-10-12', totalVendas: 1800 },
            ];
            
            Requisicao.get.mockResolvedValue(respostaMock);

            const gestor = new RelatorioVendasGestor();
            const vendas = await gestor.consultarQuantidadeDeVendasEntreDatasEDia(dataMinima, dataMaxima);

            expect(Requisicao.get).toHaveBeenCalledWith('relatorio/vendas/dia', {
                dataMinima: UtilReservaData.formatarDataParaRequisicao(dataMinima),
                dataMaxima: UtilReservaData.formatarDataParaRequisicao(dataMaxima),
            });
            expect(vendas).toEqual(respostaMock);
        });
    });

});
