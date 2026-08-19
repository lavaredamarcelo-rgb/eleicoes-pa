"use client";

import { BotaoPdf } from "@/components/VisorPdf";

// Mantém a API antiga (href + label), mas agora abre o PDF no visor
// interno — com botão Fechar — em vez de navegar para o arquivo.
export function PdfDownloadLink({ href, label = "Baixar PDF" }: { href: string; label?: string }) {
  return <BotaoPdf href={href} label={label} titulo={label} />;
}
