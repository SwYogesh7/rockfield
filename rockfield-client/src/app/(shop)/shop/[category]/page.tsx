import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ShopView } from '@/components/shop/ShopView'
import { getProducts } from '@/services/products'
import { CATEGORIES, type ShoeCategory, type ProductFilters, type SortOption, type Gender, type UkSize } from '@/types'

export async function generateStaticParams() {
  return CATEGORIES.map((category) => ({
    category,
  }))
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
  const { category } = await params
  
  if (!CATEGORIES.includes(category as ShoeCategory)) {
    return {}
  }

  const query = await searchParams
  const activeFilters = Object.keys(query).filter(k => k !== 'page' && k !== 'sortBy')
  const shouldNoIndex = activeFilters.length > 0

  const title = category.charAt(0).toUpperCase() + category.slice(1)
  
  return {
    title: `${title} Shoes | Rockfield Footwear`,
    description: `Shop our collection of ${category} footwear.`,
    robots: {
      index: !shouldNoIndex,
      follow: true,
    }
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { category } = await params
  
  if (!CATEGORIES.includes(category as ShoeCategory)) {
    notFound()
  }

  const query = await searchParams
  
  // Parse params
  const filters: ProductFilters = {
    category: [category as ShoeCategory]
  }
  
  if (query.gender) filters.gender = (query.gender as string).split(',') as Gender[]
  if (query.colors) filters.colors = (query.colors as string).split(',')
  if (query.sizes) filters.sizes = (query.sizes as string).split(',').map(Number) as UkSize[]
  if (query.material) filters.material = (query.material as string).split(',')
  if (query.inStockOnly === 'true') filters.inStockOnly = true
  if (query.minPrice) filters.minPrice = Number(query.minPrice)
  if (query.maxPrice) filters.maxPrice = Number(query.maxPrice)

  const sort = (query.sortBy as SortOption) || 'featured'
  const page = query.page ? Number(query.page) : 1
  const pageSize = 12

  const { items, total, facets } = await getProducts(filters, sort, page, pageSize)
  const totalPages = Math.ceil(total / pageSize)

  return (
    <ShopView 
      title={`${category} Shoes`}
      products={items}
      total={total}
      facets={facets}
      totalPages={totalPages}
    />
  )
}
