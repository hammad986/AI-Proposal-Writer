import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'
import { buildProposalPrompt, buildSectionPrompt } from '@/lib/gemini-prompt'
import { addDays, isoDate, uid } from '@/lib/utils'
import type { GeneratedProposal, ProposalFormData, ProposalSection } from '@/lib/types'

function parseJsonResponse(text: string) {
  const cleaned = text
    .trim()
    .replace(/^```json/i, '')
    .replace(/^```/, '')
    .replace(/```$/, '')
    .trim()

  try {
    return JSON.parse(cleaned)
  } catch {
    const first = cleaned.indexOf('{')
    const last = cleaned.lastIndexOf('}')
    if (first >= 0 && last > first) {
      return JSON.parse(cleaned.slice(first, last + 1))
    }
    throw new Error('Gemini returned invalid JSON.')
  }
}

function normalizeProposal(raw: Partial<GeneratedProposal>, formData: ProposalFormData): GeneratedProposal {
  const today = isoDate()
  const validUntil = isoDate(addDays(new Date(), 30))
  return {
    id: uid(),
    formData,
    title: raw.title || `Project Proposal: ${formData.step1.projectName}`,
    subtitle: raw.subtitle || `Prepared for ${formData.step1.clientCompany} by ${formData.step1.agencyName}`,
    generatedDate: raw.generatedDate || today,
    validUntil: raw.validUntil || validUntil,
    totalValue: raw.totalValue || formData.step3.budgetRange,
    sections: (raw.sections || []).map((section, index) => ({
      id: section.id || `section_${index + 1}`,
      title: section.title || `Section ${index + 1}`,
      type: section.type || 'text',
      content: section.content || '',
      isEdited: false
    })),
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is missing. Add it to .env.local.' }, { status: 500 })
    }

    const body = (await request.json()) as { formData?: ProposalFormData; section?: ProposalSection }
    if (!body.formData) {
      return NextResponse.json({ error: 'formData is required.' }, { status: 400 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
        responseMimeType: 'application/json'
      }
    })

    const prompt = body.section
      ? buildSectionPrompt(body.formData, body.section.title, body.section.content)
      : buildProposalPrompt(body.formData)

    const result = await model.generateContent(prompt)
    const parsed = parseJsonResponse(result.response.text())
    const proposal = normalizeProposal(parsed, body.formData)

    return NextResponse.json({ proposal })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected generation error.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
