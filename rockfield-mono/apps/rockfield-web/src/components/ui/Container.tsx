import { cn } from "@/lib/utils"

export type ContainerProps = React.HTMLAttributes<HTMLDivElement>

export function Container({ className, children, ...props }: ContainerProps) {
  return (
    <div className={cn("container-luxury", className)} {...props}>
      {children}
    </div>
  )
}
