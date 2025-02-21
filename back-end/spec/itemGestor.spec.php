<?php

require_once './src/conexao-banco-dados.php';
require_once '../db/gera-dados-testes.php';

const ID_MESA_INEXISTENTE = 1000;
const ID_CONTA_INEXISTENTE = 1000;
const ID_PRODUTO_INEXISTENTE = 1000;

describe('ItemGestor', function(){

    $this->pdo = criarConexao(true);
    $this->gestor = null;

    beforeAll(function (){
        $this->gestor = new ItemGestor($this->pdo);
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
        $this->pdo->exec( file_get_contents('../db/dados-basicos.sql') );

        $insercoesBase = geraDadosTesteParaBanco();
        $this->pdo->exec( $insercoesBase );
    });

    describe('cadastrar', function(){

        it('Cadastra item para conta aberta', function(){
            $dados = [
                'idProduto' => 3,
                'idFuncionario' => 1,
                'quantidade' => 2,
                'preco' => 18.50
            ];
            $ID_CONTA = 5;

            $item = $this->gestor->cadastrar($dados, $ID_CONTA);

            expect($item->id)->toBeGreaterThan(0);
            expect($item->produto)->toBeAnInstanceOf(Produto::class);
            expect($item->quantidade)->toBe(2);
            expect($item->preco)->toBe(18.50);
        });

        it('Tenta cadastrar item para conta inexistente', function(){
            $dados = [
                'idProduto' => 3,
                'idFuncionario' => 1,
                'quantidade' => 2,
                'preco' => 18.50
            ];
            $ID_CONTA = ID_CONTA_INEXISTENTE;

            try{
                $this->gestor->cadastrar($dados, $ID_CONTA);
            } catch( Exception $e ) {
                expect($e)->toBeAnInstanceOf(ValidacaoException::class);

                $problemas = $e->getProblemas();
                expect( count($problemas) )->toBeGreaterThan(0);

                expect($problemas)->toContain('Conta não encontrada.');
            }

        });

        it('Tenta cadastrar item para conta já concluída', function(){
            $dados = [
                'idProduto' => 3,
                'idFuncionario' => 1,
                'quantidade' => 2,
                'preco' => 18.50
            ];
            $ID_CONTA = 1;

            try{
                $this->gestor->cadastrar($dados, $ID_CONTA);
            } catch( Exception $e ) {
                expect($e)->toBeAnInstanceOf(ValidacaoException::class);

                $problemas = $e->getProblemas();
                expect( count($problemas) )->toBeGreaterThan(0);

                expect($problemas)->toContain('Não é possível adicionar o item, a conta já foi concluída.');
            }
        });

        it('Tenta cadastrar item de produto inexistente', function(){
            $dados = [
                'idProduto' => ID_PRODUTO_INEXISTENTE,
                'idFuncionario' => 1,
                'quantidade' => 2,
                'preco' => 18.50
            ];
            $ID_CONTA = 5;

            try{
                $this->gestor->cadastrar($dados, $ID_CONTA);
            } catch( Exception $e ) {
                expect($e)->toBeAnInstanceOf(ValidacaoException::class);

                $problemas = $e->getProblemas();
                expect( count($problemas) )->toBeGreaterThan(0);

                expect($problemas)->toContain('Produto não encontrado.');
            }
        });

        it('Tenta cadastrar item com preço e quantidade errados', function(){
            $dados = [
                'idProduto' => 3,
                'idFuncionario' => 1,
                'quantidade' => -2,
                'preco' => -18.50
            ];
            $ID_CONTA = 5;

            try{
                $this->gestor->cadastrar($dados, $ID_CONTA);
            } catch( Exception $e ) {
                expect($e)->toBeAnInstanceOf(ValidacaoException::class);

                $problemas = $e->getProblemas();
                expect( count($problemas) )->toBeGreaterThan(0);

                expect($problemas)->toContain('A quantidade precisa ser maior que ' . Item::QUANTIDADE_MINIMA . '.');
                expect($problemas)->toContain('O preço precisa ser maior que ' . Item::PRECO_MINIMO . '.');
            }
        });
    });

});