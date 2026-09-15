"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { NAV_ITEMS } from "./nav-items";

export function TabBar() {
  const pathname = usePathname();
  const ativoRef = useRef<HTMLLIElement>(null);

  // A fita de abas é mais larga que a tela: ao trocar de página, centraliza
  // a aba ativa para a barra nunca ficar "deslocada" no meio do caminho.
  // scrollLeft direto (com retry) — scrollIntoView falha no primeiro paint.
  useEffect(() => {
    const centralizar = () => {
      const li = ativoRef.current;
      const ul = li?.parentElement;
      if (!li || !ul) return;
      ul.scrollLeft = li.offsetLeft - (ul.clientWidth - li.clientWidth) / 2;
    };
    const raf = requestAnimationFrame(centralizar);
    const atraso = setTimeout(centralizar, 300);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(atraso);
    };
  }, [pathname]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 overflow-hidden border-t border-neutral-800 bg-neutral-950/95 backdrop-blur pb-[env(safe-area-inset-bottom)] lg:hidden">
      <ul
        className="mx-auto flex max-w-3xl"
        style={{
          overflowX: "auto",
          scrollbarWidth: "none",
          // Impede que o arrasto na barra role a página atrás (era isso que
          // fazia a barra parecer "subir"/deslocar no celular).
          overscrollBehaviorX: "contain",
          touchAction: "pan-x",
        }}
      >
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <li
              key={href}
              ref={active ? ativoRef : undefined}
              style={{ flex: "0 0 auto", minWidth: 62 }}
            >
              <Link
                href={href}
                className={`flex flex-col items-center gap-0.5 py-2 text-[11px] whitespace-nowrap px-1 ${
                  active ? "text-amber-400" : "text-neutral-500"
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
