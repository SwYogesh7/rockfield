"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import type { ProductFilters, SortOption } from "@/types";
import { PRICE_MIN, PRICE_MAX } from "@/lib/mock-products";

export function useProductFilters() {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  // Read a single param from the URL
  const get = (key: string) => searchParams.get(key);

  // Read a comma-separated param as an array
  // e.g. ?colours=black,navy  →  ["black", "navy"]
  const getArray = (key: string): string[] => {
    const val = searchParams.get(key);
    return val ? val.split(",").filter(Boolean) : [];
  };

  // Build the filters object from the current URL
  // Every time the URL changes, this re-runs automatically
  const filters: ProductFilters = {
    category: get("category") ?? null,
    colours:  getArray("colours"),
    sizes:    getArray("sizes"),
    tags:     getArray("tags"),
    minPrice: get("minPrice") ? Number(get("minPrice")) : null,
    maxPrice: get("maxPrice") ? Number(get("maxPrice")) : null,
    sortBy:   (get("sortBy") as SortOption) ?? "newest",
  };

  // Updates ONE key in the URL without touching any other params
  const setFilter = useCallback(
    (key: string, value: string | string[] | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      ) {
        // Empty value = remove the param entirely
        params.delete(key);
      } else if (Array.isArray(value)) {
        // Array = join as comma-separated string
        params.set(key, value.join(","));
      } else {
        params.set(key, value);
      }

      // replace (not push) so filters don't pile up in browser history
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  // Adds a value to an array filter if absent, removes it if present
  // e.g. clicking "Black" colour twice: adds then removes
  const toggleArrayFilter = useCallback(
    (key: string, value: string) => {
      const current = getArray(key);
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      setFilter(key, next);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams, setFilter]
  );

  // Removes ALL filters — navigates back to clean /shop
  const clearAll = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  // Total count of active filters — used for the badge on mobile
  // e.g. "Filters (3)"
  const activeCount =
    filters.colours.length +
    filters.sizes.length +
    filters.tags.length +
    (filters.category ? 1 : 0) +
    (filters.minPrice !== null && filters.minPrice > PRICE_MIN ? 1 : 0) +
    (filters.maxPrice !== null && filters.maxPrice < PRICE_MAX ? 1 : 0);

  return {
    filters,
    setFilter,
    toggleArrayFilter,
    clearAll,
    activeCount,
  };
}