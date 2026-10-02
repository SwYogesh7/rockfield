import type { Product, ProductCardData, ShoeCategory } from '@/types'

// Reusable mock local images (shoes)
const images = [
  '/placeholders/shoe.svg',
  '/placeholders/shoe.svg',
  '/placeholders/shoe.svg',
  '/placeholders/shoe.svg',
  '/placeholders/shoe.svg',
  '/placeholders/shoe.svg',
  '/placeholders/shoe.svg',
  '/placeholders/shoe.svg',
]

const baseData = [
  {
    id: 'rf-001', slug: 'terrain-runner-pro', name: 'Terrain Runner Pro', tagline: 'All-terrain performance runner.',
    category: 'sports' as ShoeCategory, gender: 'men' as const, price: 349900, compare: 449900,
    colors: [
      { id: 'wht', name: 'Cloud White', hex: '#F5F5F5', family: 'white' },
      { id: 'blk', name: 'Midnight Black', hex: '#1A1A1A', family: 'black' },
    ],
    rating: 4.6, reviewCount: 128, isNew: false, material: 'Mesh',
  },
  {
    id: 'rf-002', slug: 'street-bold-low', name: 'Street Bold Low', tagline: 'Classic street style sneaker.',
    category: 'sneakers' as ShoeCategory, gender: 'unisex' as const, price: 299900,
    colors: [
      { id: 'blk', name: 'Jet Black', hex: '#111111', family: 'black' },
      { id: 'wht', name: 'Fresh White', hex: '#FAFAFA', family: 'white' },
    ],
    rating: 4.4, reviewCount: 84, isNew: true, material: 'Leather',
  },
  {
    id: 'rf-003', slug: 'ridge-boot-classic', name: 'Ridge Boot Classic', tagline: 'Durable boot for the daily grind.',
    category: 'boots' as ShoeCategory, gender: 'men' as const, price: 499900, compare: 599900,
    colors: [{ id: 'tan', name: 'Tan Brown', hex: '#C68642', family: 'brown' }],
    rating: 4.8, reviewCount: 210, isNew: false, material: 'Leather',
  },
  {
    id: 'rf-004', slug: 'metro-formal-oxford', name: 'Metro Formal Oxford', tagline: 'Sharp oxford for the modern office.',
    category: 'formal' as ShoeCategory, gender: 'men' as const, price: 449900,
    colors: [
      { id: 'blk', name: 'Polished Black', hex: '#1A1A1A', family: 'black' },
      { id: 'brn', name: 'Chestnut', hex: '#954535', family: 'brown' },
    ],
    rating: 4.5, reviewCount: 67, isNew: false, material: 'Leather',
  },
  {
    id: 'rf-005', slug: 'drift-casual-slip', name: 'Drift Casual Slip', tagline: 'Easy slip-on for weekend ease.',
    category: 'casual' as ShoeCategory, gender: 'unisex' as const, price: 199900,
    colors: [{ id: 'nav', name: 'Navy', hex: '#1B2A4A', family: 'blue' }],
    rating: 4.3, reviewCount: 45, isNew: true, material: 'Canvas',
  },
  {
    id: 'rf-006', slug: 'sprint-lite-trainer', name: 'Sprint Lite Trainer', tagline: 'Feather-light running shoe.',
    category: 'sports' as ShoeCategory, gender: 'women' as const, price: 279900, compare: 349900,
    colors: [{ id: 'pnk', name: 'Coral Pink', hex: '#F4978E', family: 'pink' }],
    rating: 4.7, reviewCount: 156, isNew: false, material: 'Mesh',
  },
  {
    id: 'rf-007', slug: 'shore-sport-sandal', name: 'Shore Sport Sandal', tagline: 'Water-ready adjustable sandal.',
    category: 'sandals' as ShoeCategory, gender: 'unisex' as const, price: 149900,
    colors: [{ id: 'brn', name: 'Tan', hex: '#C68642', family: 'brown' }],
    rating: 4.2, reviewCount: 38, isNew: true, material: 'Synthetic',
  },
  {
    id: 'rf-008', slug: 'pave-sneaker-low', name: 'Pave Sneaker Low', tagline: 'Minimalist low-top leather sneaker.',
    category: 'sneakers' as ShoeCategory, gender: 'women' as const, price: 249900,
    colors: [{ id: 'wht', name: 'White', hex: '#FAFAFA', family: 'white' }],
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
    family: c.family,
    hex: c.hex,
    images: [
      { url: images[imgIdx], alt: `${data.name} side`, angle: 'side' as const },
      { url: images[hoverImgIdx], alt: `${data.name} front`, angle: 'front' as const },
      { url: images[imgIdx], alt: `${data.name} back`, angle: 'back' as const },
      { url: images[hoverImgIdx], alt: `${data.name} top`, angle: 'top' as const },
      { url: images[imgIdx], alt: `${data.name} detail`, angle: 'detail' as const },
    ],
  }))

  const variants = colors.flatMap(c => 
    ([6, 7, 8, 9, 10, 11] as const).map(size => {
      const r = Math.random()
      const stock = r > 0.8 ? 0 : r > 0.6 ? 2 : 10
      return {
        id: `${c.id}-${size}`,
        sku: `RF-${data.id.toUpperCase()}-${c.id.split('-').pop()?.toUpperCase()}-${size}`,
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
    tagline: data.tagline,
    description: `The ${data.name} delivers lasting comfort. Built for performance and style. Made with premium materials.`,
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
    },
    tags: [data.category, data.material],
    rating: data.rating,
    reviewCount: data.reviewCount,
    isNew: data.isNew,
    isActive: true,
    createdAt: new Date().toISOString(),
  }
})

export const mockProductCards: ProductCardData[] = mockProductDetails.map(p => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  category: p.category,
  gender: p.gender,
  price: p.basePrice,
  compareAtPrice: p.compareAtPrice,
  images: p.colors[0]?.images.slice(0, 2).map(img => img.url) || [],
  colors: p.colors.map(c => ({ id: c.id, name: c.name, hex: c.hex, family: c.family })),
  rating: p.rating,
  reviewCount: p.reviewCount,
  isNew: p.isNew,
  inStock: p.variants.some(v => v.stock > 0),
  stockCount: p.variants.reduce((acc, v) => acc + v.stock, 0),
}))
