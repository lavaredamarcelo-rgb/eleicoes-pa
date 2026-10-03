import { Document, Page, Text, View } from "@react-pdf/renderer";
import { styles, CORES } from "./styles";

export function ReportShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const geradoEm = new Date().toLocaleString("pt-BR", { timeZone: "America/Belem" });

  return (
    <Document title={title}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: CORES.ambarVivo,
                marginRight: 5,
              }}
            />
            <Text style={[styles.brand, { marginBottom: 0 }]}>ELEIÇÕES PA · 2026</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          <Text style={styles.metaLine}>
            Relatório gerado em {geradoEm} · dados oficiais TSE/IBGE · uso interno da campanha
          </Text>
        </View>

        {children}

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `ELEIÇÕES PA — inteligência eleitoral · página ${pageNumber} de ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}

export function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export function TableHeader({ columns }: { columns: string[] }) {
  return (
    <View style={styles.tableHeaderRow}>
      {columns.map((c, i) => (
        <Text key={i} style={[styles.tableHeaderCell, { flex: i === 0 ? 2 : 1 }]}>
          {c}
        </Text>
      ))}
    </View>
  );
}

export function TableRow({ cells }: { cells: string[] }) {
  return (
    <View style={styles.tableRow}>
      {cells.map((c, i) => {
        // Realce automático: situações de eleição ganham cor — ELEITO em
        // verde, derrotas discretas — sem cada relatório precisar cuidar.
        const eleito = /^ELEITO/i.test(c.trim());
        const derrota = /^(não eleito|nao eleito|suplente)/i.test(c.trim());
        const estilo = eleito
          ? styles.tableCellDestaque
          : derrota
            ? styles.tableCellMuted
            : styles.tableCell;
        return (
          <Text key={i} style={[estilo, { flex: i === 0 ? 2 : 1 }]}>
            {c}
          </Text>
        );
      })}
    </View>
  );
}
