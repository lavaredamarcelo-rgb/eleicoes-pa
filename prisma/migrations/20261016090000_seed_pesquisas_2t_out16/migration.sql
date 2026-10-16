-- Varredura 16/10: 6 pesquisas novas do 2o turno (a corrida FECHOU:
-- de 4-6pp para 0-2pp; PoderData de 16/10 da EMPATE 50x50 nos validos).
-- Fonte: Wikipedia/tabela 2T + materias Poder360/g1/UOL/SBT/Gazeta.
-- Convencao: data exibida = fim do campo. Idempotente.
DELETE FROM "PesquisaResultado" WHERE pesquisaId LIKE 'pqs11-%';
DELETE FROM "PesquisaEleitoral" WHERE id LIKE 'pqs11-%';

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs11-01', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'PoderData/Aya', NULL, '2026-10-13 00:00:00', '2026-10-15 00:00:00', '2026-10-15 00:00:00', 3000, 1.8, 95, 'EMPATE 50x50 em votos VÁLIDOS — Lula reagiu (rodada anterior 49x51). Divulgada 16/10. Data exibida = fim do campo. Carga automática 16/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs11-01-r0', 'pqs11-01', 'Flávio Bolsonaro', 'PL', 50, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs11-01-r1', 'pqs11-01', 'Lula', 'PT', 50, 1);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs11-02', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Datafolha', NULL, '2026-10-13 00:00:00', '2026-10-15 00:00:00', '2026-10-15 00:00:00', 2520, 2.0, 95, 'Votos TOTAIS. Vantagem caiu de 4pp para 2pp (empate técnico). Data exibida = fim do campo. Carga automática 16/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs11-02-r0', 'pqs11-02', 'Flávio Bolsonaro', 'PL', 47, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs11-02-r1', 'pqs11-02', 'Lula', 'PT', 45, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs11-02-r2', 'pqs11-02', 'Indecisos/Brancos/Nulos', NULL, 8, 2);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs11-03', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Indexa/Broadcast', NULL, '2026-10-13 00:00:00', '2026-10-14 00:00:00', '2026-10-14 00:00:00', 2000, 2.2, 95, 'Votos TOTAIS (indecisos altos: 14%). Empate técnico. Data exibida = fim do campo. Carga automática 16/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs11-03-r0', 'pqs11-03', 'Flávio Bolsonaro', 'PL', 44, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs11-03-r1', 'pqs11-03', 'Lula', 'PT', 42, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs11-03-r2', 'pqs11-03', 'Indecisos/Brancos/Nulos', NULL, 14, 2);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs11-04', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Palver', NULL, '2026-10-10 00:00:00', '2026-10-13 00:00:00', '2026-10-13 00:00:00', 5000, 2.3, 95, 'Votos totais (1% indecisos). Diferença de 1pp — empate técnico. Divulgada 15/10. Data exibida = fim do campo. Carga automática 16/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs11-04-r0', 'pqs11-04', 'Flávio Bolsonaro', 'PL', 50, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs11-04-r1', 'pqs11-04', 'Lula', 'PT', 49, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs11-04-r2', 'pqs11-04', 'Indecisos/Brancos/Nulos', NULL, 1, 2);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs11-05', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Genial/Quaest', NULL, '2026-10-10 00:00:00', '2026-10-13 00:00:00', '2026-10-13 00:00:00', 2154, 2.0, 95, 'Votos TOTAIS. Empate técnico (2pp). Divulgada 14/10. Data exibida = fim do campo. Carga automática 16/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs11-05-r0', 'pqs11-05', 'Flávio Bolsonaro', 'PL', 46, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs11-05-r1', 'pqs11-05', 'Lula', 'PT', 44, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs11-05-r2', 'pqs11-05', 'Indecisos/Brancos/Nulos', NULL, 10, 2);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs11-06', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'PoderData/Aya', NULL, '2026-10-10 00:00:00', '2026-10-12 00:00:00', '2026-10-12 00:00:00', 3000, 1.8, 95, 'Votos VÁLIDOS. Lula encostando (49x51; antes 47x53). Divulgada 13/10. Data exibida = fim do campo. Carga automática 16/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs11-06-r0', 'pqs11-06', 'Flávio Bolsonaro', 'PL', 51, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs11-06-r1', 'pqs11-06', 'Lula', 'PT', 49, 1);
