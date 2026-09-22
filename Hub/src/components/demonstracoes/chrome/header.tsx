import { cn } from "@/lib/utils";
import * as responsive from "@/lib/responsive";
import type { LpDensity } from "@/components/demonstracoes/layout";

type LpHeaderProps = {
  density: LpDensity;
  tone?: "plain" | "editorial";
  tagline: string;
};

export function LpHeader({ density, tone = "plain", tagline }: LpHeaderProps) {
  const stacked = density === "plus";

  return (
    <header
      className={cn(
        "border-b border-line",
        tone === "editorial" ? "bg-paper" : "bg-white",
      )}
    >
      <div
        className={cn(
          density === "premium" ? responsive.lpMax6 : responsive.lpMax5,
          responsive.lpPadX,
          "flex",
          stacked
            ? "flex-col gap-1.5 py-5 sm:flex-row sm:items-baseline sm:justify-between"
            : "items-baseline justify-between py-5",
          tone === "editorial" && "py-6",
        )}
      >
        <p
          className={
            tone === "editorial"
              ? "font-serif text-2xl tracking-tight"
              : "text-lg font-medium tracking-tight"
          }
        >
          Empresa
        </p>
        <p
          className={
            tone === "editorial"
              ? "label text-gray-500"
              : "text-xs leading-5 text-gray-500"
          }
        >
          {tagline}
        </p>
      </div>
    </header>
  );
}
