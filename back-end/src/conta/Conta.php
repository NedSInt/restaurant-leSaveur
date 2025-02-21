<?php

class Conta implements \JsonSerializable {

    public int $id = 0;
    public ?Reserva $reserva;
    public ?FormaPagamento $formaPagamento;
    public int $porcentagemDesconto = 0;
    public bool $concluida = false;
    public array $itens = [];

    const MIN_PORCENTAGEM_DESCONTO = 0;
    const MAX_PORCENTAGEM_DESCONTO = 5;

    public function __construct(int $id = 0, Reserva $reserva = null, FormaPagamento $formaPagamento = null, int $porcentagemDesconto = 0, bool $concluida = false, array $itens = []){
        $this->id = $id;
        $this->reserva = $reserva;
        $this->formaPagamento = $formaPagamento;
        $this->porcentagemDesconto = $porcentagemDesconto;
        $this->concluida = $concluida;
        $this->itens = $itens;
    }

    public function validar(): array{

        $erros = [];

        if($this->porcentagemDesconto < self::MIN_PORCENTAGEM_DESCONTO || $this->porcentagemDesconto > self::MAX_PORCENTAGEM_DESCONTO){
            $erros[] = "A porcentagem de desconto deve estar entre " . self::MIN_PORCENTAGEM_DESCONTO . " e " . self::MAX_PORCENTAGEM_DESCONTO . ".";
        }

        if( ! empty($this->formaPagamento) && ! in_array($this->formaPagamento, FormaPagamento::cases())){
            $erros[] = "Forma de pagamento inválida.";
        }

        return $erros;
    }

    public function jsonSerialize() :mixed {
        return [
            'id' => $this->id,
            'reserva' => $this->reserva,
            'formaPagamento' => $this->formaPagamento ? FormaPagamento::paraCodigo($this->formaPagamento) : null,
            'porcentagemDesconto' => $this->porcentagemDesconto,
            'concluida' => $this->concluida,
            'itens' => $this->itens
        ];
    }
}