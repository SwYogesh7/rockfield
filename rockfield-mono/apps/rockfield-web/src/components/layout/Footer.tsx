'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { footerLinks, socialLinks } from '@/lib/footer-data'
import { SocialIcon } from '@/components/ui/SocialIcon'
import { Logo } from '@/components/ui/logo'

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
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0a0a0a] text-white/70">
      {/* Gold divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-gold-500)]/50 to-transparent" />

      {/* Main content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="container-luxury py-20"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* ── Column 1: Brand ── */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Logo className="text-2xl font-light text-white" />
            </Link>

            <p className="font-body text-sm leading-relaxed text-white/40 mb-8 max-w-[13.75rem]">
              Solid footwear for solid ground. Built in India, for every road.
            </p>

            <div className="flex items-center gap-5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-white/30 hover:text-[var(--color-gold-500)] transition-colors duration-300"
                >
                  <SocialIcon name={social.icon} className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* ── Column 2: Shop ── */}
          <motion.div variants={itemVariants}>
            <h3 className="font-body text-xs tracking-[0.25em] uppercase text-white mb-6">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white/40 hover:text-[var(--color-gold-500)] hover:pl-1 transition-all duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Column 3: Support ── */}
          <motion.div variants={itemVariants}>
            <h3 className="font-body text-xs tracking-[0.25em] uppercase text-white mb-6">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white/40 hover:text-[var(--color-gold-500)] hover:pl-1 transition-all duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Column 4: Company ── */}
          <motion.div variants={itemVariants}>
            <h3 className="font-body text-xs tracking-[0.25em] uppercase text-white mb-6">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white/40 hover:text-[var(--color-gold-500)] hover:pl-1 transition-all duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/10">
        <div className="container-luxury py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-white/40 tracking-wider">
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
                className="font-body text-xs text-white/40 hover:text-white/60 transition-colors duration-300"
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
