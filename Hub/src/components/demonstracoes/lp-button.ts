import { cva, type VariantProps } from "class-variance-authority";

export const lpButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        solid: "bg-ink text-paper hover:bg-gray-700",
        outline:
          "border border-ink bg-transparent text-ink hover:bg-ink hover:text-paper",
        ghost: "text-ink underline-offset-4 hover:underline",
        invert: "bg-paper text-ink hover:bg-gray-100",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  },
);

export type LpButtonVariantProps = VariantProps<typeof lpButtonVariants>;
