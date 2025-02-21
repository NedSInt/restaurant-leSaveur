import { describe, it, expect, vi } from 'vitest';
import ReservaGestor from '../src/app/reserva/reserva-gestor.ts';
import Reserva from '../src/app/reserva/reserva.ts';
import Mesa from '../src/app/mesa/mesa.ts';
import Cliente from '../src/app/cliente/cliente.ts';
import Funcionario from '../src/app/funcionario/funcionario.ts';
import UtilReservaData from '../src/app/UtilDataReserva.ts';

import Requisicao from '../src/app/requisicao.ts';

// Mock do módulo de requisição
vi.mock('../src/app/requisicao', () => {
    return {
        default: {
            get: vi.fn(() => Promise.resolve([])),
            patch: vi.fn(() => Promise.resolve()),
            post: vi.fn(() => Promise.resolve({ id: 4, dataReserva: '2024-10-18 15:00', ativo: true, mesa: { id: 5, nome: 'Mesa 5' }, cliente: { id: 1, nome: 'Cliente Teste' }, funcionario: { id: 2, nome: 'Funcionario Teste', usuario: 'cliente' } })),
        },
    };
});

describe('GestorReserva', () => {
    describe('consultarReservas', () => {
        it('deve retornar a lista de reservas quando a requisição for bem-sucedida e houver cadastros de reservas no banco', async () => {
            const respostaMock = [
                {   
                    id: 1, 
                    dataReserva: '2024-10-16 15:00', 
                    ativo: true,
                    mesa: { id: 5, nome: 'Mesa 5' }, 
                    cliente: { id: 1, nome: 'Jhonatan Cliente', telefoneCelular: '22988765090' }, 
                    funcionario: { id: 2, nome: 'Lucas Funcionário', login: '' } 
                },
        
                {   
                    id: 2, 
                    dataReserva: '2024-10-12 15:00', 
                    ativo: false, 
                    mesa: { id: 2, nome: 'Mesa 2' }, 
                    cliente: { id: 1, nome: 'Lucas Cliente', telefoneCelular: '22988765094' },
                    funcionario: { id: 3, nome: 'Thiago Funcionário', login: '' } 
                },
        
                { 
                    id: 3, 
                    dataReserva: '2024-10-14 15:00', 
                    ativo: true, 
                    mesa: { id: 10, nome: 'Mesa 10' }, 
                    cliente: { id: 1, nome: 'Thiago Cliente', telefoneCelular: '22988765095' }, 
                    funcionario: { id: 1, nome: 'Jhonatan', login: '' } 
                }
            ];
            Requisicao.get.mockResolvedValue(respostaMock);
        
            const gestor = new ReservaGestor();
            const reservas = await gestor.consultarReservas();
        
            expect(Requisicao.get).toHaveBeenCalledWith('reservas');
            
            expect(reservas).toMatchObject(respostaMock);
        });

        it('deve retornar um array vazio quando a requisição for bem-sucedida e não houver cadastros de reservas no banco', async () => {
            const respostaMock = [];
            Requisicao.get.mockResolvedValue(respostaMock);

            const gestor = new ReservaGestor();
            const reservas = await gestor.consultarReservas();

            expect(Requisicao.get).toHaveBeenCalledWith('reservas');
            expect(reservas).toHaveLength(0);
        });
    });

    describe('consultarQuantidadeDeReservasEntreDatas', () => {
        it('deve chamar o método get corretamente com os parâmetros de data formatados', async () => {
            const respostaMock = [
                { id: 1, data: '2024-10-16 15:00:00', ativo: true, mesa: { id: 5, nome: 'Mesa 5' }, cliente: { id: 1, nome: 'Jhonatan Cliente' }, funcionario: { id: 2, nome: 'Lucas Funcionário', usuario: 'jhonatan' } },
                { id: 2, data: '2024-10-12 15:00:00', ativo: false, mesa: { id: 2, nome: 'Mesa 2' }, cliente: { id: 1, nome: 'Lucas Cliente' }, funcionario: { id: 3, nome: 'Thiago Funcionário', usuario: 'jhonatan' } }
            ];
            
            const dataMinima = new Date('2024-10-10 19:00:00');
            const dataMaxima = new Date('2024-10-20 19:00:00');
    
            Requisicao.get.mockResolvedValue(respostaMock);
    
            const gestor = new ReservaGestor();
            const reservas = await gestor.consultarQuantidadeDeReservasEntreDatas(dataMinima, dataMaxima);
    
            expect(Requisicao.get).toHaveBeenCalledWith('reservas/relatorio', {
                dataMinima: UtilReservaData.formatarDataParaRequisicao(dataMinima),
                dataMaxima: UtilReservaData.formatarDataParaRequisicao(dataMaxima),
            });
            expect(reservas).toHaveLength(2);
        });

        it('deve retornar um array vazio quando não houver reservas no intervalo de datas', async () => {
            const dataMinima = new Date('2024-11-01');
            const dataMaxima = new Date('2024-11-10');
            Requisicao.get.mockResolvedValue([]);

            const gestor = new ReservaGestor();
            const reservas = await gestor.consultarQuantidadeDeReservasEntreDatas(dataMinima, dataMaxima);

            expect(Requisicao.get).toHaveBeenCalledWith('reservas/relatorio', {
                dataMinima: UtilReservaData.formatarDataParaRequisicao(dataMinima),
                dataMaxima: UtilReservaData.formatarDataParaRequisicao(dataMaxima),
            });
            expect(reservas).toHaveLength(0);
        });
    });

    describe('cancelarReserva', () => {
        it('deve chamar o método patch corretamente para cancelar uma reserva', async () => {
            const id = 1;
            const respostaMock = { status: 200 };
            Requisicao.patch.mockResolvedValue(respostaMock);

            const gestor = new ReservaGestor();
            await gestor.cancelarReserva(id);

            expect(Requisicao.patch).toHaveBeenCalledWith('reservas/1/ativo', { ativo: 0 });
        });
    });

    it('deve lançar um erro se o ID da reserva for inválido', async () => {
        const idInvalido = null;
    
        const gestor = new ReservaGestor();
    
        await expect(gestor.cancelarReserva(idInvalido)).rejects.toThrow('ID inválido. Por favor, forneça um número inteiro positivo.');
    });

    it('deve chamar a função corretamente para diferentes IDs', async () => {
        const respostaMock = { status: 200 };
        Requisicao.patch.mockResolvedValue(respostaMock);
    
        const gestor = new ReservaGestor();
    
        const ids = [1, 2, 3];
        for (const id of ids) {
            await gestor.cancelarReserva(id);
            expect(Requisicao.patch).toHaveBeenCalledWith(`reservas/${id}/ativo`, { ativo: 0 });
        }
    });

    describe('cadastrar', () => {
        it('deve chamar o método post corretamente e retornar a reserva cadastrada', async () => {
            const reservaParaCadastrar = new Reserva(0, '2024-10-18 15:00', true, new Mesa(5, 'Mesa 5'), new Cliente(1, 'Cliente Teste'), new Funcionario(2, 'Funcionario Teste', 'cliente'));

            const gestor = new ReservaGestor();
            const reservaCadastrada = await gestor.cadastrar(reservaParaCadastrar);

            expect(Requisicao.post).toHaveBeenCalledWith('reservas', reservaParaCadastrar.dadosParaRequisicao());
            expect(reservaCadastrada).toBeInstanceOf(Reserva);
            expect(reservaCadastrada.id).toEqual(4);
            expect(reservaCadastrada.dataReserva).toBe('2024-10-18 15:00');
            expect(reservaCadastrada.mesa.id).toEqual(5);
            expect(reservaCadastrada.cliente.id).toEqual(1);
            expect(reservaCadastrada.funcionario.id).toEqual(2);
        });
    });
});
