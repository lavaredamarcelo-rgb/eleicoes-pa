import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/session";

// Cookies só podem ser alterados em Server Actions/Route Handlers, nunca
// durante a renderização de uma página. Como verifySession roda dentro de
// Server Components, ela redireciona para cá (em vez de apagar o cookie
// diretamente) quando detecta um usuário desativado ou com login expirado.
export async function GET(req: Request) {
  await deleteSession();
  return NextResponse.redirect(new URL("/login", req.url));
}
