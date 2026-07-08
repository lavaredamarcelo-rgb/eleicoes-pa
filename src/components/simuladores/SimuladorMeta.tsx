"use client";

import { useMemo, useState } from "react";

type Distribuicao = {
  nome: string;
  numero: number;
  partidoSigla: string;
  total: number;
  municipios: { municipioNome: string; votos: number }[];
};

const LIMITE_LINHAS = 15;

// Meta de campanha: dado um alvo de votos, distribui a necessidade por
// município mantendo o perfil geográfico da última votação do candidato.
export function SimuladorMeta({ distribuicao }: { distribuicao: Distribuicao }) {
  const [meta, setMeta] = useState(Math.round(distribuicao.total * 1.2));

  const linhas = useMemo(() => {
    if (distribuicao.total === 0) return [];
    return distribuicao.municipios.slice(0, LIMITE_LINHAS).map((m) => {
      const necessarios = Math.round((m.votos / distribuicao.total) * meta);
      return { ...m, necessarios, diferenca: necessarios - m.votos };
    });
  }, [distribuicao, meta]);

  const cobertos = distribuicao.municipios
    .slice(0, LIMITE_LINHAS)
    .reduce((s, m) => s + m.votos, 0);
  const restantes = distribuicao.municipios.length - LIMITE_LINHAS;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
        <p className="text-sm font-medium text-neutral-300">
          {distribuicao.nome}{" "}
          <span className="text-xs text-neutral-500">
            ({distribuicao.numero} · {distribuicao.partidoSigla})
          </span>
        </p>
        <p className="text-xs text-neutral-500">
          Última votação: {distribuicao.total.toLocaleString("pt-BR")} votos em{" "}
          {distribuicao.municipios.length} municípios
        </p>
        <div className="mt-3">
          <label className="mb-1 block text-xs text-neutral-500">Meta de votos</label>
          <input
            type="number"
            min={0}
            value={meta}
            onChange={(e) => setMeta(Math.max(0, Number(e.target.value)))}
            className="w-44 rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
          />
          <span className="ml-3 text-xs text-neutral-500">
            {distribuicao.total > 0
              ? `${(((meta - distribuicao.total) / distribuicao.total) * 100).toFixed(1)}% vs última votação`
              : ""}
          </span>
        </div>
      </div>

      {linhas.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
          <div className="grid grid-cols-4 gap-2 border-b border-neutral-800 px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-neutral-500">
            <span>Município</span>
            <span className="text-right">Última votação</span>
            <span className="text-right">Necessários</span>
            <span className="text-right">A conquistar</span>
          </div>
          {linhas.map((l) => (
            <div
              key={l.municipioNome}
              className="grid grid-cols-4 gap-2 border-b border-neutral-800/50 px-4 py-2 text-xs last:border-0"
            >
              <span className="text-neutral-300">{l.municipioNome}</span>
              <span className="text-right text-neutral-500">{l.votos.toLocaleString("pt-BR")}</span>
              <span className="text-right font-medium text-amber-400">
                {l.necessarios.toLocaleString("pt-BR")}
              </span>
              <span className={`text-right ${l.diferenca > 0 ? "text-emerald-400" : "text-neutral-500"}`}>
                {l.diferenca > 0 ? `+${l.diferenca.toLocaleString("pt-BR")}` : l.diferenca.toLocaleString("pt-BR")}
              </span>
            </div>
          ))}
          {restantes > 0 && (
            <p className="px-4 py-2 text-[11px] text-neutral-600">
              Mostrando os {LIMITE_LINHAS} maiores redutos ({((cobertos / distribuicao.total) * 100).toFixed(0)}%
              dos votos); a meta se distribui proporcionalmente pelos {restantes} demais municípios.
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-neutral-500">Esse candidato não tem votação registrada.</p>
      )}
    </div>
  );
}
