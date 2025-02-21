<?php

class RelatorioRepositorioEmBDR extends RepositorioEmBDR implements RelatorioRepositorio {


    public function __construct( PDO $pdo ){
        parent::__construct($pdo);
    }


    public function listarQuantidadeVendasEntreDatasEFormaPagamento($restricoes) {
        try {
            $queryRestricoes = [];
            $parametros = [];
    
            if (!empty($restricoes['dataMinima'])) {
                $queryRestricoes[] = ' DATE(dataReserva) >= DATE(:dataMinima)';
                $parametros['dataMinima'] = $restricoes['dataMinima'];
            }
    
            if (!empty($restricoes['dataMaxima'])) {
                $queryRestricoes[] = ' DATE(dataReserva) <= DATE(:dataMaxima)';
                $parametros['dataMaxima'] = $restricoes['dataMaxima'];
            }
    
            $where = ' WHERE 1 AND conta.concluida = 1';
            if (count($queryRestricoes) > 0) {
                $where .= ' AND ' . implode(' AND ', $queryRestricoes);
            }
    
            $comando = "
                SELECT 
                    conta.formaPagamento AS formaPagamento, 
                    SUM(p.preco * item.quantidade) AS totalVendas
                FROM 
                    conta
                JOIN 
                    reserva ON conta.idReserva = reserva.id
                JOIN 
                    item ON item.idConta = conta.id
                JOIN 
                    produto p ON item.idProduto = p.id
                    " . $where . "
                GROUP BY 
                    conta.formaPagamento
                ORDER BY 
                    totalVendas DESC";
    
            $linhas = $this->obterLinhas($comando, $parametros);
    
            foreach ($linhas as &$linha) {
                $enumFormaPagamento = FormaPagamento::deTexto($linha['formaPagamento']);
                $linha['formaPagamento'] = $enumFormaPagamento ? $enumFormaPagamento->paraTexto() : 'Desconhecido';
            }
    
            return $linhas;
        } catch (PDOException $e) {
            throw new RepositorioException('Erro ao consultar as vendas.', (int) $e->getCode(), $e);
        }
    }
    

    public function listarQuantidadeVendasEntreDatasEFuncionario($restricoes){
        try{
            $queryRestricoes = [];
            $parametros = [ ];

            if(! empty($restricoes['dataMinima'])){
                $queryRestricoes[] = ' DATE(dataReserva) >= DATE(:dataMinima)';
                $parametros['dataMinima'] = $restricoes['dataMinima'];
            }

            if(! empty($restricoes['dataMaxima'])){
                $queryRestricoes[] = ' DATE(dataReserva) <= DATE(:dataMaxima)';
                $parametros['dataMaxima'] = $restricoes['dataMaxima'];
            }

            $where = ' WHERE 1 AND conta.concluida = 1';
            if( count( $queryRestricoes ) > 0 ){
                $where .= ' AND ' . implode(' AND ', $queryRestricoes);
            }

            $comando = "
                SELECT 
                    funcionario.nome AS funcionario, 
                    SUM(p.preco * item.quantidade) AS totalVendas
                FROM 
                    conta
                JOIN 
                    reserva ON conta.idReserva = reserva.id
                JOIN 
                    item ON item.idConta = conta.id
                JOIN 
                    produto p ON item.idProduto = p.id
                JOIN
                    funcionario ON reserva.idFuncionario = funcionario.id

                    " . $where . "

                GROUP BY 
                    funcionario.id, funcionario.nome
                ORDER BY 
                    totalVendas DESC";

            $linhas = $this->obterLinhas($comando, $parametros);

            return $linhas;
        } catch ( PDOException $e ) {
            throw new RepositorioException( 'Erro ao consultar as vendas.',
                (int) $e->getCode(), $e );
        }
    }

    public function listarQuantidadeVendasEntreDatasECategoria($restricoes){
        try{
            $queryRestricoes = [];
            $parametros = [ ];

            if(! empty($restricoes['dataMinima'])){
                $queryRestricoes[] = ' DATE(reserva.dataReserva) >= DATE(:dataMinima)';
                $parametros['dataMinima'] = $restricoes['dataMinima'];
            }

            if(! empty($restricoes['dataMaxima'])){
                $queryRestricoes[] = ' DATE(reserva.dataReserva) <= DATE(:dataMaxima)';
                $parametros['dataMaxima'] = $restricoes['dataMaxima'];
            }

            $where = ' WHERE 1 AND conta.concluida = 1';
            if( count( $queryRestricoes ) > 0 ){
                $where .= ' AND ' . implode(' AND ', $queryRestricoes);
            }

            $comando = "
                SELECT 
                    categoria.nome AS categoria, 
                    SUM(p.preco * item.quantidade) AS totalVendas
                FROM 
                    conta
                JOIN 
                    reserva ON conta.idReserva = reserva.id
                JOIN 
                    item ON item.idConta = conta.id
                JOIN 
                    produto p ON item.idProduto = p.id
                JOIN 
                    categoria ON p.idCategoria = categoria.id

                    " . $where . "

                GROUP BY 
                    categoria.id, categoria.nome
                ORDER BY 
                    totalVendas DESC;";

            $linhas = $this->obterLinhas($comando, $parametros);

            return $linhas;
        } catch ( PDOException $e ) {
            throw new RepositorioException( 'Erro ao consultar as vendas.',
                (int) $e->getCode(), $e );
        }
    }

    public function listarQuantidadeVendasEntreDatasEDia($restricoes){
        try{
            $queryRestricoes = [];
            $parametros = [ ];

            if(! empty($restricoes['dataMinima'])){
                $queryRestricoes[] = ' DATE(reserva.dataReserva) >= DATE(:dataMinima)';
                $parametros['dataMinima'] = $restricoes['dataMinima'];
            }

            if(! empty($restricoes['dataMaxima'])){
                $queryRestricoes[] = ' DATE(reserva.dataReserva) <= DATE(:dataMaxima)';
                $parametros['dataMaxima'] = $restricoes['dataMaxima'];
            }

            $where = ' WHERE 1 AND conta.concluida = 1';
            if( count( $queryRestricoes ) > 0 ){
                $where .= ' AND ' . implode(' AND ', $queryRestricoes);
            }

            $comando = "
                SELECT 
                    DATE_FORMAT(reserva.dataReserva, '%d/%m/%Y') AS dia,
                    SUM(p.preco * item.quantidade) AS totalVendas
                FROM 
                    conta
                JOIN 
                    reserva ON conta.idReserva = reserva.id
                JOIN 
                    item ON item.idConta = conta.id
                JOIN 
                    produto p ON item.idProduto = p.id

                    " . $where . "
                GROUP BY 
                    dia
                ORDER BY 
                    dia ASC;";

            $linhas = $this->obterLinhas($comando, $parametros);

            return $linhas;
        } catch ( PDOException $e ) {
            throw new RepositorioException( 'Erro ao consultar as vendas.',
                (int) $e->getCode(), $e );
        }
    }

}