// Gera src/data/pa-mapa.json a partir da malha oficial do IBGE.
// Roda uma vez (offline); o resultado é um asset estático versionado,
// sem dependência de rede em tempo de execução do app.
// Uso: node scripts/generate-map-data.mjs

const IBGE_URL =
  "https://servicodados.ibge.gov.br/api/v3/malhas/estados/15?formato=application/vnd.geo+json&qualidade=minima&intrarregiao=municipio";

const SVG_WIDTH = 1000;
const PRECISION = 1;

function round(n) {
  return Math.round(n * 10 ** PRECISION) / 10 ** PRECISION;
}

function ringToPath(ring, project) {
  return (
    ring
      .map(([lon, lat], i) => {
        const [x, y] = project(lon, lat);
        return `${i === 0 ? "M" : "L"}${round(x)},${round(y)}`;
      })
      .join(" ") + " Z"
  );
}

function geometryToPath(geometry, project) {
  if (geometry.type === "Polygon") {
    return geometry.coordinates.map((ring) => ringToPath(ring, project)).join(" ");
  }
  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates
      .map((poly) => poly.map((ring) => ringToPath(ring, project)).join(" "))
      .join(" ");
  }
  throw new Error(`Tipo de geometria não suportado: ${geometry.type}`);
}

async function main() {
  console.log("Baixando malha do IBGE...");
  const res = await fetch(IBGE_URL);
  if (!res.ok) throw new Error(`IBGE respondeu ${res.status}`);
  const geojson = await res.json();

  let minLon = Infinity;
  let maxLon = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  const walkRing = (ring) => {
    for (const [lon, lat] of ring) {
      if (lon < minLon) minLon = lon;
      if (lon > maxLon) maxLon = lon;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }
  };

  for (const feature of geojson.features) {
    const { type, coordinates } = feature.geometry;
    if (type === "Polygon") coordinates.forEach(walkRing);
    else if (type === "MultiPolygon") coordinates.forEach((poly) => poly.forEach(walkRing));
  }

  const latMid = (minLat + maxLat) / 2;
  const cos = Math.cos((latMid * Math.PI) / 180);
  const lonSpan = (maxLon - minLon) * cos;
  const latSpan = maxLat - minLat;
  const scale = SVG_WIDTH / lonSpan;
  const svgHeight = latSpan * scale;

  const project = (lon, lat) => {
    const x = (lon - minLon) * cos * scale;
    const y = (maxLat - lat) * scale;
    return [x, y];
  };

  const municipios = geojson.features.map((feature) => ({
    codigoIbge: feature.properties.codarea,
    path: geometryToPath(feature.geometry, project),
  }));

  const output = {
    viewBox: `0 0 ${round(SVG_WIDTH)} ${round(svgHeight)}`,
    municipios,
  };

  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const url = await import("node:url");
  const dir = path.dirname(url.fileURLToPath(import.meta.url));
  const outPath = path.join(dir, "..", "src", "data", "pa-mapa.json");
  await fs.writeFile(outPath, JSON.stringify(output));
  console.log(`Gerado ${outPath} com ${municipios.length} municípios.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
