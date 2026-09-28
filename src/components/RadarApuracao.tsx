"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Bell, BellOff, FileDown, MonitorPlay, Play, Radio, Square } from "lucide-react";
import { distribuirVagas } from "@/lib/simulacaoPartido";
import { BotaoPdfPost } from "@/components/VisorPdf";

type CandidatoRadar = {
  numero: number;
  nome: string;
  votos: number;
  pct: number;
  situacaoTSE: string | null;
};
type Snapshot = {
  cargo: string;
  pctApurado: number;
  atualizadoEm: string;
  candidatos: CandidatoRadar[];
  totalVotos: number;
  fonte: "tse" | "simulado" | "aguardando";
  mensagem?: string;
};

const CARGOS = [
  { chave: "governador", rotulo: "Governador" },
  { chave: "senador", rotulo: "Senador (2 vagas)" },
  { chave: "dep-federal", rotulo: "Dep. Federal" },
  { chave: "dep-estadual", rotulo: "Dep. Estadual" },
  { chave: "presidente", rotulo: "Presidente" },
] as const;

const PROPORCIONAIS = new Set(["dep-federal", "dep-estadual"]);
// Duração do ensaio: 0 → 100% de apuração em 8 minutos.
const DURACAO_SIMULADO_MS = 8 * 60 * 1000;

const fmt = (n: number) => n.toLocaleString("pt-BR");
const norm = (s: string) => s.toUpperCase().trim();

export function RadarApuracao({
  vagas,
  siglaPorPrefixo,
  nomesFavoritos,
  mediasPesquisas,
  modoTV,
}: {
  vagas: Record<string, number>;
  siglaPorPrefixo: Record<string, string>;
  nomesFavoritos: string[];
  mediasPesquisas: Record<string, Record<string, number>>;
  modoTV: boolean;
}) {
  const [cargo, setCargo] = useState<string>("governador");
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [simulado, setSimulado] = useState(false);
  const [inicioSimulado, setInicioSimulado] = useState<number | null>(null);
  const [notifica, setNotifica] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const situacaoAnterior = useRef<Map<string, string>>(new Map());
  const favoritos = useMemo(() => new Set(nomesFavoritos.map(norm)), [nomesFavoritos]);

  const siglaDe = useCallback(
    (numero: number) => {
      const prefixo = String(numero).length >= 4 ? String(numero).slice(0, 2) : String(numero);
      return siglaPorPrefixo[prefixo] ?? `#${prefixo}`;
    },
    [siglaPorPrefixo]
  );

  // Projeção de cadeiras dos proporcionais a partir da apuração parcial
  // (quociente partidário + maiores médias; sem legenda — aproximação até
  // o TSE liberar o arquivo detalhado).
  const projecao = useMemo(() => {
    if (!snap || !PROPORCIONAIS.has(snap.cargo) || snap.totalVotos === 0) return null;
    const nVagas = vagas[snap.cargo] ?? 0;
    const porPartido = new Map<string, number>();
    for (const c of snap.candidatos) {
      const sigla = siglaDe(c.numero);
      porPartido.set(sigla, (porPartido.get(sigla) ?? 0) + c.votos);
    }
    const qe = Math.floor(snap.totalVotos / nVagas) || 1;
    const cadeiras = distribuirVagas(
      [...porPartido.entries()].map(([partidoId, votos]) => ({ partidoId, votos })),
      nVagas,
      qe
    );
    const eleitosPorPartido = new Map<string, number>();
    const situacao = new Map<number, "eleito" | "media">();
    const porSigla = new Map<string, CandidatoRadar[]>();
    for (const c of snap.candidatos) {
      const s = siglaDe(c.numero);
      const lista = porSigla.get(s) ?? [];
      lista.push(c);
      porSigla.set(s, lista);
    }
    for (const [sigla, lista] of porSigla) {
      const n = cadeiras.get(sigla) ?? 0;
      eleitosPorPartido.set(sigla, n);
      lista
        .sort((a, b) => b.votos - a.votos)
        .slice(0, n)
        .forEach((c) => situacao.set(c.numero, "eleito"));
    }
    return { qe, cadeiras: eleitosPorPartido, situacao };
  }, [snap, vagas, siglaDe]);

  // Busca de dados: TSE (45s) ou simulado (10s, progresso pelo relógio).
  useEffect(() => {
    let vivo = true;
    async function buscar() {
      try {
        let url = `/api/radar?cargo=${cargo}`;
        if (simulado && inicioSimulado) {
          const t = Math.min(100, ((Date.now() - inicioSimulado) / DURACAO_SIMULADO_MS) * 100);
          url += `&simulado=1&t=${t.toFixed(1)}`;
        }
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(String(resp.status));
        const dados = (await resp.json()) as Snapshot;
        if (vivo) {
          setSnap(dados);
          setErro(null);
        }
      } catch (e) {
        if (vivo) setErro(e instanceof Error ? e.message : "erro");
      }
    }
    buscar();
    const id = setInterval(buscar, simulado ? 10_000 : 45_000);
    return () => {
      vivo = false;
      clearInterval(id);
    };
  }, [cargo, simulado, inicioSimulado]);

  // Notificações locais: dispara quando um favorito (ou líder) muda de
  // situação — funciona com o aplicativo aberto durante a apuração.
  useEffect(() => {
    if (!snap || !notifica || typeof Notification === "undefined") return;
    for (const c of snap.candidatos) {
      const chaveSit = `${snap.cargo}:${c.numero}`;
      const sitNova =
        c.situacaoTSE ?? (projecao?.situacao.get(c.numero) === "eleito" ? "Eleito (projeção)" : "");
      const sitVelha = situacaoAnterior.current.get(chaveSit) ?? "";
      if (sitNova && sitNova !== sitVelha && (favoritos.has(norm(c.nome)) || c.pct >= 40)) {
        try {
          new Notification(`🗳️ ${c.nome}`, {
            body: `${sitNova} — ${fmt(c.votos)} votos (${c.pct.toFixed(1)}%) · ${snap.pctApurado.toFixed(1)}% apurado`,
          });
        } catch {}
      }
      situacaoAnterior.current.set(chaveSit, sitNova);
    }
  }, [snap, notifica, projecao, favoritos]);

  async function ligarNotificacoes() {
    if (typeof Notification === "undefined") return;
    if (Notification.permission !== "granted") {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") return;
    }
    setNotifica(true);
    try {
      new Notification("🗳️ Radar da Apuração", { body: "Alertas ligados — avisarei sobre seus favoritos e os líderes." });
    } catch {}
  }

  const medias = mediasPesquisas[cargo] ?? null;
  const tv = modoTV;
  const tituloCls = tv ? "text-3xl" : "text-lg";
  const nomeCls = tv ? "text-2xl" : "text-sm";
  const pctCls = tv ? "text-3xl" : "text-base";

  return (
    <div className={`flex flex-col gap-4 ${tv ? "px-2 py-4" : ""}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className={`${tituloCls} font-semibold`}>
            <Radio size={tv ? 28 : 16} className="mr-1.5 inline animate-pulse text-red-500" />
            Radar da Apuração
          </h1>
          <p className={`${tv ? "text-base" : "text-sm"} text-neutral-500`}>
            {snap?.fonte === "tse"
              ? "AO VIVO — dados oficiais do TSE"
              : snap?.fonte === "simulado"
                ? "MODO SIMULADO — ensaio com os resultados de 2022"
                : "Aguardando a totalização do TSE"}
            {snap && ` · atualizado ${new Date(snap.atualizadoEm).toLocaleTimeString("pt-BR")}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              if (simulado) {
                setSimulado(false);
                setInicioSimulado(null);
              } else {
                setInicioSimulado(Date.now());
                setSimulado(true);
              }
            }}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
              simulado
                ? "bg-red-900/70 text-red-200 hover:bg-red-900"
                : "bg-sky-800 text-white hover:bg-sky-700"
            }`}
          >
            {simulado ? <Square size={13} /> : <Play size={13} />}
            {simulado ? "Encerrar simulado" : "Iniciar simulado (ensaio)"}
          </button>
          <button
            onClick={() => (notifica ? setNotifica(false) : ligarNotificacoes())}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs transition-colors ${
              notifica
                ? "border-emerald-800 bg-emerald-950/40 text-emerald-300"
                : "border-neutral-700 text-neutral-300 hover:border-neutral-500"
            }`}
          >
            {notifica ? <Bell size={13} /> : <BellOff size={13} />}
            {notifica ? "Alertas ligados" : "Ligar alertas"}
          </button>
          {!tv && (
            <a
              href="/radar?tv=1"
              target="_blank"
              className="flex items-center gap-1.5 rounded-lg border border-neutral-700 px-3 py-2 text-xs text-neutral-300 hover:border-neutral-500"
            >
              <MonitorPlay size={13} />
              Modo TV
            </a>
          )}
          {snap && snap.totalVotos > 0 && (
            <BotaoPdfPost
              url="/api/pdf/fechamento"
              label="PDF do momento"
              titulo="Fechamento da apuração"
              nomeArquivo="fechamento-apuracao.pdf"
              payload={() => ({
                cargoRotulo: CARGOS.find((c) => c.chave === cargo)?.rotulo ?? cargo,
                pctApurado: snap.pctApurado,
                fonte: snap.fonte,
                vagas: vagas[cargo] ?? 0,
                qe: projecao?.qe ?? null,
                cadeiras: projecao ? Object.fromEntries(projecao.cadeiras) : null,
                candidatos: snap.candidatos.slice(0, 200).map((c) => ({
                  nome: c.nome,
                  numero: c.numero,
                  sigla: siglaDe(c.numero),
                  votos: c.votos,
                  pct: c.pct,
                  situacao:
                    c.situacaoTSE ??
                    (projecao?.situacao.get(c.numero) === "eleito" ? "Eleito (proj.)" : ""),
                })),
                mediasPesquisas: medias,
              })}
            />
          )}
        </div>
      </div>

      {/* Barra de progresso da totalização */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-3">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-neutral-400">Seções totalizadas</span>
          <span className={`font-bold text-amber-400 ${tv ? "text-2xl" : ""}`}>
            {(snap?.pctApurado ?? 0).toFixed(1)}%
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-800">
          <div
            className="h-3 bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-700"
            style={{ width: `${snap?.pctApurado ?? 0}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {CARGOS.map((c) => (
          <button
            key={c.chave}
            onClick={() => setCargo(c.chave)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              cargo === c.chave
                ? "bg-amber-400 text-neutral-950"
                : "border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-neutral-200"
            } ${tv ? "text-base px-4 py-2" : ""}`}
          >
            {c.rotulo}
          </button>
        ))}
      </div>

      {erro && (
        <p className="rounded-lg border border-red-900 bg-red-950/40 px-3 py-2 text-xs text-red-300">
          Falha ao atualizar ({erro}) — tentando de novo…
        </p>
      )}
      {snap?.mensagem && (
        <p className="rounded-lg border border-sky-900/60 bg-sky-950/20 px-3 py-2 text-xs text-sky-300">
          {snap.mensagem}
        </p>
      )}

      {/* Projeção de cadeiras (proporcionais) */}
      {projecao && (
        <div className="rounded-xl border border-amber-900/60 bg-amber-950/15 p-3">
          <p className={`mb-2 font-medium text-amber-300 ${tv ? "text-xl" : "text-sm"}`}>
            Projeção de cadeiras (parcial) — QE {fmt(projecao.qe)}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[...projecao.cadeiras.entries()]
              .filter(([, n]) => n > 0)
              .sort((a, b) => b[1] - a[1])
              .map(([sigla, n]) => (
                <span
                  key={sigla}
                  className={`rounded-lg border border-amber-900/50 bg-neutral-950 px-2.5 py-1 text-neutral-200 ${tv ? "text-lg" : "text-xs"}`}
                >
                  <strong className="text-amber-300">{sigla}</strong> {n}
                </span>
              ))}
          </div>
          <p className="mt-1.5 text-[10px] text-neutral-600">
            Aproximação sem votos de legenda — refina conforme a apuração avança.
          </p>
        </div>
      )}

      {/* Corrida */}
      <div className="flex flex-col gap-1.5">
        {(snap?.candidatos ?? []).slice(0, tv ? 12 : 60).map((c, i) => {
          const fav = favoritos.has(norm(c.nome));
          const sit =
            c.situacaoTSE ??
            (projecao?.situacao.get(c.numero) === "eleito" ? "Eleito (proj.)" : null);
          const media = medias?.[norm(c.nome)];
          const lider = snap!.candidatos[0]?.votos || 1;
          return (
            <div
              key={c.numero}
              className={`rounded-xl border p-3 ${
                fav
                  ? "border-amber-700 bg-amber-950/20"
                  : "border-neutral-800 bg-neutral-900"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className={`w-7 shrink-0 text-right text-neutral-600 ${tv ? "text-xl" : "text-xs"}`}>
                    {i + 1}º
                  </span>
                  <div className="min-w-0">
                    <p className={`${nomeCls} font-medium text-neutral-100`}>
                      {fav && "⭐ "}
                      {c.nome}{" "}
                      <span className="text-neutral-500">
                        {c.numero} · {siglaDe(c.numero)}
                      </span>
                      {sit && (
                        <span className={`ml-2 rounded bg-emerald-950/70 px-1.5 py-0.5 font-semibold text-emerald-400 ${tv ? "text-base" : "text-[10px]"}`}>
                          {sit}
                        </span>
                      )}
                    </p>
                    {media != null && (
                      <p className={`text-neutral-500 ${tv ? "text-sm" : "text-[10px]"}`}>
                        Pesquisas: {media.toFixed(1)}% →{" "}
                        <span
                          className={
                            c.pct - media > 1.5
                              ? "text-emerald-400"
                              : c.pct - media < -1.5
                                ? "text-red-400"
                                : "text-neutral-400"
                          }
                        >
                          {c.pct - media >= 0 ? "▲" : "▼"} {Math.abs(c.pct - media).toFixed(1)} p.p.
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`${pctCls} font-bold tabular-nums text-amber-400`}>
                    {c.pct.toFixed(1)}%
                  </p>
                  <p className={`tabular-nums text-neutral-500 ${tv ? "text-base" : "text-[11px]"}`}>
                    {fmt(c.votos)} votos
                  </p>
                </div>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
                <div
                  className={`h-1.5 transition-all duration-700 ${fav ? "bg-amber-400" : "bg-neutral-500"}`}
                  style={{ width: `${(c.votos / lider) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
        {snap && snap.candidatos.length === 0 && !snap.mensagem && (
          <p className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-3 text-xs text-neutral-500">
            Sem dados ainda para este cargo.
          </p>
        )}
      </div>

      {!tv && (
        <p className="text-xs text-neutral-600">
          <FileDown size={11} className="mr-1 inline" />
          Os alertas funcionam com o aplicativo aberto. A boca de urna virtual compara o apurado
          com a média das 3 últimas pesquisas válidas. Projeção de cadeiras usa quociente
          partidário + maiores médias sobre a apuração parcial.
        </p>
      )}
    </div>
  );
}
