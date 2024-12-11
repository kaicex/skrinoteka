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
          'max-w-screen-xl': size === 'xl',    // 1280px
          'max-w-full': size === 'full'        // No max width
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
