"use client";

import { useState } from "react";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";

interface PreCandidato {
  id: string;
  nome: string;
  cargo: string;
  situacao: string;
  registroTRE: boolean | null;
  dataRegistroTRE: Date | string | null;
  partido: { sigla: string };
}

const ORDEM_CARGOS = ["Governador", "Vice-Governador", "Senador", "Deputado Federal", "Deputado Estadual"];

export function GerenciadorPreCandidatosTRE({ preCandidatos }: { preCandidatos: any[] }) {
  const [atualizando, setAtualizando] = useState<string | null>(null);

  const aprovados = preCandidatos.filter((pc) => pc.situacao === "APROVADO");

  const grupos = ORDEM_CARGOS.map((cargo) => ({
    cargo,
    itens: aprovados.filter((pc) => pc.cargo === cargo),
  })).filter((g) => g.itens.length > 0);

  const handleToggleRegistro = async (preCandidatoId: string, registroTRE: boolean | null) => {
    setAtualizando(preCandidatoId);
    try {
      const novoValor = registroTRE === true ? false : registroTRE === false ? null : true;
      const res = await fetch("/api/pre-candidatos/registro-tre", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preCandidatoId,
          registroTRE: novoValor,
        }),
      });

      if (res.ok) {
        // Recarregar página para refletir mudanças
        window.location.reload();
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setAtualizando(null);
    }
  };

  return (
    <section className="flex flex-col gap-2 rounded-xl border border-blue-900/50 bg-blue-950/10 p-4">
      <p className="flex items-center gap-1.5 text-sm font-medium text-blue-300">
        <AlertCircle size={15} />
        Registro no TRE-PA
      </p>
      <p className="text-xs text-neutral-400 mb-3">
        Clique no ícone para atualizar se o pré-candidato foi registrado no TRE-PA
      </p>

      {grupos.map((g) => (
        <div key={g.cargo} className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950">
          <p className="border-b border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-400">
            {g.cargo} ({g.itens.length})
          </p>
          {g.itens.map((pc) => (
            <div key={pc.id} className="border-b border-neutral-800/50 px-3 py-2 last:border-0 flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-100">
                  {pc.nome} <span className="text-xs text-neutral-500">({pc.partido.sigla})</span>
                </p>
                {pc.dataRegistroTRE && (
                  <p className="text-[11px] text-neutral-600 mt-0.5">
                    Atualizado em {new Date(pc.dataRegistroTRE as any).toLocaleDateString("pt-BR")}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleToggleRegistro(pc.id, pc.registroTRE)}
                disabled={atualizando === pc.id}
                className="ml-3 flex-shrink-0 transition-colors hover:opacity-70 disabled:opacity-50"
                title={
                  pc.registroTRE === true
                    ? "Registrado no TRE - clique para desmarcar"
                    : pc.registroTRE === false
                    ? "Não registrado - clique para pendente"
                    : "Pendente - clique para registrado"
                }
              >
                {pc.registroTRE === true && <CheckCircle2 size={20} className="text-green-500" />}
                {pc.registroTRE === false && <Circle size={20} className="text-red-500" />}
                {pc.registroTRE === null && <AlertCircle size={20} className="text-yellow-500" />}
              </button>
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}
