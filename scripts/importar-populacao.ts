import "server-only";
import { prisma } from "@/lib/prisma";

// Busca a população residente do Censo 2022 (IBGE, agregado 4709, variável
// 93) para todos os municípios do Pará (UF 15) e grava em Municipio.populacao,
// casando pelo código IBGE de 7 dígitos.
const URL =
  "https://servicodados.ibge.gov.br/api/v3/agregados/4709/periodos/2022/variaveis/93?localidades=N6[N3[15]]";

async function main() {
  const resp = await fetch(URL);
  if (!resp.ok) throw new Error(`IBGE respondeu ${resp.status}`);
  const dados = (await resp.json()) as {
    resultados: { series: { localidade: { id: string; nome: string }; serie: Record<string, string> }[] }[];
  }[];
  const series = dados[0].resultados[0].series;
  console.log(`IBGE retornou ${series.length} municípios.`);

  let atualizados = 0;
  const naoEncontrados: string[] = [];
  for (const s of series) {
    const populacao = Number(s.serie["2022"]);
    if (!Number.isFinite(populacao)) continue;
    const municipio = await prisma.municipio.findUnique({
      where: { codigoIbge: s.localidade.id },
    });
    if (!municipio) {
      naoEncontrados.push(s.localidade.nome);
      continue;
    }
    await prisma.municipio.update({ where: { id: municipio.id }, data: { populacao } });
    atualizados++;
  }

  console.log(`Municípios atualizados: ${atualizados}`);
  if (naoEncontrados.length > 0) {
    console.log(`Sem correspondência no banco: ${naoEncontrados.join(", ")}`);
  }
  const soma = await prisma.municipio.aggregate({ _sum: { populacao: true } });
  console.log(`População total do PA (Censo 2022): ${soma._sum.populacao?.toLocaleString("pt-BR")}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
