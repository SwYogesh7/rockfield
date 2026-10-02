'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export default function StoryStrip() {
  return (
    <section className="py-24 bg-dark-900 overflow-hidden">
      <div className="container-luxury">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="block w-8 h-px bg-gold-500" />
              <span className="type-eyebrow text-gold-500">Our Story</span>
            </div>
            
            <h2 className="type-h2 text-ivory-50 mb-6">
              Craftsmanship <em className="italic text-gold-500">Redefined</em>
            </h2>
            
            <p className="type-body text-ivory-400 mb-8 max-w-md">
              Born from a desire to blend traditional shoemaking with modern design, Rockfield creates footwear that stands the test of time. Every stitch, every cut of leather, and every sole is meticulously chosen to ensure unparalleled comfort and durability.
            </p>
            
            <Link
              href="/about"
              className="inline-flex items-center gap-2 type-label text-gold-500 border-b border-gold-500 pb-0.5 hover:opacity-80 transition-opacity"
            >
              Discover Our Heritage
              <ArrowRight size={14} />
            </Link>
          </motion.div>

          {/* Right: Images */}
          <div className="relative h-[500px] w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="absolute top-0 right-0 w-[70%] h-[70%] rounded-[var(--radius-md)] overflow-hidden"
            >
              <Image
                src="/placeholders/shoe.svg"
                alt="Leather craftsmanship"
                fill
                className="object-cover"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute bottom-0 left-0 w-[55%] h-[55%] rounded-[var(--radius-md)] overflow-hidden border-4 border-dark-900"
            >
              <Image
                src="/placeholders/shoe.svg"
                alt="Shoe details"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

