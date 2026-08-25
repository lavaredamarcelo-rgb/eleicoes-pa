import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowUpDown, MapPin } from "lucide-react";
import EditorNotas from "@/components/EditorNotas";
import BotaoDesfavoritar from "@/components/BotaoDesfavoritar";
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
  const ordenar = ordenarParam || "nome";

  let orderBy: any = { candidato: { nome: "asc" } };
  if (ordenar === "data-desc") orderBy = { createdAt: "desc" };
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
              select: {
                municipioId: true,
                votos: true,
                municipio: { select: { regiaoId: true, nome: true } },
              },
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

  // Localidade = reduto eleitoral (município de maior votação)
  const localidadeDe = (fav: (typeof favoritos)[number]) => {
    let melhor: { nome: string; votos: number } | null = null;
    for (const r of fav.candidato.resultados) {
      if (r.municipio?.nome && (!melhor || r.votos > melhor.votos)) {
        melhor = { nome: r.municipio.nome, votos: r.votos };
      }
    }
    return melhor?.nome ?? "Sem localidade";
  };

  // Agrupamento por localidade (quando selecionado)
  const grupos: { localidade: string; itens: typeof favoritos }[] = [];
  if (ordenar === "localidade") {
    const mapa = new Map<string, typeof favoritos>();
    for (const fav of favoritosFiltrados) {
      const loc = localidadeDe(fav);
      if (!mapa.has(loc)) mapa.set(loc, []);
      mapa.get(loc)!.push(fav);
    }
    const nomesOrdenados = [...mapa.keys()].sort((a, b) => {
      if (a === "Sem localidade") return 1;
      if (b === "Sem localidade") return -1;
      return a.localeCompare(b, "pt");
    });
    for (const loc of nomesOrdenados) {
      const itens = mapa
        .get(loc)!
        .sort((a, b) => a.candidato.nome.localeCompare(b.candidato.nome, "pt"));
      grupos.push({ localidade: loc, itens });
    }
  }

  const botoesOrdenar: { chave: string; rotulo: string }[] = [
    { chave: "nome", rotulo: "Nome (A-Z)" },
    { chave: "localidade", rotulo: "Localidade" },
    { chave: "data-desc", rotulo: "Mais recentes" },
    { chave: "votos-desc", rotulo: "Mais votos" },
  ];

  const renderCard = (favorito: (typeof favoritos)[number]) => {
    const totalVotos = favorito.candidato.resultados.reduce(
      (sum, r) => sum + r.votos,
      0
    );

    return (
      <div
        key={favorito.id}
        className="border rounded-lg p-4 hover:bg-yellow-50 transition space-y-3"
      >
        <div className="flex items-start justify-between gap-2">
          <Link href={`/candidatos/${favorito.candidato.id}`} className="block flex-1">
            <h3 className="text-lg font-semibold">{favorito.candidato.nome}</h3>
            <div className="flex gap-4 mt-2 text-sm text-gray-600 flex-wrap">
              <span className="font-medium">{favorito.candidato.cargo.nome}</span>
              <span>{favorito.candidato.partido.sigla}</span>
              <span>{totalVotos.toLocaleString("pt-BR")} votos</span>
              <span className="flex items-center gap-1">
                <MapPin size={13} /> {localidadeDe(favorito)}
              </span>
            </div>
            {favorito.candidato.eleito && (
              <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                ✓ Eleito
              </span>
            )}
          </Link>
          <BotaoDesfavoritar
            candidatoId={favorito.candidatoId}
            nome={favorito.candidato.nome}
          />
        </div>
        <EditorNotas favoritoId={favorito.id} notasInicial={favorito.notas || ""} />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Favoritos</h1>
        <p className="text-gray-600 mt-2">
          Acompanhe a evolução de seus políticos favoritos
        </p>
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
              {botoesOrdenar.map((b) => (
                <Link
                  key={b.chave}
                  href={`?ordenar=${b.chave}`}
                  className={`px-3 py-1 rounded text-sm flex items-center gap-1 transition ${
                    ordenar === b.chave
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {b.chave === "localidade" ? (
                    <MapPin size={14} />
                  ) : (
                    <ArrowUpDown size={14} />
                  )}{" "}
                  {b.rotulo}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      {favoritos.length === 0 ? (
        <div className="text-center py-12 text-gray-500 border rounded-lg">
          <p>Você ainda não favoritou nenhum político.</p>
          <p className="text-sm">
            Visite a aba "Eleitos" ou "Cenários" para favoritar seus candidatos preferidos.
          </p>
          <Link
            href="/candidatos"
            className="text-blue-600 hover:underline mt-4 inline-block"
          >
            Ir para Candidatos →
          </Link>
        </div>
      ) : favoritosFiltrados.length === 0 ? (
        <p className="text-center py-8 text-gray-500">
          Nenhum político com esses filtros.
        </p>
      ) : ordenar === "localidade" ? (
        <div className="space-y-6">
          {grupos.map((g) => (
            <div key={g.localidade} className="space-y-3">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500 border-b pb-1">
                <MapPin size={14} /> {g.localidade} ({g.itens.length})
              </h2>
              <div className="grid gap-4">{g.itens.map(renderCard)}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">{favoritosFiltrados.map(renderCard)}</div>
      )}
    </div>
  );
}
