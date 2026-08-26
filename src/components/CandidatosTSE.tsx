"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Users, History } from "lucide-react";
import { PdfDownloadLink } from "@/components/PdfDownloadLink";

const CARGOS_ORDEM = [
  "Governador",
  "Vice-Governador",
  "Senador",
  "Deputado Federal",
  "Deputado Estadual",
];

type CandidatoTSE = {
  cargo: string;
  nome: string;
  numero: number;
  partido: string;
  federacao: string;
  situacao: string;
};

type Pessoa = {
  nomeCompleto: string | null;
  nomesUrna: string[];
  candidaturas: {
    ano: number;
    cargo: string;
    municipio: string | null;
    partido: string;
    nomeUrna: string;
    votos: number;
    eleito: boolean;
  }[];
  trocas: { data: string; de: string; para: string; motivo: string | null }[];
  partidos: string[];
};

type Historico = { pessoas: Pessoa[] };

function LinhaCandidato({ c }: { c: CandidatoTSE }) {
  const [aberto, setAberto] = useState(false);
  const [hist, setHist] = useState<Historico | null>(null);
  const [carregando, setCarregando] = useState(false);

  const toggle = async () => {
    const abrir = !aberto;
    setAberto(abrir);
    if (abrir && !hist && !carregando) {
      setCarregando(true);
      try {
        const res = await fetch(
          `/api/candidatos-tse/historico?nome=${encodeURIComponent(c.nome)}`
        );
        if (res.ok) setHist(await res.json());
      } catch {
        // sem histórico — painel mostra a mensagem padrão
      } finally {
        setCarregando(false);
      }
    }
  };

  return (
    <div>
      <button
        onClick={toggle}
        className="flex w-full items-baseline justify-between gap-2 rounded px-1 py-0.5 text-left text-xs text-neutral-400 transition hover:bg-neutral-900"
        title="Ver histórico político"
      >
        <div>
          <span className="font-medium text-neutral-300">{c.nome}</span>{" "}
          {!c.cargo.startsWith("Deputado") && (
            <span className="text-neutral-600">({c.partido})</span>
          )}
          {c.situacao !== "Concorrendo" && (
            <span className="ml-1.5 rounded bg-red-950/60 px-1.5 py-0.5 text-[10px] text-red-400">
              {c.situacao}
            </span>
          )}
        </div>
        <span className="shrink-0 tabular-nums text-neutral-600">{c.numero}</span>
      </button>

      {aberto && (
        <div className="mb-1 ml-1 mt-0.5 rounded-lg border border-neutral-800/70 bg-neutral-900/60 p-2.5 text-xs">
          {carregando ? (
            <p className="text-neutral-500">Buscando histórico...</p>
          ) : !hist || hist.pessoas.length === 0 ? (
            <p className="text-neutral-500">
              <History size={11} className="mr-1 inline" />
              Sem candidaturas anteriores no sistema (eleições importadas:
              2022 e 2024). Estreante ou nome de urna diferente do usado antes.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {hist.pessoas.length > 1 && (
                <p className="rounded bg-amber-950/40 px-2 py-1 text-[11px] text-amber-300">
                  ⚠ {hist.pessoas.length} políticos diferentes usam nome de urna
                  parecido — confira o nome civil e o município de cada um.
                </p>
              )}
              {hist.pessoas.map((p, pi) => (
                <div
                  key={pi}
                  className={
                    hist.pessoas.length > 1
                      ? "rounded-lg border border-neutral-800/70 p-2"
                      : ""
                  }
                >
                  <p className="mb-1 text-[11px] font-semibold text-neutral-300">
                    {p.nomeCompleto || "Nome civil não informado"}
                    <span className="ml-1 font-normal text-neutral-600">
                      (urna: {p.nomesUrna.join(", ")})
                    </span>
                  </p>
                  {p.candidaturas.length > 0 && (
                    <div className="mb-1.5">
                      <p className="mb-0.5 font-semibold text-amber-300/90">
                        Candidaturas anteriores
                      </p>
                      {p.candidaturas.map((h, i) => (
                        <p key={i} className="text-neutral-400">
                          <span className="text-neutral-300">
                            {h.ano} · {h.cargo}
                          </span>
                          {h.municipio ? ` (${h.municipio})` : ""} · {h.partido}{" "}
                          · {h.votos.toLocaleString("pt-BR")} votos
                          {h.eleito && (
                            <span className="ml-1.5 rounded bg-emerald-950/60 px-1.5 py-0.5 text-[10px] text-emerald-400">
                              Eleito
                            </span>
                          )}
                        </p>
                      ))}
                    </div>
                  )}
                  {p.trocas.length > 0 && (
                    <div className="mb-1.5">
                      <p className="mb-0.5 font-semibold text-amber-300/90">
                        Trocas de partido registradas
                      </p>
                      {p.trocas.map((t, i) => (
                        <p key={i} className="text-neutral-400">
                          {new Date(t.data).toLocaleDateString("pt-BR")}: {t.de}{" "}
                          → {t.para}
                          {t.motivo ? ` (${t.motivo})` : ""}
                        </p>
                      ))}
                    </div>
                  )}
                  {p.partidos.length > 0 && (
                    <p className="text-neutral-500">
                      Partidos no histórico:{" "}
                      <span className="text-neutral-400">
                        {p.partidos.join(", ")}
                      </span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function CandidatosTSE({ candidatos }: { candidatos: CandidatoTSE[] }) {
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({});
  const [busca, setBusca] = useState("");
  const [cargoPdf, setCargoPdf] = useState("");

  const filtrados = busca.trim()
    ? candidatos.filter((c) =>
        c.nome.toLowerCase().includes(busca.trim().toLowerCase())
      )
    : candidatos;

  const porCargo = CARGOS_ORDEM.map((cargo) => ({
    cargo,
    lista: filtrados.filter((c) => c.cargo === cargo),
  })).filter((g) => g.lista.length > 0);

  const toggle = (cargo: string) => {
    setExpandidos((prev) => ({ ...prev, [cargo]: !prev[cargo] }));
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-emerald-900/50 bg-emerald-950/10 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
          <Users size={16} />
          Candidaturas registradas no TSE · 2026 ({candidatos.length})
        </div>
        <div className="flex items-center gap-2">
          <select
            value={cargoPdf}
            onChange={(e) => setCargoPdf(e.target.value)}
            className="rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-1.5 text-xs text-neutral-200 outline-none focus:border-emerald-800"
          >
            <option value="">PDF geral</option>
            {CARGOS_ORDEM.map((c) => (
              <option key={c} value={c}>
                PDF · {c}
              </option>
            ))}
          </select>
          <PdfDownloadLink
            href={`/api/pdf/candidatos-tse${
              cargoPdf ? `?cargo=${encodeURIComponent(cargoPdf)}` : ""
            }`}
            label="Gerar"
          />
        </div>
      </div>

      <input
        type="text"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar candidato pelo nome... (clique no nome para ver o histórico político)"
        className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-200 placeholder-neutral-600 outline-none focus:border-emerald-800"
      />

      <div className="space-y-2">
        {porCargo.map((grupo) => {
          const aberto = expandidos[grupo.cargo] || busca.trim().length > 0;
          return (
            <div key={grupo.cargo}>
              <button
                onClick={() => toggle(grupo.cargo)}
                className="w-full flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-left transition hover:bg-neutral-900"
              >
                <span className="text-xs font-medium text-neutral-300">
                  {grupo.cargo} ({grupo.lista.length})
                </span>
                {aberto ? (
                  <ChevronUp size={14} className="text-neutral-500" />
                ) : (
                  <ChevronDown size={14} className="text-neutral-500" />
                )}
              </button>

              {aberto && grupo.cargo.startsWith("Deputado") ? (
                <div className="mt-1 space-y-2.5 rounded-lg border border-neutral-800 bg-neutral-950 p-2 max-h-96 overflow-y-auto">
                  {Object.entries(
                    grupo.lista.reduce<Record<string, CandidatoTSE[]>>(
                      (acc, c) => {
                        (acc[c.partido] = acc[c.partido] || []).push(c);
                        return acc;
                      },
                      {}
                    )
                  )
                    .sort(
                      (a, b) =>
                        b[1].length - a[1].length ||
                        a[0].localeCompare(b[0], "pt")
                    )
                    .map(([partido, lista]) => (
                      <div key={partido}>
                        <p className="mb-1 border-b border-neutral-800/70 pb-0.5 text-[11px] font-semibold text-amber-300/90">
                          {partido} ({lista.length})
                        </p>
                        <div className="space-y-0.5">
                          {lista.map((c, i) => (
                            <LinhaCandidato key={i} c={c} />
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              ) : aberto ? (
                <div className="mt-1 space-y-0.5 rounded-lg border border-neutral-800 bg-neutral-950 p-2 max-h-96 overflow-y-auto">
                  {grupo.lista.map((c, i) => (
                    <LinhaCandidato key={i} c={c} />
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-neutral-600">
        Fonte: DivulgaCand/TSE, exportado em 24/08/2026. Senado: apenas
        titulares (suplentes não listados). Candidatos inaptos/substituídos
        aparecem marcados. Clique em um nome para ver o histórico político
        (candidaturas 2022/2024 e trocas de partido registradas no sistema).
      </p>
    </div>
  );
}
