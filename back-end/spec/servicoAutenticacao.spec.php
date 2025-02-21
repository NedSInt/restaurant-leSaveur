<?php

require_once './src/conexao-banco-dados.php';

describe('ServicoAutenticacao', function () {

    $this->pdo = criarConexao(true);
    $this->servicoAutenticacao = null;
    $this->funcionarioGestor = null;
    beforeAll(function () {
        $this->funcionarioGestor = new FuncionarioGestor($this->pdo);
        $this->servicoAutenticacao = new ServicoAutenticacao($this->funcionarioGestor);

        $this->pdo->exec('
            DELETE FROM conta;
            DELETE FROM reserva;
            DELETE FROM item;
            DELETE FROM produto;
            DELETE FROM categoria;
            DELETE FROM cliente;
            DELETE FROM funcionario;
            DELETE FROM mesa;
        ');

        $this->pdo->exec("
            INSERT INTO funcionario (id, nome, cargo, login, senha, sal) VALUES 
            (1, 'Teste Admin', 'Administrador', 'admin', '47a3c6cc7972ddf2235618116620157c51576c5710a0b1d6c992f3da425da979039b7340d391bf065aab4bf52455f6db4b59f0153cfcb57a0edd325382bf62c4', 'f9025b2dcf10ccebc3ea14de0182266b6c04fde354464d9cd70c4a7118ab78ca');
        ");
    });

    describe('autenticar', function () {

        it('Deve autenticar quando login e senha estiverem corretos', function () {
            $funcionario = $this->servicoAutenticacao->autenticar('admin', 'admin');
            
            expect($funcionario)->not->toBeNull();

            expect($funcionario->nome)->toBe('Teste Admin');
        });

        it('Deve retornar null quando o login for inexistente', function () {
            $funcionario = $this->servicoAutenticacao->autenticar('usuario_invalido', 'senha');
            expect($funcionario)->toBeNull();
        });

        it('Deve retornar null quando a senha for incorreta', function () {
            $funcionario = $this->servicoAutenticacao->autenticar('admin', 'senha_errada');
            expect($funcionario)->toBeNull();
        });
    });
});
?>
