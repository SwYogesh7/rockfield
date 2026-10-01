'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '@/store/cart'
import { ProductGallery } from '@/components/product/ProductGallery'
import { ColorSelector } from '@/components/product/ColorSelector'
import { SizeSelector } from '@/components/product/SizeSelector'
import { PincodeChecker } from '@/components/product/PincodeChecker'
import { ProductActions } from '@/components/product/ProductActions'
import { ProductTabs } from '@/components/product/ProductTabs'
import { trackRecentlyViewed } from '@/components/product/RecentlyViewed'
import type { Product, ProductCardData } from '@/types'

interface ProductViewProps {
  product: Product
  activeColorId: string
}

function Breadcrumbs({ category, name }: { category: string; name: string }) {
  return (
    <nav className="flex items-center gap-2 mb-8 overflow-x-auto hide-scrollbar whitespace-nowrap">
      <Link href="/" className="type-label text-dark-400 hover:text-dark-900 transition-colors">Home</Link>
      <ChevronRight size={14} className="text-dark-200" />
      <Link href="/shop" className="type-label text-dark-400 hover:text-dark-900 transition-colors">Shop</Link>
      <ChevronRight size={14} className="text-dark-200" />
      <Link href={`/shop/${category}`} className="type-label text-dark-400 hover:text-dark-900 transition-colors capitalize">{category}</Link>
      <ChevronRight size={14} className="text-dark-200" />
      <span className="type-label text-dark-900 truncate max-w-[200px]">{name}</span>
    </nav>
  )
}

export function ProductView({ product, activeColorId }: ProductViewProps) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null)
  const [prevColorId, setPrevColorId] = useState(activeColorId)
  
  if (activeColorId !== prevColorId) {
    setPrevColorId(activeColorId)
    setSelectedSize(null)
  }

  // Find active color data
  const activeColor = product.colors.find((c) => c.id === activeColorId) || product.colors[0]

  // Track recently viewed on mount
  useEffect(() => {
    const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0)
    const cardData: ProductCardData = {
      id: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      gender: product.gender,
      price: product.basePrice,
      compareAtPrice: product.compareAtPrice,
      images: product.colors[0].images.map(img => img.url),
      colors: product.colors.map(c => ({ id: c.id, name: c.name, hex: c.hex })),
      rating: product.rating,
      reviewCount: product.reviewCount,
      isNew: product.isNew,
      inStock: totalStock > 0,
    }
    trackRecentlyViewed(cardData)
  }, [product])

  // Aggregate total stock for this color to see if it's completely out of stock
  const inStock = product.variants.some((v) => v.stock > 0)

  // Handlers
  const handleAddToCart = () => {
    if (!selectedSize) return
    
    // P4: Cart will be rebuilt properly. For now, mock a toast.
    toast.success('Added to Bag', {
      description: `${product.name} (UK ${selectedSize}, ${activeColor.name})`,
      action: {
        label: 'View Bag',
        onClick: () => useCartStore.getState().openCart()
      }
    })
  }

  return (
    <div className="container-luxury pt-24 lg:pt-32 pb-16">
      <Breadcrumbs category={product.category} name={product.name} />

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        {/* LEFT: GALLERY */}
        <div className="lg:w-3/5">
          {/* Mobile Product Title (visible only on mobile, standard ecommerce pattern) */}
          <div className="lg:hidden mb-6">
            <h1 className="type-h2 mb-2">{product.name}</h1>
            <p className="font-body text-xl font-500 text-dark-900">
              ₹{(product.basePrice / 100).toLocaleString('en-IN')}
            </p>
          </div>
          
          <div className="sticky top-24">
            <ProductGallery images={activeColor.images} />
          </div>
        </div>

        {/* RIGHT: INFO */}
        <div className="lg:w-2/5 flex flex-col">
          <div className="hidden lg:block mb-8">
            <h1 className="type-h2 mb-3">{product.name}</h1>
            <div className="flex items-baseline gap-3">
              <span className="font-body text-2xl font-500 text-dark-900">
                ₹{(product.basePrice / 100).toLocaleString('en-IN')}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.basePrice && (
                <span className="font-body text-base text-dark-400 line-through">
                  ₹{(product.compareAtPrice / 100).toLocaleString('en-IN')}
                </span>
              )}
            </div>
            
            {/* Short description / Tagline */}
            <p className="type-body text-dark-700 mt-4">
              {product.description.split('\n')[0]}
            </p>
          </div>

          <ColorSelector product={product} activeColorId={activeColor.id} />
          
          <SizeSelector 
            variants={product.variants}
            selectedSize={selectedSize}
            onSizeSelect={setSelectedSize}
          />

          <PincodeChecker />

          <ProductActions 
            selectedSize={selectedSize}
            inStock={inStock}
            onAdd={handleAddToCart}
          />

          <ProductTabs 
            description={product.description}
            materials={product.attributes.material || 'Premium leather'}
          />
        </div>

      </div>
    </div>
  )
}
