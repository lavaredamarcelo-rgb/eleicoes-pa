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

type Regiao = { id: string; nome: string };
type MunicipioOpcao = { nome: string; codigoTse: string; regiaoId: string };

export function ApuracaoAoVivo({
  favoritos,
  regioes = [],
  municipios = [],
}: {
  favoritos: Favorito[];
  regioes?: Regiao[];
  municipios?: MunicipioOpcao[];
}) {
  const atualizadores = useRef(new Map<string, () => void>());
  const registrarAtualizador = useCallback((id: string, fn: () => void) => {
    atualizadores.current.set(id, fn);
  }, []);
  const [salvandoFavorito, setSalvandoFavorito] = useState(false);
  const [eleicoes2026, setEleicoes2026] = useState<Eleicao[] | null>(null);
  const [eleicaoCd, setEleicaoCd] = useState("");
  const [cargoCd, setCargoCd] = useState("0003");
  const [abrangencia, setAbrangencia] = useState<string>("estado");
  const [regiaoSel, setRegiaoSel] = useState("");
  const [municipioSel, setMunicipioSel] = useState(""); // codigoTse
  // Virada: líder anterior por recorte (cargo+local) e aviso em destaque.
  const liderAnterior = useRef<Record<string, { numero: string; nome: string }>>({});
  const [virada, setVirada] = useState<{ texto: string; hora: string } | null>(null);
  // Linha do tempo: evolução % dos dois primeiros a cada atualização.
  const historico = useRef<Record<string, { t: string; a: number; b: number }[]>>({});
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
      // Município escolhido vale para qualquer cargo (o TSE publica cada
      // disputa recortada por cidade); sem município, Presidente usa a
      // abrangência (Pará/Brasil/Exterior) e os demais usam o estado.
      const mun = municipioSel || (cargoCd === "0001" ? abrangencia : "estado");
      const resp = await fetch(
        `/api/apuracao?eleicao=${eleicaoCd}&ano=2026&cargo=${cargoCd}&mun=${mun}`
      );
      const d = await resp.json();
      if (!resp.ok) {
        setErro(d.erro ?? "Falha ao consultar o TSE.");
        setDados(null);
      } else {
        setDados(d);
        setAtualizadoEm(new Date());
        // Virada + linha do tempo (por recorte cargo+local).
        const chave = `${cargoCd}:${mun}`;
        const lider = d.candidatos?.[0];
        const vice = d.candidatos?.[1];
        if (lider?.numero) {
          const anterior = liderAnterior.current[chave];
          if (anterior && anterior.numero !== lider.numero) {
            setVirada({
              texto: `VIRADA! ${lider.nome ?? `Nº ${lider.numero}`} assumiu a liderança (antes: ${anterior.nome})`,
              hora: new Date().toLocaleTimeString("pt-BR"),
            });
          }
          liderAnterior.current[chave] = {
            numero: lider.numero,
            nome: lider.nome ?? `Nº ${lider.numero}`,
          };
          const totalAgora = (d.candidatos as Candidato[]).reduce(
            (s: number, c: Candidato) => s + c.votos,
            0
          );
          const serie = (historico.current[chave] ??= []);
          serie.push({
            t: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
            a: totalAgora > 0 ? (lider.votos / totalAgora) * 100 : 0,
            b: totalAgora > 0 && vice ? (vice.votos / totalAgora) * 100 : 0,
          });
          if (serie.length > 240) serie.shift();
        }
      }
    } catch {
      setErro("Falha de rede ao consultar o TSE.");
    } finally {
      setCarregando(false);
    }
  }, [eleicaoCd, cargoCd, abrangencia, municipioSel]);

  useEffect(() => {
    if (!eleicaoCd) return;
    buscar();
    const id = setInterval(buscar, INTERVALO_MS);
    return () => clearInterval(id);
  }, [buscar, eleicaoCd]);

  const municipioNomeSel = municipios.find((m) => m.codigoTse === municipioSel)?.nome;

  async function acompanhar() {
    if (!eleicaoCd) return;
    setSalvandoFavorito(true);
    const local = municipioNomeSel
      ? municipioNomeSel
      : cargoCd === "0001"
        ? ABRANGENCIAS_PRESIDENTE.find((a) => a.valor === abrangencia)?.rotulo ?? "Pará"
        : "PA";
    await adicionarFavoritoApuracao({
      rotulo: `${cargoSel.nome} · ${local} · 2026`,
      ano: "2026",
      eleicaoCd,
      cargoCd,
      municipioTse:
        municipioSel ||
        (cargoCd === "0001" && abrangencia !== "estado" ? abrangencia : null),
    });
    setSalvandoFavorito(false);
  }

  // Comparativo lado a lado: cria de uma vez os cards de Governador e
  // Senador (estado inteiro), para acompanhar as duas disputas juntas.
  async function acompanharComparativo() {
    const estadual =
      eleicoes2026?.find((e) => /estadual/i.test(e.nome)) ?? eleicaoSel;
    if (!estadual) return;
    setSalvandoFavorito(true);
    await adicionarFavoritoApuracao({
      rotulo: "Governador · PA · 2026",
      ano: "2026",
      eleicaoCd: estadual.cd,
      cargoCd: "0003",
      municipioTse: null,
    });
    await adicionarFavoritoApuracao({
      rotulo: "Senador · PA · 2026",
      ano: "2026",
      eleicaoCd: estadual.cd,
      cargoCd: "0005",
      municipioTse: null,
    });
    setSalvandoFavorito(false);
  }

  // Troca de recorte limpa o aviso de virada (vale para o novo recorte).
  useEffect(() => {
    setVirada(null);
  }, [cargoCd, municipioSel, abrangencia]);

  const total = dados?.candidatos.reduce((s, c) => s + c.votos, 0) ?? 0;
  const maior = dados?.candidatos[0]?.votos ?? 0;

  // MATEMATICAMENTE DEFINIDO (majoritários de vaga única): estimamos os
  // votos que ainda faltam pelo % de seções e comparamos com a vantagem.
  const pstNum = Number(String(dados?.meta?.secoesTotalizadas ?? "0").replace(",", ".")) || 0;
  const definido = (() => {
    if (!dados || !["0001", "0003"].includes(cargoCd) || pstNum < 50 || total === 0) return false;
    const lider = dados.candidatos[0]?.votos ?? 0;
    const vice = dados.candidatos[1]?.votos ?? 0;
    const restanteEstimado = total * ((100 - pstNum) / pstNum);
    return lider - vice > restanteEstimado;
  })();

  const chaveAtual = `${cargoCd}:${municipioSel || (cargoCd === "0001" ? abrangencia : "estado")}`;
  const serieAtual = historico.current[chaveAtual] ?? [];

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

          {/* Recorte por região/município — urnas de qualquer cidade do PA */}
          {municipios.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={regiaoSel}
                onChange={(e) => {
                  setRegiaoSel(e.target.value);
                  setMunicipioSel("");
                }}
                className="rounded-lg border border-neutral-700 bg-neutral-950 px-2 py-1.5 text-xs text-neutral-100"
              >
                <option value="">Todas as regiões</option>
                {regioes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nome}
                  </option>
                ))}
              </select>
              <select
                value={municipioSel}
                onChange={(e) => setMunicipioSel(e.target.value)}
                className="rounded-lg border border-neutral-700 bg-neutral-950 px-2 py-1.5 text-xs text-neutral-100"
              >
                <option value="">Pará inteiro (estado)</option>
                {(regiaoSel ? municipios.filter((m) => m.regiaoId === regiaoSel) : municipios).map(
                  (m) => (
                    <option key={m.codigoTse} value={m.codigoTse}>
                      {m.nome}
                    </option>
                  )
                )}
              </select>
              {municipioNomeSel && (
                <span className="rounded-full bg-sky-950/60 px-2.5 py-1 text-[11px] text-sky-300">
                  Urnas de {municipioNomeSel}
                </span>
              )}
            </div>
          )}

          {cargoCd === "0001" && !municipioSel && (
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

          {virada && (
            <div className="animate-pulse rounded-xl border border-red-700 bg-red-950/50 px-4 py-3">
              <p className="text-sm font-bold text-red-200">🔄 {virada.texto}</p>
              <p className="text-[11px] text-red-400">às {virada.hora}</p>
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
                style={{ width: `${Math.min(100, pstNum)}%` }}
              />
            </div>

            {/* Linha do tempo da disputa: evolução % do 1º (âmbar) e 2º (cinza) */}
            {serieAtual.length >= 3 && (
              <div className="mt-3">
                <p className="mb-1 text-[10px] uppercase tracking-wide text-neutral-600">
                  Evolução da noite ({serieAtual[0].t} → {serieAtual[serieAtual.length - 1].t})
                </p>
                <svg viewBox="0 0 300 48" className="h-12 w-full" preserveAspectRatio="none">
                  {(["b", "a"] as const).map((k) => {
                    const pts = serieAtual
                      .map((p, i) => {
                        const x = (i / (serieAtual.length - 1)) * 300;
                        const y = 46 - (Math.min(100, p[k]) / 100) * 44;
                        return `${x.toFixed(1)},${y.toFixed(1)}`;
                      })
                      .join(" ");
                    return (
                      <polyline
                        key={k}
                        points={pts}
                        fill="none"
                        stroke={k === "a" ? "#f59e0b" : "#737373"}
                        strokeWidth={k === "a" ? 2 : 1.5}
                      />
                    );
                  })}
                </svg>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-500">
            <button
              onClick={acompanharComparativo}
              disabled={salvandoFavorito}
              className="rounded-full border border-sky-800 px-3 py-1 text-sky-300 transition-colors hover:border-sky-600 disabled:opacity-50"
            >
              ⚡ Comparativo: Governador + Senado
            </button>

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
                      {i === 0 && definido && !c.eleito && (
                        <span
                          title="A vantagem sobre o 2º colocado já supera a estimativa de votos que faltam (pelo % de seções totalizadas). Estimativa nossa — vale a confirmação oficial do TSE."
                          className="rounded-full bg-emerald-950 px-2 py-0.5 text-[10px] font-medium text-emerald-300"
                        >
                          ✓ Matematicamente definido*
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
