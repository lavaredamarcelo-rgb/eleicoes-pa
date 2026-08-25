"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { PdfDownloadLink } from "@/components/PdfDownloadLink";

export function PdfEleitosMunicipio({
  ano,
  municipios,
}: {
  ano: number;
  municipios: { id: string; nome: string }[];
}) {
  const [municipioId, setMunicipioId] = useState("");
  const nome = municipios.find((m) => m.id === municipioId)?.nome;

  return (
    <div className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950 p-2">
      <MapPin size={14} className="shrink-0 text-neutral-500" />
      <select
        value={municipioId}
        onChange={(e) => setMunicipioId(e.target.value)}
        className="w-40 rounded-lg border border-neutral-800 bg-neutral-900 px-2 py-1.5 text-xs text-neutral-200 outline-none focus:border-amber-700"
      >
        <option value="">PDF de um município...</option>
        {municipios.map((m) => (
          <option key={m.id} value={m.id}>
            {m.nome}
          </option>
        ))}
      </select>
      {municipioId && (
        <PdfDownloadLink
          href={`/api/pdf/eleitos/${ano}?municipio=${municipioId}`}
          label={`PDF · ${nome}`}
        />
      )}
    </div>
  );
}
