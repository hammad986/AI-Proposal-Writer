import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Topbar({ title = 'Proposals' }: { title?: string }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:px-8">
      <div>
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <Button asChild>
        <Link href="/proposals/new">
          <Sparkles className="h-4 w-4" />
          New Proposal
        </Link>
      </Button>
    </header>
  )
}
