<?php

class ItemRepositorioEmBDR extends RepositorioEmBDR implements ItemRepositorio {

    private ProdutoRepositorio $produtoRepositorio;
    private FuncionarioRepositorio $funcionarioRepositorio;

    public function __construct(PDO $pdo, ProdutoRepositorio $produtoRepositorio = null, FuncionarioRepositorio $funcionarioRepositorio = null){
        parent::__construct($pdo);
        $this->produtoRepositorio = $produtoRepositorio ?? new ProdutoRepositorioEmBDR($pdo);
        $this->funcionarioRepositorio = $funcionarioRepositorio ?? new FuncionarioRepositorioEmBDR($pdo);
    }

    public function listar(array $restricoes = []){

        $queryRestricoes = [];
        $parametros = [ ];

        if(! empty($restricoes['idConta'])){
            $queryRestricoes[] = ' idConta = :idConta';
            $parametros['idConta'] = $restricoes['idConta'];
        }

        if(! empty($restricoes['idProduto'])){
            $queryRestricoes[] = ' idProduto = :idProduto';
            $parametros['idProduto'] = $restricoes['idProduto'];
        }

        if(! empty($restricoes['idFuncionario'])){
            $queryRestricoes[] = ' idFuncionario = :idFuncionario';
            $parametros['idFuncionario'] = $restricoes['idFuncionario'];
        }

        $where = ' WHERE 1';
        if( count( $queryRestricoes ) > 0 ){
            $where .= ' AND ' . implode(' AND ', $queryRestricoes);
        }

        $comando = "SELECT id, idProduto, idFuncionario, quantidade, preco
            FROM item" . 
            $where
            . " ORDER BY id ASC";

        $linhas = $this->obterLinhas($comando, $parametros);
        $itens = [];

        foreach( $linhas as $l ){
            $item = $this->transformarDadosEmObjeto($l);
            $itens[] = $item;
        }

        return $itens;
    }


    public function listarComId(int $id) : ?Item{
        try{
            $comando = "SELECT id, idProduto, idFuncionario, quantidade, preco FROM item WHERE id = :id";
            $linha = $this->obterLinha($comando, ['id' => $id]);

            if( empty( $linha ) )
                return null;

            $item = $this->transformarDadosEmObjeto($linha);
            return $item;
        } catch ( PDOException $ex ) {
            throw new RepositorioException( 'Erro ao consultar o item.',
                (int) $ex->getCode(), $ex );
        }
    }

    public function cadastrar(Item $item, Conta $conta): ?Item {
        try{

            $comando = "INSERT INTO item(idProduto, idConta, idFuncionario, quantidade, preco) 
                VALUES (:idProduto, :idConta, :idFuncionario, :quantidade, :preco)";

            $parametros = [
                'idProduto' => $item->produto->id,
                'idConta' => $conta->id,
                'idFuncionario' => $item->funcionario->id,
                'quantidade' => $item->quantidade,
                'preco' => $item->preco
            ];

            $idItem = $this->inserirLinha($comando, $parametros);

            $item->id = $idItem;

            return $item;
        } catch(PDOException $e) {
            $this->pdo->rollback();

            throw new RepositorioException( 'Erro ao cadastrar item.',
            (int) $e->getCode(), $e );
        }
        
    }

    public function transformarDadosEmObjeto(array $dados){
        $produto = $this->produtoRepositorio->listarComId($dados['idProduto']);
        $funcionario = $this->funcionarioRepositorio->listarComId($dados['idFuncionario']);

        $item = new Item($dados['id'], $produto, $funcionario, $dados['quantidade'], $dados['preco']);

        return $item;
    }

}