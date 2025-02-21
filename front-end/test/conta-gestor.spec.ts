import { describe, it, expect, vi } from 'vitest';
import ContaGestor from '../src/app/conta/conta-gestor';
import Conta from '../src/app/conta/conta';
import Requisicao from '../src/app/requisicao';
import Mesa from '../src/app/mesa/mesa';
import Cliente from '../src/app/cliente/cliente';
import Funcionario from '../src/app/funcionario/funcionario';
import Reserva from '../src/app/reserva/reserva';

const ROTA = 'contas';

describe('ContaGestor', () => {
  it('deve retornar uma lista de contas abertas ao consultar com sucesso', async () => {
    const contasMock = [
      { id: 1, reserva: { id: 10 }, formaPagamento: 'Dinheiro', porcentagemDesconto: 0, concluida: false },
      { id: 2, reserva: { id: 20 }, formaPagamento: 'Cartão de crédito', porcentagemDesconto: 10, concluida: false }
    ];

    vi.spyOn(Requisicao, 'get').mockResolvedValue(contasMock);
    const contaGestor = new ContaGestor();
    const resultado = await contaGestor.consultarContasAbertas();

    expect(Requisicao.get).toHaveBeenCalledWith(ROTA, { concluida: 0 });
    expect(resultado).toEqual(contasMock);
  });

  it('deve retornar uma lista vazia quando não há contas abertas', async () => {
    vi.spyOn(Requisicao, 'get').mockResolvedValue([]);
    const contaGestor = new ContaGestor();
    const resultado = await contaGestor.consultarContasAbertas();

    expect(Requisicao.get).toHaveBeenCalledWith(ROTA, { concluida: 0 });
    expect(resultado).toEqual([]);
  });

  it('deve lançar um erro quando a requisição de contas abertas falha', async () => {
    vi.spyOn(Requisicao, 'get').mockRejectedValue(new Error('Erro de conexão'));
    const contaGestor = new ContaGestor();

    await expect(contaGestor.consultarContasAbertas()).rejects.toThrow('Erro de conexão');
    expect(Requisicao.get).toHaveBeenCalledWith(ROTA, { concluida: 0 });
  });

  it('deve cadastrar uma conta corretamente', async () => {
    const contaMock = new Conta(1, new Reserva(10, '2024-01-01', true, new Mesa(1, 'Mesa 1'), new Cliente(1, 'João', '999999999'), new Funcionario(1, 'Jhonatan', '')), 'Dinheiro', 10, false);

    const respostaMock = {
      id: 1,
      reserva: {
        id: 10,
        dataReserva: '2024-01-01',
        ativo: true,
        mesa: { id: 1, nome: 'Mesa 1' },
        cliente: { id: 1, nome: 'João', telefoneCelular: '999999999' },
        funcionario: { id: 1, nome: 'Jhonatan' }
      },
      formaPagamento: 'Dinheiro',
      porcentagemDesconto: 10,
      concluida: false
    };

    vi.spyOn(Requisicao, 'post').mockResolvedValue(respostaMock);
    const contaGestor = new ContaGestor();
    const resultado = await contaGestor.cadastrar(contaMock);

    expect(Requisicao.post).toHaveBeenCalledWith(ROTA, contaMock.dadosParaRequisicao());
    expect(resultado).toBeInstanceOf(Conta);
    expect(resultado.id).toBe(1);
    expect(resultado.formaPagamento).toBe('Dinheiro');
    expect(resultado.porcentagemDesconto).toBe(10);
    expect(resultado.concluida).toBe(false);
  });

  it('deve lançar um erro ao tentar cadastrar uma conta e a requisição falhar', async () => {
    const contaMock = new Conta(1, new Reserva(10, '2024-01-01', true, new Mesa(1, 'Mesa 1'), new Cliente(1, 'João', '999999999'), new Funcionario(1, 'Carlos', '')), 'Dinheiro', 10, false);

    vi.spyOn(Requisicao, 'post').mockRejectedValue(new Error('Erro ao cadastrar conta'));
    const contaGestor = new ContaGestor();

    await expect(contaGestor.cadastrar(contaMock)).rejects.toThrow('Erro ao cadastrar conta');
    expect(Requisicao.post).toHaveBeenCalledWith(ROTA, contaMock.dadosParaRequisicao());
  });

  it('deve fechar uma conta corretamente', async () => {
    const contaMock = new Conta(1, new Reserva(10, '2024-01-01', true, new Mesa(1, 'Mesa 1'), new Cliente(1, 'João', '999999999'), new Funcionario(1, 'Carlos', '')), 'Dinheiro', 10, false);

    const respostaMock = {
      id: 1,
      reserva: {
        id: 10,
        dataReserva: '2024-01-01',
        ativo: true,
        mesa: { id: 1, nome: 'Mesa 1' },
        cliente: { id: 1, nome: 'João', telefoneCelular: '999999999' },
        funcionario: { id: 1, nome: 'Carlos' }
      },
      formaPagamento: 'Dinheiro',
      porcentagemDesconto: 10,
      concluida: true
    };

    vi.spyOn(Requisicao, 'put').mockResolvedValue(respostaMock);
    const contaGestor = new ContaGestor();
    const resultado = await contaGestor.fecharConta(contaMock);

    expect(Requisicao.put).toHaveBeenCalledWith(`${ROTA}/${contaMock.id}`, contaMock.dadosParaRequisicaoParaFecharConta());
    expect(resultado).toBeInstanceOf(Conta);
    expect(resultado.concluida).toBe(true);
  });

  it('deve lançar um erro ao tentar fechar uma conta e a requisição falhar', async () => {
    const contaMock = new Conta(1, new Reserva(10, '2024-01-01', true, new Mesa(1, 'Mesa 1'), new Cliente(1, 'João', '999999999'), new Funcionario(1, 'Carlos', '')), 'Dinheiro', 10, false);

    vi.spyOn(Requisicao, 'put').mockRejectedValue(new Error('Erro ao fechar conta'));
    const contaGestor = new ContaGestor();

    await expect(contaGestor.fecharConta(contaMock)).rejects.toThrow('Erro ao fechar conta');
    expect(Requisicao.put).toHaveBeenCalledWith(`${ROTA}/${contaMock.id}`, contaMock.dadosParaRequisicaoParaFecharConta());
  });
});