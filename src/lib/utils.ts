import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function currencyToNumber(value: string) {
  const normalized = value.replace(/[^\d]/g, '')
  return Number(normalized || 0)
}

export function formatCurrencyINR(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value)
}

export function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function isoDate(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

export function uid(prefix = 'proposal') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}
