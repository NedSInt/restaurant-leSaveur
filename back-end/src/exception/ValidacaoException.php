<?php

class ValidacaoException extends DominioException {

    private array $problemas = [];

    public function __construct($message, $problemas){
        parent::__construct($message);
        $this->problemas = $problemas;
    }

    public function setProblemas( array $problemas ) {
        $this->problemas = $problemas;
        return $this;
    }

    public function getProblemas() {
        return $this->problemas;
    }
}