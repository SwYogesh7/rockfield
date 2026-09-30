// src/lib/fonts.ts
import { Barlow_Condensed, Inter } from 'next/font/google'

/** Barlow Condensed — bold condensed display font for headings and brand name */
export const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display',
})

/** Inter — clean geometric sans for body text, nav, labels, prices */
export const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-body',
})
