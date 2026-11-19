import { cn } from "@/lib/utils"

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  size?: 'sm' | 'md' | 'lg'
}

export function Section({ size = 'md', className, children, ...props }: SectionProps) {
  const sizeClasses = {
    sm: 'py-8 md:py-12', // 32px mobile / 48px desktop
    md: 'py-12 md:py-20', // 48px mobile / 80px desktop
    lg: 'py-16 md:py-28', // 64px mobile / 112px desktop
  }

  return (
    <section className={cn(sizeClasses[size], className)} {...props}>
      {children}
    </section>
  )
}
