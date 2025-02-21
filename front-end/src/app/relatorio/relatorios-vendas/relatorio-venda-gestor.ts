import Requisicao from "../../requisicao.ts";
import UtilReservaData from '../../UtilDataReserva.ts';

const ROTA_RELATORIO_FORMA_PAGAMENTO = 'relatorio/vendas/forma-pagamento';
const ROTA_RELATORIO_FUNCIONARIO = 'relatorio/vendas/funcionario';
const ROTA_RELATORIO_CATEGORIA = 'relatorio/vendas/categoria';
const ROTA_RELATORIO_DIA = 'relatorio/vendas/dia';

export default class RelatorioVendasGestor {

    async consultarQuantidadeDeVendasEntreDatasEFormaPagamento(dataMinima: Date, dataMaxima: Date): Promise<[]> | never {

        const parametros = {
            "dataMinima" : UtilReservaData.formatarDataParaRequisicao(dataMinima),
            "dataMaxima" : UtilReservaData.formatarDataParaRequisicao(dataMaxima),
        };

        return Requisicao.get(ROTA_RELATORIO_FORMA_PAGAMENTO, parametros);
    }

    async consultarQuantidadeDeVendasEntreDatasEFuncionario(dataMinima: Date, dataMaxima: Date): Promise<[]> | never {

        const parametros = {
            "dataMinima" : UtilReservaData.formatarDataParaRequisicao(dataMinima),
            "dataMaxima" : UtilReservaData.formatarDataParaRequisicao(dataMaxima),
        };

        return Requisicao.get(ROTA_RELATORIO_FUNCIONARIO, parametros);
    }

    async consultarQuantidadeDeVendasEntreDatasECategoria(dataMinima: Date, dataMaxima: Date): Promise<[]> | never {

        const parametros = {
            "dataMinima" : UtilReservaData.formatarDataParaRequisicao(dataMinima),
            "dataMaxima" : UtilReservaData.formatarDataParaRequisicao(dataMaxima),
        };

        return Requisicao.get(ROTA_RELATORIO_CATEGORIA, parametros);
    }

    async consultarQuantidadeDeVendasEntreDatasEDia(dataMinima: Date, dataMaxima: Date): Promise<[]> | never {

        const parametros = {
            "dataMinima" : UtilReservaData.formatarDataParaRequisicao(dataMinima),
            "dataMaxima" : UtilReservaData.formatarDataParaRequisicao(dataMaxima),
        };

        return Requisicao.get(ROTA_RELATORIO_DIA, parametros);
    }
}