import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CheckboxPill({
  label,
  checked,
  onChange
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        'flex min-h-11 items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition hover:border-primary',
        checked && 'border-primary bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200'
      )}
    >
      <span>{label}</span>
      {checked && <Check className="h-4 w-4" />}
    </button>
  )
}

export function OptionCard({
  title,
  description,
  active,
  onClick
}: {
  title: string
  description: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-lg border p-4 text-left transition hover:border-primary',
        active && 'border-primary bg-indigo-50 dark:bg-indigo-950'
      )}
    >
      <span className="block text-sm font-semibold">{title}</span>
      <span className="mt-1 block text-xs leading-5 text-muted-foreground">{description}</span>
    </button>
  )
}
