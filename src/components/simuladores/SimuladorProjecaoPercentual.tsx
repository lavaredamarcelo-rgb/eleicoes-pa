"use client";

import { useMemo, useState } from "react";
import { BotaoPdf } from "@/components/VisorPdf";

type MunicipioVoto = { municipioNome: string; regiaoNome: string; votos: number };
type Distribuicao = {
  id: string;
  nome: string;
  numero: number;
  partidoSigla: string;
  origem: string;
  total: number;
  municipios: MunicipioVoto[];
};

const ATALHOS = [5, 10, 15];

// Projeção percentual sobre a votação real: cada município parte dos votos
// da eleição passada e recebe o MESMO percentual de aumento ou queda — os
// redutos continuam redutos, na mesma proporção.
export function SimuladorProjecaoPercentual({ distribuicao }: { distribuicao: Distribuicao }) {
  const [direcao, setDirecao] = useState<"aumentar" | "diminuir">("aumentar");
  const [pct, setPct] = useState(10);

  const pctAssinado = direcao === "aumentar" ? pct : -pct;
  const fator = Math.max(0, 1 + pctAssinado / 100);

  const linhas = useMemo(
    () =>
      distribuicao.municipios.map((m) => {
        const projetados = Math.round(m.votos * fator);
        return { ...m, projetados, diferenca: projetados - m.votos };
      }),
    [distribuicao, fator]
  );

  const totalProjetado = linhas.reduce((s, l) => s + l.projetados, 0);

  const porRegiao = useMemo(() => {
    const mapa = new Map<string, { votos: number; projetados: number }>();
    for (const l of linhas) {
      const atual = mapa.get(l.regiaoNome) ?? { votos: 0, projetados: 0 };
      atual.votos += l.votos;
      atual.projetados += l.projetados;
      mapa.set(l.regiaoNome, atual);
    }
    return Array.from(mapa.entries())
      .map(([regiao, v]) => ({ regiao, ...v }))
      .sort((a, b) => b.projetados - a.projetados);
  }, [linhas]);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-neutral-300">
              {distribuicao.nome}{" "}
              <span className="text-xs text-neutral-500">
                ({distribuicao.numero} · {distribuicao.partidoSigla})
              </span>
            </p>
            <p className="text-xs text-neutral-500">
              Última candidatura: {distribuicao.origem} ·{" "}
              {distribuicao.total.toLocaleString("pt-BR")} votos
            </p>
          </div>
          <BotaoPdf
            href={`/api/pdf/meta-percentual?candidato=${distribuicao.id}&pct=${pctAssinado}`}
            titulo={`Projeção percentual — ${distribuicao.nome}`}
            nomeArquivo="projecao-percentual.pdf"
          />
        </div>

        <div className="mt-3 flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-xs text-neutral-500">Quero…</label>
            <select
              value={direcao}
              onChange={(e) => setDirecao(e.target.value as "aumentar" | "diminuir")}
              className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
            >
              <option value="aumentar">Aumentar os votos</option>
              <option value="diminuir">Diminuir os votos</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-neutral-500">Percentual</label>
            <div className="flex items-center gap-1.5">
              {ATALHOS.map((a) => (
                <button
                  key={a}
                  onClick={() => setPct(a)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    pct === a
                      ? "bg-amber-400 text-neutral-950"
                      : "border border-neutral-700 text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  {a}%
                </button>
              ))}
              <input
                type="number"
                min={0}
                max={500}
                value={pct}
                onChange={(e) => setPct(Math.max(0, Number(e.target.value)))}
                className="w-20 rounded-lg border border-neutral-700 bg-neutral-950 px-2 py-1.5 text-sm text-neutral-100"
              />
              <span className="text-xs text-neutral-500">%</span>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-lg border border-amber-900 bg-amber-950/20 px-4 py-3">
          <p className="text-xs text-amber-300">
            Projeção total ({pctAssinado > 0 ? "+" : ""}
            {pctAssinado}% em cada município)
          </p>
          <p className="text-2xl font-bold text-amber-300">
            {totalProjetado.toLocaleString("pt-BR")}
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            {distribuicao.total.toLocaleString("pt-BR")} votos na eleição passada →{" "}
            {totalProjetado >= distribuicao.total ? "+" : ""}
            {(totalProjetado - distribuicao.total).toLocaleString("pt-BR")} votos
          </p>
        </div>
      </div>

      {porRegiao.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
          <p className="border-b border-neutral-800 px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-neutral-500">
            Resumo por região
          </p>
          {porRegiao.map((r) => (
            <div
              key={r.regiao}
              className="grid gap-2 border-b border-neutral-800/50 px-4 py-2 text-xs last:border-0"
              style={{ gridTemplateColumns: "2fr 1fr 1fr" }}
            >
              <span className="text-neutral-300">{r.regiao}</span>
              <span className="text-right text-neutral-500">{r.votos.toLocaleString("pt-BR")}</span>
              <span className="text-right font-medium text-amber-400">
                {r.projetados.toLocaleString("pt-BR")}
              </span>
            </div>
          ))}
        </div>
      )}

      {linhas.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
          <div
            className="grid gap-2 border-b border-neutral-800 px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-neutral-500"
            style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}
          >
            <span>Município</span>
            <span className="text-right">Votos anteriores</span>
            <span className="text-right">Projetados</span>
            <span className="text-right">Diferença</span>
          </div>
          {linhas.map((l) => (
            <div
              key={l.municipioNome}
              className="grid gap-2 border-b border-neutral-800/50 px-4 py-2 text-xs last:border-0"
              style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}
            >
              <span className="text-neutral-300">
                {l.municipioNome}{" "}
                <span className="text-[10px] text-neutral-600">{l.regiaoNome}</span>
              </span>
              <span className="text-right text-neutral-500">{l.votos.toLocaleString("pt-BR")}</span>
              <span className="text-right font-medium text-amber-400">
                {l.projetados.toLocaleString("pt-BR")}
              </span>
              <span
                className={`text-right ${l.diferenca > 0 ? "text-emerald-400" : l.diferenca < 0 ? "text-red-400" : "text-neutral-500"}`}
              >
                {l.diferenca > 0 ? "+" : ""}
                {l.diferenca.toLocaleString("pt-BR")}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-neutral-500">
          Esse candidato não tem votos registrados — use a distribuição manual para montar o
          cenário do zero.
        </p>
      )}

      <p className="text-xs text-neutral-600">
        Projeção hipotética — o percentual é aplicado sobre os votos reais da última eleição em
        cada município, preservando os redutos. Nada é alterado no sistema.
      </p>
    </div>
  );
}
