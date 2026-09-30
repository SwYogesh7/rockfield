"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useProductFilters } from "@/lib/hooks/useProductFilters";
import { CATEGORIES } from "@/lib/mock-products";
import { cn } from "@/lib/utils";

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "flex items-center gap-2",
        "border border-[#d8d2c8] bg-white px-3 py-1.5",
        "font-jost text-xs text-[#5a5248] tracking-wider",
        "hover:border-[#b8925a] transition-colors duration-200"
      )}
    >
      <span>{label}</span>
      <button
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="text-[#b8b0a8] hover:text-[#b8925a] transition-colors duration-200 cursor-pointer leading-none"
      >
        ×
      </button>
    </motion.div>
  );
}

export function FilterChips({ className }: { className?: string }) {
  const { filters, setFilter, toggleArrayFilter, clearAll, activeCount } = useProductFilters();

  if (activeCount === 0) return null;

  const COLOUR_LABELS: Record<string, string> = {
    "#1a1a1a": "Black",
    "#F5F0E8": "Ivory",
    "#C9A96E": "Camel",
    "#1B2A4A": "Navy",
    "#7D9B76": "Sage",
  };

  const getCategoryLabel = (slug: string) =>
    CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;

  return (
    <div className={cn("flex flex-wrap items-center gap-2 py-3", className)}>
      <AnimatePresence mode="popLayout">

        {filters.category && (
          <Chip key="category"
            label={getCategoryLabel(filters.category)}
            onRemove={() => setFilter("category", null)}
          />
        )}

        {filters.colours.map((hex) => (
          <Chip key={`colour-${hex}`}
            label={COLOUR_LABELS[hex] ?? hex}
            onRemove={() => toggleArrayFilter("colours", hex)}
          />
        ))}

        {filters.sizes.map((size) => (
          <Chip key={`size-${size}`}
            label={`Size ${size}`}
            onRemove={() => toggleArrayFilter("sizes", size)}
          />
        ))}

        {filters.tags.map((tag) => (
          <Chip key={`tag-${tag}`}
            label={tag === "new" ? "New Arrivals" : tag === "bestseller" ? "Bestsellers" : "Sale"}
            onRemove={() => toggleArrayFilter("tags", tag)}
          />
        ))}

        {(filters.minPrice !== null || filters.maxPrice !== null) && (
          <Chip key="price"
            label={`₹${(filters.minPrice ?? 0).toLocaleString("en-IN")} – ₹${(filters.maxPrice ?? 30000).toLocaleString("en-IN")}`}
            onRemove={() => { setFilter("minPrice", null); setFilter("maxPrice", null); }}
          />
        )}

        {activeCount > 1 && (
          <motion.button
            key="clear-all" layout
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={clearAll}
            className="font-jost text-[10px] tracking-[0.2em] uppercase text-[#b8b0a8] hover:text-[#b8925a] transition-colors duration-200 cursor-pointer ml-1 py-1.5"
          >
            Clear all
          </motion.button>
        )}

      </AnimatePresence>
    </div>
  );
}