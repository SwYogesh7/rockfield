"use client";

import { useProductFilters } from "@/lib/hooks/useProductFilters";
import { cn } from "@/lib/utils";
import type { SortOption } from "@/types";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Newest",          value: "newest"     },
  { label: "Price: Low–High", value: "price_asc"  },
  { label: "Price: High–Low", value: "price_desc" },
  { label: "Popularity",      value: "popularity" },
  { label: "Top Rated",       value: "rating"     },
];

interface SortBarProps {
  resultCount: number;
  className?: string;
}

export function SortBar({ resultCount, className }: SortBarProps) {
  const { filters, setFilter } = useProductFilters();

  return (
    <div className={cn(
      "flex items-center justify-between",
      "py-4 border-b border-[#e8e2d8]",
      className
    )}>
      {/* Result count */}
      <p className="font-jost text-sm text-[#8a8078]">
        <span className="text-[#1a1410]">{resultCount}</span>
        {" "}{resultCount === 1 ? "result" : "results"}
      </p>

      {/* Sort dropdown */}
      <div className="flex items-center gap-3">
        <span className="font-jost text-xs text-[#b8b0a8] tracking-wider hidden sm:block">
          Sort
        </span>
        <div className="relative">
          <select
            value={filters.sortBy}
            onChange={(e) => setFilter("sortBy", e.target.value)}
            className={cn(
              "appearance-none",
              "bg-transparent border border-[#d8d2c8] rounded-none",
              "font-jost text-xs text-[#5a5248] tracking-wider",
              "pl-4 pr-8 py-2",
              "hover:border-[#b8925a] focus:outline-none focus:border-[#b8925a]",
              "transition-colors duration-200 cursor-pointer"
            )}
          >
            {SORT_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
                style={{ background: "#faf8f4", color: "#1a1410" }}
              >
                {option.label}
              </option>
            ))}
          </select>
          {/* Custom chevron */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1L5 5L9 1" stroke="#8a8078" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}