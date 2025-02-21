import { describe, it, expect, beforeEach, vi } from 'vitest';
import FuncionarioVisao from '../src/app/funcionario/funcionario-visao.ts';
import Funcionario from '../src/app/funcionario/funcionario.ts';

vi.mock('./funcionario-controladora.ts', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      listarOptions: vi.fn(),
    })),
  };
});

describe('FuncionarioVisao', () => {
  let visao: FuncionarioVisao;

  beforeEach(() => {
    document.body.innerHTML = '<select id="funcionario"></select>';
    visao = new FuncionarioVisao();
  });

    it('deve adicionar opções ao elemento select', () => {
        const funcionarios: Funcionario[] = [
        { id: 1, nome: 'Funcionário 1', login: 'teste1' },
        { id: 2, nome: 'Funcionário 2', login: 'teste2' },
        ];

        visao.desenharOptionsFuncionarios(funcionarios);

        const selectFuncionario = document.getElementById('funcionario') as HTMLSelectElement;

        expect(selectFuncionario?.children.length).toBe(2);
        expect(selectFuncionario?.children[0]).toHaveProperty('value', '1');
        expect(selectFuncionario?.children[0]?.innerText).toBe('Funcionário 1');
        expect(selectFuncionario?.children[1]).toHaveProperty('value', '2');
        expect(selectFuncionario?.children[1].innerText).toBe('Funcionário 2');
    });


  it('deve criar um elemento option corretamente', () => {
    const funcionario: Funcionario = { id: 3, nome: 'Funcionário 3', login: '' };

    const option = visao.criarOption(funcionario);

    expect(option.tagName).toBe('OPTION');
    expect(option.value).toBe('3');
    expect(option.innerText).toBe('Funcionário 3');
  });

  it('deve chamar listarOptions ao iniciar', () => {
    const listarOptionsMock = vi.spyOn(visao['funcionarioControladora'], 'listarOptions');
    visao.iniciarOptions();

    expect(listarOptionsMock).toHaveBeenCalledTimes(1);
  });
});
