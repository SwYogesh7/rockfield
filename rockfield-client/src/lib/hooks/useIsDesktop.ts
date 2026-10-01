'use client'

import { useState, useEffect } from 'react'

// Named export — imported as { useIsDesktop }
export function useIsDesktop(breakpoint = 1024) {
  // Always false on server — matches SSR output, prevents hydration mismatch.
  // useEffect runs only after hydration, so the first client render matches server.
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= breakpoint)
    check() // Set correct value after hydration
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [breakpoint])

  return isDesktop
}
