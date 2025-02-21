import RequisicaoError from "../error/requisicao-error.ts";
import ProdutoGestor from "./produto-gestor.ts";
import ProdutoVisao from "./produto-visao.ts";

export default class ProdutoControladora {

    private produtoGestor: ProdutoGestor;
    private produtoVisao: ProdutoVisao;

    constructor(visao: ProdutoVisao) {
        this.produtoGestor = new ProdutoGestor();
        this.produtoVisao = visao;
    }

    async listarOptions(): Promise<void>{
        try{
            const produtos = await this.produtoGestor.consultarProdutos();
            this.produtoVisao.desenharOptionsProdutos(produtos);
        } catch( e ){
            if( e instanceof RequisicaoError ){
                this.produtoVisao.renderizarMensagemErro("Erro para obter produtos para listagem.", e.message);
                this.produtoVisao.removerOptions();
            } else {
                console.log(e.message);
            }
        }
    }

    async obterProdutosParaModal(idCategoria): Promise<void>{
        try{
            const produtos = await this.produtoGestor.consultarProdutosComIdCategoria(idCategoria);
            this.produtoVisao.desenharProdutosParaModal(produtos);
        } catch( e ){
            if( e instanceof RequisicaoError ){
                this.produtoVisao.renderizarMensagemErro("Erro para obter produtos para listagem.", e.message);
                this.produtoVisao.removerOptions();
            } else {
                console.log(e.message);
            }
        }
    }
}