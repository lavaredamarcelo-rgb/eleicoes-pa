"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, MapPin, Layers, Calculator, Upload } from "lucide-react";

const TABS = [
  { href: "/inicio", label: "Início", icon: Home },
  { href: "/candidatos", label: "Candidatos", icon: Users },
  { href: "/municipios", label: "Municípios", icon: MapPin },
  { href: "/regioes", label: "Regiões", icon: Layers },
  { href: "/quociente", label: "Quociente", icon: Calculator },
  { href: "/importacao", label: "Importar", icon: Upload },
];

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-neutral-800 bg-neutral-950/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex max-w-3xl">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center gap-0.5 py-2 text-[11px] ${
                  active ? "text-blue-400" : "text-neutral-500"
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
