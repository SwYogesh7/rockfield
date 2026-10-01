"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Tabs as TabsPrimitive } from "radix-ui"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-0", className)}
      {...props}
    />
  )
}

// "line" variant — editorial underline style (default for Rockfield)
// "pill" variant — filled pill background (for compact UI)
const tabsListVariants = cva(
  "inline-flex items-center gap-0 border-b border-ivory-300",
  {
    variants: {
      variant: {
        line: "bg-transparent",
        pill: "rounded-[var(--radius-md)] bg-ivory-200 p-1 border-0",
      },
    },
    defaultVariants: { variant: "line" },
  }
)

function TabsList({
  className,
  variant = "line",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // Layout
        "relative inline-flex items-center justify-center px-4 py-2.5",
        // Typography — label style
        "font-body text-[0.6875rem] font-500 tracking-[0.15em] uppercase",
        // Default state
        "text-dark-400 transition-colors duration-200 ease-out outline-none",
        // Hover
        "hover:text-dark-800",
        // Focus
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50 focus-visible:ring-offset-2",
        // Active — dark text + gold underline
        "data-[state=active]:text-dark-900",
        "data-[state=active]:after:absolute data-[state=active]:after:bottom-[-1px] data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-[2px] data-[state=active]:after:bg-gold-500 data-[state=active]:after:rounded-t-sm",
        // Pill variant overrides
        "group-data-[variant=pill]/tabs-list:rounded-[var(--radius-sm)] group-data-[variant=pill]/tabs-list:data-[state=active]:bg-ivory-50 group-data-[variant=pill]/tabs-list:data-[state=active]:shadow-sm group-data-[variant=pill]/tabs-list:after:hidden",
        // Disabled
        "disabled:pointer-events-none disabled:opacity-40",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 pt-5 outline-none font-body text-sm text-dark-700", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
