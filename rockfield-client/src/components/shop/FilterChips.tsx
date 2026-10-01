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
        'border border-ivory-300 bg-white px-3 py-1.5 rounded-[var(--radius-sm)]',
        'font-body text-xs text-dark-900 tracking-wider',
        'hover:border-gold-500 transition-colors duration-200'
      )}
    >
      <span className="capitalize">{label}</span>
      <button
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="text-dark-200 hover:text-gold-500 transition-colors duration-200 cursor-pointer leading-none outline-none focus-visible:ring-1 focus-visible:ring-gold-500 rounded-full size-4 flex items-center justify-center"
      >
        x
      </button>
    </motion.div>
  )
}

export function FilterChips({ className }: { className?: string }) {
  const { parsedFilters, setFilter, toggleArrayFilter, clearAll, activeCount } = useProductFilters()

  if (activeCount === 0) return null

  return (
    <div className={cn('flex flex-wrap items-center gap-2 py-3', className)}>
      <AnimatePresence mode="popLayout">
        {parsedFilters.category?.map(cat => (
          <Chip key={`cat-${cat}`} label={cat} onRemove={() => toggleArrayFilter('category', cat)} />
        ))}
        {parsedFilters.gender?.map(g => (
          <Chip key={`gen-${g}`} label={g} onRemove={() => toggleArrayFilter('gender', g)} />
        ))}
        {parsedFilters.colors?.map(c => (
          <Chip key={`col-${c}`} label={c} onRemove={() => toggleArrayFilter('colors', c)} />
        ))}
        {parsedFilters.sizes?.map(s => (
          <Chip key={`size-${s}`} label={`UK ${s}`} onRemove={() => toggleArrayFilter('sizes', String(s))} />
        ))}
        {parsedFilters.material?.map(m => (
          <Chip key={`mat-${m}`} label={m} onRemove={() => toggleArrayFilter('material', m)} />
        ))}
        {parsedFilters.inStockOnly && (
          <Chip key="instock" label="In Stock Only" onRemove={() => setFilter('inStockOnly', null)} />
        )}

        {(parsedFilters.minPrice !== undefined || parsedFilters.maxPrice !== undefined) && (
          <Chip
            key="price"
            label={`₹${((parsedFilters.minPrice ?? PRICE_MIN_PAISE) / 100).toLocaleString('en-IN')} – ₹${((parsedFilters.maxPrice ?? PRICE_MAX_PAISE) / 100).toLocaleString('en-IN')}`}
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
            className="font-body text-[10px] font-500 tracking-[0.2em] uppercase text-dark-400 hover:text-gold-500 transition-colors duration-200 cursor-pointer ml-1 py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-sm px-1"
          >
            Clear all
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
