import { PrismaClient } from "@prisma/client";
import * as xlsx from "xlsx";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

const CARGO_MAP: Record<number, string> = {
  1: "Governador", // 7 linhas
  2: "Vice-Governador", // 7 linhas
  3: "Senador", // 12+ linhas
  4: "Senador", // 12 linhas
  5: "Senador", // 13 linhas
  6: "Deputado Estadual", // 262 linhas
  7: "Deputado Federal", // 411 linhas
};

const FILE_ORDER = [
  "CANDIDATOS-PA-2026-08-24T18_03_10.444Z.xlsx", // Governador
  "CANDIDATOS-PA-2026-08-24T18_09_14.673Z.xlsx", // Vice-Governador
  "CANDIDATOS-PA-2026-08-24T18_09_21.822Z.xlsx", // Senador
  "CANDIDATOS-PA-2026-08-24T18_09_40.458Z.xlsx", // Senador
  "CANDIDATOS-PA-2026-08-24T18_09_46.324Z.xlsx", // Senador
  "CANDIDATOS-PA-2026-08-24T18_09_27.633Z.xlsx", // Deputado Estadual
  "CANDIDATOS-PA-2026-08-24T18_09_34.819Z.xlsx", // Deputado Federal
];

async function importarCandidatos() {
  try {
    const downloadDir = "/Users/marcelolavareda/Downloads";
    let totalImportados = 0;

    for (let i = 0; i < FILE_ORDER.length; i++) {
      const fileName = FILE_ORDER[i];
      const cargo = CARGO_MAP[i + 1];

      const filePath = path.join(downloadDir, fileName);

      if (!fs.existsSync(filePath)) {
        console.log(`❌ Arquivo não encontrado: ${fileName}`);
        continue;
      }

      console.log(`\n📥 Importando: ${fileName} → ${cargo}`);

      // Ler Excel
      const workbook = xlsx.readFile(filePath);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const dados = xlsx.utils.sheet_to_json(worksheet) as any[];

      if (dados.length === 0) {
        console.log("  ⚠️  Arquivo vazio");
        continue;
      }

      // Processar candidatos
      for (const row of dados) {
        const nome = row["Nome Urna"]?.trim();
        const coligacao = row["Coligação"]?.trim();
        const totalizado = row["Totalização"]?.trim();
        const partidoNum = row["Partido"];

        if (!nome) continue;

        // Encontrar ou criar partido
        let partido = await prisma.partido.findFirst({
          where: { numero: Number(partidoNum) },
        });

        if (!partido) {
          partido = await prisma.partido.create({
            data: {
              numero: Number(partidoNum),
              sigla: `P${partidoNum}`,
              nome: coligacao || `Partido ${partidoNum}`,
            },
          });
        }

        // Criar candidato
        await prisma.candidato.upsert({
          where: {
            nomeUrna_cargoId: {
              nomeUrna: nome,
              cargoId: cargo,
            },
          },
          update: {
            situacao: totalizado === "Concorrendo" ? "ATIVO" : "INATIVO",
          },
          create: {
            nomeUrna: nome,
            cargo: cargo,
            cargoId: cargo,
            partidoId: partido.id,
            situacao: totalizado === "Concorrendo" ? "ATIVO" : "INATIVO",
            eleicaoId: "2026",
          },
        });

        totalImportados++;
      }

      console.log(`  ✅ ${dados.length} candidatos importados para ${cargo}`);
    }

    console.log(`\n✨ Total: ${totalImportados} candidatos importados`);
  } catch (error) {
    console.error("Erro:", error);
  } finally {
    await prisma.$disconnect();
  }
}

importarCandidatos();
