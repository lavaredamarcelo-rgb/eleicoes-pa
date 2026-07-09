import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    padding: 36,
    paddingBottom: 56,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#111827",
  },
  header: {
    marginBottom: 18,
    borderBottom: "2pt solid #1d4ed8",
    paddingBottom: 10,
  },
  brand: {
    fontSize: 9,
    color: "#1d4ed8",
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
  },
  subtitle: {
    fontSize: 10,
    color: "#4b5563",
    marginTop: 2,
  },
  metaLine: {
    fontSize: 8,
    color: "#9ca3af",
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginTop: 16,
    marginBottom: 6,
    color: "#1d4ed8",
  },
  paragraph: {
    fontSize: 9.5,
    lineHeight: 1.5,
    color: "#111827",
    marginBottom: 5,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 4,
  },
  statBox: {
    flex: 1,
    border: "0.5pt solid #d1d5db",
    borderRadius: 4,
    padding: 8,
  },
  statValue: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
  },
  statLabel: {
    fontSize: 8,
    color: "#6b7280",
    marginTop: 2,
  },
  table: {
    marginTop: 4,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderBottom: "0.5pt solid #e5e7eb",
  },
  tableHeaderCell: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#374151",
  },
  tableCell: {
    fontSize: 9,
    color: "#111827",
  },
  tableCellMuted: {
    fontSize: 8,
    color: "#6b7280",
  },
  badge: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#065f46",
    backgroundColor: "#d1fae5",
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
    fontSize: 8,
    color: "#9ca3af",
    textAlign: "center",
    borderTop: "0.5pt solid #e5e7eb",
    paddingTop: 6,
  },
});
