// src/lib/fonts.ts

// next/font/google downloads these fonts at BUILD TIME
// They are self-hosted with your app — zero Google requests at runtime
import { Cormorant_Garamond, Jost } from 'next/font/google'

// ─────────────────────────────────────────────────────────────
// CORMORANT GARAMOND — Our display/heading font
//
// "subsets" — which character sets to include.
//   'latin' covers English + most European languages.
//   Don't include 'devanagari' unless you need Hindi — 
//   it adds unnecessary file size.
//
// "weight" — which font weights to load.
//   Cormorant looks best at 300 (light) and 400 (regular).
//   We also load 600 for bold headings when needed.
//   Don't load ALL weights — each weight is a separate file download.
//
// "style" — 'italic' is important for Cormorant because
//   we use italic text for the gold accent words like "Morning" in
//   "Draped in Morning Light"
//
// "display: 'swap'" — if font hasn't loaded yet,
//   show text in fallback font immediately (no invisible text).
//   Once font loads, swap it in. Better UX than hiding text.
//
// "variable" — creates a CSS custom property name.
//   We can then use --font-display in CSS and Tailwind.
// ─────────────────────────────────────────────────────────────
export const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display',  // matches what we set in globals.css
})

// ─────────────────────────────────────────────────────────────
// JOST — Our body/UI font
//
// Jost is a geometric sans-serif — clean, modern, readable.
// Used for: navbar, buttons, body text, labels, prices.
//
// We load more weights here because UI elements need more
// variation — light nav links, medium prices, bold CTAs.
// ─────────────────────────────────────────────────────────────
export const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal'],
  display: 'swap',
  variable: '--font-body',  // matches what we set in globals.css
})