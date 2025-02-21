<?php

class Item {

    public int $id = 0;
    public ?Produto $produto = null;
    public ?Funcionario $funcionario = null;
    public int $quantidade = 0;
    public float $preco = 0.00;

    const QUANTIDADE_MINIMA = 1;
    const PRECO_MINIMO = 0.01;

    public function __construct(int $id = 0, Produto $produto = null, Funcionario $funcionario = null, int $quantidade = 0, float $preco = 0.00){
        $this->id = $id;
        $this->produto = $produto;
        $this->funcionario = $funcionario;
        $this->quantidade = $quantidade;
        $this->preco = $preco;
    }

    public function validar(): array{
        $erros = [];

        if( ! $this->produto instanceof Produto ){
            $erros[] = 'Produto não encontrado.';
        }

        if( ! $this->funcionario instanceof Funcionario ){
            $erros[] = 'Funcionário não encontrado.';
        }

        if( $this->quantidade < self::QUANTIDADE_MINIMA){
            $erros[] = 'A quantidade precisa ser maior que ' . self::QUANTIDADE_MINIMA . '.';
        }

        if( $this->preco < self::PRECO_MINIMO){
            $erros[] = 'O preço precisa ser maior que ' . self::PRECO_MINIMO . '.';
        }

        return $erros;
    }
}