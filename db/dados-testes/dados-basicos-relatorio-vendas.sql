INSERT INTO cliente (id, nome, telefoneCelular) VALUES
(1, 'Cicrano', ''),
(2, 'Fulano da Silva', ''),
(3, 'Beltrano da Silva Silveira', ''),
(4, 'João Silva', ''),
(5, 'Lucas Silva', '');

INSERT INTO funcionario (id, nome, login, senha, sal, cargo) VALUES
(1, 'Jhonatan', 'jhonatan', '', '', 'ATENDENTE'),
(2, 'Lucas', 'lucas', '194501fc54877b7ff833cb40915cb732ca7cbf4acdd86a49f05e92ac47e56ba4', 'c72fd58dc6b23b48975da6a3c1c0fc328228d412481f49573227f5ae5fd3b532', 'ATENDENTE'),
(3, 'Thiago', 'thiago', '', '', 'ATENDENTE');

INSERT INTO mesa (id, nome) VALUES
(1, 'Mesa 1'),
(2, 'Mesa 2'),
(3, 'Mesa 3'),
(4, 'Mesa 4'),
(5, 'Mesa 5'),
(6, 'Mesa 6'),
(7, 'Mesa 7'),
(8, 'Mesa 8'),
(9, 'Mesa 9'),
(10, 'Mesa 10');

INSERT INTO categoria (id, nome) VALUES
(1, 'Entrada'),
(2, 'Prato Principal'),
(3, 'Bebida'),
(4, 'Sobremesa');

INSERT INTO produto (id, idCategoria, codigo, descricao, preco) VALUES
(1, 1, 'ENT001', 'Salada Caesar', '18.50'),
(2, 1, 'ENT002', 'Sopa de Cebola', '12.90'),
(3, 1, 'ENT003', 'Bruschetta de Tomate', '15.00'),
(4, 2, 'PP001', 'Filé à Parmegiana', '35.90'),
(5, 2, 'PP002', 'Risoto de Camarão', '42.50'),
(6, 2, 'PP003', 'Lasanha de Bolonhesa', '29.90'),
(7, 3, 'BEB001', 'Suco de Laranja', '8.00'),
(8, 3, 'BEB002', 'Refrigerante Lata', '6.50'),
(9, 3, 'BEB003', 'Água Mineral', '4.00'),
(10, 4, 'SOB001', 'Pudim de Leite', '9.90'),
(11, 4, 'SOB002', 'Torta de Limão', '12.50'),
(12, 4, 'SOB003', 'Brownie com Sorvete', '15.00'),
(13, 2, 'PP004', 'Bife de Chorizo com Batatas Rústicas', '48.90'),
(14, 2, 'PP005', 'Peixe Grelhado com Legumes', '39.50'),
(15, 2, 'PP006', 'Strogonoff de Frango', '28.90'),
(16, 2, 'PP007', 'Espaguete à Carbonara', '32.00'),
(17, 2, 'PP008', 'Costela Assada com Molho Barbecue', '55.00');

INSERT INTO reserva (id, idMesa, idCliente, idFuncionario, dataReserva, ativo) VALUES
(1, 1, 1, 1, '2025-01-17 19:00:00', 1), -- Reserva 1: Cliente 1, Mesa 1
(2, 2, 2, 2, '2023-01-18 20:00:00', 1), -- Reserva 2: Cliente 2, Mesa 2
(3, 3, 3, 3, '2024-12-29 17:30:00', 1); -- Reserva 3: Cliente 3, Mesa 3


INSERT INTO conta (id, idReserva, formaPagamento, porcentagemDesconto, concluida) VALUES
(1, 1, 'PIX', 0, 1),  -- Conta 1 com pagamento por PIX, relacionada à reserva 1
(2, 2, 'CARTAO_CREDITO', 5, 1),  -- Conta 2 com pagamento por Cartão de Crédito, relacionada à reserva 2
(3, 3, 'PIX', 5, 1);  -- Conta 3 com pagamento por PIX, relacionada à reserva 3


INSERT INTO item (id, idProduto, idConta, idFuncionario, quantidade, preco) VALUES
(1, 1, 1, 1, 2, '18.50'),  -- 2x Salada Caesar, conta 1
(7, 13, 1, 1, 3, '48.90'),  -- 3x Bife de Chorizo com Batatas, conta 1
(2, 2, 2, 2, 3, '12.90'),  -- 3x Sopa de Cebola, conta 2
(5, 10, 2, 2, 2, '9.90'),  -- 2x Pudim de Leite, conta 2
(6, 6, 2, 2, 1, '42.50'),  -- 1x Risoto de Camarão, conta 2
(3, 15, 3, 3, 1, '35.90'),  -- 1x Bife de Chorizo, conta 3
(4, 7, 3, 3, 1, '8.00');  -- 1x Suco de Laranja, conta 3
