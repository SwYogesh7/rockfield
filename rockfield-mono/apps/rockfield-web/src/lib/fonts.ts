// src/lib/fonts.ts
import localFont from 'next/font/local'

/** Cormorant Garamond — elegant serif for display headings and brand wordmark */
export const cormorantGaramond = localFont({
  src: [
    { path: '../fonts/CormorantGaramond-latin.woff2', weight: '300 600', style: 'normal' },
    { path: '../fonts/CormorantGaramond-latin-italic.woff2', weight: '300 600', style: 'italic' },
  ],
  display: 'swap',
  variable: '--font-display',
})

/** Jost — geometric sans-serif for body text, nav, labels, buttons, prices */
export const jost = localFont({
  src: [{ path: '../fonts/Jost-latin.woff2', weight: '300 700', style: 'normal' }],
  display: 'swap',
  variable: '--font-body',
})
