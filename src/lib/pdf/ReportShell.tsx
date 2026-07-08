import { Document, Page, Text, View } from "@react-pdf/renderer";
import { styles } from "./styles";

export function ReportShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const geradoEm = new Date().toLocaleString("pt-BR");

  return (
    <Document title={title}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>ELEIÇÕES PA</Text>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          <Text style={styles.metaLine}>
            Relatório gerado em {geradoEm} · dados oficiais TSE/IBGE
          </Text>
        </View>

        {children}

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `Eleições PA · página ${pageNumber} de ${totalPages}`
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
      {cells.map((c, i) => (
        <Text key={i} style={[styles.tableCell, { flex: i === 0 ? 2 : 1 }]}>
          {c}
        </Text>
      ))}
    </View>
  );
}
