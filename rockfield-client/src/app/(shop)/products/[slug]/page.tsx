import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProductBySlug, getProductsByCategory, getAllProductSlugs } from '@/services/products'
import { ProductView } from '@/components/product/ProductView'
import { Reviews } from '@/components/product/Reviews'
import { RelatedProducts } from '@/components/product/RelatedProducts'
import { RecentlyViewed } from '@/components/product/RecentlyViewed'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ colour?: string }>
}

// Generate static params for all mock products
export async function generateStaticParams() {
  return (await getAllProductSlugs()).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return { title: 'Product Not Found' }
  }

  return {
    title: product.name,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.substring(0, 160),
      images: [
        {
          url: product.colors[0].images[0].url,
          width: 800,
          height: 1000,
          alt: product.name,
        }
      ]
    }
  }
}

export default async function ProductPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { colour } = await searchParams

  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  // Related products (from same category, excluding current)
  const related = await getProductsByCategory(product.category, 5)
  const filteredRelated = related.filter(p => p.id !== product.id).slice(0, 4)

  // Use colour from URL if valid, otherwise fallback to first colour
  const activeColorId = colour && product.colors.some(c => c.id === colour) 
    ? colour 
    : product.colors[0].id

  return (
    <div className="bg-ivory-50 min-h-screen pb-16">
      <ProductView product={product} activeColorId={activeColorId} />
      
      <div className="container-luxury">
        <Reviews rating={product.rating} count={product.reviewCount} />
        <RelatedProducts products={filteredRelated} />
        <RecentlyViewed />
      </div>
    </div>
  )
}


