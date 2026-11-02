import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-sans tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gold: "bg-gradient-to-r from-primary to-gold-light text-primary-foreground shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
        hero: "bg-[#121212]/40 text-[#F5F3EF] border border-[#F5F3EF]/30 backdrop-blur-md hover:bg-[#121212]/70 hover:border-[#F5F3EF]/60 shadow-lg tracking-wider",
        heroSolid: "bg-[#F5F3EF] text-[#121212] hover:bg-white hover:text-black shadow-xl hover:scale-[1.02] active:scale-[0.98] font-semibold tracking-wider",
        editorialPrimary: "bg-[#F5F3EF] text-[#121212] hover:bg-white border border-[#F5F3EF]/40 tracking-widest uppercase text-xs font-semibold shadow-md hover:shadow-lg transition-all",
        editorialOutline: "bg-transparent text-[#F5F3EF] border border-[#F5F3EF]/40 hover:bg-[#F5F3EF]/10 tracking-widest uppercase text-xs font-semibold transition-all",
        editorialDark: "bg-[#121212] text-[#F5F3EF] hover:bg-[#1f1f1f] border border-[#2e2e2e] tracking-widest uppercase text-xs font-semibold shadow-md",
        elegant: "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
        romantic: "bg-rose text-foreground hover:bg-rose/80 shadow-sm",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8 text-base",
        xl: "h-14 rounded-md px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
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
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
