<?php

use phputil\router\Router;

/** @var Router $app */

$app->route('/login')
    ->post('/', function($req, $res) use ($pdo) {
        try{
            $funcionario = criarFuncionarioGestor($pdo);
            $servicoAutenticacao = new ServicoAutenticacao($funcionario);
            $loginGestor = new LoginGestor($servicoAutenticacao);

            $json = sanitizarDados((array) json_decode( $req->rawBody() ));

            $funcionarioLogin = $loginGestor->processarLogin( $json['login'], $json['senha'] );

            $res->status(200)->send( $funcionarioLogin );
        } catch( DadosNaoEncontradosException | NaoEncontradoException $e ){
            $res->status(401)->send(['mensagem' => $e->getMessage()]);
        } catch( DominioException $e ){
            $res->status(500)->send(['mensagem' => $e->getMessage()]);
        } catch( Exception $e ){
            $res->status(500)->send(['mensagem' => $e->getMessage()]);
        }
    });

$app->route('/logout')
    ->post('/', function($req, $res) use ($pdo) {
        try{
            $funcionario = criarFuncionarioGestor($pdo);

            $servicoAutenticacao = new ServicoAutenticacao($funcionario);

            $loginGestor = new LoginGestor($servicoAutenticacao);

            $loginGestor->processarLogout();

            $res->status(200)->send( [ 'mensagem' => 'Usuário deslogado com Sucesso!' ] );

        } catch( ValidacaoException $e ){
            $res->status(400)->json( ['mensagem' => $e->getMessage(), 'problemas' => $e->getProblemas()] );
        } catch( DominioException $e ){
            $res->status(500)->send(['mensagem' => $e->getMessage()]);
        } catch( Exception $e ){
            $res->status(500)->send(['mensagem' => 'Houve um erro para deslogar do sistema.']);
        }
    });