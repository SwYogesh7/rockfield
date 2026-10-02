import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface SectionHeadingProps {
  eyebrow: string
  title: React.ReactNode
  link?: { label: string; href: string }
  className?: string
}

export function SectionHeading({ eyebrow, title, link, className }: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10", className)}>
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="block w-8 h-px bg-gold-500" />
          <span className="type-eyebrow">{eyebrow}</span>
        </div>
        <h2 className="type-h2 text-dark-900">
          {title}
        </h2>
      </div>
      
      {link && (
        <Link
          href={link.href}
          className="type-label text-gold-500 border-b border-gold-500 pb-0.5 hover:opacity-80 transition-opacity whitespace-nowrap"
        >
          {link.label}
        </Link>
      )}
    </div>
  )
}
