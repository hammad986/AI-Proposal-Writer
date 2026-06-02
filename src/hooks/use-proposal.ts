'use client'

import { useMemo } from 'react'
import { useProposalStore } from '@/lib/store'
import { currencyToNumber, formatCurrencyINR } from '@/lib/utils'

export function useProposalDashboard() {
  const proposals = useProposalStore((state) => state.proposals)
  const hasHydrated = useProposalStore((state) => state.hasHydrated)

  const stats = useMemo(() => {
    const totalValue = proposals.reduce((sum, item) => sum + currencyToNumber(item.totalValue), 0)
    const accepted = proposals.filter((item) => item.status === 'accepted')
    const pending = proposals.filter((item) => item.status === 'sent' || item.status === 'draft')
    return {
      totalCount: proposals.length,
      totalValue: formatCurrencyINR(totalValue),
      acceptedCount: accepted.length,
      acceptedValue: formatCurrencyINR(accepted.reduce((sum, item) => sum + currencyToNumber(item.totalValue), 0)),
      pendingCount: pending.length
    }
  }, [proposals])

  return { proposals, stats, hasHydrated }
}
