"use client"

// Sonner toast — Rockfield themed.
// Uses hardcoded CSS vars rather than next-themes (no dark mode at launch).
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="bottom-right"
      icons={{
        success: <CircleCheckIcon className="size-4 text-success" />,
        info: <InfoIcon className="size-4 text-dark-400" />,
        warning: <TriangleAlertIcon className="size-4 text-warning" />,
        error: <OctagonXIcon className="size-4 text-error" />,
        loading: <Loader2Icon className="size-4 animate-spin text-dark-400" />,
      }}
      style={
        {
          // Rockfield toast surface — warm ivory, dark text, warm shadow
          "--normal-bg": "var(--color-ivory-50)",
          "--normal-text": "var(--color-dark-900)",
          "--normal-border": "var(--color-ivory-300)",
          "--success-bg": "var(--color-success-bg)",
          "--success-text": "var(--color-success)",
          "--success-border": "var(--color-success-bg)",
          "--error-bg": "var(--color-error-bg)",
          "--error-text": "var(--color-error)",
          "--error-border": "var(--color-error-bg)",
          "--warning-bg": "var(--color-warning-bg)",
          "--warning-text": "var(--color-warning)",
          "--border-radius": "var(--radius-sm)",
          "--font-family": "var(--font-body)",
          "--font-size": "0.8125rem",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
