<?php

class MesaRepositorioEmBDR extends RepositorioEmBDR implements MesaRepositorio {
    public function listar(){
        $comando = "SELECT id, nome FROM mesa";

        $linhas = $this->obterLinhas($comando);
        $mesas = [];

        foreach( $linhas as $l ){
            $mesa = new Mesa($l['id'], $l['nome']);
            $mesas[] = $mesa;
        }

        return $mesas;
    }

    public function listarComId(int $id) : ?Mesa{
        try{
            $comando = "SELECT id, nome FROM mesa WHERE id = :id";
            $linha = $this->obterLinha($comando, ['id' => $id]);

            if( empty( $linha ) )
                return null;

            $mesa = new Mesa($linha['id'], $linha['nome']);
            return $mesa;
        } catch ( PDOException $e ) {
            throw new RepositorioException( 'Erro ao consultar a mesa.',
                (int) $e->getCode(), $e );
        }
    }

    public function listarDisponiveis($restricoes){

        try{

            $queryRestricoes = [];
            $parametros = [ 'idMesa' => $restricoes['quantidadeMaximaMesas'] ];

            if(! empty($restricoes['dataMinima'])){
                $queryRestricoes[] = ' dataReserva >= :dataMinima';
                $parametros['dataMinima'] = $restricoes['dataMinima'];
            }

            if(! empty($restricoes['dataMaxima'])){
                $queryRestricoes[] = ' dataReserva <= :dataMaxima';
                $parametros['dataMaxima'] = $restricoes['dataMaxima'];
            }

            $restricoesReserva = ' WHERE ativo = 1 ';
            if( count( $queryRestricoes ) > 0 ){
                $restricoesReserva .= ' AND ' . implode(' AND ', $queryRestricoes);
            }

            $comando = "SELECT mesa.id as id, nome 
                FROM mesa
                    LEFT JOIN (
                        SELECT idMesa
                            FROM reserva 
                            " . $restricoesReserva . "
                    ) AS mesasReservadas ON mesa.id = mesasReservadas.idMesa
                WHERE mesa.id <= :idMesa AND mesasReservadas.idMesa IS NULL
                ORDER BY mesa.id ASC ";

                $linhas = $this->obterLinhas($comando, $parametros);
            $mesas = [];

            foreach( $linhas as $l ){
                $mesa = new Mesa($l['id'], $l['nome']);
                $mesas[] = $mesa;
            }

            return $mesas;
        } catch ( PDOException $e ) {
            throw new RepositorioException( 'Erro ao consultar mesas disponíveis.',
                (int) $e->getCode(), $e );
        }
    }
}