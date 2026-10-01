// src/components/ui/button.tsx
// Rockfield button variants built on top of the shadcn cva base.
//
// Variant usage guide:
//   primary   → dark fill + ivory text. Gold on hover. Main CTA. (default)
//   secondary → 1px dark outline, transparent bg. Secondary actions.
//   ghost     → No border, subtle ivory hover. Nav / icon triggers.
//   gold      → Gold fill + dark text. Use SPARINGLY — promo, sale badges only.
//   link      → Underline style. Inline text links.
//   destructive → Warm red. Destructive confirm actions only.
//
// Size guide:
//   sm  → 32px tall — inline / compact UI
//   md  → 40px tall — default
//   lg  → 48px tall — hero / primary CTA
//   icon → 40×40 square — icon-only buttons

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // ── BASE ─────────────────────────────────────────────────────
  // Shared across all variants. No colours here — variants own those.
  [
    'inline-flex shrink-0 items-center justify-center gap-2',
    'font-body font-medium whitespace-nowrap select-none',
    'text-[0.6875rem] tracking-[0.2em] uppercase', // type-label
    'border transition-all',
    'outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-40',
    'active:translate-y-px',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-3.5',
  ],
  {
    variants: {
      variant: {
        // ── PRIMARY — the main CTA
        // Dark fill, ivory text. Hover shifts fill to gold.
        primary: [
          'bg-dark-900 text-ivory-100 border-dark-900',
          'hover:bg-gold-500 hover:border-gold-500',
          'duration-[250ms] ease-out',
        ],

        // ── SECONDARY — less prominent actions
        // 1px dark outline, transparent bg. Hover fills with ivory-200.
        secondary: [
          'bg-transparent text-dark-900 border-dark-800',
          'hover:bg-ivory-200 hover:border-dark-900',
          'duration-[200ms] ease-out',
        ],

        // ── GHOST — minimal, used in nav / overlays
        // No border visible at rest. Subtle ivory hover.
        ghost: [
          'bg-transparent text-dark-700 border-transparent',
          'hover:bg-ivory-200 hover:text-dark-900',
          'duration-[200ms] ease-out',
        ],

        // ── GOLD — gold fill + dark text.
        // Use sparingly: promo banners, sale badges, special CTAs.
        // Never on a gold background — only on ivory or dark.
        gold: [
          'bg-gold-500 text-dark-900 border-gold-500',
          'hover:bg-gold-600 hover:border-gold-600',
          'duration-[250ms] ease-out',
        ],

        // ── LINK — inline text link style
        link: [
          'bg-transparent border-transparent text-[--color-gold-text]',
          'underline underline-offset-4 hover:opacity-70',
          'tracking-normal uppercase-none font-normal text-sm',
          'duration-[150ms]',
        ],

        // ── DESTRUCTIVE — warm red for dangerous actions
        destructive: [
          'bg-error/10 text-error border-error/20',
          'hover:bg-error/20',
          'duration-[200ms] ease-out',
        ],
      },

      size: {
        sm: 'h-8 px-3 rounded-[var(--radius-sm)]',
        md: 'h-10 px-5 rounded-[var(--radius-sm)]',
        lg: 'h-12 px-7 rounded-[var(--radius-sm)]',
        icon: 'size-10 rounded-[var(--radius-sm)]',
        'icon-sm': 'size-8 rounded-[var(--radius-sm)]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>
export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>

function Button({
  className,
  variant = 'primary',
  size = 'md',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
