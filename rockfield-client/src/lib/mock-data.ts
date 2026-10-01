// src/lib/mock-data.ts
import type { Product, ProductCardData, ShoeCategory } from '@/types'

// Reusable mock Unsplash images (shoes)
const images = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
  'https://images.unsplash.com/photo-1539185386684-4d8e0098c5be?w=800&q=80',
  'https://images.unsplash.com/photo-1520179800-c54efcea3d61?w=800&q=80',
  'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
  'https://images.unsplash.com/photo-1595950653106-6c80ad8d3ba1?w=800&q=80',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80',
  'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80',
]

const baseData = [
  {
    id: 'rf-001', slug: 'terrain-runner-pro', name: 'Terrain Runner Pro',
    category: 'sports' as ShoeCategory, gender: 'men' as const, price: 349900, compare: 449900,
    colors: [
      { id: 'wht', name: 'Cloud White', hex: '#F5F5F5' },
      { id: 'blk', name: 'Midnight Black', hex: '#1A1A1A' },
    ],
    rating: 4.6, reviewCount: 128, isNew: false, material: 'Mesh',
  },
  {
    id: 'rf-002', slug: 'street-bold-low', name: 'Street Bold Low',
    category: 'sneakers' as ShoeCategory, gender: 'unisex' as const, price: 299900,
    colors: [
      { id: 'blk', name: 'Jet Black', hex: '#111111' },
      { id: 'wht', name: 'Fresh White', hex: '#FAFAFA' },
    ],
    rating: 4.4, reviewCount: 84, isNew: true, material: 'Leather',
  },
  {
    id: 'rf-003', slug: 'ridge-boot-classic', name: 'Ridge Boot Classic',
    category: 'boots' as ShoeCategory, gender: 'men' as const, price: 499900, compare: 599900,
    colors: [{ id: 'tan', name: 'Tan Brown', hex: '#C68642' }],
    rating: 4.8, reviewCount: 210, isNew: false, material: 'Leather',
  },
  {
    id: 'rf-004', slug: 'metro-formal-oxford', name: 'Metro Formal Oxford',
    category: 'formal' as ShoeCategory, gender: 'men' as const, price: 449900,
    colors: [
      { id: 'blk', name: 'Polished Black', hex: '#1A1A1A' },
      { id: 'brn', name: 'Chestnut', hex: '#954535' },
    ],
    rating: 4.5, reviewCount: 67, isNew: false, material: 'Leather',
  },
  {
    id: 'rf-005', slug: 'drift-casual-slip', name: 'Drift Casual Slip',
    category: 'casual' as ShoeCategory, gender: 'unisex' as const, price: 199900,
    colors: [{ id: 'nav', name: 'Navy', hex: '#1B2A4A' }],
    rating: 4.3, reviewCount: 45, isNew: true, material: 'Canvas',
  },
  {
    id: 'rf-006', slug: 'sprint-lite-trainer', name: 'Sprint Lite Trainer',
    category: 'sports' as ShoeCategory, gender: 'women' as const, price: 279900, compare: 349900,
    colors: [{ id: 'pnk', name: 'Coral Pink', hex: '#F4978E' }],
    rating: 4.7, reviewCount: 156, isNew: false, material: 'Mesh',
  },
  {
    id: 'rf-007', slug: 'shore-sport-sandal', name: 'Shore Sport Sandal',
    category: 'sandals' as ShoeCategory, gender: 'unisex' as const, price: 149900,
    colors: [{ id: 'brn', name: 'Tan', hex: '#C68642' }],
    rating: 4.2, reviewCount: 38, isNew: true, material: 'Synthetic',
  },
  {
    id: 'rf-008', slug: 'pave-sneaker-low', name: 'Pave Sneaker Low',
    category: 'sneakers' as ShoeCategory, gender: 'women' as const, price: 249900,
    colors: [{ id: 'wht', name: 'White', hex: '#FAFAFA' }],
    rating: 4.5, reviewCount: 72, isNew: false, material: 'Leather',
  },
]

export const mockProductDetails: Product[] = baseData.map((data, i) => {
  const imgIdx = i % images.length
  const hoverImgIdx = (i + 1) % images.length

  const colors = data.colors.map(c => ({
    id: `${data.id}-${c.id}`,
    name: c.name,
    slug: c.name.toLowerCase().replace(/\s+/g, '-'),
    hex: c.hex,
    images: [
      { url: images[imgIdx], alt: `${data.name} side`, angle: 'side' as const },
      { url: images[hoverImgIdx], alt: `${data.name} front`, angle: 'front' as const },
    ],
  }))

  const variants = colors.flatMap(c => 
    ([6, 7, 8, 9, 10, 11] as const).map(size => {
      // Simulate some sizes out of stock, some low stock
      const r = Math.random()
      const stock = r > 0.8 ? 0 : r > 0.6 ? 2 : 10
      return {
        id: `${c.id}-${size}`,
        sku: `RF-${data.id.toUpperCase()}-${c.id.toUpperCase()}-${size}`,
        colorId: c.id,
        size,
        stock,
      }
    })
  )

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    description: `The ${data.name} delivers lasting comfort. Built for performance and style.`,
    category: data.category,
    gender: data.gender,
    basePrice: data.price,
    compareAtPrice: data.compare,
    colors,
    variants,
    attributes: {
      material: data.material,
      sole: 'Rubber',
      closure: data.category === 'sandals' ? 'buckle' : 'laces',
      useCase: 'Daily Wear',
      care: 'Wipe clean',
    },
    tags: data.isNew ? ['new'] : [],
    rating: data.rating,
    reviewCount: data.reviewCount,
    isNew: data.isNew,
    isActive: true,
    createdAt: new Date().toISOString(),
  }
})

// Derive card data format from full details
export const mockProducts: ProductCardData[] = mockProductDetails.map(p => {
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
    colors: p.colors.map(c => ({ id: c.id, name: c.name, hex: c.hex })),
    rating: p.rating,
    reviewCount: p.reviewCount,
    isNew: p.isNew,
    inStock: totalStock > 0,
    stockCount: totalStock > 0 && totalStock <= 3 ? totalStock : undefined // Only show if <= 3 left overall for card
  }
})
