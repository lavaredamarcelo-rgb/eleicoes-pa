"use client";

import { useRouter } from "next/navigation";

type CargoOpcao = { id: string; nome: string; ano: number };
type CandidatoOpcao = { id: string; nome: string; sigla: string; votos: number };

// Seletores do mapa: cargo estadual (Governador/Senador/Deputados) e, em
// seguida, o candidato — o mapa colore pela votação dele por município.
export function SeletorMapa({
  cargos,
  cargoSelecionado,
  candidatos,
  candidatoSelecionado,
}: {
  cargos: CargoOpcao[];
  cargoSelecionado?: string;
  candidatos: CandidatoOpcao[];
  candidatoSelecionado?: string;
}) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div>
        <label className="mb-1 block text-xs text-neutral-500">Cargo (disputa estadual)</label>
        <select
          value={cargoSelecionado ?? ""}
          onChange={(e) => router.push(e.target.value ? `/mapa?cargo=${e.target.value}` : "/mapa")}
          className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
        >
          <option value="">Visão geral (sem cargo)</option>
          {cargos.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome} · {c.ano}
            </option>
          ))}
        </select>
      </div>
      {cargoSelecionado && (
        <div>
          <label className="mb-1 block text-xs text-neutral-500">Candidato</label>
          <select
            value={candidatoSelecionado ?? ""}
            onChange={(e) =>
              router.push(
                e.target.value
                  ? `/mapa?cargo=${cargoSelecionado}&candidato=${e.target.value}`
                  : `/mapa?cargo=${cargoSelecionado}`
              )
            }
            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
          >
            <option value="">Todos (total do cargo)</option>
            {candidatos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome} ({c.sigla} · {c.votos.toLocaleString("pt-BR")})
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
