<?php

use phputil\router\Router;

/** @var Router $app */

$app->route('/contas')
    ->post('/', 'autenticar', function($req, $res) use ($pdo) {
        try{
            $contaGestor = criarContaGestor($pdo);

            $json = sanitizarDados((array) json_decode( $req->rawBody() ));
            $conta = $contaGestor->cadastrar( $json );
            $res->status(201)->send( $conta );
        } catch( ValidacaoException $e ){
            $res->status(400)->json( ['mensagem' => $e->getMessage(), 'problemas' => $e->getProblemas()] );
        } catch( DominioException $e ){
            $res->status(500)->send(['mensagem' => $e->getMessage()]);
        } catch( Exception $e ){
            $res->status(500)->send(['mensagem' => 'Houve um erro para cadastrar a conta.']);
        }
    })
    ->put('/:id', 'autenticarGerente', function($req, $res) use ($pdo) {

        try{

            $idConta = (int) $req->param('id');

            if( empty( $idConta ) ){
                throw new ValidacaoException('Erro ao obter id da conta a ser fechada.', [ 'Id da conta não encontrado.' ]);
            }

            $contaGestor = criarContaGestor($pdo);
            $json = sanitizarDados((array) json_decode( $req->rawBody() ));

            $conta = $contaGestor->fecharConta( $json, $idConta );
            $res->status(201)->send( $conta );
        } catch( ValidacaoException $e ){
            $res->status(400)->json( ['mensagem' => $e->getMessage(), 'problemas' => $e->getProblemas()] );
        } catch( DominioException $e ){
            $res->status(500)->send(['mensagem' => $e->getMessage()]);
        } catch( Exception $e ){
            $res->status(500)->send(['mensagem' => $e->getMessage()]);
        }
    })
    ->get('/', 'autenticar', function($req, $res) use ($pdo) {
        try{
            $restricoes = [];

            if( isset( $_GET['concluida'] ) ){
                $restricoes['concluida'] = filter_var($req->param('concluida'), FILTER_VALIDATE_BOOLEAN);
            }

            $contaGestor = criarContaGestor($pdo);
            $contas = $contaGestor->listar($restricoes);

            $res->status(200)->json( $contas );
        } catch( DominioException $e ){
            $res->status(500)->send(['mensagem' => $e->getMessage()]);
        } catch( Exception $e ){
            $res->status(500)->send(['mensagem' => 'Houve um erro interno para listar as contas.']);
        }
    })
    ->post('/:id/itens', 'autenticar', function($req, $res) use ($pdo) {
        try{
            $idConta = (int) $req->param('id');

            if( empty( $idConta ) ){
                throw new ValidacaoException('Erro ao obter id da conta para adicionar item.', [ 'Id da conta não encontrado.' ]);
            }

            $itemGestor = criarItemGestor($pdo);

            $json = sanitizarDados((array) json_decode( $req->rawBody() ));

            $item = $itemGestor->cadastrar( $json, $idConta );
            $res->status(201)->send( $item );
        } catch( ValidacaoException $e ){
            $res->status(400)->json( ['mensagem' => $e->getMessage(), 'problemas' => $e->getProblemas()] );
        } catch( DominioException $e ){
            $res->status(500)->send(['mensagem' => $e->getMessage()]);
        } catch( Exception $e ){
            $res->status(500)->send(['mensagem' => 'Houve um erro para cadastrar o item.']);
        }
    })
    ->get('/:id/itens', 'autenticar', function($req, $res) use ($pdo) {
        try{
            $idConta = (int) $req->param('id');

            if( empty( $idConta ) ){
                throw new ValidacaoException('Erro ao obter id da conta para obter itens.', [ 'Id da conta não encontrado.' ]);
            }

            $itemGestor = criarItemGestor($pdo);

            $itens = $itemGestor->listarItensDaConta($idConta);

            // if( empty($itens) ){
            //     $res->status(204)->send([]);
            //     return;
            // }

            $res->status(200)->json( $itens );
        } catch( ValidacaoException $e ){
            $res->status(400)->json( ['mensagem' => $e->getMessage(), 'problemas' => $e->getProblemas()] );
        } catch( DominioException $e ){
            $res->status(500)->send(['mensagem' => $e->getMessage()]);
        } catch( Exception $e ){
            $res->status(500)->send(['mensagem' => 'Houve um erro para cadastrar o item.']);
        }
    });