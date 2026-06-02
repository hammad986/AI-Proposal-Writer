'use client'

import { useEffect, useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const messages = [
  'Analyzing project requirements...',
  'Crafting executive summary...',
  'Defining scope of work...',
  'Building project timeline...',
  'Calculating investment breakdown...',
  'Finalizing proposal...'
]

export function GeneratingView({
  error,
  onRetry
}: {
  error?: string | null
  onRetry: () => void
}) {
  const [visibleSteps, setVisibleSteps] = useState(1)
  const [progress, setProgress] = useState(4)

  useEffect(() => {
    const stepTimer = window.setInterval(() => setVisibleSteps((value) => Math.min(messages.length, value + 1)), 2500)
    const progressTimer = window.setInterval(() => setProgress((value) => Math.min(95, value + 5)), 900)
    return () => {
      window.clearInterval(stepTimer)
      window.clearInterval(progressTimer)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        {!error ? (
          <>
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
            <h1 className="mt-6 text-lg font-medium">Generating your proposal...</h1>
            <div className="mt-6 overflow-hidden rounded-full bg-muted">
              <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-6 space-y-3 text-left">
              {messages.slice(0, visibleSteps).map((message) => (
                <div key={message} className="flex items-center gap-3 rounded-md border bg-card px-4 py-3 text-sm">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>{message}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm text-muted-foreground">This usually takes 15-20 seconds</p>
          </>
        ) : (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-left dark:border-red-900 dark:bg-red-950/30">
            <h1 className="text-lg font-semibold text-red-700 dark:text-red-200">Generation failed</h1>
            <p className="mt-2 text-sm text-red-700 dark:text-red-200">{error}</p>
            <Button className="mt-5" variant="outline" onClick={onRetry}>
              Try again
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
