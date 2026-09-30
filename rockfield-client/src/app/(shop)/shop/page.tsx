"use client";

import { Suspense } from "react";
import { useMemo } from "react";
import { useProductFilters } from "@/lib/hooks/useProductFilters";
import { mockProducts, PRICE_MIN, PRICE_MAX } from "@/lib/mock-products";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { SortBar } from "@/components/shop/SortBar";
import { FilterChips } from "@/components/shop/FilterChips";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useIsDesktop } from "@/lib/hooks/useIsDesktop";
import type { ProductCard } from "@/types";

function ShopPageContent() {
  const { filters, activeCount } = useProductFilters();
  const isDesktop = useIsDesktop();

  const filteredProducts = useMemo(() => {
    let result: ProductCard[] = [...mockProducts];

    if (filters.category) {
      result = result.filter((p) => p.category.slug === filters.category);
    }
    if (filters.colours.length > 0) {
      result = result.filter((p) =>
        p.availableColours.some((hex) => filters.colours.includes(hex))
      );
    }
    if (filters.sizes.length > 0) {
      result = result.filter((p) =>
        p.availableSizes.some((s) => filters.sizes.includes(s))
      );
    }
    if (filters.tags.length > 0) {
      result = result.filter((p) =>
        filters.tags.some((tag) => p.tags.includes(tag))
      );
    }
    const min = filters.minPrice ?? PRICE_MIN;
    const max = filters.maxPrice ?? PRICE_MAX;
    result = result.filter((p) => p.basePrice >= min && p.basePrice <= max);

    return [...result].sort((a, b) => {
      switch (filters.sortBy) {
        case "price_asc":   return a.basePrice - b.basePrice;
        case "price_desc":  return b.basePrice - a.basePrice;
        case "rating":      return b.averageRating - a.averageRating;
        case "popularity":  return b.reviewCount - a.reviewCount;
        case "newest":
        default:
          return (a.tags.includes("new") ? -1 : 1) - (b.tags.includes("new") ? -1 : 1);
      }
    });
  }, [filters]);

  return (
    // ✅ Light luxury background — matches your brand theme
    <div className="min-h-screen bg-[#faf8f4]">

      {/* Page header */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 pt-36 pb-8 border-b border-[#e8e2d8]">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-jost text-[10px] tracking-[0.25em] uppercase text-[#b8b0a8]">
            Shop
          </span>
          {filters.category && (
            <>
              <span className="text-[#d8d2c8] text-xs">/</span>
              <span className="font-jost text-[10px] tracking-[0.25em] uppercase text-[#8a8078] capitalize">
                {filters.category}
              </span>
            </>
          )}
        </div>

        {/* Page title */}
        <h1 className="font-cormorant text-4xl md:text-5xl font-light text-[#1a1410] tracking-wide">
          {filters.category
            ? filters.category.charAt(0).toUpperCase() + filters.category.slice(1)
            : "All Collections"}
        </h1>
      </div>

      {/* Main content */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 pb-24">

        <SortBar resultCount={filteredProducts.length} />

        {activeCount > 0 && <FilterChips className="mt-2 mb-2" />}

        <div className="flex gap-12 mt-6">

          {/* Desktop sidebar */}
          {isDesktop && (
            <aside className="w-52 flex-shrink-0">
              <FilterSidebar />
            </aside>
          )}

          {/* Mobile filter button */}
          {!isDesktop && (
            <div className="mb-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="font-jost text-xs tracking-[0.2em] uppercase border-[#d8d2c8] text-[#8a8078] hover:text-[#1a1410] hover:border-[#b8925a] rounded-none bg-transparent"
                  >
                    Filters
                    {activeCount > 0 && (
                      <span className="ml-2 text-[#b8925a]">({activeCount})</span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="bg-[#faf8f4] border-[#e8e2d8] w-72 overflow-y-auto"
                >
                  <div className="pt-6">
                    <FilterSidebar />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            <ProductGrid products={filteredProducts} />
          </div>

        </div>
      </div>
    </div>
  );
}

// Suspense wrapper — required because useSearchParams is used inside
export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopPageContent />
    </Suspense>
  );
}