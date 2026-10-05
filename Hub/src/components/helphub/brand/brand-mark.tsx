import Image from "next/image";
import { cn } from "@/lib/utils";

const LOGO_LIGHT = "/helphub-logo-light-theme.png";
const LOGO_DARK = "/helphub-logo-clean.png";

type BrandMarkProps = {
  className?: string;
  priority?: boolean;
};

export function BrandMark({ className, priority = false }: BrandMarkProps) {
  const frame = cn("h-14 w-auto object-contain", className);

  return (
    <>
      <Image
        src={LOGO_LIGHT}
        alt="HelpHub"
        width={2848}
        height={2532}
        priority={priority}
        className={cn(frame, "dark:hidden")}
      />
      <Image
        src={LOGO_DARK}
        alt="HelpHub"
        width={2848}
        height={2532}
        priority={priority}
        className={cn(frame, "hidden dark:block")}
      />
    </>
  );
}
