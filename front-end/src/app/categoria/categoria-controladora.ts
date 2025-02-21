import RequisicaoError from "../error/requisicao-error.ts";
import CategoriaGestor from "./categoria-gestor.ts";
import CategoriaVisao from "./categoria-visao.ts";

export default class CategoriaControladora {

    private categoriaGestor: CategoriaGestor;
    private categoriaVisao: CategoriaVisao;

    constructor(visao: CategoriaVisao) {
        this.categoriaGestor = new CategoriaGestor();
        this.categoriaVisao = visao;
    }

    async listarOptions(): Promise<void>{
        try{
            const categorias = await this.categoriaGestor.consultarCategorias();
            this.categoriaVisao.desenharOptionsCategorias(categorias);
        } catch( e ){
            if( e instanceof RequisicaoError ){
                this.categoriaVisao.renderizarMensagemErro("Erro para obter categorias para listagem.", e.message);
                this.categoriaVisao.removerOptions();
            } else {
                console.log(e.message);
            }
        }
    }

    async obterCategoriasParaModal(): Promise<void>{
        try{
            const categorias = await this.categoriaGestor.consultarCategorias();
            this.categoriaVisao.desenharCategoriasParaModal(categorias);
        } catch( e ){
            if( e instanceof RequisicaoError ){
                this.categoriaVisao.renderizarMensagemErro("Erro para obter categorias para listagem.", e.message);
                this.categoriaVisao.removerOptions();
            } else {
                console.log(e.message);
            }
        }
    }
}