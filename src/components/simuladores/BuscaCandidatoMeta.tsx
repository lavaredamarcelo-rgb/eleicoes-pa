"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

type Sugestao = {
  id: string;
  nome: string;
  numero: number;
  partido: string;
  cargo: string;
  municipio: string;
  ano: number;
};

// Busca em TODOS os candidatos do sistema (qualquer cargo/ano) — permite,
// por exemplo, achar um vereador que vai disputar deputado estadual.
export function BuscaCandidatoMeta({ base, modo }: { base: string; modo: string }) {
  const router = useRouter();
  const [termo, setTermo] = useState("");
  const [sugestoes, setSugestoes] = useState<Sugestao[]>([]);
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    if (termo.trim().length < 2) {
      setSugestoes([]);
      return;
    }
    const t = setTimeout(async () => {
      setBuscando(true);
      try {
        const resp = await fetch(`/api/candidatos/busca?q=${encodeURIComponent(termo)}`);
        const d = await resp.json();
        setSugestoes(d.candidatos ?? []);
      } finally {
        setBuscando(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [termo]);

  return (
    <div>
      <label className="mb-1 block text-xs text-neutral-500">
        Candidato — busque por nome ou número (qualquer cargo, qualquer eleição)
      </label>
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
        <input
          type="text"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          placeholder="Ex.: nome do seu candidato…"
          className="w-full rounded-lg border border-neutral-800 bg-neutral-900 py-2 pl-9 pr-3 text-sm text-neutral-100"
        />
      </div>
      {buscando && <p className="mt-1 text-xs text-neutral-600">Buscando…</p>}
      {sugestoes.length > 0 && (
        <div className="mt-2 flex flex-col gap-1">
          {sugestoes.map((s) => (
            <button
              key={s.id}
              onClick={() =>
                router.push(
                  `/simulacoes?sim=meta&candidato=${s.id}&base=${base}&modo=${modo}#simuladores`
                )
              }
              className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-left text-sm transition-colors hover:border-neutral-600"
            >
              <span>
                {s.nome}{" "}
                <span className="text-xs text-neutral-500">
                  {s.numero} · {s.partido}
                </span>
              </span>
              <span className="text-xs text-neutral-500">
                {s.cargo} · {s.municipio} · {s.ano}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
