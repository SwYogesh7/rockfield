'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { CATEGORIES } from '@/types'

const CATEGORY_IMAGES: Record<string, string> = {
  sneakers: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  formal: 'https://images.unsplash.com/photo-1520179800-c54efcea3d61?w=600&q=80',
  casual: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80',
  boots: 'https://images.unsplash.com/photo-1539185386684-4d8e0098c5be?w=600&q=80',
  sandals: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80',
  sports: 'https://images.unsplash.com/photo-1595950653106-6c80ad8d3ba1?w=600&q=80',
}

export default function CategoryTiles() {
  return (
    <section className="py-20 bg-ivory-50">
      <div className="container-luxury">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="block w-8 h-px bg-gold-500" />
              <span className="type-eyebrow text-gold-500">Collections</span>
            </div>
            <h2 className="type-h2 text-dark-900">
              Shop by <em className="italic text-gold-500">Category</em>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Link href={`/shop/${cat}`} className="group block relative overflow-hidden rounded-[var(--radius-sm)] aspect-[4/5] bg-ivory-200 outline-none focus-visible:ring-2 focus-visible:ring-gold-500">
                <Image
                  src={CATEGORY_IMAGES[cat] || CATEGORY_IMAGES.sneakers}
                  alt={`${cat} shoes`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/70 via-dark-900/10 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
                
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="type-h4 text-white capitalize mb-1 transform transition-transform duration-300 group-hover:-translate-y-1">
                    {cat}
                  </h3>
                  <div className="w-0 h-px bg-gold-500 transition-all duration-300 group-hover:w-full" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
