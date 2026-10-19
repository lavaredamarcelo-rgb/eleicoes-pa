-- FEFC 2026: distribuicao oficial do fundo eleitoral por partido
-- (TSE, 03/06/2026; total R$ 4.961.519.777,00). Partido ausente e
-- criado pela sigla. Idempotente.
DELETE FROM "PartidoFundo" WHERE ano = 2026 AND tipo = 'FEFC';

INSERT INTO "Partido" (id, sigla, nome, numero) SELECT 'partfefc-agir', 'AGIR', 'AGIR', 36 WHERE NOT EXISTS (SELECT 1 FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('AGIR', ' ', '')));
INSERT INTO "PartidoFundo" (id, partidoId, ano, tipo, valor, fonte) SELECT 'fefc26-agir', (SELECT MIN(id) FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('AGIR', ' ', ''))), 2026, 'FEFC', 3307679.85, 'TSE, 03/06/2026 — distribuição oficial do FEFC (tse.jus.br/comunicacao/noticias/2026/Junho)';

INSERT INTO "Partido" (id, sigla, nome, numero) SELECT 'partfefc-avante', 'AVANTE', 'AVANTE', 70 WHERE NOT EXISTS (SELECT 1 FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('AVANTE', ' ', '')));
INSERT INTO "PartidoFundo" (id, partidoId, ano, tipo, valor, fonte) SELECT 'fefc26-avante', (SELECT MIN(id) FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('AVANTE', ' ', ''))), 2026, 'FEFC', 72516777.19, 'TSE, 03/06/2026 — distribuição oficial do FEFC (tse.jus.br/comunicacao/noticias/2026/Junho)';

INSERT INTO "Partido" (id, sigla, nome, numero) SELECT 'partfefc-cidadania', 'CIDADANIA', 'CIDADANIA', 23 WHERE NOT EXISTS (SELECT 1 FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('CIDADANIA', ' ', '')));
INSERT INTO "PartidoFundo" (id, partidoId, ano, tipo, valor, fonte) SELECT 'fefc26-cidadania', (SELECT MIN(id) FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('CIDADANIA', ' ', ''))), 2026, 'FEFC', 60174157.13, 'TSE, 03/06/2026 — distribuição oficial do FEFC (tse.jus.br/comunicacao/noticias/2026/Junho)';

INSERT INTO "Partido" (id, sigla, nome, numero) SELECT 'partfefc-dc', 'DC', 'DC', 27 WHERE NOT EXISTS (SELECT 1 FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('DC', ' ', '')));
INSERT INTO "PartidoFundo" (id, partidoId, ano, tipo, valor, fonte) SELECT 'fefc26-dc', (SELECT MIN(id) FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('DC', ' ', ''))), 2026, 'FEFC', 3307679.85, 'TSE, 03/06/2026 — distribuição oficial do FEFC (tse.jus.br/comunicacao/noticias/2026/Junho)';

INSERT INTO "Partido" (id, sigla, nome, numero) SELECT 'partfefc-democrata', 'DEMOCRATA', 'DEMOCRATA', 35 WHERE NOT EXISTS (SELECT 1 FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('DEMOCRATA', ' ', '')));
INSERT INTO "PartidoFundo" (id, partidoId, ano, tipo, valor, fonte) SELECT 'fefc26-democrata', (SELECT MIN(id) FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('DEMOCRATA', ' ', ''))), 2026, 'FEFC', 3307679.85, 'TSE, 03/06/2026 — distribuição oficial do FEFC (tse.jus.br/comunicacao/noticias/2026/Junho)';

INSERT INTO "Partido" (id, sigla, nome, numero) SELECT 'partfefc-mdb', 'MDB', 'MDB', 15 WHERE NOT EXISTS (SELECT 1 FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('MDB', ' ', '')));
INSERT INTO "PartidoFundo" (id, partidoId, ano, tipo, valor, fonte) SELECT 'fefc26-mdb', (SELECT MIN(id) FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('MDB', ' ', ''))), 2026, 'FEFC', 400000239.99, 'TSE, 03/06/2026 — distribuição oficial do FEFC (tse.jus.br/comunicacao/noticias/2026/Junho)';

INSERT INTO "Partido" (id, sigla, nome, numero) SELECT 'partfefc-missao', 'MISSÃO', 'MISSÃO', 0 WHERE NOT EXISTS (SELECT 1 FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('MISSÃO', ' ', '')));
INSERT INTO "PartidoFundo" (id, partidoId, ano, tipo, valor, fonte) SELECT 'fefc26-missao', (SELECT MIN(id) FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('MISSÃO', ' ', ''))), 2026, 'FEFC', 3307679.85, 'TSE, 03/06/2026 — distribuição oficial do FEFC (tse.jus.br/comunicacao/noticias/2026/Junho)';

INSERT INTO "Partido" (id, sigla, nome, numero) SELECT 'partfefc-mobiliza', 'MOBILIZA', 'MOBILIZA', 33 WHERE NOT EXISTS (SELECT 1 FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('MOBILIZA', ' ', '')));
INSERT INTO "PartidoFundo" (id, partidoId, ano, tipo, valor, fonte) SELECT 'fefc26-mobiliza', (SELECT MIN(id) FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('MOBILIZA', ' ', ''))), 2026, 'FEFC', 3307679.85, 'TSE, 03/06/2026 — distribuição oficial do FEFC (tse.jus.br/comunicacao/noticias/2026/Junho)';

INSERT INTO "Partido" (id, sigla, nome, numero) SELECT 'partfefc-novo', 'NOVO', 'NOVO', 30 WHERE NOT EXISTS (SELECT 1 FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('NOVO', ' ', '')));
INSERT INTO "PartidoFundo" (id, partidoId, ano, tipo, valor, fonte) SELECT 'fefc26-novo', (SELECT MIN(id) FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('NOVO', ' ', ''))), 2026, 'FEFC', 37044203.26, 'TSE, 03/06/2026 — distribuição oficial do FEFC (tse.jus.br/comunicacao/noticias/2026/Junho)';

INSERT INTO "Partido" (id, sigla, nome, numero) SELECT 'partfefc-pcdob', 'PC do B', 'PC do B', 65 WHERE NOT EXISTS (SELECT 1 FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('PC do B', ' ', '')));
INSERT INTO "PartidoFundo" (id, partidoId, ano, tipo, valor, fonte) SELECT 'fefc26-pcdob', (SELECT MIN(id) FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('PC do B', ' ', ''))), 2026, 'FEFC', 60531914.25, 'TSE, 03/06/2026 — distribuição oficial do FEFC (tse.jus.br/comunicacao/noticias/2026/Junho)';

INSERT INTO "Partido" (id, sigla, nome, numero) SELECT 'partfefc-pcb', 'PCB', 'PCB', 21 WHERE NOT EXISTS (SELECT 1 FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('PCB', ' ', '')));
INSERT INTO "PartidoFundo" (id, partidoId, ano, tipo, valor, fonte) SELECT 'fefc26-pcb', (SELECT MIN(id) FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('PCB', ' ', ''))), 2026, 'FEFC', 3307679.85, 'TSE, 03/06/2026 — distribuição oficial do FEFC (tse.jus.br/comunicacao/noticias/2026/Junho)';

INSERT INTO "Partido" (id, sigla, nome, numero) SELECT 'partfefc-pco', 'PCO', 'PCO', 29 WHERE NOT EXISTS (SELECT 1 FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('PCO', ' ', '')));
INSERT INTO "PartidoFundo" (id, partidoId, ano, tipo, valor, fonte) SELECT 'fefc26-pco', (SELECT MIN(id) FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('PCO', ' ', ''))), 2026, 'FEFC', 3307679.85, 'TSE, 03/06/2026 — distribuição oficial do FEFC (tse.jus.br/comunicacao/noticias/2026/Junho)';

INSERT INTO "Partido" (id, sigla, nome, numero) SELECT 'partfefc-pdt', 'PDT', 'PDT', 12 WHERE NOT EXISTS (SELECT 1 FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('PDT', ' ', '')));
INSERT INTO "PartidoFundo" (id, partidoId, ano, tipo, valor, fonte) SELECT 'fefc26-pdt', (SELECT MIN(id) FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('PDT', ' ', ''))), 2026, 'FEFC', 169285643.92, 'TSE, 03/06/2026 — distribuição oficial do FEFC (tse.jus.br/comunicacao/noticias/2026/Junho)';

INSERT INTO "Partido" (id, sigla, nome, numero) SELECT 'partfefc-pl', 'PL', 'PL', 22 WHERE NOT EXISTS (SELECT 1 FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('PL', ' ', '')));
INSERT INTO "PartidoFundo" (id, partidoId, ano, tipo, valor, fonte) SELECT 'fefc26-pl', (SELECT MIN(id) FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('PL', ' ', ''))), 2026, 'FEFC', 881657477.34, 'TSE, 03/06/2026 — distribuição oficial do FEFC (tse.jus.br/comunicacao/noticias/2026/Junho)';

INSERT INTO "Partido" (id, sigla, nome, numero) SELECT 'partfefc-pode', 'PODE', 'PODE', 20 WHERE NOT EXISTS (SELECT 1 FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('PODE', ' ', '')));
INSERT INTO "PartidoFundo" (id, partidoId, ano, tipo, valor, fonte) SELECT 'fefc26-pode', (SELECT MIN(id) FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('PODE', ' ', ''))), 2026, 'FEFC', 245969763.68, 'TSE, 03/06/2026 — distribuição oficial do FEFC (tse.jus.br/comunicacao/noticias/2026/Junho)';

INSERT INTO "Partido" (id, sigla, nome, numero) SELECT 'partfefc-pp', 'PP', 'PP', 11 WHERE NOT EXISTS (SELECT 1 FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('PP', ' ', '')));
INSERT INTO "PartidoFundo" (id, partidoId, ano, tipo, valor, fonte) SELECT 'fefc26-pp', (SELECT MIN(id) FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('PP', ' ', ''))), 2026, 'FEFC', 417067738.4, 'TSE, 03/06/2026 — distribuição oficial do FEFC (tse.jus.br/comunicacao/noticias/2026/Junho)';

INSERT INTO "Partido" (id, sigla, nome, numero) SELECT 'partfefc-prd', 'PRD', 'PRD', 25 WHERE NOT EXISTS (SELECT 1 FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('PRD', ' ', '')));
INSERT INTO "PartidoFundo" (id, partidoId, ano, tipo, valor, fonte) SELECT 'fefc26-prd', (SELECT MIN(id) FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('PRD', ' ', ''))), 2026, 'FEFC', 71819227.37, 'TSE, 03/06/2026 — distribuição oficial do FEFC (tse.jus.br/comunicacao/noticias/2026/Junho)';

INSERT INTO "Partido" (id, sigla, nome, numero) SELECT 'partfefc-prtb', 'PRTB', 'PRTB', 28 WHERE NOT EXISTS (SELECT 1 FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('PRTB', ' ', '')));
INSERT INTO "PartidoFundo" (id, partidoId, ano, tipo, valor, fonte) SELECT 'fefc26-prtb', (SELECT MIN(id) FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('PRTB', ' ', ''))), 2026, 'FEFC', 3307679.85, 'TSE, 03/06/2026 — distribuição oficial do FEFC (tse.jus.br/comunicacao/noticias/2026/Junho)';

INSERT INTO "Partido" (id, sigla, nome, numero) SELECT 'partfefc-psb', 'PSB', 'PSB', 40 WHERE NOT EXISTS (SELECT 1 FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('PSB', ' ', '')));
INSERT INTO "PartidoFundo" (id, partidoId, ano, tipo, valor, fonte) SELECT 'fefc26-psb', (SELECT MIN(id) FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('PSB', ' ', ''))), 2026, 'FEFC', 152252956.07, 'TSE, 03/06/2026 — distribuição oficial do FEFC (tse.jus.br/comunicacao/noticias/2026/Junho)';

INSERT INTO "Partido" (id, sigla, nome, numero) SELECT 'partfefc-psd', 'PSD', 'PSD', 55 WHERE NOT EXISTS (SELECT 1 FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('PSD', ' ', '')));
INSERT INTO "PartidoFundo" (id, partidoId, ano, tipo, valor, fonte) SELECT 'fefc26-psd', (SELECT MIN(id) FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('PSD', ' ', ''))), 2026, 'FEFC', 421008404.89, 'TSE, 03/06/2026 — distribuição oficial do FEFC (tse.jus.br/comunicacao/noticias/2026/Junho)';

INSERT INTO "Partido" (id, sigla, nome, numero) SELECT 'partfefc-psdb', 'PSDB', 'PSDB', 45 WHERE NOT EXISTS (SELECT 1 FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('PSDB', ' ', '')));
INSERT INTO "PartidoFundo" (id, partidoId, ano, tipo, valor, fonte) SELECT 'fefc26-psdb', (SELECT MIN(id) FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('PSDB', ' ', ''))), 2026, 'FEFC', 147895172.4, 'TSE, 03/06/2026 — distribuição oficial do FEFC (tse.jus.br/comunicacao/noticias/2026/Junho)';

INSERT INTO "Partido" (id, sigla, nome, numero) SELECT 'partfefc-psol', 'PSOL', 'PSOL', 50 WHERE NOT EXISTS (SELECT 1 FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('PSOL', ' ', '')));
INSERT INTO "PartidoFundo" (id, partidoId, ano, tipo, valor, fonte) SELECT 'fefc26-psol', (SELECT MIN(id) FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('PSOL', ' ', ''))), 2026, 'FEFC', 131506284.42, 'TSE, 03/06/2026 — distribuição oficial do FEFC (tse.jus.br/comunicacao/noticias/2026/Junho)';

INSERT INTO "Partido" (id, sigla, nome, numero) SELECT 'partfefc-pstu', 'PSTU', 'PSTU', 16 WHERE NOT EXISTS (SELECT 1 FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('PSTU', ' ', '')));
INSERT INTO "PartidoFundo" (id, partidoId, ano, tipo, valor, fonte) SELECT 'fefc26-pstu', (SELECT MIN(id) FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('PSTU', ' ', ''))), 2026, 'FEFC', 3307679.85, 'TSE, 03/06/2026 — distribuição oficial do FEFC (tse.jus.br/comunicacao/noticias/2026/Junho)';

INSERT INTO "Partido" (id, sigla, nome, numero) SELECT 'partfefc-pt', 'PT', 'PT', 13 WHERE NOT EXISTS (SELECT 1 FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('PT', ' ', '')));
INSERT INTO "PartidoFundo" (id, partidoId, ano, tipo, valor, fonte) SELECT 'fefc26-pt', (SELECT MIN(id) FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('PT', ' ', ''))), 2026, 'FEFC', 615367980.2, 'TSE, 03/06/2026 — distribuição oficial do FEFC (tse.jus.br/comunicacao/noticias/2026/Junho)';

INSERT INTO "Partido" (id, sigla, nome, numero) SELECT 'partfefc-pv', 'PV', 'PV', 43 WHERE NOT EXISTS (SELECT 1 FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('PV', ' ', '')));
INSERT INTO "PartidoFundo" (id, partidoId, ano, tipo, valor, fonte) SELECT 'fefc26-pv', (SELECT MIN(id) FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('PV', ' ', ''))), 2026, 'FEFC', 45183873.26, 'TSE, 03/06/2026 — distribuição oficial do FEFC (tse.jus.br/comunicacao/noticias/2026/Junho)';

INSERT INTO "Partido" (id, sigla, nome, numero) SELECT 'partfefc-rede', 'REDE', 'REDE', 18 WHERE NOT EXISTS (SELECT 1 FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('REDE', ' ', '')));
INSERT INTO "PartidoFundo" (id, partidoId, ano, tipo, valor, fonte) SELECT 'fefc26-rede', (SELECT MIN(id) FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('REDE', ' ', ''))), 2026, 'FEFC', 35803821.03, 'TSE, 03/06/2026 — distribuição oficial do FEFC (tse.jus.br/comunicacao/noticias/2026/Junho)';

INSERT INTO "Partido" (id, sigla, nome, numero) SELECT 'partfefc-republicanos', 'REPUBLICANOS', 'REPUBLICANOS', 10 WHERE NOT EXISTS (SELECT 1 FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('REPUBLICANOS', ' ', '')));
INSERT INTO "PartidoFundo" (id, partidoId, ano, tipo, valor, fonte) SELECT 'fefc26-republicanos', (SELECT MIN(id) FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('REPUBLICANOS', ' ', ''))), 2026, 'FEFC', 348587815.77, 'TSE, 03/06/2026 — distribuição oficial do FEFC (tse.jus.br/comunicacao/noticias/2026/Junho)';

INSERT INTO "Partido" (id, sigla, nome, numero) SELECT 'partfefc-solidariedade', 'SOLIDARIEDADE', 'SOLIDARIEDADE', 77 WHERE NOT EXISTS (SELECT 1 FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('SOLIDARIEDADE', ' ', '')));
INSERT INTO "PartidoFundo" (id, partidoId, ano, tipo, valor, fonte) SELECT 'fefc26-solidariedade', (SELECT MIN(id) FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('SOLIDARIEDADE', ' ', ''))), 2026, 'FEFC', 88526669.83, 'TSE, 03/06/2026 — distribuição oficial do FEFC (tse.jus.br/comunicacao/noticias/2026/Junho)';

INSERT INTO "Partido" (id, sigla, nome, numero) SELECT 'partfefc-uniao', 'UNIÃO', 'UNIÃO', 44 WHERE NOT EXISTS (SELECT 1 FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('UNIÃO', ' ', '')));
INSERT INTO "PartidoFundo" (id, partidoId, ano, tipo, valor, fonte) SELECT 'fefc26-uniao', (SELECT MIN(id) FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('UNIÃO', ' ', ''))), 2026, 'FEFC', 526242858.11, 'TSE, 03/06/2026 — distribuição oficial do FEFC (tse.jus.br/comunicacao/noticias/2026/Junho)';

INSERT INTO "Partido" (id, sigla, nome, numero) SELECT 'partfefc-up', 'UP', 'UP', 80 WHERE NOT EXISTS (SELECT 1 FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('UP', ' ', '')));
INSERT INTO "PartidoFundo" (id, partidoId, ano, tipo, valor, fonte) SELECT 'fefc26-up', (SELECT MIN(id) FROM Partido WHERE UPPER(REPLACE(sigla, ' ', '')) = UPPER(REPLACE('UP', ' ', ''))), 2026, 'FEFC', 3307679.85, 'TSE, 03/06/2026 — distribuição oficial do FEFC (tse.jus.br/comunicacao/noticias/2026/Junho)';
