'use client'

import { Suspense, useMemo } from 'react'
import { useProductFilters } from '@/lib/hooks/useProductFilters'
import { mockProducts } from '@/lib/mock-data'
import { FilterSidebar } from '@/components/shop/FilterSidebar'
import { SortBar } from '@/components/shop/SortBar'
import { FilterChips } from '@/components/shop/FilterChips'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useIsDesktop } from '@/lib/hooks/useIsDesktop'
import type { ProductCardData } from '@/types'

function ShopPageContent() {
  const { filters, activeCount } = useProductFilters()
  const isDesktop = useIsDesktop()

  const filteredProducts = useMemo(() => {
    let result: ProductCardData[] = [...mockProducts]

    if (filters.category) {
      result = result.filter((p) => p.category === filters.category)
    }
    if (filters.minPrice !== undefined) {
      result = result.filter((p) => p.price >= filters.minPrice!)
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= filters.maxPrice!)
    }

    return result
  }, [filters])

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-stone-50, #faf8f4)' }}>
      <div
        className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 pt-36 pb-8 border-b"
        style={{ borderColor: 'var(--color-stone-200, #e8e2d8)' }}
      >
        <h1
          className="text-4xl md:text-5xl font-light"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-dark-900, #1a1a1a)' }}
        >
          {filters.category
            ? (filters.category as string).charAt(0).toUpperCase() +
              (filters.category as string).slice(1)
            : 'All Shoes'}
        </h1>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 pb-24">
        <SortBar resultCount={filteredProducts.length} />
        {activeCount > 0 && <FilterChips className="mt-2 mb-2" />}

        <div className="flex gap-12 mt-6">
          {isDesktop && (
            <aside className="w-52 flex-shrink-0">
              <FilterSidebar />
            </aside>
          )}

          {!isDesktop && (
            <div className="mb-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="secondary"
                    className="text-xs tracking-widest uppercase rounded-none bg-transparent"
                  >
                    Filters {activeCount > 0 && `(${activeCount})`}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 overflow-y-auto">
                  <div className="pt-6">
                    <FilterSidebar />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopPageContent />
    </Suspense>
  )
}
