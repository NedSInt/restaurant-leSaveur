import Item from "../item/item.ts";
import Reserva from "../reserva/reserva.ts";
import { FormaPagamento } from "./forma-pagamento.ts";


export default class Conta {

    public id: number = 0;
    public reserva: Reserva | null;
    public formaPagamento: FormaPagamento | string | null;
    public porcentagemDesconto: number = 0;
    public concluida: boolean = false;
    public itens = [];

    static readonly MAX_PORCENTAGEM_DESCONTO: number = 5;
    static readonly MIN_PORCENTAGEM_DESCONTO: number = 0;

    constructor ( 
        id: number, 
        reserva: Reserva | null = null, 
        formaPagamento: FormaPagamento | string | null = null, 
        porcentagemDesconto: number = 0, 
        concluida: boolean = false,
        itens = []
    ) {
        this.id = id;
        this.reserva = reserva; 
        this.formaPagamento = formaPagamento; 
        this.porcentagemDesconto = porcentagemDesconto; 
        this.concluida = concluida;
        this.itens = itens;
    }

    public validar(){
        const problemas: Array<string> = [];

        if(this.porcentagemDesconto > Conta.MAX_PORCENTAGEM_DESCONTO && this.porcentagemDesconto < Conta.MIN_PORCENTAGEM_DESCONTO){
            problemas.push('A porcentagem de desconto deve estar entre ' + Conta.MIN_PORCENTAGEM_DESCONTO + ' e ' + Conta.MAX_PORCENTAGEM_DESCONTO);
        }

        return problemas;
    }

    public dadosParaRequisicao(){
        const dados = {
            'idReserva' : this.reserva!.id,
            'idMesa' : this.reserva!.mesa.id,
            'idFuncionario': this.reserva!.funcionario.id,
            'nomeCliente' : this.reserva!.cliente.nome,
            'formaPagamento' : this.formaPagamento, 
            'porcentagemDesconto' : this.porcentagemDesconto, 
            'concluida' : this.concluida,
            'itens' : this.itens
        };

        return dados;
    }

    public dadosParaRequisicaoParaFecharConta(){
        const dados = {
            'formaPagamento' : this.formaPagamento, 
            'porcentagemDesconto' : this.porcentagemDesconto, 
        };

        return dados;
    }

}