// src/app/page.tsx
// No 'use client' — this is a Server Component (ISR)
// LenisProvider wraps homepage content only — not the root layout.

import Hero from '@/components/layout/Hero'
import Marquee from '@/components/layout/Marquee'
import NewArrivals from '@/components/sections/NewArrivals'
import PromoBanner from '@/components/sections/PromoBanner'
import { LenisProvider } from '@/components/layout/LenisProvider'

export default function HomePage() {
  return (
    <LenisProvider>
      <Hero />
      <Marquee />
      <NewArrivals />
      <PromoBanner />
    </LenisProvider>
  )
}
