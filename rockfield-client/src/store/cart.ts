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

interface AddToCartOptions {
  /** Open the drawer after adding (default true). Listing cards confirm inline instead. */
  openCart?: boolean
}

type PersistedCart = Pick<CartStore, 'items' | 'couponCode' | 'discountAmount'>

const CART_STORAGE_VERSION = 1

/**
 * Cap applied to lines saved before `maxStock` existed (storage v0). Their real stock is
 * unknown, so this keeps the old stepper limit; stock is re-validated at checkout anyway.
 */
export const LEGACY_MAX_STOCK = 10

/** Upgrades carts already saved in localStorage by older builds. */
export function migrateCartState(persisted: unknown, version: number): PersistedCart {
  const state = (persisted ?? {}) as Partial<PersistedCart>
  const items = Array.isArray(state.items) ? state.items : []

  if (version < 1) {
    return {
      couponCode: state.couponCode ?? null,
      discountAmount: state.discountAmount ?? 0,
      items: items.map((item) => ({
        ...item,
        // Never shrink a quantity the customer already has in the bag.
        maxStock:
          typeof item.maxStock === 'number'
            ? item.maxStock
            : Math.max(item.quantity, LEGACY_MAX_STOCK),
      })),
    }
  }

  return { couponCode: state.couponCode ?? null, discountAmount: state.discountAmount ?? 0, items }
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
  addItem: (payload: AddToCartPayload, options?: AddToCartOptions) => void
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

      addItem: (
        { variantId, productId, slug, name, colorName, size, image, unitPrice, maxStock },
        { openCart = true } = {}
      ) => {
        // Nothing to add for an out-of-stock variant (callers should already block this).
        if (maxStock <= 0) return

        set((state) => {
          const existing = state.items.find((i) => i.variantId === variantId)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantId === variantId
                  ? {
                      ...i,
                      // Refresh with the latest known stock, then cap the quantity to it.
                      maxStock,
                      quantity: Math.min(i.quantity + 1, maxStock),
                    }
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
            maxStock,
          }
          return { items: [...state.items, newItem] }
        })
        if (openCart) get().openCart()
      },

      removeItem: (variantId) =>
        set((state) => ({ items: state.items.filter((i) => i.variantId !== variantId) })),

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId)
          return
        }
        // Never exceed the stock recorded for this line, whatever the caller asks for.
        set((state) => ({
          items: state.items.map((i) =>
            i.variantId === variantId ? { ...i, quantity: Math.min(quantity, i.maxStock) } : i
          ),
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
      // v1: CartItem gained `maxStock`. See migrateCartState.
      version: CART_STORAGE_VERSION,
      migrate: migrateCartState,
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        discountAmount: state.discountAmount,
      }),
    }
  )
)
