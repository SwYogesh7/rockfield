// src/lib/coupons.ts
// Mock coupon catalogue + validation. Amounts are integer paise, same as the cart store.
//
// This is a client-side stand-in until the API exposes a /coupons/validate endpoint. The store
// only knows "code + absolute discount" (see applyCoupon), so the percentage → paise conversion
// lives here and is re-run whenever the subtotal changes (see useSyncCouponDiscount).

export interface Coupon {
  code: string
  /** `percent` = value is 0-100, `fixed` = value is paise */
  type: 'percent' | 'fixed'
  value: number
  /** Short human-readable label, e.g. "10% off" */
  label: string
}

export const MOCK_COUPONS: readonly Coupon[] = [
  { code: 'ROCK10', type: 'percent', value: 10, label: '10% off' },
]

export type CouponValidation =
  { ok: true; coupon: Coupon; discount: number } | { ok: false; error: string }

/** Coupon codes are case-insensitive; we always store/display them upper-cased. */
export function normalizeCouponCode(code: string): string {
  return code.trim().toUpperCase()
}

export function findCoupon(code: string): Coupon | undefined {
  const normalized = normalizeCouponCode(code)
  return MOCK_COUPONS.find((c) => c.code === normalized)
}

/** Discount in paise for a coupon against a subtotal. Never exceeds the subtotal. */
export function calculateDiscount(coupon: Coupon, subtotal: number): number {
  if (subtotal <= 0) return 0
  const raw = coupon.type === 'percent' ? Math.round((subtotal * coupon.value) / 100) : coupon.value
  return Math.min(Math.max(0, raw), subtotal)
}

export function validateCoupon(code: string, subtotal: number): CouponValidation {
  const normalized = normalizeCouponCode(code)
  if (!normalized) return { ok: false, error: 'Enter a coupon code.' }

  const coupon = findCoupon(normalized)
  if (!coupon) return { ok: false, error: `"${normalized}" is not a valid coupon code.` }

  if (subtotal <= 0) return { ok: false, error: 'Add something to your bag first.' }

  return { ok: true, coupon, discount: calculateDiscount(coupon, subtotal) }
}
