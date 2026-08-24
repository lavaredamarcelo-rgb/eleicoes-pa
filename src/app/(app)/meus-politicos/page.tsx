import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowUpDown, Plus } from "lucide-react";
import EditorNotas from "@/components/EditorNotas";
import FiltrosMeusPoliticos from "@/components/FiltrosMeusPoliticos";
import NotificacoesFavoritos from "@/components/NotificacoesFavoritos";

export default async function FavoritosPage({
  searchParams,
}: {
  searchParams: Promise<{ ordenar?: string; cargo?: string; regiao?: string }>;
}) {
  const session = await verifySession();
  if (!session) redirect("/login");

  const { ordenar: ordenarParam, cargo: cargoParam, regiao: regiaoParam } = await searchParams;
  const ordenar = ordenarParam || "data-desc";

  let orderBy: any = { createdAt: "desc" };
  if (ordenar === "data-asc") orderBy = { createdAt: "asc" };
  if (ordenar === "votos-desc") orderBy = { candidato: { resultados: { _count: "desc" } } };
  if (ordenar === "votos-asc") orderBy = { candidato: { resultados: { _count: "asc" } } };

  // Filtros
  const where: any = { userId: session.userId };
  if (cargoParam) where.candidato = { cargoId: cargoParam };

  const [favoritos, cargos, regioes] = await Promise.all([
    prisma.politicoFavorito.findMany({
      where,
      include: {
        candidato: {
          include: {
            cargo: true,
            partido: true,
            resultados: {
              select: { municipioId: true, votos: true, municipio: { select: { regiaoId: true } } },
            },
            trocasPartido: {
              include: {
                partidoOrigem: true,
                partidoDestino: true,
              },
              orderBy: { data: "desc" },
              take: 1,
            },
          },
        },
      },
      orderBy,
    }),
    prisma.cargo.findMany({ orderBy: { nome: "asc" } }),
    prisma.regiao.findMany({ orderBy: { nome: "asc" } }),
  ]);

  // Gerar notificações de trocas recentes (últimos 7 dias)
  const agora = new Date();
  const umaSemanaAtras = new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000);

  const notificacoes = favoritos
    .filter((fav) => fav.candidato.trocasPartido.length > 0)
    .filter((fav) => fav.candidato.trocasPartido[0].data > umaSemanaAtras)
    .map((fav) => {
      const troca = fav.candidato.trocasPartido[0];
      return {
        tipo: "troca_partido" as const,
        titulo: `${fav.candidato.nome} trocou de partido`,
        descricao: `Saiu do ${troca.partidoOrigem.sigla} e entrou no ${troca.partidoDestino.sigla}`,
        candidatoNome: fav.candidato.nome,
        data: troca.data,
      };
    });

  // Filtrar por região se selecionada
  let favoritosFiltrados = favoritos;
  if (regiaoParam) {
    favoritosFiltrados = favoritos.filter((f) =>
      f.candidato.resultados.some((r) => r.municipio?.regiaoId === regiaoParam)
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Favoritos</h1>
        <p className="text-gray-600 mt-2">
          Acompanhe a evolução de seus políticos favoritos
        </p>
      </div>

      {/* Card para favoritar candidatos que perderam eleição */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
        <div className="flex items-start gap-3">
          <Plus className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900">Favorititar candidatos não-eleitos</h3>
            <p className="text-sm text-blue-800 mt-1">
              Você também pode favorititar o segundo colocado, terceiro lugar ou outros candidatos que perderam a eleição.
            </p>
            <div className="mt-3 flex gap-2">
              <Link
                href="/candidatos"
                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
              >
                <Plus size={16} /> Ver todos os candidatos
              </Link>
              <Link
                href="/cenario"
                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-200 text-blue-900 text-sm rounded hover:bg-blue-300 transition"
              >
                Explorar cenários
              </Link>
            </div>
          </div>
        </div>
      </div>

      {favoritos.length > 0 && (
        <>
          {notificacoes.length > 0 && <NotificacoesFavoritos notificacoes={notificacoes} />}
          <div className="space-y-4">
            <FiltrosMeusPoliticos
              cargos={cargos}
              regioes={regioes}
              cargoParam={cargoParam}
              regiaoParam={regiaoParam}
            />

            <div className="flex gap-2 flex-wrap">
              <Link
                href={`?ordenar=data-desc`}
                className={`px-3 py-1 rounded text-sm flex items-center gap-1 transition ${
                  ordenar === "data-desc"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                <ArrowUpDown size={14} /> Mais recentes
              </Link>
              <Link
                href={`?ordenar=data-asc`}
                className={`px-3 py-1 rounded text-sm flex items-center gap-1 transition ${
                  ordenar === "data-asc"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                <ArrowUpDown size={14} /> Mais antigos
              </Link>
              <Link
                href={`?ordenar=votos-desc`}
                className={`px-3 py-1 rounded text-sm flex items-center gap-1 transition ${
                  ordenar === "votos-desc"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                <ArrowUpDown size={14} /> Mais votos
              </Link>
              <Link
                href={`?ordenar=votos-asc`}
                className={`px-3 py-1 rounded text-sm flex items-center gap-1 transition ${
                  ordenar === "votos-asc"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                <ArrowUpDown size={14} /> Menos votos
              </Link>
            </div>
          </div>
        </>
      )}

      {favoritos.length === 0 ? (
        <div className="text-center py-12 text-gray-500 border rounded-lg">
          <p>Você ainda não favoritou nenhum político.</p>
          <p className="text-sm">
            Visite a aba "Eleitos" ou "Cenários" para favorititar seus candidatos preferidos.
          </p>
          <Link
            href="/candidatos"
            className="text-blue-600 hover:underline mt-4 inline-block"
          >
            Ir para Candidatos →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {favoritosFiltrados.length === 0 ? (
            <p className="text-center py-8 text-gray-500">Nenhum político com esses filtros.</p>
          ) : (
            <>
              {favoritosFiltrados.map((favorito) => {
                const totalVotos = favorito.candidato.resultados.reduce(
                  (sum, r) => sum + r.votos,
                  0
                );

                return (
                  <div key={favorito.id} className="border rounded-lg p-4 hover:bg-yellow-50 transition space-y-3">
                    <Link
                      href={`/candidatos/${favorito.candidato.id}`}
                      className="block"
                    >
                      <h3 className="text-lg font-semibold">
                        {favorito.candidato.nome}
                      </h3>
                      <div className="flex gap-4 mt-2 text-sm text-gray-600">
                        <span className="font-medium">
                          {favorito.candidato.cargo.nome}
                        </span>
                        <span>{favorito.candidato.partido.sigla}</span>
                        <span>{totalVotos.toLocaleString("pt-BR")} votos</span>
                      </div>
                      {favorito.candidato.eleito && (
                        <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          ✓ Eleito
                        </span>
                      )}
                    </Link>
                    <EditorNotas
                      favoritoId={favorito.id}
                      notasInicial={favorito.notas || ""}
                    />
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
}
