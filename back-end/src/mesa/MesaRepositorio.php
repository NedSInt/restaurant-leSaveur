<?php

interface MesaRepositorio {
    public function listar();
    public function listarComId(int $id): ?Mesa;
    public function listarDisponiveis($restricoes);
}