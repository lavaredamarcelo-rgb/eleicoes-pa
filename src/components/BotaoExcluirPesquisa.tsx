"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function BotaoExcluirPesquisa({ id }: { id: string }) {
  const router = useRouter();
  const [removendo, setRemovendo] = useState(false);

  const excluir = async () => {
    if (!confirm("Excluir esta pesquisa?")) return;
    setRemovendo(true);
    const res = await fetch(`/api/pesquisas/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else {
      alert("Erro ao excluir.");
      setRemovendo(false);
    }
  };

  return (
    <button
      onClick={excluir}
      disabled={removendo}
      title="Excluir pesquisa"
      className="rounded-lg p-1.5 text-neutral-600 transition hover:bg-red-950/40 hover:text-red-400 disabled:opacity-50"
    >
      <Trash2 size={15} />
    </button>
  );
}
