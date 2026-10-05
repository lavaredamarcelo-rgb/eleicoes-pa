import { Text, View } from "@react-pdf/renderer";
import { CORES } from "./styles";

// Listagem COMPACTA de locais de votação: duas colunas lado a lado e
// fonte reduzida — metade das páginas, nenhum local cortado.
const f = (n: number) => n.toLocaleString("pt-BR");

function Celula({ item }: { item?: { nome: string; votos: number } }) {
  return (
    <View style={{ flex: 1, flexDirection: "row", paddingVertical: 1, paddingHorizontal: 3 }}>
      {item ? (
        <>
          <Text style={{ flex: 1, fontSize: 6.5, color: CORES.grafite }}>
            {item.nome.slice(0, 48)}
          </Text>
          <Text style={{ width: 32, fontSize: 6.5, textAlign: "right", color: CORES.grafite }}>
            {f(item.votos)}
          </Text>
        </>
      ) : (
        <Text style={{ fontSize: 6.5 }}> </Text>
      )}
    </View>
  );
}

export function ListaLocaisDuasColunas({ itens }: { itens: { nome: string; votos: number }[] }) {
  const pares: [typeof itens[number], typeof itens[number] | undefined][] = [];
  for (let i = 0; i < itens.length; i += 2) pares.push([itens[i], itens[i + 1]]);
  return (
    <View>
      {pares.map(([a, b], k) => (
        <View
          key={k}
          style={{ flexDirection: "row", borderBottom: "0.5 solid #e5e7eb" }}
        >
          <Celula item={a} />
          <View style={{ width: 8 }} />
          <Celula item={b} />
        </View>
      ))}
    </View>
  );
}

export function CabecalhoBairro({ bairro, votos, pct }: { bairro: string; votos: number; pct?: string }) {
  return (
    <Text
      style={{
        fontSize: 7.5,
        fontFamily: "Helvetica-Bold",
        marginTop: 4,
        marginBottom: 1,
        color: CORES.ambar,
      }}
    >
      {`${bairro} — ${f(votos)} votos${pct ? ` (${pct})` : ""}`}
    </Text>
  );
}
