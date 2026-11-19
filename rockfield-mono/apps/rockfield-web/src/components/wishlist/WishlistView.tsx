'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/Container'
import { PageHeader } from '@/components/ui/PageHeader'
import { useWishlistStore } from '@/store/wishlist'
import type { ProductCardData } from '@/types'

interface WishlistViewProps {
  /** Catalogue cards; saved items are matched against these by product id. */
  catalog: ProductCardData[]
}

export function WishlistView({ catalog }: WishlistViewProps) {
  const items = useWishlistStore((s) => s.items)
  // The wishlist is restored from localStorage, so nothing can be rendered from it until the
  // client has hydrated — otherwise the server markup (always empty) would not match.
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const products = useMemo(() => {
    const byId = new Map(catalog.map((p) => [p.id, p]))
    const seen = new Set<string>()

    // The store appends each new save, so reverse it to show the newest first.
    return [...items].reverse().flatMap((item) => {
      const product = byId.get(item.productId)
      // Skip anything no longer in the catalogue, and show one card per product even if
      // several of its variants were saved.
      if (!product || seen.has(product.id)) return []
      seen.add(product.id)
      return [product]
    })
  }, [catalog, items])

  return (
    <div className="min-h-screen bg-ivory-50 pb-24 pt-16 lg:pt-20">
      <PageHeader
        title="Wishlist"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Wishlist' }]}
        // Only a real count after hydration; before that the list is still unknown.
        count={mounted ? products.length : undefined}
      />

      <Container className="pt-8 lg:pt-12">
        {!mounted ? (
          <p role="status" className="sr-only">
            Loading your wishlist
          </p>
        ) : products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Heart size={32} strokeWidth={1.5} className="text-dark-200 mb-6" aria-hidden="true" />
            <p className="type-h3 text-dark-900 mb-2">Your wishlist is empty</p>
            <p className="type-body text-dark-400 max-w-sm mb-6">
              Tap the heart on any product to save it here for later.
            </p>
            <Button asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        )}
      </Container>
    </div>
  )
}
