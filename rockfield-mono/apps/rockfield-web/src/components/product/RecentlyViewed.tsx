'use client'

import { useEffect, useState } from 'react'
import ProductCard from '@/components/product/ProductCard'
import type { ProductCardData } from '@/types'

export function RecentlyViewed() {
  const [products, setProducts] = useState<ProductCardData[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('rockfield_recently_viewed')
      if (stored) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setProducts(JSON.parse(stored))
      }
    } catch {
      // Ignore
    }
  }, [])

  if (!products.length) return null

  return (
    <section className="py-16 md:py-24 border-t border-ivory-300 overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <h2 className="type-h2">Recently Viewed</h2>
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

export function trackRecentlyViewed(product: ProductCardData) {
  try {
    const stored = localStorage.getItem('rockfield_recently_viewed')
    let items: ProductCardData[] = stored ? JSON.parse(stored) : []
    
    // Remove if exists
    items = items.filter(p => p.id !== product.id)
    
    // Add to front
    items.unshift(product)
    
    // Keep max 8
    items = items.slice(0, 8)
    
    localStorage.setItem('rockfield_recently_viewed', JSON.stringify(items))
  } catch {
    // Ignore
  }
}
