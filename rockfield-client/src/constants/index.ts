// src/constants/index.ts
// App-wide constants. Import from here, never hardcode these values.

export const SITE_NAME = 'Rockfield'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rockfieldshoes.in'
export const SITE_DESCRIPTION =
  'Rockfield — Built for the road. Sneakers, boots, and everyday footwear for men, women, and kids.'

/** Paise per rupee */
export const PAISE_PER_RUPEE = 100

/** Format paise as ₹ display string (e.g. 349900 → "₹3,499") */
export function formatPrice(paise: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(paise / PAISE_PER_RUPEE)
}

/** Discount percentage rounded to nearest integer */
export function discountPercent(base: number, compare: number): number {
  if (compare <= base) return 0
  return Math.round(((compare - base) / compare) * 100)
}

export const PRICE_MIN_PAISE = 0
export const PRICE_MAX_PAISE = 2_500_000 // ₹25,000

export const PLACEHOLDER_IMAGE = '/images/placeholder-shoe.jpg'

export const NAV_HEIGHT_PX = 64 // 4rem mobile
export const NAV_HEIGHT_DESKTOP_PX = 80 // 5rem desktop
