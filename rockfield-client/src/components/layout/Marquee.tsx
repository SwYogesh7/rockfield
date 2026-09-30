// src/components/layout/Marquee.tsx
// No 'use client' needed — this is a Server Component.
// It has no state, no browser APIs, no hooks.
// Pure HTML + CSS animation = renders on server, zero JS sent to browser.

// ─────────────────────────────────────────────────────────────
// MARQUEE ITEMS
// These are the messages that scroll across the ticker.
// Keep them short — they need to be readable at scroll speed.
// ─────────────────────────────────────────────────────────────
const marqueeItems = [
  'Free shipping on orders above ₹5,000',
  'Heritage textiles — ethically sourced',
  'New arrivals every Thursday',
  'Complimentary gift wrapping',
  'Free returns within 15 days',
  'Crafted for the considered wardrobe',
]

// The gold dot separator between items
function GoldDot() {
  return (
    <span
      style={{
        display: 'inline-block',
        width: '3px',
        height: '3px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-gold-500)',
        flexShrink: 0,
      }}
    />
  )
}

// A single marquee item — text + separator dot
function MarqueeItem({ text }: { text: string }) {
  return (
    // display: contents means this wrapper doesn't add any box
    // The children (dot + text) flow directly into the flex parent
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '1.5rem',
        flexShrink: 0,
      }}
    >
      <GoldDot />
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.625rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'rgba(255, 255, 255, 0.55)',
          whiteSpace: 'nowrap',
          // whiteSpace: nowrap — prevents text from wrapping to next line
          // Critical: if text wraps, the scroll animation breaks
        }}
      >
        {text}
      </span>
    </span>
  )
}

export default function Marquee() {
  return (
    // aria-hidden="true" tells screen readers to skip this.
    // Why? Screen readers would read "Free shipping... Heritage textiles..."
    // over and over as it loops — very annoying for visually impaired users.
    // The content is decorative/supplementary, not critical information.
    <div
      aria-hidden="true"
      style={{
        backgroundColor: 'var(--color-dark-900)',
        paddingTop: '0.75rem',
        paddingBottom: '0.75rem',
        overflow: 'hidden', // hides items outside the visible area
        width: '100%',
      }}
    >
      {/* ── TRACK ───────────────────────────────────────────
          This div is WIDER than its container — it holds
          ALL items (original + duplicate) side by side.
          The animation slides it left continuously.
          overflow: hidden on the parent clips it.
      ─────────────────────────────────────────────────────── */}
      <div
        className="marquee-track"
        // marquee-track applies our CSS keyframe animation
        style={{
          display: 'inline-flex',
          // inline-flex = shrinks to fit content width
          // (unlike flex which stretches to 100%)
          alignItems: 'center',
          gap: '3rem',
          willChange: 'transform',
          // willChange: transform — hints to browser to put this
          // element on its own GPU layer BEFORE animation starts.
          // Prevents janky first frame and reduces CPU usage.
        }}
      >
        {/* ── ORIGINAL SET ── */}
        {marqueeItems.map((item, index) => (
          <MarqueeItem key={`original-${index}`} text={item} />
        ))}

        {/* ── DUPLICATE SET ── */}
        {/* Exact copy of the items above.
            When the original set scrolls off-screen to the left,
            this duplicate is already in position to the right.
            The animation then loops — user sees no gap or jump.
            aria-hidden already on the parent so no double-reading. */}
        {marqueeItems.map((item, index) => (
          <MarqueeItem key={`duplicate-${index}`} text={item} />
        ))}
      </div>
    </div>
  )
}
