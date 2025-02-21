<?php

class ItemGestor {

    private ItemRepositorio $itemRepositorio;
    private ProdutoRepositorio $produtoRepositorio;
    private FuncionarioRepositorio $funcionarioRepositorio;
    private ContaRepositorio $contaRepositorio;

    public function __construct(PDO $pdo) {
        $this->produtoRepositorio = new ProdutoRepositorioEmBDR($pdo);
        $this->funcionarioRepositorio = new FuncionarioRepositorioEmBDR($pdo);
        $this->itemRepositorio = new ItemRepositorioEmBDR($pdo, $this->produtoRepositorio, $this->funcionarioRepositorio);
        $this->contaRepositorio = new ContaRepositorioEmBDR($pdo);
    }

    public function listar(array $restricoes = []){
        return $this->itemRepositorio->listar($restricoes);
    }

    public function listarItensDaConta(int $idConta){
        $restricoes = [ 'idConta' => $idConta];
        return $this->itemRepositorio->listar($restricoes);
    }

    public function cadastrar(array $json, int $idConta) : ?Item{

        $problemas = [];

        if( ! is_numeric($idConta) ){
            $problemas['conta'] = 'Conta não encontrada.';
        }

        $conta = $this->contaRepositorio->listarComId($idConta);
        if ( $conta === null ) {
            $problemas['conta'] = 'Conta não encontrada.';
        } else if( $conta->concluida ){
            $problemas['conta'] = 'Não é possível adicionar o item, a conta já foi concluída.';
        }

        $idProduto = $json['idProduto'] ?? 0;

        if( ! is_numeric($idProduto) ){
            $problemas['produto'] = 'Produto não encontrado.';
        }

        $produto = $this->produtoRepositorio->listarComId($idProduto);
        if ( $produto === null ) {
            $problemas['produto'] = 'Produto não encontrado.';
        }

        $idFuncionario = $json['idFuncionario'] ?? 0;

        if( ! is_numeric($idFuncionario) ){
            $problemas['funcionario'] = 'Funcionário não encontrada.';
        }

        $funcionario = $this->funcionarioRepositorio->listarComId($idFuncionario);
        if ( $funcionario === null ) {
            $problemas['funcionario'] = 'Funcionário não encontrado.';
        }

        $quantidade = intval($json['quantidade'] ?? 0);
        $preco = floatval($json['preco'] ?? 0.00);

        $item = new Item(0, $produto, $funcionario, $quantidade, $preco);

        $problemas = array_merge($problemas, $item->validar());

        if( count( $problemas ) > 0 ){
            throw new ValidacaoException("Erro ao cadastrar item.", $problemas);
        }

        $item = $this->itemRepositorio->cadastrar($item, $conta);

        return $item;
    }

}