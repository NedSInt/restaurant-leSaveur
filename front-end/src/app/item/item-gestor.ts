import Item from "./item.ts";
import Requisicao from "../requisicao.ts";
import Funcionario from "../funcionario/funcionario.ts";
import Produto from "../produto/produto.ts";
import Categoria from "../categoria/categoria.ts";

const ROTA = 'itens';
const ROTA_CONTAS = 'contas';

export default class ItemGestor {
    private itens;

    constructor( itens: Item[] | void ) {
        this.itens = itens;
    }

    public async consultarItens() {
        return Requisicao.get(ROTA);
    }

    public async cadastrar(item: Item, idConta: number): Promise< Item >{
        const dadosParaRequisicao = item.dadosParaRequisicao();

        const dadosItem = await Requisicao.post(ROTA_CONTAS + '/' + idConta + '/' + ROTA, dadosParaRequisicao);

        const itemCadastrado = this.criarItem(dadosItem);

        return itemCadastrado;
    }

    async consultarItensDaConta(idConta: number): Promise< Item[] > {

        const dadosItens = await Requisicao.get(ROTA_CONTAS + '/' + idConta + '/' + ROTA);

        const itens: Item[] = [];
        
        if(dadosItens == null)
            return itens;

        for (const dadosItem of dadosItens) {
            itens.push(this.criarItem(dadosItem));
        }

        return itens;
    }

    private criarItem(dadosItem): Item{
        const funcionario = new Funcionario(dadosItem.funcionario.id, dadosItem.funcionario.nome, '');

        const categoria = new Categoria(dadosItem.produto.categoria.id, dadosItem.produto.categoria.nome);
        const produto = new Produto(dadosItem.produto.id, dadosItem.produto.descricao, dadosItem.produto.codigo, dadosItem.produto.preco, categoria);

        const item = new Item(dadosItem.id, produto, funcionario, dadosItem.quantidade, dadosItem.preco);

        return item;
    }

}