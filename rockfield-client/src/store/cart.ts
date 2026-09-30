// src/store/cart.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Cart, CartItem, ProductVariant, Product } from '@/types'

// ─────────────────────────────────────────────────────────────
// What is "persist" middleware?
//
// By default Zustand state lives in MEMORY only.
// If the user refreshes the page → cart is GONE.
// That's a terrible experience.
//
// persist() wraps our store and automatically saves it
// to localStorage whenever state changes, and restores
// it when the page loads again.
//
// User adds item → cart saved to localStorage
// User refreshes → cart restored from localStorage
// User closes browser → cart still there next visit ✅
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// STORE INTERFACE
// This defines what our store contains:
// - the data (state)
// - the functions to change that data (actions)
// ─────────────────────────────────────────────────────────────
interface CartStore {

  // ── STATE ──────────────────────────────
  items: CartItem[]
  isOpen: boolean          // is the cart drawer open?
  couponCode: string | null
  discountAmount: number

  // ── COMPUTED VALUES ────────────────────
  // These are functions that calculate values
  // FROM the state — not stored separately.
  // Why? Because if we stored subtotal separately,
  // we'd have to remember to update it every time
  // items change. Deriving it is safer.
  getSubtotal: () => number
  getTotal: () => number
  getItemCount: () => number
  getIsEmpty: () => boolean

  // ── ACTIONS ────────────────────────────
  // Functions that modify the state
  addItem: (product: Product, variant: ProductVariant, quantity: number) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  applyCoupon: (code: string, discountAmount: number) => void
  removeCoupon: () => void
}

// ─────────────────────────────────────────────────────────────
// CREATE THE STORE
//
// create<CartStore>() — TypeScript knows exactly what
// shape this store must have based on our interface above.
//
// persist(..., { name: 'aurum-cart' }) — saves to
// localStorage under the key "aurum-cart"
// ─────────────────────────────────────────────────────────────
export const useCartStore = create<CartStore>()(
  persist(
    // "set" is the function to update state
    // "get" is the function to READ current state
    (set, get) => ({

      // ── INITIAL STATE ───────────────────
      items: [],
      isOpen: false,
      couponCode: null,
      discountAmount: 0,

      // ── COMPUTED VALUES ─────────────────
      // get() reads the current state inside a function
      getSubtotal: () => {
        const { items } = get()
        return items.reduce(
          (total, item) => total + item.price * item.quantity,
          0  // 0 is the starting value
        )
      },

      getTotal: () => {
        const { getSubtotal, discountAmount } = get()
        // Math.max(0, ...) ensures total never goes negative
        // even if discount is larger than subtotal
        return Math.max(0, getSubtotal() - discountAmount)
      },

      getItemCount: () => {
        const { items } = get()
        // reduce adds up all quantities
        // e.g. 2 dresses + 1 scarf = 3 items
        return items.reduce((count, item) => count + item.quantity, 0)
      },

      getIsEmpty: () => get().items.length === 0,

      // ── ACTIONS ─────────────────────────

      // ADD ITEM
      // This handles two cases:
      // 1. Item not in cart yet → add it
      // 2. Same variant already in cart → increase quantity
      addItem: (product, variant, quantity) => {
        set((state) => {
          // Check if this exact variant is already in cart
          const existingItem = state.items.find(
            (item) => item.variantId === variant.id
          )

          if (existingItem) {
            // Variant exists — just increase quantity
            // but don't exceed available stock
            const newQuantity = Math.min(
              existingItem.quantity + quantity,
              variant.stockQuantity
            )
            return {
              items: state.items.map((item) =>
                item.variantId === variant.id
                  ? { ...item, quantity: newQuantity }
                  : item
                // What is ...item?
                // Spread operator — copies all existing properties
                // then we override just "quantity"
                // This is how you update one property in an immutable way
              ),
            }
          }

          // Variant is new — add it to the cart
          const newItem: CartItem = {
            id: `${product.id}-${variant.id}`,
            productId: product.id,
            variantId: variant.id,
            slug: product.slug,
            name: product.name,
            colour: variant.colour,
            size: variant.size,
            // Use variant price override if it exists,
            // otherwise use the base product price
            price: variant.priceOverride ?? product.basePrice,
            quantity,
            image: variant.images.find((img) => img.isPrimary)
              ?? variant.images[0],  // fallback to first image
            maxQuantity: variant.stockQuantity,
          }

          return { items: [...state.items, newItem] }
          // What is ...state.items?
          // Creates a NEW array with all existing items
          // PLUS the new item at the end.
          // We never mutate (directly modify) the array —
          // we always create a new one. This is immutability.
        })

        // Open the cart drawer automatically when item is added
        get().openCart()
      },

      // REMOVE ITEM
      removeItem: (variantId) => {
        set((state) => ({
          // filter() returns a new array with all items
          // EXCEPT the one with the matching variantId
          items: state.items.filter(
            (item) => item.variantId !== variantId
          ),
        }))
      },

      // UPDATE QUANTITY
      // Called when user clicks + or - in cart drawer
      updateQuantity: (variantId, quantity) => {
        // If quantity drops to 0, remove the item entirely
        if (quantity <= 0) {
          get().removeItem(variantId)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.variantId === variantId
              ? {
                  ...item,
                  // Don't allow going above stock limit
                  quantity: Math.min(quantity, item.maxQuantity),
                }
              : item
          ),
        }))
      },

      // CLEAR CART
      // Called after a successful order is placed
      clearCart: () => {
        set({
          items: [],
          couponCode: null,
          discountAmount: 0,
        })
      },

      // DRAWER CONTROLS
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      // COUPON
      applyCoupon: (code, discountAmount) => {
        set({ couponCode: code, discountAmount })
      },

      removeCoupon: () => {
        set({ couponCode: null, discountAmount: 0 })
      },
    }),

    // ── PERSIST CONFIG ───────────────────
    {
      name: 'aurum-cart',  // localStorage key name

      // partialize — choose WHAT to save to localStorage.
      // We only save items + coupon data.
      // We do NOT save isOpen — cart drawer should always
      // start closed when page loads.
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        discountAmount: state.discountAmount,
      }),
    }
  )
)