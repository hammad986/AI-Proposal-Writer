import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { parsePhases, parseTable } from '@/lib/rendering'
import type { GeneratedProposal, ProposalSection } from '@/lib/types'

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, color: '#111827', fontFamily: 'Helvetica' },
  coverTop: { height: '40%', backgroundColor: '#6366f1', alignItems: 'center', justifyContent: 'center', margin: -40, marginBottom: 42 },
  coverTitle: { color: '#ffffff', fontSize: 30, fontWeight: 700, letterSpacing: 1 },
  coverAgency: { color: '#eef2ff', marginTop: 12, fontSize: 14 },
  title: { fontSize: 20, fontWeight: 700, textAlign: 'center', marginBottom: 14 },
  muted: { color: '#6b7280', textAlign: 'center', marginBottom: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, color: '#6b7280', fontSize: 9 },
  footer: { position: 'absolute', bottom: 24, left: 40, right: 40, color: '#6b7280', fontSize: 9 },
  section: { marginBottom: 20 },
  sectionTitle: { borderLeftWidth: 4, borderLeftColor: '#6366f1', paddingLeft: 10, color: '#4f46e5', fontSize: 14, fontWeight: 700, marginBottom: 10 },
  paragraph: { lineHeight: 1.6, marginBottom: 8 },
  table: { borderWidth: 1, borderColor: '#e5e7eb', marginTop: 6 },
  tableRow: { flexDirection: 'row' },
  tableHeader: { backgroundColor: '#6366f1', color: '#ffffff', fontWeight: 700 },
  cell: { flex: 1, padding: 6, borderRightWidth: 1, borderRightColor: '#e5e7eb' },
  phase: { borderWidth: 1, borderColor: '#e5e7eb', padding: 10, marginBottom: 8 },
  phaseTitle: { fontWeight: 700, color: '#4f46e5', marginBottom: 5 },
  listItem: { marginBottom: 4 }
})

function PdfSection({ section }: { section: ProposalSection }) {
  const table = section.type === 'table' || section.content.includes('|') ? parseTable(section.content) : null
  const phases = section.type === 'phases' || section.content.includes('## Phase') ? parsePhases(section.content) : null

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      {table?.headers.length ? (
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            {table.headers.map((header) => (
              <Text key={header} style={styles.cell}>{header}</Text>
            ))}
          </View>
          {table.rows.map((row, index) => (
            <View key={`${row.join('-')}-${index}`} style={styles.tableRow}>
              {row.map((cell) => (
                <Text key={cell} style={styles.cell}>{cell}</Text>
              ))}
            </View>
          ))}
        </View>
      ) : phases?.length ? (
        <View>
          {phases.map((phase) => (
            <View key={`${phase.number}-${phase.name}`} style={styles.phase}>
              <Text style={styles.phaseTitle}>Phase {phase.number}: {phase.name} {phase.duration ? `(${phase.duration})` : ''}</Text>
              {phase.tasks.map((task) => (
                <Text key={task} style={styles.listItem}>- {task}</Text>
              ))}
            </View>
          ))}
        </View>
      ) : (
        section.content.split(/\n{2,}/).map((paragraph) => (
          <Text key={paragraph} style={styles.paragraph}>{paragraph.replace(/\*\*/g, '')}</Text>
        ))
      )}
    </View>
  )
}

export function ProposalPdf({ proposal }: { proposal: GeneratedProposal }) {
  return (
    <Document title={proposal.title}>
      <Page size="A4" style={styles.page}>
        <View style={styles.coverTop}>
          <Text style={styles.coverTitle}>PROJECT PROPOSAL</Text>
          <Text style={styles.coverAgency}>{proposal.formData.step1.agencyName}</Text>
        </View>
        <Text style={styles.title}>{proposal.title}</Text>
        <Text style={styles.muted}>Prepared for: {proposal.formData.step1.clientCompany}</Text>
        <Text style={styles.muted}>Prepared by: {proposal.formData.step1.agencyName}</Text>
        <Text style={styles.muted}>Generated: {proposal.generatedDate} | Valid until: {proposal.validUntil}</Text>
        <Text style={[styles.muted, { marginTop: 32 }]}>Confidential proposal prepared for review and approval.</Text>
      </Page>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text>{proposal.formData.step1.agencyName}</Text>
          <Text>{proposal.title}</Text>
        </View>
        {proposal.sections.map((section) => (
          <PdfSection key={section.id} section={section} />
        ))}
        <Text style={styles.footer}>Powered by Aetherion Labs | {proposal.generatedDate}</Text>
      </Page>
    </Document>
  )
}
