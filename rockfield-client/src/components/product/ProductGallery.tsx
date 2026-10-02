'use client'

import { useState } from 'react'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  images: { url: string; alt: string }[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0)

  if (!images.length) {
    return (
      <div className="aspect-[4/5] w-full bg-ivory-200 flex items-center justify-center rounded-[var(--radius-md)]">
        <span className="type-eyebrow text-dark-200">No images available</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 h-full">
      {/* THUMBNAILS */}
      <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto hide-scrollbar md:w-20 lg:w-24 shrink-0 pb-2 md:pb-0">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className={cn(
              "relative aspect-[4/5] w-20 md:w-full shrink-0 overflow-hidden rounded-[var(--radius-sm)] border-2 transition-all outline-none focus-visible:border-gold-500",
              activeIdx === idx ? "border-dark-900" : "border-transparent hover:border-ivory-400"
            )}
          >
            <ImageWithFallback
              src={img.url}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="96px"
            />
          </button>
        ))}
      </div>

      {/* MAIN IMAGE */}
      <div className="relative aspect-[4/5] flex-1 bg-ivory-100 rounded-[var(--radius-md)] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <ImageWithFallback
              src={images[activeIdx].url}
              alt={images[activeIdx].alt}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

