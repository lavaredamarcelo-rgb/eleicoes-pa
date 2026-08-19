"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FileDown, FileText, UserPlus } from "lucide-react";
import { calcularSimulacao, type CandidatoSimulacao } from "@/lib/simulacaoPartido";
import { VisorPdf } from "@/components/VisorPdf";

type Candidato = {
  id: string;
  nome: string;
  numero: number;
  partidoId: string;
  partidoSigla: string;
  eleito: boolean;
  votos: number;
};
type Partido = { id: string; sigla: string; nome: string };
type Genero = "" | "F" | "M";
type Ficticio = { id: string; nome: string; genero: Genero; votos: number };

// Criação completa de cenário: parte de uma eleição real e permite trocar
// as pessoas de um partido inteiro (nomes novos herdam os votos da posição),
// somar candidatos fictícios e acompanhar a quota de gênero da convenção.
export function CriadorCenario({
  cargoId,
  rotulo,
  candidatos,
  partidos,
  vagas,
  quocienteOficial,
  votosLegenda,
  aprovadosPorPartido,
}: {
  cargoId: string;
  rotulo: string;
  candidatos: Candidato[];
  partidos: Partido[];
  vagas: number;
  quocienteOficial: number;
  votosLegenda: Record<string, number>;
  // Aprovados nas convenções (aba Convenções) — sugestões por partido.
  aprovadosPorPartido?: Record<string, { nome: string; cargo: string }[]>;
}) {
  const router = useRouter();
  const [partidoSel, setPartidoSel] = useState("");
  const [substituicoes, setSubstituicoes] = useState<
    Record<string, { novoNome: string; genero: Genero }>
  >({});
  const [generos, setGeneros] = useState<Record<string, Genero>>({});
  const [ficticios, setFicticios] = useState<Ficticio[]>([]);
  const [fNome, setFNome] = useState("");
  const [fGenero, setFGenero] = useState<Genero>("");
  const [fVotos, setFVotos] = useState("");
  const [exportando, setExportando] = useState<"" | "pdf" | "relatorio">("");
  const [pdfAberto, setPdfAberto] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const partidoById = useMemo(() => new Map(partidos.map((p) => [p.id, p])), [partidos]);

  // Partidos presentes na disputa, dos maiores para os menores.
  const partidosDaDisputa = useMemo(() => {
    const mapa = new Map<string, { id: string; sigla: string; candidatos: number; votos: number }>();
    for (const c of candidatos) {
      const atual = mapa.get(c.partidoId) ?? { id: c.partidoId, sigla: c.partidoSigla, candidatos: 0, votos: 0 };
      atual.candidatos++;
      atual.votos += c.votos;
      mapa.set(c.partidoId, atual);
    }
    return Array.from(mapa.values()).sort((a, b) => b.votos - a.votos);
  }, [candidatos]);

  const doPartido = useMemo(
    () =>
      candidatos
        .filter((c) => c.partidoId === partidoSel)
        .sort((a, b) => b.votos - a.votos),
    [candidatos, partidoSel]
  );

  // Cenário calculado: substituições trocam o nome (votos preservados) e
  // fictícios somam votos novos — o quociente reage como no cálculo oficial.
  const resultado = useMemo(() => {
    const base: CandidatoSimulacao[] = candidatos.map((c) => ({
      id: c.id,
      nome: substituicoes[c.id]?.novoNome.trim()
        ? substituicoes[c.id].novoNome.trim().toUpperCase()
        : c.nome,
      numero: c.numero,
      votos: c.votos,
      partidoId: c.partidoId,
      partidoSigla: c.partidoSigla,
    }));
    const extras: CandidatoSimulacao[] = ficticios.map((f) => ({
      id: f.id,
      nome: f.nome.toUpperCase(),
      numero: 0,
      votos: f.votos,
      partidoId: partidoSel,
      partidoSigla: partidoById.get(partidoSel)?.sigla ?? "?",
    }));
    return calcularSimulacao([...base, ...extras], vagas, new Map(), partidoById, votosLegenda);
  }, [candidatos, substituicoes, ficticios, partidoSel, vagas, partidoById, votosLegenda]);

  const eleitoOficial = useMemo(
    () => new Map(candidatos.map((c) => [c.id, c.eleito])),
    [candidatos]
  );

  const quadroCasa = useMemo(() => {
    const antes = new Map<string, number>();
    for (const c of candidatos) {
      if (c.eleito) antes.set(c.partidoId, (antes.get(c.partidoId) ?? 0) + 1);
    }
    const ids = new Set([...antes.keys(), ...resultado.partidos.map((p) => p.partidoId)]);
    return Array.from(ids)
      .map((partidoId) => {
        const a = antes.get(partidoId) ?? 0;
        const d = resultado.partidos.find((p) => p.partidoId === partidoId)?.quocientePartidario ?? 0;
        return { partidoId, sigla: partidoById.get(partidoId)?.sigla ?? "?", antes: a, depois: d, delta: d - a };
      })
      .filter((q) => q.antes > 0 || q.depois > 0)
      .sort((a, b) => b.depois - a.depois || b.antes - a.antes);
  }, [candidatos, resultado.partidos, partidoById]);

  // Quota de gênero da convenção do partido escolhido no cenário.
  const quota = useMemo(() => {
    if (!partidoSel) return null;
    const generoDe = (id: string): Genero => substituicoes[id]?.genero || generos[id] || "";
    let f = 0;
    let m = 0;
    for (const c of doPartido) {
      const g = generoDe(c.id);
      if (g === "F") f++;
      else if (g === "M") m++;
    }
    for (const x of ficticios) {
      if (x.genero === "F") f++;
      else if (x.genero === "M") m++;
    }
    const total = doPartido.length + ficticios.length;
    const minimo = Math.ceil(total * 0.3);
    const limite = Math.floor(vagas * 1.5);
    return {
      total,
      feminino: f,
      masculino: m,
      semGenero: total - f - m,
      minimo,
      limite,
      dentroDoLimite: total <= limite,
      atende: f >= minimo && m >= minimo,
    };
  }, [partidoSel, doPartido, ficticios, substituicoes, generos, vagas]);

  const mudancas =
    Object.values(substituicoes).filter((s) => s.novoNome.trim()).length + ficticios.length;

  function definirSubstituicao(id: string, novoNome: string) {
    setSubstituicoes((prev) => {
      const next = { ...prev };
      if (novoNome) next[id] = { novoNome, genero: prev[id]?.genero ?? "" };
      else delete next[id];
      return next;
    });
  }

  function definirGenero(id: string, genero: Genero) {
    if (substituicoes[id]?.novoNome) {
      setSubstituicoes((prev) => ({ ...prev, [id]: { ...prev[id], genero } }));
    } else {
      setGeneros((prev) => ({ ...prev, [id]: genero }));
    }
  }

  function adicionarFicticio() {
    const votos = Number(fVotos.replace(/\D/g, ""));
    if (!fNome.trim() || !partidoSel || votos <= 0) return;
    setFicticios((prev) => [
      ...prev,
      { id: `ficticio-${Date.now()}`, nome: fNome.trim(), genero: fGenero, votos },
    ]);
    setFNome("");
    setFVotos("");
    setFGenero("");
  }

  function montarPayload() {
    const generoDe = (id: string): Genero => substituicoes[id]?.genero || generos[id] || "";
    return {
      cargoId,
      vagas,
      substituicoes: Object.entries(substituicoes)
        .filter(([, s]) => s.novoNome.trim())
        .map(([candidatoId, s]) => ({
          candidatoId,
          novoNome: s.novoNome.trim(),
          genero: s.genero || undefined,
        })),
      ficticios: ficticios.map((f) => ({
        nome: f.nome,
        partidoId: partidoSel,
        votos: f.votos,
        genero: f.genero || undefined,
      })),
      generos: Object.fromEntries(
        candidatos.map((c) => [c.id, generoDe(c.id)]).filter(([, g]) => g)
      ),
    };
  }

  async function exportar(alvo: "pdf" | "relatorio") {
    if (exportando) return;
    setExportando(alvo);
    setErro(null);
    try {
      if (alvo === "pdf") {
        const resp = await fetch("/api/pdf/cenario", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(montarPayload()),
        });
        if (!resp.ok) throw new Error("Falha ao gerar o PDF do cenário.");
        const blob = await resp.blob();
        setPdfAberto(URL.createObjectURL(blob));
      } else {
        const resp = await fetch("/api/relatorios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tipo: "cenario", params: { dados: JSON.stringify(montarPayload()) } }),
        });
        const d = await resp.json();
        if (!resp.ok) throw new Error(d.error ?? "Falha ao salvar o relatório.");
        router.push(`/relatorios/${d.id}`);
        return;
      }
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao exportar.");
    } finally {
      setExportando("");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {pdfAberto && (
        <VisorPdf
          titulo={`Cenário criado — ${rotulo}`}
          blobUrl={pdfAberto}
          nomeArquivo="cenario-criado.pdf"
          aoFechar={() => {
            URL.revokeObjectURL(pdfAberto);
            setPdfAberto(null);
          }}
        />
      )}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
        <p className="text-sm font-medium text-neutral-300">Base do cenário: {rotulo}</p>
        <p className="text-xs text-neutral-500">
          {vagas} vagas · QE oficial {quocienteOficial.toLocaleString("pt-BR")} · escolha o partido
          para trocar as pessoas da chapa
        </p>
        <div className="mt-3">
          <label className="mb-1 block text-xs text-neutral-500">Partido do cenário</label>
          <select
            value={partidoSel}
            onChange={(e) => {
              setPartidoSel(e.target.value);
              setFicticios([]);
            }}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
          >
            <option value="">Escolha…</option>
            {partidosDaDisputa.map((p) => (
              <option key={p.id} value={p.id}>
                {p.sigla} — {p.candidatos} candidato(s) · {p.votos.toLocaleString("pt-BR")} votos
              </option>
            ))}
          </select>
        </div>
      </div>

      {partidoSel && (aprovadosPorPartido?.[partidoSel]?.length ?? 0) > 0 && (
        <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/10 p-3">
          <p className="text-xs font-medium text-emerald-300">
            ✓ Aprovados na convenção do {partidoById.get(partidoSel)?.sigla} (aba Convenções) —
            use nos campos de substituição ou como fictícios:
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {aprovadosPorPartido![partidoSel].map((a) => (
              <span
                key={`${a.nome}-${a.cargo}`}
                className="rounded-full bg-neutral-900 px-2.5 py-1 text-xs text-neutral-200"
              >
                {a.nome} <span className="text-neutral-500">· {a.cargo}</span>
              </span>
            ))}
          </div>
          <datalist id={`aprovados-${partidoSel}`}>
            {aprovadosPorPartido![partidoSel].map((a) => (
              <option key={`${a.nome}-${a.cargo}`} value={a.nome} />
            ))}
          </datalist>
        </div>
      )}

      {partidoSel && quota && (
        <div
          className={`rounded-xl border p-4 ${
            quota.semGenero > 0
              ? "border-neutral-800 bg-neutral-900"
              : quota.atende && quota.dentroDoLimite
                ? "border-emerald-900 bg-emerald-950/20"
                : "border-red-900 bg-red-950/20"
          }`}
        >
          <p className="text-sm font-medium text-neutral-200">
            Quota de gênero e convenção — {partidoById.get(partidoSel)?.sigla}
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Indicador rotulo="Candidaturas" valor={`${quota.total} / ${quota.limite}`} alerta={!quota.dentroDoLimite} />
            <Indicador rotulo="Feminino" valor={String(quota.feminino)} alerta={quota.semGenero === 0 && quota.feminino < quota.minimo} />
            <Indicador rotulo="Masculino" valor={String(quota.masculino)} alerta={quota.semGenero === 0 && quota.masculino < quota.minimo} />
            <Indicador rotulo="Sem gênero definido" valor={String(quota.semGenero)} alerta={false} />
          </div>
          <p className="mt-2 text-xs leading-relaxed text-neutral-500">
            Planejamento da convenção: com <strong className="text-neutral-300">{quota.total}</strong>{" "}
            candidatura(s), o partido precisa de no mínimo{" "}
            <strong className="text-neutral-300">{quota.minimo}</strong> de cada gênero (30%,
            arredondado para cima) e pode registrar até{" "}
            <strong className="text-neutral-300">{quota.limite}</strong> candidaturas (150% das{" "}
            {vagas} vagas).{" "}
            {quota.semGenero > 0
              ? `Defina o gênero de ${quota.semGenero} candidatura(s) para validar a quota.`
              : quota.atende
                ? "✓ A quota de gênero está atendida."
                : "✗ A quota de gênero NÃO está atendida — ajuste a chapa."}
          </p>
        </div>
      )}

      {partidoSel && (
        <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
          <div
            className="grid gap-2 border-b border-neutral-800 px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-neutral-500"
            style={{ gridTemplateColumns: "1.6fr 1.6fr 0.9fr 0.8fr" }}
          >
            <span>Candidato real (votos)</span>
            <span>Substituir por…</span>
            <span>Gênero</span>
            <span className="text-right">Situação</span>
          </div>
          <div className="max-h-[30rem] overflow-y-auto">
            {doPartido.map((c) => {
              const sub = substituicoes[c.id];
              const situacao = resultado.situacao.get(c.id);
              return (
                <div
                  key={c.id}
                  className="grid items-center gap-2 border-b border-neutral-800/50 px-4 py-1.5 text-xs last:border-0"
                  style={{ gridTemplateColumns: "1.6fr 1.6fr 0.9fr 0.8fr" }}
                >
                  <span className={sub?.novoNome ? "text-neutral-500 line-through" : "text-neutral-300"}>
                    {c.nome}{" "}
                    <span className="text-[10px] text-neutral-600">
                      {c.votos.toLocaleString("pt-BR")}
                    </span>
                  </span>
                  <input
                    type="text"
                    value={sub?.novoNome ?? ""}
                    onChange={(e) => definirSubstituicao(c.id, e.target.value)}
                    placeholder="nome novo (herda os votos)"
                    list={`aprovados-${partidoSel}`}
                    className="rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-1.5 text-xs text-neutral-100"
                  />
                  <select
                    value={sub?.genero || generos[c.id] || ""}
                    onChange={(e) => definirGenero(c.id, e.target.value as Genero)}
                    className="rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-1.5 text-xs text-neutral-100"
                  >
                    <option value="">—</option>
                    <option value="F">Feminino</option>
                    <option value="M">Masculino</option>
                  </select>
                  <span
                    className={`text-right ${situacao?.situacao === "eleito" ? "text-emerald-400" : "text-neutral-500"}`}
                  >
                    {situacao?.situacao === "eleito" ? "Eleito" : "Suplente"}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 border-t border-neutral-800 bg-sky-950/10 p-3">
            <p className="text-xs font-medium text-sky-300">
              <UserPlus size={12} className="mr-1 inline" />
              Somar candidatura fictícia à chapa (com votos próprios)
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={fNome}
                onChange={(e) => setFNome(e.target.value)}
                placeholder="Nome"
                list={`aprovados-${partidoSel}`}
                className="flex-1 rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
              />
              <select
                value={fGenero}
                onChange={(e) => setFGenero(e.target.value as Genero)}
                className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
              >
                <option value="">Gênero…</option>
                <option value="F">Feminino</option>
                <option value="M">Masculino</option>
              </select>
              <input
                type="number"
                min={1}
                value={fVotos}
                onChange={(e) => setFVotos(e.target.value)}
                placeholder="Votos"
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 sm:w-28"
              />
              <button
                onClick={adicionarFicticio}
                disabled={!fNome.trim() || !fVotos}
                className="rounded-lg bg-sky-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700 disabled:opacity-40"
              >
                Adicionar
              </button>
            </div>
            {ficticios.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {ficticios.map((f) => (
                  <span key={f.id} className="flex items-center gap-1.5 rounded-full bg-neutral-900 px-2.5 py-1 text-xs">
                    {f.nome} ({f.genero || "?"} · {f.votos.toLocaleString("pt-BR")})
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
        </div>
      )}

      {partidoSel && (
        <>
          <div className="rounded-lg bg-neutral-900 px-3 py-2 text-xs">
            <span className="text-neutral-500">Quociente eleitoral: </span>
            {quocienteOficial.toLocaleString("pt-BR")}
            {resultado.quocienteEleitoral !== quocienteOficial && (
              <>
                {" → "}
                <span className="font-medium text-amber-400">
                  {resultado.quocienteEleitoral.toLocaleString("pt-BR")}
                </span>
                <span className="text-neutral-600"> (fictícios somam votos válidos)</span>
              </>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-neutral-500">
              Como ficaria a casa (cadeiras por partido: hoje → cenário)
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
                  <span className={q.delta !== 0 ? "font-semibold text-amber-300" : ""}>{q.depois}</span>
                  {q.delta !== 0 && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        q.delta > 0 ? "bg-emerald-950 text-emerald-300" : "bg-red-950 text-red-300"
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
              Eleitos do {partidoById.get(partidoSel)?.sigla} no cenário
            </p>
            {(() => {
              const p = resultado.partidos.find((x) => x.partidoId === partidoSel);
              if (!p || p.quocientePartidario === 0) {
                return <p className="text-xs text-neutral-600">Nenhuma cadeira para o partido nesse cenário.</p>;
              }
              return [...p.candidatos]
                .sort((a, b) => b.votosEfetivos - a.votosEfetivos)
                .slice(0, p.quocientePartidario)
                .map((c, i) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between rounded-lg bg-neutral-900 px-3 py-2 text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-5 text-right text-xs text-neutral-600">{i + 1}º</span>
                      <span>{c.nome}</span>
                      {c.id.startsWith("ficticio-") && (
                        <span className="rounded-full bg-sky-950 px-1.5 py-0.5 text-[10px] font-semibold text-sky-300">
                          FICTÍCIO
                        </span>
                      )}
                      {substituicoes[c.id]?.novoNome && (
                        <span className="rounded-full bg-amber-950 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
                          SUBSTITUTO
                        </span>
                      )}
                      {!c.id.startsWith("ficticio-") && !eleitoOficial.get(c.id) && (
                        <span className="rounded-full bg-emerald-900 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-200">
                          ENTRA
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {c.votosEfetivos.toLocaleString("pt-BR")}
                    </span>
                  </div>
                ));
            })()}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => exportar("pdf")}
              disabled={exportando !== ""}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs font-medium text-neutral-300 transition-colors hover:border-neutral-500 disabled:opacity-40"
            >
              <FileDown size={13} />
              {exportando === "pdf" ? "Gerando PDF…" : "Baixar PDF do cenário"}
            </button>
            <button
              onClick={() => exportar("relatorio")}
              disabled={exportando !== ""}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs font-medium text-neutral-300 transition-colors hover:border-neutral-500 disabled:opacity-40"
            >
              <FileText size={13} />
              {exportando === "relatorio" ? "Salvando…" : "Salvar nos Relatórios"}
            </button>
            {mudancas > 0 && (
              <span className="text-xs text-neutral-600">
                {mudancas} mudança(s) no cenário
              </span>
            )}
          </div>
          {erro && (
            <p className="rounded-lg border border-red-900 bg-red-950/40 px-3 py-2 text-xs text-red-300">
              {erro}
            </p>
          )}
        </>
      )}
    </div>
  );
}

function Indicador({ rotulo, valor, alerta }: { rotulo: string; valor: string; alerta: boolean }) {
  return (
    <div className={`rounded-lg border px-3 py-2 ${alerta ? "border-red-900 bg-red-950/30" : "border-neutral-800 bg-neutral-950"}`}>
      <p className="text-[11px] text-neutral-500">{rotulo}</p>
      <p className={`text-lg font-bold ${alerta ? "text-red-300" : "text-neutral-200"}`}>{valor}</p>
    </div>
  );
}
