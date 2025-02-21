<?php

interface ProdutoRepositorio {
    public function listar(array $restricoes = []);
    public function listarComId(int $id);
}