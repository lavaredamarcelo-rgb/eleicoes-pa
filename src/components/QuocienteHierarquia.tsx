"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown } from "lucide-react";

type Municipio = { municipioId: string; municipioNome: string; cargoId: string };
type Cargo = {
  cargoNome: string;
  tipoApuracao: string;
  escopo: "estadual" | "municipal";
  cargoId?: string;
  municipios: Municipio[];
};
type Ano = { ano: number; cargos: Cargo[] };

export function QuocienteHierarquia({ anos, basePath = "/quociente" }: { anos: Ano[]; basePath?: string }) {
  const [anoAberto, setAnoAberto] = useState<number | null>(anos[0]?.ano ?? null);
  const [cargoAberto, setCargoAberto] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2">
      {anos.map((anoGrupo) => {
        const aberto = anoAberto === anoGrupo.ano;
        return (
          <div key={anoGrupo.ano} className="rounded-xl border border-neutral-800 bg-neutral-900">
            <button
              onClick={() => {
                setAnoAberto(aberto ? null : anoGrupo.ano);
                setCargoAberto(null);
              }}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="flex items-center gap-2">
                {aberto ? (
                  <ChevronDown size={16} className="text-neutral-500" />
                ) : (
                  <ChevronRight size={16} className="text-neutral-500" />
                )}
                <span className="font-medium">{anoGrupo.ano}</span>
              </span>
              <span className="text-xs text-neutral-500">
                {anoGrupo.cargos.length} cargo{anoGrupo.cargos.length !== 1 ? "s" : ""}
              </span>
            </button>

            {aberto && (
              <div className="flex flex-col gap-1.5 px-3 pb-3">
                {anoGrupo.cargos.map((cargo) => {
                  if (cargo.escopo === "estadual" && cargo.cargoId) {
                    return (
                      <Link
                        key={cargo.cargoNome}
                        href={`${basePath}/${cargo.cargoId}`}
                        className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm transition-colors hover:border-neutral-700 hover:bg-neutral-900"
                      >
                        <span>
                          {cargo.cargoNome} <span className="text-xs text-neutral-600">· PA</span>
                        </span>
                        <span className="rounded-full bg-neutral-800 px-2 py-1 text-xs text-neutral-300">
                          {cargo.tipoApuracao === "PROPORCIONAL" ? "Proporcional" : "Majoritário"}
                        </span>
                      </Link>
                    );
                  }

                  const chave = `${anoGrupo.ano}-${cargo.cargoNome}`;
                  const cargoAbertoAqui = cargoAberto === chave;
                  return (
                    <div key={chave} className="rounded-lg border border-neutral-800 bg-neutral-950">
                      <button
                        onClick={() => setCargoAberto(cargoAbertoAqui ? null : chave)}
                        className="flex w-full items-center justify-between px-3 py-2.5 text-left"
                      >
                        <span className="flex items-center gap-2 text-sm">
                          {cargoAbertoAqui ? (
                            <ChevronDown size={14} className="text-neutral-600" />
                          ) : (
                            <ChevronRight size={14} className="text-neutral-600" />
                          )}
                          {cargo.cargoNome}
                          <span className="text-xs text-neutral-600">
                            ({cargo.municipios.length} município{cargo.municipios.length !== 1 ? "s" : ""})
                          </span>
                        </span>
                      </button>

                      {cargoAbertoAqui && (
                        <div className="flex max-h-72 flex-col gap-1 overflow-y-auto px-3 pb-2.5">
                          {cargo.municipios.map((m) => (
                            <Link
                              key={m.municipioId}
                              href={`${basePath}/${m.cargoId}`}
                              className="flex items-center justify-between rounded-md px-2 py-1.5 text-xs text-neutral-300 transition-colors hover:bg-neutral-900"
                            >
                              <span>{m.municipioNome}</span>
                              <ChevronRight size={12} className="text-neutral-600" />
                            </Link>
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
