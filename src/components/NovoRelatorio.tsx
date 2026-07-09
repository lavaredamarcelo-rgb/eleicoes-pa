"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles } from "lucide-react";

type PartidoOpcao = { id: string; sigla: string };
type MunicipioOpcao = { id: string; nome: string };
type AnoOpcao = { ano: number; tipo: string };
type Sugestao = {
  id: string;
  nome: string;
  numero: number;
  partido: string;
  cargo: string;
  municipio: string;
  ano: number;
};

const TIPOS = [
  {
    chave: "candidato",
    rotulo: "Desempenho de candidato",
    descricao: "Trajetória, evolução de votos, base territorial e leitura para 2026",
  },
  {
    chave: "partido",
    rotulo: "Desempenho de partido",
    descricao: "Votos e eleitos por eleição, presença municipal e bancadas",
  },
  {
    chave: "municipio",
    rotulo: "Raio-X de município",
    descricao: "Perfil, histórico de prefeitos e forças políticas da cidade",
  },
  {
    chave: "comparativo",
    rotulo: "Comparativo de eleições",
    descricao: "Duas eleições lado a lado: participação, partidos e cadeiras",
  },
  {
    chave: "livre",
    rotulo: "Pedido livre (avançado)",
    descricao: "Descreva com suas palavras; usa o panorama geral do sistema",
  },
] as const;
type Tipo = (typeof TIPOS)[number]["chave"];

// Formulário de geração: escolhe o modelo, preenche o parâmetro e envia.
// A geração leva de 15 a 60 segundos (consulta a API do Claude).
export function NovoRelatorio({
  partidos,
  municipios,
  anos,
}: {
  partidos: PartidoOpcao[];
  municipios: MunicipioOpcao[];
  anos: AnoOpcao[];
}) {
  const router = useRouter();
  const [tipo, setTipo] = useState<Tipo>("candidato");
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // parâmetros por tipo
  const [candidato, setCandidato] = useState<Sugestao | null>(null);
  const [termo, setTermo] = useState("");
  const [sugestoes, setSugestoes] = useState<Sugestao[]>([]);
  const [partidoId, setPartidoId] = useState("");
  const [municipioId, setMunicipioId] = useState("");
  const [anoA, setAnoA] = useState("");
  const [anoB, setAnoB] = useState("");
  const [pedidoLivre, setPedidoLivre] = useState("");

  useEffect(() => {
    if (termo.trim().length < 2 || candidato) {
      setSugestoes([]);
      return;
    }
    const t = setTimeout(async () => {
      const resp = await fetch(`/api/candidatos/busca?q=${encodeURIComponent(termo)}`);
      const d = await resp.json();
      setSugestoes(d.candidatos ?? []);
    }, 300);
    return () => clearTimeout(t);
  }, [termo, candidato]);

  const params = ((): Record<string, string> | null => {
    switch (tipo) {
      case "candidato":
        return candidato ? { candidatoId: candidato.id } : null;
      case "partido":
        return partidoId ? { partidoId } : null;
      case "municipio":
        return municipioId ? { municipioId } : null;
      case "comparativo":
        return anoA && anoB && anoA !== anoB ? { anoA, anoB } : null;
      case "livre":
        return pedidoLivre.trim().length >= 10 ? { pedido: pedidoLivre.trim() } : null;
    }
  })();

  async function gerar() {
    if (!params || gerando) return;
    setGerando(true);
    setErro(null);
    try {
      const resp = await fetch("/api/relatorios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, params }),
      });
      const d = await resp.json();
      if (!resp.ok) throw new Error(d.error ?? "Falha ao gerar o relatório.");
      router.push(`/relatorios/${d.id}`);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao gerar o relatório.");
      setGerando(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {TIPOS.map((t) => (
          <button
            key={t.chave}
            onClick={() => {
              setTipo(t.chave);
              setErro(null);
            }}
            className={`rounded-xl border px-3 py-2.5 text-left transition-colors ${
              tipo === t.chave
                ? "border-amber-500 bg-amber-950/30"
                : "border-neutral-800 bg-neutral-950 hover:border-neutral-700"
            }`}
          >
            <p className="text-sm font-medium">{t.rotulo}</p>
            <p className="text-xs text-neutral-500">{t.descricao}</p>
          </button>
        ))}
      </div>

      {tipo === "candidato" && (
        <div>
          <label className="mb-1 block text-xs text-neutral-500">
            Candidato — busque por nome ou número (qualquer cargo, qualquer eleição)
          </label>
          {candidato ? (
            <div className="flex items-center justify-between rounded-lg border border-amber-700 bg-amber-950/30 px-3 py-2 text-sm">
              <span>
                {candidato.nome}{" "}
                <span className="text-xs text-neutral-400">
                  {candidato.partido} · {candidato.cargo} · {candidato.ano}
                </span>
              </span>
              <button
                onClick={() => {
                  setCandidato(null);
                  setTermo("");
                }}
                className="text-xs text-neutral-400 hover:text-neutral-200"
              >
                trocar
              </button>
            </div>
          ) : (
            <>
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600"
                />
                <input
                  type="text"
                  value={termo}
                  onChange={(e) => setTermo(e.target.value)}
                  placeholder="Ex.: nome do candidato…"
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 py-2 pl-9 pr-3 text-sm text-neutral-100"
                />
              </div>
              {sugestoes.length > 0 && (
                <div className="mt-2 flex flex-col gap-1">
                  {sugestoes.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setCandidato(s)}
                      className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-left text-sm transition-colors hover:border-neutral-600"
                    >
                      <span>
                        {s.nome}{" "}
                        <span className="text-xs text-neutral-500">
                          {s.numero} · {s.partido}
                        </span>
                      </span>
                      <span className="text-xs text-neutral-500">
                        {s.cargo} · {s.municipio} · {s.ano}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {tipo === "partido" && (
        <div>
          <label className="mb-1 block text-xs text-neutral-500">Partido</label>
          <select
            value={partidoId}
            onChange={(e) => setPartidoId(e.target.value)}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
          >
            <option value="">Escolha…</option>
            {partidos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.sigla}
              </option>
            ))}
          </select>
        </div>
      )}

      {tipo === "municipio" && (
        <div>
          <label className="mb-1 block text-xs text-neutral-500">Município</label>
          <select
            value={municipioId}
            onChange={(e) => setMunicipioId(e.target.value)}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
          >
            <option value="">Escolha…</option>
            {municipios.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome}
              </option>
            ))}
          </select>
        </div>
      )}

      {tipo === "comparativo" && (
        <div className="grid grid-cols-2 gap-3">
          {[
            { rotulo: "Eleição A", valor: anoA, setar: setAnoA },
            { rotulo: "Eleição B", valor: anoB, setar: setAnoB },
          ].map((sel) => (
            <div key={sel.rotulo}>
              <label className="mb-1 block text-xs text-neutral-500">{sel.rotulo}</label>
              <select
                value={sel.valor}
                onChange={(e) => sel.setar(e.target.value)}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
              >
                <option value="">Escolha…</option>
                {anos.map((a) => (
                  <option key={a.ano} value={a.ano}>
                    {a.ano} ({a.tipo === "MUNICIPAL" ? "municipal" : "estadual"})
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {tipo === "livre" && (
        <div>
          <label className="mb-1 block text-xs text-neutral-500">
            Descreva o relatório que você quer
          </label>
          <textarea
            value={pedidoLivre}
            onChange={(e) => setPedidoLivre(e.target.value)}
            rows={3}
            placeholder="Ex.: analise a força do MDB nas prefeituras e na Assembleia e aponte riscos para 2026…"
            className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
          />
          <p className="mt-1 text-[11px] text-neutral-600">
            O pedido livre usa o panorama geral (anos, partidos, bancadas, prefeituras). Para
            análises profundas de um candidato, partido ou município, prefira os modelos guiados.
          </p>
        </div>
      )}

      {erro && (
        <p className="rounded-lg border border-red-900 bg-red-950/40 px-3 py-2 text-sm text-red-300">
          {erro}
        </p>
      )}

      <button
        onClick={gerar}
        disabled={!params || gerando}
        className="flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-semibold text-neutral-950 transition-opacity disabled:opacity-40"
      >
        <Sparkles size={16} />
        {gerando ? "Gerando relatório… (pode levar até 1 minuto)" : "Gerar relatório"}
      </button>
    </div>
  );
}
