<?php

class CategoriaGestor {

    private CategoriaRepositorio $categoriaRepositorio;

    public function __construct(PDO $pdo) {
        $this->categoriaRepositorio = new CategoriaRepositorioEmBDR($pdo);
    }

    public function listar(){
        return $this->categoriaRepositorio->listar();
    }
    
    public function listarComId($categoriaId){
        return $this->categoriaRepositorio->listarComId($categoriaId);
    }
    
}