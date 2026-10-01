'use client'

import { motion } from 'framer-motion'
import ProductCard from '@/components/product/ProductCard'
import type { ProductCardData } from '@/types'

interface ProductGridProps {
  products: ProductCardData[]
}

export function ProductGrid({ products }: ProductGridProps) {
  // Empty state is now handled by ShopView parent component.
  if (products.length === 0) return null

  return (
    <motion.div
      key={products.map((p) => p.id).join(',')}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16"
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          data={product}
          index={index}
          priority={index < 4} // prioritize loading first row of images
        />
      ))}
    </motion.div>
  )
}
