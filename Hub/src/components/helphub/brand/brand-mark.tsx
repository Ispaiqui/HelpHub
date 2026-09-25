import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  priority?: boolean;
};

export function BrandMark({ className, priority = false }: BrandMarkProps) {
  return (
    <img
      src="/brand/helphub-mark.webp"
      alt=""
      width={40}
      height={40}
      className={cn("h-10 w-10 object-contain", className)}
      decoding="async"
      fetchPriority={priority ? "high" : "low"}
    />
  );
}
