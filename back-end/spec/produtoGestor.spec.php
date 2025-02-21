<?php

require_once './src/conexao-banco-dados.php';

describe('ProdutoGestor', function() {
    $this->pdo = criarConexao(true);
    $this->gestor = null;

    beforeAll(function () {
        $this->gestor = new ProdutoGestor($this->pdo);
        $this->pdo->exec('DELETE FROM produto; DELETE FROM categoria;');
        
        $this->pdo->exec("INSERT INTO categoria (id, nome) VALUES (1, 'Eletrônicos'), (2, 'Móveis')");
        $this->pdo->exec("INSERT INTO produto (id, idCategoria, codigo, descricao, preco) VALUES 
            (1, 1, 'P001', 'Smartphone', 1500.00),
            (2, 2, 'P002', 'Cadeira', 300.00),
            (3, 1, 'P003', 'Notebook', 3500.00)");
    });

    describe('listar produtos', function() {
        it('Obtém todos os produtos sem restrições', function() {
            $produtos = $this->gestor->listar();
            expect($produtos)->toHaveLength(3);
        });

        it('Filtra produtos por categoria', function() {
            $produtos = $this->gestor->listar(['idCategoria' => 1]);
            expect($produtos)->toHaveLength(2);
            expect($produtos[0]->descricao)->toContain('Smartphone');
            expect($produtos[1]->descricao)->toContain('Notebook');
        });

        it('Retorna lista vazia quando não há produtos na categoria', function() {
            $produtos = $this->gestor->listar(['idCategoria' => 3]);
            expect($produtos)->toHaveLength(0);
        });
    });
});
