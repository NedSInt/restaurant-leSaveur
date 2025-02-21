<?php

use phputil\router\Router;

/** @var Router $app */

$app->route('/produtos', 'autenticar',)
    ->get('/', function($req, $res) use ($pdo) {
        try{
            $produtoGestor = criarProdutoGestor($pdo);
            $restricoes = [];

            if( isset( $_GET['idCategoria'] ) ){
                $restricoes['idCategoria'] = $req->param('idCategoria');
            }

            $produtos = $produtoGestor->listar( $restricoes );

            $res->status(200)->json( $produtos );
        } catch( DominioException $e ){
            $res->status(500)->send(['mensagem' => $e->getMessage()]);
        } catch( Exception $e ){
            $res->status(500)->send(['mensagem' => 'Houve um erro interno para listar os produtos.']);
        }
    });