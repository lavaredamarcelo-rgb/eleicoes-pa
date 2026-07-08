"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown } from "lucide-react";

type Eleito = {
  id: string;
  nome: string;
  numero: number;
  partidoSigla: string;
  votos: number;
  viceNome: string | null;
};
type GrupoMunicipio = { municipioId: string; municipioNome: string; eleitos: Eleito[] };
type GrupoCargo = {
  cargoNome: string;
  escopo: "estadual" | "municipal";
  eleitos: Eleito[];
  municipios: GrupoMunicipio[];
  totalEleitos: number;
};

function LinhaEleito({ eleito }: { eleito: Eleito }) {
  return (
    <Link
      href={`/candidatos/${eleito.id}`}
      className="flex items-center justify-between rounded-md px-2 py-1.5 text-xs text-neutral-300 transition-colors hover:bg-neutral-900"
    >
      <span>
        {eleito.nome}
        <span className="ml-2 text-neutral-600">
          {eleito.numero} · {eleito.partidoSigla}
        </span>
        {eleito.viceNome && (
          <span className="ml-2 text-amber-400/70">vice: {eleito.viceNome}</span>
        )}
      </span>
      <span className="font-medium text-amber-400">{eleito.votos.toLocaleString("pt-BR")}</span>
    </Link>
  );
}

export function EleitosPorCargo({ cargos }: { cargos: GrupoCargo[] }) {
  const [cargoAberto, setCargoAberto] = useState<string | null>(null);
  const [municipioAberto, setMunicipioAberto] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2">
      {cargos.map((cargo) => {
        const aberto = cargoAberto === cargo.cargoNome;
        return (
          <div key={cargo.cargoNome} className="rounded-xl border border-neutral-800 bg-neutral-900">
            <button
              onClick={() => {
                setCargoAberto(aberto ? null : cargo.cargoNome);
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
                  <LinhaEleito key={e.id} eleito={e} />
                ))}
              </div>
            )}

            {aberto && cargo.escopo === "municipal" && (
              <div className="flex max-h-96 flex-col gap-1.5 overflow-y-auto px-3 pb-3">
                {cargo.municipios.map((m) => {
                  const municipioAbertoAqui = municipioAberto === m.municipioId;
                  return (
                    <div key={m.municipioId} className="rounded-lg border border-neutral-800 bg-neutral-950">
                      <button
                        onClick={() => setMunicipioAberto(municipioAbertoAqui ? null : m.municipioId)}
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
                            <LinhaEleito key={e.id} eleito={e} />
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
