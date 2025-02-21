<?php

function geraDadosTesteParaBanco(){
    return '
        INSERT INTO cliente(id, nome)
        VALUES
            (1, "Cicrano"),
            (2, "Fulano da Silva"),
            (3, "Beltrano da Silva Silveira");

        INSERT INTO reserva(id, idMesa, idCliente, idFuncionario, dataReserva, ativo) 
        VALUES
            (1, 1, 1, 1, "2025-01-17 19:00:00", 1), -- Reserva 1: Cliente 1, Mesa 1
            (2, 2, 2, 2, "2023-01-18 20:00:00", 1), -- Reserva 2: Cliente 2, Mesa 2
            (3, 3, 3, 3, "2024-12-29 17:30:00", 1), -- Reserva 3: Cliente 3, Mesa 3
            (4, 2, 1, 1, "' . date('Y-m-d 17:00:00', strtotime('next Saturday')) . '", 0),
            (5, 2, 3, 1, "' . date('Y-m-d 17:30:00', strtotime('next Saturday')) . '", 1),
            (6, 2, 2, 2, "' . date('Y-m-d 17:30:00', strtotime('next Sunday')) . '", 1),
            (7, 3, 1, 2, "' . date('Y-m-d 17:30:00', strtotime('next Sunday')) . '", 1),
            (8, 4, 2, 3, "' . date('Y-m-d 19:30:00', strtotime('next Sunday')) . '", 1),
            (9, 1, 2, 3, "' . date('Y-m-d 17:30:00', strtotime('next Friday')) . '", 1),
            (10, 2, 1, 3, "' . date('Y-m-d 20:00:00', strtotime('next Friday')) . '", 1),
            (11, 3, 3, 3, "' . date('Y-m-d 18:30:00', strtotime('next Friday')) . '", 1),
            (12, 4, 2, 3, "' . date('Y-m-d 17:50:00', strtotime('next Friday')) . '", 1),
            (13, 5, 1, 3, "' . date('Y-m-d 17:30:00', strtotime('next Friday')) . '", 1),
            (14, 6, 3, 3, "' . date('Y-m-d 18:00:00', strtotime('next Friday')) . '", 1),
            (15, 7, 2, 3, "' . date('Y-m-d 19:30:00', strtotime('next Friday')) . '", 1),
            (16, 4, 2, 2, "' . date('Y-m-d 18:30:00', strtotime('next Saturday')) . '", 0),
            (17, 1, 2, 2, "' . date('Y-m-d H:i:s', strtotime(date("Y-m-d H:i:s") . " -10 minutes")) . '", 0),
            (18, 2, 1, 2, "' . date('Y-m-d H:i:s', strtotime(date("Y-m-d H:i:s") . " -15 minutes")) . '", 0),
            (19, 3, 3, 2, "' . date('Y-m-d H:i:s', strtotime(date("Y-m-d H:i:s") . " -18 minutes")) . '", 0)
            ;

        INSERT INTO conta (id, idReserva, formaPagamento, porcentagemDesconto, concluida) VALUES
            (1, 1, "PIX", 0, 1),  -- Conta 1 com pagamento por PIX, relacionada à reserva 1
            (2, 2, "CARTAO_CREDITO", 5, 1),  -- Conta 2 com pagamento por Cartão de Crédito, relacionada à reserva 2
            (3, 3, "PIX", 5, 1),  -- Conta 3 com pagamento por PIX, relacionada à reserva 3
            (4, 17, null, 0, 0),
            (5, 18, null, 0, 0);

        INSERT INTO item (id, idProduto, idConta, idFuncionario, quantidade, preco) VALUES
            (1, 1, 1, 1, 2, "18.50"),  -- 2x Salada Caesar, conta 1
            (2, 13, 1, 1, 3, "48.90"),  -- 3x Bife de Chorizo com Batatas, conta 1
            (3, 2, 2, 2, 3, "12.90"),  -- 3x Sopa de Cebola, conta 2
            (4, 10, 2, 2, 2, "9.90"),  -- 2x Pudim de Leite, conta 2
            (5, 6, 2, 2, 1, "42.50"),  -- 1x Risoto de Camarão, conta 2
            (6, 15, 3, 3, 1, "35.90"),  -- 1x Bife de Chorizo, conta 3
            (7, 7, 3, 3, 1, "8.00"),  -- 1x Suco de Laranja, conta 3
            (8, 15, 4, 2, 2, "35.90"),  -- 2x Bife de Chorizo, conta 3
            (9, 7, 4, 2, 2, "8.00");  -- 2x Suco de Laranja, conta 3
    ';
}