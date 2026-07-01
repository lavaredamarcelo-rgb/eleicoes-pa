// Gera src/data/pa-municipios.json (nome + código IBGE + mesorregião)
// a partir da API do IBGE. Fonte única usada pelo seed e pelo mapa.
// Uso: node scripts/generate-municipios-data.mjs

const IBGE_URL = "https://servicodados.ibge.gov.br/api/v1/localidades/estados/PA/municipios";

async function main() {
  const res = await fetch(IBGE_URL);
  if (!res.ok) throw new Error(`IBGE respondeu ${res.status}`);
  const data = await res.json();

  const municipios = data
    .map((m) => ({
      nome: m.nome,
      codigoIbge: String(m.id),
      regiao: m.microrregiao.mesorregiao.nome,
    }))
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const url = await import("node:url");
  const dir = path.dirname(url.fileURLToPath(import.meta.url));
  const outPath = path.join(dir, "..", "src", "data", "pa-municipios.json");
  await fs.writeFile(outPath, JSON.stringify(municipios, null, 2));
  console.log(`Gerado ${outPath} com ${municipios.length} municípios.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
