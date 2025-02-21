<?php

require_once './src/conexao-banco-dados.php';

describe('CategoriaGestor', function() {
    $this->pdo = criarConexao(true);
    $this->gestor = null;

    beforeAll(function () {
        $this->gestor = new CategoriaGestor($this->pdo);
        $this->pdo->exec('DELETE FROM categoria;');
        
        $this->pdo->exec("
            INSERT INTO categoria (id, nome) VALUES 
            (1, 'Entrada'), 
            (2, 'Prato Principal'), 
            (3, 'Bebida'), 
            (4, 'Sobremesa')
        ");
    });

    describe('listar categorias', function() {
        it('Obtém todas as categorias cadastradas', function() {
            $categorias = $this->gestor->listar();
            expect($categorias)->toHaveLength(4);
        });
    });

    describe('listar categoria por ID', function() {
        it('Obtém uma categoria existente pelo ID', function() {
            $categoria = $this->gestor->listarComId(2);
            expect($categoria)->not->toBeNull();
            expect($categoria->nome)->toBe('Prato Principal');
        });

        it('Retorna null quando a categoria não existe', function() {
            $categoria = $this->gestor->listarComId(99);
            expect($categoria)->toBeNull();
        });
    });
});
