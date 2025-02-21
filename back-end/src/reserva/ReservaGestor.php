<?php

use phputil\TDateTime as TDateTime;

class ReservaGestor {

    private ReservaRepositorio $reservaRepositorio;
    private MesaRepositorio $mesaRepositorio;
    private FuncionarioRepositorio $funcionarioRepositorio;
    private ClienteRepositorio $clienteRepositorio;

    public function __construct(PDO $pdo) {
        $this->mesaRepositorio = new MesaRepositorioEmBDR($pdo);
        $this->funcionarioRepositorio = new FuncionarioRepositorioEmBDR($pdo);
        $this->clienteRepositorio = new ClienteRepositorioEmBDR($pdo);
        $this->reservaRepositorio = new ReservaRepositorioEmBDR($pdo, $this->mesaRepositorio, $this->funcionarioRepositorio, $this->clienteRepositorio);
    }

    public function listarComId(int $id){
        return $this->reservaRepositorio->listarComId($id);
    }

    public function listarReservasFuturas(){
        return $this->reservaRepositorio->listarReservasFuturas();
    }

    public function listarReservasParaAtendimento(){
        $restricoes = [
            "dataMinima" => (new TDateTime())->minusHours('2')->toDatabaseString(),
            "dataMaxima" => (new TDateTime())->toDatabaseString(),
            "ativo" => true,
            "comConta" => false
        ];
        return $this->reservaRepositorio->listar($restricoes);
    }

    public function cadastrar(array $json, bool $paraCadastrarConta = false) : ?Reserva{
        $problemas = [];

        $idMesa = $json['idMesa'] ?? 0;

        if( ! is_numeric($idMesa) ){
            $problemas['mesa'] = 'Mesa não encontrada.';
        }

        $mesa = $this->mesaRepositorio->listarComId($idMesa);
        if ( $mesa === null ) {
            $problemas['mesa'] = 'Mesa não encontrada.';
        }

        $idFuncionario = $json['idFuncionario'] ?? 0;

        if( ! is_numeric($idFuncionario) ){
            $problemas['funcionario'] = 'Funcionário não encontrada.';
        }

        $funcionario = $this->funcionarioRepositorio->listarComId($idFuncionario);
        if ( $funcionario === null ) {
            $problemas['funcionario'] = 'Funcionário não encontrado.';
        }

        $nomeCliente = $json['nomeCliente'] ?? 0;
        $telefoneCliente = $json['telefoneCelular'] ?? 0;

        if( empty($nomeCliente) ){
            $problemas['Cliente'] = 'Cliente não encontrado.';
        }

        $cliente = $this->clienteRepositorio->listarComNome($nomeCliente);
        if ( $cliente === null ) {
            $cliente = new Cliente(0, $nomeCliente, $telefoneCliente);
        }

        $dataReserva = $json['dataReserva'] ?? date('Y-m-d H:i:s');

        $reserva = new Reserva(0, $mesa, $cliente, $funcionario, $dataReserva);

        $problemas = array_merge($problemas, $reserva->validar());

        // Verificar se mesa está disponível.
        if($mesa instanceof Mesa){
            $problemas = array_merge($problemas, ValidadorDataReserva::validarReserva($reserva, $this->reservaRepositorio, $paraCadastrarConta));
        }

        if( count( $problemas ) > 0 ){
            throw new ValidacaoException("Erro ao cadastrar reserva.", $problemas);
        }

        $reserva = $this->reservaRepositorio->cadastrar($reserva);

        return $reserva;
    }

    public function alterarAtivo($id, $ativo){

        $reserva = $this->reservaRepositorio->listarComId($id);

        if( $reserva == null){
            throw new NaoEncontradoException('Reserva não encontrada.');
        }

        $ativoAlterado = $this->reservaRepositorio->alterarAtivoReserva($id, $ativo);

        if( ! $ativoAlterado ){
            throw new NaoEncontradoException('Reserva não encontrada.');
        }

        return $ativoAlterado;
    }

    public function listarQuantidadeReservasEntreDatas(TDateTime $dataMinima, TDateTime $dataMaxima){

        $restricoes = [
            "dataMinima" => $dataMinima->toDatabaseString(),
            "dataMaxima" => $dataMaxima->toDatabaseString()
        ];

        return $this->reservaRepositorio->listarQuantidadeReservasEntreDatas($restricoes);
    }
}