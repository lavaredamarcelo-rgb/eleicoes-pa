"use client";

import { useMemo, useState } from "react";
import { FileDown, Search } from "lucide-react";

type MunicipioOpcao = { id: string; nome: string; regiaoNome: string };

// Cenário montado à mão: o usuário dá um nome ao pretenso candidato (mesmo
// quem nunca disputou) e alimenta os votos município a município. O resumo
// mostra o total e a leitura por região, e o PDF documenta a distribuição.
export function SimuladorMetaManual({
  municipios,
  nomeInicial,
  votosIniciais,
}: {
  municipios: MunicipioOpcao[];
  nomeInicial?: string;
  votosIniciais?: Record<string, number>; // nome do município → votos
}) {
  const [nome, setNome] = useState(nomeInicial ?? "");
  const [filtro, setFiltro] = useState("");
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [votos, setVotos] = useState<Record<string, number>>(() => {
    if (!votosIniciais) return {};
    const porNome: Record<string, number> = {};
    for (const m of municipios) {
      const v = votosIniciais[m.nome];
      if (v && v > 0) porNome[m.id] = v;
    }
    return porNome;
  });

  const normalizar = (t: string) =>
    t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const filtroNorm = normalizar(filtro.trim());
  const visiveis = filtroNorm
    ? municipios.filter((m) => normalizar(m.nome).includes(filtroNorm))
    : municipios;

  const total = useMemo(
    () => Object.values(votos).reduce((s, v) => s + (v > 0 ? v : 0), 0),
    [votos]
  );
  const comVotos = Object.values(votos).filter((v) => v > 0).length;

  const porRegiao = useMemo(() => {
    const mapa = new Map<string, number>();
    for (const m of municipios) {
      const v = votos[m.id];
      if (v && v > 0) mapa.set(m.regiaoNome, (mapa.get(m.regiaoNome) ?? 0) + v);
    }
    return Array.from(mapa.entries())
      .map(([regiao, soma]) => ({ regiao, votos: soma }))
      .sort((a, b) => b.votos - a.votos);
  }, [votos, municipios]);

  function definirVotos(id: string, valor: number) {
    setVotos((atual) => {
      const novo = { ...atual };
      if (valor > 0) novo[id] = valor;
      else delete novo[id];
      return novo;
    });
  }

  async function baixarPdf() {
    if (gerandoPdf || total === 0) return;
    setGerandoPdf(true);
    try {
      const itens = municipios
        .filter((m) => (votos[m.id] ?? 0) > 0)
        .map((m) => ({ municipio: m.nome, regiao: m.regiaoNome, votos: votos[m.id] }));
      const resp = await fetch("/api/pdf/meta-manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nome.trim() || "Pretenso candidato", itens }),
      });
      if (!resp.ok) throw new Error("Falha ao gerar o PDF.");
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `meta-manual-${(nome.trim() || "candidato").toLowerCase().replace(/[^a-z0-9]+/gi, "-")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setGerandoPdf(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-neutral-500">
              Nome do pretenso candidato (pode ser alguém que nunca disputou)
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: Chicão"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={baixarPdf}
              disabled={gerandoPdf || total === 0}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-700 px-3 py-2 text-xs text-neutral-300 transition-colors hover:border-neutral-500 disabled:opacity-40"
            >
              <FileDown size={13} />
              {gerandoPdf ? "Gerando PDF…" : "Baixar PDF da distribuição"}
            </button>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-amber-900 bg-amber-950/20 px-3 py-2">
            <p className="text-[11px] text-amber-300">Total de votos</p>
            <p className="text-lg font-bold text-amber-300">{total.toLocaleString("pt-BR")}</p>
          </div>
          <div className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2">
            <p className="text-[11px] text-neutral-500">Municípios alimentados</p>
            <p className="text-lg font-bold text-neutral-200">
              {comVotos} <span className="text-xs font-normal text-neutral-500">de {municipios.length}</span>
            </p>
          </div>
          <div className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2">
            <p className="text-[11px] text-neutral-500">Regiões alcançadas</p>
            <p className="text-lg font-bold text-neutral-200">{porRegiao.length}</p>
          </div>
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
              <span className="text-right font-medium text-amber-400">
                {r.votos.toLocaleString("pt-BR")}
              </span>
              <span className="text-right text-neutral-500">
                {total > 0 ? `${((r.votos / total) * 100).toFixed(1)}%` : "—"}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
        <div className="border-b border-neutral-800 p-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
            <input
              type="text"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              placeholder="Filtrar município… (ex.: Santarém)"
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 py-2 pl-9 pr-3 text-sm text-neutral-100"
            />
          </div>
        </div>
        <div className="max-h-[28rem] overflow-y-auto">
          {visiveis.map((m) => (
            <div
              key={m.id}
              className="grid items-center gap-2 border-b border-neutral-800/50 px-4 py-1.5 text-xs last:border-0"
              style={{ gridTemplateColumns: "2fr 1fr" }}
            >
              <span className="text-neutral-300">
                {m.nome} <span className="text-[10px] text-neutral-600">{m.regiaoNome}</span>
              </span>
              <input
                type="number"
                min={0}
                value={votos[m.id] ?? ""}
                placeholder="0"
                onChange={(e) => definirVotos(m.id, Math.max(0, Number(e.target.value)))}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-1.5 text-right text-xs text-neutral-100"
              />
            </div>
          ))}
          {visiveis.length === 0 && (
            <p className="px-4 py-3 text-xs text-neutral-500">Nenhum município com esse nome.</p>
          )}
        </div>
      </div>

      <p className="text-xs text-neutral-600">
        Cenário fictício montado à mão — nada é alterado no sistema. Selecione um candidato na
        busca acima para começar com os votos reais dele já preenchidos.
      </p>
    </div>
  );
}
