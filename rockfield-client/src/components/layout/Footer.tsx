'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { footerLinks, socialLinks } from '@/lib/footer-data'
import { SocialIcon } from '@/components/ui/SocialIcon'
import { Logo } from '@/components/ui/logo'

// ✅ Fix 1: "as const" on the ease array — tells TypeScript this is a
// fixed bezier tuple, satisfying Framer Motion v12's stricter types
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const, // ✅ Fixed
    },
  },
}

// ---------------------------------------------------------------------------
// NewsletterForm
// ---------------------------------------------------------------------------
function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-jost text-sm text-(--color-gold) tracking-widest uppercase"
      >
        Thank you for joining.
      </motion.p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        className="
          flex-1 bg-transparent border border-white/20 px-4 py-3
          font-jost text-sm text-white placeholder:text-white/30
          focus:outline-none focus:border-(--color-gold)
          transition-colors duration-300
        "
      />
      <button
        type="submit"
        className="
          bg-(--color-gold) text-black
          px-6 py-3 font-jost text-xs tracking-[0.2em] uppercase
          hover:bg-white transition-colors duration-300
          whitespace-nowrap cursor-pointer
        "
      >
        Subscribe
      </button>
    </form>
  )
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0a0a0a] text-white/70">
      {/* Gold divider line */}
      <div className="h-px bg-linear-to-r from-transparent via-(--color-gold)/50 to-transparent" />

      {/* Main content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="max-w-350 mx-auto px-6 md:px-12 lg:px-20 py-20"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* ── Column 1: Brand ── */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Logo className="text-2xl font-light text-white" />
            </Link>

            <p className="font-jost text-sm leading-relaxed text-white/40 mb-8 max-w-55">
              Solid footwear for solid ground. Built in India, for every road.
            </p>

            {/* social icons map — JSX attributes now correctly inside the <a> tag */}
            <div className="flex items-center gap-5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-white/30 hover:text-(--color-gold) transition-colors duration-300"
                >
                  <SocialIcon name={social.icon} className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* ── Column 2: Shop ── */}
          <motion.div variants={itemVariants}>
            <h3 className="font-jost text-xs tracking-[0.25em] uppercase text-white mb-6">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-jost text-sm text-white/40 hover:text-(--color-gold) hover:pl-1 transition-all duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Column 3: Company & Support ── */}
          <motion.div variants={itemVariants}>
            <h3 className="font-jost text-xs tracking-[0.25em] uppercase text-white mb-6">
              Company
            </h3>
            <ul className="space-y-3 mb-8">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-jost text-sm text-white/40 hover:text-(--color-gold) hover:pl-1 transition-all duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="font-jost text-xs tracking-[0.25em] uppercase text-white mb-6">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-jost text-sm text-white/40 hover:text-(--color-gold) hover:pl-1 transition-all duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Column 4: Newsletter ── */}
          <motion.div variants={itemVariants}>
            <h3 className="font-jost text-xs tracking-[0.25em] uppercase text-white mb-2">
              Stay in the Loop
            </h3>
            <p className="font-jost text-sm text-white/40 mb-6 leading-relaxed">
              New drops, exclusive deals, and size restocks — straight to your inbox.
            </p>
            <NewsletterForm />
          </motion.div>
        </div>
      </motion.div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/6">
        <div className="max-w-350 mx-auto px-6 md:px-12 lg:px-20 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-jost text-xs text-white/25 tracking-wider">
            © {currentYear} Rockfield Footwear Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {[
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' },
              { label: 'Cookie Policy', href: '/cookies' },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-jost text-xs text-white/25 hover:text-white/60 transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
