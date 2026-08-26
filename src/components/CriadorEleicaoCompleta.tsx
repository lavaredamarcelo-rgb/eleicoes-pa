"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Sparkles, Trophy } from "lucide-react";
import { calcularSimulacao, type CandidatoSimulacao } from "@/lib/simulacaoPartido";

export type CandidatoEleicao = {
  nome: string;
  numero: number;
  partido: string;
  situacao: string;
  histVotos: number;
  histEleito: boolean;
  histResumo: string | null;
};

export function CriadorEleicaoCompleta({
  rotulo,
  vagas,
  candidatos,
  sugestoes,
}: {
  rotulo: string;
  vagas: number;
  candidatos: CandidatoEleicao[];
  sugestoes: Record<string, number>;
}) {
  const porPartido = useMemo(() => {
    const mapa = new Map<string, CandidatoEleicao[]>();
    for (const c of candidatos) {
      const lista = mapa.get(c.partido);
      if (lista) lista.push(c);
      else mapa.set(c.partido, [c]);
    }
    return Array.from(mapa.entries())
      .map(([sigla, lista]) => ({
        sigla,
        lista: lista.sort((a, b) => b.histVotos - a.histVotos || a.nome.localeCompare(b.nome, "pt")),
        sugestao: sugestoes[sigla] ?? 0,
      }))
      .sort((a, b) => b.sugestao - a.sugestao || b.lista.length - a.lista.length);
  }, [candidatos, sugestoes]);

  const [totais, setTotais] = useState<Record<string, string>>(() => {
    const t: Record<string, string> = {};
    for (const p of porPartido) t[p.sigla] = p.sugestao > 0 ? String(p.sugestao) : "";
    return t;
  });
  const [votos, setVotos] = useState<Record<number, number>>({});
  const [abertos, setAbertos] = useState<Record<string, boolean>>({});

  const chave = (c: CandidatoEleicao) => c.numero;

  // Distribuição inteligente dentro de um partido: quem tem histórico pesa
  // pelos votos reais (com bônus de mandato); estreante entra numa cauda
  // longa aleatória — como nas eleições reais, poucos puxadores e muitos
  // com votação baixa.
  function gerarPartido(sigla: string, base?: Record<number, number>) {
    const grupo = porPartido.find((p) => p.sigla === sigla);
    if (!grupo) return {};
    const alvo = Math.round(Number((totais[sigla] || "").replace(/\D/g, "")) || 0);
    const novo: Record<number, number> = base ?? {};
    if (alvo <= 0) return novo;

    const aptos = grupo.lista.filter((c) => c.situacao === "Concorrendo");
    if (aptos.length === 0) return novo;

    const historicos = aptos.filter((c) => c.histVotos > 0);
    const mediaHist =
      historicos.length > 0
        ? historicos.reduce((s, c) => s + c.histVotos, 0) / historicos.length
        : 3000;
    const baseNovato = Math.max(300, mediaHist * 0.2);

    const pesos = aptos.map((c) => {
      let peso: number;
      if (c.histVotos > 0) {
        peso = c.histVotos * (c.histEleito ? 1.3 : 1) * (0.75 + Math.random() * 0.5);
      } else {
        peso = baseNovato * (0.1 + Math.pow(Math.random(), 1.7) * 1.9);
      }
      return { numero: c.numero, peso };
    });
    const soma = pesos.reduce((s, p) => s + p.peso, 0);
    let acumulado = 0;
    for (const p of pesos) {
      const v = Math.round((alvo * p.peso) / soma);
      novo[p.numero] = v;
      acumulado += v;
    }
    const dif = alvo - acumulado;
    if (dif !== 0) {
      const maior = [...pesos].sort((a, b) => b.peso - a.peso)[0];
      novo[maior.numero] = Math.max(0, (novo[maior.numero] ?? 0) + dif);
    }
    return novo;
  }

  function gerarUmPartido(sigla: string) {
    setVotos((atual) => ({ ...atual, ...gerarPartido(sigla) }));
    setAbertos((a) => ({ ...a, [sigla]: true }));
  }

  function gerarTodos() {
    let novo: Record<number, number> = {};
    for (const p of porPartido) novo = gerarPartido(p.sigla, novo);
    setVotos(novo);
  }

  const totalGeral = useMemo(
    () => Object.values(votos).reduce((s, v) => s + (v > 0 ? v : 0), 0),
    [votos]
  );

  // Quociente + cadeiras + situação de cada candidato, recalculado ao vivo.
  const resultado = useMemo(() => {
    if (totalGeral <= 0) return null;
    const partidoById = new Map(porPartido.map((p) => [p.sigla, { id: p.sigla, sigla: p.sigla }]));
    const sims: CandidatoSimulacao[] = candidatos
      .filter((c) => (votos[chave(c)] ?? 0) > 0)
      .map((c) => ({
        id: String(c.numero),
        nome: c.nome,
        numero: c.numero,
        votos: votos[chave(c)] ?? 0,
        partidoId: c.partido,
        partidoSigla: c.partido,
      }));
    return calcularSimulacao(sims, vagas, new Map(), partidoById as any, {});
  }, [candidatos, votos, totalGeral, vagas, porPartido]);

  const situacaoDe = (c: CandidatoEleicao) =>
    resultado?.situacao.get(String(c.numero));

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-sky-900/60 bg-sky-950/15 p-4">
        <p className="text-sm font-medium text-sky-300">
          <Sparkles size={14} className="mr-1 inline" />
          Eleição completa — {rotulo}
        </p>
        <p className="mt-1 text-xs text-neutral-500">
          Todos os candidatos registrados no TSE, agrupados por partido. O total sugerido de cada
          partido vem do desempenho de 2022 escalado para o eleitorado de 2026 — edite à vontade.
          &quot;Gerar&quot; distribui os votos entre os candidatos do partido levando em conta o
          histórico real de cada um (votação anterior e mandatos pesam mais; estreantes entram na
          cauda). Depois ajuste qualquer candidato à mão — a composição recalcula na hora.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            onClick={gerarTodos}
            className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-600"
          >
            🎲 Gerar eleição completa (todos os partidos)
          </button>
          {totalGeral > 0 && (
            <p className="text-xs text-neutral-400">
              Votos válidos: <strong className="text-sky-300">{totalGeral.toLocaleString("pt-BR")}</strong>
              {resultado && (
                <>
                  {" "}· QE:{" "}
                  <strong className="text-sky-300">
                    {resultado.quocienteEleitoral.toLocaleString("pt-BR")}
                  </strong>{" "}
                  · {vagas} vagas
                </>
              )}
            </p>
          )}
        </div>
      </div>

      {resultado && (
        <div className="rounded-xl border border-amber-900/60 bg-amber-950/15 p-4">
          <p className="mb-2 text-sm font-medium text-amber-300">
            <Trophy size={14} className="mr-1 inline" />
            Composição resultante
          </p>
          <div className="flex flex-wrap gap-2">
            {resultado.partidos
              .filter((p) => p.quocientePartidario > 0)
              .map((p) => (
                <span
                  key={p.partidoId}
                  className="rounded-lg border border-amber-900/50 bg-neutral-950 px-2.5 py-1 text-xs text-neutral-200"
                >
                  <strong className="text-amber-300">{p.sigla}</strong> ·{" "}
                  {p.quocientePartidario} cadeira{p.quocientePartidario > 1 ? "s" : ""}
                </span>
              ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {porPartido.map((p) => {
          const somaPartido = p.lista.reduce((s, c) => s + (votos[chave(c)] ?? 0), 0);
          const cadeiras =
            resultado?.partidos.find((x) => x.partidoId === p.sigla)?.quocientePartidario ?? 0;
          return (
            <div key={p.sigla} className="rounded-xl border border-neutral-800 bg-neutral-900">
              <div className="flex flex-wrap items-center gap-2 px-3 py-2.5">
                <button
                  onClick={() => setAbertos((a) => ({ ...a, [p.sigla]: !a[p.sigla] }))}
                  className="flex flex-1 items-center gap-2 text-left"
                >
                  {abertos[p.sigla] ? (
                    <ChevronUp size={14} className="text-neutral-500" />
                  ) : (
                    <ChevronDown size={14} className="text-neutral-500" />
                  )}
                  <span className="text-sm font-medium text-neutral-200">{p.sigla}</span>
                  <span className="text-xs text-neutral-500">
                    {p.lista.length} candidatos
                    {somaPartido > 0 ? ` · ${somaPartido.toLocaleString("pt-BR")} votos` : ""}
                  </span>
                  {cadeiras > 0 && (
                    <span className="rounded bg-amber-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
                      {cadeiras} cadeira{cadeiras > 1 ? "s" : ""}
                    </span>
                  )}
                </button>
                <input
                  type="number"
                  min={0}
                  value={totais[p.sigla] ?? ""}
                  onChange={(e) => setTotais((t) => ({ ...t, [p.sigla]: e.target.value }))}
                  placeholder="Total do partido"
                  className="w-32 rounded-lg border border-neutral-700 bg-neutral-950 px-2 py-1.5 text-right text-xs text-neutral-100"
                />
                <button
                  onClick={() => gerarUmPartido(p.sigla)}
                  disabled={!totais[p.sigla] || Number(totais[p.sigla]) <= 0}
                  className="rounded-lg bg-sky-800 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-sky-700 disabled:opacity-40"
                >
                  Gerar
                </button>
              </div>

              {abertos[p.sigla] && (
                <div className="max-h-96 overflow-y-auto border-t border-neutral-800">
                  {p.lista.map((c) => {
                    const sit = situacaoDe(c);
                    return (
                      <div
                        key={c.numero}
                        className="grid items-center gap-2 border-b border-neutral-800/50 px-3 py-1.5 text-xs last:border-0"
                        style={{ gridTemplateColumns: "2.2fr 1.4fr 1fr auto" }}
                      >
                        <span className="truncate text-neutral-300">
                          {c.nome}{" "}
                          <span className="text-[10px] text-neutral-600">{c.numero}</span>
                          {c.situacao !== "Concorrendo" && (
                            <span className="ml-1 rounded bg-red-950/60 px-1 py-0.5 text-[9px] text-red-400">
                              {c.situacao}
                            </span>
                          )}
                        </span>
                        <span className="truncate text-[10px] text-neutral-600">
                          {c.histResumo ?? "estreante"}
                        </span>
                        <input
                          type="number"
                          min={0}
                          value={votos[chave(c)] ?? ""}
                          placeholder="0"
                          onChange={(e) =>
                            setVotos((v) => ({
                              ...v,
                              [chave(c)]: Math.max(0, Number(e.target.value)),
                            }))
                          }
                          className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-1 text-right text-xs text-neutral-100"
                        />
                        <span className="w-20 text-right">
                          {sit?.situacao === "eleito" ? (
                            <span className="rounded bg-emerald-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                              Eleito
                            </span>
                          ) : sit?.situacao === "suplente" && cadeiras > 0 ? (
                            <span className="text-[10px] text-neutral-500">
                              {sit.ordemSuplencia}º supl.
                            </span>
                          ) : (
                            <span className="text-[10px] text-neutral-700">—</span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-neutral-600">
        Cenário fictício — nada altera os dados reais. A coluna do meio mostra o histórico que
        alimenta a inteligência da distribuição (melhor votação anterior e mandato). Candidatos
        inaptos não recebem votos na geração automática.
      </p>
    </div>
  );
}
