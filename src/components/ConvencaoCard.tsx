"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Save, UserPlus } from "lucide-react";
import {
  salvarConvencao,
  adicionarPreCandidato,
  mudarSituacaoPreCandidato,
  excluirPreCandidato,
} from "@/app/actions/convencoes";
import { BotaoExcluir } from "@/components/BotaoExcluir";

const CARGOS = [
  "Governador",
  "Vice-Governador",
  "Senador",
  "Deputado Federal",
  "Deputado Estadual",
];

const SITUACOES: Record<string, { rotulo: string; classes: string }> = {
  PRE_CANDIDATO: { rotulo: "Pré-candidato", classes: "bg-neutral-800 text-neutral-300" },
  APROVADO: { rotulo: "Aprovado na convenção", classes: "bg-emerald-950 text-emerald-300" },
  NAO_APROVADO: { rotulo: "Não aprovado / desistiu", classes: "bg-red-950 text-red-300" },
};

type PreCandidato = {
  id: string;
  nome: string;
  cargo: string;
  situacao: string;
  origem: string;
  observacoes: string | null;
};

export function ConvencaoCard({
  partido,
  convencao,
  preCandidatos,
  podeEditar,
}: {
  partido: { id: string; sigla: string; federacao: string | null; presidenteEstadualPA: string | null };
  convencao: { dataPrevista: string | null; dataRealizada: string | null; local: string | null } | null;
  preCandidatos: PreCandidato[];
  podeEditar: boolean;
}) {
  const router = useRouter();
  const [dataPrevista, setDataPrevista] = useState(convencao?.dataPrevista ?? "");
  const [dataRealizada, setDataRealizada] = useState(convencao?.dataRealizada ?? "");
  const [local, setLocal] = useState(convencao?.local ?? "");
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [novoNome, setNovoNome] = useState("");
  const [novoCargo, setNovoCargo] = useState("Deputado Estadual");
  const [adicionando, setAdicionando] = useState(false);

  async function salvarDatas() {
    if (salvando) return;
    setSalvando(true);
    setMsg(null);
    try {
      await salvarConvencao({ partidoId: partido.id, dataPrevista, dataRealizada, local });
      setMsg("✓ Convenção salva.");
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Falha ao salvar.");
    } finally {
      setSalvando(false);
    }
  }

  async function adicionar() {
    if (adicionando || !novoNome.trim()) return;
    setAdicionando(true);
    setMsg(null);
    try {
      await adicionarPreCandidato({ partidoId: partido.id, nome: novoNome, cargo: novoCargo });
      setNovoNome("");
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Falha ao adicionar.");
    } finally {
      setAdicionando(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-neutral-100">
            {partido.sigla}
            {partido.federacao && (
              <span className="ml-2 rounded-full bg-orange-950 px-2 py-0.5 text-[10px] font-medium text-orange-300">
                Federação {partido.federacao}
              </span>
            )}
          </p>
          {partido.presidenteEstadualPA && (
            <p className="text-xs text-neutral-500">
              Presidente estadual: {partido.presidenteEstadualPA}
            </p>
          )}
        </div>
        <p className="text-xs text-neutral-500">
          <CalendarDays size={12} className="mr-1 inline" />
          {convencao?.dataRealizada
            ? `Realizada em ${convencao.dataRealizada}`
            : convencao?.dataPrevista
              ? `Prevista para ${convencao.dataPrevista}`
              : "Sem data registrada"}
        </p>
      </div>

      {podeEditar && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
          <input
            type="text"
            value={dataPrevista}
            onChange={(e) => setDataPrevista(e.target.value)}
            placeholder="Data prevista (ex.: 04/08/2026)"
            className="rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-1.5 text-xs text-neutral-100"
          />
          <input
            type="text"
            value={dataRealizada}
            onChange={(e) => setDataRealizada(e.target.value)}
            placeholder="Data realizada"
            className="rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-1.5 text-xs text-neutral-100"
          />
          <input
            type="text"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            placeholder="Local"
            className="rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-1.5 text-xs text-neutral-100"
          />
          <button
            onClick={salvarDatas}
            disabled={salvando}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-neutral-700 px-2 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:border-neutral-500 disabled:opacity-40"
          >
            <Save size={12} />
            {salvando ? "Salvando…" : "Salvar convenção"}
          </button>
        </div>
      )}

      {preCandidatos.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          {preCandidatos.map((pc) => {
            const situ = SITUACOES[pc.situacao] ?? SITUACOES.PRE_CANDIDATO;
            return (
              <div
                key={pc.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-200">
                    {pc.nome} <span className="text-xs text-neutral-500">· {pc.cargo}</span>
                  </p>
                  {pc.observacoes && (
                    <p className="text-xs text-neutral-600">{pc.observacoes}</p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {podeEditar ? (
                    <select
                      value={pc.situacao}
                      onChange={async (e) => {
                        await mudarSituacaoPreCandidato(pc.id, e.target.value);
                        router.refresh();
                      }}
                      className={`rounded-full border-0 px-2 py-1 text-[11px] font-medium ${situ.classes}`}
                    >
                      <option value="PRE_CANDIDATO">Pré-candidato</option>
                      <option value="APROVADO">Aprovado na convenção</option>
                      <option value="NAO_APROVADO">Não aprovado / desistiu</option>
                    </select>
                  ) : (
                    <span className={`rounded-full px-2 py-1 text-[11px] font-medium ${situ.classes}`}>
                      {situ.rotulo}
                    </span>
                  )}
                  {podeEditar && (
                    <BotaoExcluir
                      nome={pc.nome}
                      acao={async () => {
                        await excluirPreCandidato(pc.id);
                        router.refresh();
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-neutral-600">Nenhum pré-candidato registrado ainda.</p>
      )}

      {podeEditar && (
        <div className="flex flex-col gap-2 border-t border-neutral-800 pt-3 sm:flex-row">
          <input
            type="text"
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            placeholder="Nome do pré-candidato"
            className="flex-1 rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
          />
          <select
            value={novoCargo}
            onChange={(e) => setNovoCargo(e.target.value)}
            className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
          >
            {CARGOS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            onClick={adicionar}
            disabled={adicionando || !novoNome.trim()}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-amber-400 px-3 py-2 text-xs font-semibold text-neutral-950 transition-opacity disabled:opacity-40"
          >
            <UserPlus size={13} />
            {adicionando ? "Incluindo…" : "Incluir pré-candidato"}
          </button>
        </div>
      )}

      {msg && (
        <p
          className={`rounded-lg px-3 py-2 text-xs ${
            msg.startsWith("✓")
              ? "border border-emerald-900 bg-emerald-950/30 text-emerald-300"
              : "border border-red-900 bg-red-950/40 text-red-300"
          }`}
        >
          {msg}
        </p>
      )}
    </div>
  );
}
