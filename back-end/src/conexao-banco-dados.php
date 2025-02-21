<?php

require_once 'exception/DatabaseException.php';

function criarConexao(bool $teste = false){
    $nomeBanco = $teste ? "g2_teste" : "g2";
    try{
        $pdo = new PDO("mysql:host=localhost;dbname=" . $nomeBanco . ";charset=utf8mb4", "root", "", [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);

        return $pdo;
    } catch( Exception $e ){
        throw new DatabaseException("Houve um erro para criar a conexão com o banco de dados.");
    };

}
