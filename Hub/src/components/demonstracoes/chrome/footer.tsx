import { cn } from "@/lib/utils";
import * as responsive from "@/lib/responsive";
import type { LpDensity } from "@/components/demonstracoes/layout";

type LpFooterProps = {
  density: LpDensity;
  variant?: "simple" | "editorial";
  children?: React.ReactNode;
};

export function LpFooter({
  density,
  variant = "simple",
  children,
}: LpFooterProps) {
  if (variant === "editorial") {
    return (
      <footer className="border-t border-ink bg-ink text-paper">
        <div
          className={cn(
            responsive.lpMax6,
            responsive.lpPadX,
            "flex flex-col gap-8 py-14 sm:flex-row sm:items-end sm:justify-between sm:py-16",
          )}
        >
          {children}
        </div>
      </footer>
    );
  }

  const label =
    density === "plus"
      ? "Empresa · demo HelpHub Plus"
      : "Empresa · demo HelpHub Avançado";

  return (
    <footer
      className={cn(
        "border-t border-line px-5 py-10 text-center text-xs leading-5 text-gray-500 sm:px-8",
        density === "plus" && "bg-white",
      )}
    >
      {children ?? label}
    </footer>
  );
}
