'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useProductFilters } from '@/lib/hooks/useProductFilters'
import { cn } from '@/lib/utils'
import { PRICE_MIN_PAISE, PRICE_MAX_PAISE } from '@/constants'

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.15 }}
      className={cn(
        'flex items-center gap-2',
        'border border-[#d8d2c8] bg-white px-3 py-1.5',
        'font-jost text-xs text-[#5a5248] tracking-wider',
        'hover:border-[#b8925a] transition-colors duration-200'
      )}
    >
      <span>{label}</span>
      <button
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="text-[#b8b0a8] hover:text-[#b8925a] transition-colors duration-200 cursor-pointer leading-none"
      >
        x
      </button>
    </motion.div>
  )
}

export function FilterChips({ className }: { className?: string }) {
  const { filters, setFilter, clearAll, activeCount } = useProductFilters()

  if (activeCount === 0) return null

  return (
    <div className={cn('flex flex-wrap items-center gap-2 py-3', className)}>
      <AnimatePresence mode="popLayout">
        {filters.category && (
          <Chip
            key="category"
            label={`${(filters.category as string).charAt(0).toUpperCase()}${(filters.category as string).slice(1)}`}
            onRemove={() => setFilter('category', null)}
          />
        )}

        {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
          <Chip
            key="price"
            label={`₹${((filters.minPrice ?? PRICE_MIN_PAISE) / 100).toLocaleString('en-IN')} – ₹${((filters.maxPrice ?? PRICE_MAX_PAISE) / 100).toLocaleString('en-IN')}`}
            onRemove={() => {
              setFilter('minPrice', null)
              setFilter('maxPrice', null)
            }}
          />
        )}

        {activeCount > 1 && (
          <motion.button
            key="clear-all"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={clearAll}
            className="font-jost text-[10px] tracking-[0.2em] uppercase text-[#b8b0a8] hover:text-[#b8925a] transition-colors duration-200 cursor-pointer ml-1 py-1.5"
          >
            Clear all
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
