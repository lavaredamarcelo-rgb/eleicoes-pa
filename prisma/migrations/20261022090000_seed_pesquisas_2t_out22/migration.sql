-- Varredura 22/10: 6 novas (so institutos; agregadores de imprensa fora).
-- Convencao: data exibida = fim do campo. Idempotente.
DELETE FROM "PesquisaResultado" WHERE pesquisaId LIKE 'pqs14-%';
DELETE FROM "PesquisaEleitoral" WHERE id LIKE 'pqs14-%';

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs14-01', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'PoderData/Aya', NULL, '2026-10-19 00:00:00', '2026-10-21 00:00:00', '2026-10-21 00:00:00', 4000, 1.6, 95, 'Votos VÁLIDOS. Divulgada 22/10. Data exibida = fim do campo. Carga automática 22/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs14-01-r0', 'pqs14-01', 'Flávio Bolsonaro', 'PL', 51, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs14-01-r1', 'pqs14-01', 'Lula', 'PT', 49, 1);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs14-02', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Futura', NULL, '2026-10-19 00:00:00', '2026-10-20 00:00:00', '2026-10-20 00:00:00', 2000, 2.2, 95, 'Votos totais. Divulgada 21/10. Data exibida = fim do campo. Carga automática 22/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs14-02-r0', 'pqs14-02', 'Flávio Bolsonaro', 'PL', 48.9, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs14-02-r1', 'pqs14-02', 'Lula', 'PT', 46.8, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs14-02-r2', 'pqs14-02', 'Indecisos/Brancos/Nulos', NULL, 4.3, 2);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs14-03', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Palver', NULL, '2026-10-18 00:00:00', '2026-10-20 00:00:00', '2026-10-20 00:00:00', 5000, 2.4, 95, 'Votos totais. Divulgada 21/10. Data exibida = fim do campo. Carga automática 22/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs14-03-r0', 'pqs14-03', 'Flávio Bolsonaro', 'PL', 50, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs14-03-r1', 'pqs14-03', 'Lula', 'PT', 48, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs14-03-r2', 'pqs14-03', 'Indecisos/Brancos/Nulos', NULL, 2, 2);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs14-04', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Genial/Quaest', NULL, '2026-10-17 00:00:00', '2026-10-20 00:00:00', '2026-10-20 00:00:00', 2154, 2.0, 95, 'Votos totais. DIFERENÇA DE 1PP — a mais apertada da reta final. Divulgada 21/10. Data exibida = fim do campo. Carga automática 22/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs14-04-r0', 'pqs14-04', 'Flávio Bolsonaro', 'PL', 45, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs14-04-r1', 'pqs14-04', 'Lula', 'PT', 44, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs14-04-r2', 'pqs14-04', 'Indecisos/Brancos/Nulos', NULL, 9, 2);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs14-05', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Gerp', NULL, '2026-10-17 00:00:00', '2026-10-20 00:00:00', '2026-10-20 00:00:00', 2400, 2.04, 95, 'Votos totais. Maior vantagem da rodada (5pp). Divulgada 21/10. Data exibida = fim do campo. Carga automática 22/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs14-05-r0', 'pqs14-05', 'Flávio Bolsonaro', 'PL', 50, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs14-05-r1', 'pqs14-05', 'Lula', 'PT', 45, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs14-05-r2', 'pqs14-05', 'Indecisos/Brancos/Nulos', NULL, 4, 2);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs14-06', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Meio/Ideia', NULL, '2026-10-15 00:00:00', '2026-10-19 00:00:00', '2026-10-19 00:00:00', 1500, 2.5, 95, 'Votos totais. Divulgada 21/10. Data exibida = fim do campo. Carga automática 22/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs14-06-r0', 'pqs14-06', 'Flávio Bolsonaro', 'PL', 48, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs14-06-r1', 'pqs14-06', 'Lula', 'PT', 46, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs14-06-r2', 'pqs14-06', 'Indecisos/Brancos/Nulos', NULL, 6, 2);
