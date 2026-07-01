import { FileDown } from "lucide-react";

export function PdfDownloadLink({ href, label = "Baixar PDF" }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      download
      className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs font-medium text-neutral-300 transition-colors duration-150 hover:border-neutral-600 hover:bg-neutral-800"
    >
      <FileDown size={14} />
      {label}
    </a>
  );
}
