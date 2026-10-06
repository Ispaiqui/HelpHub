"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import {
  AboutStepAnimation,
  type AboutStepVariant,
} from "@/components/helphub/sections/about/about-step-animation";

function readTheme() {
  if (typeof window === "undefined") return "light";
  return new URLSearchParams(window.location.search).get("theme") === "dark" ? "dark" : "light";
}

function readVariant(): AboutStepVariant {
  return new URLSearchParams(window.location.search).get("variant") === "mobile" ? "mobile" : "desktop";
}

export function CaptureClient() {
  const theme = useSyncExternalStore(
    () => () => {},
    readTheme,
    () => "light",
  );
  const variant = useSyncExternalStore(
    () => () => {},
    readVariant,
    () => "desktop" as AboutStepVariant,
  );

  useLayoutEffect(() => {
    const root = document.documentElement;
    const applyTheme = () => {
      root.classList.toggle("dark", theme === "dark");
      root.classList.toggle("light", theme === "light");
      root.style.colorScheme = theme;
    };
    applyTheme();
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.margin = "0";
    document.body.style.background = "transparent";

    const observer = new MutationObserver(applyTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [theme]);

  return (
    <div className="fixed inset-0 bg-muted">
      <AboutStepAnimation capture variant={variant} />
    </div>
  );
}
