import { Svg, Path, View, Text } from "@react-pdf/renderer";
import mapaData from "@/data/pa-mapa.json";

// Mapa do Pará para dentro dos PDFs: recebe a cor pronta de cada
// município (por codigoIbge) e desenha com o Svg nativo do react-pdf.
// Mistura uma cor-base com um fundo claro pela intensidade t (0..1) —
// o react-pdf não aceita rgba no fill, então geramos hex sólido.
export function tonalidade(baseHex: string, t: number) {
  const fundo = [241, 245, 249]; // #f1f5f9
  const base = [
    parseInt(baseHex.slice(1, 3), 16),
    parseInt(baseHex.slice(3, 5), 16),
    parseInt(baseHex.slice(5, 7), 16),
  ];
  const k = Math.max(0, Math.min(1, t));
  const c = base.map((b, i) => Math.round(fundo[i] + (b - fundo[i]) * k));
  return `#${c.map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

export function MapaParaPdf({
  cores,
  legenda,
  altura = 300,
}: {
  cores: Record<string, string>;
  legenda?: { cor: string; rotulo: string }[];
  altura?: number;
}) {
  const largura = (altura * 1000) / 970.8;
  return (
    <View style={{ alignItems: "center", marginVertical: 6 }}>
      <Svg width={largura} height={altura} viewBox={mapaData.viewBox}>
        {mapaData.municipios.map((m) => (
          <Path
            key={m.codigoIbge}
            d={m.path}
            fill={cores[m.codigoIbge] ?? "#e5e7eb"}
            stroke="#ffffff"
            strokeWidth={1.2}
          />
        ))}
      </Svg>
      {legenda && (
        <View style={{ flexDirection: "row", marginTop: 3, gap: 10 }}>
          {legenda.map((l) => (
            <View key={l.rotulo} style={{ flexDirection: "row", alignItems: "center", marginRight: 10 }}>
              <View style={{ width: 7, height: 7, backgroundColor: l.cor, marginRight: 3 }} />
              <Text style={{ fontSize: 7 }}>{l.rotulo}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
