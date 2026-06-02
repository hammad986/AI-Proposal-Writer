'use client'

import { useState } from 'react'
import { Check, Pencil, RefreshCw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/field'
import { renderBold } from '@/lib/rendering'
import type { ProposalSection } from '@/lib/types'
import { PricingTable } from './pricing-table'
import { TimelinePhases } from './timeline-phases'

export function renderSectionContent(section: ProposalSection) {
  if (section.type === 'table' || section.content.includes('|')) {
    return <PricingTable content={section.content} />
  }
  if (section.type === 'phases' || section.content.includes('## Phase')) {
    return <TimelinePhases content={section.content} />
  }
  if (section.type === 'list') {
    return (
      <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-muted-foreground">
        {section.content
          .split('\n')
          .map((line) => line.trim().replace(/^[-*]\s*/, ''))
          .filter(Boolean)
          .map((line) => (
            <li key={line}>{renderBold(line)}</li>
          ))}
      </ul>
    )
  }
  return (
    <div className="proposal-markdown space-y-4 text-sm leading-7 text-muted-foreground">
      {section.content.split(/\n{2,}/).map((paragraph) => (
        <p key={paragraph}>{renderBold(paragraph)}</p>
      ))}
    </div>
  )
}

export function SectionCard({
  section,
  onSave,
  onRegenerate
}: {
  section: ProposalSection
  onSave: (content: string) => void
  onRegenerate: () => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(section.content)

  return (
    <section id={section.id} className="scroll-mt-24 rounded-lg border bg-card p-5">
      <div className="mb-4 flex items-start justify-between gap-4 border-l-4 border-primary pl-4">
        <div>
          <h2 className="text-base font-semibold">{section.title}</h2>
          {section.isEdited && <span className="mt-2 inline-flex rounded-full bg-indigo-50 px-2 py-1 text-xs text-indigo-700">Edited</span>}
        </div>
        <div className="flex gap-1">
          {isEditing ? (
            <>
              <Button
                size="icon"
                variant="ghost"
                title="Save section"
                onClick={() => {
                  onSave(draft)
                  setIsEditing(false)
                }}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                title="Cancel editing"
                onClick={() => {
                  setDraft(section.content)
                  setIsEditing(false)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button size="icon" variant="ghost" title="Edit section" onClick={() => setIsEditing(true)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" title="Regenerate this section" onClick={onRegenerate}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
      {isEditing ? <Textarea className="min-h-64" value={draft} onChange={(event) => setDraft(event.target.value)} /> : renderSectionContent(section)}
    </section>
  )
}
