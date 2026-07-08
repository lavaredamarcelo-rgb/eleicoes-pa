// Utilitários para resultados separados por turno. O 1º turno é a base de
// quociente e simulações; o "decisivo" (maior turno presente) é o que
// elegeu um majoritário e o que faz sentido exibir como votação do eleito.
export type ResultadoTurno = { turno: number; votos: number };

export function votosTurno(resultados: ResultadoTurno[], turno = 1) {
  return resultados.filter((r) => r.turno === turno).reduce((s, r) => s + r.votos, 0);
}

export function turnoDecisivo(resultados: ResultadoTurno[]) {
  return resultados.reduce((max, r) => Math.max(max, r.turno), 1);
}

export function votosDecisivos(resultados: ResultadoTurno[]) {
  return votosTurno(resultados, turnoDecisivo(resultados));
}
