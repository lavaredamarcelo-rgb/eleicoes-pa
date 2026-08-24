"use client";

import { AlertCircle, Zap } from "lucide-react";

interface Notificacao {
  tipo: "troca_partido" | "mudanca_cargo";
  titulo: string;
  descricao: string;
  candidatoNome: string;
  data: Date;
}

export default function NotificacoesFavoritos({
  notificacoes,
}: {
  notificacoes: Notificacao[];
}) {
  if (!notificacoes.length) return null;

  return (
    <div className="space-y-2 mb-4">
      {notificacoes.map((notif, idx) => (
        <div
          key={idx}
          className="flex gap-3 bg-amber-50 border border-amber-200 rounded-lg p-3"
        >
          <div className="flex-shrink-0 mt-0.5">
            {notif.tipo === "troca_partido" ? (
              <Zap className="w-5 h-5 text-amber-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-amber-900">{notif.titulo}</p>
            <p className="text-sm text-amber-800 mt-0.5">{notif.descricao}</p>
            <p className="text-xs text-amber-700 mt-1">
              {new Date(notif.data).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
