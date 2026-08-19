"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BotaoPdf } from "@/components/VisorPdf";

type Municipio = { municipioNome: string; peso: number; fracao: number; votosAtuais: number };
type Distribuicao = {
  id: string;
  nome: string;
  numero: number;
  partidoSigla: string;
  origem: string;
  totalAtual: number;
  base: string;
  descricaoBase: string;
  municipios: Municipio[];
};

const BASES = [
  { chave: "candidato", rotulo: "Perfil do candidato" },
  { chave: "partido", rotulo: "Perfil do partido (Dep. Estadual)" },
  { chave: "eleitorado", rotulo: "Proporcional ao eleitorado" },
] as const;

const LIMITE_LINHAS = 20;

// Meta de campanha: um alvo de votos distribuído pelos municípios conforme
// a base escolhida (perfil do candidato, do partido ou eleitorado).
export function SimuladorMeta({ distribuicao }: { distribuicao: Distribuicao }) {
  const router = useRouter();
  const [meta, setMeta] = useState(
    distribuicao.totalAtual > 0 ? Math.round(distribuicao.totalAtual * 1.2) : 50000
  );

  const linhas = useMemo(
    () =>
      distribuicao.municipios.slice(0, LIMITE_LINHAS).map((m) => {
        const necessarios = Math.round(m.fracao * meta);
        return { ...m, necessarios, diferenca: necessarios - m.votosAtuais };
      }),
    [distribuicao, meta]
  );
  const cobertura = distribuicao.municipios
    .slice(0, LIMITE_LINHAS)
    .reduce((s, m) => s + m.fracao, 0);
  const restantes = distribuicao.municipios.length - LIMITE_LINHAS;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-neutral-300">
              {distribuicao.nome}{" "}
              <span className="text-xs text-neutral-500">
                ({distribuicao.numero} · {distribuicao.partidoSigla})
              </span>
            </p>
            <p className="text-xs text-neutral-500">
              Última candidatura: {distribuicao.origem} ·{" "}
              {distribuicao.totalAtual.toLocaleString("pt-BR")} votos
            </p>
          </div>
          <BotaoPdf
            href={`/api/pdf/meta?candidato=${distribuicao.id}&base=${distribuicao.base}&meta=${meta}`}
            titulo={`Meta de campanha — ${distribuicao.nome}`}
            nomeArquivo="meta-campanha.pdf"
          />
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-neutral-500">Meta de votos</label>
            <input
              type="number"
              min={0}
              value={meta}
              onChange={(e) => setMeta(Math.max(0, Number(e.target.value)))}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-neutral-500">Base de distribuição</label>
            <select
              value={distribuicao.base}
              onChange={(e) =>
                router.push(
                  `/simulacoes?sim=meta&candidato=${distribuicao.id}&base=${e.target.value}&modo=meta#simuladores`
                )
              }
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
            >
              {BASES.map((b) => (
                <option key={b.chave} value={b.chave}>
                  {b.rotulo}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="mt-2 text-xs text-neutral-600">
          Pesos por município: {distribuicao.descricaoBase}.
        </p>
      </div>

      {linhas.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
          <div
            className="grid gap-2 border-b border-neutral-800 px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-neutral-500"
            style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}
          >
            <span>Município</span>
            <span className="text-right">Votos atuais</span>
            <span className="text-right">Necessários</span>
            <span className="text-right">A conquistar</span>
          </div>
          {linhas.map((l) => (
            <div
              key={l.municipioNome}
              className="grid gap-2 border-b border-neutral-800/50 px-4 py-2 text-xs last:border-0"
              style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}
            >
              <span className="text-neutral-300">{l.municipioNome}</span>
              <span className="text-right text-neutral-500">
                {l.votosAtuais.toLocaleString("pt-BR")}
              </span>
              <span className="text-right font-medium text-amber-400">
                {l.necessarios.toLocaleString("pt-BR")}
              </span>
              <span className={`text-right ${l.diferenca > 0 ? "text-emerald-400" : "text-neutral-500"}`}>
                {l.diferenca > 0 ? `+${l.diferenca.toLocaleString("pt-BR")}` : l.diferenca.toLocaleString("pt-BR")}
              </span>
            </div>
          ))}
          {restantes > 0 && (
            <p className="px-4 py-2 text-[11px] text-neutral-600">
              Mostrando os {LIMITE_LINHAS} municípios de maior peso ({(cobertura * 100).toFixed(0)}%
              da meta). O PDF traz a lista completa dos {distribuicao.municipios.length}.
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-neutral-500">
          Sem pesos disponíveis nessa base — tente outra base de distribuição.
        </p>
      )}
    </div>
  );
}
