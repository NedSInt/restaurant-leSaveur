<?php

class FuncionarioRepositorioEmBDR extends RepositorioEmBDR implements FuncionarioRepositorio {
    public function listar(){
        try{

            $comando = "SELECT id, nome, cargo, login FROM funcionario";

            $linhas = $this->obterLinhas($comando);
            $funcionarios = [];

            foreach( $linhas as $l ){
                $cargo = Cargo::deTexto($l['cargo']) ?? null;
                $funcionario = new Funcionario($l['id'], $l['nome'], $cargo, $l['login']);
                $funcionarios[] = $funcionario;
            }

            return $funcionarios;
        } catch ( PDOException $e ) {
            throw new RepositorioException( 'Erro ao consultar funcionários.',
                (int) $e->getCode(), $e );
        }
    }

    public function listarComId(int $id) : ?Funcionario{
        try{
            $comando = "SELECT id, nome, login, cargo FROM funcionario WHERE id = :id";

            $linha = $this->obterLinha($comando, ['id' => $id]);

            if( empty( $linha ) )
                return null;

            $cargo = Cargo::deTexto($linha['cargo']) ?? null;

            $funcionario = new Funcionario($linha['id'], $linha['nome'], $cargo, $linha['login']);

            return $funcionario;
        } catch ( PDOException $e ) {
            throw new RepositorioException( 'Erro ao consultar o funcionário.',
                (int) $e->getCode(), $e );
        }
    }

    public function buscaPorLogin( $login ) : ?Funcionario {
        try {
            $comando = "SELECT id, nome, cargo, login, senha, sal FROM funcionario WHERE login = :login";
            
            $linha = $this->obterLinha($comando, ['login' => $login]);
    
            if ( empty( $linha ) ) {
                return null;
            }
    
            $cargo = Cargo::deTexto($linha['cargo']) ?? null;
    
            $funcionario = new Funcionario(
                $linha['id'],
                $linha['nome'],
                $cargo,
                $linha['login'],
                $linha['senha'],
                $linha['sal']
            );
    
            return $funcionario;
        } catch (PDOException $e) {
            throw new RepositorioException( 'Erro ao consultar o login do funcionário.',
            (int) $e->getCode(), $e );
        }
    }

    public function verificaLoginPorLoginESenha( $senhaComSalEPimenta, $login ) : ?Funcionario {
        try {
            $comando = "SELECT id, nome, cargo, login FROM funcionario WHERE login = :login AND senha = :senha";
            
            $linha = $this->obterLinha( $comando, ['login' => $login, 'senha' => $senhaComSalEPimenta] );
    
            if ( empty( $linha ) ) {
                return null;
            }
    
            $cargo = Cargo::deTexto($linha['cargo']) ?? null;
    
            $funcionario = new Funcionario(
                $linha['id'],
                $linha['nome'],
                $cargo,
                $linha['login']
            );
    
            return $funcionario;
        } catch (PDOException $e) {
            throw new RepositorioException( 'Erro ao consultar o login do funcionário.',
            (int) $e->getCode(), $e );
        }
    }

    public function cadastrarFuncionario( $login, $senha, $senhaCriptografada, $sal ) {
        $comando = "INSERT INTO funcionario (login, senha, sal) VALUES (:login, :senha, :sal)";

        $this->executarComando($comando, [
            'login' => $login,
            'senha' => $senhaCriptografada,
            'sal' => $sal
        ]);
    }
}