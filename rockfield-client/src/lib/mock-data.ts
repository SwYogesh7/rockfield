// src/lib/mock-data.ts
// Dummy shoe products for Phase 1. Replaced with real API in Phase 14.
// Money in paise (₹1 = 100 paise).
import type { Product, ProductCardData } from '@/types'

// ---------------------------------------------------------------------------
// Card data (lightweight — used on listing pages)
// ---------------------------------------------------------------------------
export const mockProducts: ProductCardData[] = [
  {
    id: 'rf-001',
    slug: 'terrain-runner-pro',
    name: 'Terrain Runner Pro',
    category: 'sports',
    gender: 'men',
    price: 349900,
    compareAtPrice: 449900,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    colors: [
      { id: 'rf-001-wht', name: 'Cloud White', hex: '#F5F5F5' },
      { id: 'rf-001-blk', name: 'Midnight Black', hex: '#1A1A1A' },
      { id: 'rf-001-red', name: 'Trail Red', hex: '#C0392B' },
    ],
    rating: 4.6,
    reviewCount: 128,
    isNew: false,
    inStock: true,
  },
  {
    id: 'rf-002',
    slug: 'street-bold-low',
    name: 'Street Bold Low',
    category: 'sneakers',
    gender: 'unisex',
    price: 299900,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
    colors: [
      { id: 'rf-002-blk', name: 'Jet Black', hex: '#111111' },
      { id: 'rf-002-wht', name: 'Fresh White', hex: '#FAFAFA' },
    ],
    rating: 4.4,
    reviewCount: 84,
    isNew: true,
    inStock: true,
  },
  {
    id: 'rf-003',
    slug: 'ridge-boot-classic',
    name: 'Ridge Boot Classic',
    category: 'boots',
    gender: 'men',
    price: 499900,
    compareAtPrice: 599900,
    image: 'https://images.unsplash.com/photo-1539185386684-4d8e0098c5be?w=800&q=80',
    colors: [
      { id: 'rf-003-tan', name: 'Tan Brown', hex: '#C68642' },
      { id: 'rf-003-blk', name: 'Black', hex: '#1A1A1A' },
    ],
    rating: 4.8,
    reviewCount: 210,
    isNew: false,
    inStock: true,
  },
  {
    id: 'rf-004',
    slug: 'metro-formal-oxford',
    name: 'Metro Formal Oxford',
    category: 'formal',
    gender: 'men',
    price: 449900,
    image: 'https://images.unsplash.com/photo-1520179800-c54efcea3d61?w=800&q=80',
    colors: [
      { id: 'rf-004-blk', name: 'Polished Black', hex: '#1A1A1A' },
      { id: 'rf-004-brn', name: 'Chestnut', hex: '#954535' },
    ],
    rating: 4.5,
    reviewCount: 67,
    isNew: false,
    inStock: true,
  },
  {
    id: 'rf-005',
    slug: 'drift-casual-slip',
    name: 'Drift Casual Slip',
    category: 'casual',
    gender: 'unisex',
    price: 199900,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
    colors: [
      { id: 'rf-005-nav', name: 'Navy', hex: '#1B2A4A' },
      { id: 'rf-005-grn', name: 'Olive', hex: '#556B2F' },
      { id: 'rf-005-wht', name: 'White', hex: '#FAFAFA' },
    ],
    rating: 4.3,
    reviewCount: 45,
    isNew: true,
    inStock: true,
  },
  {
    id: 'rf-006',
    slug: 'sprint-lite-trainer',
    name: 'Sprint Lite Trainer',
    category: 'sports',
    gender: 'women',
    price: 279900,
    compareAtPrice: 349900,
    image: 'https://images.unsplash.com/photo-1595950653106-6c80ad8d3ba1?w=800&q=80',
    colors: [
      { id: 'rf-006-pnk', name: 'Coral Pink', hex: '#F4978E' },
      { id: 'rf-006-wht', name: 'White', hex: '#FAFAFA' },
    ],
    rating: 4.7,
    reviewCount: 156,
    isNew: false,
    inStock: true,
  },
  {
    id: 'rf-007',
    slug: 'shore-sport-sandal',
    name: 'Shore Sport Sandal',
    category: 'sandals',
    gender: 'unisex',
    price: 149900,
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80',
    colors: [
      { id: 'rf-007-brn', name: 'Tan', hex: '#C68642' },
      { id: 'rf-007-blk', name: 'Black', hex: '#1A1A1A' },
    ],
    rating: 4.2,
    reviewCount: 38,
    isNew: true,
    inStock: true,
  },
  {
    id: 'rf-008',
    slug: 'pave-sneaker-low',
    name: 'Pave Sneaker Low',
    category: 'sneakers',
    gender: 'women',
    price: 249900,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    colors: [
      { id: 'rf-008-wht', name: 'White', hex: '#FAFAFA' },
      { id: 'rf-008-blush', name: 'Blush', hex: '#E8B4B8' },
    ],
    rating: 4.5,
    reviewCount: 72,
    isNew: false,
    inStock: true,
  },
  {
    id: 'rf-009',
    slug: 'cub-first-step',
    name: 'Cub First Step',
    category: 'casual',
    gender: 'kids',
    price: 149900,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
    colors: [
      { id: 'rf-009-red', name: 'Red', hex: '#E74C3C' },
      { id: 'rf-009-blu', name: 'Blue', hex: '#2980B9' },
      { id: 'rf-009-grn', name: 'Green', hex: '#27AE60' },
    ],
    rating: 4.6,
    reviewCount: 93,
    isNew: false,
    inStock: true,
  },
  {
    id: 'rf-010',
    slug: 'ground-zero-boot',
    name: 'Ground Zero Boot',
    category: 'boots',
    gender: 'women',
    price: 399900,
    compareAtPrice: 499900,
    image: 'https://images.unsplash.com/photo-1539185386684-4d8e0098c5be?w=800&q=80',
    colors: [
      { id: 'rf-010-blk', name: 'Black', hex: '#1A1A1A' },
      { id: 'rf-010-tan', name: 'Tan', hex: '#C68642' },
    ],
    rating: 4.9,
    reviewCount: 181,
    isNew: true,
    inStock: true,
  },
]

// ---------------------------------------------------------------------------
// Full product detail data (used on PDP)
// ---------------------------------------------------------------------------
export const mockProductDetails: Product[] = mockProducts.map((card) => ({
  id: card.id,
  slug: card.slug,
  name: card.name,
  description: `The ${card.name} delivers lasting comfort and bold style for everyday wear. Built with quality materials and meticulous craftsmanship, this is footwear you can trust on any terrain.`,
  category: card.category,
  gender: card.gender,
  basePrice: card.price,
  compareAtPrice: card.compareAtPrice,
  colors: card.colors.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.name.toLowerCase().replace(/\s+/g, '-'),
    hex: c.hex,
    images: [
      { url: card.image, alt: `${card.name} — ${c.name} side view`, angle: 'side' as const },
      { url: card.image, alt: `${card.name} — ${c.name} front view`, angle: 'front' as const },
      { url: card.image, alt: `${card.name} — ${c.name} back view`, angle: 'back' as const },
    ],
  })),
  variants: card.colors.flatMap((c) =>
    [5, 6, 7, 8, 9, 10].map((size) => ({
      id: `${card.id}-${c.id}-${size}`,
      sku: `RF-${card.id.toUpperCase()}-${c.id.toUpperCase()}-${size}`,
      colorId: c.id,
      size: size as 5 | 6 | 7 | 8 | 9 | 10,
      stock: size === 8 ? 0 : Math.floor(Math.random() * 10) + 1,
      price: undefined,
    }))
  ),
  attributes: {
    material:
      card.category === 'boots'
        ? 'Full-grain Leather'
        : card.category === 'sports'
          ? 'Mesh + Synthetic'
          : 'Synthetic Leather',
    sole: card.category === 'sports' ? 'EVA Foam' : 'Rubber',
    closure:
      card.category === 'sandals'
        ? 'buckle'
        : card.category === 'casual' && card.slug.includes('slip')
          ? 'slip-on'
          : 'laces',
    useCase:
      card.category === 'sports'
        ? 'Running, Gym, Training'
        : card.category === 'formal'
          ? 'Office, Formal events'
          : card.category === 'boots'
            ? 'Outdoor, Trekking, Daily wear'
            : 'Daily wear',
    care: 'Wipe clean with a damp cloth. Avoid prolonged exposure to water.',
  },
  tags: card.isNew ? ['new'] : card.reviewCount > 100 ? ['bestseller'] : [],
  rating: card.rating,
  reviewCount: card.reviewCount,
  isNew: card.isNew,
  isActive: true,
  createdAt: new Date(Date.now() - card.reviewCount * 24 * 60 * 60 * 1000).toISOString(),
}))
