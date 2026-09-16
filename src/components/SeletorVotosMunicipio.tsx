"use client";

import { useState } from "react";

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
  // Estado local para os selects responderem na hora; a navegação em si é
  // uma carga completa de página (window.location) — a navegação client-side
  // do router ficava pendurada em "Carregando" de forma intermitente no
  // aparelho, e a carga completa nunca pendura.
  const [cargo, setCargo] = useState(cargoSel);
  const [regiao, setRegiao] = useState(regiaoSel);
  const [municipio, setMunicipio] = useState(municipioSel);
  const [pendente, setPendente] = useState(false);

  const navegar = (c: string, r: string, m: string) => {
    const p = new URLSearchParams();
    if (c) p.set("cargo", c);
    if (r) p.set("regiao", r);
    if (m) p.set("municipio", m);
    setPendente(true);
    window.location.assign(`/votos-municipio?${p.toString()}`);
  };

  const municipiosVisiveis = regiao
    ? municipios.filter((m) => m.regiaoId === regiao)
    : municipios;

  const cls =
    "w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 disabled:opacity-60";

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs text-neutral-500">Cargo</label>
          <select
            value={cargo}
            disabled={pendente}
            onChange={(e) => {
              const v = e.target.value;
              setCargo(v);
              navegar(v, regiao, municipio);
            }}
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
            value={regiao}
            disabled={pendente}
            onChange={(e) => {
              const v = e.target.value;
              setRegiao(v);
              setMunicipio("");
              navegar(cargo, v, "");
            }}
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
            value={municipio}
            disabled={pendente}
            onChange={(e) => {
              const v = e.target.value;
              setMunicipio(v);
              navegar(cargo, regiao, v);
            }}
            className={cls}
          >
            <option value="">
              {regiao ? "Região inteira (somada)" : "Escolha o município..."}
            </option>
            {municipiosVisiveis.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome}
              </option>
            ))}
          </select>
        </div>
      </div>
      {pendente && (
        <p className="text-xs text-amber-400">Carregando votos...</p>
      )}
    </div>
  );
}
