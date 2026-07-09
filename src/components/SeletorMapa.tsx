"use client";

import { useRouter } from "next/navigation";

type CargoOpcao = { valor: string; nome: string; ano: number; municipal: boolean };
type CandidatoOpcao = { id: string; nome: string; sigla: string; votos: number };

// Seletores do mapa: cargo (estadual ou municipal, todos os anos) e, para
// disputas estaduais, o candidato — o mapa colore pela votação por município.
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
        <label className="mb-1 block text-xs text-neutral-500">Cargo</label>
        <select
          value={cargoSelecionado ?? ""}
          onChange={(e) =>
            router.push(e.target.value ? `/mapa?cargo=${encodeURIComponent(e.target.value)}` : "/mapa")
          }
          className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
        >
          <option value="">Visão geral (sem cargo)</option>
          {cargos.map((c) => (
            <option key={c.valor} value={c.valor}>
              {c.nome} · {c.ano}
            </option>
          ))}
        </select>
      </div>
      {cargoSelecionado && candidatos.length > 0 && (
        <div>
          <label className="mb-1 block text-xs text-neutral-500">Candidato</label>
          <select
            value={candidatoSelecionado ?? ""}
            onChange={(e) =>
              router.push(
                e.target.value
                  ? `/mapa?cargo=${encodeURIComponent(cargoSelecionado)}&candidato=${e.target.value}`
                  : `/mapa?cargo=${encodeURIComponent(cargoSelecionado)}`
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
