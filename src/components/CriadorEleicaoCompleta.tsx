"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  FileDown,
  FolderOpen,
  Save,
  Sparkles,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { calcularSimulacao, type CandidatoSimulacao } from "@/lib/simulacaoPartido";
import { salvarCenarioEleicao, excluirCenarioEleicao } from "@/app/actions/cenarios";
import { BotaoExcluir } from "@/components/BotaoExcluir";
import { VisorPdf } from "@/components/VisorPdf";

export type CandidatoEleicao = {
  nome: string;
  numero: number;
  partido: string;
  situacao: string;
  histVotos: number;
  histEleito: boolean;
  histResumo: string | null;
};

type CenarioSalvo = {
  id: string;
  titulo: string;
  atualizadoEm: string;
  votos: Record<string, number>;
};

export function CriadorEleicaoCompleta({
  rotulo,
  cargoNome,
  vagas,
  candidatos,
  sugestoes,
  pesquisa,
  rotuloPesquisa,
  cenariosSalvos,
}: {
  rotulo: string;
  cargoNome: string;
  vagas: number;
  candidatos: CandidatoEleicao[];
  sugestoes: Record<string, number>;
  pesquisa: Record<string, number>;
  rotuloPesquisa: string | null;
  cenariosSalvos: CenarioSalvo[];
}) {
  const router = useRouter();

  const maxPesquisa = useMemo(
    () => Math.max(0, ...Object.values(pesquisa)),
    [pesquisa]
  );
  const pctPesquisaDe = (c: CandidatoEleicao) =>
    pesquisa[c.nome.trim().toUpperCase()] ?? null;

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
        lista: lista.sort(
          (a, b) => b.histVotos - a.histVotos || a.nome.localeCompare(b.nome, "pt")
        ),
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
  const [titulo, setTitulo] = useState("");
  const [cenarioAberto, setCenarioAberto] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [pdfAberto, setPdfAberto] = useState<string | null>(null);

  const chave = (c: CandidatoEleicao) => c.numero;

  // Distribuição inteligente dentro de um partido: histórico real pesa
  // (votação anterior, mandato) e a pesquisa mais recente da disputa dá
  // impulso extra; estreante sem pesquisa entra na cauda longa aleatória.
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
      // Impulso da pesquisa: o líder da pesquisa pode até dobrar o peso;
      // um estreante bem pontuado sobe para perto da média histórica.
      const pct = pctPesquisaDe(c);
      if (pct != null && maxPesquisa > 0) {
        peso = Math.max(peso, mediaHist * 0.5) * (1 + pct / maxPesquisa);
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

  const resultado = useMemo(() => {
    if (totalGeral <= 0) return null;
    const partidoById = new Map(
      porPartido.map((p) => [p.sigla, { id: p.sigla, sigla: p.sigla }])
    );
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

  const situacaoDe = (c: CandidatoEleicao) => resultado?.situacao.get(String(c.numero));

  function abrirCenario(c: CenarioSalvo) {
    const novo: Record<number, number> = {};
    for (const [numero, v] of Object.entries(c.votos)) novo[Number(numero)] = v;
    setVotos(novo);
    setTitulo(c.titulo);
    setCenarioAberto(c.id);
    setMsg(null);
  }

  async function salvar(comoNovo: boolean) {
    if (salvando) return;
    setSalvando(true);
    setMsg(null);
    try {
      const votosStr: Record<string, number> = {};
      for (const [n, v] of Object.entries(votos)) if (v > 0) votosStr[n] = v;
      const { id } = await salvarCenarioEleicao({
        id: comoNovo ? undefined : cenarioAberto ?? undefined,
        cargoNome,
        titulo,
        votos: votosStr,
      });
      setCenarioAberto(id);
      setMsg("✓ Cenário salvo.");
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Falha ao salvar.");
    } finally {
      setSalvando(false);
    }
  }

  async function baixarPdf() {
    if (gerandoPdf || totalGeral === 0) return;
    setGerandoPdf(true);
    try {
      const votosStr: Record<string, number> = {};
      for (const [n, v] of Object.entries(votos)) if (v > 0) votosStr[n] = v;
      const resp = await fetch("/api/pdf/eleicao-completa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cargoNome, vagas, titulo: titulo.trim(), votos: votosStr }),
      });
      if (!resp.ok) throw new Error("Falha ao gerar o PDF.");
      setPdfAberto(URL.createObjectURL(await resp.blob()));
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Falha ao gerar o PDF.");
    } finally {
      setGerandoPdf(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {pdfAberto && (
        <VisorPdf
          titulo={`Cenário — ${titulo.trim() || cargoNome}`}
          blobUrl={pdfAberto}
          nomeArquivo={`cenario-${cargoNome.toLowerCase().replace(/\s+/g, "-")}.pdf`}
          aoFechar={() => {
            URL.revokeObjectURL(pdfAberto);
            setPdfAberto(null);
          }}
        />
      )}

      <div className="rounded-xl border border-sky-900/60 bg-sky-950/15 p-4">
        <p className="text-sm font-medium text-sky-300">
          <Sparkles size={14} className="mr-1 inline" />
          Eleição completa — {rotulo}
        </p>
        <p className="mt-1 text-xs text-neutral-500">
          Todos os candidatos registrados no TSE, agrupados por partido. O total sugerido de cada
          partido vem de 2022 escalado para 2026 — edite à vontade. &quot;Gerar&quot; distribui os
          votos pelo histórico real de cada candidato
          {rotuloPesquisa ? " e pela pesquisa mais recente da disputa" : ""}; depois ajuste
          qualquer um à mão — a composição recalcula na hora.
        </p>
        {rotuloPesquisa && (
          <p className="mt-1.5 text-[11px] text-emerald-400">
            <TrendingUp size={11} className="mr-1 inline" />
            Peso extra ativo: pesquisa {rotuloPesquisa} — quem pontua bem puxa mais votos na
            geração.
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            onClick={gerarTodos}
            className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-600"
          >
            🎲 Gerar eleição completa (todos os partidos)
          </button>
          <button
            onClick={baixarPdf}
            disabled={gerandoPdf || totalGeral === 0}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-700 px-3 py-2 text-xs text-neutral-300 transition-colors hover:border-neutral-500 disabled:opacity-40"
          >
            <FileDown size={13} />
            {gerandoPdf ? "Gerando PDF…" : "PDF do cenário"}
          </button>
          {totalGeral > 0 && (
            <p className="text-xs text-neutral-400">
              Votos válidos:{" "}
              <strong className="text-sky-300">{totalGeral.toLocaleString("pt-BR")}</strong>
              {resultado && (
                <>
                  {" "}
                  · QE:{" "}
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

      <div className="rounded-xl border border-amber-900/40 bg-amber-950/10 p-4">
        <p className="mb-2 text-sm font-medium text-amber-300">Cenários salvos desta disputa</p>
        {cenariosSalvos.length > 0 ? (
          <div className="mb-3 flex flex-col gap-1.5">
            {cenariosSalvos.map((c) => (
              <div
                key={c.id}
                className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 ${
                  cenarioAberto === c.id
                    ? "border-amber-700 bg-amber-950/30"
                    : "border-neutral-800 bg-neutral-900"
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-neutral-200">{c.titulo}</p>
                  <p className="text-xs text-neutral-500">
                    {Object.keys(c.votos).length} candidatos ·{" "}
                    {Object.values(c.votos)
                      .reduce((s, v) => s + v, 0)
                      .toLocaleString("pt-BR")}{" "}
                    votos · {c.atualizadoEm}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    onClick={() => abrirCenario(c)}
                    className="flex items-center gap-1 rounded-lg border border-neutral-700 px-2 py-1 text-xs text-neutral-300 transition-colors hover:border-neutral-500"
                  >
                    <FolderOpen size={12} />
                    Abrir
                  </button>
                  <BotaoExcluir
                    nome={c.titulo}
                    acao={async () => {
                      await excluirCenarioEleicao(c.id);
                      if (cenarioAberto === c.id) setCenarioAberto(null);
                      router.refresh();
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mb-3 text-xs text-neutral-600">
            Nenhum cenário salvo ainda — gere a eleição abaixo, dê um título e salve.
          </p>
        )}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-xs text-neutral-500">
              Título do cenário (ex.: Base agosto — pesquisa Doxa)
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Dê um nome para reencontrar depois…"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
            />
          </div>
          <button
            onClick={() => salvar(false)}
            disabled={salvando || !titulo.trim() || totalGeral === 0}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-amber-400 px-3 py-2 text-xs font-semibold text-neutral-950 transition-opacity disabled:opacity-40"
          >
            <Save size={13} />
            {salvando ? "Salvando…" : cenarioAberto ? "Atualizar cenário" : "Salvar cenário"}
          </button>
          {cenarioAberto && (
            <button
              onClick={() => salvar(true)}
              disabled={salvando || !titulo.trim() || totalGeral === 0}
              className="rounded-lg border border-amber-800 px-3 py-2 text-xs font-medium text-amber-300 transition-colors hover:border-amber-600 disabled:opacity-40"
            >
              Salvar como novo
            </button>
          )}
        </div>
        {msg && (
          <p
            className={`mt-2 rounded-lg px-3 py-2 text-xs ${
              msg.startsWith("✓")
                ? "border border-emerald-900 bg-emerald-950/30 text-emerald-300"
                : "border border-red-900 bg-red-950/40 text-red-300"
            }`}
          >
            {msg}
          </p>
        )}
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
                    const pct = pctPesquisaDe(c);
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
                          {pct != null && (
                            <span className="ml-1 rounded bg-emerald-950/60 px-1 py-0.5 text-[9px] text-emerald-400">
                              pesq. {pct.toLocaleString("pt-BR")}%
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
        alimenta a inteligência da distribuição (melhor votação anterior e mandato); o selo verde
        indica presença na pesquisa mais recente. Candidatos inaptos não recebem votos na geração
        automática.
      </p>
    </div>
  );
}
