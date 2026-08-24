import { AnoSelector } from "@/components/AnoSelector";
import { EleitosPorCargo } from "@/components/EleitosPorCargo";
import { PdfDownloadLink } from "@/components/PdfDownloadLink";
import { getAnosComEleitos, getEleitosOficiais } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export default async function EleitosPage({
  searchParams,
}: {
  searchParams: Promise<{ ano?: string }>;
}) {
  const anosDisponiveis = await getAnosComEleitos();
  const { ano: anoParam } = await searchParams;
  const anoSelecionado =
    anoParam && anosDisponiveis.includes(Number(anoParam))
      ? Number(anoParam)
      : anosDisponiveis[0];

  const cargos = anoSelecionado ? await getEleitosOficiais(anoSelecionado) : [];
  const [regioes, municipiosOpcoes] = await Promise.all([
    prisma.regiao.findMany({ orderBy: { nome: "asc" }, select: { id: true, nome: true } }),
    prisma.municipio.findMany({
      orderBy: { nome: "asc" },
      select: { id: true, nome: true, regiaoId: true },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold">Eleitos</h1>
          <p className="text-sm text-neutral-500">
            Situação oficial do TSE · escolha o cargo e o município (você também pode favorititar candidatos não-eleitos em Favoritos)
          </p>
        </div>
        {anoSelecionado && (
          <div className="flex items-center gap-2">
            <PdfDownloadLink href={`/api/pdf/eleitos/${anoSelecionado}`} />
            <div className="w-32">
              <AnoSelectorSimples anos={anosDisponiveis} selecionado={anoSelecionado} />
            </div>
          </div>
        )}
      </div>

      {cargos.length > 0 ? (
        <EleitosPorCargo cargos={cargos} regioes={regioes} municipiosOpcoes={municipiosOpcoes} />
      ) : (
        <p className="text-sm text-neutral-500">
          Nenhum eleito importado ainda. Importe os dados do TSE em Configurações.
        </p>
      )}
    </div>
  );
}

function AnoSelectorSimples({ anos, selecionado }: { anos: number[]; selecionado: number }) {
  return <AnoSelector anos={anos} selecionado={selecionado} basePath="/candidatos" somenteAnos />;
}
