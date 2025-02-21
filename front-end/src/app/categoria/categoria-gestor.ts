import Categoria from "./categoria.ts";
import Requisicao from "../requisicao.ts";

const ROTA = 'categorias';

export default class CategoriaGestor {
    private categorias;

    constructor( categorias: Categoria[] | void ) {
        this.categorias = categorias;
    }

    public async consultarCategorias(): Promise< Categoria[] > {
        const dadosCategorias = await Requisicao.get(ROTA);

        const categorias: Categoria[] = [];

        if(dadosCategorias == null)
            return categorias;

        for (const dadosCategoria of dadosCategorias) {
            const categoria = new Categoria(dadosCategoria.id, dadosCategoria.nome);

            categorias.push(categoria);
        }

        return categorias;
    }

}