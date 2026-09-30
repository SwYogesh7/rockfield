'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export default function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Create Lenis instance with luxury scroll settings
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    // RAF loop — updates scroll 60 times per second
    let rafId: number

    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    // Cleanup — runs when component unmounts
    // Stops the loop and destroys the Lenis instance
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}