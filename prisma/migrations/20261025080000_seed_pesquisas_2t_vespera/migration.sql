-- VESPERA do 2o turno (varredura 25/10): 14 pesquisas finais.
-- Sete em ~1pp; Colectta pro-Lula; maiores amostras pro-Flavio.
DELETE FROM "PesquisaResultado" WHERE pesquisaId LIKE 'pqs16-%';
DELETE FROM "PesquisaEleitoral" WHERE id LIKE 'pqs16-%';

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs16-01', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'PoderData/Aya', NULL, '2026-10-23 00:00:00', '2026-10-24 00:00:00', '2026-10-24 00:00:00', 4000, 1.6, 95, 'FINAL. Votos VÁLIDOS. Votos conforme divulgação. Data exibida = fim do campo. Carga automática 25/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-01-r0', 'pqs16-01', 'Flávio Bolsonaro', 'PL', 51, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-01-r1', 'pqs16-01', 'Lula', 'PT', 49, 1);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs16-02', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Datafolha', NULL, '2026-10-23 00:00:00', '2026-10-24 00:00:00', '2026-10-24 00:00:00', 4050, 2.0, 95, 'FINAL. 1pp. Votos conforme divulgação. Data exibida = fim do campo. Carga automática 25/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-02-r0', 'pqs16-02', 'Flávio Bolsonaro', 'PL', 48, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-02-r1', 'pqs16-02', 'Lula', 'PT', 47, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-02-r2', 'pqs16-02', 'Indecisos/Brancos/Nulos', NULL, 5, 2);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs16-03', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Genial/Quaest', NULL, '2026-10-23 00:00:00', '2026-10-24 00:00:00', '2026-10-24 00:00:00', 3702, 2.0, 95, 'FINAL. 1pp. Votos conforme divulgação. Data exibida = fim do campo. Carga automática 25/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-03-r0', 'pqs16-03', 'Flávio Bolsonaro', 'PL', 46, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-03-r1', 'pqs16-03', 'Lula', 'PT', 45, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-03-r2', 'pqs16-03', 'Indecisos/Brancos/Nulos', NULL, 9, 2);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs16-04', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Nexus/BTG', NULL, '2026-10-23 00:00:00', '2026-10-24 00:00:00', '2026-10-24 00:00:00', 2000, 2.0, 95, 'FINAL. 1pp. Votos conforme divulgação. Data exibida = fim do campo. Carga automática 25/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-04-r0', 'pqs16-04', 'Flávio Bolsonaro', 'PL', 47, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-04-r1', 'pqs16-04', 'Lula', 'PT', 46, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-04-r2', 'pqs16-04', 'Indecisos/Brancos/Nulos', NULL, 7, 2);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs16-05', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Palver', NULL, '2026-10-22 00:00:00', '2026-10-24 00:00:00', '2026-10-24 00:00:00', 5000, 3.0, 95, 'FINAL. 1pp. Votos conforme divulgação. Data exibida = fim do campo. Carga automática 25/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-05-r0', 'pqs16-05', 'Flávio Bolsonaro', 'PL', 50, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-05-r1', 'pqs16-05', 'Lula', 'PT', 49, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-05-r2', 'pqs16-05', 'Indecisos/Brancos/Nulos', NULL, 1, 2);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs16-06', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Gerp', NULL, '2026-10-22 00:00:00', '2026-10-24 00:00:00', '2026-10-24 00:00:00', 2400, 2.04, 95, 'FINAL. 3pp. Votos conforme divulgação. Data exibida = fim do campo. Carga automática 25/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-06-r0', 'pqs16-06', 'Flávio Bolsonaro', 'PL', 49, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-06-r1', 'pqs16-06', 'Lula', 'PT', 46, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-06-r2', 'pqs16-06', 'Indecisos/Brancos/Nulos', NULL, 4, 2);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs16-07', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Futura', NULL, '2026-10-23 00:00:00', '2026-10-24 00:00:00', '2026-10-24 00:00:00', 2000, 2.2, 95, 'FINAL. 0,3pp — a mais apertada de toda a série. Votos conforme divulgação. Data exibida = fim do campo. Carga automática 25/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-07-r0', 'pqs16-07', 'Flávio Bolsonaro', 'PL', 48.2, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-07-r1', 'pqs16-07', 'Lula', 'PT', 47.9, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-07-r2', 'pqs16-07', 'Indecisos/Brancos/Nulos', NULL, 3.9, 2);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs16-08', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Colectta', NULL, '2026-10-23 00:00:00', '2026-10-23 00:00:00', '2026-10-23 00:00:00', 3000, 2.0, 95, 'ÚNICA da véspera com Lula numericamente à frente (0,5pp). Votos conforme divulgação. Data exibida = fim do campo. Carga automática 25/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-08-r0', 'pqs16-08', 'Flávio Bolsonaro', 'PL', 46, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-08-r1', 'pqs16-08', 'Lula', 'PT', 46.5, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-08-r2', 'pqs16-08', 'Indecisos/Brancos/Nulos', NULL, 7.5, 2);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs16-09', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'CNT/MDA', NULL, '2026-10-21 00:00:00', '2026-10-23 00:00:00', '2026-10-23 00:00:00', 2002, 2.2, 95, '1,3pp. Votos conforme divulgação. Data exibida = fim do campo. Carga automática 25/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-09-r0', 'pqs16-09', 'Flávio Bolsonaro', 'PL', 46.3, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-09-r1', 'pqs16-09', 'Lula', 'PT', 45, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-09-r2', 'pqs16-09', 'Indecisos/Brancos/Nulos', NULL, 8.7, 2);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs16-10', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'França', NULL, '2026-10-21 00:00:00', '2026-10-23 00:00:00', '2026-10-23 00:00:00', 1537, 2.5, 95, '2,5pp. Votos conforme divulgação. Data exibida = fim do campo. Carga automática 25/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-10-r0', 'pqs16-10', 'Flávio Bolsonaro', 'PL', 45.6, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-10-r1', 'pqs16-10', 'Lula', 'PT', 43.1, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-10-r2', 'pqs16-10', 'Indecisos/Brancos/Nulos', NULL, 11.3, 2);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs16-11', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Vetor Arrow', NULL, '2026-10-22 00:00:00', '2026-10-23 00:00:00', '2026-10-23 00:00:00', 6867, 1.2, 95, 'Maior vantagem da véspera (5,1pp). Votos conforme divulgação. Data exibida = fim do campo. Carga automática 25/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-11-r0', 'pqs16-11', 'Flávio Bolsonaro', 'PL', 50, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-11-r1', 'pqs16-11', 'Lula', 'PT', 44.9, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-11-r2', 'pqs16-11', 'Indecisos/Brancos/Nulos', NULL, 5.1, 2);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs16-12', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Veritá', NULL, '2026-10-19 00:00:00', '2026-10-23 00:00:00', '2026-10-23 00:00:00', 15554, 1.0, 95, 'FINAL, maior amostra do 2T (15.554). 2,7pp. Votos conforme divulgação. Data exibida = fim do campo. Carga automática 25/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-12-r0', 'pqs16-12', 'Flávio Bolsonaro', 'PL', 50.2, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-12-r1', 'pqs16-12', 'Lula', 'PT', 47.5, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-12-r2', 'pqs16-12', 'Indecisos/Brancos/Nulos', NULL, 2.3, 2);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs16-13', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'AtlasIntel', NULL, '2026-10-18 00:00:00', '2026-10-23 00:00:00', '2026-10-23 00:00:00', 4990, 1.0, 95, 'FINAL. 1,5pp. Votos conforme divulgação. Data exibida = fim do campo. Carga automática 25/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-13-r0', 'pqs16-13', 'Flávio Bolsonaro', 'PL', 49.9, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-13-r1', 'pqs16-13', 'Lula', 'PT', 48.4, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-13-r2', 'pqs16-13', 'Indecisos/Brancos/Nulos', NULL, 1.7, 2);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs16-14', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Ipespe', NULL, '2026-10-20 00:00:00', '2026-10-22 00:00:00', '2026-10-22 00:00:00', 1500, 2.6, 95, '1pp. Votos conforme divulgação. Data exibida = fim do campo. Carga automática 25/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-14-r0', 'pqs16-14', 'Flávio Bolsonaro', 'PL', 48, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-14-r1', 'pqs16-14', 'Lula', 'PT', 47, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs16-14-r2', 'pqs16-14', 'Indecisos/Brancos/Nulos', NULL, 5, 2);
