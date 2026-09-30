// src/components/sections/NewArrivals.tsx
// No 'use client' — this is a Server Component.
// It renders the section structure and passes data to cards.
// The cards themselves are client components (handle hover state).

import { motion } from 'framer-motion'
import ProductCard from '@/components/product/ProductCard'
import Link from 'next/link'

// ─────────────────────────────────────────────────────────────
// DUMMY PRODUCT DATA
// This is hardcoded for now — later it comes from the .NET API.
// Each object matches the ProductCardProps interface exactly.
// ─────────────────────────────────────────────────────────────
const products = [
  {
    id: '1',
    name: 'Obsidian Overcoat',
    subtitle: 'Cashmere blend · 3 colours',
    price: 18500,
    comparePrice: null,
    badge: 'New',
    emoji: '🧥',
    bgColor: 'var(--color-ivory-200)',
    rating: 5,
    slug: 'obsidian-overcoat',
  },
  {
    id: '2',
    name: 'Ivory Silk Dress',
    subtitle: 'Pure silk · XS–XL',
    price: 9200,
    comparePrice: 11500,
    badge: '−20%',
    emoji: '👗',
    bgColor: '#e8e0d0',
    rating: 4,
    slug: 'ivory-silk-dress',
  },
  {
    id: '3',
    name: 'Merino Wrap',
    subtitle: 'Fine merino · 5 colours',
    price: 6400,
    comparePrice: null,
    badge: 'New',
    emoji: '🧣',
    bgColor: '#e0dace',
    rating: 5,
    slug: 'merino-wrap',
  },
  {
    id: '4',
    name: 'Linen Suit Set',
    subtitle: 'Italian linen · 2 colours',
    price: 22000,
    comparePrice: null,
    badge: null,
    emoji: '👔',
    bgColor: '#ddd6cc',
    rating: 4,
    slug: 'linen-suit-set',
  },
]

export default function NewArrivals() {
  return (
    <section style={{
      backgroundColor: 'var(--color-ivory-100)',
      paddingTop: '5rem',
      paddingBottom: '5rem',
    }}>
      <div className="container-luxury">

        {/* ── SECTION HEADER ─────────────────────────────── */}
        {/* "motion" needs 'use client' — but since this is a
            Server Component, we can't use motion directly.
            The section header is simple enough for plain HTML. */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '2.5rem',
        }}>

          {/* Section title */}
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
            fontWeight: 300,
            color: 'var(--color-dark-900)',
            lineHeight: 1.2,
          }}>
            New{' '}
            {/* italic gold word — same pattern as hero heading */}
            <em style={{
              fontStyle: 'italic',
              color: 'var(--color-gold-500)',
            }}>
              Arrivals
            </em>
          </h2>

          {/* View all link */}
          <Link
            href="/shop"
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
        {/* 4 columns on desktop, 2 on tablet, 1 on mobile */}
        <div style={{
          display: 'grid',
          // repeat(auto-fill, minmax(220px, 1fr)):
          // auto-fill = as many columns as fit
          // minmax(220px, 1fr) = each column min 220px, max equal share
          // This is responsive WITHOUT media queries — very clean
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1.5rem',
        }}>
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              {...product}
              // {...product} spreads all product properties as props
              // Same as writing: name={product.name} subtitle={product.subtitle} etc.
              index={index}
              // index passed separately — not part of product data
            />
          ))}
        </div>

      </div>
    </section>
  )
}