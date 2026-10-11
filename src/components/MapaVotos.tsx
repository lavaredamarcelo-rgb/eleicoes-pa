import mapaData from "@/data/pa-mapa.json";

// Mapa do Pará "burro" e reutilizável: recebe a cor pronta de cada
// município (por codigoIbge) e só pinta — sem estado, roda no servidor.
export function MapaVotos({
  cores,
  titulos,
  altura = "h-[420px]",
}: {
  cores: Record<string, string>;
  titulos?: Record<string, string>;
  altura?: string;
}) {
  return (
    <svg
      viewBox={mapaData.viewBox}
      className={`w-full ${altura}`}
      role="img"
      aria-label="Mapa do Pará por município"
    >
      {mapaData.municipios.map((m) => (
        <path
          key={m.codigoIbge}
          d={m.path}
          fill={cores[m.codigoIbge] ?? "#262626"}
          stroke="#0a0a0a"
          strokeWidth={1}
        >
          {titulos?.[m.codigoIbge] && <title>{titulos[m.codigoIbge]}</title>}
        </path>
      ))}
    </svg>
  );
}
