import Swal from "sweetalert2";
import { Visao } from "../views/visao.ts";
import ContaControladora from "./conta-controladora.ts";
import Conta from "./conta.ts";
import MesaVisao from "../mesa/mesa-visao.ts";
import { ReservaVisao } from "../reserva/reserva-visao.ts";
import Mesa from "../mesa/mesa.ts";
import CategoriaVisao from "../categoria/categoria-visao.ts";
import { FormaPagamento } from "./forma-pagamento.ts";
import ItemVisao from "../item/item-visao.ts";
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import UtilLocalStorage from "../UtilLocalStorage.ts";

const TITULO_ABRIR_CONTA = 'Restaurante La Saveur - Abrir conta';
const TITULO_LISTAGEM = 'Restaurante La Saveur - Contas em atendimento';

export class ContaVisao {

    private contaControladora: ContaControladora;
    private mesaVisao: MesaVisao;
    private reservaVisao: ReservaVisao;
    private categoriaVisao: CategoriaVisao;
    private itemVisao: ItemVisao;

    private idReservaSelecionada = 0;

    constructor(){
        this.contaControladora = new ContaControladora(this);

        this.mesaVisao = new MesaVisao();
        this.reservaVisao = new ReservaVisao();
        this.categoriaVisao = new CategoriaVisao();
        this.itemVisao = new ItemVisao();
    }

    public iniciarConta(){
        this.renderizaTemplateAbrirConta();
        Visao.atualizaTitulo(TITULO_ABRIR_CONTA);
    }

    public iniciarListagem(): void {
        this.renderizaTemplateListagem();
        Visao.atualizaTitulo(TITULO_LISTAGEM);
        this.contaControladora.listarContasAbertas();
        this.categoriaVisao.renderizarCategoriasModal();
    }

    public iniciarModalAdicionarItens(idConta): void {
        document.querySelectorAll('#div-produtos .produto-modal')!.forEach((element) => {
            element.remove();
        });

        document.getElementById('modalAdicionarItens')?.setAttribute('data-id-conta', idConta);
    }

    public iniciarModalFecharConta(idConta): void {
        document.getElementById('modalFecharConta')?.setAttribute('data-id-conta', idConta);
        document.getElementById('botao-fechar-conta')?.setAttribute('data-id-conta', idConta);
        document.getElementById('botao-fechar-conta')?.removeAttribute('disabled');

        document.getElementById('porcentagem-desconto')!.value = 0;
        document.querySelector('.aviso-itens-nao-encontrados')?.remove();

        const tabelaItens = document.getElementById('tabela-itens');

        tabelaItens!.querySelectorAll( 'tbody tr' )!.forEach( (element) => {element.remove()} );
        tabelaItens!.querySelectorAll( 'tfoot tr' )!.forEach( (element) => {element.remove()} );
        this.itemVisao.renderizaItensDaContaNaTabela(idConta);
    }

    public renderizaTemplateAbrirConta(){
        Visao.renderizar( `
            <div class="container mt-5">
                <div class="row justify-content-center">
                    <div class="col-lg-10">
                        <h1 class="mb-4 text-center">Abrir conta</h1>
                        <form id='abrir-conta'>
                            <div class="divReserva row mb-3">
                                <label for="reserva" class="form-label">Reserva</label>
                                <select id="reserva" class="form-select">
                                    <option value="" selected></option>
                                </select>
                                <div class="alert alert-danger mensagem-erro" hidden>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <label for="nomeCliente" class="form-label">Nome do Cliente</label>
                                <input type="text" class="form-control" id="nomeCliente" placeholder="Ex: João Silva" required />
                            </div>
                            <div class="divMesa row mb-3">
                                <label for="mesa" class="form-label">Mesa</label>
                                <select id="mesa" class="form-select" required>
                                    <option value="" selected>Selecione mesa</option>
                                </select>
                                <div class="alert alert-danger mensagem-erro" hidden>
                                </div>
                            </div>
                            <div class="col-md-4 mt-2 d-flex justify-content-right gap-2 botoes">
                                <button type="submit" class="btn btn-primary" id="button-abrir-conta">Abrir conta</button>
                                <a href="/" class="btn btn-secondary">Voltar</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        ` );

        this.reservaVisao.iniciarOptionsReservasEmAtendimento();

        document.getElementById('abrir-conta')?.addEventListener("submit", (e) => {
            e.preventDefault();
            this.contaControladora.cadastrarConta();
        });

        this.buscarMesasDisponiveisParaData();

        document.querySelector("#reserva")?.addEventListener("change", (e) => {
            this.alterarEstadoInputClienteESelectMesa();
        });

    }

    public alterarEstadoInputClienteESelectMesa(){

        const valorReserva = this.reserva();

        if(valorReserva){
            const option = document.querySelector('option[value="' + valorReserva + '"]');
            const nomeCliente = option!.getAttribute('data-cliente-nome') ?? '';
            const idMesa = option!.getAttribute('data-mesa-id') ?? '';
            const nomeMesa = option!.getAttribute('data-mesa-nome') ?? '';

            this.preencherClienteComNome(nomeCliente);

            this.preencherMesa(idMesa, nomeMesa);

        } else {
            this.habilitarClienteComNome();

            const option = document.querySelector('option[value="' + this.idReservaSelecionada + '"]');
            const idMesa = option!.getAttribute('data-mesa-id') ?? '';

            this.habilitarSelectMesa(idMesa);
        }
        this.idReservaSelecionada = valorReserva;
    }

    public preencherClienteComNome(nomeCliente: String){
        document.getElementById("nomeCliente")!.value = nomeCliente;
        document.getElementById("nomeCliente")?.setAttribute("disabled", "disabled");
    }

    public preencherMesa(idMesa, nomeMesa){
        const mesa = new Mesa(idMesa, nomeMesa);
        const option = this.mesaVisao.criarOption(mesa);
        option.setAttribute('selected', 'selected');

        document.getElementById('mesa')?.append(option);
        document.getElementById('mesa')?.setAttribute("disabled", "disabled");
    }

    public habilitarClienteComNome(){
        document.getElementById("nomeCliente")!.value = '';
        document.getElementById("nomeCliente")?.removeAttribute("disabled");
    }

    public habilitarSelectMesa(idReservaAnterior){
        document.querySelector("#mesa option[value='" + idReservaAnterior + "'")?.remove();
        document.getElementById('mesa')?.removeAttribute("disabled");
    }

    public habilitarInputCliente(){
        document.getElementById('nomeCliente')?.removeAttribute("disabled");
        document.getElementById('nomeCliente')!.value = '';
    }

    public buscarMesasDisponiveisParaData(): void {

        const data = new Date();

        const divErro = document.querySelector(".divMesa .mensagem-erro");

        if(divErro != null){
            divErro.hidden = true;
            divErro.innerText = "";
        }

        this.mesaVisao.iniciarOptions(data, true);
    }

    public exibirMensagemSucesso(conta: Conta): void{
        const dataReservaFormatada = conta.reserva!.dataReservaFormatada();
        var htmlAlert = `
            Data: ${dataReservaFormatada}<br>
            Mesa: ${conta.reserva!.mesa.nome}<br>
            Cliente: ${conta.reserva!.cliente.nome}<br>
        `;
        Swal.fire({
            title: 'Conta aberta com sucesso',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn btn-primary btn-lg mr-2',
            },
            confirmButtonText: 'Ok',
            html: htmlAlert
        })
    }

    public renderizarErrosCadastroConta(mensagem, problemas = []): void{
        let titulo = 'Erro para abrir conta.';
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

    public reserva(): number {
        return parseInt(document.getElementById("reserva")?.value ?? 0);
    }

    public mesa(): number {
        return parseInt(document.getElementById("mesa")?.value ?? 0);
    }

    public cliente(): string {
        return document.getElementById("nomeCliente")?.value ?? '';
    }

    public funcionario(): number {
        return UtilLocalStorage.obterIdFuncionario();
    }

    public renderizaTemplateListagem(): void {

        Visao.renderizar( `
            <div class="container my-4">
                <div class="row justify-content-center">
                    <div class="col-lg-10">
                        <h1 class="mb-4 text-center">Contas em atendimento</h1>
                        <div class="table-responsive" id="div-tabela-contas">
                            <table class="table table-striped table-bordered" id="tabela-contas">
                                <col>
                                <col>
                                <colgroup class='acoes'>
                                    <col span=2 style="align:center;">
                                </colgroup>
                                <thead class="table-dark">
                                    <tr>
                                        <th scope="col">Cliente</th>
                                        <th scope="col">Mesa</th>
                                        <th scope="col" colspan="2">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>

                                </tbody>
                            </table>
                        </div>
                        <div class="text-left">
                            <a href="/" class="btn btn-secondary mt-3">Voltar</a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal de adicionar itens à conta -->
            <div class="modal fade" id="modalAdicionarItens" tabindex="-1" role="dialog" aria-labelledby="modalAdicionarItensLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Adicionar itens</h4>
                            <button type="button" class=" btn btn-secondary close" data-bs-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="mt-2 d-flex flex-wrap gap-2" id="div-categorias">
                            </div>

                            <div class="container mt-3 p-0">
                                <div class="row g-3 justify-content-start">
                                    <div class="mt-2 d-flex flex-wrap gap-2" id='div-produtos'></div>

                                    <div>
                                </div>
                            </div>
                            
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal de fechar conta -->
            <div class="modal fade" id="modalFecharConta" tabindex="-1" role="dialog" aria-labelledby="modalFecharContaLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Fechar conta</h4>
                            <button type="button" class=" btn btn-secondary close" data-bs-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="mt-2" id='div-tabela-itens'>
                                <h5 class='mb-2'>Itens consumidos</h5>
                                <table id='tabela-itens' class='table table-striped table-bordered'>
                                    <thead>
                                        <tr>
                                            <th>Item</th>
                                            <th>Quantidade</th>
                                            <th>Valor unitário</th>
                                            <th>Valor total</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                    <tfoot></tfoot>
                                </table>
                            </div>

                            <div class="container d-flex">
                                <div class="d-flex flex-column me-auto">
                                    <div class='mt-2'>
                                        <label for="forma-pagamento">Forma de pagamento:</label>
                                        <select name="forma-pagamento" id="forma-pagamento" class="form-select mt-1"></select>
                                    </div>
                                    <div class='mt-2'>
                                        <label for="porcentagem-desconto">Porcentagem de desconto:</label>
                                        <input type="number" value="${Conta.MIN_PORCENTAGEM_DESCONTO}" min="${Conta.MIN_PORCENTAGEM_DESCONTO}" max="${Conta.MAX_PORCENTAGEM_DESCONTO}" name="porcentagem-desconto" id="porcentagem-desconto" class="form-control mt-1">
                                    </div>
                                </div>
                                <div class="d-flex flex-column">
                                    <div id="valores-conta" class='d-flex justify-content-end flex-column mt-2'>
                                        <span class='text-end fw-bold'>Valor total: <span id="valor-total" class='fw-bolder'></span></span>
                                        <span id="span-valor-total-com-desconto" class="d-none text-end mt-4 fw-bold">
                                        Valor total com desconto: <span id="valor-total-com-desconto" class='fw-bolder'></span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-primary" id="botao-fechar-conta">Fechar conta</button>
                        </div>
                    </div>
                </div>
            </div>
        ` );

        const optionsFormaPagamento = document.createDocumentFragment();
        for (const [keyFormaPagamento, formaPagamento] of Object.entries(FormaPagamento)) {
            var option = document.createElement('option');
            option.value = keyFormaPagamento;
            option.innerText = formaPagamento;

            optionsFormaPagamento.append(option);
        }

        document.getElementById('forma-pagamento')?.append(optionsFormaPagamento);

        document.getElementById('botao-fechar-conta')!.addEventListener('click', (event) => {
            event.preventDefault();

            const idConta = parseInt((event.target as HTMLButtonElement).getAttribute('data-id-conta')!);
            this.contaControladora.fecharConta(idConta);
        });

        document.querySelector('#valores-conta #valor-total')?.addEventListener('textChange', () => {
            this.alterarValorTotalComDesconto();
        });

        document.querySelector('#porcentagem-desconto')?.addEventListener('change', () => {
            this.alterarValorTotalComDesconto();
        });
    }

    public alterarValorTotalComDesconto(){
        const porcentagemDesconto = this.porcentagemDesconto();

        if(porcentagemDesconto > 0){

            const valorTotal = parseFloat(document.querySelector('#valores-conta #valor-total')!.getAttribute('data-valor-total') ?? '0');
            const valorTotalComDesconto = valorTotal - (valorTotal * porcentagemDesconto * 0.01);

            document.querySelector('#valores-conta #valor-total-com-desconto')!.setAttribute('data-valor-total-com-desconto', valorTotalComDesconto.toString());
            document.querySelector('#valores-conta #valor-total-com-desconto')!.innerText = valorTotalComDesconto.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
            document.getElementById('span-valor-total-com-desconto')!.classList.remove('d-none');
        } else {
            document.getElementById('span-valor-total-com-desconto')!.classList.add('d-none');
        }
    }

    public porcentagemDesconto(): number{
        return parseInt(document.getElementById('porcentagem-desconto')!.value ?? 0);
    }

    public formaPagamento(): string{
        return document.getElementById('forma-pagamento')!.value ?? '0';
    }

    public exibirSucessoParaFecharConta(conta: Conta): void{
        this.exibirMensagemSucessoFecharConta();

        this.desativarBotaoFecharConta();

        this.alterarBotaoFecharContaDaListagem(conta.id);
    }

    public exibirMensagemSucessoFecharConta(): void{

        Toastify({
            text: "Conta fechada com sucesso.",
            duration: 2000,
            close: true,
            gravity: "top",
            position: "right",
            style: {
                background: "#4CAF50",
            },
            stopOnFocus: true
        }).showToast();
    }

    public desativarBotaoFecharConta(){
        document.getElementById('botao-fechar-conta')?.setAttribute('disabled', 'disabled');
    }

    public alterarBotaoFecharContaDaListagem(idConta){
        var botao = document.querySelector('button.abrir-modal-fechar-conta[data-id-conta="' + idConta + '"]');

        var td = botao?.parentElement;

        botao?.remove();
        td!.innerHTML = '<span class="text-success">Conta fechada</span>';
    }

    public desenharListagemContasAbertas( contas: Conta[] ): void {
        const divTable = document.getElementById('div-tabela-contas');
        divTable!.hidden = false;
        document.querySelector('.aviso-contas-nao-encontradas')?.remove();

        const tbody = document.querySelector( 'tbody' )!;
        tbody.innerText = '';

        const funcionario = UtilLocalStorage.obterFuncionario();

        const fragmento = document.createDocumentFragment();
        for ( const c of contas ) {
            const linha = this.criarLinha( c, funcionario );
            fragmento.append( linha );
        }

        tbody.append( fragmento );
    }

    public criarLinha( c: Conta, funcionario ): HTMLTableRowElement {
        const tr = document.createElement( 'tr' );
        tr.setAttribute('data-id', c.id.toString());

        const celulaAdicionarItens = this.criarCelulaComBotaoAdicionarItens(c.id);

        tr.append(
            this.criarCelula( c.reserva!.cliente.nome, 'clienteNome' ),
            this.criarCelula( c.reserva!.mesa.nome, 'mesaNome' ),
            celulaAdicionarItens
        );

        if(funcionario.cargo === 'GERENTE'){
            const celulaFecharConta = this.criarCelulaComBotaoFecharConta(c.id);
            tr.append(celulaFecharConta);
        }

        return tr;
    }

    public criarCelula( texto: string, classe: string ): HTMLTableCellElement {
        const td = document.createElement( 'td' );
        td.innerText = texto;
        td.classList.add(classe);
        return td;
    }

    public criarCelulaComBotaoAdicionarItens(idConta: number): HTMLTableCellElement {
        const td = document.createElement('td');
    
        const botaoAdicionarItens = document.createElement('button');
        botaoAdicionarItens.innerText = 'Adicionar Itens';
        botaoAdicionarItens.classList.add('btn', 'btn-primary');
        botaoAdicionarItens.setAttribute('data-id-conta', idConta.toString());
        botaoAdicionarItens.setAttribute('data-bs-toggle', 'modal');
        botaoAdicionarItens.setAttribute('data-bs-target', '#modalAdicionarItens');

        botaoAdicionarItens.onclick = (event) => {
            var botao = event.target;
            var idConta = botao?.getAttribute('data-id-conta');
            this.iniciarModalAdicionarItens(idConta);
        };

        td.appendChild(botaoAdicionarItens);

        return td;
    }

    public criarCelulaComBotaoFecharConta(idConta: number): HTMLTableCellElement {
        const td = document.createElement('td');
    
        const botaoFecharConta = document.createElement('button');
        botaoFecharConta.innerText = 'Fechar conta';
        botaoFecharConta.classList.add('btn', 'btn-success', 'abrir-modal-fechar-conta');
        botaoFecharConta.setAttribute('data-id-conta', idConta.toString());
        botaoFecharConta.setAttribute('data-bs-toggle', 'modal');
        botaoFecharConta.setAttribute('data-bs-target', '#modalFecharConta');

        botaoFecharConta.onclick = (event) => {
            var botao = event.target;
            var idConta = botao?.getAttribute('data-id-conta');
            this.iniciarModalFecharConta(idConta);
        };

        td.appendChild(botaoFecharConta);

        return td;
    }

    public renderizarErroContasNaoEncontradas(): void{

        const divTable = document.getElementById('div-tabela-contas');

        if(divTable != null){
            divTable!.hidden = true;
        }

        const divContasNaoEncontradas = document.createElement('div');
        divContasNaoEncontradas.classList.add('aviso-contas-nao-encontradas', 'alert', 'alert-secondary');

        const pContasNaoEncontradas = document.createElement('p');
        pContasNaoEncontradas.innerText = 'Não foram encontradas contas.';
        pContasNaoEncontradas.classList.add('text-center');

        divContasNaoEncontradas.append(pContasNaoEncontradas);

        if(divTable != null){
            divTable!.hidden = true;
            divTable!.insertAdjacentElement('afterend', divContasNaoEncontradas);
        }
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
}