// src/app/layout.tsx
import type { Metadata } from 'next'
import { barlowCondensed, inter } from '@/lib/fonts'
import Providers from './providers'
import Navbar from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Rockfield — Built for the Road',
    template: '%s | Rockfield',
  },
  description:
    'Rockfield — Sneakers, boots, and everyday footwear built for the road. ' +
    'Shop men, women, and kids shoes with fast delivery across India.',
  keywords: ['shoes', 'sneakers', 'boots', 'footwear', 'Rockfield', 'India'],
  metadataBase: new URL('https://rockfieldshoes.in'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://rockfieldshoes.in',
    siteName: 'Rockfield',
    title: 'Rockfield — Built for the Road',
    description: 'Sneakers, boots, and everyday footwear built for the road.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Rockfield — Footwear',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${barlowCondensed.variable} ${inter.variable}`}>
      <body className="antialiased min-h-screen">
        <Providers>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
