// src/components/ui/input.tsx
// Rockfield input — warm ivory bg, gold focus ring, 1px dark border.
// Compatible with React Hook Form + aria-invalid error states.
import * as React from 'react'
import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Layout
        'h-10 w-full min-w-0 px-3 py-2',
        // Typography — Jost body, never display font in form fields
        'font-body text-sm text-dark-900 placeholder:text-dark-200',
        // Surface
        'rounded-[var(--radius-sm)] border border-dark-200 bg-ivory-50',
        // Transition
        'transition-[border-color,box-shadow] duration-200 ease-out',
        // Focus — gold ring matching global :focus-visible
        'outline-none focus-visible:border-gold-500 focus-visible:ring-2 focus-visible:ring-gold-500/30',
        // Disabled
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40',
        // Error state (react-hook-form sets aria-invalid)
        'aria-invalid:border-error aria-invalid:ring-2 aria-invalid:ring-error/20',
        className
      )}
      {...props}
    />
  )
}

export { Input }
