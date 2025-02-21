<?php

use Kahlan\Matcher\ToBe;
use Kahlan\Matcher\ToBeAnInstanceOf;
use Kahlan\Matcher\ToContain;
use phputil\TDateTime;

require_once './src/conexao-banco-dados.php';
require_once '../db/gera-dados-testes.php';

const ID_MESA_INEXISTENTE = 1000;
const ID_FUNCIONARIO_INEXISTENTE = 1000;
const ID_RESERVA_INEXISTENTE = 1000;

describe('ReservaGestor', function(){

    $this->pdo = criarConexao(true);
    $this->gestor = null;

    beforeAll(function (){
        $this->gestor = new ReservaGestor($this->pdo);
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

        it('Cadastra uma reserva válida.', function(){
            $dados = [
                'nomeCliente' => 'Fulano da Silva',
                'idMesa' => 1,
                'idFuncionario' => 1,
                'dataReserva' => date('Y-m-d 18:00:00', strtotime('next Thursday'))
            ];

            $reserva = $this->gestor->cadastrar($dados);

            expect($reserva->id)->toBeGreaterThan(0);
            expect($reserva->cliente)->toBeAnInstanceOf(Cliente::class);
            expect($reserva->funcionario)->toBeAnInstanceOf(Funcionario::class);
            expect($reserva->mesa)->toBeAnInstanceOf(Mesa::class);
        });

        it('Tenta cadastrar uma reserva com mesa já reservada.', function(){
            $dados = [
                'nomeCliente' => 'Beltrano da Silva',
                'idMesa' => 1,
                'idFuncionario' => 2,
                'dataReserva' => date('Y-m-d 18:10:00', strtotime('next Thursday'))
            ];

            try{
                $this->gestor->cadastrar($dados);
            } catch( Exception $e ) {
                expect($e)->toBeAnInstanceOf(ValidacaoException::class);

                $problemas = $e->getProblemas();
                expect( count($problemas) )->toBeGreaterThan(0);

                expect($problemas)->toContain('Esta mesa não está disponível para reserva nesta data.');
            }

        });

        it('Tenta cadastrar uma reserva com mesa, funcionário e nome do cliente inválidos.', function(){
            $dados = [
                'nomeCliente' => '',
                'idMesa' => ID_MESA_INEXISTENTE,
                'idFuncionario' => ID_FUNCIONARIO_INEXISTENTE,
                'dataReserva' => date('Y-m-d 18:00:00', strtotime('next Thursday'))
            ];

            try{
                $this->gestor->cadastrar($dados);
            } catch( Exception $e ) {
                expect($e)->toBeAnInstanceOf(ValidacaoException::class);

                $problemas = $e->getProblemas();
                expect( count($problemas) )->toBeGreaterThan(0);

                expect($problemas)->toContain('Mesa não encontrada.');
                expect($problemas)->toContain('Funcionário não encontrado.');
                expect($problemas)->toContain('Cliente não encontrado.');
            }

        });

        it('Tenta cadastrar reserva com data passada.', function(){
            $dados = [
                'nomeCliente' => 'Fulano da Silva',
                'idMesa' => 1,
                'idFuncionario' => 1,
                'dataReserva' => date('Y-m-d', strtotime('last Thursday')) . '18:00:00'
            ];

            try{
                $this->gestor->cadastrar($dados);
            } catch( Exception $e ) {
                expect($e)->toBeAnInstanceOf(ValidacaoException::class);

                $problemas = $e->getProblemas();
                expect( count($problemas) )->toBeGreaterThan(0);

                expect($problemas)->toContain('Não é possível solicitar reserva para datas passadas.');
            }
        });

        it('Tenta cadastrar reserva com data com dia inválido.', function(){
            $dados = [
                'nomeCliente' => 'Fulano da Silva',
                'idMesa' => 1,
                'idFuncionario' => 1,
                'dataReserva' => date('Y-m-d', strtotime('next Monday')) . '18:00:00'
            ];

            try{
                $this->gestor->cadastrar($dados);
            } catch( Exception $e ) {
                expect($e)->toBeAnInstanceOf(ValidacaoException::class);

                $problemas = $e->getProblemas();
                expect( count($problemas) )->toBeGreaterThan(0);

                expect($problemas)->toContain('Na data selecionada não é possível solicitar reserva.');
            }
        });

        it('Tenta cadastrar reserva antes da hora permitida.', function(){
            $dados = [
                'nomeCliente' => 'Fulano da Silva',
                'idMesa' => 1,
                'idFuncionario' => 1,
                'dataReserva' => date('Y-m-d 10:00:00', strtotime('next Thursday'))
            ];

            try{
                $this->gestor->cadastrar($dados);
            } catch( Exception $e ) {
                expect($e)->toBeAnInstanceOf(ValidacaoException::class);

                $problemas = $e->getProblemas();
                expect( count($problemas) )->toBeGreaterThan(0);

                expect($problemas)->toContain("O horário para fazer reserva é entre " . UtilSolicitacaoReserva::HORA_INICIO_SOLICITACAO_RESERVA . ":00 e " . UtilSolicitacaoReserva::HORA_FIM_SOLICITACAO_RESERVA . ":00.");
            }
        });
    });

    describe('cancelar', function(){

        it('Cancela reserva.', function(){
            $idReserva = 2;
            $ativo = false;
            expect($this->gestor->alterarAtivo($idReserva, $ativo))->toBe(true);
        });

        it('Tenta cancelar reserva inexistente.', function(){
            try{
                $idReserva = 2;
                $ativo = false;
                expect($this->gestor->alterarAtivo($idReserva, $ativo))->toBe(true);
            } catch( Exception $e ) {
                expect($e)->toBeAnInstanceOf(NaoEncontradoException::class);

                expect( $e->getMessage() )->toBe('Reserva não encontrada.');
            }
        });
    });

});