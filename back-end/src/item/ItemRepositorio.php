<?php

interface ItemRepositorio {
    public function listar(array $restricoes = []);
    public function listarComId(int $id): ?Item;
    public function cadastrar(Item $item, Conta $conta): ?Item;
}