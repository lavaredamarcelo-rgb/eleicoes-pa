"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FileDown, FileText, UserPlus } from "lucide-react";

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
type Ficticio = { id: string; nome: string; partidoId: string; votos: number };

// Cenário majoritário (Governador/Senador/Prefeito): substitua pessoas
// (o nome novo herda os votos), troque partidos, ajuste votos, some
// fictícios e veja quem se elege — com leitura de 1º/2º turno quando a
// disputa é de vaga única.
export function CriadorCenarioMajoritario({
  rotulo,
  cargoNome,
  ano,
  candidatos,
  partidos,
  vagas,
  projetado,
  anoBase,
  aprovadosConvencao,
}: {
  rotulo: string;
  cargoNome: string;
  ano: number;
  candidatos: Candidato[];
  partidos: Partido[];
  vagas: number;
  projetado: boolean;
  anoBase: number;
  // Aprovados nas convenções para este cargo (aba Convenções).
  aprovadosConvencao?: { nome: string; partidoSigla: string }[];
}) {
  const router = useRouter();
  const [substituicoes, setSubstituicoes] = useState<Record<string, string>>({});
  const [partidosNovos, setPartidosNovos] = useState<Record<string, string>>({});
  const [votosEditados, setVotosEditados] = useState<Record<string, number>>({});
  const [ficticios, setFicticios] = useState<Ficticio[]>([]);
  const [fNome, setFNome] = useState("");
  const [fPartido, setFPartido] = useState("");
  const [fVotos, setFVotos] = useState("");
  const [exportando, setExportando] = useState<"" | "pdf" | "relatorio">("");
  const [erro, setErro] = useState<string | null>(null);

  const partidoById = useMemo(() => new Map(partidos.map((p) => [p.id, p])), [partidos]);

  const linhas = useMemo(() => {
    const base = candidatos.map((c) => ({
      id: c.id,
      nome: substituicoes[c.id]?.trim() ? substituicoes[c.id].trim().toUpperCase() : c.nome,
      partidoSigla: partidosNovos[c.id]
        ? (partidoById.get(partidosNovos[c.id])?.sigla ?? c.partidoSigla)
        : c.partidoSigla,
      votos: votosEditados[c.id] ?? c.votos,
      ficticio: false,
      substituto: Boolean(substituicoes[c.id]?.trim()),
      trocouPartido: Boolean(partidosNovos[c.id]),
      eleitoOficial: c.eleito,
    }));
    const extras = ficticios.map((f) => ({
      id: f.id,
      nome: f.nome.toUpperCase(),
      partidoSigla: partidoById.get(f.partidoId)?.sigla ?? "?",
      votos: f.votos,
      ficticio: true,
      substituto: false,
      trocouPartido: false,
      eleitoOficial: false,
    }));
    return [...base, ...extras].sort((a, b) => b.votos - a.votos);
  }, [candidatos, substituicoes, partidosNovos, votosEditados, ficticios, partidoById]);

  const totalValidos = linhas.reduce((s, l) => s + l.votos, 0);
  const lider = linhas[0];
  const pctLider = totalValidos > 0 && lider ? (lider.votos / totalValidos) * 100 : 0;
  // 2º turno só existe em disputa de vaga única (Governador/Prefeito de
  // cidade grande); Senador é maioria simples, mesmo com 2 vagas.
  const temSegundoTurno = vagas === 1 && cargoNome !== "Senador";
  const decideNoPrimeiro = !temSegundoTurno || pctLider > 50;

  const mudancas =
    Object.values(substituicoes).filter((s) => s.trim()).length +
    Object.keys(partidosNovos).length +
    Object.keys(votosEditados).length +
    ficticios.length;

  function adicionarFicticio() {
    const votos = Number(fVotos.replace(/\D/g, ""));
    if (!fNome.trim() || !fPartido || votos <= 0) return;
    setFicticios((prev) => [
      ...prev,
      { id: `ficticio-${Date.now()}`, nome: fNome.trim(), partidoId: fPartido, votos },
    ]);
    setFNome("");
    setFPartido("");
    setFVotos("");
  }

  function montarPayload() {
    return {
      rotulo,
      cargoNome,
      ano,
      anoBase,
      projetado,
      vagas,
      temSegundoTurno,
      linhas: linhas.map((l) => ({
        nome: l.nome,
        partidoSigla: l.partidoSigla,
        votos: l.votos,
        observacao:
          [
            l.ficticio ? "fictício" : null,
            l.substituto ? "substituto" : null,
            l.trocouPartido ? "trocou de partido" : null,
          ]
            .filter(Boolean)
            .join(", ") || "",
      })),
    };
  }

  async function exportar(alvo: "pdf" | "relatorio") {
    if (exportando) return;
    setExportando(alvo);
    setErro(null);
    try {
      if (alvo === "pdf") {
        const resp = await fetch("/api/pdf/cenario-majoritario", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(montarPayload()),
        });
        if (!resp.ok) throw new Error("Falha ao gerar o PDF do cenário.");
        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "cenario-majoritario.pdf";
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const resp = await fetch("/api/relatorios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tipo: "cenario-majoritario",
            params: { dados: JSON.stringify(montarPayload()) },
          }),
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
      {(aprovadosConvencao?.length ?? 0) > 0 && (
        <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/10 p-3">
          <p className="text-xs font-medium text-emerald-300">
            ✓ Aprovados nas convenções para {cargoNome} (aba Convenções) — use nos campos de
            substituição ou como fictícios:
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {aprovadosConvencao!.map((a) => (
              <span
                key={`${a.nome}-${a.partidoSigla}`}
                className="rounded-full bg-neutral-900 px-2.5 py-1 text-xs text-neutral-200"
              >
                {a.nome} <span className="text-neutral-500">({a.partidoSigla})</span>
              </span>
            ))}
          </div>
          <datalist id="aprovados-majoritario">
            {aprovadosConvencao!.map((a) => (
              <option key={`${a.nome}-${a.partidoSigla}`} value={a.nome} />
            ))}
          </datalist>
        </div>
      )}

      <div
        className={`rounded-xl border px-4 py-3 text-sm ${
          decideNoPrimeiro
            ? "border-emerald-900 bg-emerald-950/30 text-emerald-200"
            : "border-amber-900 bg-amber-950/30 text-amber-200"
        }`}
      >
        {vagas > 1 ? (
          <p>
            <span className="font-semibold">
              {linhas
                .slice(0, vagas)
                .map((l) => l.nome)
                .join(" e ")}
            </span>{" "}
            seriam eleitos ({vagas} vagas, maioria simples).
          </p>
        ) : decideNoPrimeiro ? (
          <p>
            <span className="font-semibold">{lider?.nome}</span> venceria{" "}
            {temSegundoTurno
              ? `no 1º turno, com ${pctLider.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% dos válidos`
              : `com ${pctLider.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% dos válidos`}
            .
          </p>
        ) : (
          <p>
            <span className="font-semibold">2º turno</span> entre{" "}
            <span className="font-semibold">{linhas[0]?.nome}</span> e{" "}
            <span className="font-semibold">{linhas[1]?.nome}</span> — o líder tem{" "}
            {pctLider.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% dos válidos (precisa
            de mais de 50%).
          </p>
        )}
        <p className="mt-1 text-xs text-neutral-500">
          {totalValidos.toLocaleString("pt-BR")} votos válidos no cenário
          {projetado ? ` · votos base de ${anoBase} escalados pelo eleitorado de ${ano}` : ""}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
        <div
          className="grid gap-2 border-b border-neutral-800 px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-neutral-500"
          style={{ gridTemplateColumns: "1.5fr 1.4fr 0.9fr 1fr" }}
        >
          <span>Candidato (votos base)</span>
          <span>Substituir por…</span>
          <span>Partido</span>
          <span className="text-right">Votos no cenário</span>
        </div>
        {candidatos
          .slice()
          .sort((a, b) => b.votos - a.votos)
          .map((c) => (
            <div
              key={c.id}
              className="grid items-center gap-2 border-b border-neutral-800/50 px-4 py-1.5 text-xs last:border-0"
              style={{ gridTemplateColumns: "1.5fr 1.4fr 0.9fr 1fr" }}
            >
              <span
                className={
                  substituicoes[c.id]?.trim() ? "text-neutral-500 line-through" : "text-neutral-300"
                }
              >
                {c.nome}{" "}
                <span className="text-[10px] text-neutral-600">
                  {c.votos.toLocaleString("pt-BR")}
                </span>
              </span>
              <input
                type="text"
                value={substituicoes[c.id] ?? ""}
                onChange={(e) =>
                  setSubstituicoes((prev) => ({ ...prev, [c.id]: e.target.value }))
                }
                placeholder="nome novo (herda os votos)"
                list="aprovados-majoritario"
                className="rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-1.5 text-xs text-neutral-100"
              />
              <select
                value={partidosNovos[c.id] ?? ""}
                onChange={(e) =>
                  setPartidosNovos((prev) => {
                    const next = { ...prev };
                    if (e.target.value) next[c.id] = e.target.value;
                    else delete next[c.id];
                    return next;
                  })
                }
                className="rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-1.5 text-xs text-neutral-100"
              >
                <option value="">{c.partidoSigla}</option>
                {partidos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.sigla}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={0}
                value={votosEditados[c.id] ?? c.votos}
                onChange={(e) =>
                  setVotosEditados((prev) => ({
                    ...prev,
                    [c.id]: Math.max(0, Number(e.target.value)),
                  }))
                }
                className="rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-1.5 text-right text-xs text-amber-300"
              />
            </div>
          ))}

        <div className="flex flex-col gap-2 border-t border-neutral-800 bg-sky-950/10 p-3">
          <p className="text-xs font-medium text-sky-300">
            <UserPlus size={12} className="mr-1 inline" />
            Somar candidatura fictícia à disputa
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={fNome}
              onChange={(e) => setFNome(e.target.value)}
              placeholder="Nome"
              list="aprovados-majoritario"
              className="flex-1 rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
            />
            <select
              value={fPartido}
              onChange={(e) => setFPartido(e.target.value)}
              className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
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
              min={1}
              value={fVotos}
              onChange={(e) => setFVotos(e.target.value)}
              placeholder="Votos"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 sm:w-28"
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
                  {f.nome} ({partidoById.get(f.partidoId)?.sigla} ·{" "}
                  {f.votos.toLocaleString("pt-BR")})
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

      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-neutral-500">Ranking do cenário</p>
        {linhas.map((l, i) => (
          <div
            key={l.id}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
              i < vagas ? "border border-emerald-900/60 bg-emerald-950/20" : "bg-neutral-900"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="w-5 text-right text-xs text-neutral-600">{i + 1}º</span>
              <span className={i < vagas ? "font-medium text-emerald-200" : ""}>{l.nome}</span>
              <span className="text-xs text-neutral-500">({l.partidoSigla})</span>
              {l.ficticio && (
                <span className="rounded-full bg-sky-950 px-1.5 py-0.5 text-[10px] font-semibold text-sky-300">
                  FICTÍCIO
                </span>
              )}
              {l.substituto && (
                <span className="rounded-full bg-amber-950 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
                  SUBSTITUTO
                </span>
              )}
            </span>
            <span className="text-xs text-neutral-400">
              {l.votos.toLocaleString("pt-BR")} ·{" "}
              {totalValidos > 0
                ? ((l.votos / totalValidos) * 100).toLocaleString("pt-BR", {
                    maximumFractionDigits: 1,
                  })
                : 0}
              %
            </span>
          </div>
        ))}
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
          <span className="text-xs text-neutral-600">{mudancas} mudança(s) no cenário</span>
        )}
      </div>
      {erro && (
        <p className="rounded-lg border border-red-900 bg-red-950/40 px-3 py-2 text-xs text-red-300">
          {erro}
        </p>
      )}
      <p className="text-xs text-neutral-600">
        Cenário majoritário hipotético (votos do 1º turno) — nada é alterado no sistema.
      </p>
    </div>
  );
}
