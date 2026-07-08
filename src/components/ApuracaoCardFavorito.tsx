"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { removerFavoritoApuracao } from "@/app/actions/apuracao";

type Candidato = {
  numero: string;
  nome: string | null;
  partido: string | null;
  votos: number;
  percentual: string;
  eleito: boolean;
  situacao: string;
};

export type Favorito = {
  id: string;
  rotulo: string;
  ano: string;
  eleicaoCd: string;
  cargoCd: string;
  municipioTse: string | null;
};

const INTERVALO_MS = 60_000;

// Card compacto de uma disputa acompanhada: top-3 ao vivo, atualizado a
// cada minuto (com defasagem por índice para escalonar as consultas).
export function ApuracaoCardFavorito({
  favorito,
  indice,
  aoAbrir,
  registrarAtualizador,
}: {
  favorito: Favorito;
  indice: number;
  aoAbrir: (f: Favorito) => void;
  registrarAtualizador?: (id: string, fn: () => void) => void;
}) {
  const [dados, setDados] = useState<{ candidatos: Candidato[]; meta: Record<string, unknown> } | null>(null);
  const [erro, setErro] = useState(false);
  const [hora, setHora] = useState<Date | null>(null);

  const buscar = useCallback(async () => {
    try {
      const resp = await fetch(
        `/api/apuracao?eleicao=${favorito.eleicaoCd}&ano=${favorito.ano}&cargo=${favorito.cargoCd}&mun=${favorito.municipioTse ?? "estado"}`
      );
      if (!resp.ok) {
        setErro(true);
        return;
      }
      setDados(await resp.json());
      setErro(false);
      setHora(new Date());
    } catch {
      setErro(true);
    }
  }, [favorito]);

  useEffect(() => {
    registrarAtualizador?.(favorito.id, buscar);
    // Defasagem: cada card espera indice*3s antes da primeira consulta,
    // para não disparar todas ao mesmo tempo.
    const inicio = setTimeout(buscar, indice * 3000);
    const intervalo = setInterval(buscar, INTERVALO_MS);
    return () => {
      clearTimeout(inicio);
      clearInterval(intervalo);
    };
  }, [buscar, indice, favorito.id, registrarAtualizador]);

  const top = dados?.candidatos.slice(0, 3) ?? [];
  const total = dados?.candidatos.reduce((s, c) => s + c.votos, 0) ?? 0;
  const maior = top[0]?.votos ?? 0;

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-neutral-800 bg-neutral-900 p-3">
      <div className="flex items-start justify-between gap-2">
        <button
          onClick={() => aoAbrir(favorito)}
          className="text-left text-sm font-medium text-amber-400 hover:underline"
        >
          {favorito.rotulo}
        </button>
        <button
          onClick={() => removerFavoritoApuracao(favorito.id)}
          title="Remover dos favoritos"
          className="rounded-full p-1 text-neutral-600 transition-colors hover:bg-neutral-800 hover:text-neutral-300"
        >
          <X size={14} />
        </button>
      </div>

      {erro && <p className="text-xs text-neutral-500">Sem dados do TSE para esta disputa.</p>}
      {!erro && !dados && <p className="text-xs text-neutral-600">Carregando…</p>}

      {top.map((c) => (
        <div key={c.numero}>
          <div className="mb-0.5 flex items-center justify-between text-xs">
            <span className="truncate text-neutral-200">
              {c.nome ?? `Nº ${c.numero}`}
              {c.partido ? <span className="text-neutral-500"> · {c.partido}</span> : null}
              {c.eleito && <span className="ml-1 text-emerald-400">✓</span>}
            </span>
            <span className="ml-2 shrink-0 font-semibold text-amber-400">
              {total > 0 ? `${((c.votos / total) * 100).toFixed(1)}%` : "—"}
            </span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-800">
            <div
              className="h-1 rounded-full bg-amber-400 transition-all duration-500"
              style={{ width: `${maior > 0 ? (c.votos / maior) * 100 : 0}%` }}
            />
          </div>
        </div>
      ))}

      {dados && (
        <p className="text-[10px] text-neutral-600">
          TSE {String(dados.meta?.dg ?? "")} {String(dados.meta?.hg ?? "")}
          {hora ? ` · card ${hora.toLocaleTimeString("pt-BR")}` : ""}
        </p>
      )}
    </div>
  );
}
