<?php

class ProdutoGestor {

    private ProdutoRepositorio $produtoRepositorio;
    private CategoriaRepositorio $categoriaRepositorio;

    public function __construct(PDO $pdo) {
        $this->categoriaRepositorio = new CategoriaRepositorioEmBDR($pdo);
        $this->produtoRepositorio = new ProdutoRepositorioEmBDR($pdo, $this->categoriaRepositorio);
    }

    public function listar(array $restricoes = []){
        return $this->produtoRepositorio->listar($restricoes);
    }

}