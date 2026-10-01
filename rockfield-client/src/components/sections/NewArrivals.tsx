// src/components/sections/NewArrivals.tsx
// Server Component — data fetched at request time via the products service.
// No 'use client' needed; ProductCard handles its own client interactivity.

import ProductCard from '@/components/product/ProductCard'
import { getNewArrivals } from '@/services/products'
import Link from 'next/link'

export default async function NewArrivals() {
  const products = await getNewArrivals(4)

  return (
    <section
      style={{
        backgroundColor: 'var(--color-ivory-100)',
        paddingTop: '5rem',
        paddingBottom: '5rem',
      }}
    >
      <div className="container-luxury">
        {/* ── SECTION HEADER ─────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '2.5rem',
          }}
        >
          {/* Section title */}
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
              fontWeight: 300,
              color: 'var(--color-dark-900)',
              lineHeight: 1.2,
            }}
          >
            New{' '}
            <em
              style={{
                fontStyle: 'italic',
                color: 'var(--color-gold-500)',
              }}
            >
              Arrivals
            </em>
          </h2>

          {/* View all link */}
          <Link
            href="/shop?sort=newest"
            className="view-all-link"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.6875rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-gold-500)',
              textDecoration: 'none',
              borderBottom: '0.5px solid var(--color-gold-500)',
              paddingBottom: '2px',
              transition: 'opacity 250ms ease',
              whiteSpace: 'nowrap',
            }}
          >
            View All
          </Link>
        </div>

        {/* ── PRODUCT GRID ───────────────────────────────── */}
        {/* 4 columns desktop, 2 mobile */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              name={product.name}
              subtitle={`${product.colors.length} colour${product.colors.length > 1 ? 's' : ''}`}
              price={product.price}
              comparePrice={product.compareAtPrice ?? null}
              badge={product.isNew ? 'New' : null}
              image={product.image}
              bgColor="var(--color-ivory-200)"
              rating={product.rating}
              slug={product.slug}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
