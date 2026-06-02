'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { emptyFormData } from './defaults'
import type { GeneratedProposal, ProposalFormData } from './types'

const demoForm = {
  ...emptyFormData,
  step1: {
    ...emptyFormData.step1,
    agencyName: 'Aetherion Labs',
    clientName: 'Demo Client'
  }
}

const demoSections = (project: string) => [
  {
    id: 'executive_summary',
    title: 'Executive Summary',
    type: 'text' as const,
    content: `This proposal outlines a focused delivery plan for ${project}. The project is structured to move from discovery to launch with clear checkpoints, practical milestones, and measurable business outcomes.`,
    isEdited: false
  },
  {
    id: 'scope_of_work',
    title: 'Scope of Work',
    type: 'list' as const,
    content: '- Product discovery and requirements mapping\n- User-focused interface design\n- Core application development\n- Testing, launch support, and handover',
    isEdited: false
  },
  {
    id: 'timeline',
    title: 'Timeline & Milestones',
    type: 'phases' as const,
    content: '## Phase 1: Discovery (1 week)\n- Requirements workshop\n- Success metrics\n\n## Phase 2: Build (3 weeks)\n- Feature development\n- Internal QA\n\n## Phase 3: Launch (1 week)\n- Deployment\n- Team handover',
    isEdited: false
  }
]

const demoProposals: GeneratedProposal[] = [
  {
    id: 'demo_stylehub',
    formData: {
      ...demoForm,
      step1: {
        ...demoForm.step1,
        clientCompany: 'StyleHub Pvt Ltd',
        projectName: 'E-commerce Platform for StyleHub',
        projectType: 'Web Development',
        industry: 'E-commerce'
      }
    },
    title: 'E-commerce Platform for StyleHub',
    subtitle: 'Prepared for StyleHub Pvt Ltd by Aetherion Labs',
    generatedDate: '2025-05-10',
    validUntil: '2025-06-09',
    sections: demoSections('StyleHub e-commerce platform'),
    status: 'accepted',
    totalValue: '₹1,25,000',
    createdAt: '2025-05-10',
    updatedAt: '2025-05-10'
  },
  {
    id: 'demo_medquick',
    formData: {
      ...demoForm,
      step1: {
        ...demoForm.step1,
        clientCompany: 'MedQuick Health',
        projectName: 'AI Chatbot System for MedQuick',
        projectType: 'AI/ML System',
        industry: 'Healthcare'
      }
    },
    title: 'AI Chatbot System for MedQuick',
    subtitle: 'Prepared for MedQuick Health by Aetherion Labs',
    generatedDate: '2025-05-20',
    validUntil: '2025-06-19',
    sections: demoSections('MedQuick AI chatbot system'),
    status: 'sent',
    totalValue: '₹85,000',
    createdAt: '2025-05-20',
    updatedAt: '2025-05-20'
  }
]

type ProposalStore = {
  proposals: GeneratedProposal[]
  formDraft: Partial<ProposalFormData>
  currentStep: number
  hasHydrated: boolean
  setHasHydrated: (value: boolean) => void
  saveProposal: (proposal: GeneratedProposal) => void
  updateProposal: (id: string, data: Partial<GeneratedProposal>) => void
  deleteProposal: (id: string) => void
  updateSection: (proposalId: string, sectionId: string, content: string) => void
  setFormDraft: (data: Partial<ProposalFormData>) => void
  setStep: (n: number) => void
  clearFormDraft: () => void
}

export const useProposalStore = create<ProposalStore>()(
  persist(
    (set) => ({
      proposals: demoProposals,
      formDraft: {},
      currentStep: 1,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      saveProposal: (proposal) =>
        set((state) => ({
          proposals: [proposal, ...state.proposals.filter((item) => item.id !== proposal.id)]
        })),
      updateProposal: (id, data) =>
        set((state) => ({
          proposals: state.proposals.map((proposal) =>
            proposal.id === id ? { ...proposal, ...data, updatedAt: new Date().toISOString() } : proposal
          )
        })),
      deleteProposal: (id) =>
        set((state) => ({
          proposals: state.proposals.filter((proposal) => proposal.id !== id)
        })),
      updateSection: (proposalId, sectionId, content) =>
        set((state) => ({
          proposals: state.proposals.map((proposal) =>
            proposal.id === proposalId
              ? {
                  ...proposal,
                  updatedAt: new Date().toISOString(),
                  sections: proposal.sections.map((section) =>
                    section.id === sectionId ? { ...section, content, isEdited: true } : section
                  )
                }
              : proposal
          )
        })),
      setFormDraft: (data) =>
        set((state) => ({
          formDraft: {
            ...state.formDraft,
            ...data
          }
        })),
      setStep: (n) => set({ currentStep: n }),
      clearFormDraft: () => set({ formDraft: {}, currentStep: 1 })
    }),
    {
      name: 'apw_proposals',
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true)
    }
  )
)
