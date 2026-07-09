import { Home, Users, MapPin, Calculator, Landmark, Flag, Activity } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/inicio", label: "Início", icon: Home },
  { href: "/apuracao", label: "Apuração", icon: Activity },
  { href: "/candidatos", label: "Eleitos", icon: Users },
  { href: "/municipios", label: "Municípios", icon: MapPin },
  { href: "/cenario", label: "Cenários", icon: Landmark },
  { href: "/partidos", label: "Partidos", icon: Flag },
  { href: "/simulacoes", label: "Quociente e Simulações", icon: Calculator },
];
