import * as React from "react";

import { cn } from "@/lib/utils";

interface LoadingIndicatorProps {
  className?: string;
}

export function LoadingIndicator({ className }: LoadingIndicatorProps) {
  return (
    <div className={cn("loading-icon-wrapper", className)}>
      <div className="loading-ring loading-ring--outer" />
      <div className="loading-ring loading-ring--inner" />

      <div className="loading-logo">
        <span className="loading-logo__letter loading-logo__letter--first">H</span>
        <span className="loading-logo__letter loading-logo__letter--second">H</span>
      </div>

      <div className="loading-particles">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="loading-particle"
            style={{ "--particle-index": i } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}

interface LoadingTextProps {
  variant?: "overlay" | "page";
}

export function LoadingText({ variant = "overlay" }: LoadingTextProps) {
  if (variant === "page") {
    return (
      <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
        Carregando
        <span className="loading-dots inline-flex">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </p>
    );
  }

  return (
    <p className="loading-text">
      Carregando
      <span className="loading-dots">
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </span>
    </p>
  );
}
