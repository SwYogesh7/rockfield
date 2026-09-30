"use client";

import { useProductFilters } from "@/lib/hooks/useProductFilters";
import { CATEGORIES, ALL_SIZES, PRICE_MIN, PRICE_MAX } from "@/lib/mock-products";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────
// DESIGN TOKENS (local — matches your brand reference)
// ─────────────────────────────────────────────────────────────
const T = {
  gold:       "#b8925a",
  goldLight:  "#f7f1e8",
  text:       "#1a1410",
  textMuted:  "#8a8078",
  textFaint:  "#b8b0a8",
  border:     "#e8e2d8",
  borderHover:"#c8c0b4",
  bg:         "#faf8f4",
  bgHover:    "#f3ede3",
} as const;

// ─────────────────────────────────────────────────────────────
// FilterSection — section wrapper with gold eyebrow line
// ─────────────────────────────────────────────────────────────
function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-6 border-b border-[#e8e2d8]">
      {/* Section label with decorative gold dash */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-4 h-px bg-[#b8925a]" />
        <p className="font-jost text-[10px] tracking-[0.3em] uppercase text-[#b8925a]">
          {title}
        </p>
      </div>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PillButton — size selector
// ─────────────────────────────────────────────────────────────
function PillButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        // Base — square, no border-radius for luxury feel
        "w-11 h-11 border font-jost text-xs tracking-widest",
        "transition-all duration-200 cursor-pointer select-none",
        active
          ? [
              "border-[#b8925a] bg-[#b8925a] text-white",
              "shadow-[inset_0_0_0_1px_#b8925a]",
            ]
          : [
              "border-[#d8d2c8] text-[#8a8078] bg-transparent",
              "hover:border-[#b8925a] hover:text-[#b8925a] hover:bg-[#f7f1e8]",
            ]
      )}
    >
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// ColourSwatch — larger, with label below on hover
// ─────────────────────────────────────────────────────────────
const FILTER_COLOURS = [
  { hex: "#1a1a1a", label: "Black" },
  { hex: "#F5F0E8", label: "Ivory" },
  { hex: "#C9A96E", label: "Camel" },
  { hex: "#1B2A4A", label: "Navy"  },
  { hex: "#7D9B76", label: "Sage"  },
];

function ColourSwatch({
  hex,
  label,
  active,
  onClick,
}: {
  hex: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 group">
      <button
        onClick={onClick}
        title={label}
        aria-label={`Filter by ${label}`}
        aria-pressed={active}
        className={cn(
          // Larger swatch — 32px, more tactile
          "relative w-8 h-8 rounded-full transition-all duration-200",
          "cursor-pointer hover:scale-110",
          // Ivory swatch needs a border so it's visible on white bg
          hex === "#F5F0E8" ? "border border-[#d8d2c8]" : "",
        )}
        style={{ backgroundColor: hex }}
      >
        {/* Active ring */}
        {active && (
          <span className="absolute inset-0 rounded-full ring-2 ring-[#b8925a] ring-offset-2 ring-offset-[#faf8f4]" />
        )}
        {/* Checkmark when active */}
        {active && (
          <span className={cn(
            "absolute inset-0 flex items-center justify-center",
            "text-[10px] font-bold",
            // Dark swatches get white check, light swatches get dark check
            hex === "#F5F0E8" || hex === "#C9A96E" ? "text-[#5a5248]" : "text-white"
          )}>
            ✓
          </span>
        )}
      </button>
      {/* Colour label — always visible, gold when active */}
      <span className={cn(
        "font-jost text-[9px] tracking-widest uppercase transition-colors duration-200",
        active ? "text-[#b8925a]" : "text-[#b8b0a8] group-hover:text-[#8a8078]"
      )}>
        {label}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PriceSlider — custom dual-handle
// ─────────────────────────────────────────────────────────────
function PriceSlider({
  min,
  max,
  onMinChange,
  onMaxChange,
}: {
  min: number;
  max: number;
  onMinChange: (v: number) => void;
  onMaxChange: (v: number) => void;
}) {
  const fmt = (v: number) => `₹${v.toLocaleString("en-IN")}`;
  const pct = (v: number) =>
    ((v - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  return (
    <div>
      {/* Price display */}
      <div className="flex items-center justify-between mb-5">
        <div className="text-center">
          <p className="font-jost text-[9px] tracking-[0.2em] uppercase text-[#b8b0a8] mb-1">From</p>
          <p className="font-cormorant text-base text-[#1a1410]">{fmt(min)}</p>
        </div>
        {/* Connecting line */}
        <div className="flex-1 mx-4 h-px bg-[#e8e2d8]" />
        <div className="text-center">
          <p className="font-jost text-[9px] tracking-[0.2em] uppercase text-[#b8b0a8] mb-1">To</p>
          <p className="font-cormorant text-base text-[#1a1410]">{fmt(max)}</p>
        </div>
      </div>

      {/* Slider track */}
      <div className="relative h-6 mb-2">
        {/* Inputs — invisible but interactive */}
        <input
          type="range"
          min={PRICE_MIN} max={PRICE_MAX} step={500} value={min}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v < max - 500) onMinChange(v);
          }}
          className="price-slider absolute w-full h-full opacity-0 cursor-pointer z-20"
        />
        <input
          type="range"
          min={PRICE_MIN} max={PRICE_MAX} step={500} value={max}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v > min + 500) onMaxChange(v);
          }}
          className="price-slider absolute w-full h-full opacity-0 cursor-pointer z-20"
        />

        {/* Visual track — thin, elegant */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-[1.5px] bg-[#e8e2d8]">
          {/* Gold fill between handles */}
          <div
            className="absolute h-full bg-[#b8925a]"
            style={{
              left:  `${pct(min)}%`,
              right: `${100 - pct(max)}%`,
            }}
          />
        </div>

        {/* Handle dots — larger, more premium */}
        {[min, max].map((val, i) => (
          <div
            key={i}
            className="absolute top-1/2 -translate-y-1/2 z-10 pointer-events-none"
            style={{ left: `calc(${pct(val)}% - 9px)` }}
          >
            {/* Outer ring */}
            <div className="w-[18px] h-[18px] rounded-full border border-[#b8925a] bg-[#faf8f4] flex items-center justify-center">
              {/* Inner dot */}
              <div className="w-[7px] h-[7px] rounded-full bg-[#b8925a]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main FilterSidebar
// ─────────────────────────────────────────────────────────────
export function FilterSidebar({ className }: { className?: string }) {
  const {
    filters,
    setFilter,
    toggleArrayFilter,
    clearAll,
    activeCount,
  } = useProductFilters();

  return (
    <aside className={cn("flex flex-col", className)}>

      {/* ── Header ── */}
      <div className="pb-6 border-b border-[#e8e2d8]">
        <div className="flex items-start justify-between">
          <div>
            {/* Large serif heading — luxury weight */}
            <h2 className="font-cormorant text-2xl font-light text-[#1a1410] tracking-wide leading-none">
              Filters
            </h2>
            {activeCount > 0 && (
              <p className="font-jost text-[10px] tracking-[0.2em] text-[#b8925a] mt-1">
                {activeCount} active
              </p>
            )}
          </div>
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className={cn(
                "font-jost text-[10px] tracking-[0.2em] uppercase mt-1",
                "text-[#b8b0a8] hover:text-[#b8925a]",
                "border-b border-transparent hover:border-[#b8925a]",
                "transition-all duration-200 cursor-pointer pb-px"
              )}
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* ── Category ── */}
      <FilterSection title="Category">
        <div className="flex flex-col">
          {CATEGORIES.map((cat) => {
            const isActive = filters.category === cat.slug;
            return (
              <button
                key={cat.label}
                onClick={() => setFilter("category", cat.slug ?? null)}
                className={cn(
                  "flex items-center justify-between",
                  "py-2 pr-2 transition-all duration-200 cursor-pointer",
                  "border-l-2 pl-3",
                  isActive
                    ? "border-l-[#b8925a] text-[#b8925a]"
                    : "border-l-transparent text-[#8a8078] hover:text-[#1a1410] hover:border-l-[#d8d2c8]"
                )}
              >
                <span className="font-jost text-sm">{cat.label}</span>
                {/* Arrow on active */}
                {isActive && (
                  <span className="text-[#b8925a] text-xs">→</span>
                )}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* ── Colour ── */}
      <FilterSection title="Colour">
        <div className="flex gap-4 flex-wrap">
          {FILTER_COLOURS.map((colour) => (
            <ColourSwatch
              key={colour.hex}
              hex={colour.hex}
              label={colour.label}
              active={filters.colours.includes(colour.hex)}
              onClick={() => toggleArrayFilter("colours", colour.hex)}
            />
          ))}
        </div>
      </FilterSection>

      {/* ── Size ── */}
      <FilterSection title="Size">
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((size) => (
            <PillButton
              key={size}
              label={size}
              active={filters.sizes.includes(size)}
              onClick={() => toggleArrayFilter("sizes", size)}
            />
          ))}
        </div>
        <p className="font-jost text-[10px] text-[#b8b0a8] mt-3 tracking-wider">
          Need help? View size guide →
        </p>
      </FilterSection>

      {/* ── Price Range ── */}
      <FilterSection title="Price Range">
        <PriceSlider
          min={filters.minPrice ?? PRICE_MIN}
          max={filters.maxPrice ?? PRICE_MAX}
          onMinChange={(v) =>
            setFilter("minPrice", v === PRICE_MIN ? null : String(v))
          }
          onMaxChange={(v) =>
            setFilter("maxPrice", v === PRICE_MAX ? null : String(v))
          }
        />
      </FilterSection>

      {/* ── Collection ── */}
      <FilterSection title="Collection">
        <div className="flex flex-col">
          {(
            [
              { tag: "new",        label: "New Arrivals"  },
              { tag: "bestseller", label: "Bestsellers"   },
              { tag: "sale",       label: "Sale"          },
            ] as const
          ).map(({ tag, label }) => {
            const isActive = filters.tags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleArrayFilter("tags", tag)}
                className={cn(
                  "flex items-center justify-between",
                  "py-2 pr-2 transition-all duration-200 cursor-pointer",
                  "border-l-2 pl-3",
                  isActive
                    ? "border-l-[#b8925a] text-[#b8925a]"
                    : "border-l-transparent text-[#8a8078] hover:text-[#1a1410] hover:border-l-[#d8d2c8]"
                )}
              >
                <span className="font-jost text-sm">{label}</span>
                {isActive && (
                  <span className="text-[#b8925a] text-xs">→</span>
                )}
              </button>
            );
          })}
        </div>
      </FilterSection>

    </aside>
  );
}