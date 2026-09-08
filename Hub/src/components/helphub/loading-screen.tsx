"use client";

import * as React from "react";

import { LoadingIndicator, LoadingText } from "./loading-indicator";

interface LoadingScreenProps {
  mode?: "overlay" | "page";
  isVisible?: boolean;
}

export function LoadingScreen({ mode = "page", isVisible = true }: LoadingScreenProps) {
  const [shouldRender, setShouldRender] = React.useState(mode === "page" || isVisible);

  React.useEffect(() => {
    if (mode === "page") return;

    if (isVisible) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isVisible, mode]);

  if (!shouldRender) return null;

  if (mode === "page") {
    return (
      <div
        aria-live="polite"
        aria-label="Carregando..."
        role="status"
        className="relative flex min-h-[70vh] flex-col items-center justify-center gap-8 overflow-hidden py-16"
      >
        <div className="pointer-events-none absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-hh-blue-500/5 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center gap-8">
          <LoadingIndicator />
          <LoadingText variant="page" />
        </div>
      </div>
    );
  }

  return (
    <div
      aria-live="polite"
      aria-label="Carregando..."
      role="status"
      className={`loading-overlay ${isVisible ? "loading-overlay--visible" : "loading-overlay--hidden"}`}
    >
      <LoadingIndicator />
      <LoadingText variant="overlay" />
    </div>
  );
}
