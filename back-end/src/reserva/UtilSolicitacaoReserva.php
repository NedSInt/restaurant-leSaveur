<?php

use phputil\TDateTime;

class UtilSolicitacaoReserva {

    const HORA_INICIO_SOLICITACAO_RESERVA = 11;
    const HORA_FIM_SOLICITACAO_RESERVA = 20;

    const DIAS_FIM_SEMANA = [ TDateTime::SATURDAY, TDateTime::SUNDAY ];

    const DIAS_MEIO_DE_SEMANA = [ TDateTime::MONDAY, TDateTime::TUESDAY, TDateTime::WEDNESDAY, TDateTime::THURSDAY, TDateTime::FRIDAY ];

    const DIAS_COM_RESERVA = [ TDateTime::THURSDAY, TDateTime::FRIDAY, TDateTime::SATURDAY, TDateTime::SUNDAY ];

    const QUANTIDADE_MAXIMA_MESAS_FIM_DE_SEMANA = 10;
    const QUANTIDADE_MAXIMA_MESAS_MEIO_DE_SEMANA = 7;
    const QUANTIDADE_MINIMA_MESAS_MEIO_DE_SEMANA = 5;

    public static function quantidadeMinimaMesasParaODia(TDateTime $dataReserva){
        if( ! $dataReserva->isWeekend() )
            return self::QUANTIDADE_MINIMA_MESAS_MEIO_DE_SEMANA;
        else
            return null;
    }

    public static function quantidadeMaximaMesasParaODia(TDateTime $dataReserva){
        if($dataReserva->isWeekend())
            return self::QUANTIDADE_MAXIMA_MESAS_FIM_DE_SEMANA;
        else
            return self::QUANTIDADE_MAXIMA_MESAS_MEIO_DE_SEMANA;
    }
}