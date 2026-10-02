'use client'

import { useState, useEffect } from 'react'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface ProductGalleryProps {
  images: { url: string; alt: string }[]
}

const getZoomSrc = (url: string) => url;

export function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  
  // Hover Zoom State
  const [isHovering, setIsHovering] = useState(false)
  const [origin, setOrigin] = useState({ x: 50, y: 50 })
  
  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lbIdx, setLbIdx] = useState(0)
  const [startX, setStartX] = useState<number | null>(null)

  useEffect(() => {
    if (lightboxOpen) setLbIdx(activeIdx)
  }, [lightboxOpen, activeIdx])

  useEffect(() => {
    if (!lightboxOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setLbIdx(p => Math.max(0, p - 1))
      if (e.key === 'ArrowRight') setLbIdx(p => Math.min(images.length - 1, p + 1))
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, images.length])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(hover: none)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setOrigin({ x, y })
    setIsHovering(true)
  }

  const handlePointerDown = (e: React.PointerEvent) => setStartX(e.clientX)
  const handlePointerUp = (e: React.PointerEvent) => {
    if (startX === null) return
    const deltaX = e.clientX - startX
    if (deltaX > 50 && lbIdx > 0) setLbIdx(lbIdx - 1)
    if (deltaX < -50 && lbIdx < images.length - 1) setLbIdx(lbIdx + 1)
    setStartX(null)
  }

  if (!images.length) {
    return (
      <div className="aspect-shoe-card relative w-full bg-ivory-200 flex items-center justify-center rounded-[var(--radius-md)]">
        <span className="type-eyebrow text-dark-200">No images available</span>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col-reverse md:flex-row gap-4 h-full">
        {/* THUMBNAILS */}
        <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto hide-scrollbar md:w-20 lg:w-24 shrink-0 pb-2 md:pb-0">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={cn(
                "relative aspect-shoe-card w-20 md:w-full shrink-0 overflow-hidden rounded-[var(--radius-sm)] border-2 transition-all outline-none focus-visible:border-gold-500",
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
        <div 
          className="relative aspect-shoe-card w-full md:flex-1 bg-ivory-100 rounded-[var(--radius-md)] overflow-hidden cursor-zoom-in"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setIsHovering(false)}
          onClick={() => setLightboxOpen(true)}
          title="Zoom image"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <div 
                className="w-full h-full transition-transform duration-100 ease-out"
                style={{
                  transform: isHovering ? 'scale(2)' : 'scale(1)',
                  transformOrigin: `${origin.x}% ${origin.y}%`
                }}
              >
                <ImageWithFallback
                  src={images[activeIdx].url}
                  alt={images[activeIdx].alt}
                  fill
                  priority={activeIdx === 0}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent 
          showCloseButton={false} 
          className="max-w-none w-screen h-[100dvh] bg-black/95 rounded-none border-none p-0 flex flex-col items-center justify-center overflow-hidden"
          aria-describedby={undefined}
        >
          <DialogTitle className="sr-only">Product Image Gallery</DialogTitle>
          
          <button 
            onClick={() => setLightboxOpen(false)} 
            aria-label="Close" 
            className="absolute top-4 right-4 md:top-6 md:right-6 text-white p-2 z-50 hover:text-gold-500 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
          >
            <X size={32} strokeWidth={1.5} />
          </button>
          
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 md:px-8 pointer-events-none z-40">
            <button 
              onClick={(e) => { e.stopPropagation(); setLbIdx(p => Math.max(0, p - 1)); }} 
              aria-label="Previous image" 
              disabled={lbIdx === 0} 
              className="pointer-events-auto text-white disabled:opacity-20 hover:text-gold-500 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-gold-500 p-2"
            >
              <ChevronLeft size={40} strokeWidth={1.5} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setLbIdx(p => Math.min(images.length - 1, p + 1)); }} 
              aria-label="Next image" 
              disabled={lbIdx === images.length - 1} 
              className="pointer-events-auto text-white disabled:opacity-20 hover:text-gold-500 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-gold-500 p-2"
            >
              <ChevronRight size={40} strokeWidth={1.5} />
            </button>
          </div>
          
          <div 
            className="w-full h-full relative touch-none"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={lbIdx}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                <ImageWithFallback 
                  src={getZoomSrc(images[lbIdx].url)} 
                  alt={images[lbIdx].alt} 
                  fill 
                  className="object-contain p-4 md:p-12" 
                  sizes="100vw"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute bottom-6 text-white type-label z-50">
            {lbIdx + 1} / {images.length}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
