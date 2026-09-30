"use client";

import { motion } from "framer-motion";
// ✅ Fix 1: default import, no curly braces
import ProductCard from "@/components/product/ProductCard";
import type { ProductCard as ProductCardType } from "@/types";

interface ProductGridProps {
  products: ProductCardType[];
}

// ─────────────────────────────────────────────────────────────
// ADAPTER — bridges ProductCard type → ProductCard component props
//
// The type (from types/index.ts) and the component (built earlier)
// have different prop shapes. Instead of rewriting the component,
// we translate here. This is the "adapter pattern":
// one shape in → different shape out → component is happy.
//
// When you rebuild ProductCard later with real images,
// you update this adapter — nothing else changes.
// ─────────────────────────────────────────────────────────────

// Derives a badge string from a product's tags and prices
// "new" tag   → "New"
// sale price  → "−20%" (calculated discount percentage)
// no match    → null (no badge shown)
function deriveBadge(
  tags: string[],
  basePrice: number,
  compareAtPrice: number | null
): string | null {
  if (tags.includes("new")) return "New";
  if (compareAtPrice && compareAtPrice > basePrice) {
    const discount = Math.round(
      ((compareAtPrice - basePrice) / compareAtPrice) * 100
    );
    return `−${discount}%`;
  }
  return null;
}

// Derives a soft background colour for the card image area.
// Uses the first available colour hex, but heavily lightened.
// We mix it with white by reducing opacity — a simple trick
// that always looks clean regardless of the colour.
//
// If no colours available, falls back to a warm ivory.
function deriveBgColor(availableColours: string[]): string {
  const COLOUR_BG_MAP: Record<string, string> = {
    "#1a1a1a": "#F0EDEA", // black product → warm grey bg
    "#F5F0E8": "#FAF8F5", // ivory product → off-white bg
    "#C9A96E": "#F7F1E8", // camel product → warm cream bg
    "#1B2A4A": "#EAEEf4", // navy product  → cool light bg
    "#7D9B76": "#EDF3EC", // sage product  → soft green bg
  };

  const firstColour = availableColours[0];
  return firstColour
    ? (COLOUR_BG_MAP[firstColour] ?? "#F5F3F0")
    : "#F5F3F0";
}

// Derives a placeholder emoji from category slug.
// Temporary — replaced when real product images arrive.
function deriveEmoji(categorySlug: string): string {
  const EMOJI_MAP: Record<string, string> = {
    women:       "👗",
    men:         "🧥",
    accessories: "👜",
  };
  return EMOJI_MAP[categorySlug] ?? "🛍";
}

// No stagger variants needed here — ProductCard handles
// its own whileInView entrance animation internally.
// We just render the grid layout.

export function ProductGrid({ products }: ProductGridProps) {

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="font-cormorant text-3xl text-white/20 mb-3">
          No results found
        </p>
        <p className="font-jost text-sm text-white/30">
          Try adjusting or clearing your filters
        </p>
      </div>
    );
  }

  return (
    <motion.div
      // key changes when the product list changes —
      // forces React to remount the grid and replay card animations
      key={products.map((p) => p.id).join(",")}
      className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8"
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          // ── Direct mappings ──
          name={product.name}
          subtitle={product.shortDescription}
          price={product.basePrice}
          comparePrice={product.compareAtPrice}
          rating={product.averageRating}
          slug={product.slug}
          index={index}
          // ── Derived mappings (adapter logic) ──
          badge={deriveBadge(
            product.tags,
            product.basePrice,
            product.compareAtPrice
          )}
          bgColor={deriveBgColor(product.availableColours)}
          emoji={deriveEmoji(product.category.slug)}
        />
      ))}
    </motion.div>
  );
}