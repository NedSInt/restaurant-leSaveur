import Mesa from './mesa.ts';
import ValidaDataParaSolicitarReserva from './valida-data-para-solicitar-reserva.ts';
import Requisicao from '../requisicao.ts';
import UtilReservaData from '../UtilDataReserva.ts';

const MESASEXEMPLO = [
    new Mesa(1, 'Mesa 1'),
    new Mesa(1, 'Mesa 2'),
    new Mesa(1, 'Mesa 3')
];

const ROTA = 'mesas';
const ROTA_DISPONIVEIS = 'mesas/disponiveis';

export default class MesaGestor {
    
    private mesas: Mesa[];

    constructor( mesas: Mesa[] | void ) {
        this.mesas = mesas ?? MESASEXEMPLO;
    }

    public async consultarMesas() {
        return Requisicao.get(ROTA);
    }

    /**
     * 
     * @param data: Date
     * @returns Promise<Mesa[]> | never
     */
    async consultarMesasDisponiveisParaData(data: Date, paraCadastrarConta: boolean = false): Promise<Mesa[]> | never {

        if(paraCadastrarConta){
            ValidaDataParaSolicitarReserva.validarDataParaCadastroConta(data);
        } else {
            ValidaDataParaSolicitarReserva.validarDataParaCadastroReserva(data);
        }

        const parametros = {
            "dataReserva" : UtilReservaData.formatarDataParaRequisicao(data),
            "paraCadastrarConta" : paraCadastrarConta ? 1 : 0
        };
        return Requisicao.get(ROTA_DISPONIVEIS, parametros);
    }
}