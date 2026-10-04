"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CalendarClock, Star } from "lucide-react";
import { adicionarFavoritoApuracao } from "@/app/actions/apuracao";
import { ApuracaoCardFavorito, type Favorito } from "@/components/ApuracaoCardFavorito";

type Eleicao = { cd: string; nome: string; data: string };
type Candidato = {
  numero: string;
  nome: string | null;
  partido: string | null;
  votos: number;
  percentual: string;
  eleito: boolean;
  situacao: string;
};

// 2026 é eleição geral. Presidente vem da eleição FEDERAL; os demais, da
// ESTADUAL — a troca de eleição é automática ao escolher o cargo.
const CARGOS = [
  { cd: "0001", nome: "Presidente" },
  { cd: "0003", nome: "Governador" },
  { cd: "0005", nome: "Senador" },
  { cd: "0006", nome: "Deputado Federal" },
  { cd: "0007", nome: "Deputado Estadual" },
];

// Abrangências do Presidente: votos no Pará, no Brasil todo ou no EXTERIOR
// (a "UF ZZ" do TSE).
const ABRANGENCIAS_PRESIDENTE = [
  { valor: "estado", rotulo: "Pará" },
  { valor: "uf-br", rotulo: "Brasil" },
  { valor: "uf-zz", rotulo: "Exterior" },
] as const;

const INTERVALO_MS = 60_000;

// Do índice oficial do TSE, interessam apenas as Eleições Gerais de 2026
// (1º e 2º turno) — nada de suplementares, consultas ou pleitos antigos.
function filtrarGerais2026(eleicoes: Eleicao[]) {
  return eleicoes.filter(
    (e) =>
      /2026/.test(e.data) &&
      !/suplementar|consulta|plebiscito|referendo|nova/i.test(e.nome)
  );
}

export function ApuracaoAoVivo({ favoritos }: { favoritos: Favorito[] }) {
  const atualizadores = useRef(new Map<string, () => void>());
  const registrarAtualizador = useCallback((id: string, fn: () => void) => {
    atualizadores.current.set(id, fn);
  }, []);
  const [salvandoFavorito, setSalvandoFavorito] = useState(false);
  const [eleicoes2026, setEleicoes2026] = useState<Eleicao[] | null>(null);
  const [eleicaoCd, setEleicaoCd] = useState("");
  const [cargoCd, setCargoCd] = useState("0003");
  const [abrangencia, setAbrangencia] = useState<string>("estado");
  const [dados, setDados] = useState<{ candidatos: Candidato[]; meta: Record<string, unknown> } | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [atualizadoEm, setAtualizadoEm] = useState<Date | null>(null);

  useEffect(() => {
    fetch("/api/apuracao?tipo=eleicoes")
      .then((r) => r.json())
      .then((d) => {
        const gerais = filtrarGerais2026(d.eleicoes ?? []);
        setEleicoes2026(gerais);
        if (gerais[0]) setEleicaoCd(gerais[0].cd);
      })
      .catch(() => setEleicoes2026([]));
  }, []);

  const eleicaoSel = useMemo(
    () => eleicoes2026?.find((e) => e.cd === eleicaoCd),
    [eleicoes2026, eleicaoCd]
  );
  const cargoSel = CARGOS.find((c) => c.cd === cargoCd)!;

  // Presidente pertence à eleição FEDERAL; Gov/Senado/Deputados à ESTADUAL.
  // Ao trocar o cargo, escolhe sozinho a eleição certa.
  useEffect(() => {
    if (!eleicoes2026 || eleicoes2026.length < 2) return;
    const alvo =
      cargoCd === "0001"
        ? eleicoes2026.find((e) => /federal/i.test(e.nome))
        : eleicoes2026.find((e) => /estadual/i.test(e.nome));
    if (alvo && alvo.cd !== eleicaoCd) setEleicaoCd(alvo.cd);
    if (cargoCd !== "0001" && abrangencia.startsWith("uf-")) setAbrangencia("estado");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cargoCd, eleicoes2026]);

  const buscar = useCallback(async () => {
    if (!eleicaoCd) return;
    setCarregando(true);
    setErro(null);
    try {
      const resp = await fetch(
        `/api/apuracao?eleicao=${eleicaoCd}&ano=2026&cargo=${cargoCd}&mun=${cargoCd === "0001" ? abrangencia : "estado"}`
      );
      const d = await resp.json();
      if (!resp.ok) {
        setErro(d.erro ?? "Falha ao consultar o TSE.");
        setDados(null);
      } else {
        setDados(d);
        setAtualizadoEm(new Date());
      }
    } catch {
      setErro("Falha de rede ao consultar o TSE.");
    } finally {
      setCarregando(false);
    }
  }, [eleicaoCd, cargoCd, abrangencia]);

  useEffect(() => {
    if (!eleicaoCd) return;
    buscar();
    const id = setInterval(buscar, INTERVALO_MS);
    return () => clearInterval(id);
  }, [buscar, eleicaoCd]);

  async function acompanhar() {
    if (!eleicaoCd) return;
    setSalvandoFavorito(true);
    const local =
      cargoCd === "0001"
        ? ABRANGENCIAS_PRESIDENTE.find((a) => a.valor === abrangencia)?.rotulo ?? "Pará"
        : "PA";
    await adicionarFavoritoApuracao({
      rotulo: `${cargoSel.nome} · ${local} · 2026`,
      ano: "2026",
      eleicaoCd,
      cargoCd,
      municipioTse: cargoCd === "0001" && abrangencia !== "estado" ? abrangencia : null,
    });
    setSalvandoFavorito(false);
  }

  const total = dados?.candidatos.reduce((s, c) => s + c.votos, 0) ?? 0;
  const maior = dados?.candidatos[0]?.votos ?? 0;

  return (
    <div className="flex flex-col gap-4">
      {favoritos.length > 0 && (
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-neutral-400">
              Acompanhando ({favoritos.length})
            </h2>
            <button
              onClick={() => atualizadores.current.forEach((fn) => fn())}
              className="rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-300 transition-colors hover:border-neutral-500"
            >
              Atualizar todos
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {favoritos.map((f, i) => (
              <ApuracaoCardFavorito
                key={f.id}
                favorito={f}
                indice={i}
                registrarAtualizador={registrarAtualizador}
              />
            ))}
          </div>
        </section>
      )}

      {eleicoes2026 !== null && eleicoes2026.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900 px-6 py-10 text-center">
          <CalendarClock className="text-amber-400" size={28} />
          <p className="text-base font-semibold">Pronto para as Eleições Gerais de 2026</p>
          <p className="max-w-md text-sm text-neutral-400">
            Governador, Senador, Deputado Federal e Deputado Estadual. O TSE ainda não publicou o
            pleito de 2026 no índice oficial de resultados — assim que publicar, este painel liga
            sozinho e mostra a contagem em tempo real, atualizada a cada minuto.
          </p>
          <p className="text-xs text-neutral-600">
            1º turno: 4 de outubro de 2026 · 2º turno (se houver): 25 de outubro de 2026
          </p>
        </div>
      )}

      {eleicoes2026 !== null && eleicoes2026.length > 0 && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            {eleicoes2026.length > 1 &&
              eleicoes2026.map((e) => (
                <button
                  key={e.cd}
                  onClick={() => setEleicaoCd(e.cd)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    eleicaoCd === e.cd
                      ? "bg-amber-400 text-neutral-950"
                      : "border border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700"
                  }`}
                >
                  {e.nome} · {e.data}
                </button>
              ))}
            {eleicoes2026.length === 1 && (
              <span className="text-xs text-neutral-500">
                {eleicaoSel?.nome} · {eleicaoSel?.data}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {CARGOS.map((c) => (
              <button
                key={c.cd}
                onClick={() => setCargoCd(c.cd)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  cargoCd === c.cd
                    ? "bg-amber-400 text-neutral-950"
                    : "border border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700"
                }`}
              >
                {c.nome}
              </button>
            ))}
          </div>

          {cargoCd === "0001" && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-neutral-500">Votos de Presidente em:</span>
              {ABRANGENCIAS_PRESIDENTE.map((a) => (
                <button
                  key={a.valor}
                  onClick={() => setAbrangencia(a.valor)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    abrangencia === a.valor
                      ? "bg-sky-700 text-white"
                      : "border border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700"
                  }`}
                >
                  {a.rotulo}
                </button>
              ))}
            </div>
          )}

          {/* Placar da totalização — no padrão do painel oficial do TSE */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-neutral-500">
                  Seções totalizadas
                </p>
                <p className="text-2xl font-bold text-amber-400">
                  {dados?.meta?.secoesTotalizadas
                    ? `${String(dados.meta.secoesTotalizadas).replace(".", ",")}%`
                    : "—"}
                </p>
                {dados?.meta?.secoesApuradas != null && dados?.meta?.secoesTotais != null ? (
                  <p className="text-xs text-neutral-500">
                    {Number(dados.meta.secoesApuradas).toLocaleString("pt-BR")} de{" "}
                    {Number(dados.meta.secoesTotais).toLocaleString("pt-BR")} urnas/seções
                  </p>
                ) : null}
              </div>
              <div className="text-right text-xs text-neutral-500">
                <p>
                  {dados?.meta?.dg
                    ? `Última atualização do TSE: ${dados.meta.dg} às ${dados.meta.hg ?? ""}`
                    : "Aguardando a totalização começar…"}
                </p>
                <p className="mt-0.5 text-neutral-600">
                  Total de votos nesta disputa:{" "}
                  <span className="font-semibold text-neutral-300">
                    {total.toLocaleString("pt-BR")}
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-800">
              <div
                className="h-2 bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-700"
                style={{
                  width: `${Math.min(100, Number(String(dados?.meta?.secoesTotalizadas ?? "0").replace(",", ".")) || 0)}%`,
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span />

            <span className="flex items-center gap-2">
              {atualizadoEm && `Atualizado ${atualizadoEm.toLocaleTimeString("pt-BR")}`}
              <button
                onClick={acompanhar}
                disabled={salvandoFavorito || !dados}
                className="flex items-center gap-1 rounded-full border border-amber-700 px-3 py-1 text-amber-300 transition-colors hover:border-amber-500 disabled:opacity-50"
              >
                <Star size={12} />
                {salvandoFavorito ? "Salvando…" : "Acompanhar"}
              </button>
              <button
                onClick={buscar}
                disabled={carregando}
                className="rounded-full border border-neutral-700 px-3 py-1 text-neutral-300 transition-colors hover:border-neutral-500 disabled:opacity-50"
              >
                {carregando ? "Consultando…" : "Atualizar agora"}
              </button>
            </span>
          </div>

          {erro && (
            <p className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-neutral-400">
              {erro}
            </p>
          )}

          {dados && dados.candidatos.length > 0 && (
            <div className="flex flex-col gap-2">
              {dados.candidatos.map((c, i) => (
                <div key={c.numero} className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3">
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-6 text-right text-xs text-neutral-600">{i + 1}º</span>
                      <span className="font-medium">{c.nome ?? `Candidato ${c.numero}`}</span>
                      <span className="text-xs text-neutral-500">
                        {c.numero}
                        {c.partido ? ` · ${c.partido}` : ""}
                      </span>
                      {c.eleito && (
                        <span className="rounded-full bg-emerald-950 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                          {c.situacao || "Eleito"}
                        </span>
                      )}
                    </span>
                    <span className="font-semibold text-amber-400">
                      {c.votos.toLocaleString("pt-BR")}
                      <span className="ml-2 text-xs font-normal text-neutral-500">
                        {total > 0 ? `${((c.votos / total) * 100).toFixed(1)}%` : ""}
                      </span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
                    <div
                      className="h-1.5 rounded-full bg-amber-400 transition-all duration-500"
                      style={{ width: `${maior > 0 ? (c.votos / maior) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
