<?php

class ClienteRepositorioEmBDR extends RepositorioEmBDR implements ClienteRepositorio {

    public function listar(){
        $comando = "SELECT id, nome, telefoneCelular FROM cliente";

        $linhas = $this->obterLinhas($comando);
        $clientes = [];

        foreach( $linhas as $l ){
            $cliente = new Cliente($l['id'], $l['nome'], $l['telefoneCelular']);
            $clientes[] = $cliente;
        }

        return $clientes;
    }

    public function listarComNome(string $nome) : ?Cliente{
        try{
            $comando = "SELECT id, nome, telefoneCelular FROM cliente WHERE nome = :nome";

            $linha = $this->obterLinha($comando, ['nome' => $nome]);

            if( empty( $linha ) )
                return null;

            $cliente = new Cliente($linha['id'], $linha['nome'], $linha['telefoneCelular']);

            return $cliente;
        } catch ( PDOException $ex ) {
            throw new RepositorioException( 'Erro ao consultar a cliente.',
                (int) $ex->getCode(), $ex );
        }
    }

    public function listarComId(int $id) : ?Cliente{
        try{
            $comando = "SELECT id, nome, telefoneCelular FROM cliente WHERE id = :id";
            $linha = $this->obterLinha($comando, ['id' => $id]);

            if( empty( $linha ) )
                return null;

            $cliente = new Cliente($linha['id'], $linha['nome'], $linha['telefoneCelular']);
            return $cliente;
        } catch ( PDOException $ex ) {
            throw new RepositorioException( 'Erro ao consultar o cliente.',
                (int) $ex->getCode(), $ex );
        }
    }

    public function cadastrar(Cliente $cliente) : Cliente {
        
        try{
            $comando = "INSERT INTO cliente(nome, telefoneCelular) VALUES (:nome, :telefoneCelular);";

            $idCliente = $this->inserirLinha($comando,[
                'nome' => $cliente->nome,
                'telefoneCelular' => $cliente->telefoneCelular
            ]);

            $cliente->id = $idCliente;

            return $cliente;
        } catch(PDOException $e){
            throw new RepositorioException("Erro ao cadastrar cliente no banco de dados.");
        }
    }

}