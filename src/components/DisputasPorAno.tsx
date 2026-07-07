"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown } from "lucide-react";

type Municipio = { municipioId: string; municipioNome: string; totalVotos: number; cargoId: string };
type Cargo = { cargoNome: string; tipoApuracao: string; municipios: Municipio[] };
type Ano = { ano: number; tipo: string; cargos: Cargo[] };

export function DisputasPorAno({ anos }: { anos: Ano[] }) {
  const [anoAberto, setAnoAberto] = useState<number | null>(anos[0]?.ano ?? null);
  const [cargoAberto, setCargoAberto] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2">
      {anos.map((anoGrupo) => {
        const totalVotosAno = anoGrupo.cargos.reduce(
          (s, c) => s + c.municipios.reduce((s2, m) => s2 + m.totalVotos, 0),
          0
        );
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
                <span className="text-xs text-neutral-500">
                  {anoGrupo.tipo === "ESTADUAL" ? "Estadual" : "Municipal"}
                </span>
              </span>
              <span className="text-sm font-semibold text-amber-400">
                {totalVotosAno.toLocaleString("pt-BR")} votos
              </span>
            </button>

            {aberto && (
              <div className="flex flex-col gap-1.5 px-3 pb-3">
                {anoGrupo.cargos.map((cargo) => {
                  const chave = `${anoGrupo.ano}-${cargo.cargoNome}`;
                  const cargoTotalVotos = cargo.municipios.reduce((s, m) => s + m.totalVotos, 0);
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
                        <span className="text-xs font-medium text-neutral-400">
                          {cargoTotalVotos.toLocaleString("pt-BR")} votos
                        </span>
                      </button>

                      {cargoAbertoAqui && (
                        <div className="flex max-h-72 flex-col gap-1 overflow-y-auto px-3 pb-2.5">
                          {cargo.municipios.map((m) => (
                            <Link
                              key={m.municipioId}
                              href={`/municipios/${m.municipioId}`}
                              className="flex items-center justify-between rounded-md px-2 py-1.5 text-xs text-neutral-300 transition-colors hover:bg-neutral-900"
                            >
                              <span>{m.municipioNome}</span>
                              <span className="font-medium text-amber-400">
                                {m.totalVotos.toLocaleString("pt-BR")}
                              </span>
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
