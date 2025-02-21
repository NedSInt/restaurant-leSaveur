<?php

class GeradorDeSenha {
    private const PEPPER = 'g2_2024_2_pis';

    public static function gerarSenha($senhaOriginal) {
        $sal = bin2hex(random_bytes(32));

        $senhaCriptografada = hash('sha512', $sal . $senhaOriginal . self::PEPPER);

        return [
            'senhaCriptografada' => $senhaCriptografada,
            'sal' => $sal,
        ];
    }
}


$senhaOriginal = 'admin'; // Substitua pela senha que você deseja criptografar

$resultado = GeradorDeSenha::gerarSenha($senhaOriginal);

echo "Senha Original: $senhaOriginal\n";
echo "Senha Criptografada: {$resultado['senhaCriptografada']}\n";
echo "Sal: {$resultado['sal']}\n";
