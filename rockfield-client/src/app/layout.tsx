// src/app/layout.tsx
import type { Metadata } from 'next'
import { env } from '@/config/env'
import { cormorantGaramond, jost } from '@/lib/fonts'
import Providers from './providers'
import Navbar from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Rockfield — Crafted for the Long Walk',
    template: '%s | Rockfield',
  },
  description:
    'Rockfield — Crafted for the long walk. Sneakers, boots, and everyday footwear ' +
    'for men, women, and kids. Free delivery across India.',
  keywords: ['shoes', 'sneakers', 'boots', 'footwear', 'Rockfield', 'India'],
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Rockfield',
    title: 'Rockfield — Crafted for the Long Walk',
    description: 'Crafted for the long walk. Premium footwear for every road.',
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
    <html lang="en" className={`${cormorantGaramond.variable} ${jost.variable}`} data-scroll-behavior="smooth">
      <body className="antialiased min-h-screen">
        <Providers>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
          {/* Global cart drawer — opened via useCartStore().openCart() from anywhere */}
          <CartDrawer />
        </Providers>
      </body>
    </html>
  )
}
