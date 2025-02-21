<?php

use phputil\TDateTime;
class ValidadorDataReserva {

    public static function validarData(TDateTime $dataReserva, bool $paraCadastrarConta = false){
        $problemas = [];

        if( ! $paraCadastrarConta ){
            if($dataReserva->before(new DateTime())){
                $problemas[] = "Não é possível solicitar reserva para datas passadas.";
            }

            if( ! in_array($dataReserva->dayOfWeek(), UtilSolicitacaoReserva::DIAS_COM_RESERVA) ){
                $problemas[] = "Na data selecionada não é possível solicitar reserva.";
            }
        }

        $horarioReserva = $dataReserva->hour();

        if( $horarioReserva < UtilSolicitacaoReserva::HORA_INICIO_SOLICITACAO_RESERVA || $horarioReserva > UtilSolicitacaoReserva::HORA_FIM_SOLICITACAO_RESERVA){
            $problemas [] = "O horário para " . ( $paraCadastrarConta ? "abrir conta é entre " : "fazer reserva é entre ") . UtilSolicitacaoReserva::HORA_INICIO_SOLICITACAO_RESERVA . ":00 e " . UtilSolicitacaoReserva::HORA_FIM_SOLICITACAO_RESERVA . ":00.";
        }

        return $problemas;
    }

    public static function validarReserva(Reserva $reserva, ReservaRepositorio $reservaRepositorio, bool $paraCadastrarConta = false): array{
        $problemas = [];

        $dataReserva = new TDateTime($reserva->dataReserva);

        if( ! $dataReserva->isValidDatabaseDateTime( $dataReserva->toDatabaseString(), '-') ){
            return ['Data para consulta de disponibilidade de mesas está inválida. A data deve estar no formato ' . TDateTime::DATABASE_DATETIME_FORMAT];
        }

        $problemas = self::validarData($dataReserva, $paraCadastrarConta);

        $idMesa = $reserva->mesa->id;

        if(! $dataReserva->isWeekend() && $idMesa > UtilSolicitacaoReserva::QUANTIDADE_MAXIMA_MESAS_MEIO_DE_SEMANA){
            $problemas[] = 'Esta mesa está indisponível para a data.';
        }

        $horaMinima = $dataReserva->hour() - Reserva::DURACAO_RESERVA_EM_HORAS;
        $horaMaxima = $dataReserva->hour() + Reserva::DURACAO_RESERVA_EM_HORAS;
        $restricoes = [
            "dataMinima" => $dataReserva->setHour($horaMinima)->toDatabaseString(),
            "dataMaxima" => $dataReserva->setHour($horaMaxima)->toDatabaseString(),
            "idMesa" => $idMesa
        ];

        $mesaEstaDisponivel = $reservaRepositorio->mesaPossuiReservaNaData($restricoes);

        if($mesaEstaDisponivel == false) {
            $problemas[] = 'Esta mesa não está disponível para reserva nesta data.'; 
        }

        return $problemas;
    }

}