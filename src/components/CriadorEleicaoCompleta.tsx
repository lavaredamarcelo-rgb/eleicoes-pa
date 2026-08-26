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
  curvas,
  curvaGlobal,
  legendaShare,
  referencia,
}: {
  rotulo: string;
  cargoNome: string;
  vagas: number;
  candidatos: CandidatoEleicao[];
  sugestoes: Record<string, number>;
  pesquisa: Record<string, number>;
  rotuloPesquisa: string | null;
  cenariosSalvos: CenarioSalvo[];
  curvas: Record<string, number[]>;
  curvaGlobal: number[];
  legendaShare: Record<string, number>;
  referencia: { ano: number; validos: number; qe: number } | null;
}) {
  const router = useRouter();

  const maxPesquisa = useMemo(() => Math.max(0, ...Object.values(pesquisa)), [pesquisa]);
  const pctPesquisaDe = (c: CandidatoEleicao) => pesquisa[c.nome.trim().toUpperCase()] ?? null;

  // Teto realista: ninguém foge muito do campeão de votos da última
  // eleição (escalado) — ex.: Dep. Estadual 2022 ≈ 109 mil.
  const tetoRealista = curvaGlobal.length > 0 ? Math.round(curvaGlobal[0] * 1.1) : Infinity;

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
  const [legendaGerada, setLegendaGerada] = useState<Record<string, number>>({});
  const [abertos, setAbertos] = useState<Record<string, boolean>>({});
  const [titulo, setTitulo] = useState("");
  const [cenarioAberto, setCenarioAberto] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [pdfAberto, setPdfAberto] = useState<string | null>(null);

  const chave = (c: CandidatoEleicao) => c.numero;

  // Geração realista por partido:
  // 1) O total informado separa a fatia de LEGENDA (mesma proporção de 2022).
  // 2) O peso de cada candidato (histórico real + mandato + pesquisa +
  //    aleatoriedade) define a ORDEM na lista.
  // 3) Os VALORES seguem a curva real de votação de 2022 do próprio partido
  //    (ou a curva geral da disputa), com teto no campeão histórico.
  function gerarPartido(
    sigla: string,
    baseVotos?: Record<number, number>,
    baseLegenda?: Record<string, number>
  ) {
    const grupo = porPartido.find((p) => p.sigla === sigla);
    const novoVotos: Record<number, number> = baseVotos ?? {};
    const novaLegenda: Record<string, number> = baseLegenda ?? {};
    if (!grupo) return { novoVotos, novaLegenda };
    const alvo = Math.round(Number((totais[sigla] || "").replace(/\D/g, "")) || 0);
    if (alvo <= 0) return { novoVotos, novaLegenda };

    const aptos = grupo.lista.filter((c) => c.situacao === "Concorrendo");
    if (aptos.length === 0) return { novoVotos, novaLegenda };

    const share = legendaShare[sigla] ?? 0.05;
    const votosLegenda = Math.round(alvo * share);
    const nominalAlvo = alvo - votosLegenda;
    novaLegenda[sigla] = votosLegenda;

    // Pesos → ordem dos candidatos.
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
      const pct = pctPesquisaDe(c);
      if (pct != null && maxPesquisa > 0) {
        peso = Math.max(peso, mediaHist * 0.5) * (1 + pct / maxPesquisa);
      }
      return { numero: c.numero, peso };
    });
    pesos.sort((a, b) => b.peso - a.peso);

    // Curva de valores: a votação real de 2022 do partido (escalada) —
    // ou a curva geral da disputa quando o partido é novo.
    const curvaBase =
      (curvas[sigla]?.length ?? 0) >= 5 ? curvas[sigla] : curvaGlobal;
    const n = pesos.length;
    const curvaVals: number[] = [];
    for (let i = 0; i < n; i++) {
      if (i < curvaBase.length) curvaVals.push(curvaBase[i]);
      else {
        const ultimo = curvaVals[curvaVals.length - 1] ?? 1000;
        curvaVals.push(Math.max(50, ultimo * 0.85));
      }
    }
    const somaCurva = curvaVals.reduce((s, v) => s + v, 0);
    const somaPesos = pesos.reduce((s, p) => s + p.peso, 0);

    // Mistura: 60% formato histórico + 40% peso individual, fechando no
    // total nominal do partido.
    let valores = pesos.map((p, i) => {
      const daCurva = somaCurva > 0 ? (curvaVals[i] / somaCurva) * nominalAlvo : 0;
      const doPeso = somaPesos > 0 ? (p.peso / somaPesos) * nominalAlvo : 0;
      return 0.6 * daCurva + 0.4 * doPeso;
    });

    // Teto realista no topo — o excedente desce para os demais.
    if (valores[0] > tetoRealista) {
      const excedente = valores[0] - tetoRealista;
      valores[0] = tetoRealista;
      const somaResto = valores.slice(1).reduce((s, v) => s + v, 0);
      if (somaResto > 0) {
        valores = valores.map((v, i) =>
          i === 0 ? v : v + (excedente * v) / somaResto
        );
      }
    }

    let acumulado = 0;
    valores.forEach((v, i) => {
      const arred = Math.max(0, Math.round(v));
      novoVotos[pesos[i].numero] = arred;
      acumulado += arred;
    });
    const dif = nominalAlvo - acumulado;
    if (dif !== 0 && pesos.length > 1) {
      const idx = valores[0] >= tetoRealista ? 1 : 0;
      novoVotos[pesos[idx].numero] = Math.max(0, (novoVotos[pesos[idx].numero] ?? 0) + dif);
    }
    return { novoVotos, novaLegenda };
  }

  function gerarUmPartido(sigla: string) {
    const { novoVotos, novaLegenda } = gerarPartido(sigla, { ...votos }, { ...legendaGerada });
    setVotos(novoVotos);
    setLegendaGerada(novaLegenda);
    setAbertos((a) => ({ ...a, [sigla]: true }));
  }

  function gerarTodos() {
    let v: Record<number, number> = {};
    let l: Record<string, number> = {};
    for (const p of porPartido) {
      const r = gerarPartido(p.sigla, v, l);
      v = r.novoVotos;
      l = r.novaLegenda;
    }
    setVotos(v);
    setLegendaGerada(l);
  }

  const totalNominal = useMemo(
    () => Object.values(votos).reduce((s, v) => s + (v > 0 ? v : 0), 0),
    [votos]
  );
  const totalLegenda = useMemo(
    () => Object.values(legendaGerada).reduce((s, v) => s + (v > 0 ? v : 0), 0),
    [legendaGerada]
  );

  const resultado = useMemo(() => {
    if (totalNominal <= 0) return null;
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
    return calcularSimulacao(sims, vagas, new Map(), partidoById as any, legendaGerada);
  }, [candidatos, votos, totalNominal, vagas, porPartido, legendaGerada]);

  const situacaoDe = (c: CandidatoEleicao) => resultado?.situacao.get(String(c.numero));

  function abrirCenario(c: CenarioSalvo) {
    const novoVotos: Record<number, number> = {};
    const novaLegenda: Record<string, number> = {};
    for (const [k, v] of Object.entries(c.votos)) {
      if (k.startsWith("legenda:")) novaLegenda[k.slice(8)] = v;
      else novoVotos[Number(k)] = v;
    }
    setVotos(novoVotos);
    setLegendaGerada(novaLegenda);
    setTitulo(c.titulo);
    setCenarioAberto(c.id);
    setMsg(null);
  }

  function montarVotosParaSalvar() {
    const votosStr: Record<string, number> = {};
    for (const [n, v] of Object.entries(votos)) if (v > 0) votosStr[n] = v;
    for (const [s, v] of Object.entries(legendaGerada)) if (v > 0) votosStr[`legenda:${s}`] = v;
    return votosStr;
  }

  async function salvar(comoNovo: boolean) {
    if (salvando) return;
    setSalvando(true);
    setMsg(null);
    try {
      const { id } = await salvarCenarioEleicao({
        id: comoNovo ? undefined : cenarioAberto ?? undefined,
        cargoNome,
        titulo,
        votos: montarVotosParaSalvar(),
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

  async function baixarPdf(sigla?: string) {
    if (gerandoPdf || totalNominal === 0) return;
    setGerandoPdf(true);
    try {
      const votosStr: Record<string, number> = {};
      for (const [n, v] of Object.entries(votos)) if (v > 0) votosStr[n] = v;
      const resp = await fetch("/api/pdf/eleicao-completa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cargoNome,
          vagas,
          titulo: titulo.trim(),
          votos: votosStr,
          legenda: legendaGerada,
          ...(sigla ? { sigla } : {}),
        }),
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
          Todos os candidatos do TSE por partido. A geração separa a fatia de votos de legenda
          (proporção real de 2022), distribui o nominal seguindo a curva de votação histórica do
          partido — com teto no campeão da última eleição
          {tetoRealista !== Infinity ? ` (≈ ${tetoRealista.toLocaleString("pt-BR")})` : ""} — e
          usa histórico individual{rotuloPesquisa ? " + pesquisa" : ""} para ordenar quem puxa
          mais. Tudo editável depois.
        </p>
        {rotuloPesquisa && (
          <p className="mt-1.5 text-[11px] text-emerald-400">
            <TrendingUp size={11} className="mr-1 inline" />
            Peso extra ativo: pesquisa {rotuloPesquisa}.
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
            onClick={() => baixarPdf()}
            disabled={gerandoPdf || totalNominal === 0}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-700 px-3 py-2 text-xs text-neutral-300 transition-colors hover:border-neutral-500 disabled:opacity-40"
          >
            <FileDown size={13} />
            {gerandoPdf ? "Gerando PDF…" : "PDF do cenário"}
          </button>
        </div>
        {totalNominal > 0 && resultado && (
          <div className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
            <div className="rounded-lg border border-sky-900/50 bg-neutral-950 px-3 py-2">
              <p className="text-[11px] text-sky-300">Cenário gerado</p>
              <p className="text-neutral-200">
                <strong>{resultado.votosValidos.toLocaleString("pt-BR")}</strong> válidos
                {totalLegenda > 0 && (
                  <span className="text-neutral-500">
                    {" "}
                    ({totalLegenda.toLocaleString("pt-BR")} de legenda)
                  </span>
                )}{" "}
                · QE <strong>{resultado.quocienteEleitoral.toLocaleString("pt-BR")}</strong> ·{" "}
                {vagas} vagas
              </p>
            </div>
            {referencia && (
              <div className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2">
                <p className="text-[11px] text-neutral-500">
                  Última eleição real ({referencia.ano}) — comparativo
                </p>
                <p className="text-neutral-400">
                  <strong className="text-neutral-300">
                    {referencia.validos.toLocaleString("pt-BR")}
                  </strong>{" "}
                  válidos · QE{" "}
                  <strong className="text-neutral-300">
                    {referencia.qe.toLocaleString("pt-BR")}
                  </strong>
                </p>
              </div>
            )}
          </div>
        )}
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
                    {
                      Object.keys(c.votos).filter((k) => !k.startsWith("legenda:")).length
                    }{" "}
                    candidatos ·{" "}
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
            disabled={salvando || !titulo.trim() || totalNominal === 0}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-amber-400 px-3 py-2 text-xs font-semibold text-neutral-950 transition-opacity disabled:opacity-40"
          >
            <Save size={13} />
            {salvando ? "Salvando…" : cenarioAberto ? "Atualizar cenário" : "Salvar cenário"}
          </button>
          {cenarioAberto && (
            <button
              onClick={() => salvar(true)}
              disabled={salvando || !titulo.trim() || totalNominal === 0}
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
          const legendaP = legendaGerada[p.sigla] ?? 0;
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
                    {somaPartido > 0 ? ` · ${somaPartido.toLocaleString("pt-BR")} nominais` : ""}
                    {legendaP > 0 ? ` + ${legendaP.toLocaleString("pt-BR")} legenda` : ""}
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
                <button
                  onClick={() => baixarPdf(p.sigla)}
                  disabled={gerandoPdf || somaPartido === 0}
                  title={`PDF só do ${p.sigla} dentro do cenário atual`}
                  className="rounded-lg border border-neutral-700 px-2.5 py-1.5 text-xs text-neutral-300 transition-colors hover:border-neutral-500 disabled:opacity-40"
                >
                  PDF
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
                        style={{ gridTemplateColumns: "minmax(0,2fr) minmax(0,1.1fr) 7.5rem 5rem" }}
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
                          className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-1.5 text-right text-sm font-medium tabular-nums text-amber-300"
                        />
                        <span className="text-right">
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
        Cenário fictício — nada altera os dados reais. Geração calibrada pela última eleição:
        curva de votação por partido, fatia de legenda e teto do campeão histórico. Inaptos não
        recebem votos na geração automática.
      </p>
    </div>
  );
}
