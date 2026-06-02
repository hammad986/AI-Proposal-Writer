'use client'

import Link from 'next/link'
import { FileText, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Sidebar() {
  return (
    <aside className="hidden h-screen w-64 shrink-0 border-r bg-card px-4 py-5 lg:block">
      <Link href="/proposals" className="flex items-center gap-3 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-white">
          <Sparkles className="h-5 w-5" />
        </span>
        <span>
          <span className="block text-sm font-semibold">AI Proposal Writer</span>
          <span className="block text-xs text-muted-foreground">Powered by Aetherion Labs</span>
        </span>
      </Link>
      <nav className="mt-8">
        <Link
          href="/proposals"
          className={cn(
            'flex items-center gap-3 rounded-md bg-muted px-3 py-2 text-sm font-medium text-foreground'
          )}
        >
          <FileText className="h-4 w-4" />
          Proposals
        </Link>
      </nav>
    </aside>
  )
}
