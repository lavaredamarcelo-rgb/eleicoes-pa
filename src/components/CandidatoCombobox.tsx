"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function CandidatoCombobox({
  candidatos,
  value,
  onChange,
  placeholder = "Candidato...",
}: {
  candidatos: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
}) {
  const selecionado = candidatos.find((c) => c.id === value);
  const [termo, setTermo] = useState(selecionado?.label ?? "");
  const [aberto, setAberto] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTermo(selecionado?.label ?? "");
  }, [selecionado?.label]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setAberto(false);
        setTermo(selecionado?.label ?? "");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selecionado?.label]);

  const filtrados = useMemo(() => {
    const termoNormalizado = normalizar(termo);
    if (!termoNormalizado) return candidatos.slice(0, 30);
    return candidatos
      .filter((c) => normalizar(c.label).includes(termoNormalizado))
      .slice(0, 30);
  }, [candidatos, termo]);

  return (
    <div ref={containerRef} className="relative flex-1">
      <input
        type="text"
        value={termo}
        onChange={(e) => {
          setTermo(e.target.value);
          setAberto(true);
          if (value) onChange("");
        }}
        onFocus={() => setAberto(true)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
      />
      {aberto && filtrados.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-neutral-700 bg-neutral-900 shadow-lg">
          {filtrados.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => {
                  onChange(c.id);
                  setTermo(c.label);
                  setAberto(false);
                }}
                className="block w-full px-3 py-2 text-left text-sm text-neutral-200 hover:bg-neutral-800"
              >
                {c.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      {aberto && termo && filtrados.length === 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-500 shadow-lg">
          Nenhum candidato encontrado.
        </div>
      )}
    </div>
  );
}
