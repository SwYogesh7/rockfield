// src/store/cart.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, UkSize } from '@/types'

interface AddToCartPayload {
  variantId: string
  productId: string
  slug: string
  name: string
  colorName: string
  size: UkSize
  image: string
  unitPrice: number // paise
  maxStock: number
}

interface CartStore {
  // State
  items: CartItem[]
  isOpen: boolean
  couponCode: string | null
  discountAmount: number // paise

  // Computed
  getSubtotal: () => number
  getTotal: () => number
  getItemCount: () => number
  getIsEmpty: () => boolean

  // Actions
  addItem: (payload: AddToCartPayload) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  applyCoupon: (code: string, discountAmount: number) => void
  removeCoupon: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: null,
      discountAmount: 0,

      getSubtotal: () =>
        get().items.reduce((total, item) => total + item.unitPrice * item.quantity, 0),

      getTotal: () => Math.max(0, get().getSubtotal() - get().discountAmount),

      getItemCount: () => get().items.reduce((count, item) => count + item.quantity, 0),

      getIsEmpty: () => get().items.length === 0,

      addItem: ({
        variantId,
        productId,
        slug,
        name,
        colorName,
        size,
        image,
        unitPrice,
        maxStock,
      }) => {
        set((state) => {
          const existing = state.items.find((i) => i.variantId === variantId)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantId === variantId
                  ? { ...i, quantity: Math.min(i.quantity + 1, maxStock) }
                  : i
              ),
            }
          }
          const newItem: CartItem = {
            variantId,
            productId,
            slug,
            name,
            colorName,
            size,
            image,
            unitPrice,
            quantity: 1,
          }
          return { items: [...state.items, newItem] }
        })
        get().openCart()
      },

      removeItem: (variantId) =>
        set((state) => ({ items: state.items.filter((i) => i.variantId !== variantId) })),

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId)
          return
        }
        set((state) => ({
          items: state.items.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)),
        }))
      },

      clearCart: () => set({ items: [], couponCode: null, discountAmount: 0 }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      applyCoupon: (code, discountAmount) => set({ couponCode: code, discountAmount }),
      removeCoupon: () => set({ couponCode: null, discountAmount: 0 }),
    }),
    {
      name: 'rockfield-cart', // renamed from aurum-cart
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        discountAmount: state.discountAmount,
      }),
    }
  )
)
