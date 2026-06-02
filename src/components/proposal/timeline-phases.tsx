import { parsePhases } from '@/lib/rendering'

export function TimelinePhases({ content }: { content: string }) {
  const phases = parsePhases(content)
  if (!phases.length) return null

  return (
    <div className="space-y-3">
      {phases.map((phase) => (
        <div key={`${phase.number}-${phase.name}`} className="rounded-lg border bg-background p-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
              {phase.number}
            </span>
            <h3 className="font-semibold">{phase.name}</h3>
            {phase.duration && <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">{phase.duration}</span>}
          </div>
          {phase.tasks.length > 0 && (
            <ul className="mt-3 list-disc space-y-1 pl-12 text-sm text-muted-foreground">
              {phase.tasks.map((task) => (
                <li key={task}>{task}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}
