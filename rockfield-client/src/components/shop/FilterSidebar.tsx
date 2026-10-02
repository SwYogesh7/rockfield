'use client'

import { useProductFilters } from '@/lib/hooks/useProductFilters'
import { PRICE_MIN_PAISE, PRICE_MAX_PAISE } from '@/constants'
import { cn } from '@/lib/utils'
import type { ProductFacets, ShoeCategory, Gender, UkSize } from '@/types'
import { Checkbox } from '@/components/ui/checkbox'

function FilterSection({ title, children, border = true }: { title: string; children: React.ReactNode; border?: boolean }) {
  return (
    <div className={cn('py-6', border && 'border-b border-ivory-300')}>
      <div className="flex items-center gap-3 mb-6">
        <p className="font-body text-[0.625rem] tracking-[0.25em] uppercase text-dark-400">{title}</p>
      </div>
      {children}
    </div>
  )
}

function PillButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-[42px] h-[42px] border font-body text-[0.6875rem] tracking-widest',
        'transition-all duration-300 cursor-pointer select-none rounded-none outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
        active
          ? 'border-dark-900 bg-dark-900 text-ivory-100'
          : 'border-dark-200 text-dark-400 bg-transparent hover:border-dark-400 hover:text-dark-900'
      )}
    >
      {label}
    </button>
  )
}

function ColourSwatch({
  hex,
  label,
  active,
  onClick,
}: {
  hex: string
  label: string
  active: boolean
  onClick: () => void
}) {
  const isLight = ['#F5F5F5','#FAFAFA','#FFFFFF','#FDFCF9','#F5F0E8'].includes(hex.toUpperCase())
  return (
    <div className="flex flex-col items-center gap-2 group w-12">
      <button
        onClick={onClick}
        title={label}
        aria-label={`Filter by ${label}`}
        aria-pressed={active}
        className={cn(
          'relative size-7 rounded-full transition-all duration-300 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
          isLight ? 'border border-dark-200' : ''
        )}
        style={{ backgroundColor: hex }}
      >
        {active && (
          <span className="absolute inset-0 rounded-full ring-1 ring-dark-900 ring-offset-2 ring-offset-ivory-50 scale-110 transition-transform" />
        )}
      </button>
      <span className={cn(
        'font-body text-[8px] text-center leading-tight tracking-widest uppercase transition-colors duration-200',
        active ? 'text-dark-900 font-500' : 'text-dark-200 group-hover:text-dark-400'
      )}>
        {label}
      </span>
    </div>
  )
}

function PriceSlider({
  min,
  max,
  onMinChange,
  onMaxChange,
  facets
}: {
  min: number
  max: number
  onMinChange: (v: number) => void
  onMaxChange: (v: number) => void
  facets: ProductFacets
}) {
  const fmt = (v: number) => `₹${(v / 100).toLocaleString('en-IN')}`
  const rangeMin = Math.min(PRICE_MIN_PAISE, facets.priceRange.min)
  const rangeMax = Math.max(PRICE_MAX_PAISE, facets.priceRange.max)
  
  const diff = rangeMax - rangeMin || 1
  const pct = (v: number) => ((v - rangeMin) / diff) * 100

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="text-left">
          <p className="font-body text-[8px] tracking-[0.2em] uppercase text-dark-200 mb-1">From</p>
          <p className="font-body text-sm text-dark-900">{fmt(min)}</p>
        </div>
        <div className="flex-1 mx-4 h-px bg-ivory-300" />
        <div className="text-right">
          <p className="font-body text-[8px] tracking-[0.2em] uppercase text-dark-200 mb-1">To</p>
          <p className="font-body text-sm text-dark-900">{fmt(max)}</p>
        </div>
      </div>

      <div className="relative h-6 mb-2 price-slider">
        <input
          type="range"
          min={rangeMin}
          max={rangeMax}
          step={10000}
          value={min}
          onChange={(e) => {
            const v = Number(e.target.value)
            if (v < max - 10000) onMinChange(v)
          }}
          className="absolute w-full h-full opacity-0 cursor-pointer z-20"
        />
        <input
          type="range"
          min={rangeMin}
          max={rangeMax}
          step={10000}
          value={max}
          onChange={(e) => {
            const v = Number(e.target.value)
            if (v > min + 10000) onMaxChange(v)
          }}
          className="absolute w-full h-full opacity-0 cursor-pointer z-20"
        />

        <div className="absolute top-1/2 -translate-y-1/2 w-full h-[1px] bg-ivory-300">
          <div
            className="absolute h-full bg-dark-900"
            style={{ left: `${pct(min)}%`, right: `${100 - pct(max)}%` }}
          />
        </div>

        {[min, max].map((val, i) => (
          <div
            key={i}
            className="absolute top-1/2 -translate-y-1/2 z-10 pointer-events-none"
            style={{ left: `calc(${pct(val)}% - 6px)` }}
          >
            <div className="size-3 rounded-full bg-dark-900 ring-2 ring-ivory-50 shadow-sm" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function FilterSidebar({ facets, className }: { facets: ProductFacets; className?: string }) {
  const { parsedFilters, setFilter, toggleArrayFilter, clearAll, activeCount } = useProductFilters()

  return (
    <aside className={cn('flex flex-col pr-4', className)}>
      <div className="pb-8 border-b border-ivory-300">
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-display text-2xl font-500 text-dark-900 tracking-wide leading-none">Filters</h2>
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="font-body text-[9px] tracking-[0.2em] uppercase text-dark-400 hover:text-dark-900 transition-colors duration-300 cursor-pointer outline-none underline underline-offset-4 decoration-ivory-300 hover:decoration-dark-400"
            >
              Clear all
            </button>
          )}
        </div>
        {activeCount > 0 && (
          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-dark-400">
            {activeCount} active {activeCount === 1 ? 'filter' : 'filters'}
          </p>
        )}
      </div>

      <FilterSection title="Availability">
        <div className="flex items-center space-x-4 group cursor-pointer" onClick={() => setFilter('inStockOnly', !parsedFilters.inStockOnly ? true : null)}>
          <Checkbox
            id="inStockOnly"
            checked={parsedFilters.inStockOnly === true}
            onCheckedChange={(checked) => setFilter('inStockOnly', checked === true ? true : null)}
            className="border-ivory-400 data-[state=checked]:bg-dark-900 data-[state=checked]:border-dark-900 rounded-none transition-colors"
          />
          <label htmlFor="inStockOnly" className="font-body text-sm font-400 text-dark-700 group-hover:text-dark-900 cursor-pointer select-none leading-none pt-0.5 transition-colors">
            In Stock Only
          </label>
        </div>
      </FilterSection>

      {facets.categories.length > 0 && (
        <FilterSection title="Category">
          <div className="flex flex-col gap-1">
            {facets.categories.map((cat) => {
              const isActive = parsedFilters.category?.includes(cat.value as ShoeCategory)
              return (
                <button
                  key={cat.value}
                  onClick={() => toggleArrayFilter('category', cat.value)}
                  className={cn(
                    'flex items-center justify-between py-2 pr-2 transition-all duration-200 cursor-pointer border-l-2 pl-3 outline-none focus-visible:bg-ivory-100 rounded-r-sm',
                    isActive ? 'border-l-gold-500 text-gold-500' : 'border-l-transparent text-dark-400 hover:text-dark-900 hover:border-l-dark-200'
                  )}
                >
                  <span className="font-body text-sm capitalize">{cat.label}</span>
                  <span className={cn("font-body text-[10px]", isActive ? "text-gold-500" : "text-dark-200")}>
                    {cat.count}
                  </span>
                </button>
              )
            })}
          </div>
        </FilterSection>
      )}

      {facets.genders.length > 0 && (
        <FilterSection title="Gender">
          <div className="flex flex-col gap-1">
            {facets.genders.map((gen) => {
              const isActive = parsedFilters.gender?.includes(gen.value as Gender)
              return (
                <button
                  key={gen.value}
                  onClick={() => toggleArrayFilter('gender', gen.value)}
                  className={cn(
                    'flex items-center justify-between py-2 pr-2 transition-all duration-200 cursor-pointer border-l-2 pl-3 outline-none focus-visible:bg-ivory-100 rounded-r-sm',
                    isActive ? 'border-l-gold-500 text-gold-500' : 'border-l-transparent text-dark-400 hover:text-dark-900 hover:border-l-dark-200'
                  )}
                >
                  <span className="font-body text-sm capitalize">{gen.label}</span>
                  <span className={cn("font-body text-[10px]", isActive ? "text-gold-500" : "text-dark-200")}>
                    {gen.count}
                  </span>
                </button>
              )
            })}
          </div>
        </FilterSection>
      )}

      {facets.colors.length > 0 && (
        <FilterSection title="Colour">
          <div className="flex gap-4 flex-wrap">
            {facets.colors.map((colour) => (
              <ColourSwatch
                key={colour.value}
                hex={colour.hex}
                label={colour.label}
                active={parsedFilters.colors?.includes(colour.value) || false}
                onClick={() => toggleArrayFilter('colors', colour.value)}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {facets.sizes.length > 0 && (
        <FilterSection title="UK Size">
          <div className="flex flex-wrap gap-2">
            {facets.sizes.map((size) => (
              <PillButton
                key={size.value}
                label={size.value}
                active={parsedFilters.sizes?.includes(Number(size.value) as UkSize) || false}
                onClick={() => toggleArrayFilter('sizes', size.value)}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {facets.materials.length > 0 && (
        <FilterSection title="Material">
          <div className="flex flex-col gap-1">
            {facets.materials.map((mat) => {
              const isActive = parsedFilters.material?.includes(mat.value)
              return (
                <button
                  key={mat.value}
                  onClick={() => toggleArrayFilter('material', mat.value)}
                  className={cn(
                    'flex items-center justify-between py-2 pr-2 transition-all duration-200 cursor-pointer border-l-2 pl-3 outline-none focus-visible:bg-ivory-100 rounded-r-sm',
                    isActive ? 'border-l-gold-500 text-gold-500' : 'border-l-transparent text-dark-400 hover:text-dark-900 hover:border-l-dark-200'
                  )}
                >
                  <span className="font-body text-sm capitalize">{mat.label}</span>
                  <span className={cn("font-body text-[10px]", isActive ? "text-gold-500" : "text-dark-200")}>
                    {mat.count}
                  </span>
                </button>
              )
            })}
          </div>
        </FilterSection>
      )}

      <FilterSection title="Price Range">
        <PriceSlider
          min={parsedFilters.minPrice ?? Math.min(PRICE_MIN_PAISE, facets.priceRange.min)}
          max={parsedFilters.maxPrice ?? Math.max(PRICE_MAX_PAISE, facets.priceRange.max)}
          onMinChange={(v) => setFilter('minPrice', String(v))}
          onMaxChange={(v) => setFilter('maxPrice', String(v))}
          facets={facets}
        />
      </FilterSection>
    </aside>
  )
}



