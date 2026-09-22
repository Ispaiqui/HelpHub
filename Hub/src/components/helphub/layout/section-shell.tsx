import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import * as responsive from "@/lib/responsive";

type SectionShellProps = {
  id?: string;
  as?: "section" | "div";
  className?: string;
  content?: "gutter" | "container";
  padded?: boolean;
  innerClassName?: string;
  backdrop?: ReactNode;
  children: ReactNode;
};

export function SectionShell({
  id,
  as: Tag = "section",
  className,
  content = "gutter",
  padded = true,
  innerClassName,
  backdrop,
  children,
}: SectionShellProps) {
  return (
    <Tag id={id} className={cn("relative", padded && responsive.sectionPy, className)}>
      {backdrop}
      <div
        className={cn(
          content === "gutter" ? responsive.pageGutter : responsive.container,
          innerClassName,
        )}
      >
        {children}
      </div>
    </Tag>
  );
}
