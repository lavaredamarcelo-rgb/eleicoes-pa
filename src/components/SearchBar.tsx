"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchBar({ valorInicial = "" }: { valorInicial?: string }) {
  const router = useRouter();
  const [valor, setValor] = useState(valorInicial);

  function buscar(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/busca?q=${encodeURIComponent(valor.trim())}`);
  }

  return (
    <form onSubmit={buscar} className="relative">
      <Search
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
      />
      <input
        type="search"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        placeholder="Buscar candidato, número, município..."
        className="w-full rounded-lg border border-neutral-700 bg-neutral-900 py-2 pl-9 pr-3 text-sm text-neutral-100 placeholder:text-neutral-500"
      />
    </form>
  );
}
