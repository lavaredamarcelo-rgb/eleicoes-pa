"use client";

import { useState } from "react";
import { Upload, CheckCircle2, AlertCircle } from "lucide-react";

const CARGOS = [
  "Governador",
  "Vice-Governador",
  "Senador",
  "Deputado Federal",
  "Deputado Estadual",
];

export function ImportadorCandidatos() {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [cargo, setCargo] = useState("Governador");
  const [importando, setImportando] = useState(false);
  const [resultado, setResultado] = useState<{
    sucesso?: number;
    erro?: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArquivo(e.target.files?.[0] || null);
  };

  const handleImportar = async () => {
    if (!arquivo) {
      alert("Selecione um arquivo!");
      return;
    }

    setImportando(true);
    setResultado(null);

    try {
      const formData = new FormData();
      formData.append("file", arquivo);
      formData.append("cargo", cargo);

      const res = await fetch("/api/admin/importar-candidatos", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setResultado({ sucesso: data.importados });
        setArquivo(null);
        setCargo("Governador");
      } else {
        setResultado({ erro: data.error || "Erro ao importar" });
      }
    } catch (error) {
      setResultado({
        erro: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setImportando(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-blue-900/50 bg-blue-950/10 p-4">
      <h2 className="text-sm font-semibold text-blue-300">
        Importar Candidatos do Excel
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-400">
            Arquivo Excel
          </label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            disabled={importando}
            className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-neutral-300 file:mr-3 file:rounded file:border-0 file:bg-blue-600 file:px-3 file:py-1 file:text-xs file:font-medium file:text-white"
          />
          {arquivo && (
            <p className="text-[11px] text-neutral-500">{arquivo.name}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-400">Cargo</label>
          <select
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            disabled={importando}
            className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-neutral-100"
          >
            {CARGOS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleImportar}
        disabled={importando || !arquivo}
        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-opacity disabled:opacity-50 hover:bg-blue-700"
      >
        <Upload size={14} />
        {importando ? "Importando..." : "Importar"}
      </button>

      {resultado?.sucesso && (
        <div className="flex gap-2 rounded-lg border border-green-900/50 bg-green-950/20 px-3 py-2 text-xs text-green-300">
          <CheckCircle2 size={14} className="flex-shrink-0" />
          <span>✓ {resultado.sucesso} candidatos importados com sucesso!</span>
        </div>
      )}

      {resultado?.erro && (
        <div className="flex gap-2 rounded-lg border border-red-900/50 bg-red-950/20 px-3 py-2 text-xs text-red-300">
          <AlertCircle size={14} className="flex-shrink-0" />
          <span>{resultado.erro}</span>
        </div>
      )}
    </div>
  );
}
