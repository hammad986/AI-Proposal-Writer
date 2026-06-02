'use client'

import Link from 'next/link'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { ArrowLeft, Download, PenLine, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/status-badge'
import { useGenerate } from '@/hooks/use-generate'
import { useProposalStore } from '@/lib/store'
import type { GeneratedProposal } from '@/lib/types'
import { ProposalPdf } from './proposal-pdf'
import { SectionCard } from './section-card'

export function ProposalViewer({ proposal }: { proposal: GeneratedProposal }) {
  const updateSection = useProposalStore((state) => state.updateSection)
  const updateProposal = useProposalStore((state) => state.updateProposal)
  const { regenerateSection } = useGenerate()

  const regenerate = async (sectionId: string) => {
    const section = proposal.sections.find((item) => item.id === sectionId)
    if (!section) return
    const toastId = toast.loading('Regenerating section...')
    try {
      const nextSection = await regenerateSection(proposal.formData, section)
      updateProposal(proposal.id, {
        sections: proposal.sections.map((item) =>
          item.id === sectionId ? { ...item, ...nextSection, id: item.id, isEdited: false } : item
        )
      })
      toast.success('Section regenerated', { id: toastId })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to regenerate section.', { id: toastId })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/95 px-4 py-3 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <Link href="/proposals" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Proposals
          </Link>
          <h1 className="max-w-md truncate text-sm font-semibold md:text-base">{proposal.title}</h1>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/proposals/new">
                <PenLine className="h-4 w-4" />
                Edit Inputs
              </Link>
            </Button>
            <PDFDownloadLink document={<ProposalPdf proposal={proposal} />} fileName={`${proposal.title.replace(/\W+/g, '-').toLowerCase()}.pdf`}>
              {({ loading }) => (
                <Button size="sm" onClick={() => !loading && toast.success('PDF downloaded')}>
                  <Download className="h-4 w-4" />
                  {loading ? 'Preparing' : 'Download PDF'}
                </Button>
              )}
            </PDFDownloadLink>
            <Button variant="outline" size="sm" asChild>
              <Link href="/proposals/new">
                <Sparkles className="h-4 w-4" />
                New Proposal
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[240px_1fr] md:px-8">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-lg border bg-card p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contents</p>
            <nav className="space-y-1">
              {proposal.sections.map((section) => (
                <a key={section.id} href={`#${section.id}`} className="block rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
                  {section.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>
        <div className="space-y-5">
          <Card className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">{proposal.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{proposal.subtitle}</p>
              </div>
              <StatusBadge status={proposal.status} />
            </div>
            <div className="mt-6 grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
              <p>Generated: <span className="text-foreground">{proposal.generatedDate}</span></p>
              <p>Valid until: <span className="text-foreground">{proposal.validUntil}</span></p>
              <p>Client: <span className="text-foreground">{proposal.formData.step1.clientName}, {proposal.formData.step1.clientCompany}</span></p>
              <p>Budget: <span className="font-semibold text-foreground">{proposal.totalValue}</span></p>
            </div>
          </Card>
          {proposal.sections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              onSave={(content) => {
                updateSection(proposal.id, section.id, content)
                toast.success('Saved')
              }}
              onRegenerate={() => regenerate(section.id)}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
