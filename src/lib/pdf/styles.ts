import { StyleSheet } from "@react-pdf/renderer";

// Identidade visual dos relatórios — a mesma do aplicativo: grafite + âmbar.
// Tons escolhidos para impressão (âmbar escurecido para legibilidade em papel).
export const CORES = {
  grafite: "#111827",
  grafiteClaro: "#1f2937",
  ambar: "#b45309",
  ambarVivo: "#d97706",
  ambarSuave: "#fef3c7",
  cinza: "#6b7280",
  cinzaClaro: "#9ca3af",
  linha: "#e5e7eb",
  fundoSuave: "#f9fafb",
  verde: "#047857",
  verdeSuave: "#d1fae5",
  vermelho: "#b91c1c",
};

export const styles = StyleSheet.create({
  page: {
    padding: 36,
    paddingTop: 0,
    paddingBottom: 56,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: CORES.grafite,
  },
  // Faixa de capa: sangra até as bordas (margens negativas compensam o
  // padding da página) — dá cara de documento oficial da campanha.
  header: {
    marginHorizontal: -36,
    marginBottom: 18,
    backgroundColor: CORES.grafite,
    paddingTop: 22,
    paddingBottom: 14,
    paddingHorizontal: 36,
    borderBottom: `3pt solid ${CORES.ambarVivo}`,
  },
  brand: {
    fontSize: 9,
    color: CORES.ambarVivo,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
    marginBottom: 6,
  },
  title: {
    fontSize: 19,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 10,
    color: "#d1d5db",
    marginTop: 3,
  },
  metaLine: {
    fontSize: 7.5,
    color: CORES.cinzaClaro,
    marginTop: 7,
  },
  sectionTitle: {
    fontSize: 11.5,
    fontFamily: "Helvetica-Bold",
    marginTop: 16,
    marginBottom: 6,
    color: CORES.grafite,
    borderLeft: `3pt solid ${CORES.ambarVivo}`,
    paddingLeft: 7,
    paddingVertical: 1,
  },
  paragraph: {
    fontSize: 9.5,
    lineHeight: 1.5,
    color: CORES.grafiteClaro,
    marginBottom: 5,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 6,
  },
  statBox: {
    flex: 1,
    backgroundColor: CORES.fundoSuave,
    borderRadius: 5,
    borderTop: `2.5pt solid ${CORES.ambarVivo}`,
    padding: 9,
  },
  statValue: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    color: CORES.ambar,
  },
  statLabel: {
    fontSize: 7.5,
    color: CORES.cinza,
    marginTop: 3,
    textTransform: "uppercase",
  },
  table: {
    marginTop: 4,
    borderRadius: 4,
    border: `0.75pt solid ${CORES.linha}`,
    overflow: "hidden",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: CORES.grafiteClaro,
    paddingVertical: 6,
    paddingHorizontal: 7,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 5.5,
    paddingHorizontal: 7,
    borderBottom: `0.5pt solid ${CORES.linha}`,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  tableCell: {
    fontSize: 9,
    color: CORES.grafite,
  },
  tableCellDestaque: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: CORES.verde,
  },
  tableCellMuted: {
    fontSize: 8,
    color: CORES.cinza,
  },
  badge: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: CORES.verde,
    backgroundColor: CORES.verdeSuave,
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  badgeNeutral: {
    fontSize: 8,
    color: "#4b5563",
    backgroundColor: "#f3f4f6",
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 36,
    right: 36,
    fontSize: 7.5,
    color: CORES.cinzaClaro,
    textAlign: "center",
    borderTop: `0.5pt solid ${CORES.linha}`,
    paddingTop: 6,
  },
});
