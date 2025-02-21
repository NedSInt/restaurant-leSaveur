import Cliente from "../cliente/cliente";
import Funcionario from "../funcionario/funcionario.ts";
import Mesa from "../mesa/mesa.ts";
import Reserva from "./reserva.ts";
import Requisicao from "../requisicao.ts";
import UtilReservaData from '../UtilDataReserva.ts';

const ROTA = 'reservas';
const ROTA_RELATORIO = 'reservas/relatorio';
const ROTA_PARA_ATENDIMENTO = 'reservas/para-atendimento';

export default class ReservaGestor {
    private reservas;

    constructor( reservas: Reserva[] | void ) {
        this.reservas = reservas;
    }

    public async consultarReservas(): Promise< Reserva[] > {
        const dadosReservas = await Requisicao.get(ROTA);
        
        const reservas: Reserva[] = [];

        if(dadosReservas == null)
            return reservas;

        for (const dadosReserva of dadosReservas) {
            const reserva = this.criarReserva(dadosReserva);

            reservas.push(reserva);
        }

        return reservas;
    }

    public async consultarReservasParaAtendimento(): Promise< Reserva[] > {
        const dadosReservas = await Requisicao.get(ROTA_PARA_ATENDIMENTO);

        const reservas: Reserva[] = [];

        if(dadosReservas == null)
            return reservas;

        for (const dadosReserva of dadosReservas) {
            const reserva = this.criarReserva(dadosReserva);

            reservas.push(reserva);
        }

        return reservas;
    }

    public async cancelarReserva ( id: number ) /* : Promise< Reserva[] > */ {
        
        if (typeof id !== 'number' || id <= 0 || !Number.isInteger(id)) {
            throw new Error('ID inválido. Por favor, forneça um número inteiro positivo.');
        }

        const rotaPatch = ROTA + '/' + id + '/ativo';

        await Requisicao.patch(rotaPatch, { ativo : 0 });

    }

    public async cadastrar(reserva: Reserva): Promise< Reserva >{

        const dadosParaRequisicao = reserva.dadosParaRequisicao();

        const dadosReserva = await Requisicao.post(ROTA, dadosParaRequisicao);

        const reservaCadastrada = this.criarReserva(dadosReserva);

        return reservaCadastrada;
    }

    async consultarQuantidadeDeReservasEntreDatas(dataMinima: Date, dataMaxima: Date): Promise<Reserva[]> | never {

        const parametros = {
            "dataMinima" : UtilReservaData.formatarDataParaRequisicao(dataMinima),
            "dataMaxima" : UtilReservaData.formatarDataParaRequisicao(dataMaxima),
        };

        return Requisicao.get(ROTA_RELATORIO, parametros);
    }

    private criarReserva(dadosReserva){
        const mesa = new Mesa(dadosReserva.mesa.id, dadosReserva.mesa.nome);
        const cliente = new Cliente(dadosReserva.cliente.id, dadosReserva.cliente.nome, dadosReserva.cliente.telefoneCelular);
        const funcionario = new Funcionario(dadosReserva.funcionario.id, dadosReserva.funcionario.nome, '');
        const reserva = new Reserva(dadosReserva.id, dadosReserva.dataReserva, dadosReserva.ativo, mesa, cliente, funcionario);

        return reserva;
    }
}