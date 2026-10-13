-- Varredura 13/10: 6 pesquisas novas do 2o turno presidencial
-- (Lula x Flavio Bolsonaro). Fonte: Wikipedia (tabela do 2o turno),
-- percentuais conforme divulgacao de cada instituto. Convencao: data
-- exibida = fim do campo. Idempotente.
DELETE FROM "PesquisaResultado" WHERE pesquisaId LIKE 'pqs10-0%' AND pesquisaId != 'pqs10-01' AND pesquisaId NOT LIKE 'pqs10-01-%';
DELETE FROM "PesquisaEleitoral" WHERE id LIKE 'pqs10-0%' AND id != 'pqs10-01';

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs10-02', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'BTG/Nexus', NULL, '2026-10-10 00:00:00', '2026-10-12 00:00:00', '2026-10-12 00:00:00', 2000, 2.0, 95, 'Votos TOTAIS. Data exibida = fim do campo. Carga automática 13/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs10-02-r0', 'pqs10-02', 'Flávio Bolsonaro', 'PL', 48, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs10-02-r1', 'pqs10-02', 'Lula', 'PT', 45, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs10-02-r2', 'pqs10-02', 'Indecisos/Brancos/Nulos', NULL, 7, 2);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs10-03', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'DataTrends', NULL, '2026-10-07 00:00:00', '2026-10-09 00:00:00', '2026-10-09 00:00:00', 2000, 2.19, 95, 'Votos VÁLIDOS. Data exibida = fim do campo. Carga automática 13/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs10-03-r0', 'pqs10-03', 'Flávio Bolsonaro', 'PL', 53.1, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs10-03-r1', 'pqs10-03', 'Lula', 'PT', 46.9, 1);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs10-04', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Ipespe', NULL, '2026-10-06 00:00:00', '2026-10-08 00:00:00', '2026-10-08 00:00:00', 1500, 2.6, 95, 'Votos VÁLIDOS. 1ª Ipespe do 2º turno. Data exibida = fim do campo. Carga automática 13/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs10-04-r0', 'pqs10-04', 'Flávio Bolsonaro', 'PL', 52.7, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs10-04-r1', 'pqs10-04', 'Lula', 'PT', 47.3, 1);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs10-05', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Datafolha', NULL, '2026-10-06 00:00:00', '2026-10-08 00:00:00', '2026-10-08 00:00:00', 2520, 2.0, 95, 'Votos TOTAIS. 1ª Datafolha do 2º turno. Data exibida = fim do campo. Carga automática 13/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs10-05-r0', 'pqs10-05', 'Flávio Bolsonaro', 'PL', 49, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs10-05-r1', 'pqs10-05', 'Lula', 'PT', 45, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs10-05-r2', 'pqs10-05', 'Indecisos/Brancos/Nulos', NULL, 6, 2);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs10-06', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'AtlasIntel', NULL, '2026-10-03 00:00:00', '2026-10-08 00:00:00', '2026-10-08 00:00:00', 5026, 1.0, 95, 'Votos totais (indecisos 3,2%). Data exibida = fim do campo. Carga automática 13/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs10-06-r0', 'pqs10-06', 'Flávio Bolsonaro', 'PL', 51.1, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs10-06-r1', 'pqs10-06', 'Lula', 'PT', 45.7, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs10-06-r2', 'pqs10-06', 'Indecisos/Brancos/Nulos', NULL, 3.2, 2);

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs10-07', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'Vox', NULL, '2026-10-05 00:00:00', '2026-10-07 00:00:00', '2026-10-07 00:00:00', 2100, 2.0, 95, 'Votos TOTAIS. ÚNICA com Lula à frente nesta rodada (empate técnico). Data exibida = fim do campo. Carga automática 13/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs10-07-r0', 'pqs10-07', 'Lula', 'PT', 44.2, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs10-07-r1', 'pqs10-07', 'Flávio Bolsonaro', 'PL', 42.7, 1);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs10-07-r2', 'pqs10-07', 'Indecisos/Brancos/Nulos', NULL, 13.1, 2);
