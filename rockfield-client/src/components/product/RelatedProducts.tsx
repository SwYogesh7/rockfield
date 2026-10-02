'use client'

import ProductCard from '@/components/product/ProductCard'
import type { ProductCardData } from '@/types'

interface RelatedProductsProps {
  products: ProductCardData[]
  title?: string
}

export function RelatedProducts({ products, title = 'You May Also Like' }: RelatedProductsProps) {
  if (!products.length) return null

  return (
    <section className="py-16 md:py-24 border-t border-ivory-300">
      <div className="flex items-center justify-between mb-8 md:mb-12">
        <h2 className="type-h2">{title}</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product, idx) => (
          <ProductCard key={product.id} data={product} index={idx} />
        ))}
      </div>
    </section>
  )
}
