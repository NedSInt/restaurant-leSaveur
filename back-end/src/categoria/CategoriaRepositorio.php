<?php

interface CategoriaRepositorio {
    public function listar();
    public function listarComId(int $id): ?Categoria;
}