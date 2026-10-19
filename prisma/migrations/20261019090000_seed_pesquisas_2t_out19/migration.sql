-- Varredura 19/10: 8 pesquisas do fim de semana. Apos o empate de 16/10,
-- Flavio reabriu leve vantagem (1-4pp), com BTG/Futura em quase-empate e
-- Vox pro-Lula. Convencao: data exibida = fim do campo. Idempotente.
DELETE FROM "PesquisaResultado" WHERE pesquisaId LIKE 'pqs12-%';
DELETE FROM "PesquisaEleitoral" WHERE id LIKE 'pqs12-%';

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs12-01', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'PoderData/Aya', NULL, '2026-10-16 00:00:00', '2026-10-18 00:00:00', '2026-10-18 00:00:00', 3000, 1.8, 95, 'Votos VÁLIDOS. Flávio reabriu 4pp após o empate 50x50. Divulgada 19/10. Data exibida = fim do campo. Carga automática 19/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs12-01-r0', 'pqs12-01', 'Flávio Bolsonaro', 'PL', 52, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs12-01-r1', 'pqs12-01', 'Lula', 'PT', 48, 1);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs12-02', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Nexus/BTG', NULL, '2026-10-16 00:00:00', '2026-10-18 00:00:00', '2026-10-18 00:00:00', 2000, 2.0, 95, 'Votos totais. Diferença de 0,6pp — empate técnico. Divulgada 19/10. Data exibida = fim do campo. Carga automática 19/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs12-02-r0', 'pqs12-02', 'Flávio Bolsonaro', 'PL', 46.5, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs12-02-r1', 'pqs12-02', 'Lula', 'PT', 45.9, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs12-02-r2', 'pqs12-02', 'Indecisos/Brancos/Nulos', NULL, 7.6, 2);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs12-03', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'AtlasIntel', NULL, '2026-10-13 00:00:00', '2026-10-18 00:00:00', '2026-10-18 00:00:00', 4998, 1.0, 95, 'Votos totais. Divulgada 19/10. Data exibida = fim do campo. Carga automática 19/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs12-03-r0', 'pqs12-03', 'Flávio Bolsonaro', 'PL', 49.8, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs12-03-r1', 'pqs12-03', 'Lula', 'PT', 47.7, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs12-03-r2', 'pqs12-03', 'Indecisos/Brancos/Nulos', NULL, 2.6, 2);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs12-04', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Futura', NULL, '2026-10-16 00:00:00', '2026-10-17 00:00:00', '2026-10-17 00:00:00', 2000, 2.2, 95, 'Votos VÁLIDOS. 0,8pp — empate técnico. Divulgada 19/10. Data exibida = fim do campo. Carga automática 19/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs12-04-r0', 'pqs12-04', 'Flávio Bolsonaro', 'PL', 50.4, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs12-04-r1', 'pqs12-04', 'Lula', 'PT', 49.6, 1);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs12-05', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Vox', NULL, '2026-10-15 00:00:00', '2026-10-17 00:00:00', '2026-10-17 00:00:00', 2100, 2.15, 95, 'Votos totais. ÚNICA com Lula à frente (+1,8pp) — Vox segue na contramão. Divulgada 18/10. Data exibida = fim do campo. Carga automática 19/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs12-05-r0', 'pqs12-05', 'Flávio Bolsonaro', 'PL', 44.6, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs12-05-r1', 'pqs12-05', 'Lula', 'PT', 46.4, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs12-05-r2', 'pqs12-05', 'Indecisos/Brancos/Nulos', NULL, 8.9, 2);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs12-06', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Gerp', NULL, '2026-10-14 00:00:00', '2026-10-16 00:00:00', '2026-10-16 00:00:00', 2400, 2.0, 95, 'Votos totais. Maior vantagem da rodada (5pp). Divulgada 17/10. Data exibida = fim do campo. Carga automática 19/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs12-06-r0', 'pqs12-06', 'Flávio Bolsonaro', 'PL', 50, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs12-06-r1', 'pqs12-06', 'Lula', 'PT', 45, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs12-06-r2', 'pqs12-06', 'Indecisos/Brancos/Nulos', NULL, 5, 2);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs12-07', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Veritá', NULL, '2026-10-12 00:00:00', '2026-10-16 00:00:00', '2026-10-16 00:00:00', 15554, 1.0, 95, 'Votos VÁLIDOS. MAIOR AMOSTRA do 2º turno (15.554). Divulgada 17/10. Data exibida = fim do campo. Carga automática 19/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs12-07-r0', 'pqs12-07', 'Flávio Bolsonaro', 'PL', 51.1, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs12-07-r1', 'pqs12-07', 'Lula', 'PT', 48.9, 1);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs12-08', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Futura', NULL, '2026-10-14 00:00:00', '2026-10-15 00:00:00', '2026-10-15 00:00:00', 2000, 2.2, 95, 'Votos totais. Divulgada 16/10. Data exibida = fim do campo. Carga automática 19/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs12-08-r0', 'pqs12-08', 'Flávio Bolsonaro', 'PL', 49, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs12-08-r1', 'pqs12-08', 'Lula', 'PT', 47.5, 1);
