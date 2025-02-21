<?php

use phputil\TDateTime;

class MesaGestor {

    private MesaRepositorio $mesaRepositorio;

    public function __construct(PDO $pdo) {
        $this->mesaRepositorio = new MesaRepositorioEmBDR($pdo);
    }

    public function listar(){
        return $this->mesaRepositorio->listar();
    }

    public function listarDisponiveis(TDateTime $dataReserva, bool $paraCadastrarConta = false){
        $problemas = ValidadorDataReserva::validarData($dataReserva, $paraCadastrarConta);

        if(count($problemas) > 0){
            throw new ValidacaoException( 'Data inválida para listagem de mesas.', $problemas );
        }

        $horaMinima = $dataReserva->hour() - Reserva::DURACAO_RESERVA_EM_HORAS;
        $horaMaxima = $dataReserva->hour() + Reserva::DURACAO_RESERVA_EM_HORAS;
        $restricoes = [
            "dataMinima" => $dataReserva->setHour($horaMinima)->toDatabaseString(),
            "dataMaxima" => $dataReserva->setHour($horaMaxima)->toDatabaseString(),
            "quantidadeMaximaMesas" => UtilSolicitacaoReserva::quantidadeMaximaMesasParaODia($dataReserva)
        ];

        return $this->mesaRepositorio->listarDisponiveis($restricoes);
    }
}