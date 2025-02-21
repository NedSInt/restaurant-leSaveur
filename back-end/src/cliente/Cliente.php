<?php

class Cliente {

    public int $id = 0;
    public string $nome = "";
    public string $telefoneCelular = "";

    const TAMANHO_MAX_NOME = 80;
    const TAMANHO_MIN_NOME = 3;

    public function __construct(int $id = 0, string $nome = "", string $telefoneCelular = ""){
        $this->id = $id;
        $this->nome = $nome;
        $this->telefoneCelular = $telefoneCelular;
    }

    public function validar(){

        $erros = [];

        $tamanhoNome = mb_strlen($this->nome);
        if($tamanhoNome < self::TAMANHO_MIN_NOME || $tamanhoNome > self::TAMANHO_MAX_NOME){
            $erros[] = "O nome do cliente deve conter de " . self::TAMANHO_MIN_NOME . " e " . self::TAMANHO_MAX_NOME . ".";
        }

        if (!preg_match('/^\(\d{2}\) 9\d{4}-\d{4}$/', $this->telefoneCelular)) {
            $erros[] = "O telefone celular deve estar no formato (DD) 9XXXX-XXXX.";
        }

        if( count($erros) ){
            throw new ValidacaoException("Dados inválidos para cliente.", implode(" ", $erros));
        }
    }
}