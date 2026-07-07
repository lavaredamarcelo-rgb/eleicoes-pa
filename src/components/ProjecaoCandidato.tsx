"use client";

import { useMemo, useState } from "react";
import { PdfDownloadLink } from "./PdfDownloadLink";

type ResultadoMunicipio = {
  municipioId: string;
  municipioNome: string;
  regiaoNome: string;
  votosAtuais: number;
};

export function ProjecaoCandidato({
  candidatoId,
  resultados,
}: {
  candidatoId: string;
  resultados: ResultadoMunicipio[];
}) {
  const [metodo, setMetodo] = useState<"percentual" | "meta">("percentual");
  const [percentual, setPercentual] = useState(10);
  const [meta, setMeta] = useState(() =>
    Math.round(resultados.reduce((s, r) => s + r.votosAtuais, 0) * 1.1)
  );

  const totalAtual = useMemo(
    () => resultados.reduce((s, r) => s + r.votosAtuais, 0),
    [resultados]
  );

  const fator = useMemo(() => {
    if (metodo === "percentual") return 1 + percentual / 100;
    if (totalAtual <= 0) return 1;
    return meta / totalAtual;
  }, [metodo, percentual, meta, totalAtual]);

  const projetados = useMemo(
    () =>
      resultados.map((r) => ({
        ...r,
        votosProjetados: Math.max(0, Math.round(r.votosAtuais * fator)),
      })),
    [resultados, fator]
  );

  const totalProjetado = projetados.reduce((s, r) => s + r.votosProjetados, 0);
  const variacaoPct = totalAtual > 0 ? ((totalProjetado - totalAtual) / totalAtual) * 100 : 0;

  const porRegiao = useMemo(() => {
    const map = new Map<string, { nome: string; atual: number; projetado: number }>();
    for (const r of projetados) {
      const atual = map.get(r.regiaoNome);
      if (atual) {
        atual.atual += r.votosAtuais;
        atual.projetado += r.votosProjetados;
      } else {
        map.set(r.regiaoNome, {
          nome: r.regiaoNome,
          atual: r.votosAtuais,
          projetado: r.votosProjetados,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.projetado - a.projetado);
  }, [projetados]);

  const pdfHref =
    metodo === "percentual"
      ? `/api/pdf/projecao/${candidatoId}?metodo=percentual&valor=${percentual}`
      : `/api/pdf/projecao/${candidatoId}?metodo=meta&valor=${meta}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <button
          onClick={() => setMetodo("percentual")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            metodo === "percentual" ? "bg-amber-400 text-neutral-950" : "bg-neutral-900 text-neutral-400"
          }`}
        >
          Crescimento %
        </button>
        <button
          onClick={() => setMetodo("meta")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            metodo === "meta" ? "bg-amber-400 text-neutral-950" : "bg-neutral-900 text-neutral-400"
          }`}
        >
          Meta de votos
        </button>
      </div>

      {metodo === "percentual" ? (
        <div>
          <label className="mb-1 block text-xs text-neutral-500">
            Crescimento percentual sobre o total atual
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={-50}
              max={100}
              value={percentual}
              onChange={(e) => setPercentual(Number(e.target.value))}
              className="flex-1"
            />
            <span className="w-16 text-right text-sm font-semibold text-amber-400">
              {percentual > 0 ? "+" : ""}
              {percentual}%
            </span>
          </div>
        </div>
      ) : (
        <div>
          <label className="mb-1 block text-xs text-neutral-500">Meta de votos totais</label>
          <input
            type="number"
            min={0}
            value={meta}
            onChange={(e) => setMeta(Number(e.target.value))}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
          />
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-3 text-center">
          <p className="text-lg font-semibold">{totalAtual.toLocaleString("pt-BR")}</p>
          <p className="text-[11px] text-neutral-500">Votos atuais</p>
        </div>
        <div className="rounded-xl border border-amber-900 bg-amber-950/40 px-3 py-3 text-center">
          <p className="text-lg font-semibold text-amber-300">
            {totalProjetado.toLocaleString("pt-BR")}
          </p>
          <p className="text-[11px] text-amber-400/70">Votos projetados</p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-3 text-center">
          <p
            className={`text-lg font-semibold ${variacaoPct >= 0 ? "text-emerald-400" : "text-red-400"}`}
          >
            {variacaoPct >= 0 ? "+" : ""}
            {variacaoPct.toFixed(1)}%
          </p>
          <p className="text-[11px] text-neutral-500">Variação</p>
        </div>
      </div>

      <PdfDownloadLink href={pdfHref} label="Baixar PDF da projeção" />

      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-neutral-500">Projeção por região</p>
        {porRegiao.map((r) => (
          <div
            key={r.nome}
            className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2"
          >
            <span>{r.nome}</span>
            <span className="text-sm">
              <span className="text-neutral-500">{r.atual.toLocaleString("pt-BR")}</span>
              {" → "}
              <span className="font-medium text-amber-400">
                {r.projetado.toLocaleString("pt-BR")}
              </span>
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-neutral-600">
        Projeção meramente estimativa, distribuída proporcionalmente entre os municípios com base
        no padrão de votação atual. Não substitui pesquisa eleitoral.
      </p>
    </div>
  );
}
