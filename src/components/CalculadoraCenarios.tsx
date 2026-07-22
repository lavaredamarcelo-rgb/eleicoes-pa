"use client";

import { useMemo, useState } from "react";

export function CalculadoraCenarios({
  vagasIniciais,
  votosValidosIniciais,
  projecao,
  rotuloReferencia,
}: {
  vagasIniciais?: number;
  votosValidosIniciais?: number;
  projecao?: { ano: number; votosValidos: number; eleitoresAptos: number; aptosOficiais?: boolean };
  rotuloReferencia?: string;
} = {}) {
  const [vagas, setVagas] = useState(vagasIniciais ?? 10);
  const [votosValidos, setVotosValidos] = useState(votosValidosIniciais ?? 100000);
  const [baseProjecao, setBaseProjecao] = useState<"ano" | "validos" | "aptos">("validos");
  const [pctBase, setPctBase] = useState(100);

  const [entidade, setEntidade] = useState<"candidato" | "partido">("candidato");
  const [votosAtuais, setVotosAtuais] = useState(5000);
  const [crescimento, setCrescimento] = useState(0);

  const quocienteEleitoral = useMemo(
    () => (vagas > 0 ? Math.floor(votosValidos / vagas) : 0),
    [votosValidos, vagas]
  );

  const votosProjetados = useMemo(
    () => Math.max(0, Math.round(votosAtuais * (1 + crescimento / 100))),
    [votosAtuais, crescimento]
  );

  const faltam = Math.max(0, quocienteEleitoral - votosProjetados);
  const atingeQuociente = quocienteEleitoral > 0 && votosProjetados >= quocienteEleitoral;
  // Quociente partidário (art. 107): vagas diretas do partido com esse total.
  const vagasPartido =
    quocienteEleitoral > 0 ? Math.min(vagas, Math.floor(votosProjetados / quocienteEleitoral)) : 0;

  // Base escolhida para preencher os votos válidos, com percentual de
  // comparecimento (ex.: 70% dos aptos simula as abstenções).
  const valorBase =
    baseProjecao === "ano"
      ? votosValidosIniciais ?? 0
      : baseProjecao === "validos"
        ? projecao?.votosValidos ?? 0
        : projecao?.eleitoresAptos ?? 0;
  const valorCalculado = Math.round(valorBase * (pctBase / 100));
  const usandoProjecao = valorCalculado > 0 && votosValidos === valorCalculado;

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
        <p className="text-sm font-medium text-neutral-300">Quociente eleitoral do cenário</p>
        {rotuloReferencia && (
          <p className="rounded-md bg-amber-950/40 px-3 py-1.5 text-xs text-amber-300">
            Pré-carregado com os dados reais de {rotuloReferencia} — ajuste livremente os campos.
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <label className="mb-1 block text-xs text-neutral-500">Vagas em disputa</label>
            <input
              type="number"
              min={1}
              value={vagas}
              onChange={(e) => setVagas(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-xs text-neutral-500">Votos válidos totais</label>
            <input
              type="number"
              min={0}
              value={votosValidos}
              onChange={(e) => setVotosValidos(Math.max(0, Number(e.target.value)))}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
            />
          </div>
        </div>

        {projecao && (
          <div className="flex flex-col gap-2 rounded-lg border border-amber-900/50 bg-amber-950/10 p-3">
            <p className="text-xs font-medium text-amber-300">
              Preencher os votos válidos a partir de uma base
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label className="mb-1 block text-xs text-neutral-500">Base</label>
                <select
                  value={baseProjecao}
                  onChange={(e) => setBaseProjecao(e.target.value as "ano" | "validos" | "aptos")}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
                >
                  {votosValidosIniciais !== undefined && (
                    <option value="ano">
                      Votos válidos da eleição base ({(votosValidosIniciais ?? 0).toLocaleString("pt-BR")})
                    </option>
                  )}
                  <option value="validos">
                    {projecao.aptosOficiais
                      ? `Votos válidos ${projecao.ano} estimados sobre o eleitorado oficial`
                      : `Projeção de votos válidos ${projecao.ano}`}{" "}
                    ({projecao.votosValidos.toLocaleString("pt-BR")})
                  </option>
                  <option value="aptos">
                    {projecao.aptosOficiais
                      ? `Eleitores aptos ${projecao.ano} — oficial TSE`
                      : `Projeção de eleitores aptos ${projecao.ano}`}{" "}
                    ({projecao.eleitoresAptos.toLocaleString("pt-BR")})
                  </option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  % da base (ex.: 70 simula abstenção)
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={pctBase}
                  onChange={(e) => setPctBase(Math.min(100, Math.max(1, Number(e.target.value))))}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 sm:w-24"
                />
              </div>
              <button
                onClick={() => setVotosValidos(valorCalculado)}
                disabled={usandoProjecao || valorCalculado <= 0}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  usandoProjecao
                    ? "border-emerald-900 bg-emerald-950/30 text-emerald-300"
                    : "border-amber-800 bg-amber-950/30 text-amber-300 hover:border-amber-600"
                }`}
              >
                {usandoProjecao
                  ? "✓ Aplicado"
                  : `Aplicar ${valorCalculado.toLocaleString("pt-BR")}`}
              </button>
            </div>
            <p className="text-[11px] text-neutral-600">
              {pctBase}% de {valorBase.toLocaleString("pt-BR")} ={" "}
              {valorCalculado.toLocaleString("pt-BR")} votos válidos no cenário.
            </p>
          </div>
        )}

        <div className="rounded-lg border border-amber-900 bg-amber-950/20 px-4 py-3">
          <p className="text-xs text-amber-300">Quociente eleitoral (QE)</p>
          <p className="text-2xl font-bold text-amber-300">
            {quocienteEleitoral.toLocaleString("pt-BR")}
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            QE = votos válidos ÷ vagas = {votosValidos.toLocaleString("pt-BR")} ÷ {vagas}
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-neutral-300">Projeção de um candidato ou partido</p>
          <div className="flex gap-1.5">
            {(["candidato", "partido"] as const).map((e) => (
              <button
                key={e}
                onClick={() => setEntidade(e)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  entidade === e
                    ? "bg-amber-400 text-neutral-950"
                    : "border border-neutral-700 text-neutral-400 hover:text-neutral-200"
                }`}
              >
                {e === "candidato" ? "Candidato" : "Partido"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <label className="mb-1 block text-xs text-neutral-500">
              {entidade === "candidato" ? "Votos atuais do candidato" : "Votos totais do partido (nominais + legenda)"}
            </label>
            <input
              type="number"
              min={0}
              value={votosAtuais}
              onChange={(e) => setVotosAtuais(Math.max(0, Number(e.target.value)))}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 flex items-center justify-between text-xs text-neutral-500">
            <span>Crescimento projetado</span>
            <span className="text-neutral-400">
              {votosAtuais.toLocaleString("pt-BR")} →{" "}
              <span className="font-medium text-amber-400">
                {votosProjetados.toLocaleString("pt-BR")}
              </span>
            </span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={-50}
              max={200}
              value={crescimento}
              onChange={(e) => setCrescimento(Number(e.target.value))}
              className="flex-1"
            />
            <span className="w-16 text-right text-sm font-semibold text-amber-400">
              {crescimento > 0 ? "+" : ""}
              {crescimento}%
            </span>
          </div>
        </div>

        {entidade === "candidato" ? (
          <div
            className={`rounded-lg px-4 py-3 text-sm ${
              atingeQuociente
                ? "border border-emerald-900 bg-emerald-950/30 text-emerald-300"
                : "border border-neutral-800 bg-neutral-950 text-neutral-400"
            }`}
          >
            {atingeQuociente ? (
              <p>Com esses votos, o candidato atingiria o quociente eleitoral sozinho.</p>
            ) : (
              <p>
                Faltam <span className="font-semibold text-neutral-200">{faltam.toLocaleString("pt-BR")}</span>{" "}
                votos para atingir o quociente eleitoral direto (ou pode ser eleito por sobras,
                dependendo dos demais partidos).
              </p>
            )}
          </div>
        ) : (
          <div
            className={`rounded-lg px-4 py-3 text-sm ${
              vagasPartido > 0
                ? "border border-emerald-900 bg-emerald-950/30 text-emerald-300"
                : "border border-neutral-800 bg-neutral-950 text-neutral-400"
            }`}
          >
            {vagasPartido > 0 ? (
              <p>
                Com {votosProjetados.toLocaleString("pt-BR")} votos, o partido conquistaria{" "}
                <span className="font-semibold">
                  {vagasPartido} vaga{vagasPartido !== 1 ? "s" : ""} direta{vagasPartido !== 1 ? "s" : ""}
                </span>{" "}
                pelo quociente partidário (votos ÷ QE, arredondado para baixo) — e ainda pode
                ganhar mais pelas sobras, dependendo dos demais partidos.
              </p>
            ) : (
              <p>
                Com esses votos, o partido não atinge o quociente eleitoral — faltam{" "}
                <span className="font-semibold text-neutral-200">{faltam.toLocaleString("pt-BR")}</span>{" "}
                votos para a primeira vaga direta.
              </p>
            )}
          </div>
        )}
      </section>

      <p className="text-xs text-neutral-600">
        Calculadora livre, independente dos dados cadastrados no sistema — use para simular
        qualquer cenário hipotético de eleição (vagas, votação total e crescimento de um
        candidato ou partido específico).
      </p>
    </div>
  );
}
