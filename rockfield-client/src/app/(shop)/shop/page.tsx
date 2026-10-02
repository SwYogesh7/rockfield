import { Metadata } from 'next'
import { ShopView } from '@/components/shop/ShopView'
import { getProducts } from '@/services/products'
import type { ProductFilters, SortOption, ShoeCategory, Gender, UkSize } from '@/types'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
  const query = await searchParams
  // If there are filters applied (other than page/sort), noindex to prevent duplicate content bloat
  const activeFilters = Object.keys(query).filter(k => k !== 'page' && k !== 'sortBy')
  const shouldNoIndex = activeFilters.length > 0

  return {
    title: 'Shop All | Rockfield Footwear',
    description: 'Browse our complete collection of meticulously crafted footwear.',
    alternates: {
      canonical: '/shop',
    },
    robots: {
      index: !shouldNoIndex,
      follow: true,
    }
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  
  // Parse params
  const filters: ProductFilters = {}
  
  if (params.category) filters.category = (params.category as string).split(',') as ShoeCategory[]
  if (params.gender) filters.gender = (params.gender as string).split(',') as Gender[]
  if (params.colors) filters.colors = (params.colors as string).split(',')
  if (params.sizes) filters.sizes = (params.sizes as string).split(',').map(Number) as UkSize[]
  if (params.material) filters.material = (params.material as string).split(',')
  if (params.inStockOnly === 'true') filters.inStockOnly = true
  if (params.minPrice) filters.minPrice = Number(params.minPrice)
  if (params.maxPrice) filters.maxPrice = Number(params.maxPrice)

  const sort = (params.sortBy as SortOption) || 'featured'
  const page = params.page ? Number(params.page) : 1
  const pageSize = 4

  const { items, total, facets } = await getProducts(filters, sort, page, pageSize)
  const totalPages = Math.ceil(total / pageSize)

  return (
    <ShopView 
      title="All Shoes"
      products={items}
      total={total}
      facets={facets}
      totalPages={totalPages}
    />
  )
}


