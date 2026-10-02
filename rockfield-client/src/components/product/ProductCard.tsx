'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ProductCardData } from '@/types'

interface ProductCardProps {
  data: ProductCardData
  index?: number
  priority?: boolean
}

function formatPrice(paise: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(paise / 100)
}

function PlaceholderImage() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-ivory-300">
      <div className="h-2/5 w-2/5 rounded-[2px] bg-ivory-400 opacity-50" />
    </div>
  )
}

export default function ProductCard({ data, index = 0, priority = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  // Swatch interaction state for previewing colours (just visual on card)
  const [activeColorIdx, setActiveColorIdx] = useState(0)

  // Use second image for hover if available, otherwise fallback to first
  const primaryImg = data.images[0]
  const hoverImg = data.images.length > 1 ? data.images[1] : primaryImg

  // Badges logic
  const isSale = data.compareAtPrice && data.compareAtPrice > data.price
  const isLowStock = data.stockCount !== undefined && data.stockCount > 0 && data.stockCount <= 3

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group relative flex flex-col"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={`/products/${data.slug}`} className="block outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-[var(--radius-sm)]">
        {/* ── IMAGE AREA ── */}
        <div className="aspect-shoe-card relative w-full overflow-hidden rounded-[var(--radius-sm)] bg-ivory-100 mb-4">
          {!primaryImg ? (
            <PlaceholderImage />
          ) : (
            <>
              {/* Primary Image */}
              <ImageWithFallback
                src={primaryImg}
                alt={data.name}
                fill
                priority={priority}
                className={cn(
                  "object-cover transition-opacity duration-300 ease-out",
                  isHovered && primaryImg !== hoverImg ? "opacity-0" : "opacity-100"
                )}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
              {/* Hover Image */}
              {primaryImg !== hoverImg && (
                <ImageWithFallback
                  src={hoverImg}
                  alt={`${data.name} hover view`}
                  fill
                  className={cn(
                    "object-cover transition-transform duration-700 ease-out",
                    isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
                  )}
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              )}
            </>
          )}

          {/* ── BADGES ── */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            {!data.inStock && (
              <span className="bg-dark-200 text-dark-900 px-2 py-1 rounded-[var(--radius-sm)] font-body text-[0.625rem] tracking-widest uppercase font-500">
                Out of Stock
              </span>
            )}
            {data.inStock && isLowStock && (
              <span className="bg-warning text-dark-900 px-2 py-1 rounded-[var(--radius-sm)] font-body text-[0.625rem] tracking-widest uppercase font-500">
                Only {data.stockCount} left
              </span>
            )}
            {data.inStock && data.isNew && !isLowStock && (
              <span className="bg-ivory-100 text-dark-900 px-2 py-1 rounded-[var(--radius-sm)] font-body text-[0.625rem] tracking-widest uppercase font-500">New
              </span>
            )}
            {data.inStock && isSale && (
              <span className="bg-gold-500 text-dark-900 px-2 py-1 rounded-[var(--radius-sm)] font-body text-[0.625rem] tracking-widest uppercase font-500">
                Sale
              </span>
            )}
          </div>

          {/* ── WISHLIST BUTTON ── */}
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsWishlisted(!isWishlisted)
            }}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className={cn(
              "absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-transform duration-200 hover:scale-105 outline-none focus-visible:ring-2 focus-visible:ring-gold-500",
              isHovered || isWishlisted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 lg:opacity-0"
            )}
          >
            <Heart
              size={14}
              className={cn(
                "transition-colors",
                isWishlisted ? "fill-error text-error" : "text-dark-400 hover:text-dark-900"
              )}
            />
          </button>
        </div>
      </Link>

      {/* ── PRODUCT INFO ── */}
      <div className="flex flex-col">
        {/* Swatches (desktop only, shown on hover, or always if you prefer. Design standard is often below image) */}
        <div className="flex items-center gap-1 mb-2 h-4">
          {data.colors.map((color, i) => (
            <button
              key={color.id}
              onClick={(e) => {
                e.preventDefault()
                setActiveColorIdx(i)
              }}
              className={cn(
                "size-3.5 rounded-full border transition-transform outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50 focus-visible:ring-offset-1",
                activeColorIdx === i ? "border-dark-400 scale-110" : "border-dark-200 hover:scale-110"
              )}
              style={{ backgroundColor: color.hex }}
              aria-label={`Select ${color.name}`}
            />
          ))}
          {data.colors.length > 3 && (
            <span className="text-[0.625rem] text-dark-400 font-body ml-1">+{data.colors.length - 3}</span>
          )}
        </div>

        <Link href={`/products/${data.slug}`} className="outline-none focus-visible:ring-1 focus-visible:ring-gold-500 rounded-sm">
          <h3 className="font-body text-sm font-500 text-dark-900 truncate mb-1">
            {data.name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-baseline gap-2">
            <span className="font-body text-sm font-500 text-dark-900">
              {formatPrice(data.price)}
            </span>
            {isSale && (
              <span className="font-body text-xs text-dark-400 line-through">
                {formatPrice(data.compareAtPrice!)}
              </span>
            )}
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-1" aria-label={`Rated ${data.rating} out of 5`}>
            <span className="font-body text-xs font-500 text-dark-900">{data.rating.toFixed(1)}</span>
            <span className="text-gold-500 text-[10px]">★</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}





