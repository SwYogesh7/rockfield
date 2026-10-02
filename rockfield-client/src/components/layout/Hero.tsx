'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { useIsDesktop } from '@/lib/hooks/useIsDesktop'
import { Button } from '@/components/ui/button'

type HeroSlide = {
  id: string
  eyebrow: string
  headingLine1: string
  headingLine2: string
  headingItalic?: string
  description: string
  ctaPrimary: { label: string; href: string }
  ctaSecondary?: { label: string; href: string }
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    eyebrow: 'New Season — SS 2026',
    headingLine1: 'Crafted for',
    headingItalic: 'the Long',
    headingLine2: 'Walk',
    description: 'Premium footwear built for every road. Sneakers, boots, and everyday shoes — crafted with care, sized for India.',
    ctaPrimary: { label: 'Shop Now', href: '/shop' },
    ctaSecondary: { label: 'New Arrivals', href: '/shop?sortBy=newest' },
  },
  {
    id: 'slide-2',
    eyebrow: 'Heritage Collection',
    headingLine1: 'Classic',
    headingItalic: 'Leather',
    headingLine2: 'Boots',
    description: 'Timeless design meets modern comfort. Our heritage boots are designed to age beautifully and last a lifetime.',
    ctaPrimary: { label: 'Explore Boots', href: '/shop/boots' },
  }
]

export default function Hero() {
  const isDesktop = useIsDesktop()
  const [currentSlide, setCurrentSlide] = useState(0)

  const slide = HERO_SLIDES[currentSlide]

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(nextSlide, 8000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative w-full bg-ivory-100 flex flex-col lg:flex-row min-h-screen">
      
      {/* ── LEFT COLUMN — text content ── */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-20 pt-32 pb-16 lg:pt-40 lg:pb-32 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <span className="block w-8 h-px bg-gold-500" />
              <span className="type-eyebrow text-dark-900">{slide.eyebrow}</span>
            </div>

            {/* Heading */}
            <h1 className="type-h1 text-dark-900 mb-6">
              {slide.headingLine1}{' '}
              {slide.headingItalic && <em className="italic text-gold-500">{slide.headingItalic}</em>}
              <br />
              {slide.headingLine2}
            </h1>

            {/* Description */}
            <p className="type-body text-dark-400 mb-10">
              {slide.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-6">
              <Button asChild>
                <Link href={slide.ctaPrimary.href}>
                  {slide.ctaPrimary.label}
                </Link>
              </Button>
              
              {slide.ctaSecondary && (
                <Button variant="link" className="px-0 uppercase tracking-widest" asChild>
                  <Link href={slide.ctaSecondary.href}>
                    {slide.ctaSecondary.label}
                  </Link>
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Controls */}
        <div className="absolute bottom-10 left-6 md:left-12 lg:left-20 flex items-center gap-4">
          <button onClick={prevSlide} className="size-10 rounded-full border border-dark-200 flex items-center justify-center text-dark-400 hover:border-gold-500 hover:text-gold-500 transition-colors" aria-label="Previous slide">
            <ArrowLeft size={16} />
          </button>
          <div className="type-label text-dark-400">
            0{currentSlide + 1} / 0{HERO_SLIDES.length}
          </div>
          <button onClick={nextSlide} className="size-10 rounded-full border border-dark-200 flex items-center justify-center text-dark-400 hover:border-gold-500 hover:text-gold-500 transition-colors" aria-label="Next slide">
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* ── RIGHT COLUMN — config-driven aspect ratio image ── */}
      <div className="flex-1 w-full flex items-center justify-center lg:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id + '-img'}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7 }}
            className={`w-full bg-ivory-200 relative overflow-hidden flex items-center justify-center rounded-[var(--radius-md)] ${
              isDesktop ? 'aspect-video' : 'aspect-[4/5]'
            }`}
          >
            {/* Ivory placeholder config */}
            <span className="type-eyebrow text-dark-200 absolute">
              Placeholder: {isDesktop ? '16:9 Desktop' : '4:5 Mobile'}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

    </section>
  )
}

