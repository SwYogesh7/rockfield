'use client'

// "Add to bag" for listing cards. Adds the product's first in-stock variant (pre-resolved on the
// server, see getQuickAddVariant) without leaving the grid, and confirms inline instead of
// opening the cart drawer.

import { useEffect, useRef, useState } from 'react'
import { Check, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cart'
import type { QuickAddVariant } from '@/types'

/** How long the "Added" confirmation stays on the button. */
export const QUICK_ADD_CONFIRM_MS = 2000

interface QuickAddButtonProps {
  productId: string
  slug: string
  name: string
  /** Undefined when the product is sold out in every colour and size. */
  variant?: QuickAddVariant
}

export function QuickAddButton({ productId, slug, name, variant }: QuickAddButtonProps) {
  const addItem = useCartStore((s) => s.addItem)
  const [added, setAdded] = useState(false)
  // Includes the running quantity so repeat adds change the text and are re-announced.
  const [announcement, setAnnouncement] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    []
  )

  if (!variant) {
    return (
      <Button
        variant="secondary"
        size="sm"
        className="w-full"
        disabled
        aria-label={`Sold out: ${name}`}
      >
        Sold out
      </Button>
    )
  }

  const details = `${variant.colorName}, UK ${variant.size}`

  const handleAdd = () => {
    // The store silently clamps at stock; say so rather than flashing a false "Added".
    const inBag = useCartStore.getState().items.find((i) => i.variantId === variant.variantId)
    if (inBag && inBag.quantity >= variant.maxStock) {
      toast.error(`Only ${variant.maxStock} left in stock`, {
        description: `You already have the maximum quantity of ${name} (${details}) in your bag.`,
        action: { label: 'View Bag', onClick: () => useCartStore.getState().openCart() },
      })
      return
    }

    addItem(
      {
        variantId: variant.variantId,
        productId,
        slug,
        name,
        colorName: variant.colorName,
        size: variant.size,
        image: variant.image,
        unitPrice: variant.unitPrice,
        maxStock: variant.maxStock,
      },
      { openCart: false }
    )

    const quantity =
      useCartStore.getState().items.find((i) => i.variantId === variant.variantId)?.quantity ?? 1
    setAnnouncement(`${name}, ${details}, added to bag. ${quantity} in bag.`)
    setAdded(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setAdded(false)
      setAnnouncement('')
    }, QUICK_ADD_CONFIRM_MS)
  }

  return (
    <div className="flex flex-col gap-1.5">
      {/* Sighted users see what will be added; screen readers get it in the button name. */}
      <p
        aria-hidden="true"
        data-testid="quick-add-variant"
        className="font-body text-xs text-dark-400 truncate"
      >
        UK {variant.size} · {variant.colorName}
      </p>

      <Button
        type="button"
        variant={added ? 'primary' : 'secondary'}
        size="sm"
        className="w-full"
        onClick={handleAdd}
        // Built from the same state as the visible text so the spoken name always starts with
        // what's on screen (WCAG 2.5.3 Label in Name). An explicit label rather than sr-only
        // children: browsers insert stray spaces around absolutely-positioned sr-only spans.
        aria-label={`${added ? 'Added to bag' : 'Add to bag'}: ${name}, ${details}`}
        data-variant-id={variant.variantId}
        data-state={added ? 'added' : 'idle'}
      >
        {added ? (
          <>
            <Check aria-hidden="true" strokeWidth={2} />
            Added
          </>
        ) : (
          <>
            <ShoppingBag aria-hidden="true" strokeWidth={1.5} />
            Add to bag
          </>
        )}
      </Button>

      {/* Announced on each add; empty the rest of the time. */}
      <span role="status" data-testid="quick-add-status" className="sr-only">
        {announcement}
      </span>
    </div>
  )
}
