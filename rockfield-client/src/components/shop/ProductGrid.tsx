'use client'

import { motion } from 'framer-motion'
// ✅ Fix 1: default import, no curly braces
import ProductCard from '@/components/product/ProductCard'
import type { ProductCardData } from '@/types'

interface ProductGridProps {
  products: ProductCardData[]
}

// Derives a badge string from a product's isNew flag and prices
function deriveBadge(
  isNew: boolean,
  price: number,
  compareAtPrice: number | undefined
): string | null {
  if (isNew) return 'New'
  if (compareAtPrice && compareAtPrice > price) {
    const discount = Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    return `-${discount}%`
  }
  return null
}

// No stagger variants needed here — ProductCard handles
// its own whileInView entrance animation internally.
// We just render the grid layout.

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="font-display text-3xl text-white/20 mb-3">No results found</p>
        <p className="font-body text-sm text-white/30">Try adjusting or clearing your filters</p>
      </div>
    )
  }

  return (
    <motion.div
      // key changes when the product list changes —
      // forces React to remount the grid and replay card animations
      key={products.map((p) => p.id).join(',')}
      className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8"
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          name={product.name}
          subtitle={`${product.colors.length} colour${product.colors.length !== 1 ? 's' : ''}`}
          price={product.price}
          comparePrice={product.compareAtPrice ?? null}
          rating={product.rating}
          slug={product.slug}
          index={index}
          badge={deriveBadge(product.isNew, product.price, product.compareAtPrice)}
          bgColor="#F5F3F0"
          image={product.image}
        />
      ))}
    </motion.div>
  )
}
