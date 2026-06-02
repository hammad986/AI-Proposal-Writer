import { includedSections } from './defaults'
import type { ProposalFormData } from './types'

const complexityTimeline: Record<ProposalFormData['step3']['complexity'], string> = {
  simple: '1-2 weeks',
  standard: '3-6 weeks',
  complex: '2-3 months',
  enterprise: '3+ months'
}

export function buildProposalPrompt(formData: ProposalFormData) {
  const { step1, step2, step3, step4 } = formData
  const features = step2.keyFeatures
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => `${index + 1}. ${line}`)
    .join('\n')

  return `You are an expert proposal writer for a software development agency called ${step1.agencyName}.
Your proposals are professional, persuasive, and client-focused.
You always personalize proposals using the client's name and company.
You are generating a proposal in ${step4.tone} tone in ${step4.language} language.

Generate a complete project proposal with the following specifications:

AGENCY: ${step1.agencyName} - ${step1.agencyTagline}
CLIENT: ${step1.clientName} at ${step1.clientCompany}
PROJECT: ${step1.projectName} (${step1.projectType} for ${step1.industry} industry)
PROBLEM: ${step1.problemStatement}

REQUIREMENTS:
${features}

TECHNICAL REQUIREMENTS: ${step2.technicalRequirements.join(', ')}
TARGET USERS: ${step2.targetUsers}
${step2.constraints ? `CONSTRAINTS: ${step2.constraints}` : ''}

BUDGET: ${step3.budgetRange}
COMPLEXITY: ${step3.complexity} (approx ${complexityTimeline[step3.complexity]})
PAYMENT: ${step3.paymentMilestone} with ${step3.advancePercent}% advance
REVISIONS: ${step3.revisions} revisions included
WARRANTY: ${step3.warrantyPeriod} post-delivery support
${step3.additionalServices.length ? `ADDITIONAL SERVICES: ${step3.additionalServices.join(', ')}` : ''}

TONE: ${step4.tone}
LANGUAGE: ${step4.language}

Generate ONLY the following sections (skip any not in this list): ${(step4.includedSections.length ? step4.includedSections : includedSections).join(', ')}

${step4.specialEmphasis ? `SPECIAL EMPHASIS: ${step4.specialEmphasis}` : ''}

CRITICAL INSTRUCTIONS:
- Use the client's name (${step1.clientName}) throughout for personalization
- Be specific; use actual project details, not generic placeholders
- Pricing section MUST have an itemized breakdown table matching the budget range
- Timeline section MUST have clearly named phases with durations
- Each section should be 2-5 paragraphs or equivalent structured content
- For tables, use pipe-separated markdown: | Header 1 | Header 2 |
- For phases, use this format: ## Phase N: {name} ({duration})
- Terms must be professional, reasonable, standard freelance/agency terms
- Call to action must include specific next steps

RESPOND WITH A VALID JSON OBJECT ONLY. No markdown code blocks. No preamble. No explanation.
The JSON structure must be EXACTLY:
{
  "title": "Project Proposal: ${step1.projectName}",
  "subtitle": "Prepared for ${step1.clientCompany} by ${step1.agencyName}",
  "generatedDate": "YYYY-MM-DD",
  "validUntil": "YYYY-MM-DD",
  "totalValue": "₹XX,XXX",
  "sections": [
    {
      "id": "snake_case_id",
      "title": "Section Title",
      "type": "text",
      "content": "Full section content as string.",
      "isEdited": false
    }
  ]
}`
}

export function buildSectionPrompt(formData: ProposalFormData, sectionTitle: string, currentContent: string) {
  return `${buildProposalPrompt(formData)}

Regenerate only this section: ${sectionTitle}
Current section content for context:
${currentContent}

Return the same JSON shape, but with only one item in sections for ${sectionTitle}.`
}
