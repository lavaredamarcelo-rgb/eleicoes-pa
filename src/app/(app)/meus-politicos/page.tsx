import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowUpDown } from "lucide-react";
import EditorNotas from "@/components/EditorNotas";

export default async function MeusPoliticosPage({
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
          },
        },
      },
      orderBy,
    }),
    prisma.cargo.findMany({ orderBy: { nome: "asc" } }),
    prisma.regiao.findMany({ orderBy: { nome: "asc" } }),
  ]);

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
        <h1 className="text-3xl font-bold">Meus Políticos</h1>
        <p className="text-gray-600 mt-2">
          Acompanhe a evolução de seus políticos favoritos
        </p>
      </div>

      {favoritos.length > 0 && (
        <>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="block text-sm font-medium mb-1">Filtrar por cargo:</label>
                <select
                  value={cargoParam || ""}
                  onChange={(e) => {
                    const url = new URL(window.location.href);
                    if (e.target.value) {
                      url.searchParams.set("cargo", e.target.value);
                    } else {
                      url.searchParams.delete("cargo");
                    }
                    window.location.href = url.toString();
                  }}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Todos</option>
                  {cargos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Filtrar por região:</label>
                <select
                  value={regiaoParam || ""}
                  onChange={(e) => {
                    const url = new URL(window.location.href);
                    if (e.target.value) {
                      url.searchParams.set("regiao", e.target.value);
                    } else {
                      url.searchParams.delete("regiao");
                    }
                    window.location.href = url.toString();
                  }}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Todas</option>
                  {regioes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

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
            Visite a aba "Eleitos" para favoritar seus candidatos preferidos.
          </p>
          <Link
            href="/candidatos"
            className="text-blue-600 hover:underline mt-4 inline-block"
          >
            Ir para Eleitos →
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
