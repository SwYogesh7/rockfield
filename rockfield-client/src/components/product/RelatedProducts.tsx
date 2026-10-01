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
    <section className="py-16 md:py-24 border-t border-ivory-300 overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <h2 className="type-h2">{title}</h2>
      </div>

      <div className="-mx-6 px-6 md:-mx-12 md:px-12 lg:-mx-20 lg:px-20 overflow-x-auto hide-scrollbar">
        <div className="flex gap-6 w-max pb-8">
          {products.map((product, idx) => (
            <div key={product.id} className="w-[280px] sm:w-[320px] lg:w-[360px] shrink-0">
              <ProductCard data={product} index={idx} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
