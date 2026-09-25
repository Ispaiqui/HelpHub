import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import * as responsive from "@/lib/responsive";

export type LpDensity = "plus" | "avancado" | "premium";

const pyByDensity: Record<LpDensity, string> = {
  plus: responsive.lpPyPlus,
  avancado: responsive.lpPyAvancado,
  premium: responsive.lpPyPremium,
};

type LpSectionProps = {
  density: LpDensity;
  bleed?: boolean;
  padded?: boolean;
  id?: string;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
};

export function LpSection({
  density,
  bleed = false,
  padded = true,
  id,
  className,
  innerClassName,
  children,
}: LpSectionProps) {
  const inner = cn(
    density === "premium" ? responsive.lpMax6 : responsive.lpMax5,
    responsive.lpPadX,
    padded && pyByDensity[density],
    innerClassName,
  );

  if (bleed) {
    return (
      <section id={id} className={className}>
        <div className={inner}>{children}</div>
      </section>
    );
  }

  return (
    <section id={id} className={cn(inner, className)}>
      {children}
    </section>
  );
}
