import { Field, Input, Label, Select, Textarea } from '@/components/ui/field'
import type { FormStep1 } from '@/lib/types'

export function FormStep1View({
  data,
  errors,
  onChange
}: {
  data: FormStep1
  errors: Record<string, string>
  onChange: (patch: Partial<FormStep1>) => void
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field>
          <Label>Agency name *</Label>
          <Input value={data.agencyName} onChange={(event) => onChange({ agencyName: event.target.value })} />
          {errors.agencyName && <p className="text-xs text-red-600">{errors.agencyName}</p>}
        </Field>
        <Field>
          <Label>Agency tagline</Label>
          <Input value={data.agencyTagline} onChange={(event) => onChange({ agencyTagline: event.target.value })} />
        </Field>
        <Field>
          <Label>Agency email</Label>
          <Input type="email" value={data.agencyEmail} onChange={(event) => onChange({ agencyEmail: event.target.value })} />
        </Field>
        <Field>
          <Label>Agency website</Label>
          <Input value={data.agencyWebsite} onChange={(event) => onChange({ agencyWebsite: event.target.value })} />
        </Field>
      </div>

      <div className="border-t pt-5">
        <h2 className="text-sm font-semibold">Client Information</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field>
          <Label>Client name *</Label>
          <Input value={data.clientName} onChange={(event) => onChange({ clientName: event.target.value })} />
          {errors.clientName && <p className="text-xs text-red-600">{errors.clientName}</p>}
        </Field>
        <Field>
          <Label>Client company</Label>
          <Input value={data.clientCompany} onChange={(event) => onChange({ clientCompany: event.target.value })} />
        </Field>
        <Field>
          <Label>Project name *</Label>
          <Input value={data.projectName} onChange={(event) => onChange({ projectName: event.target.value })} />
          {errors.projectName && <p className="text-xs text-red-600">{errors.projectName}</p>}
        </Field>
        <Field>
          <Label>Project type</Label>
          <Select value={data.projectType} onChange={(event) => onChange({ projectType: event.target.value as FormStep1['projectType'] })}>
            {['Web Development', 'AI/ML System', 'Mobile App', 'Automation', 'Full-Stack App', 'Custom Software'].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </Field>
      </div>

      <Field>
        <Label>Industry</Label>
        <Select value={data.industry} onChange={(event) => onChange({ industry: event.target.value as FormStep1['industry'] })}>
          {['E-commerce', 'Healthcare', 'Education', 'Fintech', 'SaaS', 'Real Estate', 'Other'].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>
      </Field>
      <Field>
        <Label>Problem statement *</Label>
        <Textarea
          value={data.problemStatement}
          onChange={(event) => onChange({ problemStatement: event.target.value })}
          placeholder="Describe the business problem this project will solve..."
        />
        {errors.problemStatement && <p className="text-xs text-red-600">{errors.problemStatement}</p>}
      </Field>
    </div>
  )
}
