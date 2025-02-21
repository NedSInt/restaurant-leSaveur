import { describe, it, expect, vi } from 'vitest';
import CategoriaGestor from '../src/app/categoria/categoria-gestor';
import Categoria from '../src/app/categoria/categoria';
import Requisicao from '../src/app/requisicao';

const ROTA = 'categorias';

describe('CategoriaGestor', () => {
  it('deve retornar uma lista de categorias ao consultar com sucesso', async () => {
    const categoriasMock = [
      { id: 1, nome: 'Sobremesa' },
      { id: 2, nome: 'Bebida' }
    ];
    
    vi.spyOn(Requisicao, 'get').mockResolvedValue(categoriasMock);
    const categoriaGestor = new CategoriaGestor();
    const resultado = await categoriaGestor.consultarCategorias();
    
    expect(Requisicao.get).toHaveBeenCalledWith(ROTA);
    expect(resultado).toHaveLength(2);
    expect(resultado[0]).toBeInstanceOf(Categoria);
    expect(resultado[0]).toEqual(new Categoria(1, 'Sobremesa'));
    expect(resultado[1]).toEqual(new Categoria(2, 'Bebida'));
  });

  it('deve retornar uma lista vazia quando a consulta não retorna categorias', async () => {
    vi.spyOn(Requisicao, 'get').mockResolvedValue(null);
    const categoriaGestor = new CategoriaGestor();
    const resultado = await categoriaGestor.consultarCategorias();
    
    expect(Requisicao.get).toHaveBeenCalledWith(ROTA);
    expect(resultado).toEqual([]);
  });

  it('deve retornar uma lista vazia quando a consulta retorna um array vazio', async () => {
    vi.spyOn(Requisicao, 'get').mockResolvedValue([]);
    const categoriaGestor = new CategoriaGestor();
    const resultado = await categoriaGestor.consultarCategorias();
    
    expect(Requisicao.get).toHaveBeenCalledWith(ROTA);
    expect(resultado).toEqual([]);
  });

  it('deve lançar um erro quando a requisição falha', async () => {
    vi.spyOn(Requisicao, 'get').mockRejectedValue(new Error('Erro de conexão'));
    const categoriaGestor = new CategoriaGestor();
    
    await expect(categoriaGestor.consultarCategorias()).rejects.toThrow('Erro de conexão');
    expect(Requisicao.get).toHaveBeenCalledWith(ROTA);
  });
});
