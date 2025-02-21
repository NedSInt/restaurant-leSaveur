/* 
DADOS BÁSICOS PARA ESTRUTURA DA P1

INSERT INTO mesa(id, nome) VALUES
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

INSERT INTO funcionario(id, nome, login) VALUES
    (1, 'Jhonatan', 'jhonatan'),
    (2, 'Lucas', 'lucas'),
    (3, 'Thiago', 'thiago');
*/

INSERT INTO mesa(id, nome) VALUES
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

INSERT INTO funcionario(id, nome, cargo, login, senha, sal) VALUES
    (1, 'Jhonatan', 'GERENTE', 'jhonatan', '992876257c9205355a9f762056d42a14f04a6ac626f41f90402893e2f8080015', '2fd6e94e2f5a853fa37ac2119a7be52f4515790ec5be31c635f30c05b7377545'), -- SENHA = TESTE
    (2, 'Lucas', 'ATENDENTE', 'lucas', 'a46abb4852341857bbb3af19bdc639ae0a67372fd8c1baba3b866eb0b644c876', '4003112a5a041726fb4c73268cc3443fa33f827c71c5ebd4c785cff30b217208'), -- SENHA = TESTE2
    (3, 'Thiago', 'GERENTE', 'thiago', 'fcdec337ae235aa62fb9287aee0f9457637dca839f154b80261c817d8bc50a51', '2c4a01615a68f254b0abba06ba55710dd32188c25b90280c024f6e402b81b7ec'); -- SENHA = TESTE3

INSERT INTO categoria(id, nome) VALUES
    (1, 'Entrada'),
    (2, 'Prato Principal'),
    (3, 'Bebida'),
    (4, 'Sobremesa');

INSERT INTO produto (id, idCategoria, codigo, descricao, preco) VALUES
    (1, 1, 'ENT001', 'Salada Caesar', 18.50),
    (2, 1, 'ENT002', 'Sopa de Cebola', 12.90),
    (3, 1, 'ENT003', 'Bruschetta de Tomate', 15.00),
    (4, 2, 'PP001', 'Filé à Parmegiana', 35.90),
    (5, 2, 'PP002', 'Risoto de Camarão', 42.50),
    (6, 2, 'PP003', 'Lasanha de Bolonhesa', 29.90),
    (7, 3, 'BEB001', 'Suco de Laranja', 8.00),
    (8, 3, 'BEB002', 'Refrigerante Lata', 6.50),
    (9, 3, 'BEB003', 'Água Mineral', 4.00),
    (10, 4, 'SOB001', 'Pudim de Leite', 9.90),
    (11, 4, 'SOB002', 'Torta de Limão', 12.50),
    (12, 4, 'SOB003', 'Brownie com Sorvete', 15.00),
    (13, 2, 'PP004', 'Bife de Chorizo com Batatas Rústicas', 48.90),
    (14, 2, 'PP005', 'Peixe Grelhado com Legumes', 39.50),
    (15, 2, 'PP006', 'Strogonoff de Frango', 28.90),
    (16, 2, 'PP007', 'Espaguete à Carbonara', 32.00),
    (17, 2, 'PP008', 'Costela Assada com Molho Barbecue', 55.00);