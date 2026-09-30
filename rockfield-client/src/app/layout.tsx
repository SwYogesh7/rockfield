// src/app/layout.tsx
import type { Metadata } from 'next'
import { cormorant, jost } from '@/lib/fonts'
import Providers from './providers'
import Navbar from '@/components/layout/Navbar'
import './globals.css'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: {
    default: 'AURUM — Luxury Clothing Brand',
    template: '%s | AURUM',
  },
  description:
    'Discover AURUM — heritage textiles and contemporary luxury. ' +
    'Ethically sourced, thoughtfully designed clothing for the modern wardrobe.',
  keywords: ['luxury clothing', 'heritage textiles', 'Indian fashion', 'AURUM'],
  metadataBase: new URL('https://aurumclothing.in'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://aurumclothing.in',
    siteName: 'AURUM',
    title: 'AURUM — Luxury Clothing Brand',
    description: 'Heritage textiles, contemporary luxury.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AURUM — Luxury Clothing',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="antialiased min-h-screen">
        <Providers>
          <Navbar />
          <main id="main-content">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}