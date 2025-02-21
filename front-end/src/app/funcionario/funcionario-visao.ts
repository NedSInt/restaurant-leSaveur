import Swal from "sweetalert2";
import FuncionarioControladora from "./funcionario-controladora.ts";
import Funcionario from "./funcionario.ts";

export default class FuncionarioVisao {

    private funcionarioControladora: FuncionarioControladora;

    constructor(){
        this.funcionarioControladora = new FuncionarioControladora(this);
    }
    
    public iniciarOptions(): void{
        this.funcionarioControladora.listarOptions();
    }

    public desenharOptionsFuncionarios(funcionarios: Funcionario[]): void {

        const fragmento = document.createDocumentFragment();
        for ( const f of funcionarios ) {
            const option = this.criarOption( f );
            fragmento.append( option );
        }

        const selectFuncionario = document.getElementById("funcionario");
        selectFuncionario?.append(fragmento);
    }

    public removerOptions(): void {
        const selectFuncionario = document.getElementById("funcionario");

        if(selectFuncionario != null)
            selectFuncionario.innerHTML = "";
    }

    public criarOption(f: Funcionario): HTMLOptionElement {
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
}