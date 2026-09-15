"use client";

import { useEffect, useState, useTransition } from "react";
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
  const [pendente, startTransition] = useTransition();

  // Estado local: reflete a escolha do usuário na hora, sem esperar a
  // navegação do servidor terminar (evita perder o cargo quando o usuário
  // seleciona município logo em seguida, com o servidor ainda respondendo).
  const [cargo, setCargo] = useState(cargoSel);
  const [regiao, setRegiao] = useState(regiaoSel);
  const [municipio, setMunicipio] = useState(municipioSel);

  // Sincroniza quando a URL muda por fora (voltar/avançar do navegador).
  useEffect(() => {
    setCargo(cargoSel);
    setRegiao(regiaoSel);
    setMunicipio(municipioSel);
  }, [cargoSel, regiaoSel, municipioSel]);

  const navegar = (c: string, r: string, m: string) => {
    const p = new URLSearchParams();
    if (c) p.set("cargo", c);
    if (r) p.set("regiao", r);
    if (m) p.set("municipio", m);
    startTransition(() => {
      router.push(`/votos-municipio?${p.toString()}`);
    });
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
