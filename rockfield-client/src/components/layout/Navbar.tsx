// src/components/layout/Navbar.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, Search, Heart, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cart'
import { useIsDesktop } from '@/lib/hooks/useIsDesktop'

const navLinks = [
  { label: 'Men', href: '/shop/men' },
  { label: 'Women', href: '/shop/women' },
  { label: 'Kids', href: '/shop/kids' },
  { label: 'Sneakers', href: '/shop/sneakers' },
  { label: 'Boots', href: '/shop/boots' },
  { label: 'Sale', href: '/shop?sale=true' },
]

// Reusable icon button style — used for Search, Wishlist, Cart
const iconBtnStyle: React.CSSProperties = {
  padding: '0.5rem',
  color: 'var(--color-dark-400)',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'color 250ms ease',
  borderRadius: '2px',
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  // mounted prevents Zustand persist rehydration from causing a hydration mismatch.
  // Server always renders 0; client updates after mount.
  const [mounted, setMounted] = useState(false)

  const isDesktop = useIsDesktop()

  const itemCount = useCartStore((state) => state.getItemCount())
  const openCart = useCartStore((state) => state.openCart)
  // Only show the real count after client hydration
  const displayCount = mounted ? itemCount : 0

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when switching to desktop
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isDesktop) setIsMobileOpen(false)
  }, [isDesktop])

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        transition: 'background-color 400ms ease, border-color 400ms ease',
        backgroundColor: isScrolled ? 'var(--color-ivory-100)' : 'transparent',
        borderBottom: `0.5px solid ${isScrolled ? 'var(--color-ivory-300)' : 'transparent'}`,
      }}
    >
      <div className="container-luxury">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            // Height changes based on screen size
            height: isDesktop ? '5rem' : '4rem',
            transition: 'height 300ms ease',
          }}
        >
          {/* ── LOGO ── */}
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: isDesktop ? '1.375rem' : '1.125rem',
              letterSpacing: '0.35em',
              color: 'var(--color-dark-900)',
              textDecoration: 'none',
              flexShrink: 0,
              transition: 'color 250ms ease, font-size 300ms ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold-500)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-dark-900)')}
          >
            ROCKFIELD
          </Link>

          {/* ── DESKTOP NAV — only rendered on desktop ── */}
          {/* isDesktop check = nav doesn't exist in DOM on mobile */}
          {isDesktop && (
            <nav
              aria-label="Main navigation"
              style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.6875rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--color-dark-400)',
                    textDecoration: 'none',
                    transition: 'color 250ms ease',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-dark-900)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-dark-400)')}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* ── ACTION ICONS ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.125rem' }}>
            {/* Search — always visible */}
            <button
              aria-label="Search"
              style={iconBtnStyle}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = 'var(--color-dark-900)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = 'var(--color-dark-400)')
              }
            >
              <Search size={18} strokeWidth={1.5} />
            </button>

            {/* Wishlist — desktop only */}
            {isDesktop && (
              <button
                aria-label="Wishlist"
                style={iconBtnStyle}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = 'var(--color-dark-900)')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = 'var(--color-dark-400)')
                }
              >
                <Heart size={18} strokeWidth={1.5} />
              </button>
            )}

            {/* Cart — always visible */}
            <button
              onClick={openCart}
              aria-label={`Cart — ${displayCount} items`}
              style={{ ...iconBtnStyle, position: 'relative' }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = 'var(--color-dark-900)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = 'var(--color-dark-400)')
              }
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {displayCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    backgroundColor: 'var(--color-gold-500)',
                    color: 'white',
                    fontSize: '9px',
                    fontWeight: 600,
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {displayCount > 9 ? '9+' : displayCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger — mobile only */}
            {!isDesktop && (
              <button
                onClick={() => setIsMobileOpen((prev) => !prev)}
                aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
                style={{ ...iconBtnStyle, marginLeft: '0.25rem' }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = 'var(--color-dark-900)')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = 'var(--color-dark-400)')
                }
              >
                {isMobileOpen ? (
                  <X size={20} strokeWidth={1.5} />
                ) : (
                  <Menu size={20} strokeWidth={1.5} />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {isMobileOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{
              overflow: 'hidden',
              backgroundColor: 'var(--color-ivory-100)',
              borderTop: '0.5px solid var(--color-ivory-300)',
            }}
          >
            <div
              className="container-luxury"
              style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }}
            >
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index, duration: 0.25 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    style={{
                      display: 'block',
                      padding: '1rem 0',
                      borderBottom: '0.5px solid var(--color-ivory-300)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8125rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: 'var(--color-dark-700)',
                      textDecoration: 'none',
                      transition: 'color 250ms ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold-500)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-dark-700)')}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
