"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FileDown, FileText } from "lucide-react";
import { CandidatoCombobox } from "./CandidatoCombobox";
import { VisorPdf } from "@/components/VisorPdf";
import {
  calcularSimulacao,
  votosProjetados,
  type CandidatoSimulacao,
  type OverridePartido,
} from "@/lib/simulacaoPartido";

type Partido = { id: string; sigla: string; nome: string };

export function SimuladorPartido({
  cargoId,
  candidatos,
  partidos,
  vagas,
  quocienteEleitoral,
  candidatoInicialId,
  votosLegenda,
}: {
  cargoId: string;
  candidatos: (CandidatoSimulacao & { situacaoOriginal: "eleito" | "suplente" })[];
  partidos: Partido[];
  vagas: number;
  quocienteEleitoral: number;
  candidatoInicialId?: string;
  // Votos de legenda por partido — entram no quociente como no cálculo oficial.
  votosLegenda?: Record<string, number>;
}) {
  const router = useRouter();
  const [overrides, setOverrides] = useState<Map<string, OverridePartido>>(new Map());
  // Candidatos fictícios: entram no cálculo como se disputassem a eleição
  // (somam nos votos válidos, no quociente e concorrem às cadeiras).
  const [ficticios, setFicticios] = useState<CandidatoSimulacao[]>([]);
  const [fNome, setFNome] = useState("");
  const [fPartido, setFPartido] = useState("");
  const [fVotos, setFVotos] = useState("");
  const [vagasSimuladas, setVagasSimuladas] = useState(vagas);
  const [candidatoSelecionado, setCandidatoSelecionado] = useState(
    candidatoInicialId && candidatos.some((c) => c.id === candidatoInicialId)
      ? candidatoInicialId
      : ""
  );
  const [novoPartido, setNovoPartido] = useState("");
  const [percentual, setPercentual] = useState(0);

  const partidoById = useMemo(() => new Map(partidos.map((p) => [p.id, p])), [partidos]);
  const candidatoById = useMemo(() => new Map(candidatos.map((c) => [c.id, c])), [candidatos]);
  const candidatoOptions = useMemo(
    () =>
      candidatos.map((c) => ({
        id: c.id,
        label: `${c.nome} (${partidoById.get(overrides.get(c.id)?.partidoId ?? c.partidoId)?.sigla ?? c.partidoSigla})`,
      })),
    [candidatos, partidoById, overrides]
  );

  useEffect(() => {
    if (candidatoSelecionado) {
      document.getElementById("simulador")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const todosCandidatos = useMemo(
    () => [...candidatos, ...ficticios],
    [candidatos, ficticios]
  );

  const resultado = useMemo(
    () => calcularSimulacao(todosCandidatos, vagasSimuladas, overrides, partidoById, votosLegenda),
    [todosCandidatos, vagasSimuladas, overrides, partidoById, votosLegenda]
  );

  const ficticioIds = useMemo(() => new Set(ficticios.map((f) => f.id)), [ficticios]);
  const simulacaoAtiva = overrides.size > 0 || ficticios.length > 0 || vagasSimuladas !== vagas;

  function adicionarFicticio() {
    const votosNum = Number(fVotos.replace(/\D/g, ""));
    if (!fNome.trim() || !fPartido || !Number.isFinite(votosNum) || votosNum <= 0) return;
    const partido = partidoById.get(fPartido);
    setFicticios((prev) => [
      ...prev,
      {
        id: `ficticio-${Date.now()}`,
        nome: fNome.trim().toUpperCase(),
        numero: 0,
        votos: votosNum,
        partidoId: fPartido,
        partidoSigla: partido?.sigla ?? "?",
      },
    ]);
    setFNome("");
    setFVotos("");
  }

  // Quadro da casa: cadeiras oficiais de hoje (por partido da urna) versus
  // as cadeiras do cenário simulado, com o saldo destacado.
  const quadroCasa = useMemo(() => {
    const antes = new Map<string, number>();
    for (const c of candidatos) {
      if (c.situacaoOriginal === "eleito") {
        antes.set(c.partidoId, (antes.get(c.partidoId) ?? 0) + 1);
      }
    }
    const depois = new Map(resultado.partidos.map((p) => [p.partidoId, p.quocientePartidario]));
    const ids = new Set([...antes.keys(), ...depois.keys()]);
    return Array.from(ids)
      .map((partidoId) => {
        const a = antes.get(partidoId) ?? 0;
        const d = depois.get(partidoId) ?? 0;
        return {
          partidoId,
          sigla: partidoById.get(partidoId)?.sigla ?? "?",
          antes: a,
          depois: d,
          delta: d - a,
        };
      })
      .filter((q) => q.antes > 0 || q.depois > 0)
      .sort((a, b) => b.depois - a.depois || b.antes - a.antes);
  }, [candidatos, resultado.partidos, partidoById]);

  // Eleitos do cenário, agrupados pelo partido efetivo, na ordem de votos
  // projetados; marca quem entra na casa e quem chegou por troca.
  const eleitosSimulados = useMemo(
    () =>
      resultado.partidos
        .filter((p) => p.quocientePartidario > 0)
        .map((p) => ({
          partidoId: p.partidoId,
          sigla: p.sigla,
          eleitos: [...p.candidatos]
            .sort((a, b) => b.votosEfetivos - a.votosEfetivos)
            .slice(0, p.quocientePartidario)
            .map((c) => ({
              id: c.id,
              nome: c.nome,
              votos: c.votosEfetivos,
              trocou: c.partidoIdEfetivo !== c.partidoId,
              partidoOrigem: c.partidoSigla,
              entra: candidatoById.get(c.id)?.situacaoOriginal !== "eleito",
              ficticio: ficticioIds.has(c.id),
            })),
        }))
        .sort((a, b) => b.eleitos.length - a.eleitos.length),
    [resultado.partidos, candidatoById, ficticioIds]
  );

  const quemSai = useMemo(
    () =>
      candidatos
        .filter(
          (c) =>
            c.situacaoOriginal === "eleito" && resultado.situacao.get(c.id)?.situacao === "suplente"
        )
        .map((c) => ({
          id: c.id,
          nome: c.nome,
          sigla: partidoById.get(overrides.get(c.id)?.partidoId ?? c.partidoId)?.sigla ?? c.partidoSigla,
          ordemSuplencia: resultado.situacao.get(c.id)?.ordemSuplencia ?? 0,
        })),
    [candidatos, resultado.situacao, partidoById, overrides]
  );

  const candidatoAtual = candidatoById.get(candidatoSelecionado);
  const previaVotos = candidatoAtual ? votosProjetados(candidatoAtual.votos, percentual) : 0;

  function aplicar() {
    if (!candidatoSelecionado || (!novoPartido && percentual === 0)) return;
    setOverrides((prev) => {
      const next = new Map(prev);
      next.set(candidatoSelecionado, {
        partidoId: novoPartido || undefined,
        percentual: percentual !== 0 ? percentual : undefined,
      });
      return next;
    });
    setCandidatoSelecionado("");
    setNovoPartido("");
    setPercentual(0);
  }

  function remover(candidatoId: string) {
    setOverrides((prev) => {
      const next = new Map(prev);
      next.delete(candidatoId);
      return next;
    });
  }

  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [pdfAberto, setPdfAberto] = useState<string | null>(null);
  const [salvandoRelatorio, setSalvandoRelatorio] = useState(false);
  const [erroExport, setErroExport] = useState<string | null>(null);

  // O cenário completo (várias trocas + fictícios + vagas alteradas) não
  // cabe em uma URL, então PDF e relatório recebem o cenário por POST e o
  // servidor recalcula tudo a partir dos dados oficiais.
  function montarPayload() {
    return {
      cargoId,
      vagas: vagasSimuladas,
      overrides: Array.from(overrides.entries()).map(([candidatoId, o]) => ({
        candidatoId,
        partidoId: o.partidoId,
        percentual: o.percentual,
      })),
      ficticios: ficticios.map((f) => ({ nome: f.nome, partidoId: f.partidoId, votos: f.votos })),
    };
  }

  async function baixarPdfCenario() {
    if (gerandoPdf) return;
    setGerandoPdf(true);
    setErroExport(null);
    try {
      const resp = await fetch("/api/pdf/cenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(montarPayload()),
      });
      if (!resp.ok) throw new Error("Falha ao gerar o PDF do cenário.");
      const blob = await resp.blob();
      setPdfAberto(URL.createObjectURL(blob));
    } catch (e) {
      setErroExport(e instanceof Error ? e.message : "Falha ao gerar o PDF.");
    } finally {
      setGerandoPdf(false);
    }
  }

  async function salvarRelatorio() {
    if (salvandoRelatorio) return;
    setSalvandoRelatorio(true);
    setErroExport(null);
    try {
      const resp = await fetch("/api/relatorios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "cenario",
          params: { dados: JSON.stringify(montarPayload()) },
        }),
      });
      const d = await resp.json();
      if (!resp.ok) throw new Error(d.error ?? "Falha ao salvar o relatório.");
      router.push(`/relatorios/${d.id}`);
    } catch (e) {
      setErroExport(e instanceof Error ? e.message : "Falha ao salvar o relatório.");
      setSalvandoRelatorio(false);
    }
  }

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-orange-900/50 bg-orange-950/10 p-4">
      {pdfAberto && (
        <VisorPdf
          titulo="Cenário simulado"
          blobUrl={pdfAberto}
          nomeArquivo="cenario-simulado.pdf"
          aoFechar={() => {
            URL.revokeObjectURL(pdfAberto);
            setPdfAberto(null);
          }}
        />
      )}
      <div>
        <h2 className="text-sm font-medium text-orange-300">Simulador de cenários</h2>
        <p className="text-xs text-neutral-500">
          Teste hipóteses sem alterar os dados reais — troca de partido, crescimento de votos ou
          os dois combinados. Você pode <span className="text-neutral-300">adicionar vários
          candidatos ao mesmo cenário</span> (ex.: dois vereadores trocando de partido): o
          resultado considera todas as mudanças juntas.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <CandidatoCombobox
          candidatos={candidatoOptions}
          value={candidatoSelecionado}
          onChange={setCandidatoSelecionado}
        />

        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={novoPartido}
            onChange={(e) => setNovoPartido(e.target.value)}
            className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
          >
            <option value="">Manter partido atual</option>
            {partidos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.sigla}
              </option>
            ))}
          </select>
          <button
            onClick={aplicar}
            disabled={!candidatoSelecionado || (!novoPartido && percentual === 0)}
            className="rounded-lg bg-orange-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:opacity-40"
          >
            {overrides.size > 0 ? "Adicionar ao cenário" : "Simular"}
          </button>
        </div>

        <div>
          <label className="mb-1 flex items-center justify-between text-xs text-neutral-500">
            <span>Crescimento de votos projetado</span>
            {candidatoAtual && (
              <span className="text-neutral-400">
                {candidatoAtual.votos.toLocaleString("pt-BR")} →{" "}
                <span className="font-medium text-amber-400">
                  {previaVotos.toLocaleString("pt-BR")}
                </span>
              </span>
            )}
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
            <span className="w-14 text-right text-sm font-semibold text-amber-400">
              {percentual > 0 ? "+" : ""}
              {percentual}%
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-lg border border-sky-900/50 bg-sky-950/10 p-3">
          <p className="text-xs font-medium text-sky-300">
            Candidato fictício — invente um nome, escolha o partido e estime os votos
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={fNome}
              onChange={(e) => setFNome(e.target.value)}
              placeholder="Nome do candidato fictício"
              className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
            />
            <select
              value={fPartido}
              onChange={(e) => setFPartido(e.target.value)}
              className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
            >
              <option value="">Partido…</option>
              {partidos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.sigla}
                </option>
              ))}
            </select>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              value={fVotos}
              onChange={(e) => setFVotos(e.target.value)}
              placeholder="Votos"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 sm:w-28"
            />
            <button
              onClick={adicionarFicticio}
              disabled={!fNome.trim() || !fPartido || !fVotos}
              className="rounded-lg bg-sky-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700 disabled:opacity-40"
            >
              Adicionar
            </button>
          </div>
          {ficticios.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {ficticios.map((f) => (
                <span
                  key={f.id}
                  className="flex items-center gap-1.5 rounded-full bg-neutral-900 px-2.5 py-1 text-xs"
                >
                  {f.nome} ({f.partidoSigla} · {f.votos.toLocaleString("pt-BR")})
                  <button
                    onClick={() => setFicticios((prev) => prev.filter((x) => x.id !== f.id))}
                    className="text-neutral-500 hover:text-red-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between rounded-lg bg-neutral-900 px-3 py-2">
          <label className="text-xs text-neutral-500">
            Vagas em disputa{" "}
            {vagasSimuladas !== vagas && (
              <span className="text-amber-400">(real: {vagas})</span>
            )}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={99}
              value={vagasSimuladas}
              onChange={(e) => setVagasSimuladas(Math.max(1, Number(e.target.value) || vagas))}
              className="w-20 rounded-lg border border-neutral-700 bg-neutral-950 px-2 py-1.5 text-center text-sm font-semibold text-amber-400"
            />
            {vagasSimuladas !== vagas && (
              <button
                onClick={() => setVagasSimuladas(vagas)}
                className="text-xs text-neutral-500 underline hover:text-neutral-300"
              >
                restaurar
              </button>
            )}
          </div>
        </div>
      </div>

      {simulacaoAtiva && (
        <>
          <div className="flex flex-col gap-1.5">
            {Array.from(overrides.entries()).map(([candidatoId, o]) => {
              const c = candidatoById.get(candidatoId);
              if (!c) return null;
              return (
                <div
                  key={candidatoId}
                  className="flex flex-col gap-0.5 rounded-lg bg-neutral-900 px-3 py-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{c.nome}</span>
                    <button
                      onClick={() => remover(candidatoId)}
                      className="text-neutral-500 hover:text-red-400"
                    >
                      remover
                    </button>
                  </div>
                  <span className="text-neutral-400">
                    {o.partidoId && (
                      <>
                        {c.partidoSigla} → {partidoById.get(o.partidoId)?.sigla}
                        {o.percentual ? " · " : ""}
                      </>
                    )}
                    {o.percentual
                      ? `${c.votos.toLocaleString("pt-BR")} → ${votosProjetados(
                          c.votos,
                          o.percentual
                        ).toLocaleString("pt-BR")} votos (${o.percentual > 0 ? "+" : ""}${o.percentual}%)`
                      : ""}
                  </span>
                </div>
              );
            })}
            <button
              onClick={() => {
                setOverrides(new Map());
                setFicticios([]);
                setVagasSimuladas(vagas);
              }}
              className="self-start text-xs text-neutral-500 underline hover:text-neutral-300"
            >
              Limpar simulação
            </button>
          </div>

          {resultado.quocienteEleitoral !== quocienteEleitoral && (
            <div className="rounded-lg bg-neutral-900 px-3 py-2 text-xs">
              <span className="text-neutral-500">Quociente eleitoral: </span>
              {quocienteEleitoral.toLocaleString("pt-BR")}
              {" → "}
              <span className="font-medium text-amber-400">
                {resultado.quocienteEleitoral.toLocaleString("pt-BR")}
              </span>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-neutral-500">
              Como ficaria a casa (cadeiras por partido: hoje → simulado)
            </p>
            {quadroCasa.map((q) => (
              <div
                key={q.partidoId}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                  q.delta !== 0 ? "border border-amber-900/60 bg-amber-950/20" : "bg-neutral-900"
                }`}
              >
                <span className="font-medium">{q.sigla}</span>
                <span className="flex items-center gap-2">
                  <span className="text-neutral-500">{q.antes}</span>
                  <span className="text-neutral-600">→</span>
                  <span className={q.delta !== 0 ? "font-semibold text-amber-300" : ""}>
                    {q.depois}
                  </span>
                  {q.delta !== 0 && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        q.delta > 0
                          ? "bg-emerald-950 text-emerald-300"
                          : "bg-red-950 text-red-300"
                      }`}
                    >
                      {q.delta > 0 ? `▲ +${q.delta}` : `▼ ${q.delta}`}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-neutral-500">
              Eleitos no cenário simulado ({eleitosSimulados.reduce((s, g) => s + g.eleitos.length, 0)}
              {" "}de {vagasSimuladas} vagas)
            </p>
            {eleitosSimulados.map((g) => (
              <div key={g.partidoId} className="rounded-lg bg-neutral-900 px-3 py-2">
                <p className="mb-1.5 text-xs font-semibold text-neutral-300">
                  {g.sigla} · {g.eleitos.length} {g.eleitos.length === 1 ? "cadeira" : "cadeiras"}
                </p>
                <div className="flex flex-col gap-1">
                  {g.eleitos.map((c, i) => (
                    <div
                      key={c.id}
                      className={`flex items-center justify-between rounded px-2 py-1 text-xs ${
                        c.entra ? "bg-emerald-950/50" : ""
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="w-5 text-right text-neutral-600">{i + 1}º</span>
                        <span className={c.entra ? "font-medium text-emerald-200" : ""}>{c.nome}</span>
                        {c.trocou && (
                          <span className="rounded-full bg-amber-950 px-1.5 py-0.5 text-[10px] text-amber-300">
                            veio do {c.partidoOrigem}
                          </span>
                        )}
                        {c.ficticio ? (
                          <span className="rounded-full bg-sky-950 px-1.5 py-0.5 text-[10px] font-semibold text-sky-300">
                            FICTÍCIO
                          </span>
                        ) : (
                          c.entra && (
                            <span className="rounded-full bg-emerald-900 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-200">
                              ENTRA
                            </span>
                          )
                        )}
                      </span>
                      <span className="text-neutral-400">{c.votos.toLocaleString("pt-BR")}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {quemSai.length > 0 && (
              <div className="rounded-lg border border-red-900/50 bg-red-950/20 px-3 py-2">
                <p className="mb-1.5 text-xs font-semibold text-red-300">
                  Quem sai da casa ({quemSai.length})
                </p>
                <div className="flex flex-col gap-1">
                  {quemSai.map((c) => (
                    <div key={c.id} className="flex items-center justify-between text-xs">
                      <span className="text-red-200 line-through decoration-red-500/60">
                        {c.nome} ({c.sigla})
                      </span>
                      <span className="text-neutral-500">
                        vira {c.ordemSuplencia}º suplente
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-neutral-500">Candidatos que mudam de situação</p>
            {candidatos
              .filter((c) => {
                const nova = resultado.situacao.get(c.id);
                return nova && nova.situacao !== c.situacaoOriginal;
              })
              .map((c) => {
                const nova = resultado.situacao.get(c.id)!;
                return (
                  <div
                    key={c.id}
                    className="flex items-center justify-between rounded-lg bg-neutral-900 px-3 py-2 text-sm"
                  >
                    <span>{c.nome}</span>
                    <span>
                      <span className="text-neutral-500">
                        {c.situacaoOriginal === "eleito" ? "Eleito" : "Suplente"}
                      </span>
                      {" → "}
                      <span
                        className={
                          nova.situacao === "eleito" ? "text-emerald-400" : "text-amber-400"
                        }
                      >
                        {nova.situacao === "eleito" ? "Eleito" : `${nova.ordemSuplencia}º suplente`}
                      </span>
                    </span>
                  </div>
                );
              })}
            {candidatos.every((c) => resultado.situacao.get(c.id)?.situacao === c.situacaoOriginal) && (
              <p className="text-xs text-neutral-600">
                Nenhuma mudança de situação com essa simulação.
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={baixarPdfCenario}
              disabled={gerandoPdf}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs font-medium text-neutral-300 transition-colors hover:border-neutral-500 disabled:opacity-40"
            >
              <FileDown size={13} />
              {gerandoPdf ? "Gerando PDF…" : "Baixar PDF do cenário"}
            </button>
            <button
              onClick={salvarRelatorio}
              disabled={salvandoRelatorio}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs font-medium text-neutral-300 transition-colors hover:border-neutral-500 disabled:opacity-40"
            >
              <FileText size={13} />
              {salvandoRelatorio ? "Salvando…" : "Salvar nos Relatórios"}
            </button>
          </div>
          {erroExport && (
            <p className="rounded-lg border border-red-900 bg-red-950/40 px-3 py-2 text-xs text-red-300">
              {erroExport}
            </p>
          )}
        </>
      )}
    </section>
  );
}
