import { redirect } from "next/navigation";

// A listagem do quociente foi incorporada à aba "Quociente e Simulações";
// as páginas de detalhe (/quociente/[cargoId]) continuam ativas.
export default function QuocientePage() {
  redirect("/simulacoes");
}
