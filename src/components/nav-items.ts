import { Home, Users, MapPin, Calculator, Landmark, Flag, Activity, FileText, PenLine, CalendarDays, Heart, TrendingUp } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/inicio", label: "Início", icon: Home },
  { href: "/apuracao", label: "Apuração", icon: Activity },
  { href: "/candidatos", label: "Eleitos", icon: Users },
  { href: "/meus-politicos", label: "Favoritos", icon: Heart },
  { href: "/municipios", label: "Municípios", icon: MapPin },
  { href: "/pesquisas", label: "Pesquisas", icon: TrendingUp },
  { href: "/convencoes", label: "Convenções", icon: CalendarDays },
  { href: "/cenario", label: "Cenários", icon: Landmark },
  { href: "/criar-cenario", label: "Criar Cenário", icon: PenLine },
  { href: "/partidos", label: "Partidos", icon: Flag },
  { href: "/simulacoes", label: "Quociente e Simulações", icon: Calculator },
  { href: "/relatorios", label: "Relatórios", icon: FileText },
];
