import "server-only";
import { prisma } from "@/lib/prisma";

// Bancadas no Congresso Nacional consultadas AO VIVO nas fontes oficiais:
// Senado (legis.senado.leg.br, parlamentares em exercício) e Câmara
// (dadosabertos.camara.leg.br, deputados em exercício). Usado pela
// atualização automática mensal e pelo script manual.

// As casas usam grafias próprias para algumas siglas.
const ALIAS_SIGLA: Record<string, string> = {
  PODEMOS: "PODE",
  PCDOB: "PC DO B",
  "PC-DO-B": "PC DO B",
  UNIAO: "UNIÃO",
  "UNIÃO BRASIL": "UNIÃO",
  SDD: "SOLIDARIEDADE",
};

function normalizarSigla(sigla: string) {
  const s = sigla.trim().toUpperCase();
  return ALIAS_SIGLA[s] ?? s;
}

async function bancadaSenado(): Promise<Map<string, number>> {
  const resp = await fetch("https://legis.senado.leg.br/dadosabertos/senador/lista/atual.json", {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!resp.ok) throw new Error(`Senado respondeu ${resp.status}`);
  const d = (await resp.json()) as {
    ListaParlamentarEmExercicio: {
      Parlamentares: { Parlamentar: { IdentificacaoParlamentar: { SiglaPartidoParlamentar: string } }[] };
    };
  };
  const contagem = new Map<string, number>();
  for (const p of d.ListaParlamentarEmExercicio.Parlamentares.Parlamentar) {
    const sigla = normalizarSigla(p.IdentificacaoParlamentar.SiglaPartidoParlamentar);
    contagem.set(sigla, (contagem.get(sigla) ?? 0) + 1);
  }
  return contagem;
}

async function bancadaCamara(): Promise<Map<string, number>> {
  const contagem = new Map<string, number>();
  let url: string | null =
    "https://dadosabertos.camara.leg.br/api/v2/deputados?itens=100&pagina=1";
  let paginas = 0;
  while (url && paginas < 10) {
    const resp = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-store" });
    if (!resp.ok) throw new Error(`Câmara respondeu ${resp.status}`);
    const d = (await resp.json()) as {
      dados: { siglaPartido: string }[];
      links: { rel: string; href: string }[];
    };
    for (const dep of d.dados) {
      const sigla = normalizarSigla(dep.siglaPartido);
      contagem.set(sigla, (contagem.get(sigla) ?? 0) + 1);
    }
    const next = d.links.find((l) => l.rel === "next");
    const self = d.links.find((l) => l.rel === "self");
    url = next && next.href !== self?.href ? next.href : null;
    paginas++;
  }
  return contagem;
}

export async function atualizarBancadas() {
  const [senado, camara] = await Promise.all([bancadaSenado(), bancadaCamara()]);

  // Sanidade: as somas precisam bater com o tamanho das casas; caso
  // contrário, algo mudou na API e é melhor manter os valores atuais.
  const totalSen = Array.from(senado.values()).reduce((s, v) => s + v, 0);
  const totalDep = Array.from(camara.values()).reduce((s, v) => s + v, 0);
  if (totalSen < 70 || totalDep < 450) {
    throw new Error(`Contagens improváveis (senadores=${totalSen}, deputados=${totalDep}); abortando.`);
  }

  const partidos = await prisma.partido.findMany();
  let atualizados = 0;
  for (const p of partidos) {
    const sigla = normalizarSigla(p.sigla);
    await prisma.partido.update({
      where: { id: p.id },
      data: {
        senadoresNacional: senado.get(sigla) ?? 0,
        deputadosNacional: camara.get(sigla) ?? 0,
      },
    });
    atualizados++;
  }

  await prisma.configSistema.upsert({
    where: { chave: "bancadas_ultima_atualizacao" },
    update: { valor: new Date().toISOString() },
    create: { chave: "bancadas_ultima_atualizacao", valor: new Date().toISOString() },
  });

  return { atualizados, totalSen, totalDep };
}

const TRINTA_DIAS_MS = 30 * 24 * 60 * 60 * 1000;

// Chamado pelo agendador: só executa se a última atualização tiver mais de
// 30 dias (ou nunca tiver acontecido).
export async function atualizarBancadasSeVencido() {
  const config = await prisma.configSistema.findUnique({
    where: { chave: "bancadas_ultima_atualizacao" },
  });
  const ultima = config ? new Date(config.valor).getTime() : 0;
  if (Date.now() - ultima < TRINTA_DIAS_MS) return null;
  return atualizarBancadas();
}
