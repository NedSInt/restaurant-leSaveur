<?php

class CategoriaRepositorioEmBDR extends RepositorioEmBDR implements CategoriaRepositorio {

    public function listar(){
        $comando = "SELECT id, nome FROM categoria";

        $linhas = $this->obterLinhas($comando);
        $categorias = [];

        foreach( $linhas as $l ){
            $categoria = new Categoria($l['id'], $l['nome']);
            $categorias[] = $categoria;
        }

        return $categorias;
    }


    public function listarComId(int $id) : ?Categoria{
        try{
            $comando = "SELECT id, nome FROM categoria WHERE id = :id";
            $linha = $this->obterLinha($comando, ['id' => $id]);

            if( empty( $linha ) )
                return null;

            $categoria = new Categoria($linha['id'], $linha['nome']);
            return $categoria;
        } catch ( PDOException $ex ) {
            throw new RepositorioException( 'Erro ao consultar o categoria.',
                (int) $ex->getCode(), $ex );
        }
    }

}