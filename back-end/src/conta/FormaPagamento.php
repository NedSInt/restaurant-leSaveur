<?php

Enum FormaPagamento {
    case DINHEIRO;
    case PIX;
    case CARTAO_DEBITO;
    case CARTAO_CREDITO;

    public function paraTexto(){
        return match($this) {
            self::DINHEIRO => "Dinheiro",
            self::PIX => "Pix",
            self::CARTAO_DEBITO => "Cartão de débito",
            self::CARTAO_CREDITO => "Cartão de crédito",
        };
    }

    public static function paraCodigo(FormaPagamento $formaPagamento){
        return match($formaPagamento) {
            self::DINHEIRO => "DINHEIRO",
            self::PIX => "PIX",
            self::CARTAO_DEBITO => "CARTAO_DEBITO",
            self::CARTAO_CREDITO => "CARTAO_CREDITO",
        };
    }

    public static function deTexto(string $formaPagamento): ?self {
        return match(strtoupper($formaPagamento)) {
            'DINHEIRO' => self::DINHEIRO,
            'PIX' => self::PIX,
            'CARTAO_DEBITO' => self::CARTAO_DEBITO,
            'CARTAO_CREDITO' => self::CARTAO_CREDITO,
            default => null,
        };
    }

    public function ehFormaDePagamento($formaPagamento){
        return in_array($formaPagamento, self::cases());
    }
}