import "server-only";
import { renderToBuffer } from "@react-pdf/renderer";

type PdfDocument = Parameters<typeof renderToBuffer>[0];

export async function pdfResponse(doc: PdfDocument, filename: string) {
  const buffer = await renderToBuffer(doc);
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

export function nomeArquivo(...parts: string[]) {
  return (
    parts
      .join("-")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9-]+/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase() + ".pdf"
  );
}
