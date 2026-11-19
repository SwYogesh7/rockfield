// src/components/sections/NewArrivals.tsx
// Server Component ?" data fetched at request time via the products service.
// No 'use client' needed; ProductCard handles its own client interactivity.

import ProductCard from '@/components/product/ProductCard'
import { getNewArrivals } from '@/services/products'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'

export default async function NewArrivals() {
  const products = await getNewArrivals(4)

  return (
    <Section size="lg" className="bg-ivory-100">
      <Container>
        <SectionHeading 
          eyebrow="Latest Additions"
          title={<>New <em className="italic text-gold-500">Arrivals</em></>}
          link={{ label: 'VIEW ALL', href: '/shop?sortBy=newest' }}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              data={product}
              index={index}
            />
          ))}
        </div>
      </Container>
    </Section>
  )
}
