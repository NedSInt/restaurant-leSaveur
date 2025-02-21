import Funcionario from "../funcionario/funcionario";
import Produto from "../produto/produto";

export default class Item {
    public id: number = 0;
    public produto: Produto|null;
    public funcionario: Funcionario|null;
    public quantidade: number = 0;
    public preco: number = 0;

    static readonly QUANTIDADE_MINIMA = 1;
    static readonly PRECO_MINIMO = 0.01;

    constructor(id: number = 0,
        produto: Produto|null = null,
        funcionario: Funcionario|null = null,
        quantidade: number = 0,
        preco: number = 0
    ){
        this.id = id;
        this.produto = produto;
        this.funcionario = funcionario;
        this.quantidade = quantidade;
        this.preco = preco;
    }

    public validar(){
        const problemas: Array<string> = [];

        if( this.quantidade < Item.QUANTIDADE_MINIMA){
            problemas.push('A quantidade precisa ser maior que ' + Item.QUANTIDADE_MINIMA + '.');
        }

        if( this.preco < Item.PRECO_MINIMO){
            problemas.push('O preço precisa ser maior que ' + Item.PRECO_MINIMO.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}) + '.');
        }

        return problemas;
    }

    public dadosParaRequisicao(){
        const dados = {
            'idProduto' : this.produto?.id,
            'idFuncionario' : this.funcionario?.id,
            'quantidade' : this.quantidade,
            'preco': this.preco
        };

        return dados;
    }
}