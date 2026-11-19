// src/components/layout/LenisProvider.tsx
// Lenis smooth scroll — homepage ONLY.
// Import this component only in the homepage route, never in the root layout.
// Respects prefers-reduced-motion: if the user prefers reduced motion,
// Lenis is not initialised and native scroll is used instead.
'use client'

import { useEffect, useRef } from 'react'

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<unknown>(null)

  useEffect(() => {
    // Skip if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    let animationFrameId: number

    async function initLenis() {
      const { default: Lenis } = await import('lenis')

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 2,
        infinite: false,
      })

      lenisRef.current = lenis

      function raf(time: number) {
        lenis.raf(time)
        animationFrameId = requestAnimationFrame(raf)
      }

      animationFrameId = requestAnimationFrame(raf)
    }

    initLenis()

    return () => {
      cancelAnimationFrame(animationFrameId)
      if (lenisRef.current) {
        ;(lenisRef.current as { destroy: () => void }).destroy()
        lenisRef.current = null
      }
    }
  }, [])

  return <>{children}</>
}
