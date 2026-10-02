import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Container } from './Container'
import { cn } from '@/lib/utils'

export interface PageHeaderProps {
  title: string
  breadcrumbs: { label: string; href?: string }[]
  count?: number
  description?: string
  className?: string
}

export function PageHeader({ title, breadcrumbs, count, description, className }: PageHeaderProps) {
  return (
    <div className={cn("border-b border-ivory-300", className)}>
      <Container className="pt-12 lg:pt-16 pb-8">
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 mb-6 overflow-x-auto hide-scrollbar whitespace-nowrap">
            {breadcrumbs.map((bc, idx) => {
              const isLast = idx === breadcrumbs.length - 1
              return (
                <div key={idx} className="flex items-center gap-2">
                  {bc.href && !isLast ? (
                    <Link href={bc.href} className="type-label text-dark-400 hover:text-dark-900 transition-colors capitalize">
                      {bc.label}
                    </Link>
                  ) : (
                    <span className="type-label text-dark-900 capitalize truncate max-w-[200px]">
                      {bc.label}
                    </span>
                  )}
                  {!isLast && <ChevronRight size={14} className="text-dark-200 shrink-0" />}
                </div>
              )
            })}
          </nav>
        )}
        <h1 className="type-h1 text-dark-900 capitalize">{title}</h1>
        {(count !== undefined || description) && (
          <p className="type-body text-dark-400 mt-2">
            {description || `${count} ${count === 1 ? 'Product' : 'Products'}`}
          </p>
        )}
      </Container>
    </div>
  )
}
