'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'

interface ColorSelectorProps {
  product: Product
  activeColorId: string
}

export function ColorSelector({ product, activeColorId }: ColorSelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleColorChange = (colorId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('colour', colorId)
    router.push(`/products/${product.slug}?${params.toString()}`, { scroll: false })
  }

  const activeColor = product.colors.find((c) => c.id === activeColorId) || product.colors[0]

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="type-label text-dark-900">Colour:</span>
        <span className="type-body text-sm font-500 text-dark-700 capitalize">{activeColor.name}</span>
      </div>
      <div className="flex items-center gap-3">
        {product.colors.map((color) => {
          const isActive = color.id === activeColorId
          const isLight = color.hex.toUpperCase() === '#F5F5F5' || color.hex.toUpperCase() === '#FAFAFA' || color.hex.toUpperCase() === '#FFFFFF'
          
          return (
            <button
              key={color.id}
              onClick={() => handleColorChange(color.id)}
              aria-label={`Select color ${color.name}`}
              className={cn(
                "relative size-10 rounded-full transition-all outline-none focus-visible:ring-2 focus-visible:ring-gold-500",
                isLight ? "border border-ivory-300" : ""
              )}
              style={{ backgroundColor: color.hex }}
            >
              {isActive && (
                <span className="absolute inset-0 rounded-full ring-2 ring-dark-900 ring-offset-2 ring-offset-ivory-50 scale-110" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

