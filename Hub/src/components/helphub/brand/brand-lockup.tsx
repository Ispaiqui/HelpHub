import Link from "next/link";
import { BrandMark } from "./brand-mark";
import { cn } from "@/lib/utils";

const HEADER_SYMBOL = "/brand/helphub-symbol-128.webp";

type BrandLockupProps = {
  href?: string;
  priority?: boolean;
  onClick?: () => void;
  className?: string;
  markClassName?: string;
  symbol?: boolean;
};

export function BrandLockup({
  href = "/",
  priority = false,
  onClick,
  className,
  markClassName,
  symbol = false,
}: BrandLockupProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn("flex items-center", symbol && "gap-2", className)}
    >
      {symbol ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HEADER_SYMBOL}
            srcSet={`${HEADER_SYMBOL} 128w`}
            sizes="40px"
            alt=""
            width={40}
            height={40}
            className={cn("h-10 w-10 shrink-0 object-contain", markClassName)}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
          />
          <span className="text-xl font-bold tracking-[-0.06em] text-foreground">
            HelpHub
          </span>
        </>
      ) : (
        <BrandMark priority={priority} className={markClassName} />
      )}
    </Link>
  );
}
