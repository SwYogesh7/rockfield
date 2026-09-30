// src/types/index.ts
// ─────────────────────────────────────────────────────────────
// All TypeScript interfaces for the AURUM platform.
//
// What is an "interface"?
// It describes the SHAPE of an object — what properties
// it has and what type each property is.
//
// What is a "type"?
// Similar to interface but used for unions, primitives,
// and computed types. We use both — interfaces for objects,
// types for unions and aliases.
// ─────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────
// PRODUCT TYPES
// These describe everything related to clothing products.
// ─────────────────────────────────────────────────────────────

// A single image attached to a product variant
export interface ProductImage {
  id: string
  url: string
  altText: string    // important for accessibility + SEO
  width: number
  height: number
  isPrimary: boolean // the main image shown on product card
}

// A variant is one specific version of a product.
// Example: "Blue Silk Dress, Size M" is one variant.
// "Blue Silk Dress, Size L" is a different variant.
// Each variant has its own SKU, stock, and price.
//
// What is SKU?
// Stock Keeping Unit — a unique code for each exact product.
// "SILK-DRESS-BLUE-M" — helps with inventory tracking.
export interface ProductVariant {
  id: string
  sku: string
  colour: string
  colourHex: string       // e.g. "#E8D5B0" — for the colour swatch dot
  size: string            // "XS" | "S" | "M" | "L" | "XL"
  priceOverride: number | null  // if null, use the base product price
  stockQuantity: number
  images: ProductImage[]
  isAvailable: boolean
}

// The main product object
export interface Product {
  id: string
  slug: string             // URL-friendly name: "ivory-silk-dress"
  name: string
  description: string
  shortDescription: string // one line — shown on product card
  category: ProductCategory
  brand: string
  basePrice: number
  compareAtPrice: number | null  // original price before discount
  variants: ProductVariant[]
  tags: string[]           // ["new", "bestseller", "sale"]
  isFeatured: boolean
  isActive: boolean
  averageRating: number
  reviewCount: number
  createdAt: string
}

// A lightweight version of Product used in listing pages.
// We don't need ALL product data for a card —
// loading full descriptions for 40 cards wastes bandwidth.
export interface ProductCard {
  id: string
  slug: string
  name: string
  shortDescription: string
  category: ProductCategory
  basePrice: number
  compareAtPrice: number | null
  primaryImage: ProductImage
  availableColours: string[]   // colour hex values for swatches
  availableSizes: string[]
  tags: string[]
  averageRating: number
  reviewCount: number
}

// Product category
export interface ProductCategory {
  id: string
  name: string
  slug: string       // "women", "men", "accessories"
  imageUrl: string
  parentId: string | null  // null = top-level category
}

// A customer review on a product
export interface ProductReview {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number        // 1 to 5
  title: string
  body: string
  isVerifiedPurchase: boolean
  createdAt: string
}


// ─────────────────────────────────────────────────────────────
// CART TYPES
// The cart lives in Zustand (client state).
// We define its shape here.
// ─────────────────────────────────────────────────────────────

// One item inside the cart
export interface CartItem {
  id: string               // cart item id
  productId: string
  variantId: string
  slug: string             // needed to link back to product page
  name: string
  colour: string
  size: string
  price: number
  quantity: number
  image: ProductImage
  maxQuantity: number      // can't add more than this (stock limit)
}

// The full cart
export interface Cart {
  items: CartItem[]
  couponCode: string | null
  discountAmount: number
  
  // These are computed values — calculated from items
  // We'll derive these in our Zustand store
  subtotal: number
  total: number
  itemCount: number
}


// ─────────────────────────────────────────────────────────────
// USER TYPES
// ─────────────────────────────────────────────────────────────

export interface Address {
  id: string
  label: string        // "Home", "Office", "Other"
  fullName: string
  phone: string
  line1: string
  line2: string | null
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
  avatar: string | null
  addresses: Address[]
  createdAt: string
}


// ─────────────────────────────────────────────────────────────
// ORDER TYPES
// ─────────────────────────────────────────────────────────────

// What is a union type?
// It means the value can be ONE of these specific strings.
// TypeScript will error if you set status = "refunded"
// because "refunded" is not in this list.
export type OrderStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refund_initiated'
  | 'refunded'

export type PaymentMethod =
  | 'upi'
  | 'card'
  | 'netbanking'
  | 'wallet'
  | 'cod'
  | 'emi'

export type PaymentStatus =
  | 'pending'
  | 'captured'
  | 'failed'
  | 'refunded'

// One item within an order
// Note: we store a SNAPSHOT of the product name/price.
// Why? If the product price changes later, the order
// should still show what the customer actually paid.
export interface OrderItem {
  id: string
  productId: string
  variantId: string
  skuSnapshot: string      // SKU at time of purchase
  nameSnapshot: string     // product name at time of purchase
  colourSnapshot: string
  sizeSnapshot: string
  unitPrice: number        // price at time of purchase
  quantity: number
  image: ProductImage
}

export interface Order {
  id: string
  userId: string
  status: OrderStatus
  items: OrderItem[]
  shippingAddress: Address
  subtotal: number
  discountAmount: number
  shippingCost: number
  taxAmount: number
  total: number
  couponCode: string | null
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  razorpayOrderId: string | null
  trackingNumber: string | null
  trackingUrl: string | null
  estimatedDelivery: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

// Lightweight version for order list page
export interface OrderSummary {
  id: string
  status: OrderStatus
  itemCount: number
  total: number
  primaryImage: ProductImage
  primaryItemName: string
  createdAt: string
}


// ─────────────────────────────────────────────────────────────
// API RESPONSE TYPES
// Our .NET API always returns data in a consistent shape.
// This is the "wrapper" around every response.
// ─────────────────────────────────────────────────────────────

// Generic API response — T is a "generic type parameter"
// It means: ApiResponse<Product> = a response containing a Product
//           ApiResponse<Order[]>  = a response containing a list of Orders
// This way we have ONE type that works for ALL responses.
export interface ApiResponse<T> {
  data: T
  message: string | null
  success: boolean
}

// For paginated lists (product listing page)
export interface PaginatedResponse<T> {
  data: T[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

// Error shape — matches RFC 9457 Problem Details
// from our .NET backend
export interface ApiError {
  type: string
  title: string
  status: number
  detail: string
  traceId: string
}


// ─────────────────────────────────────────────────────────────
// FILTER TYPES
// Used on the product listing page
// ─────────────────────────────────────────────────────────────

export interface ProductFilters {
  category: string | null
  minPrice: number | null
  maxPrice: number | null
  colours: string[]
  sizes: string[]
  tags: string[]
  sortBy: SortOption
}

// What is a const enum?
// Like a union type but with named constants —
// makes your code more readable.
// Instead of sortBy = "price_asc" (easy to typo)
// you write sortBy = SortOption.PriceAsc (IDE autocompletes)
export type SortOption =
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'popularity'
  | 'rating'


// ─────────────────────────────────────────────────────────────
// NAVIGATION TYPES
// Used for the navbar mega menu
// ─────────────────────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
  children?: NavSubItem[]  // the ? means this property is optional
}

export interface NavSubItem {
  label: string
  href: string
  description?: string  // optional — shown in mega menu
  imageUrl?: string
}