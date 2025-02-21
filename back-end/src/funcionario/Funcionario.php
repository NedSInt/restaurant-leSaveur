<?php

class Funcionario implements \JsonSerializable {
    public int $id = 0;
    public string $nome = "";
    public ?Cargo $cargo = null;
    public string $login = "";
    public string $senha = "";
    public string $sal = "";

    const TAMANHO_MAX_NOME = 80;
    const TAMANHO_MIN_NOME = 3;

    const TAMANHO_MAX_LOGIN = 30;
    const TAMANHO_MIN_LOGIN = 3;

    const TAMANHO_MAX_SENHA = 50;
    const TAMANHO_MIN_SENHA = 3;
    public function __construct(int $id = 0, string $nome = "", Cargo $cargo = null, string $login = "", string $senha = "", string $sal = "") {
        $this->id = $id;
        $this->nome = $nome;
        $this->cargo = $cargo;
        $this->login = $login;
        $this->senha = $senha;
        $this->sal = $sal;
    }

    public function jsonSerialize() :mixed {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'cargo' => $this->cargo ? $this->cargo->paraTexto() : null,  // Chama o método 'paraTexto' para obter o valor textual
            'login' => $this->login,
            'senha' => $this->senha,
            'sal' => $this->sal
        ];
    }
}
