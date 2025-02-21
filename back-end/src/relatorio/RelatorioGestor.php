<?php

use phputil\TDateTime as TDateTime;

class RelatorioGestor {

    private RelatorioRepositorio $relatorioRepositorio;


    public function __construct(PDO $pdo) {
        $this->relatorioRepositorio = new RelatorioRepositorioEmBDR( $pdo );
    }

    public function listarQuantidadeVendasEntreDatasEFormaPagamento(TDateTime $dataMinima, TDateTime $dataMaxima){

        $restricoes = [
            "dataMinima" => $dataMinima->toDatabaseString(),
            "dataMaxima" => $dataMaxima->toDatabaseString()
        ];

        return $this->relatorioRepositorio->listarQuantidadeVendasEntreDatasEFormaPagamento($restricoes);
    }

    public function listarQuantidadeVendasEntreDatasEFuncionario(TDateTime $dataMinima, TDateTime $dataMaxima){

        $restricoes = [
            "dataMinima" => $dataMinima->toDatabaseString(),
            "dataMaxima" => $dataMaxima->toDatabaseString()
        ];

        return $this->relatorioRepositorio->listarQuantidadeVendasEntreDatasEFuncionario($restricoes);
    }

    public function listarQuantidadeVendasEntreDatasECategoria(TDateTime $dataMinima, TDateTime $dataMaxima){

        $restricoes = [
            "dataMinima" => $dataMinima->toDatabaseString(),
            "dataMaxima" => $dataMaxima->toDatabaseString()
        ];

        return $this->relatorioRepositorio->listarQuantidadeVendasEntreDatasECategoria($restricoes);
    }

    public function listarQuantidadeVendasEntreDatasEDia(TDateTime $dataMinima, TDateTime $dataMaxima){

        $restricoes = [
            "dataMinima" => $dataMinima->toDatabaseString(),
            "dataMaxima" => $dataMaxima->toDatabaseString()
        ];

        return $this->relatorioRepositorio->listarQuantidadeVendasEntreDatasEDia($restricoes);
    }
}