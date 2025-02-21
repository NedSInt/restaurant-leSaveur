<?php

interface ClienteRepositorio {
    public function listar();
    public function listarComId(int $id): ?Cliente;
    public function listarComNome(string $nome) : ?Cliente;
    public function cadastrar(Cliente $cliente) : Cliente;
}