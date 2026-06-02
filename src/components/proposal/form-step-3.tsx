import { Field, Input, Label, Select } from '@/components/ui/field'
import { additionalServices } from '@/lib/defaults'
import type { FormStep3 } from '@/lib/types'
import { CheckboxPill, OptionCard } from './form-controls'

const complexities: Array<{ id: FormStep3['complexity']; title: string; description: string }> = [
  { id: 'simple', title: 'Simple', description: '1-2 weeks · Basic features · Single developer' },
  { id: 'standard', title: 'Standard', description: '3-6 weeks · Multiple features · Small team' },
  { id: 'complex', title: 'Complex', description: '2-3 months · Full-featured · Team of 3-4' },
  { id: 'enterprise', title: 'Enterprise', description: '3+ months · Large scale · Full agency team' }
]

const milestones: Array<{ id: FormStep3['paymentMilestone']; title: string; description: string }> = [
  { id: '50-50', title: '50-50', description: '50% advance + 50% on delivery' },
  { id: '40-30-30', title: '40-30-30', description: '40% advance + 30% midpoint + 30% delivery' },
  { id: '30-40-30', title: '30-40-30', description: '30% advance + 40% testing phase + 30% delivery' }
]

export function FormStep3View({
  data,
  onChange
}: {
  data: FormStep3
  onChange: (patch: Partial<FormStep3>) => void
}) {
  const toggle = (item: string) => {
    onChange({
      additionalServices: data.additionalServices.includes(item)
        ? data.additionalServices.filter((value) => value !== item)
        : [...data.additionalServices, item]
    })
  }

  return (
    <div className="space-y-6">
      <Field>
        <Label>Project complexity</Label>
        <div className="grid gap-3 md:grid-cols-2">
          {complexities.map((item) => (
            <OptionCard
              key={item.id}
              title={item.title}
              description={item.description}
              active={data.complexity === item.id}
              onClick={() => onChange({ complexity: item.id })}
            />
          ))}
        </div>
      </Field>
      <Field>
        <Label>Budget range</Label>
        <Select value={data.budgetRange} onChange={(event) => onChange({ budgetRange: event.target.value })}>
          {[
            '₹10,000 – ₹25,000',
            '₹25,000 – ₹75,000',
            '₹75,000 – ₹2,00,000',
            '₹2,00,000 – ₹5,00,000',
            '₹5,00,000+',
            'Custom / TBD'
          ].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>
      </Field>
      <div className="grid gap-5 md:grid-cols-2">
        <Field>
          <Label>Advance payment: {data.advancePercent}%</Label>
          <input
            className="w-full accent-indigo-500"
            type="range"
            min={30}
            max={50}
            step={10}
            value={data.advancePercent}
            onChange={(event) => onChange({ advancePercent: Number(event.target.value) })}
          />
        </Field>
        <Field>
          <Label>Revisions</Label>
          <Input
            type="number"
            min={0}
            value={data.revisions}
            onChange={(event) => onChange({ revisions: Number(event.target.value) })}
          />
        </Field>
      </div>
      <Field>
        <Label>Warranty period</Label>
        <Select value={data.warrantyPeriod} onChange={(event) => onChange({ warrantyPeriod: event.target.value })}>
          {['1 Month', '3 Months', '6 Months', '1 Year'].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>
      </Field>
      <Field>
        <Label>Additional services</Label>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {additionalServices.map((item) => (
            <CheckboxPill key={item} label={item} checked={data.additionalServices.includes(item)} onChange={() => toggle(item)} />
          ))}
        </div>
      </Field>
      <Field>
        <Label>Payment milestone</Label>
        <div className="grid gap-3 md:grid-cols-3">
          {milestones.map((item) => (
            <OptionCard
              key={item.id}
              title={item.title}
              description={item.description}
              active={data.paymentMilestone === item.id}
              onClick={() => onChange({ paymentMilestone: item.id })}
            />
          ))}
        </div>
      </Field>
    </div>
  )
}
