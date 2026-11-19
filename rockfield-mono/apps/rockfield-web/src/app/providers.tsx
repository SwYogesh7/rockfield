// src/app/providers.tsx
'use client'
// Root client providers.
// Lenis is NOT here — it lives in LenisProvider and is used on the homepage only.
// See src/components/layout/LenisProvider.tsx

import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      {children}
      <Toaster />
    </TooltipProvider>
  )
}
