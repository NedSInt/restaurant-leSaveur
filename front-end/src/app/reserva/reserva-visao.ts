import { Visao } from "../views/visao.ts";
import FuncionarioVisao from "../funcionario/funcionario-visao.ts";
import MesaVisao from "../mesa/mesa-visao.ts";
import ReservaControladora from "./reserva-controladora.ts";
import Reserva from "./reserva.ts";
import Swal from 'sweetalert2'
import { criaGraficoReservas, destroyChart } from '../relatorio/relatorio-reservas.ts'
import UtilLocalStorage from "../UtilLocalStorage.ts";

const TITULO_RESERVAR = 'Restaurante La Saveur - Reservar';
const TITULO_LISTAGEM = 'Restaurante La Saveur - Listagem de Reservas';
const TITULO_RELATORIO = 'Restaurante La Saveur - Relatório de Reservas'

const HORA_MINIMA_RESERVA: Number = 11;
const HORA_MAXIMA_RESERVA: Number = 20;
const HORARIO_MINIMO_RESERVA: string = "11:00";
const HORARIO_MAXIMO_RESERVA: string = "20:00";
export class ReservaVisao {

    private funcionarioVisao: FuncionarioVisao;
    private mesaVisao: MesaVisao;
    private reservaControladora: ReservaControladora;

    constructor(){
        this.reservaControladora = new ReservaControladora( this );
        this.funcionarioVisao = new FuncionarioVisao();
    }

    public iniciarReserva(): void {
        this.renderizaTemplateReserva();
        Visao.atualizaTitulo(TITULO_RESERVAR);

        this.funcionarioVisao = new FuncionarioVisao();
        this.mesaVisao = new MesaVisao();

    }

    public renderizaTemplateReserva(): void {

        const dataAtual = new Date();
        const dataAtualFormatada = dataAtual.getFullYear() + "-" + (Number(dataAtual.getMonth()) + 1) + "-" + dataAtual.getDate();

        Visao.renderizar( `
            <div class="container mt-5">
                <div class="row justify-content-center">
                    <div class="col-lg-10">
                        <h1 class="mb-4 text-center">Reserva de Mesa</h1>
                        <form id='reservar-mesa'>
                            <div class="row">
                                <div class="col-md-6">
                                    <label for="nomeCliente" class="form-label">Nome do Cliente</label>
                                    <input type="text" class="form-control" id="nomeCliente" placeholder="Ex: João Silva" required />
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="telefoneCelular" class="form-label">Telefone do Cliente</label>
                                    <input type="text" class="form-control" id="telefoneCelular" placeholder="(xx) x xxxx-xxxx" required />
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-6 divDataReserva">
                                    <label for="dataReserva" class="form-label">Data</label>
                                    <input type="date" class="form-control" id="dataReserva" min="${dataAtualFormatada}" pattern="[0-9]{2}\/[0-9]{2}\/[0-9]{4}" required />
                                    <div class="alert alert-danger mensagem-erro" hidden>
                                    </div>
                                </div>
                                <div class="col-md-6 divHoraReserva">
                                    <label for="horaReserva" class="form-label">Hora</label>
                                    <input type="time" class="form-control" id="horaReserva" min="${HORARIO_MINIMO_RESERVA}" max="${HORARIO_MAXIMO_RESERVA}" required />
                                    <div class="alert alert-danger mensagem-erro" hidden>
                                    </div>
                                </div>
                            </div>
                            <div class="row mb-3 align-items-end">
                                <div class="col-md-8 divMesa">
                                    <label for="mesa" class="form-label">Mesa</label>
                                    <select id="mesa" class="form-select" required>
                                        <option value="" selected>Selecione data e hora válidas</option>
                                    </select>
                                    <div class="alert alert-danger mensagem-erro" hidden>
                                    </div>
                                </div>
                                <div class="col-md-4 d-flex justify-content-center gap-2 botoes">
                                    <button type="submit" class="btn btn-primary" id="salvarReserva">Reservar</button>
                                    <a href="/" class="btn btn-secondary">Voltar</a>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        ` );

        // this.funcionarioVisao.iniciarOptions();

        document.getElementById('reservar-mesa')?.addEventListener("submit", (e) => {
            e.preventDefault();
            this.reservaControladora.cadastrarReserva();
        });

        document.querySelector("#dataReserva")?.addEventListener("blur", (e) => {
            this.buscarMesasDisponiveisParaData();
        });

        document.querySelector("#horaReserva")?.addEventListener("blur", (e) => {
            this.buscarMesasDisponiveisParaData();
        });
    }

    public buscarMesasDisponiveisParaData(): void {

        const data = this.obterDataReserva();

        if(data != null){
            const divErro = document.querySelector(".divMesa .mensagem-erro")! as HTMLDivElement;

            if(divErro != null){
                divErro.hidden = true;
                divErro.innerText = "";
            }

            this.mesaVisao.iniciarOptions(data, false);
        }
    }

    public obterDataReserva(): Date | void{
        let valorDataValido = this.validaPreenchimentoData();
        let valorHoraValido = this.validaPreenchimentoHora();
        if( ! valorDataValido || ! valorHoraValido ){
            this.mesaVisao.informarSelecioneDataEHoraValidas();
            return;
        }

        let valorData = this.data();
        let valorHora = this.hora();

        let [ano, mes, dia] = valorData.split("-");
        let [hora, minuto] = valorHora.split(":");

        let data: Date = new Date(
            Number(ano), 
            Number(mes) - 1, 
            Number(dia), 
            Number(hora), 
            Number(minuto)
        );

        return data;
    } 

    public data(): string {
        return document.getElementById("dataReserva")?.value ?? '';
    }

    public hora(): string {
        return document.getElementById("horaReserva")?.value ?? '';
    }

    public mesa(): number {
        return parseInt(document.getElementById("mesa")?.value ?? 0);
    }

    public funcionario(): number {
        return UtilLocalStorage.obterIdFuncionario();
    }

    public cliente(): any {
        const nomeCliente = document.getElementById("nomeCliente")?.value ?? '';
        const telefoneCelular = document.getElementById("telefoneCelular")?.value ?? '';

        return { nomeCliente, telefoneCelular };
    }

    public validaPreenchimentoData(): boolean {
        const inputData = document.getElementById("dataReserva")!;
        if( ! inputData.validity.valid ){
            inputData.parentElement!.querySelector("div.mensagem-erro")!.hidden = false;
            inputData.parentElement!.querySelector("div.mensagem-erro")!.innerText = inputData.validationMessage;
            return false;
        } else {

            inputData.parentElement!.querySelector("div.mensagem-erro")!.hidden = true;
            inputData.parentElement!.querySelector("div.mensagem-erro")!.innerText = "";
            return true;
        }
    }

    public validaPreenchimentoHora(): boolean {
        let inputHora = document.getElementById("horaReserva")!;
        if( ! inputHora.validity.valid ){
            inputHora.parentElement!.querySelector("div.mensagem-erro")!.hidden = false;
            inputHora.parentElement!.querySelector("div.mensagem-erro")!.innerText = inputHora.validationMessage;
            return false;
        } else {

            inputHora.parentElement!.querySelector("div.mensagem-erro")!.hidden = true;
            inputHora.parentElement!.querySelector("div.mensagem-erro")!.innerText = "";
            return true;
        }
    }

    public exibirMensagemSucesso(reserva: Reserva): void{
        const dataReservaFormatada = reserva.dataReservaFormatada();
        var htmlAlert = `
            Data: ${dataReservaFormatada}<br>
            Mesa: ${reserva.mesa.nome}<br>
            Cliente: ${reserva.cliente.nome}<br>
            Telefone do Cliente: ${reserva.cliente.telefoneCelular}<br>
            Funcionário: ${reserva.funcionario.nome}<br>
        `;
        Swal.fire({
            title: 'Reserva cadastrada com sucesso',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn btn-primary btn-lg mr-2',
            },
            confirmButtonText: 'Ok',
            html: htmlAlert
        })
    }

    public renderizarErrosCadastroReserva(mensagem, problemas = []): void{

        let titulo = 'Erro para cadastrar reserva.';
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

    public habilitarEnvioFormulario(): void{
        document.querySelector('button[type=submit]')?.removeAttribute('disabled');
    }

    public desabilitarEnvioFormulario(): void{
        document.querySelector('button[type=submit]')?.setAttribute('disabled', 'disabled');
    }

    public iniciarListagem(): void {
        this.renderizaTemplateListagem();
        Visao.atualizaTitulo(TITULO_LISTAGEM);
        this.reservaControladora.listarReservas();
    }

    public iniciarOptionsReservasEmAtendimento(): void{
        this.reservaControladora.listarOptionsMesasParaAtendimento();
    }

    public criarOptionReservaEmAtendimento(r: Reserva): HTMLOptionElement {
        const option = document.createElement('option');
        option.value = String(r.id);
        option.innerText = `${r.cliente.nome} - ${r.mesa.nome}`;
        option.setAttribute('data-cliente-nome', r.cliente.nome);
        option.setAttribute('data-mesa-id', String(r.mesa.id));
        option.setAttribute('data-mesa-nome', r.mesa.nome);
        return option;
    }

    public desenharOptionsReservasParaAtendimento(reservas: Reserva[]): void {

        const fragmento = document.createDocumentFragment();
        for ( const r of reservas ) {
            const option = this.criarOptionReservaEmAtendimento( r );
            fragmento.append( option );
        }

        const selectReserva = document.getElementById("reserva");
        selectReserva?.append(fragmento);
    }

    public removerOptions(): void {
        const selectReserva = document.getElementById("reserva");

        if(selectReserva != null)
            selectReserva.innerHTML = "";
    }

    public renderizarErroReservasNaoEncontradas(): void{

        const divTable = document.getElementById('div-tabela-reservas');

        if(divTable != null){
            divTable!.hidden = true;
        }

        const divReservasNaoEncontradas = document.createElement('div');
        divReservasNaoEncontradas.classList.add('aviso-reservas-nao-encontradas', 'alert', 'alert-secondary');

        const pReservasNaoEncontradas = document.createElement('p');
        pReservasNaoEncontradas.innerText = 'Não foram encontradas reservas.';
        pReservasNaoEncontradas.classList.add('text-center');

        divReservasNaoEncontradas.append(pReservasNaoEncontradas);

        if(divTable != null){
            divTable!.hidden = true;
            divTable!.insertAdjacentElement('afterend', divReservasNaoEncontradas);
        }
    }

    public desenharListagemReservas( reservas: Reserva[] ): void {

        const divTable = document.getElementById('div-tabela-reservas');
        divTable!.hidden = false;
        document.querySelector('.aviso-reservas-nao-encontradas')?.remove();

        const tbody = document.querySelector( 'tbody' )!;
        tbody.innerText = '';

        const fragmento = document.createDocumentFragment();
        for ( const r of reservas ) {
            const linha = this.criarLinha( r );
            fragmento.append( linha );
        }

        tbody.append( fragmento );
    }

    public criarLinha( r: Reserva ): HTMLTableRowElement {
        const tr = document.createElement( 'tr' );
        tr.setAttribute('data-id', r.id.toString());

        const celulaConclusao = r.ativo ? this.criarCelulaComBotaoCancelar() : this.criarCelula('Reserva cancelada', 'reservaCancelada');

        if (r.ativo) {
            celulaConclusao.onclick = (event) => {
                const tr = (event.target as HTMLElement).closest('tr')!;
                this.confirmarCancelamentoReserva(tr.sectionRowIndex);
            };
        }

        const dataReservaFormatada = r.dataReservaFormatada();

        tr.append(
            this.criarCelula( r.funcionario.nome, 'funcionarioNome' ),
            this.criarCelula( r.cliente.nome, 'clienteNome' ),
            this.criarCelula( dataReservaFormatada, 'dataReserva' ),
            this.criarCelula( r.mesa.nome, 'mesaNome' ),
            this.criarCelula( r.ativo ? 'Ativa' : 'Cancelada', 'status' ),
            celulaConclusao
        );

        return tr;
    }

    public criarCelula( texto: string, classe: string ): HTMLTableCellElement {
        const td = document.createElement( 'td' );
        td.innerText = texto;
        td.classList.add(classe);
        return td;
    }

    public criarCelulaComBotaoCancelar(): HTMLTableCellElement {
        const td = document.createElement('td');
    
        const botaoCancelar = document.createElement('button');
        botaoCancelar.innerText = 'Cancelar Reserva';
        botaoCancelar.classList.add('btn', 'btn-danger');
    
        td.appendChild(botaoCancelar);
        
        return td;
    }

    public confirmarCancelamentoReserva( rowIndex: number ): void {
        const tr = document.querySelector('tbody')!.rows[rowIndex];
        const reservaId = parseInt(tr.getAttribute('data-id')!);
        Swal.fire({
            title: 'Tem certeza que deseja cancelar a reserva?',
            buttonsStyling: false,
            showCancelButton: true,
            customClass: {
                confirmButton: 'btn btn-primary btn-lg mr-2',
                cancelButton: 'btn btn-danger btn-lg',
                loader: 'custom-loader',
            },
            loaderHtml: '<div class="spinner-border text-primary"></div>',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                Swal.showLoading()
                return new Promise((resolve) => {
                    setTimeout(() => {
                        this.reservaControladora.cancelarReserva(reservaId);

                        return resolve(true)
                    }, 1000)
                })
            },
        }) 
    }

    // public alteraReservaCancelada(idReserva: number){
    //     var linha = document.querySelector("table tr[data-id='" + idReserva + "']");

    //     var celulaStatus = linha?.querySelector('td:nth-child(5)');
    //     var celulaBotaoCancelar = linha?.querySelector('td:nth-child(6)');
    //     celulaStatus!.innerHTML = 'Cancelada';
    //     celulaBotaoCancelar?.querySelector("button")?.remove();
    //     celulaBotaoCancelar!.innerHTML = 'Reserva cancelada';
    // }

    public renderizaTemplateListagem(): void {

        Visao.renderizar( `
            <div class="container my-4">
                <div class="row justify-content-center">
                    <div class="col-lg-10">
                        <h1 class="mb-4 text-center">Listagem de Reservas</h1>
                        <div class="table-responsive" id="div-tabela-reservas">
                            <table class="table table-striped table-bordered" id="tabela-reservas">
                                <thead class="table-dark">
                                    <tr>
                                        <th scope="col">Funcionário</th>
                                        <th scope="col">Cliente</th>
                                        <th scope="col">Data e Hora</th>
                                        <th scope="col">Mesa</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Ações</th>
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
        ` );

    }

    public iniciarGraficoReservas(): void {
        this.renderizaTemplateGrafico();

        Visao.atualizaTitulo(TITULO_RELATORIO);

        const {dataMinima, dataMaxima} = this.defineDataPadrao()

        this.reservaControladora.gerarRelatorioReservas(dataMinima, dataMaxima);

        this.submeterFiltroRelatorio();
    }

    public submeterFiltroRelatorio(): void {
        const form = document.getElementById('filterForm') as HTMLFormElement;
        if (form) {
            form.addEventListener('submit', (event) => {
                event.preventDefault();

                const { dataMinima, dataMaxima } = this.pegaDatasDoFiltro();

                this.reservaControladora.gerarRelatorioReservas(dataMinima, dataMaxima);
            });
        }
    }

    public renderizarErroReservasNaoEncontradasParaRelatorio(): void{

        // Para evitar de adicionar a mensagem de aviso mais de uma vez.
        if(document.querySelectorAll('.aviso-reservas-nao-encontradas').length > 0){
            return;
        }

        const divRelatorio = document.getElementById('div-relatorio-reservas');
        divRelatorio!.hidden = true;

        const canvas = document.getElementById('reservationsChart') as HTMLCanvasElement;
        if (!canvas) return;

        destroyChart(canvas);

        const divReservasNaoEncontradas = document.createElement('div');
        divReservasNaoEncontradas.classList.add('aviso-reservas-nao-encontradas', 'alert', 'alert-secondary');

        const pReservasNaoEncontradas = document.createElement('p');
        pReservasNaoEncontradas.innerText = 'Não foram encontradas reservas para geração do relatório.';
        pReservasNaoEncontradas.classList.add('text-center');

        divReservasNaoEncontradas.append(pReservasNaoEncontradas);

        divRelatorio!.insertAdjacentElement('beforebegin', divReservasNaoEncontradas);
    }

    public pegaDatasDoFiltro() {
        const dataMinimaElemento = document.getElementById('startDate') as HTMLInputElement;
        const dataMaximaElemento = document.getElementById('endDate') as HTMLInputElement;

        const dataMinima = this.criarDataSemHoras(new Date(dataMinimaElemento.value));
        const dataMaxima = this.criarDataSemHoras(new Date(dataMaximaElemento.value));

        return { dataMinima, dataMaxima };
    }
    
    public criarDataSemHoras(data: Date): Date {
        return new Date(data.getFullYear(), data.getMonth(), data.getDate() + 1);
    }
    
    public defineDataPadrao () {
        const now = new Date();
        const dataMinima = new Date(now.getFullYear(), now.getMonth(), 1);
        const dataMaxima = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return { dataMinima, dataMaxima };
    }
    
    public atualizarGrafico (reservas: any): void {

        const divTable = document.getElementById('div-relatorio-reservas');
        divTable!.hidden = false;
        document.querySelector('.aviso-reservas-nao-encontradas')?.remove();

        const canvas = document.getElementById('reservationsChart') as HTMLCanvasElement;
        if (!canvas) return;

        criaGraficoReservas(canvas, reservas);
    
    }

    public renderizaTemplateGrafico(): void {
        Visao.renderizar(`
            <div class="container my-4">
                <div class="row justify-content-center">
                    <div class="col-lg-10">
                        <h1 class="mb-4 text-center">Relatório de Reservas</h1>
                        <form id="filterForm" class="mb-4 d-flex flex-column align-items-center">
                        <div class="row g-3 w-100 justify-content-center">
                            <div class="col-auto">
                            <label for="startDate" class="form-label">Data Inicial:</label>
                            <input type="date" id="startDate" name="startDate" class="form-control" required>
                            </div>
                            <div class="col-auto">
                            <label for="endDate" class="form-label">Data Final:</label>
                            <input type="date" id="endDate" name="endDate" class="form-control" required>
                            </div>
                            <div class="col-auto align-self-end">
                            <button type="submit" class="btn btn-primary">Filtrar</button>
                            </div>
                        </div>
                        </form>
                        <div class="d-flex justify-content-center" id="div-relatorio-reservas">
                            <canvas id="reservationsChart" width="400" height="200"></canvas>
                        </div>
                        <div class="text-left">
                            <a href="/" class="btn btn-secondary mt-3">Voltar</a>
                        </div>
                    </div>
                </div>
            </div>
        `);

        const { dataMinima, dataMaxima } = this.defineDataPadrao();
        (document.getElementById('startDate') as HTMLInputElement).valueAsDate = dataMinima;
        (document.getElementById('endDate') as HTMLInputElement).valueAsDate = dataMaxima;
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