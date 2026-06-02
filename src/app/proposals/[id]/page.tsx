'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProposalViewer } from '@/components/proposal/proposal-viewer'
import { useProposalStore } from '@/lib/store'

export default function ProposalDetailPage({ params }: { params: { id: string } }) {
  const proposal = useProposalStore((state) => state.proposals.find((item) => item.id === params.id))
  const hasHydrated = useProposalStore((state) => state.hasHydrated)

  if (!hasHydrated) {
    return <div className="min-h-screen animate-pulse bg-muted" />
  }

  if (!proposal) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold">Proposal not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">It may have been deleted from local storage.</p>
          <Button className="mt-5" asChild>
            <Link href="/proposals">Back to proposals</Link>
          </Button>
        </div>
      </div>
    )
  }

  return <ProposalViewer proposal={proposal} />
}
