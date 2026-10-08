-- 1a pesquisa do 2o turno presidencial pos-1o turno: PoderData/Aya.
-- Fontes: Poder360 e CNN Brasil, 08/10/2026. Idempotente.
DELETE FROM "PesquisaResultado" WHERE pesquisaId LIKE 'pqs10-%';
DELETE FROM "PesquisaEleitoral" WHERE id LIKE 'pqs10-%';

INSERT INTO "PesquisaEleitoral" (id, disputa, turno, tipo, cenario, instituto, contratante, registroTSE, dataCampoInicio, dataCampoFim, dataDivulgacao, amostra, margemErro, confianca, observacoes, createdAt, updatedAt) VALUES ('pqs10-01', 'Presidente', 2, 'estimulada', 'Lula x Flávio Bolsonaro', 'PoderData/Aya', 'PoderData (recursos próprios)', 'BR-08134/2026', '2026-10-05 00:00:00', '2026-10-07 00:00:00', '2026-10-08 00:00:00', 3000, 1.8, 95, 'PRIMEIRA pesquisa após o 1º turno. Percentuais em VOTOS VÁLIDOS. 705 municípios, 27 UFs, telefone/URA. Rejeição: Flávio 43 × Lula 46. Carga automática 08/10/2026.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs10-01-r0', 'pqs10-01', 'Flávio Bolsonaro', 'PL', 53, 0);
INSERT INTO "PesquisaResultado" (id, pesquisaId, nome, partido, percentual, ordem) VALUES ('pqs10-01-r1', 'pqs10-01', 'Lula', 'PT', 47, 1);
