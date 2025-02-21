import Swal from "sweetalert2";
import { Visao } from "../../views/visao.ts";
import RelatorioVendasControladora from "./relatorio-venda-controladora.ts";

import { criaGraficoVendasFormaPagamento, destroyChartVendasFormaPagamento } from './relatorio-vendas-periodo-forma-pagamento.ts';
import { criaGraficoVendasFuncionario, destroyChartVendasFuncionario } from './relatorio-vendas-periodo-funcionario.ts';
import { criaGraficoVendasCategoria, destroyChartVendasCategoria } from './relatorio-vendas-periodo-categoria.ts';
import { criaGraficoVendasDia, destroyChartVendasDia } from './relatorio-vendas-periodo-dia.ts';


const TITULOS_RELATORIOS: Record<string, string> = {
    formaPagamento: 'Relatório de Vendas por Período e Forma de Pagamento',
    funcionario: 'Relatório de Vendas por Período e Funcionário',
    categoria: 'Relatório de Vendas por Período e Categoria',
    vendas: 'Relatório de Vendas por Dia',
    
};

export class RelatorioVendasVisao {
    private relatorioVendasControladora: RelatorioVendasControladora;

    constructor() {
        this.relatorioVendasControladora = new RelatorioVendasControladora(this);
    }

    public iniciarRelatorio(tipo: 'formaPagamento' | 'funcionario' | 'categoria' | 'vendas'): void {
        const config = this.relatorioConfiguracao(tipo);

        this.renderizarTemplate(config.titulo);
        Visao.atualizaTitulo(config.titulo);

        const { dataMinima, dataMaxima } = this.defineDataPadrao();
        config.gerarRelatorio(dataMinima, dataMaxima);

        this.submeterFiltroRelatorio(config.gerarRelatorio, config.destroyChart, config.criarGrafico);
    }

    private relatorioConfiguracao(tipo: 'formaPagamento' | 'funcionario' | 'categoria' | 'vendas') {
        const configMap: Record<
            'formaPagamento' | 'funcionario' | 'categoria' | 'vendas',
            {
                titulo: string;
                criarGrafico: Function;
                destroyChart: Function;
                gerarRelatorio: Function;
            }
        > = {
            formaPagamento: {
                titulo: TITULOS_RELATORIOS.formaPagamento,
                criarGrafico: criaGraficoVendasFormaPagamento,
                destroyChart: destroyChartVendasFormaPagamento,
                gerarRelatorio: (dataMinima: Date, dataMaxima: Date) =>
                    this.relatorioVendasControladora.gerarRelatorioVendasPorPeriodoEFormaPagamento(dataMinima, dataMaxima),
            },
            funcionario: {
                titulo: TITULOS_RELATORIOS.funcionario,
                criarGrafico: criaGraficoVendasFuncionario,
                destroyChart: destroyChartVendasFuncionario,
                gerarRelatorio: (dataMinima: Date, dataMaxima: Date) =>
                    this.relatorioVendasControladora.gerarRelatorioVendasPorPeriodoEFuncionario(dataMinima, dataMaxima),
            },
            categoria: {
                titulo: TITULOS_RELATORIOS.categoria,
                criarGrafico: criaGraficoVendasCategoria,
                destroyChart: destroyChartVendasCategoria,
                gerarRelatorio: (dataMinima: Date, dataMaxima: Date) =>
                    this.relatorioVendasControladora.gerarRelatorioVendasPorPeriodoECategoria(dataMinima, dataMaxima),
            },
            vendas: {
                titulo: TITULOS_RELATORIOS.vendas,
                criarGrafico: criaGraficoVendasDia,
                destroyChart: destroyChartVendasDia,
                gerarRelatorio: (dataMinima: Date, dataMaxima: Date) =>
                    this.relatorioVendasControladora.gerarRelatorioVendasPorPeriodoEDia(dataMinima, dataMaxima),
            },
        };


        return configMap[tipo];
    }

    private renderizarTemplate(titulo: string): void {
        Visao.renderizar(`
            <div class="container my-4">
                <div class="row justify-content-center">
                    <div class="col-lg-10">
                        <h1 class="mb-4 fs-3 text-center">${titulo}</h1>
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
                            <canvas style="max-height: 60vh;" id="reservationsChart" width="200" height="100"></canvas>
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

    private submeterFiltroRelatorio(
        gerarRelatorio: Function,
        destroyChart: Function,
        criarGrafico: Function
    ): void {
        const form = document.getElementById('filterForm') as HTMLFormElement;
        if (form) {
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                const { dataMinima, dataMaxima } = this.pegaDatasDoFiltro();

                gerarRelatorio(dataMinima, dataMaxima);

                const canvas = document.getElementById('reservationsChart') as HTMLCanvasElement;
                destroyChart(canvas);
                criarGrafico(canvas, []);
            });
        }
    }

    private defineDataPadrao(): { dataMinima: Date; dataMaxima: Date } {
        const now = new Date();
        const dataMinima = new Date(now.getFullYear(), now.getMonth(), 1);
        const dataMaxima = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return { dataMinima, dataMaxima };
    }

    private pegaDatasDoFiltro() {
        const dataMinimaElemento = document.getElementById('startDate') as HTMLInputElement;
        const dataMaximaElemento = document.getElementById('endDate') as HTMLInputElement;

        const dataMinima = new Date(dataMinimaElemento.value);
        const dataMaxima = new Date(dataMaximaElemento.value);

        return { dataMinima, dataMaxima };
    }

    public atualizarGraficoFormaPagamento(dados: { formaPagamento: string; totalVendas: number }[]): void {
        const canvas = document.getElementById('reservationsChart') as HTMLCanvasElement;
        destroyChartVendasFormaPagamento(canvas);
        criaGraficoVendasFormaPagamento(canvas, dados);
    }
    
    public atualizarGraficoFuncionario(dados: { funcionario: string; totalVendas: number }[]): void {
        const canvas = document.getElementById('reservationsChart') as HTMLCanvasElement;
        destroyChartVendasFuncionario(canvas);
        criaGraficoVendasFuncionario(canvas, dados);
    }

    public atualizarGraficoCategoria(dados: { categoria: string; totalVendas: number }[]): void {
        const canvas = document.getElementById('reservationsChart') as HTMLCanvasElement;
        destroyChartVendasCategoria(canvas);
        criaGraficoVendasCategoria(canvas, dados);
    }

    public atualizarGraficoVendas(dados: { dia: string; totalVendas: number }[]): void {
        const canvas = document.getElementById('reservationsChart') as HTMLCanvasElement;
        destroyChartVendasDia(canvas);
        criaGraficoVendasDia(canvas, dados);
    }

    public renderizarMensagemErro(titulo: string, mensagem: string): void {
        Swal.fire({
            title: titulo,
            text: mensagem,
            icon: 'error',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn btn-primary',
            },
        });
    }

    public renderizarErroVendasNaoEncontradasParaRelatorio(): void {
        Swal.fire({
            title: "Nenhum dado encontrado",
            text: "Não há dados disponíveis para o período selecionado. Tente ajustar as datas e tente novamente.",
            icon: "warning",
            buttonsStyling: false,
            customClass: {
                confirmButton: "btn btn-primary",
            },
        });
    }
    
}
