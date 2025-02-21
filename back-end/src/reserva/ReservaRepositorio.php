<?php

interface ReservaRepositorio {
    public function listar(array $restricoes = []);
    public function listarReservasFuturas();
    public function listarComId(int $id): ?Reserva;
    public function cadastrar(Reserva $reserva) : Reserva;
    public function alterarAtivoReserva(int $id, bool $ativo): bool;
    public function listarQuantidadeReservasEntreDatas($restricoes);
    public function mesaPossuiReservaNaData($restricoes);
}