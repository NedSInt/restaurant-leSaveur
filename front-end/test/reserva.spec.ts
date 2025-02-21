import { describe, it, expect } from 'vitest';
import Reserva from '../src/app/reserva/reserva.ts';
import Cliente from '../src/app/cliente/cliente.ts';
import Funcionario from '../src/app/funcionario/funcionario.ts';
import Mesa from '../src/app/mesa/mesa.ts';

describe('Reserva', () => {
  describe('Construtor', () => {
    it('Deve criar uma instância com valores passados no construtor', () => {
        const clienteMock = new Cliente(1, 'João');
        const funcionarioMock = new Funcionario(1, 'Jhonatan', 'jhonatan.pacheco');
        const mesaMock = new Mesa(1, 'Mesa 1');
        const reserva = new Reserva(1, '2024-12-10', true, mesaMock, clienteMock, funcionarioMock);

        expect(reserva.id).toBe(1);
        expect(reserva.dataReserva).toBe('2024-12-10');
        expect(reserva.ativo).toBe(true);
        expect(reserva.mesa).toBe(mesaMock);
        expect(reserva.cliente).toBe(clienteMock);
        expect(reserva.funcionario).toBe(funcionarioMock);
    });
  });

  describe('Método validar', () => {
    it('Deve retornar erro quando a dataReserva estiver vazia', () => {
        const clienteMock = new Cliente(1, 'João');
        const funcionarioMock = new Funcionario(1, 'Jhonatan', 'jhonatan.pacheco');
        const mesaMock = new Mesa(1, 'Mesa 1');
        const reserva = new Reserva(1, '', true, mesaMock, clienteMock, funcionarioMock);
        const problemas = reserva.validar();
        expect(problemas).toContain('A data da reserva não pode estar vazia.');
    });

    it('Deve retornar erro quando a mesa for inválida', () => {
        const clienteMock = new Cliente(1, 'João');
        const funcionarioMock = new Funcionario(1, 'Jhonatan', 'jhonatan.pacheco');
        const mesaMock = new Mesa(-1, 'Mesa 1');
        const reserva = new Reserva(1, '2024-12-10', true, mesaMock, clienteMock, funcionarioMock);
        const problemas = reserva.validar();
        expect(problemas).toContain('Mesa não encontrada.');
    });

    it('Deve retornar erro quando o funcionário for inválido', () => {
        const clienteMock = new Cliente(1, 'João');
        const funcionarioMock = new Funcionario(1, 'Jhonatan', 'jhonatan.pacheco');
        const mesaMock = new Mesa(-1, 'Mesa 1');

        const reserva = new Reserva(1, '2024-12-10', true, mesaMock, clienteMock, funcionarioMock);
        const problemas = reserva.validar();
        expect(problemas).toContain('Mesa não encontrada.');
    });

    it('Deve retornar erro quando o nome do cliente estiver vazio', () => {
      const clienteMock = new Cliente(1, '');
      const funcionarioMock = new Funcionario(1, 'Jhonatan', 'jhonatan.pacheco');
      const mesaMock = new Mesa(1, 'Mesa 1');

      const reserva = new Reserva(1, '2024-12-10', true, mesaMock, clienteMock, funcionarioMock);

      const problemas = reserva.validar();
      expect(problemas).toContain('Digite o nome do cliente.');
    });

    it('Não deve retornar problemas quando tudo estiver correto', () => {
        const clienteMock = new Cliente(1, 'João', '22988765098');
        const funcionarioMock = new Funcionario(1, 'Jhonatan', 'jhonatan.pacheco');
        const mesaMock = new Mesa(1, 'Mesa 1');
        const reserva = new Reserva(1, '2024-12-10', true, mesaMock, clienteMock, funcionarioMock);
        const problemas = reserva.validar();
        expect(problemas).toHaveLength(0);
    });
  });

  describe('Método dadosParaRequisicao', () => {
    it('Deve retornar os dados corretos para a requisição', () => {
        const clienteMock = new Cliente(1, 'João', "22988765098");
        const funcionarioMock = new Funcionario(1, 'Jhonatan', 'jhonatan.pacheco');
        const mesaMock = new Mesa(1, 'Mesa 1');
        const reserva = new Reserva(1, '2024-12-10', true, mesaMock, clienteMock, funcionarioMock);
        const dados = reserva.dadosParaRequisicao();

        expect(dados).toEqual({
            dataReserva: '2024-12-10',
            idMesa: 1,
            idFuncionario: 1,
            nomeCliente: 'João',
            telefoneCelular: "22988765098"
        });
    });
  });
});
