import "server-only";
import { parse } from "csv-parse/sync";

// Os arquivos do TSE (dadosabertos.tse.jus.br) usam ";" como delimitador,
// aspas duplas para campos com texto livre e, historicamente, codificação
// ISO-8859-1 (latin1) — embora publicações mais recentes já venham em
// UTF-8. Detectamos automaticamente tentando decodificar como UTF-8
// primeiro (modo estrito) e caindo para latin1 se falhar.
function decodificarBuffer(buffer: ArrayBuffer): string {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch {
    return new TextDecoder("iso-8859-1").decode(buffer);
  }
}

export function parseCsvTse(buffer: ArrayBuffer): Record<string, string>[] {
  const texto = decodificarBuffer(buffer);
  return parse(texto, {
    delimiter: ";",
    columns: (header: string[]) => header.map((h) => h.trim().toUpperCase()),
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
    bom: true,
  });
}
