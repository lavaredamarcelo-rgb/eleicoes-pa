"use client";

import { useRouter } from "next/navigation";

type Opcao = { id: string; nome: string };

export function SeletorVotosMunicipio({
  cargos,
  regioes,
  municipios,
  cargoSel,
  regiaoSel,
  municipioSel,
}: {
  cargos: { id: string; nome: string; ano: number }[];
  regioes: Opcao[];
  municipios: (Opcao & { regiaoId: string })[];
  cargoSel: string;
  regiaoSel: string;
  municipioSel: string;
}) {
  const router = useRouter();

  const navegar = (cargo: string, regiao: string, municipio: string) => {
    const p = new URLSearchParams();
    if (cargo) p.set("cargo", cargo);
    if (regiao) p.set("regiao", regiao);
    if (municipio) p.set("municipio", municipio);
    router.push(`/votos-municipio?${p.toString()}`);
  };

  const municipiosVisiveis = regiaoSel
    ? municipios.filter((m) => m.regiaoId === regiaoSel)
    : municipios;

  const cls =
    "w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100";

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div>
        <label className="mb-1 block text-xs text-neutral-500">Cargo</label>
        <select
          value={cargoSel}
          onChange={(e) => navegar(e.target.value, regiaoSel, municipioSel)}
          className={cls}
        >
          <option value="">Escolha o cargo...</option>
          {cargos.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome} · {c.ano}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs text-neutral-500">Região</label>
        <select
          value={regiaoSel}
          onChange={(e) => navegar(cargoSel, e.target.value, "")}
          className={cls}
        >
          <option value="">Todas / escolher município direto</option>
          {regioes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nome}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs text-neutral-500">Município</label>
        <select
          value={municipioSel}
          onChange={(e) => navegar(cargoSel, regiaoSel, e.target.value)}
          className={cls}
        >
          <option value="">
            {regiaoSel ? "Região inteira (somada)" : "Escolha o município..."}
          </option>
          {municipiosVisiveis.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nome}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
