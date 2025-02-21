import Swal from "sweetalert2";
import ItemControladora from "./item-controladora.ts";
import Item from "./item.ts";
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import UtilLocalStorage from "../UtilLocalStorage.ts";

export default class ItemVisao {

    private itemControladora: ItemControladora;

    constructor(){
        this.itemControladora = new ItemControladora(this);
    }

    public cadastrarItem(idProduto){
        this.itemControladora.cadastrarItem(idProduto);
    }

    public conta(): number{
        return parseInt(document.getElementById('modalAdicionarItens')?.getAttribute('data-id-conta') ?? '0');
    }

    public quantidade(): number{
        return parseInt(document.querySelector('.contador-quantidade-item')!.innerText ?? 0);
    }

    public preco(idProduto): number{
        return parseFloat(document.querySelector('div.produto-modal[data-id-produto="' + idProduto.toString() + '"] .preco-produto')?.getAttribute('data-preco-produto') ?? '0');
    }

    public funcionario(): number {

        return UtilLocalStorage.obterIdFuncionario();
    }

    public exibirSucessoParaAdicionarItem(item: Item): void{
        this.exibirMensagemSucesso(item);

        this.removerDivParaAdicionarItem(item.produto!.id);
    }

    public exibirMensagemSucesso(item: Item): void{

        Toastify({
            text: "Item adicionado com sucesso.",
            duration: 2500,
            close: true,
            gravity: "top",
            position: "right",
            style: {
                background: "#4CAF50",
            },
            stopOnFocus: true
        }).showToast();
    }

    public removerDivParaAdicionarItem(idProduto){

        const div = document.querySelector('.produto-modal[data-id-produto="' + idProduto +'"] .div-adicionar-item')!;

        div.classList.add('deslizar-encolher', 'sair');

        div.addEventListener('transitionend', () => {
            div.remove();
        });
    }

    public renderizarErrosCadastroItem(mensagem, problemas = []): void{
        let titulo = 'Erro para cadastrar item.';
        let html = mensagem;

        if(problemas.length > 0){
            titulo = mensagem;
            html = problemas.join('<br>');
        }

        Swal.fire({
            title: titulo,
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn btn-primary btn-lg mr-2',
            },
            confirmButtonText: 'Ok',
            html: html
        })
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

    public async renderizaItensDaContaNaTabela(idConta){
        this.itemControladora.consultarItensDaConta(idConta);
    }

    public desenharInfosItensParaFecharConta(itens){
        const divTable = document.getElementById('div-tabela-itens');
        divTable!.hidden = false;
        document.querySelector('.aviso-itens-nao-encontrados')?.remove();

        const tabelaItens = document.getElementById('tabela-itens');

        const tbody = tabelaItens!.querySelector( 'tbody' )!;
        const tfoot = tabelaItens!.querySelector( 'tfoot' )!;
        tbody.innerText = '';

        var quantidadeTotal = 0;
        var valorTotal = 0;

        const fragmento = document.createDocumentFragment();
        for ( const i of itens ) {
            quantidadeTotal += i.quantidade;
            valorTotal += i.quantidade * i.preco;
            const linha = this.criarLinha( i );
            fragmento.append( linha );
        }

        tbody.append( fragmento );

        this.gerarTFoot(quantidadeTotal, valorTotal);

        var spanValorTotal = document.querySelector('#valores-conta #valor-total');
        spanValorTotal?.setAttribute('data-valor-total', valorTotal.toString());
        spanValorTotal!.innerText = valorTotal.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    }

    public gerarTFoot(quantidadeTotal, valorTotal){
        const tabelaItens = document.getElementById('tabela-itens');
        const tfoot = tabelaItens!.querySelector( 'tfoot' )!;

        valorTotal = valorTotal.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});

        tfoot.innerHTML = `
            <tr>
                <th>Total:</th>
                <th>${quantidadeTotal}</th>
                <th></th>
                <th>${valorTotal}</th>
            </tr>
        `;

    }

    public criarLinha( i: Item ): HTMLTableRowElement {
        const tr = document.createElement( 'tr' );
        tr.setAttribute('data-id', i.id.toString());

        const valorUnitario = i.preco.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
        const valorTotal = (i.quantidade * i.preco).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});

        tr.append(
            this.criarCelula( i.produto!.descricao, 'nomeItem' ),
            this.criarCelula( i.quantidade!.toString(), 'quantidadeItem' ),
            this.criarCelula( valorUnitario, 'valorUnitario' ),
            this.criarCelula( valorTotal, 'valorTotal' )
        );

        return tr;
    }

    public criarCelula( texto: string, classe: string ): HTMLTableCellElement {
        const td = document.createElement( 'td' );
        td.innerText = texto;
        td.classList.add(classe);
        return td;
    }
}