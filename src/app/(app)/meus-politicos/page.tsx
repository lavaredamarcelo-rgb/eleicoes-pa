import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function MeusPoliticosPage() {
  const session = await verifySession();
  if (!session) redirect("/login");

  const favoritos = await prisma.politicoFavorito.findMany({
    where: { userId: session.userId },
    include: {
      candidato: {
        include: {
          cargo: true,
          partido: true,
          resultados: {
            select: { municipioId: true, votos: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Meus Políticos</h1>
        <p className="text-gray-600 mt-2">
          Acompanhe a evolução de seus políticos favoritos
        </p>
      </div>

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
          {favoritos.map((favorito) => {
            const totalVotos = favorito.candidato.resultados.reduce(
              (sum, r) => sum + r.votos,
              0
            );

            return (
              <Link
                key={favorito.id}
                href={`/candidatos/${favorito.candidato.id}`}
                className="border rounded-lg p-4 hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
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
                    {favorito.notas && (
                      <p className="mt-3 text-sm text-gray-700 bg-yellow-50 p-2 rounded border-l-4 border-yellow-400">
                        📝 {favorito.notas}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
