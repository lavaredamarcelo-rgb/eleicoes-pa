-- Índice para consultas de votos por município (tela Votos por Município,
-- mapas e comparativos). Sem ele, cada consulta varre a tabela Resultado
-- inteira (~438 mil linhas), o que no volume do Railway leva muitos segundos.
CREATE INDEX IF NOT EXISTS "Resultado_municipioId_turno_idx" ON "Resultado"("municipioId", "turno");
