-- Varredura 20/10: IFP, Alfa Inteligencia e Real Time Big Data.
-- Flavio na frente nas tres (1,3 a 4pp). Convencao: data exibida =
-- fim do campo. Idempotente.
DELETE FROM "PesquisaResultado" WHERE pesquisaId LIKE 'pqs13-%';
DELETE FROM "PesquisaEleitoral" WHERE id LIKE 'pqs13-%';

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs13-01', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'IFP', 'BR-07896/2026', '2026-10-16 00:00:00', '2026-10-20 00:00:00', '2026-10-20 00:00:00', 3000, 1.8, 95, 'Votos totais com INDECISOS ALTÍSSIMOS (19,4%) — por isso os percentuais baixos. Diferença de 1,3pp. Data exibida = fim do campo. Carga automática 20/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs13-01-r0', 'pqs13-01', 'Flávio Bolsonaro', 'PL', 40.95, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs13-01-r1', 'pqs13-01', 'Lula', 'PT', 39.65, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs13-01-r2', 'pqs13-01', 'Indecisos/Brancos/Nulos', NULL, 19.4, 2);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs13-02', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Alfa Inteligência', 'BR-00820/2026', '2026-10-15 00:00:00', '2026-10-19 00:00:00', '2026-10-19 00:00:00', 2700, 1.9, 95, 'Votos totais. Divulgada 20/10. Data exibida = fim do campo. Carga automática 20/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs13-02-r0', 'pqs13-02', 'Flávio Bolsonaro', 'PL', 48.8, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs13-02-r1', 'pqs13-02', 'Lula', 'PT', 45.9, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs13-02-r2', 'pqs13-02', 'Indecisos/Brancos/Nulos', NULL, 5.3, 2);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs13-03', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Real Time Big Data', 'BR-02952/2026', '2026-10-15 00:00:00', '2026-10-19 00:00:00', '2026-10-19 00:00:00', 2000, 2.0, 95, 'Votos totais. Divulgada 20/10. Data exibida = fim do campo. Carga automática 20/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs13-03-r0', 'pqs13-03', 'Flávio Bolsonaro', 'PL', 47, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs13-03-r1', 'pqs13-03', 'Lula', 'PT', 44, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs13-03-r2', 'pqs13-03', 'Indecisos/Brancos/Nulos', NULL, 9, 2);
