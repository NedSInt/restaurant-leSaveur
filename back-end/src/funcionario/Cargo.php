<?php

Enum Cargo {
    case GERENTE;
    case ATENDENTE;

    public function paraTexto(): string {
        return match($this) {
            self::GERENTE => 'GERENTE',
            self::ATENDENTE => 'ATENDENTE',
        };
    }

    public static function deTexto(string $cargo): ?self {
        return match(strtoupper($cargo)) {
            'GERENTE' => self::GERENTE,
            'ATENDENTE' => self::ATENDENTE,
            default => null,
        };
    }
}
