import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'icon'
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  asChild,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variant === 'primary' && 'bg-primary text-primary-foreground hover:bg-indigo-500',
        variant === 'secondary' && 'bg-muted text-foreground hover:bg-slate-200 dark:hover:bg-slate-700',
        variant === 'ghost' && 'text-muted-foreground hover:bg-muted hover:text-foreground',
        variant === 'danger' && 'bg-red-600 text-white hover:bg-red-500',
        variant === 'outline' && 'border bg-background text-foreground hover:bg-muted',
        size === 'md' && 'h-10 px-4',
        size === 'sm' && 'h-8 px-3 text-xs',
        size === 'icon' && 'h-9 w-9 p-0',
        className
      )}
      {...props}
    />
  )
}
