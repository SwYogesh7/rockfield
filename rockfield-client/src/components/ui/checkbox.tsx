"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { CheckIcon } from "lucide-react"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Layout — square, 16px, sharp corners for luxury feel
        "peer relative flex size-4 shrink-0 items-center justify-center",
        "rounded-[var(--radius-sm)] border border-dark-200",
        // Transitions
        "transition-[border-color,background-color,box-shadow] duration-200 ease-out outline-none",
        // Focus — gold ring
        "focus-visible:border-gold-500 focus-visible:ring-2 focus-visible:ring-gold-500/30",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-40",
        // Invalid
        "aria-invalid:border-error aria-invalid:ring-2 aria-invalid:ring-error/20",
        // Checked — dark fill + ivory icon
        "data-[state=checked]:border-dark-900 data-[state=checked]:bg-dark-900 data-[state=checked]:text-ivory-100",
        // Hover (unchecked only)
        "hover:border-dark-700",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon className="size-3" strokeWidth={2.5} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
