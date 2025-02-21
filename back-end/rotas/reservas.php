<?php

use phputil\router\Router;
use phputil\TDateTime;

/** @var Router $app */

$app->route('/reservas')
    ->post('/', 'autenticar', function($req, $res) use ($pdo) {
        try{
            $reservaGestor = criarReservaGestor($pdo);
            
            $json = sanitizarDados((array) json_decode( $req->rawBody() ));
            $reserva = $reservaGestor->cadastrar( $json );
            $res->status(201)->send( $reserva );
        } catch( ValidacaoException $e ){
            $res->status(400)->json( ['mensagem' => $e->getMessage(), 'problemas' => $e->getProblemas()] );
        } catch( DominioException $e ){
            $res->status(500)->send(['mensagem' => $e->getMessage()]);
        } catch( Exception $e ){
            $res->status(500)->send(['mensagem' => 'Houve um erro para cadastrar a reserva.']);
        }
    })
    ->get('/', 'autenticar', function($req, $res) use ($pdo) {
        try{
            $reservaGestor = criarReservaGestor($pdo);
            $reservas = $reservaGestor->listarReservasFuturas();

            if( empty($reservas) ){
                $res->status(204)->send('');
                return;
            }

            $res->status(200)->json( $reservas );

        } catch( DominioException $e){
            $res->status(500)->send(['mensagem' => $e->getMessage()]);
        } catch( Exception $e ){
            $res->status(500)->send(['mensagem' => 'Houve um erro para listar as reservas.']);
        }
    })
    ->get('/para-atendimento', 'autenticar',  function($req, $res) use ($pdo) {
        try{
            $reservaGestor = criarReservaGestor($pdo);
            $reservas = $reservaGestor->listarReservasParaAtendimento();

            if( empty($reservas) ){
                $res->status(204)->send('');
                return;
            }

            $res->status(200)->json( $reservas );

        } catch( DominioException $e){
            $res->status(500)->send(['mensagem' => $e->getMessage()]);
        } catch( Exception $e ){
            $res->status(500)->send(['mensagem' => 'Houve um erro para listar as reservas em atendimento.']);
        }
    })
    ->get('/relatorio', 'autenticar', function($req, $res) use ($pdo) {
        try{
            $dataMinima = $req->param('dataMinima');
            $dataMaxima = $req->param('dataMaxima');

            $problemas = [];
            $dataMinima = new TDateTime($dataMinima);
            if( ! $dataMinima->isValidDatabaseDateTime( $dataMinima->toDatabaseString(), '-') ){
                $problemas[] = 'Data mínima para consulta de relatório de reservas está inválida. A data deve estar no formato ' . TDateTime::DATABASE_DATETIME_FORMAT;
            }

            $dataMaxima = new TDateTime($dataMaxima);
            if( ! $dataMaxima->isValidDatabaseDateTime( $dataMaxima->toDatabaseString(), '-') ){
                $problemas[] = 'Data máxima para consulta de relatório de reservas está inválida. A data deve estar no formato ' . TDateTime::DATABASE_DATETIME_FORMAT;
            }

            if(count($problemas) > 0){
                throw new ValidacaoException('Erro para obter datas para consulta.', $problemas);
            }

            $reservaGestor = criarReservaGestor($pdo);
            $reservas = $reservaGestor->listarQuantidadeReservasEntreDatas($dataMinima, $dataMaxima);

            if( empty($reservas) ){
                $res->status(204)->send('');
                return;
            }

            $res->status(200)->json( $reservas );
        } catch( ValidacaoException $e ){
            $res->status(400)->json( ['mensagem' => $e->getMessage(), 'problemas' => $e->getProblemas()] );
        } catch( DominioException $e){
            $res->status(500)->send(['mensagem' => $e->getMessage()]);
        } catch( Exception $e ){
            $res->status(500)->send(['mensagem' => $e->getMessage()]);
        }
    });
    $app->patch('/reservas/:id/ativo', function ($req, $res) use ($pdo) {
        try{

            $id = $req->param('id');
            $dados = json_decode($req->rawBody(), true); // (array) $req->body();

            if ( ! $id || ! $dados || ! isset($dados['ativo']) ) {
                throw new DadosNaoEncontradosException('Id não fornecido ou dados inválidos');
            }

            $ativo = filter_var($dados['ativo'], FILTER_VALIDATE_BOOLEAN);

            $reservaGestor = criarReservaGestor($pdo);
            $ativoAlterado = $reservaGestor->alterarAtivo((int) $id, $ativo);

            if($ativoAlterado){
                $res->status(200)->send(['mensagem' => 'Reserva cancelada com sucesso.']);
            } else {
                throw new DominioException('Não foi possível cancelar reserva.');
            }

        } catch( DadosNaoEncontradosException | NaoEncontradoException $e ){
            $res->status(404)->send(['mensagem' => $e->getMessage()]);
        } catch( DominioException $e ){
            $res->status(500)->send(['mensagem' => $e->getMessage()]);
        } catch( Exception $e ){
            $res->status(500)->send(['mensagem' => 'Houve um erro interno.']);
        }
    } );