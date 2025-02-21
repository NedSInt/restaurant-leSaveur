<?php

class ContaRepositorioEmBDR extends RepositorioEmBDR implements ContaRepositorio {

    private ItemRepositorio $itemRepositorio;
    private ReservaRepositorio $reservaRepositorio;

    public function __construct(PDO $pdo, ItemRepositorio $itemRepositorio = null, ReservaRepositorio $reservaRepositorio = null){
        parent::__construct($pdo);
        $this->itemRepositorio = $itemRepositorio ?? new ItemRepositorioEmBDR($pdo);
        $this->reservaRepositorio = $reservaRepositorio ?? new ReservaRepositorioEmBDR($pdo);
    }

    public function listar(array $restricoes = []){

        $queryRestricoes = [];
        $parametros = [ ];

        if( isset($restricoes['concluida'])){
            $queryRestricoes[] = ' concluida = :concluida';
            $parametros['concluida'] = $restricoes['concluida'] ? 1 : 0;
        }

        if( isset($restricoes['idReserva'])){
            $queryRestricoes[] = ' idReserva = :idReserva';
            $parametros['idReserva'] = $restricoes['idReserva'];
        }

        $where = ' WHERE 1';
        if( count( $queryRestricoes ) > 0 ){
            $where .= ' AND ' . implode(' AND ', $queryRestricoes);
        }

        $comando = "SELECT id, idReserva, formaPagamento, porcentagemDesconto, concluida FROM conta" . $where;

        $linhas = $this->obterLinhas($comando, $parametros);
        $contas = [];

        foreach( $linhas as $l ){
            $conta = $this->transformarDadosEmObjeto($l);
            $contas[] = $conta;
        }

        return $contas;
    }


    public function listarComId(int $id) : ?Conta{
        try{
            $comando = "SELECT id, idReserva, formaPagamento, porcentagemDesconto, concluida FROM conta WHERE id = :id";
            $linha = $this->obterLinha($comando, ['id' => $id]);

            if( empty( $linha ) )
                return null;

            $conta = $this->transformarDadosEmObjeto($linha);
            return $conta;
        } catch ( PDOException $ex ) {
            throw new RepositorioException( 'Erro ao consultar a conta.',
                (int) $ex->getCode(), $ex );
        }
    }

    public function cadastrar(Conta $conta) : Conta {
        try{

            $comando = "INSERT INTO conta(idReserva, formaPagamento, porcentagemDesconto, concluida) 
                VALUES (:idReserva, :formaPagamento, :porcentagemDesconto, :concluida)";

            $parametros = [
                'idReserva' => $conta->reserva->id,
                'formaPagamento' => $conta->formaPagamento,
                'porcentagemDesconto' => $conta->porcentagemDesconto,
                'concluida' => $conta->concluida
            ];

            $idConta = $this->inserirLinha($comando, $parametros);

            $conta->id = $idConta;

            return $conta;
        } catch(PDOException $e) {

            throw new RepositorioException( 'Erro ao cadastrar conta.',
            (int) $e->getCode(), $e );
        }
    }

    public function atualizar(Conta $conta): bool{
        try{

            $comando = "UPDATE conta SET idReserva = :idReserva, formaPagamento = :formaPagamento, porcentagemDesconto = :porcentagemDesconto, concluida = :concluida WHERE id = :idConta";

            $parametros = [
                'idConta' => $conta->id,
                'idReserva' => $conta->reserva->id,
                'formaPagamento' => FormaPagamento::paraCodigo($conta->formaPagamento) ?? null,
                'porcentagemDesconto' => $conta->porcentagemDesconto,
                'concluida' => $conta->concluida
            ];

            $linhasAlteradas = $this->executarComando($comando, $parametros);

            return $linhasAlteradas == 1;

        } catch(PDOException $e) {

            throw new RepositorioException( 'Erro ao cadastrar conta.',
            (int) $e->getCode(), $e );
        }
    }

    public function transformarDadosEmObjeto(array $dados): Conta{
        $itens = $this->itemRepositorio->listar(['idConta' => $dados['id']]);
        $reserva = $this->reservaRepositorio->listarComId($dados['idReserva']);
        $formaPagamento = $dados['formaPagamento'] != null ? FormaPagamento::deTexto($dados['formaPagamento']) : null;

        $conta = new Conta($dados['id'], 
            $reserva, 
            $formaPagamento, 
            $dados['porcentagemDesconto'], 
            filter_var($dados['concluida'], FILTER_VALIDATE_BOOLEAN), 
            $itens
        );

        return $conta;
    }

}