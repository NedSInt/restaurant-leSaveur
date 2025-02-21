import { describe, it, expect, vi } from 'vitest';
import ItemGestor from '../src/app/item/item-gestor';
import Item from '../src/app/item/item';
import Requisicao from '../src/app/requisicao';
import Funcionario from '../src/app/funcionario/funcionario';
import Produto from '../src/app/produto/produto';
import Categoria from '../src/app/categoria/categoria';

const ROTA = 'itens';
const ROTA_CONTAS = 'contas';

describe('ItemGestor', () => {
  it('deve retornar uma lista de itens ao consultar com sucesso', async () => {
    const itensMock = [
      { id: 1, produto: { id: 101, descricao: 'Pizza', categoria: { id: 10, nome: 'Comida' } }, funcionario: { id: 201, nome: 'Carlos' }, quantidade: 2, preco: 30.0 },
      { id: 2, produto: { id: 102, descricao: 'Suco', categoria: { id: 11, nome: 'Bebida' } }, funcionario: { id: 202, nome: 'Ana' }, quantidade: 1, preco: 10.0 }
    ];

    vi.spyOn(Requisicao, 'get').mockResolvedValue(itensMock);
    const itemGestor = new ItemGestor();
    const resultado = await itemGestor.consultarItens();

    expect(Requisicao.get).toHaveBeenCalledWith(ROTA);
    expect(resultado).toEqual(itensMock);
  });

  it('deve retornar uma lista vazia quando não há itens', async () => {
    vi.spyOn(Requisicao, 'get').mockResolvedValue([]);
    const itemGestor = new ItemGestor();
    const resultado = await itemGestor.consultarItens();

    expect(Requisicao.get).toHaveBeenCalledWith(ROTA);
    expect(resultado).toEqual([]);
  });

  it('deve lançar um erro quando a requisição de consulta falha', async () => {
    vi.spyOn(Requisicao, 'get').mockRejectedValue(new Error('Erro de conexão'));
    const itemGestor = new ItemGestor();

    await expect(itemGestor.consultarItens()).rejects.toThrow('Erro de conexão');
    expect(Requisicao.get).toHaveBeenCalledWith(ROTA);
  });

  it('deve cadastrar um item corretamente', async () => {
    const categoria = new Categoria(10, 'Comida');
    const produto = new Produto(101, 'Pizza', 'PZ101', 30.0, categoria);
    const funcionario = new Funcionario(201, 'Carlos', '');
    const itemMock = new Item(1, produto, funcionario, 2, 60.0);

    const respostaMock = {
      id: 1,
      produto: { id: 101, descricao: 'Pizza', codigo: 'PZ101', preco: 30.0, categoria: { id: 10, nome: 'Comida' } },
      funcionario: { id: 201, nome: 'Carlos' },
      quantidade: 2,
      preco: 60.0
    };

    vi.spyOn(Requisicao, 'post').mockResolvedValue(respostaMock);
    const itemGestor = new ItemGestor();
    const resultado = await itemGestor.cadastrar(itemMock, 123);

    expect(Requisicao.post).toHaveBeenCalledWith(`${ROTA_CONTAS}/123/${ROTA}`, itemMock.dadosParaRequisicao());
    expect(resultado).toBeInstanceOf(Item);
    expect(resultado.id).toBe(1);
    expect(resultado.preco).toBe(60.0);
  });

  it('deve lançar um erro ao tentar cadastrar um item e a requisição falhar', async () => {
    const categoria = new Categoria(10, 'Comida');
    const produto = new Produto(101, 'Pizza', 'PZ101', 30.0, categoria);
    const funcionario = new Funcionario(201, 'Carlos', '');
    const itemMock = new Item(1, produto, funcionario, 2, 60.0);

    vi.spyOn(Requisicao, 'post').mockRejectedValue(new Error('Erro ao cadastrar item'));
    const itemGestor = new ItemGestor();

    await expect(itemGestor.cadastrar(itemMock, 123)).rejects.toThrow('Erro ao cadastrar item');
    expect(Requisicao.post).toHaveBeenCalledWith(`${ROTA_CONTAS}/123/${ROTA}`, itemMock.dadosParaRequisicao());
  });

  it('deve consultar itens de uma conta corretamente', async () => {
    const respostaMock = [
      {
        id: 1,
        produto: { id: 101, descricao: 'Pizza', codigo: 'PZ101', preco: 30.0, categoria: { id: 10, nome: 'Comida' } },
        funcionario: { id: 201, nome: 'Carlos' },
        quantidade: 2,
        preco: 60.0
      }
    ];

    vi.spyOn(Requisicao, 'get').mockResolvedValue(respostaMock);
    const itemGestor = new ItemGestor();
    const resultado = await itemGestor.consultarItensDaConta(123);

    expect(Requisicao.get).toHaveBeenCalledWith(`${ROTA_CONTAS}/123/${ROTA}`);
    expect(resultado).toHaveLength(1);
    expect(resultado[0]).toBeInstanceOf(Item);
    expect(resultado[0].preco).toBe(60.0);
  });

  it('deve retornar uma lista vazia ao consultar itens de uma conta sem itens', async () => {
    vi.spyOn(Requisicao, 'get').mockResolvedValue(null);
    const itemGestor = new ItemGestor();
    const resultado = await itemGestor.consultarItensDaConta(123);

    expect(Requisicao.get).toHaveBeenCalledWith(`${ROTA_CONTAS}/123/${ROTA}`);
    expect(resultado).toEqual([]);
  });

  it('deve lançar um erro ao tentar consultar itens de uma conta e a requisição falhar', async () => {
    vi.spyOn(Requisicao, 'get').mockRejectedValue(new Error('Erro ao consultar itens da conta'));
    const itemGestor = new ItemGestor();

    await expect(itemGestor.consultarItensDaConta(123)).rejects.toThrow('Erro ao consultar itens da conta');
    expect(Requisicao.get).toHaveBeenCalledWith(`${ROTA_CONTAS}/123/${ROTA}`);
  });
});