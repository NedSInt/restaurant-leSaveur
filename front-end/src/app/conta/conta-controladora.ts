import Cliente from "../cliente/cliente.ts";
import DadosNaoEncontradosError from "../error/dados-nao-encontrados-error.ts";
import RequisicaoError from "../error/requisicao-error.ts";
import ValidacaoError from "../error/validacao-error.ts";
import Funcionario from "../funcionario/funcionario.ts";
import Mesa from "../mesa/mesa.ts";
import Reserva from "../reserva/reserva.ts";
import UtilReservaData from "../UtilDataReserva.ts";
import ContaGestor from "./conta-gestor.ts";
import { ContaVisao } from "./conta-visao.ts";
import Conta from "./conta.ts";

export default class ContaControladora {

    private contaGestor: ContaGestor;
    private contaVisao: ContaVisao;

    constructor(visao: ContaVisao) {
        this.contaGestor = new ContaGestor();
        this.contaVisao = visao;
    }

    public gerarDataParaCadastrarConta(): string{
        const dataReserva = new Date();
        const dataReservaString = UtilReservaData.formatarDataParaRequisicao(dataReserva);

        return dataReservaString;
    }

    public async cadastrarConta(){
        try{

            const idReserva = this.contaVisao.reserva();

            const idMesa = this.contaVisao.mesa();
            const mesa = new Mesa(idMesa, '');

            const nomeCliente = this.contaVisao.cliente();
            const cliente = new Cliente(0, nomeCliente);

            const dataReservaString = this.gerarDataParaCadastrarConta();

            const idFuncionario = this.contaVisao.funcionario();
            const funcionario = new Funcionario(idFuncionario);

            const reserva = new Reserva(idReserva, dataReservaString, true, mesa, cliente, funcionario);

            const conta = new Conta(0, reserva);

            const problemas = conta.validar();

            if( problemas.length > 0 ){
                throw new ValidacaoError('Erros para cadastrar conta', problemas);
            }

            const contaCadastrada = await this.contaGestor.cadastrar(conta);

            this.contaVisao.exibirMensagemSucesso(contaCadastrada);
        } catch( e ) {

            if( e instanceof ValidacaoError){
                this.contaVisao.renderizarErrosCadastroConta(e.message, e.data);
            } else if( e instanceof RequisicaoError){
                this.contaVisao.renderizarErrosCadastroConta(e.message, e.data);
            }
        }
    }

    public async fecharConta(idConta: number){
        try{

            const porcentagemDesconto = this.contaVisao.porcentagemDesconto();
            const formaPagamento = this.contaVisao.formaPagamento();

            const conta = new Conta(idConta, null, formaPagamento, porcentagemDesconto);

            const problemas = conta.validar();

            if( problemas.length > 0 ){
                throw new ValidacaoError('Erros para cadastrar conta', problemas);
            }

            const contaAtualizada = await this.contaGestor.fecharConta(conta);

            this.contaVisao.exibirSucessoParaFecharConta(contaAtualizada);
        } catch( e ){
            if(e instanceof RequisicaoError){
                this.contaVisao.renderizarMensagemErro('Erro para fechar conta.', e.message);
            }
        }
    }

    public async listarContasAbertas(){
        try{
            const contas = await this.contaGestor.consultarContasAbertas();
            this.contaVisao.desenharListagemContasAbertas(contas);
        } catch( e ){
            if( e instanceof DadosNaoEncontradosError ){
                this.contaVisao.renderizarErroContasNaoEncontradas();
            } else if(e instanceof RequisicaoError){
                this.contaVisao.renderizarMensagemErro('Erro para obter contas para listagem.', e.message);
            } else {
                console.log(e.message);
            }
        }
    }
}