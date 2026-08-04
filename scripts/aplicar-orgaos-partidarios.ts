// Aplica os dados de órgãos partidários do SGIP/TSE (gerados em 01/08/2026):
// contatos e executiva estadual vigente no Partido, e presidências
// municipais vigentes em DirecaoMunicipalPartido. Idempotente (recria a
// tabela de direções municipais a cada execução).
// Uso: DATABASE_URL="file:./dev.db" npx tsx scripts/aplicar-orgaos-partidarios.ts
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { prisma } from "../src/lib/prisma";

type OrgaoEstadual = {
  sigla: string;
  numero: number | null;
  telefone: string;
  email: string;
  membros: { cargo: string; nome: string; inicio: string }[];
};
type PresidenciaMunicipal = {
  sigla: string;
  numero: number | null;
  cdMunicipioTse: string;
  municipio: string;
  presidente: string;
  vigente: boolean;
  inicio: string;
};

const normalizar = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, "");

async function main() {
  const dir = join(__dirname, "..", "src", "data");
  const estaduais: OrgaoEstadual[] = JSON.parse(
    readFileSync(join(dir, "orgaos-estaduais-pa.json"), "utf-8")
  );
  const municipais: PresidenciaMunicipal[] = JSON.parse(
    readFileSync(join(dir, "presidentes-municipais-pa.json"), "utf-8")
  );

  const partidos = await prisma.partido.findMany();
  const porSigla = new Map(partidos.map((p) => [normalizar(p.sigla), p]));
  const porNumero = new Map(partidos.map((p) => [p.numero, p]));
  const encontrar = (sigla: string, numero: number | null) =>
    porSigla.get(normalizar(sigla)) ?? (numero != null ? porNumero.get(numero) : undefined);

  // Contatos + executiva estadual. O SGIP registra o diretório inteiro;
  // guardamos só os cargos de direção (presidente, vices, secretários,
  // tesoureiros, líderes) — membros comuns, suplentes e delegados ficam
  // de fora para a ficha não virar uma lista de centenas de nomes.
  const cargoDeDirecao = (cargo: string) => {
    const c = cargo.toUpperCase();
    if (c.startsWith("MEMBRO") || c.startsWith("SUPLENTE") || c.startsWith("DELEGADO") || c === "VOGAL") {
      return false;
    }
    return true;
  };
  const telefoneValido = (t: string) => t.replace(/\D/g, "").length >= 8;

  let estAtualizados = 0;
  for (const e of estaduais) {
    const partido = encontrar(e.sigla, e.numero);
    if (!partido) continue;
    const direcao = e.membros.filter((m) => cargoDeDirecao(m.cargo));
    await prisma.partido.update({
      where: { id: partido.id },
      data: {
        telefoneEstadualPA: telefoneValido(e.telefone) ? e.telefone : null,
        emailEstadualPA: e.email || null,
        executivaEstadualPA: direcao.length > 0 ? JSON.stringify(direcao) : null,
      },
    });
    estAtualizados++;
  }

  // Presidências municipais vigentes — recria do zero.
  const municipiosDb = await prisma.municipio.findMany();
  const municipioPorTse = new Map(
    municipiosDb.filter((m) => m.codigoTse).map((m) => [m.codigoTse!.padStart(5, "0"), m])
  );

  await prisma.direcaoMunicipalPartido.deleteMany();
  let munCriadas = 0;
  const avisos: string[] = [];
  for (const r of municipais) {
    if (!r.vigente) continue;
    const partido = encontrar(r.sigla, r.numero);
    const municipio = municipioPorTse.get(r.cdMunicipioTse.padStart(5, "0"));
    if (!partido || !municipio) {
      avisos.push(`${r.sigla}/${r.municipio}`);
      continue;
    }
    await prisma.direcaoMunicipalPartido.create({
      data: {
        partidoId: partido.id,
        municipioId: municipio.id,
        presidente: r.presidente,
        inicio: r.inicio || null,
      },
    });
    munCriadas++;
  }

  console.log(
    `Órgãos estaduais: ${estAtualizados} partido(s) com contatos/executiva · Direções municipais vigentes: ${munCriadas} criada(s)`
  );
  if (avisos.length > 0) console.log(`Sem correspondência (${avisos.length}): ${avisos.slice(0, 10).join(", ")}…`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
