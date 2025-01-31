import { cn } from "@/utils/cn"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export function Container({ 
  children, 
  className, 
  size = 'md',
  ...props 
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto px-4",
        {
          'max-w-screen-sm': size === 'sm',    // 640px
          'max-w-3xl': size === 'md',          // 768px
          'max-w-screen-lg': size === 'lg',    // 1024px
          'max-w-[1600px]': size === 'xl',     // 1920px
          'w-full': size === 'full',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
