// src/components/sections/PromoBanner.tsx
'use client'

// Client Component because:
// 1. onMouseEnter on the CTA button
// 2. Framer Motion whileInView scroll animation

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function PromoBanner() {
  return (
    // Section wrapper — same ivory background as rest of page
    // paddingBottom creates space below the banner before footer
    <section style={{
      backgroundColor: 'var(--color-ivory-100)',
      paddingTop: '1rem',
      paddingBottom: '5rem',
    }}>
      <div className="container-luxury">

        {/* ── ANIMATED BANNER CARD ──────────────────────────
            motion.div gives us scroll-triggered entrance.
            The banner slides up and fades in when it enters
            the viewport — draws attention without being flashy.
        ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            backgroundColor: 'var(--color-dark-900)',
            // Dark almost-black background — creates
            // contrast with the ivory page behind it
            borderRadius: '10px',
            padding: 'clamp(1.75rem, 4vw, 2.5rem) clamp(1.75rem, 4vw, 3rem)',
            // clamp() makes padding responsive:
            // small screens: 1.75rem, large screens: 2.5/3rem
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            flexWrap: 'wrap',
            // flexWrap: wrap — on mobile, right side drops below left
          }}
        >

          {/* ── LEFT — Label, Title, Subtitle, CTA ── */}
          <div style={{ flex: 1, minWidth: '240px' }}>
            {/* minWidth: 240px — prevents content from
                becoming unreadably narrow on small screens */}

            {/* Eyebrow label */}
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.625rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--color-gold-500)',
              marginBottom: '0.75rem',
            }}>
              Atelier Private Sale
            </div>

            {/* Banner heading */}
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 300,
              color: 'white',
              lineHeight: 1.2,
              marginBottom: '0.625rem',
            }}>
              The{' '}
              <em style={{
                fontStyle: 'italic',
                color: 'var(--color-gold-500)',
              }}>
                Heritage
              </em>
              {' '}Edit
            </h3>

            {/* Subtitle */}
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              color: 'rgba(255, 255, 255, 0.45)',
              // rgba with opacity — more elegant than a grey hex
              // because it works on any background colour
              lineHeight: 1.6,
              marginBottom: '1.75rem',
            }}>
              Curated archive pieces · Limited quantities · Final sale
            </p>

            {/* CTA Button */}
            <Link
              href="/collections/heritage-sale"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--color-gold-500)',
                color: 'white',
                padding: '0.625rem 1.5rem',
                fontSize: '0.6875rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                transition: 'background-color 250ms ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e =>
                e.currentTarget.style.backgroundColor = 'var(--color-gold-600)'
              }
              onMouseLeave={e =>
                e.currentTarget.style.backgroundColor = 'var(--color-gold-500)'
              }
            >
              Explore Sale
              <ArrowRight size={13} strokeWidth={1.5} />
            </Link>
          </div>

          {/* ── RIGHT — Discount + Note ── */}
          {/* flexShrink: 0 — prevents this from squishing
              when the left side needs more space           */}
          <div style={{
            textAlign: 'right',
            flexShrink: 0,
          }}>

            {/* Large gold discount text */}
            {/* Cormorant Garamond at large size looks
                incredibly elegant — editorial magazine feel */}
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 300,
              color: 'var(--color-gold-500)',
              lineHeight: 1,
              marginBottom: '0.5rem',
            }}>
              Up to 40% off
            </div>

            {/* Expiry note */}
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.3)',
              letterSpacing: '0.05em',
            }}>
              Ends Sunday midnight
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  )
}