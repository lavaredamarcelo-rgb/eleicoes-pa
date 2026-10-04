"use client";

import { useRouter } from "next/navigation";
import { BotaoExcluir } from "@/components/BotaoExcluir";
import { excluirCenarioEleicao } from "@/app/actions/cenarios";

// Excluir um cenário salvo a partir de páginas de servidor (aba Cenários).
export function ExcluirCenarioSalvo({ id, titulo }: { id: string; titulo: string }) {
  const router = useRouter();
  return (
    <BotaoExcluir
      nome={titulo}
      acao={async () => {
        await excluirCenarioEleicao(id);
        router.refresh();
      }}
    />
  );
}
