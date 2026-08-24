"use client";

import { Edit2, Save, X } from "lucide-react";
import { useState } from "react";

interface EditorNotasProps {
  favoritoId: string;
  notasInicial: string;
}

export default function EditorNotas({
  favoritoId,
  notasInicial,
}: EditorNotasProps) {
  const [editando, setEditando] = useState(false);
  const [notas, setNotas] = useState(notasInicial);
  const [carregando, setCarregando] = useState(false);

  const salvarNotas = async () => {
    setCarregando(true);
    try {
      const res = await fetch("/api/politicos-favoritos/notas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favoritoId, notas }),
      });

      if (res.ok) {
        setEditando(false);
      }
    } catch (error) {
      console.error("Erro ao salvar notas:", error);
    } finally {
      setCarregando(false);
    }
  };

  if (editando) {
    return (
      <div className="mt-3 space-y-2">
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Adicione suas notas..."
          className="w-full border rounded p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
          rows={3}
        />
        <div className="flex gap-2">
          <button
            onClick={salvarNotas}
            disabled={carregando}
            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-1"
          >
            <Save size={14} /> Salvar
          </button>
          <button
            onClick={() => {
              setEditando(false);
              setNotas(notasInicial);
            }}
            className="px-3 py-1 bg-gray-300 text-gray-800 text-xs rounded hover:bg-gray-400 transition flex items-center gap-1"
          >
            <X size={14} /> Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3">
      {notas ? (
        <div className="bg-yellow-50 p-2 rounded border-l-4 border-yellow-400 flex justify-between items-start gap-2">
          <p className="text-sm text-gray-700">📝 {notas}</p>
          <button
            onClick={() => setEditando(true)}
            className="text-gray-500 hover:text-gray-700 transition flex-shrink-0"
            title="Editar notas"
          >
            <Edit2 size={14} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setEditando(true)}
          className="text-xs text-gray-400 hover:text-gray-600 transition"
        >
          + Adicionar notas
        </button>
      )}
    </div>
  );
}
