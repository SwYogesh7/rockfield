'use client'

import Link from 'next/link'
import { Minus, Plus, X } from 'lucide-react'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/constants'
import { cn } from '@/lib/utils'
import type { CartItem as CartItemData } from '@/types'

interface CartItemProps {
  item: CartItemData
  /** Called after a navigation link inside the row is clicked (so the drawer can close). */
  onNavigate?: () => void
}

const stepperBtn = cn(
  'flex size-8 items-center justify-center text-dark-700 transition-colors duration-150',
  'hover:bg-ivory-200 hover:text-dark-900',
  'disabled:pointer-events-none disabled:opacity-30',
  'outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-inset'
)

export function CartItem({ item, onNavigate }: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)

  const lineTotal = item.unitPrice * item.quantity
  // Capped at the variant's stock (recorded when it was added; re-validated at checkout).
  const atStockLimit = item.quantity >= item.maxStock
  const productHref = `/products/${item.slug}`
  const stockNoteId = `stock-note-${item.variantId}`
  const label = `${item.name}, ${item.colorName}, UK ${item.size}`

  return (
    <li
      data-testid="cart-item"
      data-variant-id={item.variantId}
      className="flex gap-4 py-5 first:pt-0 last:pb-0"
    >
      {/* Image — 4:5 to match PDP gallery ratio. Redundant with the name link below, so it's
          removed from the a11y tree / tab order to avoid announcing the same link twice. */}
      <Link
        href={productHref}
        onClick={onNavigate}
        aria-hidden="true"
        tabIndex={-1}
        className="relative block w-20 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-ivory-200 aspect-portrait"
      >
        <ImageWithFallback
          src={item.image}
          alt={label}
          fill
          sizes="80px"
          className="object-cover"
          data-testid="cart-item-image"
        />
      </Link>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={productHref}
              onClick={onNavigate}
              className="font-body text-sm font-medium leading-snug text-dark-900 line-clamp-2 hover:text-gold-text transition-colors"
            >
              {item.name}
            </Link>
            <p className="mt-1 font-body text-xs text-dark-400">
              <span data-testid="cart-item-color">{item.colorName}</span>
              <span aria-hidden="true"> · </span>
              <span data-testid="cart-item-size">UK {item.size}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => removeItem(item.variantId)}
            aria-label={`Remove ${label}`}
            className={cn(
              '-mr-2 -mt-1 flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)]',
              'text-dark-400 transition-colors duration-150 hover:text-dark-900 hover:bg-ivory-200',
              'outline-none focus-visible:ring-2 focus-visible:ring-gold-500'
            )}
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          {/* Quantity stepper */}
          <div
            role="group"
            aria-label={`Quantity for ${label}`}
            className="flex items-center rounded-[var(--radius-sm)] border border-ivory-400"
          >
            <button
              type="button"
              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
              aria-label="Decrease quantity"
              className={stepperBtn}
            >
              <Minus size={14} strokeWidth={1.5} />
            </button>
            <span
              data-testid="cart-item-quantity"
              aria-live="polite"
              className="w-8 text-center font-body text-sm tabular-nums text-dark-900"
            >
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
              disabled={atStockLimit}
              aria-label="Increase quantity"
              aria-describedby={atStockLimit ? stockNoteId : undefined}
              className={stepperBtn}
            >
              <Plus size={14} strokeWidth={1.5} />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p
              data-testid="cart-item-total"
              className="font-body text-sm font-medium tabular-nums text-dark-900"
            >
              {formatPrice(lineTotal)}
            </p>
            {item.quantity > 1 && (
              <p className="font-body text-xs tabular-nums text-dark-400">
                {formatPrice(item.unitPrice)} each
              </p>
            )}
          </div>
        </div>

        {atStockLimit && (
          <p
            id={stockNoteId}
            data-testid="cart-item-stock-note"
            className="mt-2 font-body text-xs text-warning"
          >
            Only {item.maxStock} in stock
          </p>
        )}
      </div>
    </li>
  )
}
