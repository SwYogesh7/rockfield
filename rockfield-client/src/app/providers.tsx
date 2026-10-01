// src/app/providers.tsx
'use client'
// Root providers — add global client-side providers here.
// Lenis is NOT here; it lives in LenisProvider and is used on the homepage only.
// See src/components/layout/LenisProvider.tsx

export default function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
