-- Varredura 23/10: Vox, Datafolha (1pp!), Real Time, Alfa e Indexa.
DELETE FROM "PesquisaResultado" WHERE pesquisaId LIKE 'pqs15-%';
DELETE FROM "PesquisaEleitoral" WHERE id LIKE 'pqs15-%';

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs15-01', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Vox', NULL, '2026-10-20 00:00:00', '2026-10-22 00:00:00', '2026-10-22 00:00:00', 2100, 2.15, 95, 'Votos totais. Lula à frente (+1,1pp) — Vox segue na contramão. Divulgada 23/10. Data exibida = fim do campo. Carga automática 23/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs15-01-r0', 'pqs15-01', 'Flávio Bolsonaro', 'PL', 44.3, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs15-01-r1', 'pqs15-01', 'Lula', 'PT', 45.4, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs15-01-r2', 'pqs15-01', 'Indecisos/Brancos/Nulos', NULL, 10.3, 2);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs15-02', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Datafolha', NULL, '2026-10-20 00:00:00', '2026-10-22 00:00:00', '2026-10-22 00:00:00', 2520, 2.0, 95, 'Votos totais. APERTOU: 1pp (era 2pp na rodada anterior). Divulgada 22/10. Data exibida = fim do campo. Carga automática 23/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs15-02-r0', 'pqs15-02', 'Flávio Bolsonaro', 'PL', 47, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs15-02-r1', 'pqs15-02', 'Lula', 'PT', 46, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs15-02-r2', 'pqs15-02', 'Indecisos/Brancos/Nulos', NULL, 7, 2);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs15-03', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Real Time Big Data', NULL, '2026-10-19 00:00:00', '2026-10-22 00:00:00', '2026-10-22 00:00:00', 2000, 2.0, 95, 'Votos totais. Divulgada 23/10. Data exibida = fim do campo. Carga automática 23/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs15-03-r0', 'pqs15-03', 'Flávio Bolsonaro', 'PL', 49, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs15-03-r1', 'pqs15-03', 'Lula', 'PT', 45, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs15-03-r2', 'pqs15-03', 'Indecisos/Brancos/Nulos', NULL, 6, 2);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs15-04', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Alfa Inteligência', NULL, '2026-10-18 00:00:00', '2026-10-22 00:00:00', '2026-10-22 00:00:00', 2700, 1.9, 95, 'Votos VÁLIDOS. Divulgada 23/10. Data exibida = fim do campo. Carga automática 23/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs15-04-r0', 'pqs15-04', 'Flávio Bolsonaro', 'PL', 52, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs15-04-r1', 'pqs15-04', 'Lula', 'PT', 48, 1);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs15-05', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Indexa/Broadcast', NULL, '2026-10-20 00:00:00', '2026-10-21 00:00:00', '2026-10-21 00:00:00', 2000, 2.19, 95, 'Votos totais. 1,1pp. Divulgada 22/10. Data exibida = fim do campo. Carga automática 23/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs15-05-r0', 'pqs15-05', 'Flávio Bolsonaro', 'PL', 45.2, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs15-05-r1', 'pqs15-05', 'Lula', 'PT', 44.1, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs15-05-r2', 'pqs15-05', 'Indecisos/Brancos/Nulos', NULL, 10.7, 2);
