<?php

use phputil\TDateTime;

class Reserva {

    public int $id = 0;
    public ?Mesa $mesa;
    public ?Cliente $cliente;
    public ?Funcionario $funcionario;
    public string $dataReserva;
    public bool $ativo;

    CONST DURACAO_RESERVA_EM_HORAS = 2;

    public function __construct(int $id = 0, Mesa $mesa = null, Cliente $cliente = null, Funcionario $funcionario = null, string $dataReserva = null, bool $ativo = true){
        $this->id = $id;
        $this->mesa = $mesa;
        $this->cliente = $cliente;
        $this->funcionario = $funcionario;
        $this->dataReserva = $dataReserva;
        $this->ativo = $ativo;
    }

    public function validar(): array{
        $problemas = [];

        

        return $problemas;
    }
}