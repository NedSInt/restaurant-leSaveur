import Funcionario from "./funcionario.ts";
import Requisicao from "../requisicao.ts";

const ROTA = 'funcionarios';

export default class FuncionarioGestor {
    private funcionarios;

    constructor( funcionarios: Funcionario[] | void ) {
        this.funcionarios = funcionarios;
    }

    public async consultarFuncionarios() {
        return Requisicao.get(ROTA);
    }

}