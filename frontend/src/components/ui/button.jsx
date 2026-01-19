import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background/50 shadow-sm hover:bg-accent/10 hover:text-foreground hover:border-accent/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: 
          "hover:bg-muted/50 hover:text-foreground",
        link: 
          "text-primary underline-offset-4 hover:underline",
        // Premium variants for 4you Hub
        premium:
          "bg-gradient-to-r from-primary via-blue to-accent text-foreground font-bold shadow-lg hover:scale-105 active:scale-95",
        glass:
          "bg-foreground/5 border border-foreground/10 text-foreground/80 hover:bg-foreground/10 hover:text-foreground backdrop-blur-sm",
        neon:
          "bg-primary/10 border border-primary/40 text-primary hover:bg-primary/20 shadow-glow",
        pill:
          "bg-foreground/5 border border-foreground/10 text-foreground/60 hover:bg-foreground/10 hover:text-foreground rounded-full",
        icon:
          "bg-transparent text-muted-foreground hover:text-primary hover:bg-foreground/5",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-xl",
        sm: "h-8 px-3 rounded-lg text-xs",
        lg: "h-12 px-8 rounded-2xl",
        xl: "h-14 px-10 rounded-2xl text-base",
        icon: "h-10 w-10 rounded-xl",
        "icon-sm": "h-8 w-8 rounded-lg",
        "icon-lg": "h-12 w-12 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
