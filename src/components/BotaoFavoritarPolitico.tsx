"use client";

import { Heart } from "lucide-react";
import { useState } from "react";

interface BotaoFavoritarPoliticoProps {
  candidatoId: string;
  estaFavoritado?: boolean;
}

export default function BotaoFavoritarPolitico({
  candidatoId,
  estaFavoritado = false,
}: BotaoFavoritarPoliticoProps) {
  const [favorito, setFavorito] = useState(estaFavoritado);
  const [carregando, setCarregando] = useState(false);

  const toggleFavorito = async () => {
    setCarregando(true);
    try {
      await fetch("/api/politicos-favoritos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidatoId, favoritar: !favorito }),
      });
      setFavorito(!favorito);
    } catch (error) {
      console.error("Erro ao favoritar:", error);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <button
      onClick={toggleFavorito}
      disabled={carregando}
      className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
      title={favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Heart
        size={20}
        className={favorito ? "fill-red-500 text-red-500" : "text-gray-400"}
      />
    </button>
  );
}
