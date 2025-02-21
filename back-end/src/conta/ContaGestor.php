<?php

class ContaGestor {

    private ContaRepositorio $contaRepositorio;
    private ReservaGestor $reservaGestor;
    private ItemRepositorio $itemRepositorio;

    public function __construct(PDO $pdo) {
        $this->itemRepositorio = new ItemRepositorioEmBDR($pdo);
        $this->contaRepositorio = new ContaRepositorioEmBDR($pdo, $this->itemRepositorio);
        $this->reservaGestor = new ReservaGestor($pdo);
    }

    public function listar($restricoes = []){
        return $this->contaRepositorio->listar($restricoes);
    }

    public function cadastrar(array $json) : ?Conta{
        $problemas = [];

        $reserva = null;
        try{
            if( isset( $json['idReserva'] ) ){
                $reserva = $this->reservaGestor->listarComId($json['idReserva']);
            } else {
                $reserva = $this->reservaGestor->cadastrar($json, true);
            }

            if( empty( $reserva) ){
                $problemas[] = 'Não foi possível obter a reserva.';
            } else {
                $contasComReserva = $this->contaRepositorio->listar( [ 'idReserva' => $reserva->id ] );

                if(count( $contasComReserva) > 0 ){
                    $problemas[] = 'Esta reserva já possui uma conta.';
                }
            } 

        } catch (ValidacaoException $e){
            $problemas = array_merge($problemas, $e->getProblemas());
        }

        $formaPagamento = $json['formaPagamento'] ?? null;
        $porcentagemDesconto = intval( $json['porcentagemDesconto'] ?? 0 );
        $concluida = filter_var($json['concluida'] ?? false, FILTER_VALIDATE_BOOLEAN);

        $conta = new Conta(0, $reserva, $formaPagamento, $porcentagemDesconto, $concluida);

        $problemas = array_merge($problemas, $conta->validar());

        if( count( $problemas ) > 0 ){
            throw new ValidacaoException("Erro ao cadastrar conta.", $problemas);
        }

        $conta = $this->contaRepositorio->cadastrar($conta);

        return $conta;
    }

    public function fecharConta(array $json, int $idConta){

        $problemas = [];

        $conta = $this->contaRepositorio->listarComId($idConta);

        if(empty( $conta) ){
            $problemas[] = 'Conta não encontrada.';
        } else if($conta->concluida == true) {
            $problemas[] = 'Conta já foi concluída.';
        }

        if( count( $problemas ) > 0 ){
            throw new ValidacaoException("Erro ao fechar conta.", $problemas);
        }

        $formaPagamento = FormaPagamento::deTexto($json['formaPagamento']) ?? null;
        $porcentagemDesconto = intval( $json['porcentagemDesconto'] ?? 0 );

        $conta->porcentagemDesconto = $porcentagemDesconto;
        $conta->concluida = true;
        $conta->formaPagamento = $formaPagamento;

        $problemas = array_merge($problemas, $conta->validar());

        if( count( $problemas ) > 0 ){
            throw new ValidacaoException("Erro ao fechar conta.", $problemas);
        }

        $contaAtualizada = $this->contaRepositorio->atualizar($conta);

        if( ! $contaAtualizada ){
            throw new DominioException('Conta não fechada.');
        }

        return $conta;
    }

}