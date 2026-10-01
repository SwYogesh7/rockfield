import * as React from "react"
import { cn } from "@/lib/utils"

export type LogoProps = React.HTMLAttributes<HTMLSpanElement>

export function Logo({ className, ...props }: LogoProps) {
  return (
    <span
      className={cn(
        "font-display font-medium tracking-[0.35em] text-dark-900 uppercase",
        className
      )}
      {...props}
    >
      ROCKFIELD
    </span>
  )
}
