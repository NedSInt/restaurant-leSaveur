import Swal from "sweetalert2";
import DataInvalidaParaSolicitarReservaError from "../error/data-invalida-para-solicitar-reserva-error.ts";
import { ReservaVisao } from "../reserva/reserva-visao.ts";
import MesaControladora from "./mesa-controladora.ts";
import Mesa from "./mesa.ts";

export default class MesaVisao {

    private mesaControladora: MesaControladora;
    private reservaVisao: ReservaVisao;

    constructor(){
        this.mesaControladora = new MesaControladora(this);
        this.reservaVisao = new ReservaVisao();
    }

    public iniciarOptions(data: Date, paraCadastrarConta: boolean = false): void{
        this.mesaControladora.listarOptions(data, paraCadastrarConta);
    }

    public desenharOptionsMesas(mesas: Mesa[]): void {
        this.removerOptions();

        const selectMesa = document.getElementById("mesa");
        if(selectMesa != null && mesas.length > 0){
            selectMesa.append(this.optionSelecioneMesa());
        }

        const fragmento = document.createDocumentFragment();

        if(mesas.length == 0){
            const option = this.optionSemMesasDisponiveis();
            fragmento.append( option );
        } else {
            for ( const m of mesas ) {
                const option = this.criarOption( m );
                fragmento.append( option );
            }
        }

        if(selectMesa != null){
            selectMesa.append(fragmento);
        }
    }

    public criarOption(m: Mesa): HTMLOptionElement {
        const option = document.createElement('option');
        option.value = String(m.id);
        option.innerText = m.nome;
        return option;
    }

    public renderizarMesasNaoEncontradas(): void{
        const selectMesa = document.getElementById("mesa");
        const fragmento = document.createDocumentFragment();

        if(selectMesa != null){
            const option = this.optionSemMesasDisponiveis();
            fragmento.append( option );
            selectMesa.append(fragmento);
        }
    }

    public renderizarErrosDataInvalidaParaSolicitarReserva( e: DataInvalidaParaSolicitarReservaError ): void{
        const divErro = document.querySelector(".divMesa .mensagem-erro");

        if(divErro != null){
            divErro.hidden = false;
            divErro.innerText = e.data.join(" ");
        }

        this.removerOptions();
        this.reservaVisao.desabilitarEnvioFormulario();

        const selectMesa = document.getElementById("mesa");
        if(selectMesa != null){
            selectMesa.append( this.optionSelecioneDataEHoraValidas() );
        }
    }

    public removerOptions(): void {
        const selectMesa = document.getElementById("mesa");

        if(selectMesa != null)
            selectMesa.innerHTML = "";
    }

    public removerMensagemErroListarOptions(): void{
        const spanErro = document.querySelector(".divMesa .erro");

        if(spanErro != null){
            spanErro.innerText = "";
        }
    }

    public informarCarregamentoMesas(): void {
        this.removerOptions();
        this.removerMensagemErroListarOptions();
        this.reservaVisao.habilitarEnvioFormulario();
        const selectMesa = document.getElementById("mesa");
        if(selectMesa != null){
            selectMesa.append( this.optionCarregandoMesas() );
        }
    }

    public optionCarregandoMesas(): HTMLOptionElement{
        const option = document.createElement('option');
        option.value = "";
        option.setAttribute("selected", "selected");
        option.innerText = "Carregando mesas";

        return option;
    }

    public informarSelecaoMesa(): void {
        this.removerOptions();
        const selectMesa = document.getElementById("mesa");
        if(selectMesa != null){
            selectMesa.append( this.optionSelecioneMesa() );
        }
    }

    public optionSemMesasDisponiveis(): HTMLOptionElement{
        const option = document.createElement('option');
        option.value = "";
        option.setAttribute("selected", "selected");
        option.innerText = "Sem mesas disponíveis...";

        return option;
    }

    public optionSelecioneMesa(): HTMLOptionElement{
        const option = document.createElement('option');
        option.value = "";
        option.setAttribute("selected", "selected");
        option.innerText = "Selecione uma mesa";

        return option;
    }

    public informarSelecioneDataEHoraValidas(): void {
        this.removerOptions();
        const selectMesa = document.getElementById("mesa");
        if(selectMesa != null){
            selectMesa.append( this.optionSelecioneDataEHoraValidas() );
        }
    }

    public optionSelecioneDataEHoraValidas(): HTMLOptionElement{
        const option = document.createElement('option');
        option.value = "";
        option.setAttribute("selected", "selected");
        option.innerText = "Selecione data e hora válidas.";

        return option;
    }

    public renderizarMensagemErro(titulo: string, mensagem: string){
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