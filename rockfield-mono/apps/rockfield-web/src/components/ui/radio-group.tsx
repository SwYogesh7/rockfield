"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid w-full gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        // Layout — circle, 16px
        "peer relative flex aspect-square size-4 shrink-0 rounded-full border border-dark-200",
        // Transitions
        "transition-[border-color,background-color,box-shadow] duration-200 ease-out outline-none",
        // Focus — gold ring
        "focus-visible:border-gold-500 focus-visible:ring-2 focus-visible:ring-gold-500/30",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-40",
        // Checked — dark fill
        "data-[state=checked]:border-dark-900 data-[state=checked]:bg-dark-900",
        // Hover (unchecked)
        "hover:border-dark-700",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex size-4 items-center justify-center"
      >
        {/* Ivory dot inside dark circle */}
        <span className="absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ivory-100" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
