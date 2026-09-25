import Link from "next/link";
import { packages } from "@/lib/demonstracoes/content";
import { cn } from "@/lib/utils";
import * as responsive from "@/lib/responsive";

type DemoBadgeProps = {
  packageName: string;
};

export function DemoBadge({ packageName }: DemoBadgeProps) {
  return (
    <div className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-[2px]">
      <div
        className={cn(
          responsive.lpMax6,
          responsive.lpPadX,
          "flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-2.5 sm:py-3",
        )}
      >
        <p className="label text-gray-600">
          Demo HelpHub · Pacote {packageName}
        </p>
        <nav
          aria-label="Pacotes da demo"
          className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500"
        >
          {packages.map((pkg) =>
            pkg.name === packageName ? (
              <span
                key={pkg.slug}
                aria-current="page"
                className="font-medium text-ink"
              >
                {pkg.name}
              </span>
            ) : (
              <Link
                key={pkg.slug}
                href={pkg.href}
                className="underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                {pkg.name}
              </Link>
            ),
          )}
          <Link
            href="/demonstracoes"
            className="underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            ← Pacotes
          </Link>
        </nav>
      </div>
    </div>
  );
}
