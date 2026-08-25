"use client";

import { useEffect, useRef, useState } from "react";
import { X, Share2, FileDown, ZoomIn, ZoomOut } from "lucide-react";

// Visor de PDF interno: abre por cima da tela com botão FECHAR sempre
// visível (no app instalado no celular, um PDF aberto direto não tem como
// voltar). Renderiza com pdf.js auto-hospedado (public/pdf.worker.min.mjs)
// e oferece Baixar/Compartilhar pela folha nativa do aparelho.
export function VisorPdf({
  titulo,
  blobUrl,
  nomeArquivo,
  aoFechar,
}: {
  titulo: string;
  blobUrl: string;
  nomeArquivo: string;
  aoFechar: () => void;
}) {
  const contRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"carregando" | "pronto" | "erro">("carregando");
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    let cancelado = false;
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        const doc = await pdfjs.getDocument({ url: blobUrl }).promise;
        if (cancelado || !contRef.current) return;
        const cont = contRef.current;
        cont.innerHTML = "";
        const larguraDisponivel = Math.max(280, cont.clientWidth - 16);
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        for (let i = 1; i <= doc.numPages; i++) {
          const pagina = await doc.getPage(i);
          const base = pagina.getViewport({ scale: 1 });
          const escala = (larguraDisponivel / base.width) * dpr;
          const vp = pagina.getViewport({ scale: escala });
          const canvas = document.createElement("canvas");
          canvas.width = vp.width;
          canvas.height = vp.height;
          canvas.style.width = "100%";
          canvas.style.height = "auto";
          canvas.className = "mb-2 rounded-md bg-white shadow";
          await pagina.render({ canvas, canvasContext: canvas.getContext("2d")!, viewport: vp })
            .promise;
          if (cancelado) return;
          cont.appendChild(canvas);
        }
        setStatus("pronto");
      } catch {
        if (!cancelado) setStatus("erro");
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [blobUrl]);

  async function compartilhar() {
    try {
      const blob = await (await fetch(blobUrl)).blob();
      const arquivo = new File([blob], nomeArquivo, { type: "application/pdf" });
      if (navigator.canShare?.({ files: [arquivo] })) {
        await navigator.share({ files: [arquivo], title: titulo });
        return;
      }
    } catch {
      // usuário cancelou a folha de compartilhar — nada a fazer
      return;
    }
    baixar();
  }

  function baixar() {
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = nomeArquivo;
    a.click();
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-neutral-950">
      <div
        className="flex items-center justify-between gap-2 border-b border-neutral-800 bg-neutral-900 px-3 pb-2.5"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 10px)" }}
      >
        <button
          onClick={aoFechar}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-amber-400 px-3 py-2 text-sm font-semibold text-neutral-950"
        >
          <X size={16} />
          Fechar
        </button>
        <p className="min-w-0 truncate text-xs text-neutral-400">{titulo}</p>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            onClick={() => setZoom((z) => Math.max(100, z - 50))}
            aria-label="Diminuir zoom"
            disabled={zoom <= 100}
            className="rounded-lg border border-neutral-700 p-2 text-neutral-300 disabled:opacity-40"
          >
            <ZoomOut size={15} />
          </button>
          <button
            onClick={() => setZoom((z) => Math.min(300, z + 50))}
            aria-label="Aumentar zoom"
            disabled={zoom >= 300}
            className="rounded-lg border border-neutral-700 p-2 text-neutral-300 disabled:opacity-40"
          >
            <ZoomIn size={15} />
          </button>
          <button
            onClick={compartilhar}
            aria-label="Compartilhar"
            className="rounded-lg border border-neutral-700 p-2 text-neutral-300"
          >
            <Share2 size={15} />
          </button>
          <button
            onClick={baixar}
            aria-label="Baixar"
            className="rounded-lg border border-neutral-700 p-2 text-neutral-300"
          >
            <FileDown size={15} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-2" style={{ touchAction: "pan-x pan-y pinch-zoom" }}>
        {status === "carregando" && (
          <p className="py-10 text-center text-sm text-neutral-500">Preparando o PDF…</p>
        )}
        {/* área gerenciada fora do React: só o pdf.js escreve aqui */}
        <div ref={contRef} style={{ width: `${zoom}%` }} />
      </div>
      {status === "erro" && (
        <div className="border-t border-neutral-800 bg-neutral-900 px-3 py-3 text-center">
          <p className="mb-2 text-xs text-red-300">
            Não foi possível exibir aqui — use o botão abaixo para baixar.
          </p>
          <button
            onClick={baixar}
            className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-neutral-950"
          >
            Baixar o PDF
          </button>
        </div>
      )}
    </div>
  );
}

// Botão + visor em um só: busca o PDF de uma URL GET e abre o visor.
export function BotaoPdf({
  href,
  label = "Baixar PDF",
  titulo,
  nomeArquivo = "relatorio.pdf",
}: {
  href: string;
  label?: string;
  titulo?: string;
  nomeArquivo?: string;
}) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(false);

  async function abrir() {
    if (carregando) return;
    setCarregando(true);
    setErro(false);
    try {
      const resp = await fetch(href);
      if (!resp.ok) throw new Error();
      const blob = await resp.blob();
      setBlobUrl(URL.createObjectURL(blob));
    } catch {
      setErro(true);
    } finally {
      setCarregando(false);
    }
  }

  function fechar() {
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    setBlobUrl(null);
  }

  return (
    <>
      <button
        onClick={abrir}
        disabled={carregando}
        className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs font-medium text-neutral-300 transition-colors duration-150 hover:border-neutral-600 hover:bg-neutral-800 disabled:opacity-50"
      >
        <FileDown size={14} />
        {carregando ? "Gerando…" : erro ? "Falhou — tentar de novo" : label}
      </button>
      {blobUrl && (
        <VisorPdf
          titulo={titulo ?? label}
          blobUrl={blobUrl}
          nomeArquivo={nomeArquivo}
          aoFechar={fechar}
        />
      )}
    </>
  );
}
