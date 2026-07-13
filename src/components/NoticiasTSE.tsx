import { Newspaper, ExternalLink } from "lucide-react";

type Noticia = { titulo: string; link: string; data: string };

// Últimas notícias do TSE (RSS oficial), atualizadas de hora em hora.
// Se o feed estiver fora do ar, a seção simplesmente não aparece.
async function buscarNoticias(): Promise<Noticia[]> {
  try {
    const resp = await fetch("https://www.tse.jus.br/comunicacao/noticias/rss", {
      next: { revalidate: 3600 },
    });
    if (!resp.ok) return [];
    const xml = await resp.text();
    const itens = xml.match(/<item[^>]*>[\s\S]*?<\/item>/g) ?? [];
    return itens
      .map((item) => {
        const titulo = item.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "";
        const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1] ?? "";
        const data = item.match(/<dc:date>([\s\S]*?)<\/dc:date>/)?.[1] ?? "";
        return {
          titulo: titulo.replace(/<!\[CDATA\[|\]\]>/g, "").trim(),
          link: link.trim(),
          data: data.slice(0, 10),
        };
      })
      .filter((n) => n.titulo && n.link)
      .slice(0, 6);
  } catch {
    return [];
  }
}

export async function NoticiasTSE() {
  const noticias = await buscarNoticias();
  if (noticias.length === 0) return null;

  return (
    <section className="flex flex-col gap-2 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
      <div className="flex items-center gap-2">
        <Newspaper size={16} className="text-amber-400" />
        <h2 className="text-sm font-medium text-neutral-200">Notícias do TSE</h2>
      </div>
      <div className="flex flex-col gap-1.5">
        {noticias.map((n) => (
          <a
            key={n.link}
            href={n.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start justify-between gap-2 rounded-lg bg-neutral-950 px-3 py-2 transition-colors hover:bg-neutral-800"
          >
            <span className="min-w-0">
              <span className="block text-xs leading-snug text-neutral-200 group-hover:text-amber-200">
                {n.titulo}
              </span>
              {n.data && (
                <span className="text-[10px] text-neutral-600">
                  {n.data.split("-").reverse().join("/")}
                </span>
              )}
            </span>
            <ExternalLink size={12} className="mt-0.5 shrink-0 text-neutral-600" />
          </a>
        ))}
      </div>
      <p className="text-right text-[10px] text-neutral-600">Fonte: tse.jus.br (atualiza a cada hora)</p>
    </section>
  );
}
