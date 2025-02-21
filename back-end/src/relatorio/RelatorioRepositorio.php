<?php

interface RelatorioRepositorio {
    public function listarQuantidadeVendasEntreDatasEFormaPagamento($restricoes);
    public function listarQuantidadeVendasEntreDatasEFuncionario($restricoes);
    public function listarQuantidadeVendasEntreDatasECategoria($restricoes);
    public function listarQuantidadeVendasEntreDatasEDia($restricoes);
}