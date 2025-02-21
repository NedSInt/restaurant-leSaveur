<?php

class FuncionarioGestor {

    private FuncionarioRepositorio $funcionarioRepositorio;

    public function __construct(PDO $pdo) {
        $this->funcionarioRepositorio = new FuncionarioRepositorioEmBDR($pdo);
    }

    public function listar(){
        return $this->funcionarioRepositorio->listar();
    }

    public function buscaPorLogin($login) : ?Funcionario{
        $funcionario = $this->funcionarioRepositorio->buscaPorLogin($login);

        return $funcionario;
    }

    public function verificaLoginPorLoginESenha($senhaComSalEPimenta, $login) : ?Funcionario{
        $funcionario = $this->funcionarioRepositorio->verificaLoginPorLoginESenha($senhaComSalEPimenta, $login);

        return $funcionario;
    }

    public function cadastrar( $login, $senha, $senhaCriptografada, $sal ) : ?Funcionario{

        $funcionario = $this->funcionarioRepositorio->cadastrarFuncionario($login, $senha, $senhaCriptografada, $sal);

        return $funcionario;
    }
}