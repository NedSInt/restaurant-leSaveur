<?php

class Mesa{
    public int $id = 0;
    public string $nome = "";

    public function __construct(int $id = 0, string $nome = ""){
        $this->id = $id;
        $this->nome = $nome;
    }

}