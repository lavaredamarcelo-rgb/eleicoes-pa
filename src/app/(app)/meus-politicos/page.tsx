"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Favorito {
  id: string;
  notas: string | null;
  createdAt: string;
  candidato: {
    id: string;
    nome: string;
    eleito: boolean;
    cargo: { id: string; nome: string };
    partido: { sigla: string };
    resultados: Array<{ municipioId: string; votos: number }>;
  };
}

export default function MeusPoliticosPage() {
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [cargos, setCargos] = useState<Array<{ id: string; nome: string }>>([]);
  const [municipios, setMunicipios] = useState<Array<{ id: string; nome: string }>>([]);
  const [carregando, setCarregando] = useState(true);

  const [cargoSelecionado, setCargoSelecionado] = useState("");
  const [municipioSelecionado, setMunicipioSelecionado] = useState("");

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const [favRes, cargosRes, municipiosRes] = await Promise.all([
          fetch("/api/politicos-favoritos"),
          fetch("/api/cargos"),
          fetch("/api/municipios"),
        ]);

        if (favRes.ok) setFavoritos(await favRes.json());
        if (cargosRes.ok) setCargos(await cargosRes.json());
        if (municipiosRes.ok) setMunicipios(await municipiosRes.json());
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setCarregando(false);
      }
    };

    buscarDados();
  }, []);

  const favoritosFiltrados = favoritos.filter((f) => {
    if (cargoSelecionado && f.candidato.cargo.id !== cargoSelecionado)
      return false;
    if (municipioSelecionado) {
      const temMunicipio = f.candidato.resultados.some(
        (r) => r.municipioId === municipioSelecionado
      );
      if (!temMunicipio) return false;
    }
    return true;
  });

  if (carregando) {
    return <div className="text-center py-12">Carregando...</div>;
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg">
          <div>
            <label className="block text-sm font-medium mb-1">Filtrar por cargo:</label>
            <select
              value={cargoSelecionado}
              onChange={(e) => setCargoSelecionado(e.target.value)}
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
            <label className="block text-sm font-medium mb-1">Filtrar por município:</label>
            <select
              value={municipioSelecionado}
              onChange={(e) => setMunicipioSelecionado(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Todos</option>
              {municipios.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {favoritosFiltrados.length === 0 ? (
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
          {favoritosFiltrados.map((favorito) => {
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
