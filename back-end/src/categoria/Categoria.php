<?php

class Categoria {

    public int $id = 0;
    public string $nome = "";

    const TAMANHO_MAX_NOME = 160;
    const TAMANHO_MIN_NOME = 3;

    public function __construct(int $id = 0, string $nome = ""){
        $this->id = $id;
        $this->nome = $nome;
    }

    public function validar(){

        $erros = [];

        $tamanhoNome = mb_strlen($this->nome);
        if($tamanhoNome < self::TAMANHO_MIN_NOME || $tamanhoNome > self::TAMANHO_MAX_NOME){
            $erros[] = "O nome da categoria deve conter de " . self::TAMANHO_MIN_NOME . " e " . self::TAMANHO_MAX_NOME . ".";
        }

        if( count($erros) ){
            throw new ValidacaoException("Dados inválidos para categoria.", implode(" ", $erros));
        }
    }
}