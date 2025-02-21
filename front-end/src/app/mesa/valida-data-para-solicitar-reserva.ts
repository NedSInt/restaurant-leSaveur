import DataInvalidaParaSolicitarReservaError from "../error/data-invalida-para-solicitar-reserva-error.ts";

export default abstract class ValidaDataParaSolicitarReserva {

    static readonly HORA_INICIO_SOLICITACAO_RESERVA: number = 11;
    static readonly TEXTO_HORA_INICIO_SOLICITACAO_RESERVA: string = "11:00";
    static readonly HORA_FIM_SOLICITACAO_RESERVA: number = 20;
    static readonly TEXTO_HORA_FIM_SOLICITACAO_RESERVA: string = "20:00";

    static readonly DURACAO_RESERVA_EM_HORAS: number = 2;

    static readonly DOMINGO: Number = 0;
    static readonly SEGUNDA_FEIRA: Number = 1;
    static readonly TERCA_FEIRA: Number = 2;
    static readonly QUARTA_FEIRA: Number = 3;
    static readonly QUINTA_FEIRA: Number = 4;
    static readonly SEXTA_FEIRA: Number = 5;
    static readonly SABADO: Number = 6;

    static readonly TEXTO_DOMINGO: string = 'domingo';
    static readonly TEXTO_SEGUNDA_FEIRA: string = 'segunda-feira';
    static readonly TEXTO_TERCA_FEIRA: string = 'terça-feira';
    static readonly TEXTO_QUARTA_FEIRA: string = 'quarta-feira';
    static readonly TEXTO_QUINTA_FEIRA: string = 'quinta-feira';
    static readonly TEXTO_SEXTA_FEIRA: string = 'sexta-feira';
    static readonly TEXTO_SABADO: string = 'sábado';

    static readonly TEXTO_DIAS_SEMANA = [this.TEXTO_DOMINGO, this.TEXTO_SEGUNDA_FEIRA, this.TEXTO_TERCA_FEIRA, this.TEXTO_QUARTA_FEIRA, this.TEXTO_QUINTA_FEIRA, this.TEXTO_SEXTA_FEIRA, this.TEXTO_SABADO];

    static readonly DIAS_SEMANA = [this.SEGUNDA_FEIRA, this.TERCA_FEIRA, this.QUARTA_FEIRA, this.QUINTA_FEIRA, this.SEXTA_FEIRA];

    static readonly DIAS_FIM_SEMANA = [this.DOMINGO, this.SABADO];

    static readonly DIAS_SEM_RESERVA = [this.SEGUNDA_FEIRA, this.TERCA_FEIRA, this.QUARTA_FEIRA];
    static readonly DIAS_COM_RESERVA = [this.QUINTA_FEIRA, this.SEXTA_FEIRA, this.SABADO, this.DOMINGO];

    static erros: Array<string> = [];

    /**
     * @throws DataInvalidaParaSolicitarReservaError
     */
    static validarDataParaCadastroConta(data: Date): boolean | never {
        this.erros = [];
        const horas = data.getHours();
        const minutos = data.getMinutes();

        if( 
            this.horarioParaCadastroInvalido(horas, minutos)
        ){
            this.erros.push('O horário para abrir uma conta é entre ' + this.TEXTO_HORA_INICIO_SOLICITACAO_RESERVA + ' e ' + this.TEXTO_HORA_FIM_SOLICITACAO_RESERVA);
        }

        if(this.erros.length){
            throw new DataInvalidaParaSolicitarReservaError('Erro para abrir conta nesta data.', this.erros);
        }

        return true;
    }

    /**
     * @throws DataInvalidaParaSolicitarReservaError
     */
    static validarDataParaCadastroReserva(data: Date): boolean | never {
        this.erros = [];
        const dataAtual = new Date();
        const diaDaSemana = data.getDay();
        const horas = data.getHours();
        const minutos = data.getMinutes();

        this.validaDiaDaSemana(diaDaSemana);

        if(dataAtual > data){
            this.erros.push('A data de solicitação da reserva deve ser posterior à data atual.');
        }

        if( 
            this.horarioParaCadastroInvalido(horas, minutos)
        ){
            this.erros.push('O horário para fazer uma reserva é entre ' + this.TEXTO_HORA_INICIO_SOLICITACAO_RESERVA + ' e ' + this.TEXTO_HORA_FIM_SOLICITACAO_RESERVA);
        }

        if(this.erros.length){
            throw new DataInvalidaParaSolicitarReservaError('Erro para solicitar reserva nesta data.', this.erros);
        }

        return true;
    }

    private static validaDiaDaSemana(diaDaSemana){
        if(this.DIAS_SEM_RESERVA.includes(diaDaSemana)){
            let diasComReserva = this.DIAS_COM_RESERVA.map((dia) => this.TEXTO_DIAS_SEMANA[String(dia)]);
            this.erros.push('Solicitação de reserva só é permitido para: '  + diasComReserva.join(", ") + ".");
        }
    }

    private static horarioParaCadastroInvalido(horas, minutos){
        return (horas < this.HORA_INICIO_SOLICITACAO_RESERVA || 
            (
                horas > this.HORA_FIM_SOLICITACAO_RESERVA ||
                (
                    horas == this.HORA_FIM_SOLICITACAO_RESERVA && 
                    minutos > 0
                )
            ) );
    }
}