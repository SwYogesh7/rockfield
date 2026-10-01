// src/lib/fonts.ts
import { Cormorant_Garamond, Jost } from 'next/font/google'

/** Cormorant Garamond — elegant serif for display headings and brand wordmark */
export const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display',
})

/** Jost — geometric sans-serif for body text, nav, labels, buttons, prices */
export const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-body',
})
