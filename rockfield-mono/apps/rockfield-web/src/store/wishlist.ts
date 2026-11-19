// src/store/wishlist.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UkSize } from '@/types'

/** A saved variant (colour + size). Field names mirror `CartItem` so items move to the bag easily. */
export interface WishlistItem {
  variantId: string // identifies colour + size
  productId: string
  slug: string
  name: string
  colorName: string
  size: UkSize
  image: string
  unitPrice: number // paise, as shown when saved (may be stale; always re-read before purchase)
}

interface WishlistStore {
  // State
  items: WishlistItem[]

  // Computed
  isWishlisted: (variantId: string) => boolean

  // Actions
  addItem: (item: WishlistItem) => void
  removeItem: (variantId: string) => void
  /** Adds the item if absent, removes it if present. Returns true when it is now wishlisted. */
  toggleItem: (item: WishlistItem) => boolean
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      isWishlisted: (variantId) => get().items.some((i) => i.variantId === variantId),

      addItem: (item) =>
        set((state) => {
          // A variant is wishlisted at most once; re-adding refreshes its saved details.
          if (state.items.some((i) => i.variantId === item.variantId)) {
            return {
              items: state.items.map((i) => (i.variantId === item.variantId ? { ...item } : i)),
            }
          }
          return { items: [...state.items, { ...item }] }
        }),

      removeItem: (variantId) =>
        set((state) => ({ items: state.items.filter((i) => i.variantId !== variantId) })),

      toggleItem: (item) => {
        if (get().isWishlisted(item.variantId)) {
          get().removeItem(item.variantId)
          return false
        }
        get().addItem(item)
        return true
      },
    }),
    {
      name: 'rockfield-wishlist',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
