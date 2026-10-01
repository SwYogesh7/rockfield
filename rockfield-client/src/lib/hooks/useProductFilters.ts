'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import type { SortOption, ShoeCategory, Gender, UkSize, ProductFilters } from '@/types'
import { PRICE_MIN_PAISE, PRICE_MAX_PAISE } from '@/constants'

export function useProductFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const get = (key: string) => searchParams.get(key)
  const getArray = (key: string): string[] => {
    const val = searchParams.get(key)
    return val ? val.split(',').filter(Boolean) : []
  }

  // Derive filters from URL
  const colors = getArray('colors')
  const sizes = getArray('sizes').map(Number) as UkSize[]
  const material = getArray('material')
  const gender = getArray('gender') as Gender[]
  
  // Category can be in URL or path (e.g., /shop/sneakers)
  // But usually we manage it via route params. We'll support it in searchParams for flexibility.
  const categoryParam = getArray('category') as ShoeCategory[]
  const inStockOnly = get('inStockOnly') === 'true'
  const minPrice = get('minPrice') ? Number(get('minPrice')) : undefined
  const maxPrice = get('maxPrice') ? Number(get('maxPrice')) : undefined
  const sortBy = (get('sortBy') as SortOption) ?? 'featured'
  const page = get('page') ? Number(get('page')) : 1

  const activeCount = 
    colors.length + 
    sizes.length + 
    material.length + 
    gender.length + 
    categoryParam.length + 
    (inStockOnly ? 1 : 0) +
    (minPrice !== undefined && minPrice > PRICE_MIN_PAISE ? 1 : 0) +
    (maxPrice !== undefined && maxPrice < PRICE_MAX_PAISE ? 1 : 0)

  // Raw parsed filters ready for service layer
  const parsedFilters: ProductFilters = {
    category: categoryParam.length ? categoryParam : undefined,
    gender: gender.length ? gender : undefined,
    colors: colors.length ? colors : undefined,
    sizes: sizes.length ? sizes : undefined,
    material: material.length ? material : undefined,
    inStockOnly: inStockOnly || undefined,
    minPrice,
    maxPrice,
  }

  const setFilter = useCallback(
    (key: string, value: string | string[] | boolean | number | null) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value === null || value === '' || value === false || (Array.isArray(value) && value.length === 0)) {
        params.delete(key)
      } else if (Array.isArray(value)) {
        params.set(key, value.join(','))
      } else {
        params.set(key, String(value))
      }
      
      // Reset page to 1 when filters change (unless the key being changed is page)
      if (key !== 'page') {
        params.delete('page')
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [searchParams, pathname, router]
  )

  const toggleArrayFilter = useCallback(
    (key: string, value: string) => {
      const val = searchParams.get(key)
      const current = val ? val.split(',').filter(Boolean) : []
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      setFilter(key, next)
    },
    [searchParams, setFilter]
  )

  const clearAll = useCallback(() => {
    // Retain sorting, clear everything else
    const sort = searchParams.get('sortBy')
    const params = new URLSearchParams()
    if (sort) params.set('sortBy', sort)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [router, pathname, searchParams])

  return {
    parsedFilters,
    colors,
    sizes,
    material,
    gender,
    categoryParam,
    inStockOnly,
    minPrice,
    maxPrice,
    sortBy,
    page,
    activeCount,
    setFilter,
    toggleArrayFilter,
    clearAll,
  }
}
