import Cliente from "../cliente/cliente.ts";
import Funcionario from "../funcionario/funcionario.ts";
import Mesa from "../mesa/mesa.ts";

export default class Reserva {
    public id: number = 0;
    public dataReserva: string;
    public ativo: boolean = true;
    public mesa: Mesa;
    public cliente: Cliente;
    public funcionario: Funcionario;

    constructor ( 
        id: number, 
        dataReserva: string, 
        ativo: boolean, 
        mesa: Mesa, 
        cliente: Cliente,
        funcionario: Funcionario
    ) {
        this.id = id;
        this.dataReserva = dataReserva;
        this.ativo = ativo;
        this.mesa = mesa;
        this.cliente = cliente;
        this.funcionario = funcionario;
    }

    public validar(){
        let problemas: Array<any> = [];

        if( this.dataReserva.length == 0 ){
            problemas.push( 'A data da reserva não pode estar vazia.' );
        }

        if( Number.isNaN(this.mesa.id) ||  this.mesa.id <= 0 ) {
            problemas.push( 'Mesa não encontrada.' );
        }

        if( Number.isNaN(this.funcionario.id) ||  this.funcionario.id <= 0 ) {
            problemas.push( 'Funcionário não encontrado.' );
        }

        if( this.cliente.nome == '' ) {
            problemas.push( 'Digite o nome do cliente.' );
        }

        if( this.cliente.telefoneCelular == '') {
            problemas.push( 'Digite o telefone celular do cliente.' );
        }

        return problemas;
    }

    public dadosParaRequisicao(){
        const dados = {
            'dataReserva' : this.dataReserva,
            'idMesa' : this.mesa.id,
            'idFuncionario' : this.funcionario.id,
            'nomeCliente' : this.cliente.nome,
            'telefoneCelular': this.cliente.telefoneCelular
        };

        return dados;
    }

    public dataReservaFormatada(): string{
        const data = new Date(this.dataReserva);
        return data.toLocaleString();
    }
}