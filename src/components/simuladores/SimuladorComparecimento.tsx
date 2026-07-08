"use client";

import { useMemo, useState } from "react";

// Projeta o quociente eleitoral a partir do comparecimento: quantos votos
// válidos a eleição teria com X% dos eleitores aptos votando, e quantos
// votos valeriam uma vaga direta.
export function SimuladorComparecimento({
  eleitores,
  anoEleitorado,
  vagas,
  votosValidosReais,
  quocienteReal,
}: {
  eleitores: number;
  anoEleitorado: number;
  vagas: number;
  votosValidosReais: number;
  quocienteReal: number;
}) {
  const pctReal = eleitores > 0 ? Math.round((votosValidosReais / eleitores) * 100) : 70;
  const [pct, setPct] = useState(pctReal);
  const [vagasSim, setVagasSim] = useState(vagas);

  const projecao = useMemo(() => {
    const votosValidos = Math.round(eleitores * (pct / 100));
    const qe = vagasSim > 0 ? Math.floor(votosValidos / vagasSim) : 0;
    return { votosValidos, qe };
  }, [eleitores, pct, vagasSim]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-3 text-center">
          <p className="text-lg font-semibold">{eleitores.toLocaleString("pt-BR")}</p>
          <p className="text-[11px] text-neutral-500">Eleitores aptos ({anoEleitorado})</p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-3 text-center">
          <p className="text-lg font-semibold">{quocienteReal.toLocaleString("pt-BR")}</p>
          <p className="text-[11px] text-neutral-500">QE real ({pctReal}% de votos válidos)</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
        <div>
          <label className="mb-1 block text-xs text-neutral-500">
            Votos válidos como % dos eleitores aptos: {pct}%
          </label>
          <input
            type="range"
            min={30}
            max={100}
            value={pct}
            onChange={(e) => setPct(Number(e.target.value))}
            className="w-full accent-amber-400"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-neutral-500">Vagas em disputa</label>
          <input
            type="number"
            min={1}
            value={vagasSim}
            onChange={(e) => setVagasSim(Math.max(1, Number(e.target.value)))}
            className="w-32 rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
          />
        </div>
      </div>

      <div className="rounded-xl border border-amber-900 bg-amber-950/40 px-4 py-3">
        <p className="text-xs text-amber-300">Quociente eleitoral projetado</p>
        <p className="text-2xl font-bold text-amber-300">{projecao.qe.toLocaleString("pt-BR")}</p>
        <p className="mt-1 text-xs text-neutral-400">
          {projecao.votosValidos.toLocaleString("pt-BR")} votos válidos ÷ {vagasSim} vagas — um
          partido precisa disso para uma vaga direta; candidatos individuais se elegem com menos,
          pela soma da legenda.
        </p>
      </div>
    </div>
  );
}
