// src/components/product/ProductCard.tsx
'use client'

// useState — tracks hover and wishlist toggle state
import { useState } from 'react'
import Link from 'next/link'
import { Heart, Eye } from 'lucide-react'
import { motion } from 'framer-motion'

// ─────────────────────────────────────────────────────────────
// PROPS INTERFACE
// Defines exactly what data this card needs to render.
// TypeScript will error if we forget to pass any of these.
// ─────────────────────────────────────────────────────────────
interface ProductCardProps {
  name: string
  subtitle: string // e.g. "3 colours"
  price: number
  comparePrice: number | null // original price if on sale
  badge: string | null // "New", "-20%", or null
  image?: string // product image URL
  emoji?: string // fallback placeholder
  bgColor: string // card image background colour
  rating: number // 1–5
  slug: string // URL: /product/terrain-runner-pro
  index: number // position in grid — used for stagger delay
}

// ─────────────────────────────────────────────────────────────
// HELPER: FORMAT PRICE
// Converts 18500 → "₹18,500"
// toLocaleString('en-IN') formats with Indian number system:
// 18500 → 18,500 (not 18.500 which is European style)
// ─────────────────────────────────────────────────────────────
function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

// ─────────────────────────────────────────────────────────────
// HELPER: STAR RATING
// Renders 5 stars — filled gold up to rating, empty after
// ─────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: '1px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            fontSize: '11px',
            // Ternary: if star number ≤ rating → gold, else light grey
            color: star <= rating ? 'var(--color-gold-500)' : 'var(--color-ivory-400)',
          }}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export default function ProductCard({
  name,
  subtitle,
  price,
  comparePrice,
  badge,
  emoji,
  image,
  bgColor,
  rating,
  slug,
  index,
}: ProductCardProps) {
  // isHovered — controls image background and action icon visibility
  const [isHovered, setIsHovered] = useState(false)

  // isWishlisted — toggles heart icon fill
  const [isWishlisted, setIsWishlisted] = useState(false)

  return (
    // motion.div gives us:
    // 1. whileHover={{ y: -6 }} — card lifts 6px on hover
    // 2. onHoverStart/End — updates isHovered state
    // 3. initial/animate — stagger entrance animation
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.5,
        // Each card delays by 0.1s × its position in the grid
        // Card 0: 0ms, Card 1: 100ms, Card 2: 200ms, Card 3: 300ms
        // This creates a smooth left-to-right cascade effect
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -6 }}
      // whileHover applies directly as an animation — cleaner than
      // managing translateY through useState + inline style
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ cursor: 'pointer' }}
    >
      {/* Link wraps the entire card — clicking anywhere navigates */}
      <Link href={`/product/${slug}`} style={{ textDecoration: 'none', display: 'block' }}>
        {/* ── IMAGE AREA ─────────────────────────────────── */}
        <div
          style={{
            backgroundColor: bgColor,
            borderRadius: 'var(--radius-md)',
            height: '220px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '0.875rem',
            // filter: brightness — darkens card on hover slightly
            // This is more reliable than computing a darker hex colour
            filter: isHovered ? 'brightness(0.96)' : 'brightness(1)',
            transition: 'filter 250ms ease',
          }}
        >
          {/* Product image or emoji placeholder */}
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 300ms ease',
              }}
            />
          ) : (
            <span
              style={{
                fontSize: '3.5rem',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 300ms ease',
                display: 'block',
              }}
            >
              {emoji}
            </span>
          )}

          {/* ── BADGE ────────────────────────────────────── */}
          {/* badge && ... = only render if badge is not null */}
          {badge && (
            <div
              style={{
                position: 'absolute',
                top: '0.625rem',
                left: '0.625rem',
                // "New" badge = dark background, sale badge = gold
                backgroundColor:
                  badge === 'New' ? 'var(--color-dark-900)' : 'var(--color-gold-500)',
                color: 'white',
                fontSize: '0.5625rem',
                letterSpacing: '0.12em',
                padding: '0.25rem 0.5625rem',
                borderRadius: 'var(--radius-sm)',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
              }}
            >
              {badge}
            </div>
          )}

          {/* ── HOVER ACTION ICONS ───────────────────────── */}
          {/* These appear only when isHovered = true */}
          {/* opacity animates from 0 → 1 smoothly */}
          <motion.div
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              bottom: '0.625rem',
              right: '0.625rem',
              display: 'flex',
              gap: '0.375rem',
            }}
          >
            {/* Wishlist button */}
            {/* e.preventDefault() stops the Link from navigating */}
            {/* when user clicks the heart — they're just wishlisting */}
            <button
              onClick={(e) => {
                e.preventDefault()
                setIsWishlisted((prev) => !prev)
              }}
              style={{
                width: '28px',
                height: '28px',
                backgroundColor: 'white',
                border: '0.5px solid var(--color-ivory-400)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                size={12}
                strokeWidth={1.5}
                // fill changes based on wishlist state
                fill={isWishlisted ? 'var(--color-gold-500)' : 'none'}
                color={isWishlisted ? 'var(--color-gold-500)' : 'var(--color-dark-400)'}
              />
            </button>

            {/* Quick view button */}
            <button
              onClick={(e) => e.preventDefault()}
              style={{
                width: '28px',
                height: '28px',
                backgroundColor: 'white',
                border: '0.5px solid var(--color-ivory-400)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
              aria-label="Quick view"
            >
              <Eye size={12} strokeWidth={1.5} color="var(--color-dark-400)" />
            </button>
          </motion.div>
        </div>

        {/* ── PRODUCT INFO ───────────────────────────────── */}
        <div>
          {/* Product name */}
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              color: 'var(--color-dark-800)',
              fontWeight: 500,
              marginBottom: '0.25rem',
              letterSpacing: '0.02em',
            }}
          >
            {name}
          </div>

          {/* Subtitle — material and colour count */}
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              color: 'var(--color-dark-400)',
              marginBottom: '0.625rem',
            }}
          >
            {subtitle}
          </div>

          {/* Price row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Prices */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  color: 'var(--color-dark-900)',
                  fontWeight: 500,
                }}
              >
                {formatPrice(price)}
              </span>

              {/* Original price — only shows if comparePrice exists */}
              {comparePrice && (
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.75rem',
                    color: 'var(--color-dark-200)',
                    textDecoration: 'line-through',
                  }}
                >
                  {formatPrice(comparePrice)}
                </span>
              )}
            </div>

            {/* Star rating */}
            <StarRating rating={rating} />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
