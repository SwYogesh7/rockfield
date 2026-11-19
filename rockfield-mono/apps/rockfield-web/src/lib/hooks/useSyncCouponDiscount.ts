'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/store/cart'
import { calculateDiscount, findCoupon } from '@/lib/coupons'

// The cart store persists the coupon as "code + absolute paise discount". A percentage coupon
// therefore goes stale the moment the subtotal changes (quantity stepper, removing a line, adding
// another product). This hook re-derives the discount from the code whenever the subtotal moves
// and drops the coupon entirely when the bag empties or the code is no longer recognised.
//
// Mounted once, globally, from CartDrawer (which itself is always mounted via the root layout).
export function useSyncCouponDiscount() {
  const couponCode = useCartStore((s) => s.couponCode)
  const discountAmount = useCartStore((s) => s.discountAmount)
  const subtotal = useCartStore((s) => s.getSubtotal())
  const applyCoupon = useCartStore((s) => s.applyCoupon)
  const removeCoupon = useCartStore((s) => s.removeCoupon)

  useEffect(() => {
    if (!couponCode) return

    const coupon = findCoupon(couponCode)
    if (!coupon || subtotal <= 0) {
      removeCoupon()
      return
    }

    const expected = calculateDiscount(coupon, subtotal)
    if (expected !== discountAmount) applyCoupon(coupon.code, expected)
  }, [couponCode, discountAmount, subtotal, applyCoupon, removeCoupon])
}
