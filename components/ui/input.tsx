import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/utils/cn"

const inputVariants = cva(
  "block w-full box-border rounded-md border border-zinc-200 bg-zinc-50 text-zinc-900 file:border-0 file:bg-transparent file:font-medium placeholder:text-zinc-400 placeholder:font-bold focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 font-bold",
  {
    variants: {
      size: {
        default: "h-14 px-3 py-2 text-base",
        sm: "h-12 px-3 py-1.5 text-sm",
        md: "h-16 rounded-[12px] px-4 text-lg",
        lg: "h-20 rounded-[16px] px-6 text-xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size, icon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            inputVariants({ size, className }),
            icon && "pr-10"
          )}
          ref={ref}
          {...props}
        />
        {icon && (
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transform text-zinc-400">
            {icon}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
