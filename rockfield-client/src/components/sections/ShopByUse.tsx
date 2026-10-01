'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const uses = [
  { label: 'Daily Office', href: '/shop/formal', img: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=800&q=80' },
  { label: 'Weekend Getaway', href: '/shop/casual', img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80' },
  { label: 'Active Performance', href: '/shop/sports', img: 'https://images.unsplash.com/photo-1556815302-0e9e4f4fb30c?w=800&q=80' }
]

export default function ShopByUse() {
  return (
    <section className="py-24 bg-dark-900 text-ivory-50">
      <div className="container-luxury">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="block w-8 h-px bg-gold-500" />
            <span className="type-eyebrow text-gold-500">Curated For You</span>
            <span className="block w-8 h-px bg-gold-500" />
          </div>
          <h2 className="type-h2">Shop by <em className="italic text-gold-500">Use</em></h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {uses.map((use, i) => (
            <motion.div
              key={use.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
            >
              <Link href={use.href} className="group block relative aspect-[3/4] overflow-hidden rounded-[var(--radius-sm)] outline-none focus-visible:ring-2 focus-visible:ring-gold-500">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                  style={{ backgroundImage: `url(${use.img})` }}
                />
                <div className="absolute inset-0 bg-dark-900/40 transition-colors duration-500 group-hover:bg-dark-900/20" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h3 className="type-h3 text-white mb-2">{use.label}</h3>
                  <div className="flex items-center gap-2 text-gold-500 type-label group-hover:gap-4 transition-all duration-300">
                    <span>Explore</span>
                    <span className="text-lg leading-none">→</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
