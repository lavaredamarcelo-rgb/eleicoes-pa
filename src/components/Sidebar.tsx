"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Settings } from "lucide-react";
import { NAV_ITEMS } from "./nav-items";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-neutral-800 bg-neutral-950 lg:flex">
      <div className="px-5 py-5">
        <p className="text-sm font-semibold">Eleições PA</p>
        <p className="text-xs text-neutral-500">Pará</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100"
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 2} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 border-t border-neutral-800 px-3 py-3">
        <Link
          href="/busca"
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
            pathname === "/busca"
              ? "bg-blue-600 text-white"
              : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100"
          }`}
        >
          <Search size={18} />
          Buscar
        </Link>
        <Link
          href="/configuracoes"
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
            pathname.startsWith("/configuracoes")
              ? "bg-blue-600 text-white"
              : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100"
          }`}
        >
          <Settings size={18} />
          Configurações
        </Link>
      </div>
    </aside>
  );
}
