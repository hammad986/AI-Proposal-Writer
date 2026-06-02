'use client'

import { useCallback, useState } from 'react'
import type { GeneratedProposal, ProposalFormData, ProposalSection } from '@/lib/types'

export function useGenerate() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateProposal = useCallback(async (formData: ProposalFormData) => {
    setIsGenerating(true)
    setError(null)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData })
      })
      const payload = (await response.json()) as { proposal?: GeneratedProposal; error?: string }
      if (!response.ok || !payload.proposal) {
        throw new Error(payload.error || 'Unable to generate proposal.')
      }
      return payload.proposal
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to generate proposal.'
      setError(message)
      throw err
    } finally {
      setIsGenerating(false)
    }
  }, [])

  const regenerateSection = useCallback(
    async (formData: ProposalFormData, section: ProposalSection) => {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, section })
      })
      const payload = (await response.json()) as { proposal?: GeneratedProposal; error?: string }
      if (!response.ok || !payload.proposal?.sections?.[0]) {
        throw new Error(payload.error || 'Unable to regenerate section.')
      }
      return payload.proposal.sections[0]
    },
    []
  )

  return { isGenerating, error, generateProposal, regenerateSection }
}
