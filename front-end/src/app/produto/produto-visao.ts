import Swal from "sweetalert2";
import ProdutoControladora from "./produto-controladora.ts";
import Produto from "./produto.ts";
import ItemVisao from "../item/item-visao.ts";

export default class ProdutoVisao {

    private produtoControladora: ProdutoControladora;
    private itemVisao: ItemVisao;

    constructor(){
        this.produtoControladora = new ProdutoControladora(this);
        this.itemVisao = new ItemVisao();
    }
    
    public iniciarOptions(): void{
        this.produtoControladora.listarOptions();
    }

    public renderizaProdutosDaCategoriaModal(idCategoria){
        this.produtoControladora.obterProdutosParaModal(idCategoria);
    }

    public desenharOptionsProdutos(produtos: Produto[]): void {

        const fragmento = document.createDocumentFragment();
        for ( const p of produtos ) {
            const option = this.criarOption( p );
            fragmento.append( option );
        }

        const selectProduto = document.getElementById("produto");
        selectProduto?.append(fragmento);
    }

    public removerOptions(): void {
        const selectProduto = document.getElementById("produto");

        if(selectProduto != null)
            selectProduto.innerHTML = "";
    }

    public criarOption(p: Produto): HTMLOptionElement {
        const option = document.createElement('option');
        option.value = String(p.id);
        option.innerText = p.descricao;
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

    public desenharProdutosParaModal(produtos: Produto[]){
        const divProdutos = document.getElementById("div-produtos");

        var conteudo = '';

        for (const p of produtos) {

            const precoProduto = p.preco.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});

            const divProduto = `
                <div class='me-3 border border-2 col-auto p-0 produto-modal' data-id-produto='${p.id}'>
                    <div class='p-1'>
                        ${p.descricao}
                    </div>
                    <div class='d-flex justify-content-between align-items-center p-1'>
                        <span class='text-nowrap preco-produto' data-preco-produto='${p.preco}'>${precoProduto}</span>
                        <button class='btn btn-light botao-adicionar-produto px-2' data-id-produto='${p.id}' title='Escolher Item'><i class='fa fa-cart-plus'></i></button>
                    </div>
                </div>
            `;

            conteudo += divProduto;
        }

        divProdutos!.innerHTML = conteudo;

        document.querySelectorAll('.botao-adicionar-produto')?.forEach((botao) => {
            botao.addEventListener('click', (event) => {
                var idProduto = botao.getAttribute('data-id-produto');

                this.removerDivAdicionarItem(idProduto);

                this.adicionarDivAdicionarItem(idProduto);
            });
        });
    }

    public removerDivAdicionarItem(idProduto: string|null){
        document.querySelectorAll('.produto-modal:not([data-id-produto="' + idProduto +'"]) .div-adicionar-item')?.forEach( (element) => {element.remove()} );
    }

    public adicionarDivAdicionarItem(idProduto){
        const divProdutoModal = document.querySelector('.produto-modal[data-id-produto="' + idProduto +'"]');

        if(divProdutoModal?.querySelector('div.div-adicionar-item'))
            return;

        var divParaAdicionarItens = document.createElement('div');
        divParaAdicionarItens.classList.add('div-adicionar-item',  'mt-1',  'border-top',  'border-1',  'padding-top',  'p-1',  'd-flex',  'justify-content-center',  'align-items-center',  'gap-1');

        divParaAdicionarItens!.innerHTML = `
            <button class='btn btn-danger diminuir-qtd-item' title='Diminuir quantidade do item'><i class='fa fa-minus'></i></button>
            <span class='contador-quantidade-item px-1'>1</span>
            <button class='btn btn-success aumentar-qtd-item' title='Aumentar quantidade do item'><i class='fa-solid fa-plus'></i></button>
            <button class='btn btn-success btn-adicionar-item' title='Adicionar item' data-id-produto='${idProduto}'><i class='fa-solid fa-check'></i></button>
        `;

        divProdutoModal?.appendChild(divParaAdicionarItens);

        document.querySelector('.diminuir-qtd-item')?.addEventListener('click', (event) => {
            var quantidade = document.querySelector('.contador-quantidade-item')?.innerText;

            if(quantidade > 1){
                quantidade = parseInt(quantidade) - 1;
                document.querySelector('.contador-quantidade-item')!.innerText = quantidade;
            }
        });

        document.querySelector('.aumentar-qtd-item')?.addEventListener('click', (event) => {
            var quantidade = document.querySelector('.contador-quantidade-item')?.innerText;

            quantidade = parseInt(quantidade) + 1;
            document.querySelector('.contador-quantidade-item')!.innerText = quantidade;
        });

        document.querySelector('.btn-adicionar-item')?.addEventListener('click', (event) => {
            const botao = event.currentTarget as HTMLButtonElement;
            const idProduto = botao.getAttribute('data-id-produto');
            this.itemVisao.cadastrarItem(idProduto);
        });
    }
}