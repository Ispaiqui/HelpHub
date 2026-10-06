import { cn } from "@/lib/utils";

const LOGO_LIGHT = "/brand/helphub-logo-light-256.webp";
const LOGO_DARK = "/brand/helphub-logo-dark-256.webp";
const LOGO_LIGHT_SRCSET =
  "/brand/helphub-logo-light-128.webp 144w, /brand/helphub-logo-light-256.webp 288w";
const LOGO_DARK_SRCSET =
  "/brand/helphub-logo-dark-128.webp 144w, /brand/helphub-logo-dark-256.webp 288w";

/** Altura renderizada h-16 (64px) × proporção 288/256. */
const RENDERED_WIDTH = 72;
const RENDERED_HEIGHT = 64;

type BrandMarkProps = {
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function BrandMark({
  className,
  priority = false,
  sizes = "72px",
}: BrandMarkProps) {
  const frame = cn("h-14 w-auto object-contain", className);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LOGO_LIGHT}
        srcSet={LOGO_LIGHT_SRCSET}
        sizes={sizes}
        alt="HelpHub"
        width={RENDERED_WIDTH}
        height={RENDERED_HEIGHT}
        className={cn(frame, "dark:hidden")}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LOGO_DARK}
        srcSet={LOGO_DARK_SRCSET}
        sizes={sizes}
        alt="HelpHub"
        width={RENDERED_WIDTH}
        height={RENDERED_HEIGHT}
        className={cn(frame, "hidden dark:block")}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
    </>
  );
}
