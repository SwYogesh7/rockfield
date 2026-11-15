// src/lib/quick-add.ts
import type { Product, QuickAddVariant } from '@/types'

/**
 * Picks the variant that "Add to bag" on a product card adds: colours in display order (so the
 * colour shown on the card wins), then the smallest in-stock size within that colour.
 * Returns undefined when every variant is out of stock.
 */
export function getQuickAddVariant(product: Product): QuickAddVariant | undefined {
  for (const color of product.colors) {
    const variant = product.variants
      .filter((v) => v.colorId === color.id && v.stock > 0)
      .sort((a, b) => a.size - b.size)[0]

    if (variant) {
      return {
        variantId: variant.id,
        colorName: color.name,
        size: variant.size,
        image: color.images[0]?.url ?? '',
        unitPrice: variant.price ?? product.basePrice,
        maxStock: variant.stock,
      }
    }
  }
  return undefined
}
