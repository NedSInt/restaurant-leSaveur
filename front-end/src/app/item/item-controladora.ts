import Conta from "../conta/conta.ts";
import RequisicaoError from "../error/requisicao-error.ts";
import ValidacaoError from "../error/validacao-error.ts";
import Funcionario from "../funcionario/funcionario.ts";
import Item from "../item/item.ts";
import Produto from "../produto/produto.ts";
import ItemGestor from "./item-gestor.ts";
import ItemVisao from "./item-visao.ts";

export default class ItemControladora {

    private itemGestor: ItemGestor;
    private itemVisao: ItemVisao;

    constructor(visao: ItemVisao) {
        this.itemGestor = new ItemGestor();
        this.itemVisao = visao;
    }

    public async cadastrarItem(idProduto){
        try{

            const produto = new Produto(idProduto, '', '', 0, null);

            const idConta = this.itemVisao.conta();

            const idFuncionario = this.itemVisao.funcionario();
            const funcionario = new Funcionario(idFuncionario);

            const quantidade = this.itemVisao.quantidade();
            const preco = this.itemVisao.preco(idProduto);

            const item = new Item(0, produto, funcionario, quantidade, preco);

            const problemas = item.validar();

            if( problemas.length > 0 ){
                throw new ValidacaoError('Erros para cadastrar item', problemas);
            }

            const itemCadastrado = await this.itemGestor.cadastrar(item, idConta);

            this.itemVisao.exibirSucessoParaAdicionarItem(itemCadastrado);

        } catch( e ) {
            if( e instanceof ValidacaoError){
                this.itemVisao.renderizarErrosCadastroItem(e.message, e.data);
            } else if( e instanceof RequisicaoError){
                this.itemVisao.renderizarErrosCadastroItem(e.message, e.data);
            }
        }
    }

    async consultarItensDaConta(idConta){
        try{
            const itens = await this.itemGestor.consultarItensDaConta(idConta);
            this.itemVisao.desenharInfosItensParaFecharConta(itens);
        } catch( e ){
            if( e instanceof RequisicaoError ){
                this.itemVisao.renderizarMensagemErro("Erro para obter itens da conta.", e.message);
            } else {
                console.log(e.message);
            }
        }
    }

}