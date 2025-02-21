import Produto from "./produto.ts";
import Requisicao from "../requisicao.ts";

const ROTA = 'produtos';

export default class ProdutoGestor {
    private produtosPorCategoria = [];

    constructor(  ) {
    }

    public async consultarProdutos() {
        return Requisicao.get(ROTA);
    }

    async consultarProdutosComIdCategoria(idCategoria): Promise<Produto[]> | never {

        if(idCategoria in this.produtosPorCategoria){
            return this.produtosPorCategoria[idCategoria];
        }

        const parametros = {
            "idCategoria" : idCategoria
        };

        const dadosProdutos = Requisicao.get(ROTA, parametros);

        this.produtosPorCategoria[idCategoria] = dadosProdutos;

        return dadosProdutos;
    }
}