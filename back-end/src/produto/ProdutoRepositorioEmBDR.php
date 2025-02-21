<?php

class ProdutoRepositorioEmBDR extends RepositorioEmBDR implements ProdutoRepositorio {

    private CategoriaRepositorio $categoriaRepositorio;

    public function __construct(PDO $pdo, CategoriaRepositorio $categoriaRepositorio = null){
        parent::__construct($pdo);
        $this->categoriaRepositorio = $categoriaRepositorio ?? new CategoriaRepositorioEmBDR($pdo);
    }

    public function listar(array $restricoes = []){

        $queryRestricoes = [];
        $parametros = [ ];

        if(! empty($restricoes['idCategoria'])){
            $queryRestricoes[] = ' idCategoria = :idCategoria';
            $parametros['idCategoria'] = $restricoes['idCategoria'];
        }

        $where = ' WHERE 1';
        if( count( $queryRestricoes ) > 0 ){
            $where .= ' AND ' . implode(' AND ', $queryRestricoes);
        }

        $comando = "SELECT id, idCategoria, codigo, descricao, preco 
            FROM produto" .
            $where
            . " ORDER BY id ASC";

        $linhas = $this->obterLinhas($comando, $parametros);
        $produtos = [];

        foreach( $linhas as $l ){
            $produto = $this->transformarDadosEmObjeto($l);
            $produtos[] = $produto;
        }

        return $produtos;
    }

    public function listarComId(int $id){
        try{
            $comando = "SELECT id, idCategoria, codigo, descricao, preco FROM produto WHERE id = :id";

            $linha = $this->obterLinha($comando, ['id' => $id]);

            if( empty($linha) )
                return null;

            $produto = $this->transformarDadosEmObjeto($linha);

            return $produto;
        } catch ( PDOException $e ) {
            throw new RepositorioException( 'Erro ao consultar o produto.',
                (int) $e->getCode(), $e );
        }
    }

    public function transformarDadosEmObjeto(array $dados){
        $categoria = $this->categoriaRepositorio->listarComId($dados['idCategoria']);

        $produto = new Produto($dados['id'], $categoria, $dados['codigo'], $dados['descricao'], (float) $dados['preco']);

        return $produto;
    }

}