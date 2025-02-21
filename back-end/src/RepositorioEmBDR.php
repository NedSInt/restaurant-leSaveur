<?php

abstract class RepositorioEmBDR{

    protected PDO $pdo;

    public function __construct(PDO $pdo){
        $this->pdo = $pdo;
    }

    protected function obterLinhas($comando, $parametros = []){

        $ps = $this->pdo->prepare($comando);
        $ps->execute($parametros);

        return $ps->fetchAll();
    }

    protected function obterLinha($comando, $parametros){

        $ps = $this->pdo->prepare($comando);
        $ps->execute($parametros);

        return $ps->fetch();
    }

    protected function inserirLinha($comando, $parametros): int|false{

        $ps = $this->pdo->prepare($comando);
        $ps->execute($parametros);

        $ultimoIdInserido = $this->pdo->lastInsertId();

        return ! empty( $ultimoIdInserido ) ? (int) $ultimoIdInserido : $ultimoIdInserido;
    }

    /**
     * @return integer Número de linhas afetadas
     */
    protected function executarComando($comando, $parametros): int {
        $ps = $this->pdo->prepare($comando);

        $ps->execute($parametros);

        return $ps->rowCount();
    }
}