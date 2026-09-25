import Link from "next/link";
import { BrandMark } from "./brand-mark";
import { cn } from "@/lib/utils";

type BrandLockupProps = {
  href?: string;
  priority?: boolean;
  onClick?: () => void;
  className?: string;
  wordmarkClassName?: string;
  markClassName?: string;
};

export function BrandLockup({
  href = "/",
  priority = false,
  onClick,
  className,
  wordmarkClassName,
  markClassName,
}: BrandLockupProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn("flex items-center gap-2", className)}
    >
      <BrandMark priority={priority} className={markClassName} />
      <span
        className={cn(
          "text-xl font-bold tracking-[-0.06em] text-foreground",
          wordmarkClassName,
        )}
      >
        HelpHub
      </span>
    </Link>
  );
}
