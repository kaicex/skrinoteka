import { cn } from "@/utils/cn"

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function PageHeader({
  className,
  children,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start justify-between gap-4 px-10 pb-8 pt-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface PageHeaderHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export function PageHeaderHeading({
  className,
  ...props
}: PageHeaderHeadingProps) {
  return (
    <h1
      className="text-5xl sm:text-6xl font-bold tracking-tight"
      {...props}
    />
  )
}
