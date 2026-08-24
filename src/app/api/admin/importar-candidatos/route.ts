import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import xlsx from "xlsx";

export async function POST(req: NextRequest) {
  const session = await verifySession();
  if (session.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const cargo = formData.get("cargo") as string;

    if (!file) {
      return NextResponse.json(
        { error: "Arquivo não fornecido" },
        { status: 400 }
      );
    }

    // Ler arquivo Excel
    const buffer = await file.arrayBuffer();
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const dados = xlsx.utils.sheet_to_json(worksheet);

    if (dados.length === 0) {
      return NextResponse.json(
        { error: "Arquivo vazio ou inválido" },
        { status: 400 }
      );
    }

    // Processar dados
    let importados = 0;

    for (const row of dados as any[]) {
      const nome = row["Nome Urna"]?.trim();
      const coligacao = row["Coligação"]?.trim();
      const totalizado = row["Totalização"]?.trim();
      const partidoNum = row["Partido"];

      if (!nome) continue;

      // Tentar encontrar partido pelo número
      let partido = await prisma.partido.findFirst({
        where: { numero: Number(partidoNum) },
      });

      if (!partido) {
        // Se não encontrar, criar com sigla genérica
        partido = await prisma.partido.create({
          data: {
            numero: Number(partidoNum),
            sigla: `P${partidoNum}`,
            nome: coligacao || `Partido ${partidoNum}`,
          },
        });
      }

      // Criar ou atualizar candidato
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

      importados++;
    }

    console.log(
      `[Importação] ${importados} candidatos importados para ${cargo}`
    );

    return NextResponse.json({ importados });
  } catch (error) {
    console.error("Erro ao importar candidatos:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Erro ao importar arquivo",
      },
      { status: 500 }
    );
  }
}
