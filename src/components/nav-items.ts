import { Home, Users, MapPin, Layers, Calculator, Map } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/inicio", label: "Início", icon: Home },
  { href: "/mapa", label: "Mapa", icon: Map },
  { href: "/candidatos", label: "Candidatos", icon: Users },
  { href: "/municipios", label: "Municípios", icon: MapPin },
  { href: "/regioes", label: "Regiões", icon: Layers },
  { href: "/quociente", label: "Quociente", icon: Calculator },
];
