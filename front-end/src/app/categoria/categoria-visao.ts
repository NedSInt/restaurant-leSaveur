import Swal from "sweetalert2";
import CategoriaControladora from "./categoria-controladora.ts";
import Categoria from "./categoria.ts";
import ProdutoVisao from "../produto/produto-visao.ts";

export default class CategoriaVisao {

    private categoriaControladora: CategoriaControladora;
    private produtoVisao: ProdutoVisao;

    constructor(){
        this.categoriaControladora = new CategoriaControladora(this);
        this.produtoVisao = new ProdutoVisao();
    }

    public renderizarCategoriasModal(){
        this.categoriaControladora.obterCategoriasParaModal();
    }

    public iniciarOptions(): void{
        this.categoriaControladora.listarOptions();
    }

    public desenharOptionsCategorias(categorias: Categoria[]): void {

        const fragmento = document.createDocumentFragment();
        for ( const c of categorias ) {
            const option = this.criarOption( c );
            fragmento.append( option );
        }

        const selectCategoria = document.getElementById("categoria");
        selectCategoria?.append(fragmento);
    }

    public removerOptions(): void {
        const selectCategoria = document.getElementById("categoria");

        if(selectCategoria != null)
            selectCategoria.innerHTML = "";
    }

    public criarOption(f: Categoria): HTMLOptionElement {
        const option = document.createElement('option');
        option.value = String(f.id);
        option.innerText = f.nome;
        return option;
    }

    public renderizarMensagemErro(titulo: string, mensagem: string): void{
        Swal.fire({
            title: titulo,
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn btn-primary btn-lg mr-2',
            },
            timer: 5000,
            confirmButtonText: 'Ok',
            text: mensagem
        })
    }

    public desenharCategoriasParaModal(categorias: Categoria[]){
        const divCategorias = document.getElementById("div-categorias");

        const fragmento = document.createDocumentFragment();

        for (const c of categorias) {
            const button = document.createElement("button");

            button.classList.add('btn', 'btn-primary');
            button.innerText = c.nome;
            button.setAttribute('data-id', c.id.toString());

            button.onclick = (event) => {
                var botao = event.target;
                var idCategoria = botao?.getAttribute('data-id');

                this.produtoVisao.renderizaProdutosDaCategoriaModal(idCategoria);
            };

            fragmento.append(button);
        }

        divCategorias!.innerHTML = '';
        divCategorias?.append(fragmento);
    }
}