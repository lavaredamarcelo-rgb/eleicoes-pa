"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, MapPin } from "lucide-react";
import BotaoFavoritarPolitico from "./BotaoFavoritarPolitico";

type Eleito = {
  id: string;
  nome: string;
  numero: number;
  partidoSigla: string;
  votos: number;
  viceNome: string | null;
  redutoMunicipioId: string | null;
  redutoNome: string | null;
  redutoRegiaoId: string | null;
  redutoRegiaoNome: string | null;
  redutoPct: number | null;
};
type GrupoMunicipio = { municipioId: string; municipioNome: string; eleitos: Eleito[] };
type GrupoCargo = {
  cargoNome: string;
  escopo: "estadual" | "municipal";
  eleitos: Eleito[];
  municipios: GrupoMunicipio[];
  totalEleitos: number;
};
type RegiaoOpcao = { id: string; nome: string };
type MunicipioOpcao = { id: string; nome: string; regiaoId: string };

function LinhaEleito({ eleito, mostrarReduto }: { eleito: Eleito; mostrarReduto: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-md px-2 py-1.5 text-xs text-neutral-300 hover:bg-neutral-900 transition-colors group">
      <Link
        href={`/candidatos/${eleito.id}`}
        className="flex-1 min-w-0 flex items-center justify-between"
      >
        <span className="min-w-0">
          {eleito.nome}
          <span className="ml-2 text-neutral-600">
            {eleito.numero} · {eleito.partidoSigla}
          </span>
          {eleito.viceNome && (
            <span className="ml-2 text-amber-400/70">vice: {eleito.viceNome}</span>
          )}
          {mostrarReduto && eleito.redutoNome && (
            <span className="ml-2 text-neutral-500">
              <MapPin size={10} className="mr-0.5 inline" />
              reduto: {eleito.redutoNome}
              {eleito.redutoPct != null &&
                ` (${eleito.redutoPct.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%)`}
            </span>
          )}
        </span>
        <span className="shrink-0 font-medium text-amber-400">
          {eleito.votos.toLocaleString("pt-BR")}
        </span>
      </Link>
      <div className="ml-2" onClick={(e) => e.stopPropagation()}>
        <BotaoFavoritarPolitico candidatoId={eleito.id} />
      </div>
    </div>
  );
}

export function EleitosPorCargo({
  cargos,
  regioes,
  municipiosOpcoes,
}: {
  cargos: GrupoCargo[];
  regioes: RegiaoOpcao[];
  municipiosOpcoes: MunicipioOpcao[];
}) {
  const [cargoAberto, setCargoAberto] = useState<string | null>(null);
  const [municipioAberto, setMunicipioAberto] = useState<string | null>(null);
  const [regiaoSel, setRegiaoSel] = useState("");
  const [municipioSel, setMunicipioSel] = useState("");

  const regiaoDoMunicipio = useMemo(
    () => new Map(municipiosOpcoes.map((m) => [m.id, m.regiaoId])),
    [municipiosOpcoes]
  );
  const municipiosDaRegiao = regiaoSel
    ? municipiosOpcoes.filter((m) => m.regiaoId === regiaoSel)
    : municipiosOpcoes;

  const filtroAtivo = Boolean(regiaoSel || municipioSel);

  function passaFiltroEleito(e: Eleito) {
    if (municipioSel) return e.redutoMunicipioId === municipioSel;
    if (regiaoSel) return e.redutoRegiaoId === regiaoSel;
    return true;
  }
  function passaFiltroMunicipio(municipioId: string) {
    if (municipioSel) return municipioId === municipioSel;
    if (regiaoSel) return regiaoDoMunicipio.get(municipioId) === regiaoSel;
    return true;
  }

  // Com filtro ativo, os grupos são recalculados e abertos automaticamente.
  const cargosFiltrados = useMemo(
    () =>
      cargos
        .map((c) => {
          const eleitos = c.eleitos.filter(passaFiltroEleito);
          const municipios = c.municipios
            .filter((m) => passaFiltroMunicipio(m.municipioId))
            .map((m) => ({ ...m }));
          return {
            ...c,
            eleitos,
            municipios,
            totalEleitos:
              eleitos.length + municipios.reduce((s, m) => s + m.eleitos.length, 0),
          };
        })
        .filter((c) => !filtroAtivo || c.totalEleitos > 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cargos, regiaoSel, municipioSel]
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 rounded-xl border border-neutral-800 bg-neutral-900 p-3 sm:flex-row">
        <div className="flex-1">
          <label className="mb-1 block text-xs text-neutral-500">
            Filtrar por região (reduto eleitoral / município da disputa)
          </label>
          <select
            value={regiaoSel}
            onChange={(e) => {
              setRegiaoSel(e.target.value);
              setMunicipioSel("");
            }}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
          >
            <option value="">Todas as regiões</option>
            {regioes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-xs text-neutral-500">Filtrar por município</label>
          <select
            value={municipioSel}
            onChange={(e) => setMunicipioSel(e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
          >
            <option value="">Todos os municípios</option>
            {municipiosDaRegiao.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome}
              </option>
            ))}
          </select>
        </div>
        {filtroAtivo && (
          <button
            onClick={() => {
              setRegiaoSel("");
              setMunicipioSel("");
            }}
            className="self-end rounded-lg border border-neutral-700 px-3 py-2 text-xs text-neutral-400 transition-colors hover:text-neutral-200"
          >
            Limpar
          </button>
        )}
      </div>
      {filtroAtivo && (
        <p className="text-xs text-neutral-500">
          Para deputados/senadores, o filtro usa o <strong>reduto eleitoral</strong> (município
          onde o eleito foi mais votado); para prefeitos/vereadores, o município da disputa.
        </p>
      )}

      {cargosFiltrados.length === 0 && (
        <p className="rounded-xl border border-dashed border-neutral-700 bg-neutral-900/50 px-4 py-6 text-center text-sm text-neutral-500">
          Nenhum eleito com reduto nesse recorte.
        </p>
      )}

      {cargosFiltrados.map((cargo) => {
        const aberto = filtroAtivo || cargoAberto === cargo.cargoNome;
        return (
          <div key={cargo.cargoNome} className="rounded-xl border border-neutral-800 bg-neutral-900">
            <button
              onClick={() => {
                setCargoAberto(aberto && !filtroAtivo ? null : cargo.cargoNome);
                setMunicipioAberto(null);
              }}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="flex items-center gap-2">
                {aberto ? (
                  <ChevronDown size={16} className="text-neutral-500" />
                ) : (
                  <ChevronRight size={16} className="text-neutral-500" />
                )}
                <span className="font-medium">{cargo.cargoNome}</span>
              </span>
              <span className="text-xs text-neutral-500">
                {cargo.totalEleitos} eleito{cargo.totalEleitos !== 1 ? "s" : ""}
              </span>
            </button>

            {aberto && cargo.escopo === "estadual" && (
              <div className="flex max-h-96 flex-col gap-1 overflow-y-auto px-3 pb-3">
                {cargo.eleitos.map((e) => (
                  <LinhaEleito key={e.id} eleito={e} mostrarReduto />
                ))}
              </div>
            )}

            {aberto && cargo.escopo === "municipal" && (
              <div className="flex max-h-96 flex-col gap-1.5 overflow-y-auto px-3 pb-3">
                {cargo.municipios.map((m) => {
                  const municipioAbertoAqui = filtroAtivo || municipioAberto === m.municipioId;
                  return (
                    <div key={m.municipioId} className="rounded-lg border border-neutral-800 bg-neutral-950">
                      <button
                        onClick={() =>
                          setMunicipioAberto(
                            municipioAbertoAqui && !filtroAtivo ? null : m.municipioId
                          )
                        }
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm"
                      >
                        <span className="flex items-center gap-2">
                          {municipioAbertoAqui ? (
                            <ChevronDown size={14} className="text-neutral-600" />
                          ) : (
                            <ChevronRight size={14} className="text-neutral-600" />
                          )}
                          {m.municipioNome}
                        </span>
                        <span className="text-xs text-neutral-600">
                          {m.eleitos.length} eleito{m.eleitos.length !== 1 ? "s" : ""}
                        </span>
                      </button>
                      {municipioAbertoAqui && (
                        <div className="flex flex-col gap-1 px-3 pb-2">
                          {m.eleitos.map((e) => (
                            <LinhaEleito key={e.id} eleito={e} mostrarReduto={false} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
