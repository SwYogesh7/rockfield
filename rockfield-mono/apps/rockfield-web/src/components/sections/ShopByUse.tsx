'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { ArrowRight } from 'lucide-react'

const uses = [
  { label: 'Daily Office', href: '/shop/formal', img: '/placeholders/shoe.svg' },
  { label: 'Weekend Getaway', href: '/shop/casual', img: '/placeholders/shoe.svg' },
  { label: 'Active Performance', href: '/shop/sports', img: '/placeholders/shoe.svg' }
]

export default function ShopByUse() {
  return (
    <Section size="lg" className="bg-dark-900 text-ivory-50">
      <Container>
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="block w-8 h-px bg-gold-500" />
            <span className="type-eyebrow text-gold-500">Curated For You</span>
            <span className="block w-8 h-px bg-gold-500" />
          </div>
          <h2 className="type-h2 text-white">Shop by <em className="italic text-gold-500">Use</em></h2>
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
                <div className="absolute inset-0 z-10 bg-dark-900/40 transition-colors duration-500 group-hover:bg-dark-900/20" />
                
                <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                  <h3 className="type-h3 text-white mb-2">{use.label}</h3>
                  <div className="flex items-center gap-2 text-gold-500 type-label group-hover:gap-4 transition-all duration-300">
                    <span>Explore</span>
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

