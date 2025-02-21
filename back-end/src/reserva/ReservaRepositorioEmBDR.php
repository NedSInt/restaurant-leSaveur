<?php

use phputil\TDateTime as TDateTime;
class ReservaRepositorioEmBDR extends RepositorioEmBDR implements ReservaRepositorio {

    private MesaRepositorio $mesaRepositorio;
    private FuncionarioRepositorio $funcionarioRepositorio;
    private ClienteRepositorio $clienteRepositorio;

    public function __construct(PDO $pdo, MesaRepositorio $mesaRepositorio = null, FuncionarioRepositorio $funcionarioRepositorio = null, ClienteRepositorio $clienteRepositorio = null){
        parent::__construct($pdo);
        $this->mesaRepositorio = $mesaRepositorio ?? new MesaRepositorioEmBDR($pdo);
        $this->funcionarioRepositorio = $funcionarioRepositorio ?? new FuncionarioRepositorioEmBDR($pdo);
        $this->clienteRepositorio = $clienteRepositorio ?? new ClienteRepositorioEmBDR($pdo);
    }

    public function listar(array $restricoes = []){

        $queryRestricoes = [];
        $parametros = [ ];

        if(! empty($restricoes['dataMinima'])){
            $queryRestricoes[] = ' dataReserva >= :dataMinima';
            $parametros['dataMinima'] = $restricoes['dataMinima'];
        }

        if(! empty($restricoes['dataMaxima'])){
            $queryRestricoes[] = ' dataReserva <= :dataMaxima';
            $parametros['dataMaxima'] = $restricoes['dataMaxima'];
        }

        if(! empty($restricoes['dataMaxima'])){
            $queryRestricoes[] = ' ativo = :ativo';
            $parametros['ativo'] = $restricoes['ativo'] ? 1 : 0;
        }

        if( isset($restricoes['comConta']) ){
            $operador = $restricoes['comConta'] ? 'IN' : 'NOT IN';
            $queryRestricoes[] = " id " . $operador . " (SELECT idReserva FROM conta)";
        }

        $where = ' WHERE 1';
        if( count( $queryRestricoes ) > 0 ){
            $where .= ' AND ' . implode(' AND ', $queryRestricoes);
        }

        $comando = "SELECT id, idMesa, idCliente, idFuncionario, dataReserva, ativo 
            FROM reserva" . 
            $where
            . " ORDER BY dataReserva ASC, idMesa ASC";

        $linhas = $this->obterLinhas($comando, $parametros);
        $reservas = [];

        foreach( $linhas as $l ){
            $reserva = $this->transformarDadosEmObjeto($l);
            $reservas[] = $reserva;
        }

        return $reservas;
    }

    public function listarReservasFuturas(){
        $comando = "SELECT id, idMesa, idCliente, idFuncionario, dataReserva, ativo 
            FROM reserva 
            WHERE DATE(dataReserva) >= DATE(NOW())
            ORDER BY dataReserva ASC, idMesa ASC";

        $linhas = $this->obterLinhas($comando);
        $reservas = [];

        foreach( $linhas as $l ){
            $reserva = $this->transformarDadosEmObjeto($l);
            $reservas[] = $reserva;
        }

        return $reservas;
    }

    public function listarComId(int $id) : ?Reserva{
        try{
            $comando = "SELECT id, idMesa, idCliente, idFuncionario, dataReserva, ativo FROM reserva WHERE id = :id";

            $linha = $this->obterLinha($comando, ['id' => $id]);

            $reserva = $this->transformarDadosEmObjeto($linha);

            return $reserva;
        } catch ( PDOException $e ) {
            throw new RepositorioException( 'Erro ao consultar a reserva.',
                (int) $e->getCode(), $e );
        }
    }

    public function cadastrar(Reserva $reserva) : Reserva {
        try{
            $this->pdo->beginTransaction();

            if($reserva->cliente->id == 0){
                $clienteRepositorio = new ClienteRepositorioEmBDR($this->pdo);
                $cliente = $clienteRepositorio->cadastrar($reserva->cliente);

                $reserva->cliente = $cliente;
            }

            $comando = "INSERT INTO reserva(idMesa, idCliente, idFuncionario, dataReserva, ativo) 
                VALUES (:idMesa, :idCliente, :idFuncionario, :dataReserva, :ativo)";

            $parametros = [
                'idMesa' => $reserva->mesa->id,
                'idCliente' => $reserva->cliente->id,
                'idFuncionario' => $reserva->funcionario->id,
                'dataReserva' => $reserva->dataReserva,
                'ativo' => $reserva->ativo
            ];

            $idReserva = $this->inserirLinha($comando, $parametros);

            $reserva->id = $idReserva;

            $this->pdo->commit();

            return $reserva;
        } catch(PDOException $e) {
            $this->pdo->rollback();

            throw new RepositorioException( 'Erro ao cadastrar reserva.',
            (int) $e->getCode(), $e );
        }
    }

    public function mesaPossuiReservaNaData($restricoes){
        try{

            $queryRestricoes = [];
            $parametros = [ ];

            if(! empty($restricoes['dataMinima'])){
                $queryRestricoes[] = ' dataReserva >= :dataMinima';
                $parametros['dataMinima'] = $restricoes['dataMinima'];
            }

            if(! empty($restricoes['dataMaxima'])){
                $queryRestricoes[] = ' dataReserva <= :dataMaxima';
                $parametros['dataMaxima'] = $restricoes['dataMaxima'];
            }

            if(! empty($restricoes['idMesa'])){
                $queryRestricoes[] = ' idMesa = :idMesa';
                $parametros['idMesa'] = $restricoes['idMesa'];
            }

            $restricoesReserva = ' WHERE ativo = 1 ';
            if( count( $queryRestricoes ) > 0 ){
                $restricoesReserva .= ' AND ' . implode(' AND ', $queryRestricoes);
            }

            $comando = "SELECT COUNT(reserva.id) AS quantidade_reservas
                FROM reserva" . $restricoesReserva;

            $linha = $this->obterLinha($comando, $parametros);

            $quantidadeReservas = $linha['quantidade_reservas'] ?? 0;

            return $quantidadeReservas == 0;
        } catch ( PDOException $e ) {
            throw new RepositorioException( 'Erro ao consultar disponibilidade de mesas.',
                (int) $e->getCode(), $e );
        }
    }

    public function alterarAtivoReserva(int $id, bool $ativo): bool{

        try{
            $comando = "UPDATE reserva SET ativo = :ativo WHERE id = :id";

            $linhasAlteradas = $this->executarComando($comando, ['id' => $id, 'ativo' => $ativo]);

            return $linhasAlteradas > 0;

        } catch( PDOException $e ){
            throw new RepositorioException( 'Erro ao alterar status da reserva.',
            (int) $e->getCode(), $e );
        }
    }

    public function listarQuantidadeReservasEntreDatas($restricoes){

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

            $where = ' WHERE 1';
            if( count( $queryRestricoes ) > 0 ){
                $where .= ' AND ' . implode(' AND ', $queryRestricoes);
            }

            $comando = "SELECT 
                    DATE_FORMAT(dataReserva, '%d/%m/%Y') AS dataReserva,
                    COUNT(id) AS totalReservas
                FROM 
                    reserva
                    " . $where . "
                GROUP BY 
                    DATE(dataReserva)
                ORDER BY 
                    dataReserva";

            $linhas = $this->obterLinhas($comando, $parametros);

            return $linhas;
        } catch ( PDOException $e ) {
            throw new RepositorioException( 'Erro ao consultar as reservas.',
                (int) $e->getCode(), $e );
        }
    }

    public function transformarDadosEmObjeto(array $dados){
        $mesa = $this->mesaRepositorio->listarComId($dados['idMesa']);
        $cliente = $this->clienteRepositorio->listarComId($dados['idCliente']);
        $funcionario = $this->funcionarioRepositorio->listarComId($dados['idFuncionario']);

        $reserva = new Reserva($dados['id'], $mesa, $cliente, $funcionario, $dados['dataReserva'], $dados['ativo']);

        return $reserva;
    }

}