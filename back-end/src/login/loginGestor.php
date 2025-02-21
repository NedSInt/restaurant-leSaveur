<?php

class LoginGestor {
    private $servicoAutenticacao;
    

    public function __construct($servicoAutenticacao) {
        $this->servicoAutenticacao = $servicoAutenticacao;
    }

    public function processarLogin($login, $senha) {
        $funcionario = $this->servicoAutenticacao->autenticar($login, $senha);

        if( !$funcionario ) {
            throw new DadosNaoEncontradosException("Login e senha incorretos");
            return ;
        }

        $this->servicoAutenticacao->iniciarSessao($funcionario);

        return $funcionario;
    }

    public function processarLogout() {
        return $this->servicoAutenticacao->encerrarSessao();
    }
}


?>