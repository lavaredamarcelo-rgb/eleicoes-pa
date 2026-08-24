"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

interface BotaoFavoritarProps {
  candidatoId: string;
  tamanho?: "sm" | "md" | "lg";
}

export default function BotaoFavoritar({ candidatoId, tamanho = "md" }: BotaoFavoritarProps) {
  const [favoritado, setFavoritado] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const tamanhos = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const verificarFavorito = async () => {
    try {
      const res = await fetch("/api/politicos-favoritos");
      const favoritos = await res.json();
      const isFav = favoritos.some((f: any) => f.candidatoId === candidatoId);
      setFavoritado(isFav);
    } catch (error) {
      console.error("Erro ao verificar favorito:", error);
    }
  };

  useEffect(() => {
    verificarFavorito();
  }, [candidatoId]);

  const handleToggleFavorito = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setCarregando(true);
    try {
      const res = await fetch("/api/politicos-favoritos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidatoId,
          favoritar: !favoritado,
        }),
      });

      if (res.ok) {
        setFavoritado(!favoritado);
      } else {
        console.error("Erro ao favoritar");
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorito}
      disabled={carregando}
      className="transition-colors hover:opacity-70 disabled:opacity-50 flex items-center gap-1"
      title={favoritado ? "Clique para remover de favoritos" : "Clique para adicionar aos favoritos"}
    >
      <Heart
        className={`${tamanhos[tamanho]} ${
          favoritado
            ? "fill-red-500 stroke-red-500"
            : "stroke-neutral-400 hover:stroke-red-500"
        }`}
      />
    </button>
  );
}
