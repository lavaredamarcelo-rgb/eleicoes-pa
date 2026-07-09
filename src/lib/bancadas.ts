import "server-only";
import { prisma } from "@/lib/prisma";

// Bancadas no Congresso Nacional consultadas AO VIVO nas fontes oficiais:
// Senado (legis.senado.leg.br, parlamentares em exercício) e Câmara
// (dadosabertos.camara.leg.br, deputados em exercício). Usado pela
// atualização automática mensal e pelo script manual.

// As casas usam grafias próprias para algumas siglas.
const ALIAS_SIGLA: Record<string, string> = {
  PODEMOS: "PODE",
  UB: "UNIÃO",
  REP: "REPUBLICANOS",
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

// ---------------------------------------------------------------------------
// Filiação atual dos parlamentares do PA
//
// As urnas registram o partido da ELEIÇÃO; depois disso há janelas de troca.
// Aqui buscamos a filiação em exercício de deputados federais e senadores do
// Pará e registramos a mudança como TrocaPartido — sem tocar no partido da
// candidatura, para não reescrever votos por partido/quociente do ano da urna.

function normalizarNome(nome: string) {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function parlamentaresPA(): Promise<
  { nome: string; sigla: string; cargoNome: string; fonte: string }[]
> {
  const lista: { nome: string; sigla: string; cargoNome: string; fonte: string }[] = [];

  const respDep = await fetch(
    "https://dadosabertos.camara.leg.br/api/v2/deputados?siglaUf=PA&itens=100",
    { headers: { Accept: "application/json" }, cache: "no-store" }
  );
  if (!respDep.ok) throw new Error(`Câmara respondeu ${respDep.status}`);
  const dep = (await respDep.json()) as { dados: { nome: string; siglaPartido: string }[] };
  for (const d of dep.dados) {
    lista.push({
      nome: d.nome,
      sigla: normalizarSigla(d.siglaPartido),
      cargoNome: "Deputado Federal",
      fonte: "Câmara dos Deputados",
    });
  }

  const respSen = await fetch(
    "https://legis.senado.leg.br/dadosabertos/senador/lista/atual.json",
    { headers: { Accept: "application/json" }, cache: "no-store" }
  );
  if (!respSen.ok) throw new Error(`Senado respondeu ${respSen.status}`);
  const sen = (await respSen.json()) as {
    ListaParlamentarEmExercicio: {
      Parlamentares: {
        Parlamentar: {
          IdentificacaoParlamentar: {
            NomeParlamentar: string;
            SiglaPartidoParlamentar: string;
            UfParlamentar?: string;
          };
        }[];
      };
    };
  };
  for (const s of sen.ListaParlamentarEmExercicio.Parlamentares.Parlamentar) {
    const i = s.IdentificacaoParlamentar;
    if (i.UfParlamentar !== "PA") continue;
    lista.push({
      nome: i.NomeParlamentar,
      sigla: normalizarSigla(i.SiglaPartidoParlamentar),
      cargoNome: "Senador",
      fonte: "Senado Federal",
    });
  }

  return lista;
}

// Deputados estaduais em exercício, raspados da página institucional da
// ALEPA (não há API): tokens "Deputado(a)" seguidos de nome e sigla.
async function deputadosEstaduaisALEPA(): Promise<
  { nome: string; sigla: string; cargoNome: string; fonte: string }[]
> {
  const resp = await fetch("https://www.alepa.pa.gov.br/Institucional/Deputados", {
    headers: { "User-Agent": "eleicoes-pa/1.0" },
    cache: "no-store",
  });
  if (!resp.ok) throw new Error(`ALEPA respondeu ${resp.status}`);
  const html = await resp.text();
  const tokens = html
    .replace(/<[^>]+>/g, "\n")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const lista: { nome: string; sigla: string; cargoNome: string; fonte: string }[] = [];
  for (let i = 0; i + 2 < tokens.length; i++) {
    if (tokens[i] !== "Deputado" && tokens[i] !== "Deputada") continue;
    const nome = tokens[i + 1];
    const sigla = tokens[i + 2];
    if (nome.length < 2 || nome.length > 50) continue;
    if (!/^[A-ZÀ-Ú][A-ZÀ-Ú ]{1,14}$/.test(sigla)) continue;
    lista.push({
      nome,
      sigla: normalizarSigla(sigla),
      cargoNome: "Deputado Estadual",
      fonte: "Assembleia Legislativa do Pará",
    });
  }
  // Sanidade: a ALEPA tem 41 cadeiras; menos de 35 indica mudança no site.
  if (lista.length < 35) {
    throw new Error(`ALEPA: só ${lista.length} deputados extraídos; layout deve ter mudado.`);
  }
  return lista;
}

export async function sincronizarFiliacoesPA() {
  const parlamentares = await parlamentaresPA();

  // A raspagem da ALEPA não pode derrubar a sincronização federal.
  try {
    parlamentares.push(...(await deputadosEstaduaisALEPA()));
  } catch (err) {
    console.error("[filiações] ALEPA indisponível:", err);
  }

  // Última candidatura ELEITA de cada pessoa no cargo correspondente.
  const eleitos = await prisma.candidato.findMany({
    where: {
      eleito: true,
      cargo: { nome: { in: ["Deputado Federal", "Senador", "Deputado Estadual"] } },
    },
    include: {
      partido: true,
      cargo: { include: { eleicao: true } },
      trocasPartido: { include: { partidoDestino: true }, orderBy: { data: "desc" }, take: 1 },
    },
  });

  const partidos = await prisma.partido.findMany();
  const partidoPorSigla = new Map(partidos.map((p) => [normalizarSigla(p.sigla), p]));

  let registradas = 0;
  const avisos: string[] = [];

  for (const parl of parlamentares) {
    const alvoNorm = normalizarNome(parl.nome);
    const candidatosCargo = eleitos.filter((c) => c.cargo.nome === parl.cargoNome);

    // 1º: nome de urna idêntico; 2º: um nome contido no outro (ELCIONE ⊂
    // ELCIONE BARBALHO), desde que o casamento seja único.
    let matches = candidatosCargo.filter((c) => normalizarNome(c.nome) === alvoNorm);
    if (matches.length === 0) {
      const alvoTokens = alvoNorm.split(" ");
      matches = candidatosCargo.filter((c) => {
        const urnaTokens = normalizarNome(c.nome).split(" ");
        const [menor, maior] =
          urnaTokens.length <= alvoTokens.length ? [urnaTokens, alvoTokens] : [alvoTokens, urnaTokens];
        return menor.every((tok) => maior.includes(tok));
      });
    }
    const pessoas = new Set(matches.map((c) => c.cpf ?? c.nomeCompleto ?? c.nome));
    if (matches.length === 0 || pessoas.size > 1) {
      avisos.push(`${parl.nome} (${parl.cargoNome}): ${matches.length === 0 ? "sem" : "mais de um"} candidato correspondente`);
      continue;
    }
    const candidato = matches.sort((a, b) => b.cargo.eleicao.ano - a.cargo.eleicao.ano)[0];

    const filiacaoAtual = candidato.trocasPartido[0]?.partidoDestino ?? candidato.partido;
    if (normalizarSigla(filiacaoAtual.sigla) === parl.sigla) continue;

    const destino = partidoPorSigla.get(parl.sigla);
    if (!destino) {
      avisos.push(`${parl.nome}: partido ${parl.sigla} não cadastrado`);
      continue;
    }

    await prisma.trocaPartido.create({
      data: {
        candidatoId: candidato.id,
        partidoOrigemId: filiacaoAtual.id,
        partidoDestinoId: destino.id,
        data: new Date(),
        motivo: `Sincronizado com os dados abertos (${parl.fonte})`,
      },
    });
    registradas++;
    console.log(`[filiações] ${candidato.nome}: ${filiacaoAtual.sigla} → ${destino.sigla} (${parl.fonte})`);
  }

  for (const a of avisos) console.warn(`[filiações] ${a}`);
  return { registradas, avisos };
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

  // Aproveita a mesma janela mensal para manter a filiação atual dos
  // parlamentares do PA em dia (não derruba a atualização se falhar).
  let filiacoes: Awaited<ReturnType<typeof sincronizarFiliacoesPA>> | null = null;
  try {
    filiacoes = await sincronizarFiliacoesPA();
  } catch (err) {
    console.error("[filiações] Falha na sincronização:", err);
  }

  await prisma.configSistema.upsert({
    where: { chave: "bancadas_ultima_atualizacao" },
    update: { valor: new Date().toISOString() },
    create: { chave: "bancadas_ultima_atualizacao", valor: new Date().toISOString() },
  });

  return { atualizados, totalSen, totalDep, trocasRegistradas: filiacoes?.registradas ?? 0 };
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
