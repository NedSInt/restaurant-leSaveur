import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProdutoGestor from '../src/app/produto/produto-gestor.ts';
import Requisicao from '../src/app/requisicao.ts';

vi.mock('../src/app/requisicao.ts', () => ({
    default: {
        get: vi.fn()
    }
}));

describe('ProdutoGestor', () => {
    let produtoGestor;

    beforeEach(() => {
        vi.clearAllMocks();
        produtoGestor = new ProdutoGestor();
    });

    it('deve retornar os produtos corretamente', async () => {
        const produtosMock = [
            { id: 1, idCategoria: 2, codigo: 'P001', descricao: 'Batata Frita', preco: 10.50 },
            { id: 2, idCategoria: 3, codigo: 'P002', descricao: 'Carne', preco: 15.75 }
        ];

        Requisicao.get.mockResolvedValue(produtosMock);

        const produtos = await produtoGestor.consultarProdutos();
        expect(produtos).toEqual(produtosMock);
        expect(Requisicao.get).toHaveBeenCalledWith('produtos');
    });

    it('deve retornar lista vazia quando não houver produtos', async () => {
        Requisicao.get.mockResolvedValue([]);

        const produtos = await produtoGestor.consultarProdutos();
        expect(produtos).toEqual([]);
        expect(Requisicao.get).toHaveBeenCalledWith('produtos');
    });

    it('deve retornar os produtos por categoria corretamente', async () => {
        const idCategoria = 2;
        const produtosMock = [
            { id: 1, idCategoria, codigo: 'P001', descricao: 'Batata Frita', preco: 10.50 }
        ];

        Requisicao.get.mockResolvedValue(produtosMock);

        const produtos = await produtoGestor.consultarProdutosComIdCategoria(idCategoria);
        expect(produtos).toEqual(produtosMock);
        expect(Requisicao.get).toHaveBeenCalledWith('produtos', { idCategoria });
    });

    it('deve retornar lista vazia quando a categoria não tem produtos', async () => {
        const idCategoria = 3;
        Requisicao.get.mockResolvedValue([]);

        const produtos = await produtoGestor.consultarProdutosComIdCategoria(idCategoria);
        expect(produtos).toEqual([]);
        expect(Requisicao.get).toHaveBeenCalledWith('produtos', { idCategoria });
    });

    it('deve armazenar produtos no cache e evitar requisições duplicadas', async () => {
        const idCategoria = 1;
        const produtosMock = [
            { id: 1, idCategoria, codigo: 'P001', descricao: 'Batata Frita', preco: 10.50 }
        ];

        Requisicao.get.mockResolvedValue(produtosMock);
        await produtoGestor.consultarProdutosComIdCategoria(idCategoria);
        expect(Requisicao.get).toHaveBeenCalledTimes(1);

        await produtoGestor.consultarProdutosComIdCategoria(idCategoria);
        expect(Requisicao.get).toHaveBeenCalledTimes(1);
    });

    it('deve tratar erro ao consultar produtos', async () => {
        Requisicao.get.mockRejectedValue(new Error('Erro na requisição'));

        await expect(produtoGestor.consultarProdutos()).rejects.toThrow('Erro na requisição');
        expect(Requisicao.get).toHaveBeenCalledWith('produtos');
    });
});