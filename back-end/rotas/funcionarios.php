<?php

use phputil\router\Router;

/** @var Router $app */

$app->route('/funcionarios')
    ->get('/', 'autenticar', function($req, $res) use ($pdo) {
        try{
            $funcionarioGestor = criarFuncionarioGestor($pdo);
            $funcionarios = $funcionarioGestor->listar();

            $res->status(200)->json( $funcionarios );
        } catch( DominioException $e ){
            $res->status(500)->send(['mensagem' => $e->getMessage()]);
        } catch( Exception $e ){
            $res->status(500)->send(['mensagem' => $e->getMessage()]);
        }
    });