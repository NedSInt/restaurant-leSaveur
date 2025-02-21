<?php

use phputil\router\Router;

/** @var Router $app */

$app->route('/categorias')
    ->get('/', 'autenticar', function($req, $res) use ($pdo) {
        try{
            $categoriaGestor = criarCategoriaGestor($pdo);
            $categorias = $categoriaGestor->listar();

            $res->status(200)->json( $categorias );
        } catch( DominioException $e ){
            $res->status(500)->send(['mensagem' => $e->getMessage()]);
        } catch( Exception $e ){
            $res->status(500)->send(['mensagem' => 'Houve um erro interno para listar as categorias.']);
        }
    });