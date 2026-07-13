"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { NAV_ITEMS } from "@/components/nav-items";

// Raízes das abas: nelas o voltar não faz sentido (a TabBar já navega).
const RAIZES = new Set(NAV_ITEMS.map((n) => n.href));

export function BotaoVoltar() {
  const router = useRouter();
  const pathname = usePathname();

  if (RAIZES.has(pathname)) return null;

  return (
    <button
      onClick={() => router.back()}
      aria-label="Voltar"
      className="-ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-neutral-300 transition-colors hover:bg-neutral-900 hover:text-neutral-100"
    >
      <ArrowLeft size={20} />
    </button>
  );
}
