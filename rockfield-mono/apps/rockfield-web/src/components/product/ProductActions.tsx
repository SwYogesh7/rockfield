'use client'

import { useEffect, useRef, useState } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ProductActionsProps {
  selectedSize: number | null
  inStock: boolean
  onAdd: () => void
}

export function ProductActions({ selectedSize, inStock, onAdd }: ProductActionsProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [error, setError] = useState(false)

  const handleAdd = () => {
    if (!selectedSize) {
      setError(true)
      // Flash error state briefly
      setTimeout(() => setError(false), 2000)
      return
    }
    onAdd()
  }

  // Mobile: a single action block that is pinned to the bottom of the screen whenever its
  // normal position (the "slot") is not fully on screen, and sits inline once the user scrolls
  // to it. This replaces a separate fixed sticky bar that duplicated these buttons: the
  // duplicate gave screen readers two identical "Select Size" buttons, and its validation
  // message rendered next to the off-screen inline button, so tapping it showed no feedback.
  const slotRef = useRef<HTMLDivElement>(null)
  const [pinned, setPinned] = useState(false)
  const [slotHeight, setSlotHeight] = useState<number>()

  useEffect(() => {
    const slot = slotRef.current
    if (!slot) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        const fullyVisible = entry.intersectionRatio >= 0.99
        // Reserve the block's inline height so the page doesn't jump when it pins.
        if (!fullyVisible) setSlotHeight(slot.getBoundingClientRect().height)
        setPinned(!fullyVisible)
      },
      { threshold: 0.99 }
    )
    observer.observe(slot)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={slotRef}
      className={cn('mb-8', pinned && 'max-md:h-(--slot-h)')}
      style={pinned && slotHeight ? ({ '--slot-h': `${slotHeight}px` } as React.CSSProperties) : undefined}
    >
      <div
        className={cn(
          'flex flex-col gap-3',
          // Pinned styles apply below the md breakpoint only; desktop always stays inline.
          pinned &&
            'max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:z-40 max-md:bg-ivory-50 max-md:border-t max-md:border-ivory-300 max-md:px-4 max-md:pt-4 max-md:pb-[max(1rem,env(safe-area-inset-bottom))] max-md:shadow-[0_-4px_16px_rgba(26,20,16,0.05)]'
        )}
      >
        {error && (
          <p className="font-body text-sm text-error animate-in fade-in slide-in-from-top-1">
            Please select a size before adding to bag.
          </p>
        )}
        <div className="flex gap-3">
          <Button
            className="flex-1 h-14 text-sm"
            onClick={handleAdd}
            disabled={!inStock}
          >
            {inStock ? (selectedSize ? 'Add to Bag' : 'Select Size') : 'Out of Stock'}
          </Button>
          <Button
            variant="secondary"
            className="size-14 shrink-0 px-0 flex items-center justify-center border-ivory-400"
            onClick={() => setIsWishlisted(!isWishlisted)}
            aria-label="Wishlist"
          >
            <Heart size={20} className={cn("transition-colors", isWishlisted ? "fill-error text-error" : "text-dark-900")} />
          </Button>
        </div>
      </div>
    </div>
  )
}
