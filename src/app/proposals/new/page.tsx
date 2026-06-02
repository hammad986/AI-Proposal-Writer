'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormStep1View } from '@/components/proposal/form-step-1'
import { FormStep2View } from '@/components/proposal/form-step-2'
import { FormStep3View } from '@/components/proposal/form-step-3'
import { FormStep4View } from '@/components/proposal/form-step-4'
import { GeneratingView } from '@/components/proposal/generating-view'
import { StepIndicator } from '@/components/proposal/step-indicator'
import { useGenerate } from '@/hooks/use-generate'
import { emptyFormData } from '@/lib/defaults'
import { useProposalStore } from '@/lib/store'
import type { ProposalFormData } from '@/lib/types'

function mergeDraft(draft: Partial<ProposalFormData>): ProposalFormData {
  return {
    step1: { ...emptyFormData.step1, ...draft.step1 },
    step2: { ...emptyFormData.step2, ...draft.step2 },
    step3: { ...emptyFormData.step3, ...draft.step3 },
    step4: { ...emptyFormData.step4, ...draft.step4 }
  }
}

function validateStep(step: number, data: ProposalFormData) {
  const errors: Record<string, string> = {}
  if (step === 1) {
    if (!data.step1.agencyName.trim()) errors.agencyName = 'Agency name is required.'
    if (!data.step1.clientName.trim()) errors.clientName = 'Client name is required.'
    if (!data.step1.projectName.trim()) errors.projectName = 'Project name is required.'
    if (data.step1.problemStatement.trim().length < 50) errors.problemStatement = 'Add at least 50 characters.'
  }
  if (step === 2) {
    if (!data.step2.keyFeatures.trim()) errors.keyFeatures = 'Add at least one feature.'
    if (!data.step2.targetUsers.trim()) errors.targetUsers = 'Target users are required.'
  }
  if (step === 4 && data.step4.includedSections.length === 0) {
    errors.includedSections = 'Select at least one section.'
  }
  return errors
}

export default function NewProposalPage() {
  const router = useRouter()
  const formDraft = useProposalStore((state) => state.formDraft)
  const hasHydrated = useProposalStore((state) => state.hasHydrated)
  const currentStep = useProposalStore((state) => state.currentStep)
  const setStep = useProposalStore((state) => state.setStep)
  const setFormDraft = useProposalStore((state) => state.setFormDraft)
  const clearFormDraft = useProposalStore((state) => state.clearFormDraft)
  const saveProposal = useProposalStore((state) => state.saveProposal)
  const { generateProposal, error } = useGenerate()
  const [formData, setFormData] = useState<ProposalFormData>(() => mergeDraft(formDraft))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateLocked, setGenerateLocked] = useState(false)
  const lastSubmitted = useRef<ProposalFormData | null>(null)
  const draftLoaded = useRef(false)
  const skipNextDraftWrite = useRef(false)

  useEffect(() => {
    if (hasHydrated && !draftLoaded.current) {
      skipNextDraftWrite.current = true
      setFormData(mergeDraft(formDraft))
      draftLoaded.current = true
    }
  }, [formDraft, hasHydrated])

  useEffect(() => {
    if (!hasHydrated || !draftLoaded.current) return
    if (skipNextDraftWrite.current) {
      skipNextDraftWrite.current = false
      return
    }
    setFormDraft(formData)
  }, [formData, hasHydrated, setFormDraft])

  const title = useMemo(() => ['Project Basics', 'Scope & Requirements', 'Pricing & Timeline', 'Tone & Style'][currentStep - 1], [currentStep])

  const patchStep = <T extends keyof ProposalFormData>(step: T, patch: Partial<ProposalFormData[T]>) => {
    setFormData((value) => ({
      ...value,
      [step]: {
        ...value[step],
        ...patch
      }
    }))
    setErrors({})
  }

  const next = () => {
    const nextErrors = validateStep(currentStep, formData)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setStep(Math.min(4, currentStep + 1))
  }

  const back = () => setStep(Math.max(1, currentStep - 1))

  const submit = async (data = formData) => {
    const nextErrors = validateStep(4, data)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setGenerateLocked(true)
    window.setTimeout(() => setGenerateLocked(false), 3000)
    setIsGenerating(true)
    lastSubmitted.current = data
    const start = Date.now()
    try {
      const proposal = await generateProposal(data)
      const remaining = Math.max(0, 8000 - (Date.now() - start))
      window.setTimeout(() => {
        saveProposal(proposal)
        clearFormDraft()
        toast.success('Proposal generated')
        router.push(`/proposals/${proposal.id}`)
      }, remaining)
    } catch {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="grid min-h-20 items-center gap-4 border-b px-4 py-4 md:grid-cols-[1fr_2fr_1fr] md:px-8">
        <Link href="/proposals" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Proposal Writer
        </Link>
        <StepIndicator currentStep={currentStep} />
        <div />
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && <FormStep1View data={formData.step1} errors={errors} onChange={(patch) => patchStep('step1', patch)} />}
            {currentStep === 2 && <FormStep2View data={formData.step2} errors={errors} onChange={(patch) => patchStep('step2', patch)} />}
            {currentStep === 3 && <FormStep3View data={formData.step3} onChange={(patch) => patchStep('step3', patch)} />}
            {currentStep === 4 && (
              <>
                <FormStep4View data={formData.step4} onChange={(patch) => patchStep('step4', patch)} />
                {errors.includedSections && <p className="mt-3 text-xs text-red-600">{errors.includedSections}</p>}
              </>
            )}
            <div className="mt-8 flex items-center justify-between border-t pt-5">
              <Button variant="outline" onClick={back} disabled={currentStep === 1}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              {currentStep < 4 ? (
                <Button onClick={next}>
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={() => submit()} disabled={generateLocked || isGenerating}>
                  <Sparkles className="h-4 w-4" />
                  Generate Proposal
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      {isGenerating && (
        <GeneratingView error={error} onRetry={() => lastSubmitted.current && submit(lastSubmitted.current)} />
      )}
    </div>
  )
}
