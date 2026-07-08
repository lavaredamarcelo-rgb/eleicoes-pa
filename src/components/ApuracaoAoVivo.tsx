"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Star } from "lucide-react";
import { adicionarFavoritoApuracao } from "@/app/actions/apuracao";
import { ApuracaoCardFavorito, type Favorito } from "@/components/ApuracaoCardFavorito";

type Eleicao = { cd: string; nome: string; data: string };
type Municipio = { codigoTse: string; nome: string };
type Candidato = {
  numero: string;
  nome: string | null;
  partido: string | null;
  votos: number;
  percentual: string;
  eleito: boolean;
  situacao: string;
};

const CARGOS = [
  { cd: "0011", nome: "Prefeito", municipal: true },
  { cd: "0013", nome: "Vereador", municipal: true },
  { cd: "0003", nome: "Governador", municipal: false },
  { cd: "0005", nome: "Senador", municipal: false },
  { cd: "0006", nome: "Deputado Federal", municipal: false },
  { cd: "0007", nome: "Deputado Estadual", municipal: false },
];

const INTERVALO_MS = 60_000;

export function ApuracaoAoVivo({
  municipios,
  favoritos,
}: {
  municipios: Municipio[];
  favoritos: Favorito[];
}) {
  const atualizadores = useRef(new Map<string, () => void>());
  const registrarAtualizador = useCallback((id: string, fn: () => void) => {
    atualizadores.current.set(id, fn);
  }, []);
  const [salvandoFavorito, setSalvandoFavorito] = useState(false);
  const [eleicoes, setEleicoes] = useState<Eleicao[]>([]);
  const [eleicaoCd, setEleicaoCd] = useState("");
  const [cargoCd, setCargoCd] = useState("0011");
  const [mun, setMun] = useState("estado");
  const [dados, setDados] = useState<{ candidatos: Candidato[]; meta: Record<string, unknown> } | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [atualizadoEm, setAtualizadoEm] = useState<Date | null>(null);

  useEffect(() => {
    fetch("/api/apuracao?tipo=eleicoes")
      .then((r) => r.json())
      .then((d) => setEleicoes(d.eleicoes ?? []))
      .catch(() => setEleicoes([]));
  }, []);

  const eleicaoSel = eleicoes.find((e) => e.cd === eleicaoCd);
  const ano = useMemo(() => {
    const m = eleicaoSel?.data.match(/\d{4}/);
    return m ? m[0] : "";
  }, [eleicaoSel]);
  const cargoSel = CARGOS.find((c) => c.cd === cargoCd)!;

  const buscar = useCallback(async () => {
    if (!eleicaoCd || !ano) return;
    setCarregando(true);
    setErro(null);
    try {
      const resp = await fetch(
        `/api/apuracao?eleicao=${eleicaoCd}&ano=${ano}&cargo=${cargoCd}&mun=${cargoSel.municipal ? mun : "estado"}`
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
  }, [eleicaoCd, ano, cargoCd, mun, cargoSel.municipal]);

  useEffect(() => {
    buscar();
    const id = setInterval(buscar, INTERVALO_MS);
    return () => clearInterval(id);
  }, [buscar]);

  function abrirFavorito(f: Favorito) {
    setEleicaoCd(f.eleicaoCd);
    setCargoCd(f.cargoCd);
    setMun(f.municipioTse ?? "estado");
  }

  async function acompanhar() {
    if (!eleicaoCd || !ano) return;
    setSalvandoFavorito(true);
    const nomeMun =
      cargoSel.municipal && mun !== "estado"
        ? municipios.find((m) => m.codigoTse === mun)?.nome ?? ""
        : "PA";
    await adicionarFavoritoApuracao({
      rotulo: `${cargoSel.nome} · ${nomeMun} · ${ano}`,
      ano,
      eleicaoCd,
      cargoCd,
      municipioTse: cargoSel.municipal && mun !== "estado" ? mun : null,
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
                aoAbrir={abrirFavorito}
                registrarAtualizador={registrarAtualizador}
              />
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4 sm:grid-cols-3">
        <div className={cargoSel.municipal ? "" : "sm:col-span-2"}>
          <label className="mb-1 block text-xs text-neutral-500">Eleição (índice oficial do TSE)</label>
          <select
            value={eleicaoCd}
            onChange={(e) => setEleicaoCd(e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
          >
            <option value="" disabled>
              Escolha…
            </option>
            {eleicoes.map((e) => (
              <option key={e.cd} value={e.cd}>
                {e.data} — {e.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-neutral-500">Cargo</label>
          <select
            value={cargoCd}
            onChange={(e) => setCargoCd(e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
          >
            {CARGOS.map((c) => (
              <option key={c.cd} value={c.cd}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
        {cargoSel.municipal && (
          <div>
            <label className="mb-1 block text-xs text-neutral-500">Município</label>
            <select
              value={mun}
              onChange={(e) => setMun(e.target.value)}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
            >
              <option value="estado" disabled>
                Escolha…
              </option>
              {municipios.map((m) => (
                <option key={m.codigoTse} value={m.codigoTse}>
                  {m.nome}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-neutral-500">
        <span>
          {dados?.meta?.dg
            ? `Totalização do TSE: ${dados.meta.dg} ${dados.meta.hg ?? ""}${dados.meta.secoesTotalizadas ? ` · ${dados.meta.secoesTotalizadas}% das seções` : ""}`
            : "Aguardando dados…"}
        </span>
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
    </div>
  );
}
