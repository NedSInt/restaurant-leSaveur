<?php

use phputil\router\Router;
use phputil\TDateTime;

/** @var Router $app */

$app->route('/relatorio')
    ->get('/vendas/forma-pagamento', function($req, $res) use ($pdo) {
        try{
            $dataMinima = $req->param('dataMinima');
            $dataMaxima = $req->param('dataMaxima');

            $problemas = [];
            $dataMinima = new TDateTime($dataMinima);
            if( ! $dataMinima->isValidDatabaseDateTime( $dataMinima->toDatabaseString(), '-') ){
                $problemas[] = 'Data mínima para consulta de relatório de vendas está inválida. A data deve estar no formato ' . TDateTime::DATABASE_DATETIME_FORMAT;
            }

            $dataMaxima = new TDateTime($dataMaxima);
            if( ! $dataMaxima->isValidDatabaseDateTime( $dataMaxima->toDatabaseString(), '-') ){
                $problemas[] = 'Data máxima para consulta de relatório de vendas está inválida. A data deve estar no formato ' . TDateTime::DATABASE_DATETIME_FORMAT;
            }

            if(count($problemas) > 0){
                throw new ValidacaoException('Erro para obter datas para consulta.', $problemas);
            }

            $relatorioGestor = criarRelatorioGestor($pdo);

            $vendas = $relatorioGestor->listarQuantidadeVendasEntreDatasEFormaPagamento($dataMinima, $dataMaxima);

            if( empty($vendas) ){
                $res->status(204)->send('');
                return;
            }

            $res->status(200)->json( $vendas );
        } catch( ValidacaoException $e ){
            $res->status(400)->json( ['mensagem' => $e->getMessage(), 'problemas' => $e->getProblemas()] );
        } catch( DominioException $e){
            $res->status(500)->send(['mensagem' => $e->getMessage()]);
        } catch( Exception $e ){
            $res->status(500)->send(['mensagem' => $e->getMessage()]);
        }
    })
    ->get('/vendas/funcionario', 'autenticarGerente', function($req, $res) use ($pdo) {
        try{
            $dataMinima = $req->param('dataMinima');
            $dataMaxima = $req->param('dataMaxima');

            $problemas = [];
            $dataMinima = new TDateTime($dataMinima);
            if( ! $dataMinima->isValidDatabaseDateTime( $dataMinima->toDatabaseString(), '-') ){
                $problemas[] = 'Data mínima para consulta de relatório de vendas está inválida. A data deve estar no formato ' . TDateTime::DATABASE_DATETIME_FORMAT;
            }

            $dataMaxima = new TDateTime($dataMaxima);
            if( ! $dataMaxima->isValidDatabaseDateTime( $dataMaxima->toDatabaseString(), '-') ){
                $problemas[] = 'Data máxima para consulta de relatório de vendas está inválida. A data deve estar no formato ' . TDateTime::DATABASE_DATETIME_FORMAT;
            }

            if(count($problemas) > 0){
                throw new ValidacaoException('Erro para obter datas para consulta.', $problemas);
            }

            $relatorioGestor = criarRelatorioGestor($pdo);

            $vendas = $relatorioGestor->listarQuantidadeVendasEntreDatasEFuncionario($dataMinima, $dataMaxima);

            if( empty($vendas) ){
                $res->status(204)->send('');
                return;
            }

            $res->status(200)->json( $vendas );
        } catch( ValidacaoException $e ){
            $res->status(400)->json( ['mensagem' => $e->getMessage(), 'problemas' => $e->getProblemas()] );
        } catch( DominioException $e){
            $res->status(500)->send(['mensagem' => $e->getMessage()]);
        } catch( Exception $e ){
            $res->status(500)->send(['mensagem' => $e->getMessage()]);
        }
    })
    ->get('/vendas/categoria', 'autenticarGerente', function($req, $res) use ($pdo) {
        try{
            $dataMinima = $req->param('dataMinima');
            $dataMaxima = $req->param('dataMaxima');

            $problemas = [];
            $dataMinima = new TDateTime($dataMinima);
            if( ! $dataMinima->isValidDatabaseDateTime( $dataMinima->toDatabaseString(), '-') ){
                $problemas[] = 'Data mínima para consulta de relatório de vendas está inválida. A data deve estar no formato ' . TDateTime::DATABASE_DATETIME_FORMAT;
            }

            $dataMaxima = new TDateTime($dataMaxima);
            if( ! $dataMaxima->isValidDatabaseDateTime( $dataMaxima->toDatabaseString(), '-') ){
                $problemas[] = 'Data máxima para consulta de relatório de vendas está inválida. A data deve estar no formato ' . TDateTime::DATABASE_DATETIME_FORMAT;
            }

            if(count($problemas) > 0){
                throw new ValidacaoException('Erro para obter datas para consulta.', $problemas);
            }

            $relatorioGestor = criarRelatorioGestor($pdo);

            $vendas = $relatorioGestor->listarQuantidadeVendasEntreDatasECategoria($dataMinima, $dataMaxima);

            if( empty($vendas) ){
                $res->status(204)->send('');
                return;
            }

            $res->status(200)->json( $vendas );
        } catch( ValidacaoException $e ){
            $res->status(400)->json( ['mensagem' => $e->getMessage(), 'problemas' => $e->getProblemas()] );
        } catch( DominioException $e){
            $res->status(500)->send(['mensagem' => $e->getMessage()]);
        } catch( Exception $e ){
            $res->status(500)->send(['mensagem' => $e->getMessage()]);
        }
    })
    ->get('/vendas/dia', 'autenticarGerente', function($req, $res) use ($pdo) {
        try{
            $dataMinima = $req->param('dataMinima');
            $dataMaxima = $req->param('dataMaxima');

            $problemas = [];
            $dataMinima = new TDateTime($dataMinima);
            if( ! $dataMinima->isValidDatabaseDateTime( $dataMinima->toDatabaseString(), '-') ){
                $problemas[] = 'Data mínima para consulta de relatório de vendas está inválida. A data deve estar no formato ' . TDateTime::DATABASE_DATETIME_FORMAT;
            }

            $dataMaxima = new TDateTime($dataMaxima);
            if( ! $dataMaxima->isValidDatabaseDateTime( $dataMaxima->toDatabaseString(), '-') ){
                $problemas[] = 'Data máxima para consulta de relatório de vendas está inválida. A data deve estar no formato ' . TDateTime::DATABASE_DATETIME_FORMAT;
            }

            if(count($problemas) > 0){
                throw new ValidacaoException('Erro para obter datas para consulta.', $problemas);
            }

            $relatorioGestor = criarRelatorioGestor($pdo);

            $vendas = $relatorioGestor->listarQuantidadeVendasEntreDatasEDia($dataMinima, $dataMaxima);

            if( empty($vendas) ){
                $res->status(204)->send('');
                return;
            }

            $res->status(200)->json( $vendas );
        } catch( ValidacaoException $e ){
            $res->status(400)->json( ['mensagem' => $e->getMessage(), 'problemas' => $e->getProblemas()] );
        } catch( DominioException $e){
            $res->status(500)->send(['mensagem' => $e->getMessage()]);
        } catch( Exception $e ){
            $res->status(500)->send(['mensagem' => $e->getMessage()]);
        }
    });
