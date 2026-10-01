'use client'

import { useProductFilters } from '@/lib/hooks/useProductFilters'
import { cn } from '@/lib/utils'
import type { SortOption } from '@/types'

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Featured', value: 'featured' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low-High', value: 'price-asc' },
  { label: 'Price: High-Low', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating' },
]

interface SortBarProps {
  resultCount: number
  className?: string
}

export function SortBar({ resultCount, className }: SortBarProps) {
  const { sortBy, setFilter } = useProductFilters()

  return (
    <div
      className={cn(
        'flex items-center justify-between',
        'py-4 border-b border-ivory-300',
        className
      )}
    >
      <p className="font-body text-sm text-dark-400">
        <span className="text-dark-900 font-500">{resultCount}</span>{' '}
        {resultCount === 1 ? 'result' : 'results'}
      </p>

      <div className="flex items-center gap-3">
        <span className="font-body text-xs text-dark-400 tracking-wider hidden sm:block uppercase">
          Sort
        </span>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setFilter('sortBy', e.target.value)}
            className={cn(
              'appearance-none',
              'bg-transparent border-none',
              'font-body text-xs text-dark-900 tracking-wider',
              'pl-4 pr-8 py-2',
              'focus:outline-none hover:text-gold-500',
              'transition-colors duration-200 cursor-pointer'
            )}
          >
            {SORT_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
                style={{ background: '#faf8f4', color: '#1a1410' }}
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path
                d="M1 1L5 5L9 1"
                stroke="currentColor"
                className="text-dark-400"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
