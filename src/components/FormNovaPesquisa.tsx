"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

const DISPUTAS = [
  "Governador",
  "Senador",
  "Deputado Federal",
  "Deputado Estadual",
  "Presidente",
];

type Linha = { nome: string; partido: string; percentual: string };

const inputCls =
  "w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-600 outline-none focus:border-amber-700";
const labelCls = "text-xs font-medium text-neutral-400";

export default function FormNovaPesquisa() {
  const router = useRouter();
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [form, setForm] = useState({
    disputa: "Governador",
    turno: "1",
    tipo: "estimulada",
    cenario: "",
    instituto: "",
    contratante: "",
    registroTSE: "",
    linkRegistro: "",
    linkMateria: "",
    dataDivulgacao: "",
    dataCampoInicio: "",
    dataCampoFim: "",
    amostra: "",
    margemErro: "",
    confianca: "95",
    observacoes: "",
  });
  const [linhas, setLinhas] = useState<Linha[]>([
    { nome: "", partido: "", percentual: "" },
    { nome: "", partido: "", percentual: "" },
    { nome: "", partido: "", percentual: "" },
  ]);

  const set = (campo: string, valor: string) =>
    setForm((f) => ({ ...f, [campo]: valor }));

  const setLinha = (i: number, campo: keyof Linha, valor: string) =>
    setLinhas((ls) => ls.map((l, j) => (j === i ? { ...l, [campo]: valor } : l)));

  const soma = linhas.reduce((s, l) => s + (Number(l.percentual) || 0), 0);

  const salvar = async () => {
    setErro("");
    setSalvando(true);
    try {
      const res = await fetch("/api/pesquisas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, resultados: linhas }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.error || "Erro ao salvar.");
        setSalvando(false);
        return;
      }
      router.push("/pesquisas");
      router.refresh();
    } catch {
      setErro("Erro de conexão. Tente novamente.");
      setSalvando(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 rounded-lg border border-neutral-800 bg-neutral-950 p-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Disputa *</label>
          <select
            value={form.disputa}
            onChange={(e) => set("disputa", e.target.value)}
            className={inputCls}
          >
            {DISPUTAS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Turno</label>
          <select
            value={form.turno}
            onChange={(e) => set("turno", e.target.value)}
            className={inputCls}
          >
            <option value="1">1º turno</option>
            <option value="2">2º turno</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Tipo</label>
          <select
            value={form.tipo}
            onChange={(e) => set("tipo", e.target.value)}
            className={inputCls}
          >
            <option value="estimulada">Estimulada</option>
            <option value="espontanea">Espontânea</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Cenário (opcional)</label>
          <input
            value={form.cenario}
            onChange={(e) => set("cenario", e.target.value)}
            placeholder='Ex.: "Cenário 2, sem Fulano"'
            className={inputCls}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Instituto *</label>
          <input
            value={form.instituto}
            onChange={(e) => set("instituto", e.target.value)}
            placeholder="Ex.: Quaest, Datafolha..."
            className={inputCls}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Contratante</label>
          <input
            value={form.contratante}
            onChange={(e) => set("contratante", e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Nº registro TSE</label>
          <input
            value={form.registroTSE}
            onChange={(e) => set("registroTSE", e.target.value)}
            placeholder="Ex.: PA-01234/2026"
            className={inputCls}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Data de divulgação *</label>
          <input
            type="date"
            value={form.dataDivulgacao}
            onChange={(e) => set("dataDivulgacao", e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Campo — início</label>
          <input
            type="date"
            value={form.dataCampoInicio}
            onChange={(e) => set("dataCampoInicio", e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Campo — fim</label>
          <input
            type="date"
            value={form.dataCampoFim}
            onChange={(e) => set("dataCampoFim", e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Amostra (entrevistados)</label>
          <input
            type="number"
            value={form.amostra}
            onChange={(e) => set("amostra", e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Margem de erro (± p.p.)</label>
          <input
            type="number"
            step="0.1"
            value={form.margemErro}
            onChange={(e) => set("margemErro", e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Confiança (%)</label>
          <input
            type="number"
            value={form.confianca}
            onChange={(e) => set("confianca", e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Link do registro no TSE</label>
          <input
            value={form.linkRegistro}
            onChange={(e) => set("linkRegistro", e.target.value)}
            placeholder="https://..."
            className={inputCls}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Link da matéria/divulgação</label>
          <input
            value={form.linkMateria}
            onChange={(e) => set("linkMateria", e.target.value)}
            placeholder="https://..."
            className={inputCls}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-amber-300">
            Resultados (%)
          </span>
          <span
            className={`text-xs ${
              soma > 100.5 ? "text-red-400" : "text-neutral-500"
            }`}
          >
            Soma: {soma.toFixed(1)}%
          </span>
        </div>
        {linhas.map((l, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={l.nome}
              onChange={(e) => setLinha(i, "nome", e.target.value)}
              placeholder={
                i === linhas.length - 1
                  ? "Ex.: Brancos/Nulos ou Não sabe"
                  : "Nome do candidato"
              }
              className={inputCls + " flex-1"}
            />
            <input
              value={l.partido}
              onChange={(e) => setLinha(i, "partido", e.target.value)}
              placeholder="Partido"
              className={inputCls + " w-28"}
            />
            <input
              type="number"
              step="0.1"
              value={l.percentual}
              onChange={(e) => setLinha(i, "percentual", e.target.value)}
              placeholder="%"
              className={inputCls + " w-24"}
            />
            <button
              onClick={() => setLinhas((ls) => ls.filter((_, j) => j !== i))}
              className="rounded-lg border border-neutral-800 px-2 text-neutral-500 transition hover:bg-red-950/40 hover:text-red-400"
              title="Remover linha"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        <button
          onClick={() =>
            setLinhas((ls) => [...ls, { nome: "", partido: "", percentual: "" }])
          }
          className="flex w-fit items-center gap-1 rounded-lg border border-neutral-800 px-3 py-1.5 text-xs text-neutral-300 transition hover:bg-neutral-900"
        >
          <Plus size={14} /> Adicionar linha
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelCls}>Observações</label>
        <textarea
          value={form.observacoes}
          onChange={(e) => set("observacoes", e.target.value)}
          rows={2}
          className={inputCls}
        />
      </div>

      {erro && <p className="text-sm text-red-400">{erro}</p>}

      <button
        onClick={salvar}
        disabled={salvando}
        className="w-fit rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-amber-400 disabled:opacity-50"
      >
        {salvando ? "Salvando..." : "Salvar pesquisa"}
      </button>
    </div>
  );
}
