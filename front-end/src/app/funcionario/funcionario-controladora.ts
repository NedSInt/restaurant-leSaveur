import RequisicaoError from "../error/requisicao-error.ts";
import FuncionarioGestor from "./funcionario-gestor.ts";
import FuncionarioVisao from "./funcionario-visao.ts";

export default class FuncionarioControladora {

    private funcionarioGestor: FuncionarioGestor;
    private funcionarioVisao: FuncionarioVisao;

    constructor(visao: FuncionarioVisao) {
        this.funcionarioGestor = new FuncionarioGestor();
        this.funcionarioVisao = visao;
    }

    async listarOptions(): Promise<void>{
        try{
            const funcionarios = await this.funcionarioGestor.consultarFuncionarios();
            this.funcionarioVisao.desenharOptionsFuncionarios(funcionarios);
        } catch( e ){
            if( e instanceof RequisicaoError ){
                this.funcionarioVisao.renderizarMensagemErro("Erro para obter funcionários para listagem.", e.message);
                this.funcionarioVisao.removerOptions();
            } else {
                console.log(e.message);
            }
        }
    }
}