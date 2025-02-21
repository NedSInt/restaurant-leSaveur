import Conta from "./conta.ts";
import Requisicao from "../requisicao.ts";
import Mesa from "../mesa/mesa.ts";
import Cliente from "../cliente/cliente.ts";
import Funcionario from "../funcionario/funcionario.ts";
import Reserva from "../reserva/reserva.ts";

const ROTA = 'contas';

export default class ContaGestor {
    private contas;

    constructor( contas: Conta[] | void ) {
        this.contas = contas;
    }

    public async consultarContasAbertas() {
        const parametros = {
            concluida: 0
        };
        return Requisicao.get(ROTA, parametros);
    }

    public async cadastrar(conta: Conta): Promise< Conta >{

        const dadosParaRequisicao = conta.dadosParaRequisicao();

        const dadosConta = await Requisicao.post(ROTA, dadosParaRequisicao);
        const dadosReserva = dadosConta.reserva;

        const mesa = new Mesa(dadosReserva.mesa.id, dadosReserva.mesa.nome);
        const cliente = new Cliente(dadosReserva.cliente.id, dadosReserva.cliente.nome, dadosReserva.cliente.telefoneCelular);
        const funcionario = new Funcionario(dadosReserva.funcionario.id, dadosReserva.funcionario.nome, '');
        const reservaCadastrada = new Reserva(dadosReserva.id, dadosReserva.dataReserva, dadosReserva.ativo, mesa, cliente, funcionario);

        const contaCadastrada = new Conta(dadosConta.id, reservaCadastrada, dadosConta.formaPagamento, dadosConta.porcentagemDesconto, dadosConta.concluida);

        return contaCadastrada;
    }

    public async fecharConta(conta: Conta): Promise< Conta > {
        const dadosParaRequisicao = conta.dadosParaRequisicaoParaFecharConta();

        const dadosConta = await Requisicao.put(ROTA + '/' + conta.id, dadosParaRequisicao);

        const contaAtualizada = this.criarConta(dadosConta);

        return contaAtualizada;
    }

    private criarConta(dadosConta): Conta{
        const dadosReserva = dadosConta.reserva;

        const mesa = new Mesa(dadosReserva.mesa.id, dadosReserva.mesa.nome);
        const cliente = new Cliente(dadosReserva.cliente.id, dadosReserva.cliente.nome, dadosReserva.cliente.telefoneCelular);
        const funcionario = new Funcionario(dadosReserva.funcionario.id, dadosReserva.funcionario.nome, '');
        const reservaCadastrada = new Reserva(dadosReserva.id, dadosReserva.dataReserva, dadosReserva.ativo, mesa, cliente, funcionario);

        const conta = new Conta(dadosConta.id, reservaCadastrada, dadosConta.formaPagamento, dadosConta.porcentagemDesconto, dadosConta.concluida);

        return conta;
    }

}