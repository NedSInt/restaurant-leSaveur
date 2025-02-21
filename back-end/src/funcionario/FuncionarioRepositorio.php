<?php

interface FuncionarioRepositorio {
    public function listar();
    public function listarComId(int $id): ?Funcionario;
    public function buscaPorLogin(string $login) : ?Funcionario;
    public function verificaLoginPorLoginESenha(string $senhaComSalEPimenta, string $login);
    public function cadastrarFuncionario(string $login, string $senha, string $senhaCriptografada, string $sal);
}