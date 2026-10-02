'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'

const CATEGORIES = ['sneakers', 'formal', 'casual', 'boots', 'sandals', 'sports'] as const

const CATEGORY_IMAGES: Record<string, string> = {
  sneakers: '/placeholders/shoe.svg',
  formal: '/placeholders/shoe.svg',
  casual: '/placeholders/shoe.svg',
  boots: '/placeholders/shoe.svg',
  sandals: '/placeholders/shoe.svg',
  sports: '/placeholders/shoe.svg',
}

export default function CategoryTiles() {
  return (
    <Section size="lg" className="bg-ivory-50">
      <Container>
        <SectionHeading 
          eyebrow="Collections"
          title={<>Shop by <em className="italic text-gold-500">Category</em></>}
        />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Link href={`/shop/${cat}`} className="group block relative overflow-hidden rounded-[var(--radius-sm)] aspect-portrait bg-ivory-200 outline-none focus-visible:ring-2 focus-visible:ring-gold-500">
                <ImageWithFallback
                  src={CATEGORY_IMAGES[cat] || CATEGORY_IMAGES.sneakers}
                  alt={`${cat} shoes`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
                
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <h3 className="type-h4 text-white capitalize mb-1 transform transition-transform duration-300 group-hover:-translate-y-1">
                    {cat}
                  </h3>
                  <div className="w-0 h-px bg-gold-500 transition-all duration-300 group-hover:w-full" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

