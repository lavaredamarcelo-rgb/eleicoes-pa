// Preenche a ficha IBGE dos municípios: área territorial (Censo 2022,
// agregado 4714/variável 6318), gentílico, ano de criação e um resumo do
// histórico (API da biblioteca do IBGE Cidades). Idempotente — pode ser
// reexecutado; sobrescreve os campos com o que o IBGE retornar.
//
// Uso: npx tsx -r dotenv/config scripts/importar-historia.ts
import { prisma } from "../src/lib/prisma";

const UA = { "User-Agent": "eleicoes-pa/1.0", Accept: "application/json" };

async function areasPA(): Promise<Map<string, number>> {
  const url =
    "https://servicodados.ibge.gov.br/api/v3/agregados/4714/periodos/2022/variaveis/6318?localidades=N6[N3[15]]";
  const resp = await fetch(url, { headers: UA });
  if (!resp.ok) throw new Error(`IBGE agregados respondeu ${resp.status}`);
  const dados = (await resp.json()) as {
    resultados: { series: { localidade: { id: string }; serie: Record<string, string> }[] }[];
  }[];
  const mapa = new Map<string, number>();
  for (const s of dados[0].resultados[0].series) {
    const valor = Number(s.serie["2022"]);
    if (Number.isFinite(valor)) mapa.set(s.localidade.id, valor);
  }
  return mapa;
}

function limparTexto(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

// Resumo: frases inteiras do início do histórico, até ~500 caracteres.
function resumir(texto: string, limite = 500) {
  if (texto.length <= limite) return texto;
  const frases = texto.match(/[^.!?]+[.!?]+/g) ?? [texto];
  let resumo = "";
  for (const f of frases) {
    if (resumo.length + f.length > limite) break;
    resumo += f;
  }
  return (resumo || texto.slice(0, limite)).trim();
}

// Ano de criação: data em que foi "elevado à categoria de município" na
// formação administrativa; senão instalação, elevação a vila ou a primeira
// data que aparecer. Datas vêm como dd-mm-aaaa ou dd/mm/aaaa, muitas vezes
// depois de "Lei n.º 5.708," (com pontos no meio), daí o .{0,250}?.
function extrairAnoCriacao(formacao: string): number | null {
  const DATA = "(\\d{1,2})[-/](\\d{1,2})[-/](\\d{4})";
  const padroes = [
    new RegExp(`[Ee]levad[oa] à categoria de munic[íi]pio.{0,250}?${DATA}`, "s"),
    new RegExp(`[Ii]nstalad[oa] em ${DATA}`),
    new RegExp(`[Ee]levad[oa] à categoria de vila.{0,250}?${DATA}`, "s"),
    new RegExp(DATA),
  ];
  for (const re of padroes) {
    const m = formacao.match(re);
    if (m) return Number(m[3]);
  }
  const soAno = formacao.match(/\b(1[5-9]\d{2}|20\d{2})\b/);
  return soAno ? Number(soAno[1]) : null;
}

async function fichaBiblioteca(codmun: string) {
  const url = `https://servicodados.ibge.gov.br/api/v1/biblioteca?codmun=${codmun}&aspas=3`;
  const resp = await fetch(url, { headers: UA });
  if (!resp.ok) return null;
  const dados = (await resp.json()) as Record<
    string,
    { HISTORICO?: string; FORMACAO_ADMINISTRATIVA?: string; GENTILICO?: string }
  >;
  const ficha = dados[codmun] ?? Object.values(dados)[0];
  if (!ficha) return null;
  const historico = ficha.HISTORICO ? limparTexto(ficha.HISTORICO) : "";
  const formacao = ficha.FORMACAO_ADMINISTRATIVA ? limparTexto(ficha.FORMACAO_ADMINISTRATIVA) : "";
  // Alguns municípios (ex.: Pau D'Arco) vêm com a formação administrativa
  // embutida no próprio histórico — daí o fallback.
  const anoCriacao =
    (formacao ? extrairAnoCriacao(formacao) : null) ??
    (historico ? extrairAnoCriacao(historico) : null);
  return {
    historia: historico ? resumir(historico) : null,
    gentilico: ficha.GENTILICO?.trim() || null,
    anoCriacao,
  };
}

async function main() {
  const [municipios, areas] = await Promise.all([
    prisma.municipio.findMany({ where: { codigoIbge: { not: null } } }),
    areasPA(),
  ]);
  console.log(`${municipios.length} municípios · ${areas.size} áreas do IBGE`);

  let ok = 0;
  let semFicha = 0;
  for (const m of municipios) {
    const codmun = m.codigoIbge!;
    let ficha = null;
    for (let tentativa = 0; tentativa < 3 && !ficha; tentativa++) {
      try {
        ficha = await fichaBiblioteca(codmun);
      } catch {
        await new Promise((r) => setTimeout(r, 1500));
      }
    }
    if (!ficha) {
      semFicha++;
      console.warn(`sem ficha: ${m.nome} (${codmun})`);
    }
    await prisma.municipio.update({
      where: { id: m.id },
      data: {
        areaKm2: areas.get(codmun) ?? undefined,
        gentilico: ficha?.gentilico ?? undefined,
        anoCriacao: ficha?.anoCriacao ?? undefined,
        historia: ficha?.historia ?? undefined,
      },
    });
    ok++;
    if (ok % 20 === 0) console.log(`${ok}/${municipios.length}...`);
    await new Promise((r) => setTimeout(r, 150));
  }
  console.log(`Concluído: ${ok} municípios atualizados, ${semFicha} sem ficha na biblioteca.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
