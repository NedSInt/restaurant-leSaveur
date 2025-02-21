<?php

class ServicoAutenticacao {

    private FuncionarioGestor $funcionarioGestor;
    private const PIMENTA = 'g2_2024_2_pis';

    public function __construct( $funcionarioGestor ) {
        $this->funcionarioGestor = $funcionarioGestor;
    }

    public function autenticar( $login, $senha ) : ?Funcionario {
        $funcionario = $this->funcionarioGestor->buscaPorLogin( $login );
    
        if ( $funcionario ) {
            $senhaComSalEPimenta = $this->verificarSenhaComSalEPimenta( $senha, $funcionario->sal );

            $funcionarioVerificado = $this->funcionarioGestor->verificaLoginPorLoginESenha($senhaComSalEPimenta, $funcionario->login);

            return $funcionarioVerificado;
        }
    
        return null;
    }
    
    private function verificarSenhaComSalEPimenta( $senha, $sal ) {
        $senhaComSalEPimenta = hash('sha512', $sal . $senha . self::PIMENTA);

        return $senhaComSalEPimenta;
    }

    public function criarSenhaComSalEPimenta($senha) {
        $sal = bin2hex(random_bytes(32));

        $senhaComSalEPimenta = hash('sha512', $sal . $senha . self::PIMENTA);

        return ['senhaCriptografada' => $senhaComSalEPimenta, 'sal' => $sal];
    }

    public function cadastrar( $login, $senha ) : ?Funcionario{
        $senhaCriptografadaComSalEPimenta = $this->criarSenhaComSalEPimenta($senha);

        $senhaCriptografada = $senhaCriptografadaComSalEPimenta['senhaCriptografada'];

        $sal = $senhaCriptografadaComSalEPimenta['sal'];

        $funcionario = $this->funcionarioGestor->cadastrar($login, $senha, $senhaCriptografada, $sal);

        return $funcionario;
    }

    public function iniciarSessao( Funcionario $funcionario ): void {
        session_start();

        $_SESSION['usuario_id'] = $funcionario->id;
        $_SESSION['usuario_nome'] = $funcionario->nome;
        $_SESSION['usuario_cargo'] = $funcionario->cargo;
        
    }

    public function encerrarSessao(): void {
        session_start();
        session_unset();
        session_destroy();
    }
}