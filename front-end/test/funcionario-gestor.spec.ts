// Importação de bibliotecas de teste
import { describe, it, expect, vi } from 'vitest';
import FuncionarioGestor from '../src/app/funcionario/funcionario-gestor.ts';
import Funcionario from '../src/app/funcionario/funcionario.ts';
import Requisicao from '../src/app/requisicao.ts';

// Mock dos dados retornados pelo backend
const FUNCIONARIOS_VALIDOS = [
  new Funcionario(1, 'Jhonatan', 'jhonatan'),
  new Funcionario(2, 'Lucas', 'lucas'),
  new Funcionario(3, 'Thiago', 'thiago'),
];

const FUNCIONARIOS_VAZIOS = [];

// Mock da classe Requisicao
vi.mock('../src/app/requisicao.ts', () => {
  return {
    default: {
      get: vi.fn(),
    },
  };
});

describe('GestorFuncionário', () => {
  describe('consultarFuncionários', () => {
    it('Dado que o backend retorne dados válidos, então deve-se garantir que o retorno seja um array', async () => {
      Requisicao.get.mockResolvedValue(FUNCIONARIOS_VALIDOS);

      const gestor = new FuncionarioGestor();

      const funcionarios = await gestor.consultarFuncionarios();

      expect(Array.isArray(funcionarios)).toBe(true);
      expect(funcionarios.length).toBeGreaterThanOrEqual(1);
      expect(funcionarios).toEqual(FUNCIONARIOS_VALIDOS);
    });

    it('Dado que o backend não retorne nenhum dado, então deve-se garantir que o retorno seja um array vazio', async () => {
      Requisicao.get.mockResolvedValue(FUNCIONARIOS_VAZIOS);

      const gestor = new FuncionarioGestor();

      const funcionarios = await gestor.consultarFuncionarios();

      expect(Array.isArray(funcionarios)).toBe(true);
      expect(funcionarios).toHaveLength(0);
    });
  });
});
