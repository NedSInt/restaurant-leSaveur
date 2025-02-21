<?php

use phputil\TDateTime;

require_once './src/conexao-banco-dados.php';
require_once '../db/gera-dados-testes.php';

const ID_MESA_INEXISTENTE = 1000;
const ID_RESERVA_INEXISTENTE = 1000;

describe('MesaGestor', function(){

    $this->pdo = criarConexao(true);
    $this->gestor = null;

    beforeAll(function (){
        $this->gestor = new MesaGestor($this->pdo);
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

    describe('obter mesas disponíveis', function(){

        it('Obtém 10 mesas para domingo.', function(){
            $proximoAno = strtotime('+1 year');
            $domingo = strtotime('next Sunday', $proximoAno);
            $dataFormatada = date('Y-m-d 18:00:00', $domingo);

            $dataConsulta = new TDateTime($dataFormatada);

            $mesas = $this->gestor->listarDisponiveis($dataConsulta);

            expect($mesas)->toHaveLength(10);
        });

        it('Obtém 7 mesas para sexta-feira.', function(){
            $proximoAno = strtotime('+1 year');
            $domingo = strtotime('next Friday', $proximoAno);
            $dataFormatada = date('Y-m-d 18:00:00', $domingo);

            $dataConsulta = new TDateTime($dataFormatada);

            $mesas = $this->gestor->listarDisponiveis($dataConsulta);

            expect($mesas)->toHaveLength(7);
        });

        it('Tenta cadastrar reserva com data com data passada.', function(){
            $dataFormatada = date('Y-m-d', strtotime('last Thursday')) . '18:00:00';

            $dataConsulta = new TDateTime($dataFormatada);

            try{
                $this->gestor->listarDisponiveis($dataConsulta);
            } catch( Exception $e ) {
                expect($e)->toBeAnInstanceOf(ValidacaoException::class);

                $problemas = $e->getProblemas();
                expect( count($problemas) )->toBeGreaterThan(0);

                expect($problemas)->toContain('Não é possível solicitar reserva para datas passadas.');
            }
        });

        it('Tenta cadastrar reserva com data com dia inválido.', function(){
            $dataFormatada = date('Y-m-d', strtotime('next Monday')) . '18:00:00';

            $dataConsulta = new TDateTime($dataFormatada);

            try{
                $this->gestor->listarDisponiveis($dataConsulta);
            } catch( Exception $e ) {
                expect($e)->toBeAnInstanceOf(ValidacaoException::class);

                $problemas = $e->getProblemas();
                expect( count($problemas) )->toBeGreaterThan(0);

                expect($problemas)->toContain('Na data selecionada não é possível solicitar reserva.');
            }
        });

        it('Tenta cadastrar reserva antes da hora permitida.', function(){
            $dataFormatada = date('Y-m-d 10:00:00', strtotime('next Thursday'));;

            $dataConsulta = new TDateTime($dataFormatada);

            try{
                $this->gestor->listarDisponiveis($dataConsulta);
            } catch( Exception $e ) {
                expect($e)->toBeAnInstanceOf(ValidacaoException::class);

                $problemas = $e->getProblemas();
                expect( count($problemas) )->toBeGreaterThan(0);

                expect($problemas)->toContain("O horário para fazer reserva é entre " . UtilSolicitacaoReserva::HORA_INICIO_SOLICITACAO_RESERVA . ":00 e " . UtilSolicitacaoReserva::HORA_FIM_SOLICITACAO_RESERVA . ":00.");
            }
        });

        it('Tenta obter mesas para data de reserva com todas as mesas ocupadas.', function() {
            $dataFormatada = date('Y-m-d 19:00:00', strtotime('next Friday'));

            $dataConsulta = new TDateTime($dataFormatada);

            $mesas = $this->gestor->listarDisponiveis($dataConsulta);
            expect( count($mesas) )->toBe(0);

        });
    });
});