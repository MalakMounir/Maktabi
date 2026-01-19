import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg hover:scale-[1.02] focus-visible:ring-primary/50 focus-visible:shadow-lg active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 hover:shadow-lg hover:scale-[1.02] focus-visible:ring-destructive/50 focus-visible:shadow-lg active:scale-[0.98]",
        outline:
          "border-2 border-primary bg-background text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-md hover:scale-[1.02] focus-visible:ring-primary/50 focus-visible:shadow-md active:scale-[0.98]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-md hover:scale-[1.02] focus-visible:ring-secondary/50 focus-visible:shadow-md active:scale-[0.98]",
        ghost: 
          "text-foreground hover:bg-muted hover:text-foreground hover:scale-[1.02] focus-visible:ring-muted focus-visible:bg-muted/50 active:scale-[0.98]",
        link: 
          "text-primary underline-offset-4 hover:underline hover:text-primary/80 focus-visible:ring-primary/50 focus-visible:underline active:text-primary/70",
        cta: 
          "bg-cta text-cta-foreground shadow-lg hover:shadow-xl hover:scale-[1.02] focus-visible:ring-cta/50 focus-visible:shadow-xl active:scale-[0.98] font-bold",
        success:
          "bg-success text-success-foreground shadow-md hover:bg-success/90 hover:shadow-lg hover:scale-[1.02] focus-visible:ring-success/50 focus-visible:shadow-lg active:scale-[0.98]",
        hero:
          "bg-cta text-cta-foreground shadow-xl hover:shadow-2xl hover:scale-[1.03] focus-visible:ring-cta/50 focus-visible:shadow-2xl active:scale-[0.98] font-bold text-base",
        "hero-secondary":
          "bg-card/90 backdrop-blur-sm text-foreground border-2 border-card shadow-lg hover:bg-card hover:shadow-xl hover:scale-[1.02] focus-visible:ring-card focus-visible:shadow-xl active:scale-[0.98]",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
