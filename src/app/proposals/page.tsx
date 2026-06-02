'use client'

import Link from 'next/link'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { Download, Eye, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/status-badge'
import { useProposalDashboard } from '@/hooks/use-proposal'
import { useProposalStore } from '@/lib/store'

const metricClass = 'rounded-lg border bg-card p-5'

export default function ProposalsPage() {
  const { proposals, stats, hasHydrated } = useProposalDashboard()
  const deleteProposal = useProposalStore((state) => state.deleteProposal)

  return (
    <AppShell title="Proposals">
      {!hasHydrated ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-28 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
          <div className="h-80 animate-pulse rounded-lg bg-muted" />
        </div>
      ) : (
        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-4">
            <div className={metricClass}>
              <p className="text-sm text-muted-foreground">Total Proposals</p>
              <p className="mt-3 text-3xl font-semibold">{stats.totalCount}</p>
            </div>
            <div className={metricClass}>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="mt-3 text-3xl font-semibold">{stats.totalValue}</p>
            </div>
            <div className={metricClass}>
              <p className="text-sm text-muted-foreground">Accepted</p>
              <p className="mt-3 text-3xl font-semibold text-emerald-600">{stats.acceptedCount}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stats.acceptedValue}</p>
            </div>
            <div className={metricClass}>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="mt-3 text-3xl font-semibold text-amber-600">{stats.pendingCount}</p>
              <p className="mt-1 text-sm text-muted-foreground">Sent and draft proposals</p>
            </div>
          </section>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-sm">
                  <thead className="border-b bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-5 py-3">Project</th>
                      <th className="px-5 py-3">Client</th>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Budget</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proposals.map((proposal) => (
                      <tr key={proposal.id} className="border-b transition hover:bg-muted/40">
                        <td className="px-5 py-4">
                          <Link href={`/proposals/${proposal.id}`} className="font-medium hover:text-primary">
                            {proposal.title}
                          </Link>
                        </td>
                        <td className="px-5 py-4 text-muted-foreground">{proposal.formData.step1.clientCompany}</td>
                        <td className="px-5 py-4 text-muted-foreground">{proposal.createdAt.slice(0, 10)}</td>
                        <td className="px-5 py-4 font-medium">{proposal.totalValue}</td>
                        <td className="px-5 py-4">
                          <StatusBadge status={proposal.status} />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <Button asChild size="icon" variant="ghost" title="View proposal">
                              <Link href={`/proposals/${proposal.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              title="Download PDF"
                              onClick={() => toast.info('Open the proposal to download its PDF.')}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <AlertDialog.Root>
                              <AlertDialog.Trigger asChild>
                                <Button size="icon" variant="ghost" title="Delete proposal">
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </AlertDialog.Trigger>
                              <AlertDialog.Portal>
                                <AlertDialog.Overlay className="fixed inset-0 z-40 bg-black/40" />
                                <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-card p-6 shadow-xl">
                                  <AlertDialog.Title className="text-lg font-semibold">Delete proposal?</AlertDialog.Title>
                                  <AlertDialog.Description className="mt-2 text-sm text-muted-foreground">
                                    This removes the proposal from your local workspace.
                                  </AlertDialog.Description>
                                  <div className="mt-6 flex justify-end gap-2">
                                    <AlertDialog.Cancel asChild>
                                      <Button variant="outline">Cancel</Button>
                                    </AlertDialog.Cancel>
                                    <AlertDialog.Action asChild>
                                      <Button
                                        variant="danger"
                                        onClick={() => {
                                          deleteProposal(proposal.id)
                                          toast.success('Proposal deleted')
                                        }}
                                      >
                                        Delete
                                      </Button>
                                    </AlertDialog.Action>
                                  </div>
                                </AlertDialog.Content>
                              </AlertDialog.Portal>
                            </AlertDialog.Root>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AppShell>
  )
}
