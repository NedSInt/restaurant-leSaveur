<?php

class Produto {

    public int $id = 0;
    public ?Categoria $categoria;
    public string $codigo = "";
    public string $descricao = "";
    public float $preco = 0;

    const TAMANHO_MAX_CODIGO = 50;
    const TAMANHO_MIN_CODIGO = 5;
    const TAMANHO_MAX_DESCRICAO = 50;
    const TAMANHO_MIN_DESCRICAO = 5;

    public function __construct(int $id = 0, Categoria $categoria = null, string $codigo = "", string $descricao = "", float $preco = 0){
        $this->id = $id;
        $this->categoria = $categoria;
        $this->codigo = $codigo;
        $this->descricao = $descricao;
        $this->preco = $preco;
    }

    public function validar(){

        $erros = [];

        $tamanhoCodigo = mb_strlen($this->codigo);
        if($tamanhoCodigo < self::TAMANHO_MIN_CODIGO || $tamanhoCodigo > self::TAMANHO_MAX_CODIGO){
            $erros[] = "O Código do produto deve conter de " . self::TAMANHO_MIN_CODIGO . " e " . self::TAMANHO_MAX_CODIGO . ".";
        }

        $tamanhoDescricao = mb_strlen($this->descricao);
        if($tamanhoDescricao < self::TAMANHO_MIN_DESCRICAO || $tamanhoDescricao > self::TAMANHO_MAX_DESCRICAO){
            $erros[] = "A Descrição do produto deve conter de " . self::TAMANHO_MIN_DESCRICAO . " e " . self::TAMANHO_MAX_DESCRICAO . ".";
        }

        $precoIsNumeric = is_numeric($this->preco);
        if (!$precoIsNumeric || $this->preco <= 0) {
            $erros[] = "O preço do produto deve ser um número maior que zero.";
        }
        

        if( count($erros) ){
            throw new ValidacaoException("Dados inválidos para o produto.", implode(" ", $erros));
        }
    }
}