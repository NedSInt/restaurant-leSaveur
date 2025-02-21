<?php

interface ContaRepositorio {
    public function listar(array $restricoes = []);
    public function listarComId(int $id): ?Conta;
    public function cadastrar(Conta $conta) : Conta;
    public function atualizar(Conta $conta) : bool;
}