<?php

use phputil\router\Router;
use phputil\TDateTime;

/** @var Router $app */

$app->route('/mesas')
    ->get('/', 'autenticar', function($req, $res) use ($pdo) {
        try{
            $mesaGestor = criarMesaGestor($pdo);
            $mesas = $mesaGestor->listar();

            if( empty($mesas) ){
                $res->status(204)->send('');
                return;
            }

            $res->status(200)->json( $mesas );
        } catch( DominioException $e ){
            $res->status(500)->send(['mensagem' => $e->getMessage()]);
        } catch( Exception $e ){
            $res->status(500)->send(['mensagem' => 'Houve um erro interno para listar mesas.']);
        }
    })
    ->get('/disponiveis', 'autenticar', function($req, $res) use ($pdo) {
        try{
            $dataReserva = $req->param('dataReserva');

            $dataReserva = new TDateTime($dataReserva);
            if( ! $dataReserva->isValidDatabaseDateTime( $dataReserva->toDatabaseString(), '-') ){
                throw new ValidacaoException(
                    'Erro para obter data para consulta.',
                    ['Data para consulta de disponibilidade de mesas está inválida. A data deve estar no formato ' . TDateTime::DATABASE_DATETIME_FORMAT]
                );
            }

            $paraCadastrarConta = filter_var($req->param('paraCadastrarConta'), FILTER_VALIDATE_BOOLEAN);

            $mesaGestor = criarMesaGestor($pdo);
            $mesas = $mesaGestor->listarDisponiveis($dataReserva, $paraCadastrarConta);

            if( empty($mesas) ){
                $res->status(204)->send('');
                return;
            }

            $res->status(200)->json( $mesas );
        } catch( ValidacaoException $e ){
            $res->status(400)->json( ['mensagem' => $e->getMessage(), 'problemas' => $e->getProblemas()] );
        } catch( DominioException $e){
            $res->status(500)->send(['mensagem' => $e->getMessage()]);
        } catch( Exception $e ){
            $res->status(500)->send(['mensagem' => 'Houve um erro para listar as mesas disponíveis.']);
        }
    });