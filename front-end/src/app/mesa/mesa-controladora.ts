import DadosNaoEncontradosError from "../error/dados-nao-encontrados-error.ts";
import DataInvalidaParaSolicitarReservaError from "../error/error-with-data.ts";
import RequisicaoError from "../error/requisicao-error.ts";
import MesaGestor from "./mesa-gestor.ts";
import MesaVisao from "./mesa-visao.ts";

export default class MesaControladora {

    private mesaGestor: MesaGestor;
    private mesaVisao: MesaVisao;

    constructor(mesaVisao: MesaVisao) {
        this.mesaGestor = new MesaGestor();
        this.mesaVisao = mesaVisao;
    }

    async listarOptions(data: Date, paraCadastrarConta: boolean = false): void {
        try{
            this.mesaVisao.informarCarregamentoMesas();
            const mesas = await this.mesaGestor.consultarMesasDisponiveisParaData(data, paraCadastrarConta);
            this.mesaVisao.desenharOptionsMesas(mesas);
        } catch( e ){
            if( e instanceof DadosNaoEncontradosError ){
                this.mesaVisao.renderizarMesasNaoEncontradas();
            } else if( e instanceof RequisicaoError ) {
                this.mesaVisao.renderizarMensagemErro("Erro para obter mesas para listagem.", e.message);
                this.mesaVisao.removerOptions();
            } else if( e instanceof DataInvalidaParaSolicitarReservaError ){
                this.mesaVisao.renderizarErrosDataInvalidaParaSolicitarReserva(e);
            }
        }
    }
}