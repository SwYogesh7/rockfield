// src/types/index.ts
// Rockfield shoe domain types.
// Money is stored as integer paise (₹1 = 100 paise) to avoid float errors and match Razorpay.

// ---------- Constants ----------

export const GENDERS = ['men', 'women', 'kids', 'unisex'] as const
export type Gender = (typeof GENDERS)[number]

// Basic categories for now; the client can add or remove later.
export const CATEGORIES = ['sneakers', 'formal', 'casual', 'boots', 'sandals', 'sports'] as const
export type ShoeCategory = (typeof CATEGORIES)[number]

// UK/India sizing with half sizes (India uses the UK scale).
export const UK_SIZES = [
  3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13,
] as const
export type UkSize = (typeof UK_SIZES)[number]

// ---------- Product ----------

export interface ProductImage {
  url: string
  alt: string
  /** Suggested order: side, front, back, sole, top, on-foot */
  angle?: 'side' | 'front' | 'back' | 'sole' | 'top' | 'on-foot' | 'detail'
}

export interface ProductColor {
  id: string
  name: string // e.g. "Tan Brown"
  slug: string // e.g. "tan-brown"
  family: string // Normalized family e.g. "brown", "black", "white"
  hex: string // swatch colour
  images: ProductImage[] // 5-6 per colour; first is primary
}

export interface ProductVariant {
  id: string
  sku: string // e.g. RF-SNK-001-TAN-8.5
  colorId: string // links to ProductColor.id
  size: UkSize
  stock: number // tracked per colour x size
  price?: number // paise; overrides Product.basePrice when set
}

export interface ProductAttributes {
  material?: string // Leather, Suede, Mesh...
  sole?: string // Rubber, EVA...
  closure?: 'laces' | 'slip-on' | 'velcro' | 'buckle' | 'zip'
  useCase?: string // Running, Office, Daily wear...
  care?: string
}

export interface Product {
  id: string
  slug: string
  name: string
  tagline: string // Short one-liner
  description: string
  category: ShoeCategory
  gender: Gender
  basePrice: number // paise
  compareAtPrice?: number // paise, original price for sale display
  colors: ProductColor[]
  variants: ProductVariant[]
  attributes: ProductAttributes
  tags: string[]
  rating: number
  reviewCount: number
  isNew: boolean
  isActive: boolean
  createdAt: string // ISO date
}

/** Lightweight shape for listing pages and cards */
export interface ProductCardData {
  id: string
  slug: string
  name: string
  category: ShoeCategory
  gender: Gender
  price: number // lowest variant price, paise
  compareAtPrice?: number
  images: string[] // 1st is primary, 2nd is hover
  colors: Pick<ProductColor, 'id' | 'name' | 'hex' | 'family'>[]
  rating: number
  reviewCount: number
  isNew: boolean
  inStock: boolean
  stockCount?: number // for "Only N left" badge
}

// ---------- Cart ----------

export interface CartItem {
  variantId: string // identifies colour + size
  productId: string
  slug: string
  name: string
  colorName: string
  size: UkSize
  image: string
  unitPrice: number // paise (re-validate on the server at checkout)
  quantity: number
}

// ---------- Filters ----------

export interface ProductFilters {
  category?: ShoeCategory[]
  gender?: Gender[]
  colors?: string[] // colour ids
  sizes?: UkSize[] // matches only sizes that are in stock
  minPrice?: number
  maxPrice?: number
  material?: string[]
  inStockOnly?: boolean
}

export interface FacetCount {
  value: string
  label: string
  count: number
}

export interface ColorFacet extends FacetCount {
  hex: string
}

export interface ProductFacets {
  categories: FacetCount[]
  genders: FacetCount[]
  colors: ColorFacet[]
  sizes: FacetCount[]
  materials: FacetCount[]
  priceRange: { min: number; max: number }
}

export type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating'

// ---------- Order ----------

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'return_initiated'
  | 'returned'

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'emi' | 'cod'

export type PaymentStatus = 'pending' | 'captured' | 'failed' | 'refunded'

export interface Address {
  id: string
  label: string // "Home", "Office"
  fullName: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  addresses: Address[]
  createdAt: string
}

// ---------- API shapes ----------

export interface ApiResponse<T> {
  data: T
  message: string | null
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

/** RFC 9457 Problem Details */
export interface ApiError {
  type: string
  title: string
  status: number
  detail: string
  traceId: string
}
