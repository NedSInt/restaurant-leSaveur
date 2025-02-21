<?php

require_once 'vendor/autoload.php';
require_once 'src/conexao-banco-dados.php';
date_default_timezone_set('America/Sao_Paulo');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: http://localhost:5173');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, Cookie, Accept, Referer');
    header('Access-Control-Allow-Credentials: true');
    http_response_code(204);
    exit;
}

use phputil\router\Router;
use function phputil\cors\cors;
$app = new Router();

$options = [
    'origin' => ['http://localhost:5173', 'http://localhost:8080'],
    'credentials' => true,
    'methods' => 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'allowedHeaders' => ['Cookie', 'Content-Type', 'Accept', 'Referer']
];

$app->use( cors($options) );


try {
    $pdo = criarConexao();
} catch( DatabaseException $e ){
    http_response_code(500);
    exit( json_encode(['mensagem' => $e->getMessage()]) );
}

function criarClienteGestor(PDO $pdo){
    return new ClienteGestor($pdo);
}

function criarFuncionarioGestor(PDO $pdo){
    return new FuncionarioGestor($pdo);
}

function criarMesaGestor(PDO $pdo){
    return new MesaGestor($pdo);
}

function criarReservaGestor(PDO $pdo){
    return new ReservaGestor($pdo);
}

function criarProdutoGestor(PDO $pdo){
    return new ProdutoGestor($pdo);
}

function criarItemGestor(PDO $pdo){
    return new ItemGestor($pdo);
}

function criarCategoriaGestor(PDO $pdo) {
    return new CategoriaGestor($pdo);
}

function criarContaGestor(PDO $pdo) {
    $reservaGestor = criarReservaGestor($pdo);
    return new ContaGestor($pdo, $reservaGestor);
}

function criarRelatorioGestor(PDO $pdo) {
    return new RelatorioGestor($pdo);
}

function sanitizarDados($dados){
    array_walk_recursive($dados, function($value) {
        if($value === null)
            return $value;
        return htmlspecialchars($value);
    });

    return $dados;
}

function autenticar($req, $res, &$stop) {
    session_start();

    $autenticado = isset( $_SESSION[ 'usuario_id' ] );
    if ( $autenticado ) {
        return;
    }

    $stop = true;

    $res->status( 401 )->send( ['mensagem' => 'Usuário não logado no sistema.'] );
}

function autenticarGerente($req, $res, &$stop) {
    session_start();

    $usuarioGerente = $_SESSION['usuario_cargo']->paraTexto() === 'GERENTE';
    if ($usuarioGerente) {
        return;    
    }
    
    $stop = true;
    
    $res->status( 401 )->send( ['mensagem' => 'O usuário não possui permissão para essa ação.'] );
}

$app->get( '/', function( $req, $res ){
    $res->send( 'Hello World!' );
} );

require_once 'rotas/funcionarios.php';
require_once 'rotas/mesas.php';
require_once 'rotas/reservas.php';
require_once 'rotas/categorias.php';
require_once 'rotas/produtos.php';
require_once 'rotas/contas.php';
require_once 'rotas/login.php';
require_once 'rotas/relatorios.php';

$app->listen();