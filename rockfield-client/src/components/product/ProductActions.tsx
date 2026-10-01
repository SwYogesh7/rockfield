'use client'

import { useState } from 'react'
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

  // Mobile sticky observer logic can go here. For simplicity, we just use fixed positioning via CSS classes.
  // A robust implementation would use IntersectionObserver to only show the sticky bar when the inline button is scrolled out of view.
  // For P3, we will render the inline buttons, and a duplicate fixed bar for mobile.

  return (
    <>
      {/* ── DESKTOP & INLINE MOBILE BUTTONS ── */}
      <div className="flex flex-col gap-3 mb-8">
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

      {/* ── MOBILE STICKY BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-ivory-50 border-t border-ivory-300 p-4 pb-safe flex gap-3 md:hidden shadow-[0_-4px_16px_rgba(26,20,16,0.05)]">
        <Button 
          className="flex-1 h-12 text-sm" 
          onClick={handleAdd}
          disabled={!inStock}
        >
          {inStock ? (selectedSize ? 'Add to Bag' : 'Select Size') : 'Out of Stock'}
        </Button>
        <Button 
          variant="secondary" 
          className="size-12 shrink-0 px-0 flex items-center justify-center border-ivory-400 bg-white"
          onClick={() => setIsWishlisted(!isWishlisted)}
        >
          <Heart size={20} className={cn("transition-colors", isWishlisted ? "fill-error text-error" : "text-dark-900")} />
        </Button>
      </div>
    </>
  )
}
