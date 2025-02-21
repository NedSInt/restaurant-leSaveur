<?php

require_once './src/conexao-banco-dados.php';
use phputil\TDateTime;
describe('RelatorioGestorEmBDR', function() {

    $this->pdo = criarConexao(true);
    $this->relatorioGestor = null;

    beforeAll(function () {
        $this->relatorioGestor = new RelatorioGestor($this->pdo);
        $this->pdo->exec('
            DELETE FROM conta;
            DELETE FROM reserva;
            DELETE FROM item;
            DELETE FROM produto;
            DELETE FROM categoria;
            DELETE FROM cliente;
            DELETE FROM funcionario;
            DELETE FROM mesa;
        ');

        $this->pdo->exec(file_get_contents('../db/dados-basicos.sql'));

        $insercoesBase = geraDadosTesteParaBanco();
        $this->pdo->exec( $insercoesBase );
    });

    describe('listarQuantidadeVendasEntreDatasEFormaPagamento', function() {

        it('Deve retornar as vendas por forma de pagamento dentro do intervalo de datas', function() {

            $dataMinima = TDateTime::createFromFormat('Y-m-d', '2025-01-01');
            $dataMaxima = TDateTime::createFromFormat('Y-m-d', '2025-12-31');
            
            $resultados = $this->relatorioGestor->listarQuantidadeVendasEntreDatasEFormaPagamento($dataMinima, $dataMaxima);
        
            expect($resultados)->not->toBeEmpty();        
        
            $resultado = $resultados[0];

            expect($resultado['formaPagamento'])->toBe('Pix');
            expect($resultado['totalVendas'])->toEqual("183.70");

        });

        it('Deve retornar vazio se não houver vendas por forma de pagamento no intervalo de datas', function() {

            $dataMinima = TDateTime::createFromFormat('Y-m-d', '2026-01-01');
            $dataMaxima = TDateTime::createFromFormat('Y-m-d', '2026-12-31');
            
            $resultados = $this->relatorioGestor->listarQuantidadeVendasEntreDatasEFormaPagamento($dataMinima, $dataMaxima);
        
            expect($resultados)->toBeEmpty();
        });

        
    });

    describe('listarQuantidadeVendasEntreDatasEFuncionario', function() {

        it('Deve retornar as vendas por funcionário dentro do intervalo de datas', function() {

            $dataMinima = TDateTime::createFromFormat('Y-m-d', '2023-01-01');
            $dataMaxima = TDateTime::createFromFormat('Y-m-d', '2023-12-31');

            $resultados = $this->relatorioGestor->listarQuantidadeVendasEntreDatasEFuncionario($dataMinima, $dataMaxima);

            expect($resultados)->not->toBeEmpty();

            $resultado = $resultados[0];

            expect($resultado['funcionario'])->toBe('Lucas');
            expect($resultado['totalVendas'])->toEqual("88.40");
        });

        it('Deve retornar vazio se não houver vendas por funcionário no intervalo', function() {

            $dataMinima = TDateTime::createFromFormat('Y-m-d', '2026-01-01');
            $dataMaxima = TDateTime::createFromFormat('Y-m-d', '2026-12-31');

            $resultados = $this->relatorioGestor->listarQuantidadeVendasEntreDatasEFuncionario($dataMinima, $dataMaxima);

            expect($resultados)->toBeEmpty();
        });

    });
    
    describe('listarQuantidadeVendasEntreDatasECategoria', function() {

        it('Deve retornar as vendas por categoria dentro do intervalo de datas', function() {
            
            $dataMinima = TDateTime::createFromFormat('Y-m-d', '2025-01-01');
            $dataMaxima = TDateTime::createFromFormat('Y-m-d', '2025-12-31');
            
            $resultados = $this->relatorioGestor->listarQuantidadeVendasEntreDatasECategoria($dataMinima, $dataMaxima);
            
            expect($resultados)->not->toBeEmpty();

            $resultado = $resultados[0];
            
            expect($resultado['categoria'])->toBe('Prato Principal');
            expect($resultado['totalVendas'])->toEqual("146.70");
        });

        it('Deve retornar vazio se não houver vendas por categoria dentro do intervalo de datas', function() {
            
            $dataMinima = TDateTime::createFromFormat('Y-m-d', '2026-01-01');
            $dataMaxima = TDateTime::createFromFormat('Y-m-d', '2026-12-31');
            
            $resultados = $this->relatorioGestor->listarQuantidadeVendasEntreDatasECategoria($dataMinima, $dataMaxima);
            
            expect($resultados)->toBeEmpty();
        });
    });
    
    describe('listarQuantidadeVendasEntreDatasEDia', function() {
        
        it('Deve retornar as vendas por dia dentro do intervalo de datas', function() {

            $dataMinima = TDateTime::createFromFormat('Y-m-d', '2023-01-01');
            $dataMaxima = TDateTime::createFromFormat('Y-m-d', '2023-12-31');
            
            $resultados = $this->relatorioGestor->listarQuantidadeVendasEntreDatasEDia($dataMinima, $dataMaxima);
            
            expect($resultados)->not->toBeEmpty();

            $resultado = $resultados[0];

            expect($resultado['dia'])->toBe('18/01/2023');
            expect($resultado['totalVendas'])->toEqual("88.40");
        });

        it('Deve retornar vazio se não houver vendas por dia dentro do intervalo de datas', function() {

            $dataMinima = TDateTime::createFromFormat('Y-m-d', '2026-01-01');
            $dataMaxima = TDateTime::createFromFormat('Y-m-d', '2026-12-31');
            
            $resultados = $this->relatorioGestor->listarQuantidadeVendasEntreDatasEDia($dataMinima, $dataMaxima);
            
            expect($resultados)->toBeEmpty();
        });
    });
});
