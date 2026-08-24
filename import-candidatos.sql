INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'da5a8ad96683fc83', 'ARACELI', 50, 
           (SELECT id FROM "Cargo" WHERE nome = 'Governador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 50),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P50%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Governador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '4dce03063370ef65', 'CLEBER RABELO', 16, 
           (SELECT id FROM "Cargo" WHERE nome = 'Governador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 16),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P16%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Governador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'ca623e827a7672da', 'DR. DANIEL', 20, 
           (SELECT id FROM "Cargo" WHERE nome = 'Governador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Governador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '05b292139e1cd047', 'GAL LEITE', 80, 
           (SELECT id FROM "Cargo" WHERE nome = 'Governador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 80),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P80%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Governador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '75d6373ff105a9b2', 'HANA GHASSAN', 15, 
           (SELECT id FROM "Cargo" WHERE nome = 'Governador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Governador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'f6277350bb6e41b3', 'JOSÉ MOITA', 35, 
           (SELECT id FROM "Cargo" WHERE nome = 'Governador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 35),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P35%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Governador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'e005d88909d6eda6', 'WELL MACEDO', 16, 
           (SELECT id FROM "Cargo" WHERE nome = 'Governador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 16),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P16%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Governador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '788d967ac773363f', 'DIRCEU TEN CATEN', 15, 
           (SELECT id FROM "Cargo" WHERE nome = 'Vice-Governador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Vice-Governador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'f5099ac2c8deb89f', 'ELLAYNE D ALMEIDA', 20, 
           (SELECT id FROM "Cargo" WHERE nome = 'Vice-Governador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Vice-Governador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '5b56cda30057d64c', 'FATIMA SANTANA', 50, 
           (SELECT id FROM "Cargo" WHERE nome = 'Vice-Governador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 50),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P50%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Vice-Governador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'f498cf603eac4084', 'KAREN SUELLEN', 80, 
           (SELECT id FROM "Cargo" WHERE nome = 'Vice-Governador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 80),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P80%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Vice-Governador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'da5426a5eb61f50b', 'RUTH REIS', 35, 
           (SELECT id FROM "Cargo" WHERE nome = 'Vice-Governador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 35),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P35%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Vice-Governador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'b5ba4a84934c5e7f', 'SEU ALEX', 16, 
           (SELECT id FROM "Cargo" WHERE nome = 'Vice-Governador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 16),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P16%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Vice-Governador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '14e10fb734eb1510', 'WELL MACEDO', 16, 
           (SELECT id FROM "Cargo" WHERE nome = 'Vice-Governador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 16),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P16%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Vice-Governador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '5dbd56192c32e65c', 'BRENO GUIMARÃES', 333, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 333),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P333%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '8b3ad539c29f5ef1', 'CELSO SABINO', 123, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 123),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P123%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'c2ea1ba4deed4feb', 'CHICÃO', 444, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 444),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P444%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'f743b89b20599a57', 'CONTI', 500, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 500),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P500%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'cff838d07accc199', 'DELEGADO ÉDER MAURO', 222, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 222),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P222%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '49f805685bd229e1', 'EDLAINE RODRIGUES', 355, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 355),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P355%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'bdde90d43ee6c2da', 'FERNANDA LOPES', 800, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 800),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P800%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '65d84246babf0046', 'GIZELLE FREITAS', 505, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 505),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P505%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '70365268d14ec746', 'HELDER', 151, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 151),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P151%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '5498bd75581db1c2', 'LIVIA NORONHA', 777, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 777),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P777%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'c4f345adfeae0ece', 'WILLEM DA SILVA', 277, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 277),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P277%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '7b20ac0580332d58', 'ZEQUINHA MARINHO', 200, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 200),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P200%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'f226ed4447098939', 'ALEX LIMA', 222, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 222),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P222%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'fc2dd4099e14e868', 'BURIN', 200, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 200),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P200%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '54dbd8b67352f0ae', 'DR TELMO MARINHO', 333, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 333),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P333%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '1ed7d7c0e0652dc6', 'IAN BLOIS PINHEIRO', 777, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 777),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P777%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'cf0eeab78411c082', 'ITALO MÁCOLA', 123, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 123),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P123%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '77393d0e964c2f52', 'JADER BARBALHO', 151, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 151),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P151%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '74389f0e94e277bd', 'JOEL LOBATO', 444, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 444),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P444%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '23c6321524e3ba45', 'MARIA LUISA FARIAS', 500, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 500),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P500%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'ede3bbfba28b0c61', 'NAIDE CORDEIRO PACHECO', 505, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 505),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P505%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '6b0ff5c1b5eb4b1d', 'RUTH REIS', 355, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 355),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P355%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'b7424e12ca9cf616', 'SANRO OLIVEIRA', 277, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 277),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P277%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '0933fecb0f5c1f09', 'SOCORRO BAYMA', 800, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 800),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P800%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '3dbc4db053603eba', 'ALESSANDRA SÁ', 222, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 222),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P222%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '2c6e9e7f5ecc54e7', 'EDNA GOUVÊA', 505, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 505),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P505%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '26696c44c3bc6829', 'FRANCY PARÁ', 200, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 200),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P200%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'a18f579ec4825ada', 'JOANA DA ECONOMIA SOLIDÁRIA', 500, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 500),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P500%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'e88df089b94a367a', 'KINZINHO', 777, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 777),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P777%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '2a301bfd2fe61f7b', 'LUCILENE OLIVEIRA', 800, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 800),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P800%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '4e5acc6014edaa39', 'MARCILIO FERREIRA', 277, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 277),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P277%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'be47c5e8c1a2ca52', 'NEI TEIXEIRA', 123, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 123),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P123%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '36bf5e1b88e71723', 'NELSON MARGALHO', 355, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 355),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P355%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'a5ecab1d019bac0f', 'PASTOR IBANÊS', 444, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 444),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P444%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '45b044c0ae0fb499', 'PR. FENELON', 200, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 200),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P200%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '3f72702b31644438', 'ROSELI MALCHER', 333, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 333),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P333%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '3df72dc3a74286ab', 'SAMUEL CAMARA', 151, 
           (SELECT id FROM "Cargo" WHERE nome = 'Senador' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 151),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P151%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Senador');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'a8ea500ae84fe493', 'ACÁCIO MOREIRA', 1616, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1616),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1616%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '7dfbdc7d98519f8b', 'ADAMOR BITENCOURT', 2050, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2050),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2050%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '10d1876e538c5007', 'ADRIANA ALMEIDA', 1522, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1522),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1522%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '8203aa24b925ae1a', 'ADRIANO COELHO', 1500, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1500),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1500%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'cfd74c5bf6249117', 'AERTON GRANDE', 4410, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4410),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4410%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'ee47cdda21f2b4d8', 'AGENOR SANTOS', 4001, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4001),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4001%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '775b8888e3e44e17', 'AGNALDO E A TURMA DO PAMPAM', 1201, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1201),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1201%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'c686383c65b2afa2', 'AIRTON FALEIRO', 1321, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1321),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1321%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '1a7d73215dc175ff', 'ALAOR DA FIEL', 7722, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 7722),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P7722%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'e8df3515019ca890', 'ALEMÃO DA CERÂMICA', 4044, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4044),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4044%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '050899c32ed4fc7c', 'ALEMÃO DO AÇOUGUE', 1215, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1215),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1215%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '5e7fc0f587cd0be7', 'ALESSANDRA MUNDURUKU', 1388, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1388),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1388%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '0283acb6b313f56d', 'ALLEN PELO PARÁ', 3022, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 3022),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P3022%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '02c4b9f8b055f490', 'AMARILDO PAULINO (LEVINO)', 5533, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 5533),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P5533%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '4a8fe23972ae070a', 'ANA RAQUEL', 3000, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 3000),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P3000%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'e7de0b0e4959e975', 'ANDRÉIA SIQUEIRA', 4010, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4010),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4010%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '61bc9aa0f970bf6d', 'ANNY LOPES', 1224, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1224),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1224%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '42520331ae89191a', 'ANTONIO DOIDO', 1511, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1511),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1511%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'ecfde82d5997b347', 'APARECIDA REGO', 3017, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 3017),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P3017%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'a36deab987c23e00', 'ATAINÁ', 7012, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 7012),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P7012%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'fd1cc80211197e55', 'BIANNY SANCHES', 2777, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2777),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2777%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'ea363606e3cd24a0', 'BIGA', 1324, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1324),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1324%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '02de341a2c0bfd44', 'BOB FLLAY', 2040, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2040),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2040%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'dae357cdf941d2e4', 'BRAZ', 5555, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 5555),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P5555%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '88e67bddd6c79d4d', 'BRUNA DE LIMA', 1008, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1008),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1008%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'dc6f211c8a8f45ca', 'BRUNA FREIRE', 8080, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 8080),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P8080%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '6be2264ef2aef78f', 'BRUNA NUNES', 4433, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4433),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4433%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '03948fa8b5f40366', 'CAMILA PAMPLONA', 5055, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 5055),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P5055%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'a81646fb7e353d29', 'CARLA PARENTE', 4045, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4045),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4045%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'b31ce776b545c367', 'CAROL RESQUE', 4004, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4004),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4004%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '3a0618401611c543', 'CAROL SILVA', 1100, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1100),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1100%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '80b584fe25ae3c1a', 'CASSIO ANDRADE', 1567, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1567),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1567%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '5185ee3c56c278d4', 'CHAPADINHA', 2077, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2077),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2077%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'c82974c34386a3e3', 'CHARLES ALCANTARA', 1369, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1369),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1369%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '4c98a007fdd5877e', 'CHICO DA PESCA', 7713, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 7713),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P7713%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '5b489921c5e42124', 'CLÁUDIA BENASSULY', 2323, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2323),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2323%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'da82e29956d14ff6', 'CLEBER DAMAZANY', 2513, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2513),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2513%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '53366165e6db438b', 'CLEONICE DA IRACEMA', 2270, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2270),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2270%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '16a0adb7adc554e5', 'CLEUMA PANTOJA', 2212, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2212),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2212%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '164ebefa5a74ea7b', 'CORONEL ALMEIDA COSTA', 2700, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2700),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2700%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '7453787a999f0c0f', 'CORONEL JONILDO', 2799, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2799),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2799%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'f5c849ef04bd4faf', 'CORONEL MARCO ANTONIO', 4488, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4488),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4488%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'a32377bb634fe443', 'CORONEL TEEN', 4411, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4411),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4411%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '3fd35cd956da8486', 'CORONEL WELLINGTON', 2288, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2288),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2288%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'cc0580a7007e8c33', 'DARLAN SOUSA', 3030, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 3030),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P3030%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '07f320fe81072f39', 'DEBORA ABELHA', 2024, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2024),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2024%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '240eff8c34a0b480', 'DEHAN  PACHECO', 3099, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 3099),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P3099%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'da0dabe6c37799b5', 'DEIVITH POTENTE', 2720, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2720),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2720%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '8b1629c6125be10a', 'DELEGADA AMANDA SOUZA', 2026, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2026),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2026%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '1fe6a565ef717e5b', 'DELEGADO CAVEIRA', 2200, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2200),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2200%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '9961fb3aac6cc2f6', 'DELEGADO FEDERAL EGUCHI', 1022, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1022),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1022%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '3086d3608e01df18', 'DEOSMAR NETO', 1230, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1230),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1230%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '7ccb35e0e3fa15ad', 'DILVANDA FARO', 1313, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1313),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1313%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'a13a2dae0bd6a5aa', 'DINHO PEREIRA', 2210, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2210),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2210%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'dc8d9561a8814555', 'DJ AGATHA', 2524, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2524),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2524%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '54d9c45699b35bcc', 'DJ GORDO DO CROCODILO', 1234, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1234),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1234%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '9c71e68a7cc1b1f3', 'DR MARINHO', 2244, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2244),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2244%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'cb0d9796c7e0895f', 'DR. ALAILSON', 3012, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 3012),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P3012%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '79427e7bcda07d19', 'DR. CARLOS BELIZARIO', 3066, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 3066),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P3066%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'c4c302b0d3d55e57', 'DR. DANIEL ESTUMANO', 2345, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2345),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2345%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'a9058860ca8bbe93', 'DR. DIOGO FRANCO', 2022, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2022),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2022%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '1e08cd244e8eb873', 'DR. FELIPE', 2011, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2011),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2011%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'ac410d979c0991db', 'DR. FERNANDO', 3020, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 3020),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P3020%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '4d6c3e271ef42d22', 'DR. FLAVIO NOBRE', 4080, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4080),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4080%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '2d5d923c6bad0944', 'DR. HELDER', 5599, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 5599),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P5599%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '7170cf5245f30177', 'DR. IGOR PARENTE', 5567, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 5567),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P5567%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '6d20e774588c6358', 'DR. MARCOS VINICIUS', 1122, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1122),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1122%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '9b29b13e890ad2a6', 'DR. MOISES', 1023, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1023),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1023%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '8c8bd3b01857e680', 'DR. OSVALDO FIGUEIREDO', 7788, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 7788),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P7788%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '155198a680f10e2d', 'DR. VERA CRUZ', 2340, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2340),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2340%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'b6ca902ed46fc1b4', 'DRA GISELE MAINARD', 1033, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1033),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1033%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '91b3d1934fb657a7', 'DRª THAIS CARVALHO', 2767, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2767),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2767%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'ffc0d00b9f265868', 'DRª VALGEANE MORENO', 2714, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2714),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2714%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '7e9d830b7debe5b8', 'DRA. ALESSANDRA HABER', 2020, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2020),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2020%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '583f98399a20aa91', 'DRA. ANNY GABI', 5512, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 5512),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P5512%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '30d92ff118a21cb4', 'DRA. CYNTHIA CHARONE', 5500, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 5500),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P5500%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'ca8698c8965d3ccb', 'DRA. HELOÍSA', 4000, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4000),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4000%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '2c45168161b7798e', 'DRA. MYLENE COSTA', 5544, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 5544),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P5544%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'bdb571e1694fdc93', 'DRº JOSE ROBERTO', 2717, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2717),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2717%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'e0eedce6cfcdc0ec', 'DULCE FAVACHO', 1877, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1877),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1877%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '5e558790c236f2d4', 'EDUARDO RODRIGUES', 1600, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1600),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1600%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'bc23b7f58dd176ea', 'ELIETH DE FÁTIMA', 4015, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4015),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4015%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '48204e7c764f4a9d', 'EMERSON SILVEIRA', 1818, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1818),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1818%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '964d06aa34909035', 'ENFERMEIRA NAZARÉ', 5033, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 5033),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P5033%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '10ac4ea114883f2f', 'ENGENHEIRO DIOGO', 4477, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4477),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4477%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '6a34a25e4fae1502', 'ERIKA DA MORADIA', 1314, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1314),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1314%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'd5aeef1c856f4f1b', 'ERIKA SABINO', 1510, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1510),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1510%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'a309c3c04ffcd021', 'ESTER ESMIRNA', 1481, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1481),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1481%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '8687ee3387a0f996', 'ESTER SIQUEIRA', 1524, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1524),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1524%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '62b88cbefa1507c5', 'EVANDRO GARLA', 1010, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1010),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1010%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'ba2b8fef5522566c', 'ÉVANY SILVA', 1211, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1211),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1211%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '0e65724ff4ba013f', 'FABIANE PINHEIRO', 3001, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 3001),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P3001%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '0620489987841f8b', 'FABIO SOUZA', 4077, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4077),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4077%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '4c8481ef2b043f30', 'FELICIANO NETO', 2233, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2233),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2233%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'f42f329c777b3687', 'FERNANDA MAGALHÃES', 2030, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2030),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2030%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'c8cd1e35e0c39c80', 'FERNANDO SANTIAGO', 1316, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1316),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1316%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '59ce81a8984319a7', 'FILHO NUNES', 7070, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 7070),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P7070%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '8c8df70bd1183940', 'FLAVIA COSTA', 4552, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4552),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4552%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'da22b4a45fe34219', 'FLÁVIA MARÇAL', 4050, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4050),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4050%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'd818ff16f2c4dea3', 'FLÁVIO VERAS', 2722, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2722),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2722%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'd74995d205a0c82e', 'GABI LACERDA', 1412, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1412),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1412%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '29d0a7d465196af2', 'GEÓGRAFO RAIZ', 7020, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 7020),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P7020%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '4b998d0c0c62d592', 'GITO', 4011, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4011),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4011%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'de0c5f055e822c52', 'GUILHERME TIBÉRIO', 3031, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 3031),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P3031%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '38bec3bd6cf14f93', 'HELTON LAGOIA', 5592, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 5592),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P5592%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '8302853dca9a09ea', 'HENDERSON PINTO', 4422, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4422),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4422%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '612159973a64d352', 'HENRIQUE MACIEL', 8000, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 8000),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P8000%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '9de32e304dde51f9', 'HENRIQUE MANOEL', 1444, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1444),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1444%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'bb1e2ea290e0cb60', 'INGRID OLIVEIRA', 4377, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4377),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4377%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'c01a2a7bc4467716', 'INGRIDY TAVARES', 5550, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 5550),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P5550%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'a36df97fffe78168', 'IRMÃ ANTÔNIA', 1213, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1213),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1213%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '9567fc65916e5f3f', 'ISAIAS FOGAÇA', 7000, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 7000),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P7000%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'b1e7c10f9be6e4a6', 'JACK CAVALEIRO', 2500, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2500),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2500%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '047a6800117ae6b4', 'JADER FILHO', 1515, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1515),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1515%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '76f855aa5746a561', 'JAIR MARTINS', 1011, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1011),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1011%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '991b0df2b44b35a4', 'JAIRO SANTOS', 2267, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2267),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2267%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'd2a1347c6b77fcc2', 'JANIRA DE MORAES', 1221, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1221),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1221%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '3b4ccb9cc03ef5f5', 'JARDSON DA CONSTRUÇÃO', 7033, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 7033),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P7033%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '6876f05b84c40bad', 'JB MANINHO', 2044, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2044),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2044%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '37bffd88d2bd2985', 'JEFFERSON PARANATINGA', 2526, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2526),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2526%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '63e0c5a95aac5dec', 'JESSICA BARRA', 7080, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 7080),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P7080%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'e746947a747037b2', 'JÉSSICA PORTO', 1177, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1177),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1177%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'f340584d76cc3e4b', 'JOÃO CORAGEM', 3055, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 3055),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P3055%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '55f792f42b81a493', 'JOAQUIM PASSARINHO', 2222, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2222),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2222%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '0688ecf555c9b0b7', 'JOHN ROBERT', 1414, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1414),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1414%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '859239c86cbea052', 'JORNALISTA MARCIO PAZ', 1845, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1845),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1845%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'ee7171501254522d', 'JULIA DAHAS', 1400, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1400),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1400%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '5cdb4bfb78c125bf', 'JULIO DE BRAGANÇA', 5051, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 5051),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P5051%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '103ddbbfec3016fc', 'JÚNIOR FERRARI', 5588, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 5588),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P5588%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'fba2eb31c0f90189', 'JURACY BRITO', 2755, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2755),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2755%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '6417ff007f38b29a', 'KARIME', 5000, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 5000),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P5000%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '97e8b28cbce4db8a', 'KARINA EXPLENDOR', 2220, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2220),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2220%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '37dbc28728dcc488', 'KAROLINA SANTOS', 1815, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1815),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1815%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '083386bca1901b4b', 'KÁTIA PALHA COLETIVO DO AXÉ', 1200, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1200),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1200%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '97fb149a507ab96d', 'KELSON CORTEZ', 1112, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1112),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1112%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'a2844de959f02eb2', 'KENISTON BRAGA', 1512, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1512),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1512%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '4cfb449597060f30', 'KETLEN PRAXEDES', 3077, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 3077),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P3077%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '8dc13848090e6658', 'KEZIA NOVAES', 2201, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2201),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2201%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'ef8655d79fb33444', 'KIM KIM ALAGOANO', 7744, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 7744),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P7744%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'ffdb3e8122259144', 'LAUDENOR', 4545, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4545),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4545%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '8da807d85c264358', 'LEILA PALHETA', 5013, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 5013),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P5013%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '57c4a9720037198c', 'LENA PINTO', 4444, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4444),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4444%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'edad04d042e56928', 'LEO DA AGROLEO', 3088, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 3088),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P3088%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '262a1b02e22abc48', 'LORENA LIMA', 2277, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2277),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2277%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '00cfc7478716bcdd', 'LOURINHO', 7022, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 7022),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P7022%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '093c410fd7f6c2da', 'LU OGAWA', 1111, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1111),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1111%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '6898df2c31e1e810', 'LUAN NUNES', 2055, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2055),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2055%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'a737e44f03db8ba1', 'LUANNA SANTOS', 1303, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1303),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1303%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '54c058354ffec04f', 'LUIZ OMAR', 4418, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4418),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4418%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'b13f9b76c9268c42', 'LUIZ REBELO', 5566, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 5566),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P5566%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '99c97092ab6c5184', 'LULU DAS COMUNIDADES/PABLO', 4033, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4033),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4033%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '1ea04c72933131c5', 'MÃEZINHA', 1055, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1055),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1055%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'd9275595ffcc168b', 'MANOEL PIONEIRO', 1015, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1015),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1015%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '5fa02dcbf2610567', 'MANU LEOA', 5089, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 5089),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P5089%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'b1ea171ef2783037', 'MARCELINHO JHONSON', 7711, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 7711),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P7711%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '4cee10108c76e603', 'MARCELO PIERRE', 2010, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2010),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2010%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '1792eb1efd73d790', 'MÁRCIA ANDREA', 3044, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 3044),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P3044%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'b75e7f9ce86ab698', 'MARCOS ROCHA', 1455, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1455),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1455%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'b2a5762e01a1d148', 'MARCOS SOUZA', 2727, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2727),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2727%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'cfa9226cf867e201', 'MARCUS JÚNIOR', 7077, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 7077),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P7077%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '398ad661c05770b5', 'MARIA DO CARMO', 2760, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2760),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2760%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'cc491deeb7dbcf89', 'MARIANA RAIOL', 1219, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1219),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1219%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '422a5a43c0f58c59', 'MARII FREIRE', 6525, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 6525),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P6525%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '393b25dbd4e25df0', 'MARINÊS DA RÁDIO', 2525, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2525),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2525%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '83be4ab79bd0d1d3', 'MARIZA SANTOS', 1660, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1660),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1660%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '669ad929edf03b19', 'MARTA MARDOCK', 2088, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2088),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2088%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '533750bbdafb8f8f', 'MATHEUS ABREU', 7010, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 7010),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P7010%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '5aa95cb4010df9d5', 'MAURO DA HORTA', 7738, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 7738),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P7738%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'ae89abe905db7e7f', 'MAX DO LANCHE', 2702, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2702),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2702%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '70d4359eb02c3a97', 'MAX FERA', 5515, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 5515),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P5515%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '83fbbafda44d0008', 'MAYRA MARQUES', 1232, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1232),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1232%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '66c7bab83e755479', 'MIGUELITO', 1222, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1222),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1222%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'e0e9fae3a2d89f63', 'MILCA', 3383, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 3383),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P3383%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'df7776ba0e6d76f9', 'MIQUINHA', 1311, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1311),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1311%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '86165363548aa5b8', 'MIRANDA JUNIOR', 2788, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2788),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2788%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '2476c46ddcbf8e25', 'NADIA LUZ', 7015, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 7015),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P7015%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'a8122a4a37ccd763', 'NASLLA TEMBRA', 1336, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1336),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1336%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'ffff5b240e21268f', 'NAURO CHAVES', 1888, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1888),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1888%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '0003f5d953c0551e', 'NENÉM DA DANYSLAR', 2027, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2027),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2027%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'fcd2138969d5a76b', 'NETA DO GERSON PERES', 1017, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1017),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1017%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '63a00771090c3826', 'NICOLAS - BANCADA TRANSFORMAR', 5070, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 5070),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P5070%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'd4a04b2660daacce', 'NILMA SANCHES', 1432, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1432),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1432%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '51e1638d983aefd7', 'OLIVAL MARQUES', 2000, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2000),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2000%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '6ffa0b934b9f6f5d', 'OZORIO JUVENIL', 1025, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1025),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1025%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '6ed93cd383187b94', 'PACHECO', 2230, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2230),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2230%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'a2d32135c1b3c9a4', 'PALMEIRA', 1030, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1030),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1030%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '5aad8c5ee701c244', 'PASTOR CLAUDIO MARIANO', 4455, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4455),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4455%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'afb2d92b8003bfec', 'PASTOR ELIAS BARROS', 2225, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2225),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2225%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '64cbec630feb770f', 'PASTOR JACKSON CAVALCANTE', 7778, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 7778),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P7778%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'bf86cf6a4b24f42b', 'PASTORA MANU', 2701, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2701),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2701%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '0f62ab37cd00f258', 'PAULA BARRETO', 2510, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2510),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2510%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '6d7e51d8843c90bc', 'PAULO BENGTSON', 1556, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1556),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1556%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '7a6f883cadbc3a82', 'PAULO CIDADÃO', 4055, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4055),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4055%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '1b02e09207dbefc8', 'PAULO GAYA', 1310, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1310),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1310%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '4fac3f9b2683af17', 'PAULO PINHO', 5511, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 5511),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P5511%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '6120854eb403edf6', 'PEDRINHO BORGES', 5510, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 5510),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P5510%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '282d4af323bfc0e8', 'POLIANA LIMA', 4423, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4423),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4423%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '7cf8ffc6b85f39b8', 'PR. CARLOS RAMOS', 1277, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1277),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1277%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '5f4c8f17e567dc5b', 'PRIANTE', 1555, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1555),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1555%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '23e34fa35de42de1', 'PROF. ANDERSON MAIA', 4099, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4099),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4099%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '951b2bdbbf50cd0f', 'PROF. DR. PORTELA', 5060, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 5060),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P5060%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'c54c97aad7b75613', 'PROF. THIAGO', 4022, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4022),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4022%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '388ef35caf26ab1d', 'PROFESSOR ALFREDO COSTA', 1330, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1330),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1330%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'cf08b8ddf297fac4', 'PROFESSOR ANTONIO MORAIS', 4343, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4343),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4343%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'd09243ecc88a7f5c', 'PROFESSOR CLEBE', 5010, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 5010),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P5010%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'e321926d91890af3', 'PROFESSOR DIEGO', 4456, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4456),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4456%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '5be966a4df3be25f', 'PROFESSOR MANESCHY', 1212, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1212),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1212%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '9c9e63e17c170ad4', 'PROFESSOR MÁRCIO PONTE', 1299, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1299),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1299%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'e206b2aa07e05496', 'PROFESSOR SILAS', 2775, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2775),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2775%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '14bfb963f1097d8b', 'PROFESSOR XAVIER', 7067, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 7067),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P7067%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '216360f736e8e14f', 'PROFESSORA JACE SIQUEIRA', 2744, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2744),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2744%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '0324f75d6754972a', 'PROFESSORA JUCÁ', 1300, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1300),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1300%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '7131a540fe080bf7', 'PROFESSORA ROSANA BASTOS', 5577, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 5577),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P5577%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '8300d79c9f37d0c1', 'PROFº ANDRÉ SILVA', 5020, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 5020),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P5020%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '4e4f14399ff9cef7', 'RAFAEL OLIVEIRA', 1404, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1404),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1404%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '0af49a3c3863500d', 'RAIMUNDO BELO', 7700, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 7700),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P7700%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '858c7c4dc34df632', 'RAIMUNDO SANTOS', 5522, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 5522),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P5522%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '9b966c250debffa5', 'RAMOM MARQUES', 1210, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1210),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1210%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '13aff4949e8ac8b9', 'REGINA SILVA', 3003, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 3003),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P3003%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '6c6f54ccc34a97a0', 'RENATO SARAIVA', 5016, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 5016),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P5016%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'abb67031931b268c', 'RENILCE NICODEMOS', 1577, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1577),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1577%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'ecdfe8157ec39bb4', 'RICARDO ALENCAR', 7776, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 7776),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P7776%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '62f53f61510e3bff', 'RICARDO OLIVEIRA', 2769, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2769),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2769%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '2b9f60fc1db0b650', 'RITA PINHO', 1012, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1012),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1012%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'ed20330297f0e09c', 'ROBERTA BATISTA', 5556, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 5556),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P5556%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '457c0263d44175b6', 'ROBSON CACAU', 1411, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1411),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1411%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'b7d5ba9ba4513bf6', 'RODRIGO MESSIAS', 3040, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 3040),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P3040%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'a41323018202877c', 'RODRIGO MORAES', 6565, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 6565),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P6565%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '6654d63b988d5ab2', 'RODRIGO SANTARÉM', 1077, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1077),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1077%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '5440f94a05d572aa', 'ROGERIO BARRA', 2255, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2255),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2255%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '6bf3d844a2f0eb82', 'ROGÉRIO LUSTOSÃO', 2008, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2008),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2008%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '818a0b3d7b0021ac', 'RONIEL CARVALHO', 1244, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1244),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1244%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '6a26a50d80e3ce59', 'ROSIVAL POSSIDÔNIO', 1001, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1001),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1001%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '9f2b6481c385ec14', 'RUAN SALES', 3333, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 3333),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P3333%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'e2f86c06841b1483', 'SGT RAFAELA', 4445, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4445),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4445%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'de5a74954bfa6333', 'SIMONE KAHWAGE', 2202, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2202),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2202%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '55d11a2512b38882', 'STEPHANIE SANT', 2299, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2299),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2299%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '63b80b1189f8d49a', 'SUELY', 7755, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 7755),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P7755%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '515aaf15d3a35714', 'TAMAR MONTEIRO', 2322, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2322),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2322%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '1475e49dc18310bb', 'TATAGIBA', 1000, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1000),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1000%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'a3d5dd1bc5fe367c', 'TATI LIMA', 2211, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2211),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2211%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '2148bff49f7b9cb5', 'THAYS SINTRA', 2021, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2021),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2021%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '99bd8ba7d885c0f4', 'THIAGO RODRIGUES', 1477, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1477),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1477%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '891b1a838c6f1c89', 'TIÃO MIRANDA', 5594, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 5594),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P5594%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '06a040c740b85466', 'TINGO SOARES', 2028, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2028),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2028%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'f96ac769fd256676', 'TRINDADE ARAUJO', 2710, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 2710),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P2710%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '3b9b633c826896be', 'UBIRAJARA SOMPRE', 4020, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4020),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4020%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'c0e50ea4b8e261e6', 'URSULA VIDAL', 4040, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4040),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4040%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '98c98dd40e2359eb', 'VALÉRIA PRADO', 1088, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1088),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1088%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'a2abd30f00392adb', 'VANDA BEZERRA', 1016, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1016),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1016%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '10e2f63b6422484d', 'VAVÁ MARTINS', 3010, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 3010),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P3010%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'e145feb25321b2c9', 'VELOSO', 4400, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4400),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4400%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'd50cabaaa9186003', 'VITORIA OLIVEIRA', 1422, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1422),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1422%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '7f85b9f46a5484ae', 'VITORIANO BILL', 1233, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1233),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1233%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'e294ec77ee9d7af7', 'VIVI REIS', 5050, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 5050),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P5050%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '79df5a3e6cba2026', 'VIVIANE PINHEIRO', 7777, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 7777),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P7777%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '018703666e044761', 'WANJA LOBATO', 7707, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 7707),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P7707%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '96f3066c08f56ea5', 'WILLI CARVALHO', 7075, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 7075),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P7075%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'e4b78bd60baeebd2', 'WR DO TAPAJÓS', 1020, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1020),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1020%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '59a0d296e43648d4', 'XIMBINHA', 1288, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1288),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1288%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'd41f13b8c404de1b', 'YURI FARO', 1331, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 1331),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P1331%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '66eb52e844972ec9', 'ZÉ MIGUEL', 4032, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Estadual' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 4032),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P4032%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Estadual');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'afce6a1023f0c0dc', 'ADM PAPALÉGUA DOS MOTOKAS', 10403, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10403),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10403%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'b0a9ba941a73bee6', 'ADNA MARTINS', 13513, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 13513),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P13513%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'e752d1fb42059e4d', 'ADRIANA BLINDADA', 18222, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 18222),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P18222%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '11a5cbfea6e119f0', 'ADRIANA FALCONERI', 44111, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 44111),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P44111%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '57dfdb272fde730d', 'ADRIANA MANFROI', 20163, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20163),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20163%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '103e8cca33b3388d', 'ADRIANO VAZ', 10700, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10700),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10700%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'd0b2b9422465e8aa', 'ADRIENE HAGE', 70555, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 70555),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P70555%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '91ad2e6de85396c8', 'AIRTON MORAES', 16000, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 16000),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P16000%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'a6c56449cc2ae029', 'ALBERTO MAIA', 55007, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 55007),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P55007%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '1781bca8064c825c', 'ALESSANDRA SILVA', 25777, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 25777),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P25777%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'ffeae6fe26760014', 'ALEX WILLIAMS', 45263, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 45263),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P45263%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'ec2d38baeadc9907', 'ALEXANDRE GOMES', 20200, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20200),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20200%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '2d7fe507c77e7ab8', 'ALLAF CORAGEM', 25123, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 25123),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P25123%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '39f6aadbbbd9b61f', 'ALLAN POMBO', 12333, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12333),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12333%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'f50a85065e99d92d', 'AMARELINHO DO ALTO BONITO', 10800, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10800),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10800%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '473994a583be8b43', 'AMARILDO VILHENA', 12789, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12789),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12789%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '75ed93ff2b1af5ba', 'AMAURY DA APPD', 13611, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 13611),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P13611%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '61e3a5bda79bf0bb', 'AMOR', 18007, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 18007),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P18007%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '5b014f790bf070f3', 'ANA CAROLINA', 27999, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 27999),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P27999%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '3f359836f7368473', 'ANA CUNHA', 15130, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15130),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15130%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'd3892e73187d8772', 'ANA FURTADO', 12576, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12576),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12576%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'bd9be0b816456719', 'ANA RUTE', 70190, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 70190),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P70190%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'a132ea1534210186', 'ANANIAS NAUAR', 44777, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 44777),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P44777%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '0a4898a57a8ebe14', 'ANDERSON MENDES', 20021, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20021),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20021%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '8dcee3eade7fbfde', 'ANDRADE DURINHO', 70300, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 70300),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P70300%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '1c03397a687cb73e', 'ANDRÉ CUTRIM', 33244, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 33244),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P33244%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '32a4d4d784ef6ad0', 'ANDREA DANTAS', 15011, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15011),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15011%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'b10df06f932d7cd4', 'ANDREA DO COMERCIO', 12455, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12455),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12455%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '45168f40062217f1', 'ANDREIA XARÃO', 15123, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15123),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15123%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '9f9c0318a0dae1a2', 'ANGELO FERRARI', 44500, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 44500),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P44500%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '345ab0cff99ddfe4', 'ANTÔNIA BRITO', 23222, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 23222),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P23222%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'c3406e83e2e1f54d', 'ANTÔNIO MELO', 12612, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12612),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12612%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'cc33d8f276239196', 'ANTÔNIO TONHEIRO', 13444, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 13444),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P13444%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'e635f19d333f026c', 'ARI NASCIMENTO', 22500, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22500),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22500%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'e3374b01d88d2064', 'ASSIMA AVELAR', 55300, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 55300),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P55300%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '07752ffb75481eb7', 'ATAÍDE JUNIOR', 30300, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 30300),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P30300%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'e385976178b950d9', 'AURICELIA ARAPIUN', 50321, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 50321),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P50321%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'c9dd520c36eedafc', 'AVEILTON SOUZA', 55000, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 55000),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P55000%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'c25a03edca42937b', 'BARATÃO', 20120, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20120),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20120%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '9af811b6d7ed6ed6', 'BARBICHA DO POVO', 77130, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 77130),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P77130%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'd7a5b21aae980fe5', 'BELLA DE REDENÇÃO', 15155, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15155),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15155%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '0e169a319c3099dc', 'BENEDITO FERNANDES', 18500, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 18500),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P18500%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '5c361eaa85e1c1d8', 'BETINHO', 27677, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 27677),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P27677%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'f4617b896d74eaed', 'BETO ANDRADE', 50500, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 50500),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P50500%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'f21d6f7da307d862', 'BONANÇA', 20500, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20500),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20500%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '1327da8bb51ebb19', 'BORDALO', 13130, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 13130),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P13130%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '74d4523a68aa9259', 'BRAGA', 20555, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20555),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20555%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'fac65c79d2130398', 'BRANCO DA PEDREIRA', 12111, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12111),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12111%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '9e18b452d04da147', 'BRASELINO ASSUNÇÃO', 44789, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 44789),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P44789%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '80d96ad838a7c96e', 'BRUNA FREITAS', 22002, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22002),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22002%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'e1ecaafe55b9ce76', 'CACAU', 33331, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 33331),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P33331%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '56f5ba9098d1777e', 'CANTORA ELKE SÔNIA', 12444, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12444),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12444%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'f2fa5f22391bd287', 'CAPITÃ GABRIELLE', 15172, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15172),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15172%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'ec66bf9c823aa916', 'CARINA DA SAÚDE', 10193, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10193),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10193%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '4c9f61358e7169b6', 'CARLOS ROLIM', 22116, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22116),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22116%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'bc3041bd42967042', 'CARLOS VINAGRE', 12555, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12555),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12555%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '41e8000c7d4d4d39', 'CARLOS VINICIOS', 15789, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15789),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15789%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'acb9e452a93c85ea', 'CAROL SILVANO', 12512, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12512),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12512%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '1be27fd3e7b4f00e', 'CAROLINA', 27222, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 27222),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P27222%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '3e26f0beba9f99ca', 'CELLY SOUSA', 30333, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 30333),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P30333%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '3abebfc20375bb66', 'CHAMONZINHO', 15100, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15100),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15100%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '04ebc63322ff9cc1', 'CHAPA COLETIVA DO AXÉ', 77180, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 77180),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P77180%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '22833aae38a2c568', 'CHIQUINHO CARVALHO', 13000, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 13000),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P13000%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'fb23ca0b1bfedfd2', 'CILENE COUTO', 15112, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15112),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15112%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '438c4e19015c7797', 'CILMARA BONFIM', 70700, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 70700),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P70700%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'eb0d0d073289a761', 'CLAUDIA SANTOS', 12400, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12400),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12400%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '71bba00baec5fea4', 'CLAUDIO LIMA', 77100, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 77100),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P77100%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '71a0188dfd2eadf9', 'COMENDADOR BELÉM', 10235, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10235),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10235%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '863755fe09eb9ae3', 'CORONEL BARRA', 44007, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 44007),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P44007%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '538c37e4fc13b046', 'CORONEL FIRMINO', 20190, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20190),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20190%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '156926fd9dba7642', 'CORONEL NEIL', 22222, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22222),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22222%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'f0cbca2aa09d8eba', 'CORONEL OSMAR', 15200, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15200),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15200%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'aff0c3b087036419', 'CORONEL VICENTE NETO', 15190, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15190),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15190%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'a56c29db553fa07f', 'CRISTINA HAGE', 20102, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20102),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20102%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'fbf4cd98960975e5', 'DANIELE MACHADO', 30234, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 30234),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P30234%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '289b983f3d5bfd57', 'DANIELLA BITENCOURT', 27277, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 27277),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P27277%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '84bb7a1c02231a4b', 'DANIELLE CARDIAS', 15153, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15153),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15153%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '3694368238391314', 'DAVI ROCHA', 22020, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22020),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22020%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '14221e4ea72122e2', 'DAYAN ROCHA', 70222, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 70222),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P70222%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'e9914dfcb5aa120c', 'DÉBORA CÂNDIDO', 70888, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 70888),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P70888%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '5f5b4303735c0870', 'DEBORAH CRESPO', 44077, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 44077),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P44077%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '68b3769486b19c68', 'DEDÊ', 20999, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20999),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20999%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '9f789b400d277331', 'DELEGADO FABIO', 22990, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22990),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22990%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '4cf4b8ff18db989e', 'DELEGADO NILTON NEVES', 55100, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 55100),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P55100%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '129e16ebb5b517b2', 'DELEGADO PAULO HENRIQUE', 22220, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22220),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22220%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '16e9f50ed836e449', 'DHEKSON POPULAR', 23787, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 23787),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P23787%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '252dbf4dd4f2e275', 'DIANA BELO', 44999, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 44999),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P44999%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'fde6e0e78ab99d28', 'DIANA NASCIMENTO', 20420, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20420),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20420%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'dbc0194e8f451fc2', 'DIDI DO VER O PESO', 15001, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15001),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15001%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '347052b3b0b4c099', 'DIEGO RAVANELLI', 77111, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 77111),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P77111%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'd2defcad7e3e1d7e', 'DIEGO SERAFIM', 12223, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12223),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12223%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '52d0068b29927134', 'DIELLY SILVA', 70789, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 70789),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P70789%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '17ed526a881f37c8', 'DOUGLAS MARCOS', 20123, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20123),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20123%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'd9e079cf0a73016b', 'DOUTOR MARDOCK DAS LATINHAS', 20678, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20678),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20678%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'fa8bde2ea1d061e4', 'DR EMANOEL', 22117, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22117),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22117%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'd5b522f1696624d5', 'DR GRAÇA MATOS', 15700, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15700),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15700%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '68f7703543762fa5', 'DR JAQUES', 13777, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 13777),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P13777%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'abfc5faeea5add8b', 'DR RUFINO', 22888, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22888),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22888%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '7cb1eea0e2a13216', 'DR SIPRIANO FERRAZ', 15999, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15999),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15999%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '281dd376d1b08dff', 'DR WANDERLAN', 15615, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15615),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15615%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '1499a0b32dcd7fe5', 'DR WANDERLEY', 22377, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22377),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22377%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'ae3dd3654415e5df', 'DR. CASIMIRO JUNIOR', 13333, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 13333),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P13333%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '538c065ca7c3b3ef', 'DR. CELSO RIBEIRO', 10127, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10127),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10127%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '75e8c2de27a7071e', 'DR. DENER OLIVEIRA', 20777, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20777),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20777%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'db9c0109a1828811', 'DR. GALILEU', 20620, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20620),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20620%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '97393aa798963c48', 'DR. GILMAR', 55789, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 55789),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P55789%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'b3a1049ebbbdde0f', 'DR. HERCULES SOUZA', 22200, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22200),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22200%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'b22d936c7a1e28bc', 'DR. LUCAS REIS', 20111, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20111),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20111%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '23c0564efc92a800', 'DR. MANOEL PAIXÃO', 13013, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 13013),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P13013%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '02913fa8e55888b0', 'DR. RENAN LAURIA', 11234, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 11234),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P11234%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '35e67418b4f972ba', 'DR. ZÉ RENATO', 22522, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22522),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22522%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'def7176132eb623c', 'DRA. ADRIANA', 65777, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 65777),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P65777%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'd4af5e03e110c951', 'DRA. CAMILA PINHEIRO', 10200, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10200),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10200%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '9c7319f2e28a4b9f', 'DRA. ELIZABETH SANTOS', 45999, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 45999),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P45999%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'e14ddd661a55dc58', 'DRA. ÉRICA', 11123, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 11123),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P11123%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '89c5427c7206b3bb', 'DRA. JÉSSICA FRAGA', 20300, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20300),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20300%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'c57c02e0e2a0229b', 'DRA. LAÍS LIMA', 22321, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22321),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22321%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'fcccb604720c2402', 'EDIBERTO MELO', 27123, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 27123),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P27123%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '0286d17c72329f4d', 'EDINA SOUSA', 20600, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20600),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20600%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '5727397cfdc95fa2', 'EDINEY MARCELINO', 27198, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 27198),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P27198%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'a625f3aef06687ea', 'EDNALDO SANTOS DO SINDIPOL', 20321, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20321),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20321%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '6c2f42b97f9b7a34', 'EDSON ANDRADE', 12300, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12300),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12300%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'a3e3b679527006ea', 'EDSON SANTOS', 77722, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 77722),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P77722%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '0e29ebfffd2efc50', 'EDUARDO COSTA', 55555, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 55555),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P55555%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'ae1467a6f2f6548c', 'EIMIR SOUZA', 10777, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10777),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10777%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '5f332f4bbdfff0f7', 'ELANE OLIVEIRA', 43000, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 43000),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P43000%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'b2c4ad244542fec8', 'ELBANY DO POVÃO', 43500, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 43500),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P43500%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '345d5f5ff2c84b9e', 'ELCIONE BARBALHO', 15151, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15151),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15151%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '9e8c1ca08a71a3b0', 'ELEN FERREIRA', 25255, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 25255),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P25255%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '9ff414df7492e04c', 'ELEN MELO', 45016, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 45016),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P45016%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '4c721363bcf4e4cc', 'ELIAS SANTIAGO', 13011, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 13011),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P13011%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '23e90067845f52dc', 'ELIEL FAUSTINO', 10000, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10000),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10000%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '2eb54d27b16c0042', 'ELIELTON LIRA', 12777, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12777),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12777%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '9baa093247416df6', 'ELKI DO AMAPP', 11100, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 11100),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P11100%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '974d8bd43c0d340b', 'ELTON MAIA', 20010, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20010),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20010%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '0dee9fc5bac2208b', 'ENF. ANDRÉA CARVALHO', 13103, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 13103),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P13103%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'bb3ab4e813ac84d2', 'ENFERMEIRA ALEXA SOUSA', 13888, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 13888),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P13888%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'cf5c6797a24199ea', 'ENFERMEIRO BRENO', 25192, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 25192),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P25192%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '4a4c027e4327f812', 'ERALDO PIMENTA', 15000, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15000),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15000%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '63320b8f94f8cff5', 'ERIANE XAVIER', 10410, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10410),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10410%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '710f7b5bb2d5804c', 'ERICK MONTEIRO', 15555, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15555),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15555%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'bf775ab651248634', 'ERIVELTON PEREIRA', 70120, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 70120),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P70120%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '3c85b08e3cbc7d78', 'ERLEN FARIAS', 70999, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 70999),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P70999%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '631b409203d830ad', 'EUDER LEITE', 22322, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22322),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22322%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'f8586b65e5f282e3', 'EUGENIO GADELHA', 15321, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15321),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15321%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '7e93a9d1e61082db', 'EZEQUIEL BRITO', 30007, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 30007),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P30007%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'aa410a6913a1dbbe', 'FABIO DA SAÚDE', 18000, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 18000),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P18000%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'f5a7b87de74cbd03', 'FÁBIO FIGUEIRAS', 43333, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 43333),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P43333%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'cc262c4ca8f145b9', 'FÁBIO FREITAS', 44123, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 44123),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P44123%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '2794e936a1e18daa', 'FÁBIO GÁS', 20050, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20050),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20050%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '7981c228fadc307e', 'FABRICIO MIRANDA', 20333, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20333),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20333%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '443522eae12a8513', 'FERNANDO CABANO (PROF LOBATO)', 50777, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 50777),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P50777%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '293b5ce4a59e2993', 'FERNANDO HENRIQUE', 22122, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22122),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22122%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'b39cf479d145c04c', 'FRANCISCA SOUSA', 45369, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 45369),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P45369%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'ac9754be42d0b1c4', 'GABRIEL MARISCOS E PESCADOS', 15025, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15025),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15025%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'dc5787914827466d', 'GESIEL LOPES', 12007, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12007),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12007%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '33252eb6e6a4d0f0', 'GEULIANA RUPF', 12712, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12712),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12712%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '54a9d3c43725f845', 'GIORDANA ESTRELA', 10015, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10015),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10015%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '2802933fa141a338', 'GISELLY FORELIZA', 10555, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10555),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10555%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '206c39c9b4ded57f', 'GLEISSON', 43123, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 43123),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P43123%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'e1dab5081a2e1307', 'GLENDA AMARAL', 44888, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 44888),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P44888%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '383a268c04050fc8', 'GUSTAVO SEFER', 55123, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 55123),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P55123%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '5611701bc6129f49', 'HARRISON O POBRE', 70234, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 70234),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P70234%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '254a28e834812aff', 'HILTON AGUIAR', 10789, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10789),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10789%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'cf88ed89552f96c4', 'HIPOLITO', 22100, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22100),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22100%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '5d5f886a527b6bdc', 'HUGO MACHADO', 55022, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 55022),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P55022%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'bcadb287aae301ae', 'IDAILSON TIGRE', 77222, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 77222),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P77222%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '041737f0b29ad634', 'IGOR GAIA', 12478, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12478),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12478%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '0790fa471450a4c7', 'ILZA ESTUMANO', 23123, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 23123),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P23123%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '5978bff29b8a2cbf', 'INAJÁ', 10660, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10660),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10660%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'e61d88c7335a03e3', 'IRAN LIMA', 15678, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15678),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15678%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '824de0fe0cd1d3b0', 'IRMÃ GEISA', 20025, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20025),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20025%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '53290f34722030f3', 'ISAIAS NETO', 10115, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10115),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10115%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '05c1962175049efa', 'IVONALDO OLIVEIRA', 45155, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 45155),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P45155%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'fb00728bf4d38035', 'IZIS QUARESMA', 25333, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 25333),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P25333%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '9c4ad276d2a7b780', 'JACY DA SAÚDE', 10501, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10501),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10501%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '62b91e5f74dbadeb', 'JAIME BRITO', 22190, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22190),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22190%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'f0c637b41b1eeb1e', 'JANAINA DA SAÚDE', 10111, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10111),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10111%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '789b657b30e26424', 'JÂNIO MOURA', 27888, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 27888),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P27888%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'c119aaeb84c4df3b', 'JC DO APP', 50299, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 50299),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P50299%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '6a7b77eb3ba5b8bf', 'JEAN SANTOS', 10150, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10150),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10150%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'd89c3981ec4e1259', 'JEFFERSON COUTO', 12765, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12765),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12765%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '8e221902db8c4fba', 'JEFFERSON LIMA', 22456, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22456),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22456%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '22cc128e073611d5', 'JEFFERSON PEE', 10008, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10008),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10008%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '8ca89d063a2828d0', 'JERRY ADRIANO', 22279, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22279),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22279%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '4f66ff1a69224d16', 'JG DA SUCATA', 77777, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 77777),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P77777%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '36e748f7ec1069dc', 'JK DO POVÃO', 22777, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22777),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22777%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '85f79fda26307076', 'JOANA DARC', 20550, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20550),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20550%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '33f704386286e0da', 'JOÃO COELHO', 12000, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12000),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12000%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '43717d54661c1c4a', 'JOÃO DE ANANINDEUA', 50333, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 50333),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P50333%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '9713664ab45c6cd9', 'JOÃO MACIEL', 12067, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12067),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12067%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '5fe3a52d6d8a11f2', 'JOÃO PINGARILHO', 15222, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15222),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15222%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '9342ca93f42954b1', 'JOÃO RICARDO O PATRIOTA', 20007, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20007),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20007%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'f2478af81e078c69', 'JOÃO SALAME', 20800, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20800),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20800%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '2cb8c3edc23e1cb1', 'JOAQUIM CAMPOS', 44400, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 44400),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P44400%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'b38cac6352db34d3', 'JOEL DO AÇAÍ', 20107, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20107),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20107%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'f2be781833e0f481', 'JORGE LEVY', 44144, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 44144),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P44144%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '6851d106f3fc79ba', 'JORGE PANZERA', 65123, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 65123),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P65123%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '07d435c35ef1046d', 'JOSÉ MARIA', 70444, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 70444),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P70444%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '4abc3fb9d83ea081', 'JOSUÉ CARDOSO', 45033, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 45033),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P45033%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '858b1fdbc2966938', 'JOSUÉ PAIVA', 70500, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 70500),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P70500%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '58b15506baca923e', 'JUÁ PARÁ', 10123, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10123),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10123%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'ab7f7bc43b45c1ac', 'JUNIOR DA SAÚDE', 70123, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 70123),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P70123%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '82c111dbc0259d5a', 'JUNIOR DO MACRE', 10010, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10010),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10010%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'ee0f32fbf8bfce54', 'JUNIOR DO REGIONAL', 50713, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 50713),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P50713%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '8fd828c54b748a10', 'KADU JARDIM', 12700, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12700),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12700%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'f44d34aae39f9d3a', 'KAIO AGRO', 20020, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20020),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20020%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'f41008154ecff87e', 'KARYNE CARDOSO', 18957, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 18957),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P18957%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '690e96b3478bb748', 'KLEBESON RODRIGUES', 30077, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 30077),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P30077%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '2d75811249ee39d2', 'LANE PINHEIRO', 20150, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20150),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20150%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '692569e85fe0337f', 'LANUZIA CUNHA', 22022, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22022),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22022%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '8808f0e267987587', 'LARANJEIRA ALÔ COMUNIDADE PARÁ', 77773, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 77773),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P77773%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '97788431281656a8', 'LEANDRO MARAMALDO', 22444, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22444),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22444%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'c534a9ab87f74f33', 'LEILIANI CABRAL', 70111, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 70111),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P70111%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '2cb16315299bdb80', 'LENE LIMA', 45899, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 45899),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P45899%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'cef27abe46fc8b78', 'LEONARDO VALE', 55777, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 55777),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P55777%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '970baf2dc26afa99', 'LEONÍSIO LOPES', 12543, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12543),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12543%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '0fb4ebca1a382321', 'LETICIA GARIMPEIRA', 22321, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22321),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22321%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '9aa75863db337bdc', 'LÍVIA DUARTE', 50123, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 50123),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P50123%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'f7a896358abf29cd', 'LUCÉLIA FARIAS', 12112, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12112),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12112%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'f52c9190334779d7', 'LUIZ DAMIÃO', 27321, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 27321),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P27321%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '9c516418ea258850', 'LUIZ LEÃO', 13555, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 13555),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P13555%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '631ff7fee8538378', 'LUIZA BUENO', 70567, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 70567),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P70567%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'e6b7f9b0e02ee228', 'LUTH REBELO', 11222, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 11222),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P11222%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '6818dd0f9b2884dd', 'LUZIVALDO VIERA', 45444, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 45444),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P45444%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '000aaaea208b1597', 'MACARRÃO', 15007, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15007),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15007%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '88e235a726a9d166', 'MACIEL FARIAS', 30111, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 30111),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P30111%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '09c462963c99dfa8', 'MÃE VANDA', 13600, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 13600),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P13600%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '6b32e74965be2e38', 'MAIA JUNIOR', 20400, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20400),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20400%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'd9b753dea22106ff', 'MAKLEY FIDO', 10001, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10001),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10001%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '88cedbfc77d228fd', 'MANELZINHO', 20789, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20789),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20789%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '37841913378c60a1', 'MARCELA COLARES', 22345, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22345),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22345%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '4b415cc4752547e6', 'MARCELO LIMA', 27001, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 27001),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P27001%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '31102b1c260e7950', 'MÁRCIA MOREIRA', 13298, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 13298),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P13298%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '7bb1708354066e95', 'MARCOS BRAZÃO', 13200, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 13200),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P13200%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '54dc1080965f3619', 'MARCOS COSTA-COLETIVO UNIDADE', 13222, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 13222),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P13222%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'bdde12da51a26626', 'MARCOS JOBSON', 80000, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 80000),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P80000%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'b953ae99d5e12bb0', 'MARCOS SENA', 22789, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22789),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22789%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '7da6d73905527236', 'MARI CLAUDIA', 22163, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22163),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22163%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'df310edeed1ec503', 'MARIA', 13123, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 13123),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P13123%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '8462ddc5dbfe8f62', 'MARIA MARTINHA', 30012, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 30012),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P30012%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '5e4382ca7adf61b9', 'MARIA SANTOS', 80180, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 80180),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P80180%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'fcb694ba725f3bd8', 'MARIANA MAIA', 27351, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 27351),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P27351%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '57f5c8b9e26784f7', 'MARINHO DA CUNHA', 70007, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 70007),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P70007%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '4a7697f4f8907774', 'MARINOR BRITO', 50555, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 50555),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P50555%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '30ac34ffc5d232dc', 'MARIZA ALMEIDA', 22111, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22111),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22111%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '4bed2b56400a2f52', 'MARLENE CORDOVIL', 12120, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12120),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12120%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '418d0f1236ccf8b7', 'MARTINHO CARMONA', 15456, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15456),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15456%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '8e417af2fc2edee7', 'MAX DE JESUS', 43222, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 43222),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P43222%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '1d173ff287eb2978', 'MAX DO KARATÊ', 50562, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 50562),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P50562%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'd023ca511cf8fac6', 'MAYARA SOUZA', 10007, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10007),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10007%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'db37a561163a740f', 'MAYKY VILAÇA', 22000, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22000),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22000%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '1db028b4550075ab', 'MAYZA CARDOSO', 22400, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22400),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22400%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '34ca4e4e4df603f1', 'MAZINHO SALOMÃO', 10333, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10333),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10333%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'ea9f5d6a758e3c8e', 'MAZIO BANDEIRA', 22230, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22230),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22230%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '94dbd4063db6b64d', 'MIRO SANOVA', 13789, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 13789),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P13789%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '170402ef9aca0b6f', 'MISERICORDIA FARIAS', 70333, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 70333),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P70333%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '9b5920ab1e060869', 'MOISEIS MEDEIROS DE FARIAS', 30085, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 30085),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P30085%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'e696dec56437bbce', 'NALDO NUNES', 10444, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10444),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10444%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'af3dbd13d3a1cf83', 'NARCISA MELO', 45123, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 45123),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P45123%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '54e724ae32cd2969', 'NAY BARBALHO', 70100, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 70100),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P70100%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '2302c01a9bc24496', 'NEGA LINDA', 10025, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10025),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10025%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '746dce3e6697c48e', 'NEIA LEITE', 44000, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 44000),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P44000%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '519bece411f9243b', 'NÉLIO AGUIAR', 44222, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 44222),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P44222%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '721193e1a38fa5a7', 'NELMA MASSAGISTA', 12650, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12650),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12650%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '636a15b2dbbb32cd', 'NENDER BATISTA', 23456, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 23456),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P23456%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '99b538257a1fd160', 'NENEM ALBUQUERQUE', 15777, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15777),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15777%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'd04da1419ac27e13', 'NEYLA BRAGA', 30000, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 30000),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P30000%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '99264b43550aa87e', 'NIK PILOTO', 12800, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12800),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12800%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '7590b1b62f5bc4f4', 'NIL ARMSTRONG', 22300, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22300),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22300%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '4c25c90ee3f49996', 'NIL FERREIRA', 22007, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22007),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22007%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'b8c570719f721405', 'NILO NORONHA', 22077, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22077),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22077%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'dd2c8b80a662b521', 'NOEMI GONÇALVES', 13456, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 13456),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P13456%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '2ccdd1abfe37f2f5', 'NOEMI VIANA', 20700, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20700),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20700%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '7b7163fd45c78c07', 'NORMANDO RIACHÃO', 13115, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 13115),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P13115%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '06062a39eb9fc506', 'NÚBIA RIBEIRO', 77113, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 77113),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P77113%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '7d1898a27f8f4baf', 'O E PAIAKAN', 55111, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 55111),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P55111%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '5c7291dc6943fcd4', 'ODILEIDA SAMPAIO', 22245, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22245),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22245%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '26647af1d1dd43e2', 'ORLANDO LOBATO', 12123, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12123),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12123%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '3531908421d8c58b', 'PABLO DO MST', 13700, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 13700),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P13700%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '67cfa52e19228569', 'PAJÉ MOTOTÁXI', 12115, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12115),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12115%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '76a1d1f8f6c417c2', 'PAMELA CAROLINE', 44230, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 44230),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P44230%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'cb4a4ce769228fa1', 'PAOLA ABUCATER', 55678, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 55678),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P55678%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'e44f0e54008ecbe3', 'PARÁ PAULINO', 20000, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20000),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20000%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '2c75678fe3bb52e8', 'PASTOR LUIS', 22678, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22678),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22678%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '55d43f1f833ed715', 'PASTOR RUDSON', 33444, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 33444),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P33444%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'a986b2cf798f8505', 'PATRICIA PERDIGÃO', 20320, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20320),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20320%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '92ce670b75a022af', 'PAULA BEZERRA', 20202, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20202),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20202%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '09a0562248d8efcd', 'PAULA TITAN', 11777, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 11777),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P11777%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '3cb478fca93bd7fd', 'PAULINHO', 11111, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 11111),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P11111%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'd395ace26989c880', 'PAULO CAGADO', 77666, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 77666),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P77666%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'ae1cb03df294b924', 'PAULO CASTELO BRANCO', 70456, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 70456),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P70456%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '452328578bf8b84e', 'PAULO HENRIQUE', 70777, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 70777),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P70777%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'ac81539c7af118a4', 'PAULO PAIVA', 15181, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15181),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15181%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '1e4eb0a041828b31', 'PAULO QUADROS', 20444, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20444),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20444%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '0245f38bd01b7493', 'PEDRO BARRA', 22700, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22700),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22700%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '7a96a11060a57952', 'PEDRO COELHO', 20022, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20022),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20022%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '82757753cb3a0908', 'PIU GIBSON', 10500, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10500),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10500%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'f7cfcd742bb85478', 'PR. ADÃO AZEVEDO', 44234, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 44234),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P44234%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '7da176477b0a7240', 'PR. HELIO GOMES', 20279, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20279),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20279%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '5852213590f79fb7', 'PR. JUNIOR BRAGA', 30123, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 30123),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P30123%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '2f262fa0564c486d', 'PR. JÚNIOR SANTOS', 55222, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 55222),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P55222%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '22e84bd10666fb4b', 'PRA ANA PAULA LIMA', 44678, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 44678),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P44678%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '20e66d9cf618a2b5', 'PRA. DEUCLAS', 30045, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 30045),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P30045%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'ae789ee06007dedd', 'PRETO SILVA', 43150, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 43150),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P43150%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '8a60001f94605f98', 'PRI CORDEIRO', 44567, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 44567),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P44567%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '049c997e0871585d', 'PROF MARCELO MATHIAS', 10321, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10321),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10321%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '06af3238fb0ed1a0', 'PROF SALOMÃO REIS', 70466, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 70466),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P70466%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '1c552d0a52bb8190', 'PROF. MARCOS', 44555, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 44555),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P44555%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'a0136ac18fb82c83', 'PROF. SERGIO MENEZES', 10567, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10567),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10567%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '2f3579da52600097', 'PROFESSOR AUGUSTO CEZAR', 50100, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 50100),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P50100%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'd20dc2df7f900892', 'PROFESSOR EDSON JR', 13613, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 13613),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P13613%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '4f2ca34399317ebd', 'PROFESSOR MÁRCIO PONTE', 12222, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12222),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12222%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '829aaf0eba843516', 'PROFESSOR OSMAR HOLANDA', 70122, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 70122),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P70122%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'fba898fa35fe8210', 'PROFESSOR RAIMUNDO SOUSA', 77888, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 77888),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P77888%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '8c2f1253a687faa6', 'PROFESSOR VINICIO', 13131, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 13131),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P13131%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '9b1b66c4d7bc9cf0', 'PROFESSORA ANA', 12888, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12888),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12888%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '3275acd19d67e840', 'PROFESSORA CONCEIÇÃO LIMA', 22227, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22227),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22227%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '47301fce13c3cc38', 'PROFESSORA HELENILZA', 20456, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20456),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20456%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'e9d4c795a4f672ee', 'PROFESSORA NÚBIA CORRÊA', 12020, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12020),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12020%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '3b9eee4ce75d00a3', 'PROFESSORA SHIRLEY', 10222, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10222),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10222%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'd1246dd4fdbe9f81', 'PUYR TEMBÉ', 70678, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 70678),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P70678%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'cbcd31c31a2c5b97', 'RAFAEL RIBEIRO', 55900, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 55900),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P55900%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '368582b1baee1c9a', 'RAILANY ALENCAR', 50010, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 50010),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P50010%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'a14f5cbef3f613eb', 'RAIMUNDÃO', 15015, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15015),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15015%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '8d96a7e22fbe19c3', 'RAQUEL DO VATAPÁ', 12999, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12999),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12999%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '2911ef3f6c3480ff', 'RAQUEL DOS ANIMAIS', 12121, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12121),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12121%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '1490f4ebb60eb35f', 'RAY DIESEL', 13001, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 13001),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P13001%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '7f693f5c4617c4d5', 'RAYSSA LIMA', 22123, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22123),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22123%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '31e21ec010c0b1e2', 'RENATA FONSECA', 22333, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22333),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22333%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'efa1ffc395122e69', 'RENATA NOVAES', 10009, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10009),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10009%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'b5a920958547c0df', 'RENATO  NEVES', 30003, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 30003),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P30003%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'a548c17945f54669', 'RENATO OLIVEIRA', 70000, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 70000),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P70000%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'ea4194f8b65df609', 'REX A LENDA', 70345, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 70345),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P70345%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'e052773c74fc24f6', 'RICARDO CAVALCANTE', 45054, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 45054),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P45054%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '7c557b35b76a7772', 'RICARDO FRENTE POPULAR', 13133, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 13133),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P13133%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'b61964ad309efd98', 'RICARDO OLIVEIRA', 27777, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 27777),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P27777%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'ca26a08cae739779', 'RICHARD MALHEIROS', 30022, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 30022),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P30022%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '4a9c7657365fb251', 'RICHES FORÇA E HONRA', 10212, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10212),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10212%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'fea2220eed753578', 'RILDO PESSOA', 13321, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 13321),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P13321%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '91c2af9f0e7b9b6f', 'RITA CASTRO', 55524, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 55524),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P55524%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '93a4b00bab1e81d6', 'ROBERTO FREIRE', 44345, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 44345),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P44345%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '4d90718f89cf7d9a', 'RODRIGO CUNHA', 12345, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12345),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12345%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'b605eb2b0938e573', 'RONIE SILVA', 15111, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15111),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15111%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '87c282fec0d7ed3d', 'ROSANGELA COHEN', 22221, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22221),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22221%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '1b5ec76d3d5a7fea', 'ROSE DO MERCADO', 13009, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 13009),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P13009%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'fb4e46c5c59e94f8', 'ROSI ANGÉLICA ASSIST. SOCIAL', 13113, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 13113),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P13113%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '2cef9d90c379faf4', 'RUI BEGOT', 20222, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20222),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20222%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '0360b08f45c1479f', 'RUI MORAES', 10125, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10125),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10125%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'e224f41f660a6ed2', 'RUY PINTO', 70070, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 70070),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P70070%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'a8efb54d43fd6c53', 'S.O.S.URGENTE', 55999, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 55999),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P55999%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'beaddd1c8b37b6f1', 'SAMUEL LEAL', 10192, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10192),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10192%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'ab7c08940a45228f', 'SARGENTO ANA CLEIDE', 44190, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 44190),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P44190%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'b72b6182d61cef1f', 'SARGENTO DENILSON MORAES', 30190, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 30190),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P30190%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '43b204be049f0933', 'SARGENTO ELIS SANTOS', 44456, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 44456),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P44456%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'ea83938fbe8fffed', 'SARGENTO LUCIANO SILVA', 30121, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 30121),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P30121%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '27cbdf2c6c24dfc4', 'SARGENTO NETO', 55190, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 55190),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P55190%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'dff63862e795e9b9', 'SARGENTO SIDNEY BARATA', 22231, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22231),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22231%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'd4ff1b53f20e86b4', 'SÁVIO BARBOSA', 12012, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12012),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12012%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'f60914b2212a2bea', 'SEBASTIAN', 12567, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12567),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12567%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '06b585cae8aa0052', 'SERGIO GUIMARAES', 70220, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 70220),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P70220%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'f4f866f3b8a199d1', 'SÉRNIO VASCONCELOS', 18456, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 18456),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P18456%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '91af4af95d32a722', 'SGT BRANCHES', 44700, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 44700),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P44700%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '92b78c8bb954b46c', 'SGTO INGRID', 15180, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15180),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15180%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '228452bd38d42818', 'SILVIA BAÊTA', 13100, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 13100),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P13100%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '23f5176acea56c6f', 'SILVIA HELENA', 45888, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 45888),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P45888%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '4478df5e23097cb2', 'SILVIA SAMPAIO', 10147, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10147),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10147%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '2110a08f6c77c3ad', 'SILVIA VITORIA', 33733, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 33733),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P33733%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '881f9015bbe98d70', 'SILVIO DO TERRAÇO HOTEL', 30222, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 30222),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P30222%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '12e9ae704a681f89', 'SIMONE CAVALCANTE', 50051, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 50051),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P50051%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '6af2ea3d1f912ed2', 'SOCORRO GOMES', 16123, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 16123),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P16123%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'ef8dc3f5296dd962', 'SOLDADO TERCIO', 20100, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20100),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20100%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '8985888f008948bc', 'STEPHANIE LIMA', 20220, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20220),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20220%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'c12acad72bc307b0', 'SUEIDY PENA', 77300, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 77300),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P77300%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '6d640808178800d2', 'SUZIANE NEGA', 18123, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 18123),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P18123%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '33cfa2815986a07a', 'TATI BARRA', 22555, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22555),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22555%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '3241f08ec19dd077', 'TATIANE HELENA', 55888, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 55888),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P55888%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '1f3f6b544367e327', 'TELMA SARAIVA', 13300, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 13300),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P13300%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'fdad0325733f265d', 'TENETE CORONEL JANDYR', 27499, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 27499),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P27499%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'e9a4285d7e56642a', 'TEÓLOGO JC', 12899, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12899),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12899%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'dcbb48fe0315e8e5', 'THIAGO ARAUJO', 44333, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 44333),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P44333%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '8f1f5d4592d67b81', 'THIAGO LUCAS', 10871, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10871),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10871%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '4195509395ec5dd4', 'TIAGO DO CONSUMIDOR', 77712, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 77712),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P77712%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '784e2b7fb2eb349f', 'TOMÁS BELLUCI', 12707, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12707),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12707%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '9ee223c4c66f8423', 'TONHÃO DO LEÃO', 15333, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15333),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15333%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '6f383013d5f5706f', 'TONYNHO SANTOS', 44499, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 44499),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P44499%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '6470aa7493a9dabf', 'TORRINHO TORRES', 10234, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10234),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10234%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '54c61b82d4471a61', 'TOTÓ', 20001, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20001),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20001%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '9dd08984bb0a2b80', 'UZIEL MONTEIRO', 18777, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 18777),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P18777%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '36c3699816b6f598', 'VALMIR CLIMACO', 15163, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15163),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15163%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '2de402fbb29b0c6c', 'VANIA LIMA', 45555, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 45555),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P45555%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'a25ab728c1f457ab', 'VANUZA QUILOMBOLA', 18789, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 18789),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P18789%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '159e7388843e0a51', 'VICTOR DIAS', 44444, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 44444),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P44444%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '6d97431335496391', 'VINICIUS PEDROSA', 12900, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 12900),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P12900%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '7c882c0c84a18682', 'VITOR SUSTENTARE', 18555, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 18555),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P18555%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'f9a28d1a66c4a334', 'VITÓRIA HESKETH', 55500, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 55500),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P55500%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '024acc38dea1e4c8', 'WAGNER MILLER', 10110, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10110),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10110%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '835e5c0f8a4fc711', 'WALL MONTEIRO', 23777, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 23777),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P23777%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '1849fe2b92557b20', 'WANDENKOLK GONÇALVES', 10122, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 10122),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P10122%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '21fb60d60f6dc1b0', 'WATANABE', 15115, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15115),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15115%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'e2afb9b7f00ef518', 'WELTON PIMENTA', 30015, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 30015),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P30015%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '9c66afb7e54e9f04', 'WENDE TEMBÉ', 77456, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 77456),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P77456%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '93daad54054d5e96', 'WESCLEY TOMAZ', 70200, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 70200),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P70200%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '300ff8e1666594d4', 'WILLIAN DO POTÊNCIA', 44300, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 44300),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P44300%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'dfc473b741cba54a', 'WLADIMIR VIANA', 13111, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 13111),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P13111%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '7dbd560686a75c92', 'YORANN COSTA', 20110, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 20110),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P20110%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '5ebe5d46cf9724cc', 'ZÉ FERNANDES', 13603, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 13603),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P13603%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '88f0bd30798fffa7', 'ZÉ GERALDO', 13500, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 13500),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P13500%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT '68fd0ee748fe4dab', 'ZÉ RAIMUNDO', 77000, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 77000),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P77000%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'f7769afd7d675e5c', 'ZECA PIRÃO', 15150, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 15150),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P15150%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
INSERT INTO "Candidato" (id, nome, numero, cargoId, partidoId, eleito) 
    SELECT 'e983dcc805c218ff', 'ZEZINHO SANTOS', 22212, 
           (SELECT id FROM "Cargo" WHERE nome = 'Deputado Federal' LIMIT 1),
           COALESCE((SELECT id FROM "Partido" WHERE numero = 22212),
                    (SELECT id FROM "Partido" WHERE sigla LIKE 'P22212%' LIMIT 1))
    WHERE EXISTS (SELECT 1 FROM "Cargo" WHERE nome = 'Deputado Federal');
