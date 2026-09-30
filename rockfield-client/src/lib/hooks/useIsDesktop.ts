'use client'

import { useState, useEffect } from 'react'

// Named export — imported as { useIsDesktop }
// Convention: hooks are always named exports, not default exports
export function useIsDesktop(breakpoint = 1024) {
  const [isDesktop, setIsDesktop] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const check = () => setIsDesktop(window.innerWidth >= breakpoint)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [breakpoint])

  return mounted ? isDesktop : false
}
