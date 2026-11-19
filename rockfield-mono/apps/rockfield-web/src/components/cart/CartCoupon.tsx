'use client'

import { useId, useState } from 'react'
import { Tag, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCartStore } from '@/store/cart'
import { findCoupon, normalizeCouponCode, validateCoupon } from '@/lib/coupons'
import { formatPrice } from '@/constants'

export function CartCoupon() {
  const couponCode = useCartStore((s) => s.couponCode)
  const discountAmount = useCartStore((s) => s.discountAmount)
  const subtotal = useCartStore((s) => s.getSubtotal())
  const applyCoupon = useCartStore((s) => s.applyCoupon)
  const removeCoupon = useCartStore((s) => s.removeCoupon)

  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const inputId = useId()
  const errorId = `${inputId}-error`

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = validateCoupon(code, subtotal)
    if (!result.ok) {
      setError(result.error)
      return
    }
    applyCoupon(result.coupon.code, result.discount)
    setCode('')
    setError(null)
  }

  // ── Applied state ──
  if (couponCode) {
    const coupon = findCoupon(couponCode)
    return (
      <div
        data-testid="coupon-applied"
        className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] bg-success-surface px-3 py-2.5"
      >
        <div className="flex min-w-0 items-center gap-2">
          <Tag size={14} strokeWidth={1.5} className="shrink-0 text-success" />
          <p className="truncate font-body text-sm text-dark-900">
            <span className="font-medium tracking-wider">{couponCode}</span>
            <span className="text-dark-700">
              {' '}
              applied{coupon ? ` — ${coupon.label}` : ''} ({formatPrice(discountAmount)} off)
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={removeCoupon}
          aria-label={`Remove coupon ${couponCode}`}
          className="flex size-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-dark-400 transition-colors hover:bg-ivory-50 hover:text-dark-900 outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
        >
          <X size={14} strokeWidth={1.5} />
        </button>
      </div>
    )
  }

  // ── Input state ──
  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="type-label text-dark-700">
        Coupon code
      </label>
      <div className="flex gap-2">
        <Input
          id={inputId}
          name="coupon"
          value={code}
          onChange={(e) => {
            setCode(normalizeCouponCode(e.target.value))
            if (error) setError(null)
          }}
          placeholder="e.g. ROCK10"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal"
        />
        <Button type="submit" variant="secondary" disabled={!code}>
          Apply
        </Button>
      </div>
      {error && (
        <p id={errorId} role="alert" className="font-body text-xs text-error">
          {error}
        </p>
      )}
    </form>
  )
}
