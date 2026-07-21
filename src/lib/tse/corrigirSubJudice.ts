import "server-only";
import { prisma } from "@/lib/prisma";

// Correção das disputas de Vereador 2024 cuja totalização ficou sub judice
// no TSE (Breu Branco, Placas e Rurópolis): os arquivos abertos usados na
// importação original não traziam os votos, então buscamos o resultado
// oficial atual no serviço de divulgação, gravamos votos/eleitos/legenda e
// registramos a nota judicial no cargo. Idempotente.

type CandTse = { n: string; nm: string; nmu: string; e: string; st: string; vap: string };
type ParTse = { n: string; sg: string; tvtl: string; cand?: CandTse[] };
type AgrTse = { par?: ParTse[] };
type UrlTse = { dt: string; carg: { cd: string; agr?: AgrTse[] }[] };

const MUNICIPIOS_SUB_JUDICE_2024 = ["Breu Branco", "Placas", "Rurópolis"];

async function corrigirMunicipio(nome: string): Promise<string> {
  const municipio = await prisma.municipio.findFirst({ where: { nome } });
  if (!municipio?.codigoTse) throw new Error(`${nome}: município ou código TSE não encontrado.`);

  const cargo = await prisma.cargo.findFirst({
    where: { nome: "Vereador", municipioId: municipio.id, eleicao: { ano: 2024 } },
    include: { candidatos: true },
  });
  if (!cargo) throw new Error(`${nome}: cargo Vereador 2024 não encontrado.`);

  const cod = municipio.codigoTse.padStart(5, "0");
  const url = `https://resultados.tse.jus.br/oficial/ele2024/619/dados/pa/pa${cod}-c0013-e000619-u.json`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`${nome}: TSE respondeu ${resp.status} para a votação.`);
  const dados = (await resp.json()) as UrlTse;

  const cargaVereador = dados.carg.find((c) => c.cd === "13");
  if (!cargaVereador) throw new Error(`${nome}: cargo 13 (Vereador) ausente no JSON do TSE.`);

  // O arquivo de votação não carrega a situação final; ela vem da API de
  // candidaturas (descricaoTotalizacao: "Eleito por QP", "Eleito por
  // média", "Suplente", "Não eleito").
  const urlSituacao = `https://divulgacandcontas.tse.jus.br/divulga/rest/v1/candidatura/listar/2024/${cod}/2045202024/13/candidatos`;
  const respSituacao = await fetch(urlSituacao);
  if (!respSituacao.ok) throw new Error(`${nome}: API de situação respondeu ${respSituacao.status}`);
  const situacaoJson = (await respSituacao.json()) as {
    candidatos: { numero: number; descricaoTotalizacao: string | null }[];
  };
  const situacaoPorNumero = new Map(
    situacaoJson.candidatos.map((c) => [c.numero, c.descricaoTotalizacao ?? ""])
  );

  const porNumero = new Map(cargo.candidatos.map((c) => [c.numero, c]));
  const partidos = await prisma.partido.findMany();
  const partidoPorNumero = new Map(partidos.map((p) => [p.numero, p]));

  let votosGravados = 0;
  let eleitos = 0;
  let semCorrespondencia = 0;
  let legendaGravada = 0;

  for (const agr of cargaVereador.agr ?? []) {
    for (const par of agr.par ?? []) {
      const legenda = Number(par.tvtl ?? 0);
      const partido = partidoPorNumero.get(Number(par.n));
      if (partido && legenda > 0) {
        await prisma.votoLegenda.upsert({
          where: {
            cargoId_municipioId_partidoId_turno: {
              cargoId: cargo.id,
              municipioId: municipio.id,
              partidoId: partido.id,
              turno: 1,
            },
          },
          create: {
            cargoId: cargo.id,
            municipioId: municipio.id,
            partidoId: partido.id,
            turno: 1,
            votos: legenda,
          },
          update: { votos: legenda },
        });
        legendaGravada += legenda;
      }

      for (const c of par.cand ?? []) {
        const candidato = porNumero.get(Number(c.n));
        if (!candidato) {
          semCorrespondencia++;
          continue;
        }
        const votos = Number(c.vap ?? 0);
        const existente = await prisma.resultado.findFirst({
          where: {
            candidatoId: candidato.id,
            municipioId: municipio.id,
            turno: 1,
            colegioEleitoralId: null,
          },
        });
        if (existente) {
          await prisma.resultado.update({ where: { id: existente.id }, data: { votos } });
        } else {
          await prisma.resultado.create({
            data: { candidatoId: candidato.id, municipioId: municipio.id, turno: 1, votos },
          });
        }
        votosGravados += votos;

        const situacao = situacaoPorNumero.get(candidato.numero) ?? "";
        const eleito = c.e === "s" || situacao.toLowerCase().startsWith("eleito");
        if (eleito) eleitos++;
        if (candidato.eleito !== eleito) {
          await prisma.candidato.update({ where: { id: candidato.id }, data: { eleito } });
        }
      }
    }
  }

  // Fica registrado que a disputa passou pela Justiça Eleitoral; subJudice
  // volta a false porque a totalização atual do TSE já é definitiva.
  await prisma.cargo.update({
    where: { id: cargo.id },
    data: {
      subJudice: false,
      obsJudicial: `Totalização ficou sub judice em 2024 e foi concluída pelo TSE em ${dados.dt} por decisão da Justiça Eleitoral.`,
    },
  });

  return `${nome}: ${votosGravados.toLocaleString("pt-BR")} votos nominais + ${legendaGravada.toLocaleString("pt-BR")} de legenda · ${eleitos} eleitos · ${semCorrespondencia} sem correspondência · totalização TSE de ${dados.dt}`;
}

export async function corrigirSubJudice2024() {
  const resumo: string[] = [];
  for (const nome of MUNICIPIOS_SUB_JUDICE_2024) {
    resumo.push(await corrigirMunicipio(nome));
  }
  return resumo;
}
