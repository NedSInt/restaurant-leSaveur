import RequisicaoError from "../../error/requisicao-error.ts";
import DadosNaoEncontradosError from "../../error/dados-nao-encontrados-error.ts";
import RelatorioVendasGestor from "./relatorio-venda-gestor.ts";
import { RelatorioVendasVisao } from "./relatorio-vendas-visao.ts";

export default class RelatorioVendasControladora {

    private relatorioVendasGestor: RelatorioVendasGestor;
    private relatorioVendasVisao: RelatorioVendasVisao;

    constructor(visao: RelatorioVendasVisao) {
        this.relatorioVendasGestor = new RelatorioVendasGestor();
        this.relatorioVendasVisao = visao;
    }

    public async gerarRelatorioVendasPorPeriodoEFormaPagamento (dataMinima: Date, dataMaxima: Date) {
        try {
            const vendas = await this.relatorioVendasGestor.consultarQuantidadeDeVendasEntreDatasEFormaPagamento(dataMinima, dataMaxima);

            this.relatorioVendasVisao.atualizarGraficoFormaPagamento(vendas);
        } catch ( e ) {
            this.tratamentosDeExcecoes(e);
        }
    }

    public async gerarRelatorioVendasPorPeriodoEFuncionario (dataMinima: Date, dataMaxima: Date) {
        try {
            const vendas = await this.relatorioVendasGestor.consultarQuantidadeDeVendasEntreDatasEFuncionario(dataMinima, dataMaxima);

            this.relatorioVendasVisao.atualizarGraficoFuncionario(vendas);
        } catch ( e ) {
            this.tratamentosDeExcecoes(e);
        }
    }

    public async gerarRelatorioVendasPorPeriodoECategoria (dataMinima: Date, dataMaxima: Date) {
        try {
            const vendas = await this.relatorioVendasGestor.consultarQuantidadeDeVendasEntreDatasECategoria(dataMinima, dataMaxima);

            this.relatorioVendasVisao.atualizarGraficoCategoria(vendas);
        } catch ( e ) {
            this.tratamentosDeExcecoes(e);
        }
    }

    public async gerarRelatorioVendasPorPeriodoEDia (dataMinima: Date, dataMaxima: Date) {
        try {
            const vendas = await this.relatorioVendasGestor.consultarQuantidadeDeVendasEntreDatasEDia(dataMinima, dataMaxima);

            this.relatorioVendasVisao.atualizarGraficoVendas(vendas);
        } catch ( e ) {
            this.tratamentosDeExcecoes(e);
        }
    }

    public tratamentosDeExcecoes (erro) {
        if( erro instanceof DadosNaoEncontradosError ){
            this.relatorioVendasVisao.renderizarErroVendasNaoEncontradasParaRelatorio();
        } else if(erro instanceof RequisicaoError){
            this.relatorioVendasVisao.renderizarMensagemErro('Erro para obter dados de vendas para geração do relatório.', erro.message);
        } else {
            console.log(erro.message);
        }
    }
}