// src/services/products.ts
import type { Product, ProductCardData, ProductFilters, SortOption, ProductFacets, FacetCount, ColorFacet } from '@/types'
import { mockProductDetails } from '@/lib/mock-data'

export async function getProducts(
  filters?: ProductFilters,
  sort: SortOption = 'featured',
  page = 1,
  pageSize = 24
): Promise<{ items: ProductCardData[]; total: number; facets: ProductFacets }> {
  // Simulate network
  await new Promise((r) => setTimeout(r, 0))

  let filtered = [...mockProductDetails]

  // Filtering
  if (filters?.category?.length) {
    filtered = filtered.filter((p) => filters.category!.includes(p.category))
  }
  if (filters?.gender?.length) {
    filtered = filtered.filter((p) => filters.gender!.includes(p.gender))
  }
  if (filters?.material?.length) {
    filtered = filtered.filter((p) => p.attributes.material && filters.material!.includes(p.attributes.material))
  }
  if (filters?.inStockOnly) {
    filtered = filtered.filter((p) => p.variants.some(v => v.stock > 0))
  }
  if (filters?.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.basePrice >= filters.minPrice!)
  }
  if (filters?.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.basePrice <= filters.maxPrice!)
  }
  if (filters?.colors?.length) {
    filtered = filtered.filter((p) => p.colors.some((c) => filters.colors!.includes(c.family || c.name.toLowerCase())))
  }
  if (filters?.sizes?.length) {
    filtered = filtered.filter((p) => 
      p.variants.some((v) => filters.sizes!.includes(v.size) && v.stock > 0)
    )
  }

  // Calculate facets from the filtered set
  const facets: ProductFacets = {
    categories: aggregate(filtered.map(p => p.category)),
    genders: aggregate(filtered.map(p => p.gender)),
    materials: aggregate(filtered.map(p => p.attributes.material).filter(Boolean) as string[]),
    colors: aggregateColors(filtered),
    sizes: aggregateSizes(filtered),
    priceRange: {
      min: Math.min(...filtered.map(p => p.basePrice), 0),
      max: Math.max(...filtered.map(p => p.basePrice), 1000000)
    }
  }

  // Convert to Card Data before sorting
  let items: ProductCardData[] = filtered.map(p => {
    const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0)
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      category: p.category,
      gender: p.gender,
      price: p.basePrice,
      compareAtPrice: p.compareAtPrice,
      images: p.colors[0].images.map(img => img.url),
      colors: p.colors.map(c => ({ id: c.id, name: c.name, hex: c.hex, family: c.family })),
      rating: p.rating,
      reviewCount: p.reviewCount,
      isNew: p.isNew,
      inStock: totalStock > 0,
      stockCount: totalStock > 0 && totalStock <= 3 ? totalStock : undefined
    }
  })

  // Sorting
  switch (sort) {
    case 'newest':
      items = items.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1))
      break
    case 'price-asc':
      items = items.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      items = items.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      items = items.sort((a, b) => b.rating - a.rating)
      break
  }

  const total = items.length
  const start = (page - 1) * pageSize
  items = items.slice(start, start + pageSize)

  return { items, total, facets }
}

function aggregate(items: string[]): FacetCount[] {
  const counts = items.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  return Object.entries(counts).map(([value, count]) => ({
    value,
    label: value.charAt(0).toUpperCase() + value.slice(1),
    count
  })).sort((a, b) => b.count - a.count)
}

function aggregateColors(products: Product[]): ColorFacet[] {
  const map = new Map<string, { count: number, hex: string, label: string }>()
  products.forEach(p => {
    p.colors.forEach(c => {
      const family = c.family || c.name.toLowerCase()
      const existing = map.get(family)
      if (existing) {
        existing.count += 1
      } else {
        map.set(family, { count: 1, hex: c.hex, label: family })
      }
    })
  })
  return Array.from(map.entries()).map(([family, data]) => ({
    value: family,
    label: data.label,
    hex: data.hex,
    count: data.count
  })).sort((a, b) => b.count - a.count)
}

function aggregateSizes(products: Product[]): FacetCount[] {
  const map = new Map<number, number>()
  products.forEach(p => {
    // Only count sizes that are in stock
    const inStockSizes = new Set(p.variants.filter(v => v.stock > 0).map(v => v.size))
    inStockSizes.forEach(size => {
      map.set(size, (map.get(size) || 0) + 1)
    })
  })
  return Array.from(map.entries()).map(([size, count]) => ({
    value: size.toString(),
    label: `UK ${size}`,
    count
  })).sort((a, b) => parseFloat(a.value) - parseFloat(b.value))
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await new Promise((r) => setTimeout(r, 0))
  return mockProductDetails.find((p) => p.slug === slug) ?? null
}

export async function getProductsByCategory(category: string, limit = 8): Promise<ProductCardData[]> {
  const { items } = await getProducts({ category: [category as never] }, 'featured', 1, limit)
  return items
}

export async function getNewArrivals(limit = 8): Promise<ProductCardData[]> {
  const { items } = await getProducts({}, 'newest', 1, limit)
  return items.filter((p) => p.isNew).slice(0, limit)
}

export async function getBestSellers(limit = 8): Promise<ProductCardData[]> {
  const { items } = await getProducts({}, 'rating', 1, limit)
  return items
}




