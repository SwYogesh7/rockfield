// src/services/products.ts
// Product data service. Currently returns mock data.
// In Phase 14, swap the implementations here — callers stay unchanged.
import type { Product, ProductCardData, ProductFilters, SortOption } from '@/types'
import { mockProducts, mockProductDetails } from '@/lib/mock-data'

/** Get all products as card data, optionally filtered and sorted */
export async function getProducts(
  filters?: ProductFilters,
  sort: SortOption = 'featured',
  page = 1,
  pageSize = 24
): Promise<{ items: ProductCardData[]; total: number }> {
  // Simulate network latency in dev
  await new Promise((r) => setTimeout(r, 0))

  let items = [...mockProducts]

  if (filters?.category?.length) {
    items = items.filter((p) => filters.category!.includes(p.category))
  }
  if (filters?.gender?.length) {
    items = items.filter((p) => filters.gender!.includes(p.gender))
  }
  if (filters?.inStockOnly) {
    items = items.filter((p) => p.inStock)
  }
  if (filters?.minPrice !== undefined) {
    items = items.filter((p) => p.price >= filters.minPrice!)
  }
  if (filters?.maxPrice !== undefined) {
    items = items.filter((p) => p.price <= filters.maxPrice!)
  }
  if (filters?.colors?.length) {
    items = items.filter((p) => p.colors.some((c) => filters.colors!.includes(c.id)))
  }
  if (filters?.sizes?.length) {
    // Will be available once we have full variant data
    // For now just return all items with sizes filter noted
  }

  // Sort
  switch (sort) {
    case 'newest':
      items = [...items].sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1))
      break
    case 'price-asc':
      items = [...items].sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      items = [...items].sort((a, b) => b.price - a.price)
      break
    case 'rating':
      items = [...items].sort((a, b) => b.rating - a.rating)
      break
    default:
      break // featured = original order
  }

  const total = items.length
  const start = (page - 1) * pageSize
  items = items.slice(start, start + pageSize)

  return { items, total }
}

/** Get single product by slug */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  await new Promise((r) => setTimeout(r, 0))
  return mockProductDetails.find((p) => p.slug === slug) ?? null
}

/** Get products by category */
export async function getProductsByCategory(
  category: string,
  limit = 8
): Promise<ProductCardData[]> {
  const { items } = await getProducts({ category: [category as never] }, 'featured', 1, limit)
  return items
}

/** Get new arrivals */
export async function getNewArrivals(limit = 8): Promise<ProductCardData[]> {
  const { items } = await getProducts({}, 'newest', 1, limit)
  return items.filter((p) => p.isNew).slice(0, limit)
}

/** Get best sellers (by review count as proxy) */
export async function getBestSellers(limit = 8): Promise<ProductCardData[]> {
  const { items } = await getProducts({}, 'rating', 1, limit)
  return items
}
