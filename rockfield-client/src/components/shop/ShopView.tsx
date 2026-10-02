'use client'

import { FilterSidebar } from '@/components/shop/FilterSidebar'
import { SortBar } from '@/components/shop/SortBar'
import { FilterChips } from '@/components/shop/FilterChips'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink, PaginationEllipsis } from '@/components/ui/pagination'
import { useIsDesktop } from '@/lib/hooks/useIsDesktop'
import { useProductFilters } from '@/lib/hooks/useProductFilters'
import type { ProductCardData, ProductFacets } from '@/types'

interface ShopViewProps {
  title: string
  products: ProductCardData[]
  total: number
  facets: ProductFacets
  totalPages: number
}

export function ShopView({ title, products, total, facets, totalPages }: ShopViewProps) {
  const { activeCount, page, setFilter } = useProductFilters()
  const isDesktop = useIsDesktop()

  return (
    <div className="min-h-screen bg-ivory-50 pb-24 pt-16 lg:pt-20">
      {/* ── HEADER ── */}
      <div className="border-b border-ivory-300">
        <div className="container-luxury pt-12 lg:pt-16 pb-8">
          <h1 className="type-h1 text-dark-900 capitalize">{title}</h1>
          <p className="type-body text-dark-400 mt-2">{total} {total === 1 ? 'Product' : 'Products'}</p>
        </div>
      </div>

      <div className="container-luxury pt-8">
        <SortBar resultCount={total} />
        {activeCount > 0 && <FilterChips className="mt-6 mb-2" />}

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 mt-8 lg:mt-12">
          {/* ── DESKTOP SIDEBAR ── */}
          {isDesktop && (
            <aside className="w-56 flex-shrink-0">
              <FilterSidebar facets={facets} />
            </aside>
          )}

          {/* ── MOBILE FILTER DRAWER ── */}
          {!isDesktop && (
            <div className="mb-6 w-full">
              <Drawer direction="left">
                <DrawerTrigger asChild>
                  <Button variant="secondary" className="w-full justify-center">
                    Filters {activeCount > 0 && `(${activeCount})`}
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="w-4/5 sm:max-w-sm rounded-r-[var(--radius-lg)] h-full">
                  <div className="p-6 overflow-y-auto h-full">
                    <FilterSidebar facets={facets} />
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          )}

          {/* ── PRODUCT GRID ── */}
          <div className="flex-1 min-w-0 flex flex-col">
            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="type-h3 text-dark-900 mb-2">No products found</p>
                <p className="type-body text-dark-400 max-w-sm mb-6">
                  We couldn&apos;t find anything matching your current filters. Try removing some to see more results.
                </p>
                <Button variant="secondary" onClick={() => setFilter('category', null)}>
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* ── PAGINATION ── */}
            {totalPages > 1 && (
              <div className="mt-16 pt-8 border-t border-ivory-300">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); if (page > 1) setFilter('page', page - 1); }} 
                        className={page <= 1 ? "pointer-events-none opacity-50" : ""} 
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const p = i + 1
                      // Simple windowing logic
                      if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                        return (
                          <PaginationItem key={p}>
                            <PaginationLink 
                              href="#" 
                              isActive={page === p}
                              onClick={(e) => { e.preventDefault(); setFilter('page', p); }}
                            >
                              {p}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      }
                      // Show ellipsis if there's a gap
                      if (p === page - 2 || p === page + 2) {
                        return <PaginationItem key={p}><PaginationEllipsis /></PaginationItem>
                      }
                      return null
                    })}

                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); if (page < totalPages) setFilter('page', page + 1); }} 
                        className={page >= totalPages ? "pointer-events-none opacity-50" : ""} 
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

