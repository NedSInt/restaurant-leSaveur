<?php

require_once './src/conexao-banco-dados.php';
require_once '../db/gera-dados-testes.php';

const ID_MESA_INEXISTENTE = 1000;
const ID_CONTA_INEXISTENTE = 1000;

describe('ContaGestor', function(){

    $this->pdo = criarConexao(true);
    $this->gestor = null;

    beforeAll(function (){
        $this->gestor = new ContaGestor($this->pdo);
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

        xit('Cadastra uma conta informando nome do cliente e a mesa que o cliente selecionou.', function() {
            $dados = [
                'nomeCliente' => 'Fulano da Silva',
                'idMesa' => 4,
                'idFuncionario' => 1
            ];

            $conta = $this->gestor->cadastrar($dados);

            expect($conta->id)->toBeGreaterThan(0);
            expect($conta->reserva)->toBeAnInstanceOf(Reserva::class);
            expect($conta->reserva->mesa)->toBeAnInstanceOf(Mesa::class);
            expect($conta->reserva->mesa->id)->toBe($dados['idMesa']);
        });

        it('Cadastra uma conta informando id da reserva.', function(){
            $dados = [
                'idReserva' => 19,
                'idFuncionario' => 1
            ];

            $conta = $this->gestor->cadastrar($dados);

            expect($conta->id)->toBeGreaterThan(0);
            expect($conta->reserva)->toBeAnInstanceOf(Reserva::class);
        });

        it('Tenta cadastrar uma conta com reserva que já possui conta', function(){
            $dados = [
                'idReserva' => 18,
                'idFuncionario' => 1
            ];

            try{
                $this->gestor->cadastrar($dados);
            } catch( Exception $e ) {
                expect($e)->toBeAnInstanceOf(ValidacaoException::class);

                $problemas = $e->getProblemas();
                expect( count($problemas) )->toBeGreaterThan(0);

                expect($problemas)->toContain('Esta reserva já possui uma conta.');
            }
        });

        it('Tenta cadastrar conta com alguns dados inválidos', function(){
            $dados = [
                'idMesa' => ID_MESA_INEXISTENTE,
                'nomeCliente' => 'Fulano',
                'porcentagemDesconto' => 25,
                'idFuncionario' => 2
            ];

            try{
                $this->gestor->cadastrar($dados);
            } catch( Exception $e ) {
                expect($e)->toBeAnInstanceOf(ValidacaoException::class);

                $problemas = $e->getProblemas();
                expect( count($problemas) )->toBeGreaterThan(0);

                expect($problemas)->toContain('Mesa não encontrada.');
                expect($problemas)->toContain('A porcentagem de desconto deve estar entre ' . Conta::MIN_PORCENTAGEM_DESCONTO . ' e ' . Conta::MAX_PORCENTAGEM_DESCONTO . '.');
            }
        });
    });

    describe('fechar conta', function(){

        it('Fecha conta', function(){
            $dados = [
                'formaPagamento' => 'PIX',
                'porcentagemDesconto' => 2,
                'idFuncionario' => 2
            ];
            $ID_CONTA = 4;

            $conta = $this->gestor->fecharConta($dados, $ID_CONTA);

            expect($conta->id)->toBeGreaterThan(0);
            expect($conta)->toBeAnInstanceOf(Conta::class);
            expect($conta->formaPagamento)->toBe(FormaPagamento::PIX);
            expect($conta->porcentagemDesconto)->toBe(2);
        });

        it('Tenta fechar conta com id inexistente', function(){
            $dados = [
                'formaPagamento' => 'PIX',
                'porcentagemDesconto' => 2,
                'idFuncionario' => 2
            ];
            $ID_CONTA = ID_CONTA_INEXISTENTE;

            try{
                $this->gestor->fecharConta($dados, $ID_CONTA);
            } catch( Exception $e ) {
                expect($e)->toBeAnInstanceOf(ValidacaoException::class);

                $problemas = $e->getProblemas();
                expect( count($problemas) )->toBeGreaterThan(0);

                expect($problemas)->toContain('Conta não encontrada.');
            }
        });

        it('Tenta fechar conta já concluída', function(){
            $dados = [
                'formaPagamento' => 'PIX',
                'porcentagemDesconto' => 2,
                'idFuncionario' => 2
            ];
            $ID_CONTA = 1;

            try{
                $this->gestor->fecharConta($dados, $ID_CONTA);
            } catch( Exception $e ) {
                expect($e)->toBeAnInstanceOf(ValidacaoException::class);

                $problemas = $e->getProblemas();
                expect( count($problemas) )->toBeGreaterThan(0);

                expect($problemas)->toContain('Conta já foi concluída.');
            }
        });
    });
});