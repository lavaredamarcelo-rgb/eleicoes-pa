"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FileDown, FolderOpen, Save, Search, Shuffle } from "lucide-react";
import { calcularSimulacao, type CandidatoSimulacao } from "@/lib/simulacaoPartido";
import { VisorPdf } from "@/components/VisorPdf";
import { salvarCenarioMeta, excluirCenarioMeta } from "@/app/actions/cenarios";
import { BotaoExcluir } from "@/components/BotaoExcluir";

type MunicipioOpcao = { id: string; nome: string; regiaoNome: string; eleitores: number };

type CenarioSalvo = {
  id: string;
  titulo: string;
  candidatoNome: string;
  partidoId: string | null;
  votos: Record<string, number>;
  total: number;
  atualizadoEm: string;
};

type Referencial = { ano: number; vagas: number; validos: number; qe: number; corte: number };

// Dados da disputa base para o estudo fictício de viabilidade (Criar Cenário).
export type EstudoViabilidade = {
  cargoId: string;
  rotulo: string;
  vagas: number;
  candidatos: CandidatoSimulacao[];
  partidos: { id: string; sigla: string; nome: string }[];
  votosLegenda: Record<string, number>;
  referencias: Referencial[];
  projecao: Referencial | null;
};

// Cenário montado à mão: o usuário dá um nome ao pretenso candidato (mesmo
// quem nunca disputou) e alimenta os votos município a município. O resumo
// mostra o total e a leitura por região, e o PDF documenta a distribuição.
// Com `estudo`, compara o total com as eleições passadas e com a projeção
// da próxima eleição — projeção FICTÍCIA, só para observar o panorama.
export function SimuladorMetaManual({
  municipios,
  nomeInicial,
  votosIniciais,
  estudo,
  cenariosSalvos,
}: {
  municipios: MunicipioOpcao[];
  nomeInicial?: string;
  votosIniciais?: Record<string, number>; // nome do município → votos
  estudo?: EstudoViabilidade;
  cenariosSalvos?: CenarioSalvo[];
}) {
  const router = useRouter();
  const [nome, setNome] = useState(nomeInicial ?? "");
  const [filtro, setFiltro] = useState("");
  const [partidoEstudo, setPartidoEstudo] = useState("");
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [pdfAberto, setPdfAberto] = useState<string | null>(null);
  // Distribuição automática a partir de um total.
  const [totalDistribuir, setTotalDistribuir] = useState("");
  const [modoDistribuicao, setModoDistribuicao] = useState<
    "proporcional" | "proporcional-aleatoria" | "aleatoria"
  >("proporcional-aleatoria");
  // Cenários salvos (convenções).
  const [cenarioAberto, setCenarioAberto] = useState<string | null>(null);
  const [titulo, setTitulo] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [msgCenario, setMsgCenario] = useState<string | null>(null);
  const [votos, setVotos] = useState<Record<string, number>>(() => {
    if (!votosIniciais) return {};
    const porNome: Record<string, number> = {};
    for (const m of municipios) {
      const v = votosIniciais[m.nome];
      if (v && v > 0) porNome[m.id] = v;
    }
    return porNome;
  });

  const normalizar = (t: string) =>
    t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const filtroNorm = normalizar(filtro.trim());
  const visiveis = filtroNorm
    ? municipios.filter((m) => normalizar(m.nome).includes(filtroNorm))
    : municipios;

  const total = useMemo(
    () => Object.values(votos).reduce((s, v) => s + (v > 0 ? v : 0), 0),
    [votos]
  );
  const comVotos = Object.values(votos).filter((v) => v > 0).length;

  const porRegiao = useMemo(() => {
    const mapa = new Map<string, number>();
    for (const m of municipios) {
      const v = votos[m.id];
      if (v && v > 0) mapa.set(m.regiaoNome, (mapa.get(m.regiaoNome) ?? 0) + v);
    }
    return Array.from(mapa.entries())
      .map(([regiao, soma]) => ({ regiao, votos: soma }))
      .sort((a, b) => b.votos - a.votos);
  }, [votos, municipios]);

  function definirVotos(id: string, valor: number) {
    setVotos((atual) => {
      const novo = { ...atual };
      if (valor > 0) novo[id] = valor;
      else delete novo[id];
      return novo;
    });
  }

  // Distribui um total pelos 144 municípios. "Proporcional" segue o
  // eleitorado; a variação aleatória (±60%) simula desempenhos desiguais;
  // "aleatória" ignora o eleitorado por completo.
  function distribuirTotal() {
    const alvo = Math.round(Number(totalDistribuir.replace(/\D/g, "")));
    if (!Number.isFinite(alvo) || alvo <= 0) return;
    const pesos = municipios.map((m) => {
      const base =
        modoDistribuicao === "aleatoria" ? Math.random() + 0.02 : Math.max(1, m.eleitores);
      const fator =
        modoDistribuicao === "proporcional-aleatoria" ? 0.4 + Math.random() * 1.2 : 1;
      return { id: m.id, peso: base * fator };
    });
    const soma = pesos.reduce((s, p) => s + p.peso, 0);
    const novo: Record<string, number> = {};
    let acumulado = 0;
    for (const p of pesos) {
      const v = Math.round((alvo * p.peso) / soma);
      if (v > 0) {
        novo[p.id] = v;
        acumulado += v;
      }
    }
    // A sobra do arredondamento vai para o município de maior peso, para o
    // total fechar exatamente no valor pedido.
    const diferenca = alvo - acumulado;
    if (diferenca !== 0) {
      const maior = [...pesos].sort((a, b) => b.peso - a.peso)[0];
      novo[maior.id] = Math.max(0, (novo[maior.id] ?? 0) + diferenca);
    }
    setVotos(novo);
  }

  function abrirCenario(c: CenarioSalvo) {
    setCenarioAberto(c.id);
    setTitulo(c.titulo);
    setNome(c.candidatoNome);
    setPartidoEstudo(c.partidoId ?? "");
    setVotos({ ...c.votos });
    setMsgCenario(null);
  }

  async function salvarCenario(comoNovo: boolean) {
    if (salvando || !estudo) return;
    setSalvando(true);
    setMsgCenario(null);
    try {
      const { id } = await salvarCenarioMeta({
        id: comoNovo ? undefined : cenarioAberto ?? undefined,
        cargoId: estudo.cargoId,
        titulo,
        candidatoNome: nome,
        partidoId: partidoEstudo || undefined,
        votos,
      });
      setCenarioAberto(id);
      setMsgCenario("✓ Cenário salvo.");
      router.refresh();
    } catch (e) {
      setMsgCenario(e instanceof Error ? e.message : "Falha ao salvar o cenário.");
    } finally {
      setSalvando(false);
    }
  }

  // Estudo de viabilidade: insere o pretenso candidato na disputa base com
  // o total alimentado e recalcula quociente e cadeiras (com legenda).
  const viabilidade = useMemo(() => {
    if (!estudo || !partidoEstudo || total <= 0) return null;
    const partidoById = new Map(estudo.partidos.map((p) => [p.id, p]));
    const ficticio: CandidatoSimulacao = {
      id: "estudo-manual",
      nome: (nome.trim() || "PRETENSO CANDIDATO").toUpperCase(),
      numero: 0,
      votos: total,
      partidoId: partidoEstudo,
      partidoSigla: partidoById.get(partidoEstudo)?.sigla ?? "?",
    };
    const resultado = calcularSimulacao(
      [...estudo.candidatos, ficticio],
      estudo.vagas,
      new Map(),
      partidoById,
      estudo.votosLegenda
    );
    const situacao = resultado.situacao.get("estudo-manual");
    return {
      sigla: ficticio.partidoSigla,
      eleito: situacao?.situacao === "eleito",
      ordemSuplencia: situacao?.ordemSuplencia ?? null,
      qeSimulado: resultado.quocienteEleitoral,
      cadeirasPartido:
        resultado.partidos.find((p) => p.partidoId === partidoEstudo)?.quocientePartidario ?? 0,
    };
  }, [estudo, partidoEstudo, total, nome]);

  const linhasReferencia = useMemo(() => {
    if (!estudo || total <= 0) return [];
    const veredicto = (r: Referencial) =>
      total >= r.qe
        ? "Atingiria o QE sozinho"
        : total >= r.corte
          ? "Acima da linha de corte"
          : `Abaixo do corte (faltam ${(r.corte - total).toLocaleString("pt-BR")})`;
    const linhas = estudo.referencias.map((r) => ({ ...r, rotulo: String(r.ano), veredicto: veredicto(r), ok: total >= r.corte }));
    if (estudo.projecao) {
      linhas.push({
        ...estudo.projecao,
        rotulo: `${estudo.projecao.ano} (projeção)`,
        veredicto: veredicto(estudo.projecao),
        ok: total >= estudo.projecao.corte,
      });
    }
    return linhas;
  }, [estudo, total]);

  async function baixarPdf() {
    if (gerandoPdf || total === 0) return;
    setGerandoPdf(true);
    try {
      const itens = municipios
        .filter((m) => (votos[m.id] ?? 0) > 0)
        .map((m) => ({ municipio: m.nome, regiao: m.regiaoNome, votos: votos[m.id] }));
      const resp = await fetch("/api/pdf/meta-manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nome.trim() || "Pretenso candidato",
          itens,
          ...(estudo && partidoEstudo
            ? { cargoId: estudo.cargoId, partidoId: partidoEstudo }
            : {}),
        }),
      });
      if (!resp.ok) throw new Error("Falha ao gerar o PDF.");
      const blob = await resp.blob();
      setPdfAberto(URL.createObjectURL(blob));
    } finally {
      setGerandoPdf(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {pdfAberto && (
        <VisorPdf
          titulo={`Distribuição de votos — ${nome.trim() || "Pretenso candidato"}`}
          blobUrl={pdfAberto}
          nomeArquivo="meta-manual.pdf"
          aoFechar={() => {
            URL.revokeObjectURL(pdfAberto);
            setPdfAberto(null);
          }}
        />
      )}
      {estudo && (
        <div className="flex flex-col gap-3 rounded-xl border border-amber-900/40 bg-amber-950/10 p-4">
          <p className="text-sm font-medium text-amber-300">
            Cenários salvos — planeje as convenções ({(cenariosSalvos ?? []).length})
          </p>
          {(cenariosSalvos ?? []).length > 0 ? (
            <div className="flex flex-col gap-1.5">
              {(cenariosSalvos ?? []).map((c) => (
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
                      {c.candidatoNome} · {c.total.toLocaleString("pt-BR")} votos ·{" "}
                      {c.atualizadoEm}
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
                        await excluirCenarioMeta(c.id);
                        if (cenarioAberto === c.id) setCenarioAberto(null);
                        router.refresh();
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-neutral-600">
              Nenhum cenário salvo para esta disputa ainda — monte a distribuição abaixo, dê um
              título e salve.
            </p>
          )}

          <div className="flex flex-col gap-2 border-t border-amber-900/30 pt-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1 block text-xs text-neutral-500">
                Título do cenário (ex.: Convenção de Santarém — chapa A)
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
              onClick={() => salvarCenario(false)}
              disabled={salvando || !titulo.trim() || total === 0}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-amber-400 px-3 py-2 text-xs font-semibold text-neutral-950 transition-opacity disabled:opacity-40"
            >
              <Save size={13} />
              {salvando ? "Salvando…" : cenarioAberto ? "Atualizar cenário" : "Salvar cenário"}
            </button>
            {cenarioAberto && (
              <button
                onClick={() => salvarCenario(true)}
                disabled={salvando || !titulo.trim() || total === 0}
                className="rounded-lg border border-amber-800 px-3 py-2 text-xs font-medium text-amber-300 transition-colors hover:border-amber-600 disabled:opacity-40"
              >
                Salvar como novo
              </button>
            )}
          </div>
          {msgCenario && (
            <p
              className={`rounded-lg px-3 py-2 text-xs ${
                msgCenario.startsWith("✓")
                  ? "border border-emerald-900 bg-emerald-950/30 text-emerald-300"
                  : "border border-red-900 bg-red-950/40 text-red-300"
              }`}
            >
              {msgCenario}
            </p>
          )}
        </div>
      )}

      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-neutral-500">
              Nome do pretenso candidato (pode ser alguém que nunca disputou)
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: Chicão"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={baixarPdf}
              disabled={gerandoPdf || total === 0}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-700 px-3 py-2 text-xs text-neutral-300 transition-colors hover:border-neutral-500 disabled:opacity-40"
            >
              <FileDown size={13} />
              {gerandoPdf ? "Gerando PDF…" : "Baixar PDF da distribuição"}
            </button>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-amber-900 bg-amber-950/20 px-3 py-2">
            <p className="text-[11px] text-amber-300">Total de votos</p>
            <p className="text-lg font-bold text-amber-300">{total.toLocaleString("pt-BR")}</p>
          </div>
          <div className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2">
            <p className="text-[11px] text-neutral-500">Municípios alimentados</p>
            <p className="text-lg font-bold text-neutral-200">
              {comVotos} <span className="text-xs font-normal text-neutral-500">de {municipios.length}</span>
            </p>
          </div>
          <div className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2">
            <p className="text-[11px] text-neutral-500">Regiões alcançadas</p>
            <p className="text-lg font-bold text-neutral-200">{porRegiao.length}</p>
          </div>
        </div>
      </div>

      {estudo && (
        <div className="flex flex-col gap-3 rounded-xl border border-violet-900/50 bg-violet-950/10 p-4">
          <div>
            <p className="text-sm font-medium text-violet-300">
              Estudo de viabilidade — projeção fictícia
            </p>
            <p className="text-xs text-neutral-500">
              Compara o total alimentado com as eleições passadas de {estudo.rotulo} e com a
              projeção da próxima eleição. É uma observação hipotética, não uma previsão: os
              votos dos demais candidatos e o quociente mudam a cada eleição.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-xs text-neutral-500">
              Partido do pretenso candidato (para simular a disputa)
            </label>
            <select
              value={partidoEstudo}
              onChange={(e) => setPartidoEstudo(e.target.value)}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
            >
              <option value="">Escolha…</option>
              {estudo.partidos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.sigla}
                </option>
              ))}
            </select>
          </div>

          {total <= 0 ? (
            <p className="text-xs text-neutral-600">
              Alimente votos nos municípios abaixo para ver o estudo.
            </p>
          ) : (
            <>
              {viabilidade && (
                <div
                  className={`rounded-lg border px-4 py-3 text-sm ${
                    viabilidade.eleito
                      ? "border-emerald-900 bg-emerald-950/30 text-emerald-200"
                      : "border-neutral-800 bg-neutral-950 text-neutral-300"
                  }`}
                >
                  <p className="font-medium">
                    {viabilidade.eleito
                      ? `✓ Na disputa base, com ${total.toLocaleString("pt-BR")} votos pelo ${viabilidade.sigla}, o pretenso candidato SERIA ELEITO neste cenário fictício.`
                      : `Na disputa base, com ${total.toLocaleString("pt-BR")} votos pelo ${viabilidade.sigla}, ficaria como ${viabilidade.ordemSuplencia}º suplente neste cenário fictício.`}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    O partido ficaria com {viabilidade.cadeirasPartido} cadeira(s) · QE do cenário:{" "}
                    {viabilidade.qeSimulado.toLocaleString("pt-BR")} (os votos alimentados entram
                    nos válidos)
                  </p>
                </div>
              )}

              {linhasReferencia.length > 0 && (
                <div className="overflow-hidden rounded-lg border border-neutral-800">
                  <div
                    className="grid gap-2 border-b border-neutral-800 bg-neutral-950 px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-neutral-500"
                    style={{ gridTemplateColumns: "1.1fr 1fr 1fr 1.6fr" }}
                  >
                    <span>Eleição</span>
                    <span className="text-right">QE</span>
                    <span className="text-right">Linha de corte</span>
                    <span className="text-right">Com seus {total.toLocaleString("pt-BR")} votos</span>
                  </div>
                  {linhasReferencia.map((l) => (
                    <div
                      key={l.rotulo}
                      className="grid gap-2 border-b border-neutral-800/50 bg-neutral-900 px-3 py-2 text-xs last:border-0"
                      style={{ gridTemplateColumns: "1.1fr 1fr 1fr 1.6fr" }}
                    >
                      <span className="text-neutral-300">{l.rotulo}</span>
                      <span className="text-right text-neutral-500">{l.qe.toLocaleString("pt-BR")}</span>
                      <span className="text-right text-neutral-500">{l.corte.toLocaleString("pt-BR")}</span>
                      <span className={`text-right ${l.ok ? "text-emerald-400" : "text-red-400"}`}>
                        {l.veredicto}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-[11px] text-neutral-600">
                Linha de corte = menor votação nominal entre os eleitos daquele ano. A projeção
                escala o último ano pelo crescimento do eleitorado. Passar do corte não garante
                eleição (depende do desempenho do partido no quociente), assim como ficar abaixo
                não impede (vagas por sobras) — use como panorama.
              </p>
            </>
          )}
        </div>
      )}

      {porRegiao.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
          <p className="border-b border-neutral-800 px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-neutral-500">
            Resumo por região
          </p>
          {porRegiao.map((r) => (
            <div
              key={r.regiao}
              className="grid gap-2 border-b border-neutral-800/50 px-4 py-2 text-xs last:border-0"
              style={{ gridTemplateColumns: "2fr 1fr 1fr" }}
            >
              <span className="text-neutral-300">{r.regiao}</span>
              <span className="text-right font-medium text-amber-400">
                {r.votos.toLocaleString("pt-BR")}
              </span>
              <span className="text-right text-neutral-500">
                {total > 0 ? `${((r.votos / total) * 100).toFixed(1)}%` : "—"}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
        <div className="flex flex-col gap-2 border-b border-neutral-800 bg-sky-950/10 p-3">
          <p className="text-xs font-medium text-sky-300">
            <Shuffle size={12} className="mr-1 inline" />
            Distribuição automática — informe o total e o sistema espalha pelos {municipios.length}{" "}
            municípios (depois ajuste à mão o que quiser)
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="number"
              min={1}
              value={totalDistribuir}
              onChange={(e) => setTotalDistribuir(e.target.value)}
              placeholder="Total de votos (ex.: 120000)"
              className="flex-1 rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
            />
            <select
              value={modoDistribuicao}
              onChange={(e) =>
                setModoDistribuicao(
                  e.target.value as "proporcional" | "proporcional-aleatoria" | "aleatoria"
                )
              }
              className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
            >
              <option value="proporcional">Proporcional ao eleitorado</option>
              <option value="proporcional-aleatoria">Proporcional com variação aleatória</option>
              <option value="aleatoria">Totalmente aleatória</option>
            </select>
            <button
              onClick={distribuirTotal}
              disabled={!totalDistribuir || Number(totalDistribuir) <= 0}
              className="rounded-lg bg-sky-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700 disabled:opacity-40"
            >
              Distribuir
            </button>
          </div>
          <p className="text-[11px] text-neutral-600">
            A distribuição substitui os votos já digitados. Clique em Distribuir de novo para
            sortear outra combinação com o mesmo total.
          </p>
        </div>
        <div className="border-b border-neutral-800 p-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
            <input
              type="text"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              placeholder="Filtrar município… (ex.: Santarém)"
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 py-2 pl-9 pr-3 text-sm text-neutral-100"
            />
          </div>
        </div>
        <div className="max-h-[28rem] overflow-y-auto">
          {visiveis.map((m) => (
            <div
              key={m.id}
              className="grid items-center gap-2 border-b border-neutral-800/50 px-4 py-1.5 text-xs last:border-0"
              style={{ gridTemplateColumns: "2fr 1fr" }}
            >
              <span className="text-neutral-300">
                {m.nome} <span className="text-[10px] text-neutral-600">{m.regiaoNome}</span>
              </span>
              <input
                type="number"
                min={0}
                value={votos[m.id] ?? ""}
                placeholder="0"
                onChange={(e) => definirVotos(m.id, Math.max(0, Number(e.target.value)))}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-1.5 text-right text-xs text-neutral-100"
              />
            </div>
          ))}
          {visiveis.length === 0 && (
            <p className="px-4 py-3 text-xs text-neutral-500">Nenhum município com esse nome.</p>
          )}
        </div>
      </div>

      <p className="text-xs text-neutral-600">
        Cenário fictício montado à mão — nada é alterado no sistema. Selecione um candidato na
        busca acima para começar com os votos reais dele já preenchidos.
      </p>
    </div>
  );
}
