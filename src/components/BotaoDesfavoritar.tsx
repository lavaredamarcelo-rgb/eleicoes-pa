"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

export default function BotaoDesfavoritar({
  candidatoId,
  nome,
}: {
  candidatoId: string;
  nome: string;
}) {
  const router = useRouter();
  const [removendo, setRemovendo] = useState(false);

  const remover = async () => {
    if (!confirm(`Remover ${nome} dos favoritos?`)) return;
    setRemovendo(true);
    try {
      const res = await fetch("/api/politicos-favoritos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidatoId, favoritar: false }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Erro ao remover favorito. Tente novamente.");
        setRemovendo(false);
      }
    } catch {
      alert("Erro ao remover favorito. Tente novamente.");
      setRemovendo(false);
    }
  };

  return (
    <button
      onClick={remover}
      disabled={removendo}
      title="Remover dos favoritos"
      className="shrink-0 rounded-full p-2 text-yellow-500 transition hover:bg-yellow-100 hover:text-yellow-600 disabled:opacity-50"
    >
      <Heart size={20} fill="currentColor" />
    </button>
  );
}
