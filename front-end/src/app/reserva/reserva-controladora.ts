import ReservaGestor from "./reserva-gestor.ts";
import Reserva from "./reserva.ts";
import { ReservaVisao } from "./reserva-visao.ts";
import Mesa from '../mesa/mesa.ts';
import Cliente from '../cliente/cliente.ts';
import Funcionario from '../funcionario/funcionario.ts';
import UtilReservaData from "../UtilDataReserva.ts";
import ValidacaoError from "../error/validacao-error.ts";
import RequisicaoError from "../error/requisicao-error.ts";
import DadosNaoEncontradosError from "../error/dados-nao-encontrados-error.ts";

export default class ReservaControladora {

    private reservaGestor: ReservaGestor;
    private reservaVisao: ReservaVisao;

    constructor(visao: ReservaVisao) {
        this.reservaGestor = new ReservaGestor();
        this.reservaVisao = visao;
    }

    public async cadastrarReserva(){
        try{

            const idMesa = this.reservaVisao.mesa();
            const mesa = new Mesa(idMesa, '');

            const idFuncionario = this.reservaVisao.funcionario();
            const funcionario = new Funcionario(idFuncionario, '', '');

            const { nomeCliente, telefoneCelular } = this.reservaVisao.cliente();
            const cliente = new Cliente(0, nomeCliente, telefoneCelular);
            
            const dataReserva = this.reservaVisao.obterDataReserva();

            let dataReservaString = '';
            if(dataReserva != null){
                dataReservaString = UtilReservaData.formatarDataParaRequisicao(dataReserva);
            }

            const reserva = new Reserva(0, dataReservaString, true, mesa, cliente, funcionario);

            const problemas = reserva.validar();

            if( problemas.length > 0 ){
                throw new ValidacaoError('Erros para cadastrar reserva', problemas);
            }

            const reservaCadastrada = await this.reservaGestor.cadastrar(reserva);

            this.reservaVisao.exibirMensagemSucesso(reservaCadastrada);
        } catch( e ) {

            if( e instanceof ValidacaoError){
                this.reservaVisao.renderizarErrosCadastroReserva(e.message, e.data);
            } else if( e instanceof RequisicaoError){
                this.reservaVisao.renderizarErrosCadastroReserva(e.message, e.data);
            }
        }
    }

    public async listarReservas(){
        try{
            const reservas = await this.reservaGestor.consultarReservas();
            this.reservaVisao.desenharListagemReservas(reservas);
        } catch( e ){
            if( e instanceof DadosNaoEncontradosError ){
                this.reservaVisao.renderizarErroReservasNaoEncontradas();
            } else if(e instanceof RequisicaoError){
                this.reservaVisao.renderizarMensagemErro('Erro para obter reservas para listagem.', e.message);
            } else {
                console.log(e.message);
            }
        }
    }

    public async listarOptionsMesasParaAtendimento(){
        try{
            const reservas = await this.reservaGestor.consultarReservasParaAtendimento();
            this.reservaVisao.desenharOptionsReservasParaAtendimento(reservas);
        } catch( e ){
            if( e instanceof DadosNaoEncontradosError ){
                this.reservaVisao.renderizarErroReservasNaoEncontradas();
            } else if(e instanceof RequisicaoError){
                this.reservaVisao.renderizarMensagemErro('Erro para obter reservas em atendimento para listagem.', e.message);
            } else {
                console.log(e.message);
            }
        }
    }

    public async cancelarReserva(id: number) {
        try {
            await this.reservaGestor.cancelarReserva(id);

            this.reservaVisao.iniciarListagem();
            // this.listarReservas();
        } catch ( e ) {
            if(e instanceof RequisicaoError){
                this.reservaVisao.renderizarMensagemErro('Erro para cancelar a reserva.', e.message);
            }
        }
    }

    public async gerarRelatorioReservas (dataMinima: Date, dataMaxima: Date) {
        try {
            const reservas = await this.reservaGestor.consultarQuantidadeDeReservasEntreDatas(dataMinima, dataMaxima);

            this.reservaVisao.atualizarGrafico(reservas);
        } catch ( e ) {
            if( e instanceof DadosNaoEncontradosError ){
                this.reservaVisao.renderizarErroReservasNaoEncontradasParaRelatorio();
            } else if(e instanceof RequisicaoError){
                this.reservaVisao.renderizarMensagemErro('Erro para obter dados de reserva para geração do relatório.', e.message);
            } else {
                console.log(e.message);
            }
        }
    }

}