// src/components/layout/Hero.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useIsDesktop } from '@/lib/hooks/useIsDesktop'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

const imagePanelVariants = {
  hidden: { opacity: 0, x: 48 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] as const, delay: 0.3 },
  },
}

// ─────────────────────────────────────────────────────────────
// Ivory placeholder panel — neutral warm rectangle.
// No emoji. Same aspect ratio maintained as the real image will be.
// ─────────────────────────────────────────────────────────────
function ImagePlaceholder({
  bg = 'var(--color-ivory-300)',
  label,
}: {
  bg?: string
  label?: string
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {label && (
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.625rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-dark-400)',
          }}
        >
          {label}
        </span>
      )}
    </div>
  )
}

export default function Hero() {
  const isDesktop = useIsDesktop()

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: 'var(--color-ivory-100)',
        display: 'flex',
        alignItems: 'stretch',
      }}
    >
      {/* ── OUTER GRID — full width, no container ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
          width: '100%',
          minHeight: '100vh',
        }}
      >
        {/* ── LEFT COLUMN — text content ── */}
        <div
          style={{
            paddingLeft: isDesktop ? '5vw' : '1.5rem',
            paddingRight: isDesktop ? '4rem' : '1.5rem',
            paddingTop: isDesktop ? '10rem' : '7rem',
            paddingBottom: '4rem',
            display: 'flex',
            alignItems: 'flex-start',
            maxWidth: isDesktop ? '680px' : '100%',
            marginLeft: isDesktop ? 'auto' : '0',
          }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            {/* Eyebrow */}
            <motion.div
              variants={itemVariants}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.5rem',
              }}
            >
              <span
                style={{
                  display: 'block',
                  width: '2rem',
                  height: '1px',
                  backgroundColor: 'var(--color-gold-500)',
                  flexShrink: 0,
                }}
              />
              <span className="eyebrow">New Season — SS 2026</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={itemVariants}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                fontWeight: 300,
                lineHeight: 1.1,
                color: 'var(--color-dark-900)',
                marginBottom: '1.5rem',
              }}
            >
              Crafted for{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--color-gold-500)' }}>the Long</em>
              <br />
              Walk
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9375rem',
                lineHeight: 1.8,
                color: 'var(--color-dark-400)',
                maxWidth: '26rem',
                marginBottom: '2.5rem',
              }}
            >
              Premium footwear built for every road. Sneakers, boots, and everyday shoes — crafted
              with care, sized for India.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}
            >
              <Link
                href="/shop"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  backgroundColor: 'var(--color-dark-900)',
                  color: 'var(--color-ivory-100)',
                  padding: '0.75rem 1.75rem',
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
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = 'var(--color-gold-500)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = 'var(--color-dark-900)')
                }
              >
                Shop Now
                <ArrowRight size={14} strokeWidth={1.5} />
              </Link>

              <Link
                href="/shop?sort=newest"
                style={{
                  color: 'var(--color-dark-700)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-body)',
                  borderBottom: '0.5px solid var(--color-dark-400)',
                  paddingBottom: '2px',
                  textDecoration: 'none',
                  transition: 'color 250ms ease, border-color 250ms ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-gold-500)'
                  e.currentTarget.style.borderBottomColor = 'var(--color-gold-500)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-dark-700)'
                  e.currentTarget.style.borderBottomColor = 'var(--color-dark-400)'
                }}
              >
                New Arrivals
              </Link>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              variants={itemVariants}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                marginTop: '3rem',
                paddingTop: '2rem',
                borderTop: '0.5px solid var(--color-ivory-300)',
                flexWrap: 'wrap',
              }}
            >
              {[
                { value: 'Free', label: 'Size exchange' },
                { value: 'COD', label: 'Available' },
                { value: '100%', label: 'Genuine products' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.25rem',
                      color: 'var(--color-dark-900)',
                      fontWeight: 400,
                      lineHeight: 1,
                      marginBottom: '0.25rem',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.6875rem',
                      color: 'var(--color-dark-400)',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ── RIGHT COLUMN — image panels, no emoji ── */}
        {isDesktop && (
          <motion.div
            variants={imagePanelVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr 1fr',
              gap: '1px',
              paddingTop: '5rem',
            }}
          >
            {/* Large panel — spans both rows */}
            <div
              style={{
                gridRow: 'span 2',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <ImagePlaceholder bg="var(--color-ivory-300)" label="Hero image" />
              <div
                style={{
                  position: 'absolute',
                  bottom: '1.25rem',
                  left: '1.25rem',
                  backgroundColor: 'rgba(26,20,16,0.8)',
                  padding: '0.375rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.625rem',
                    letterSpacing: '0.12em',
                    color: 'rgba(255,255,255,0.8)',
                    textTransform: 'uppercase',
                  }}
                >
                  New Arrival
                </span>
              </div>
            </div>

            {/* Small panel 1 */}
            <ImagePlaceholder bg="var(--color-ivory-200)" />

            {/* Small panel 2 */}
            <ImagePlaceholder bg="#ddd6c8" />
          </motion.div>
        )}
      </div>
    </section>
  )
}
