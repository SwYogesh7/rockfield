// src/app/page.tsx
// No 'use client' — this is a Server Component (ISR)
// It renders on the server and is cached at the edge

import Hero from '@/components/layout/Hero'
import Marquee from '@/components/layout/Marquee'
import NewArrivals from '@/components/sections/NewArrivals'
import PromoBanner from '@/components/sections/PromoBanner'

export default function HomePage() {
  return (
    // pt-0 because Hero handles its own top padding for the navbar
    <div>
      <Hero />
      <Marquee />
      <NewArrivals />
      <PromoBanner />
      {/* We add more sections here in the next steps:
          - Marquee ticker
          - Featured products
          - Promotional banner
      */}
    </div>
  )
}
