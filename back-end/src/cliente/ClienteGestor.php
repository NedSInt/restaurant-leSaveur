<?php

class ClienteGestor {

    private ClienteRepositorio $clienteRepositorio;

    public function __construct(PDO $pdo) {
        $this->clienteRepositorio = new ClienteRepositorioEmBDR($pdo);
    }

    public function listar(){
        return $this->clienteRepositorio->listar();
    }

}