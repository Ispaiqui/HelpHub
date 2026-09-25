"use client";

import * as React from "react";
import { useTheme } from "next-themes";

const LIGHT = "/brand/favicon-light.png";
const DARK = "/brand/favicon-dark.png";

function applyFavicon(href: string) {
  const absolute = new URL(href, window.location.origin).href;
  document
    .querySelectorAll<HTMLLinkElement>('link[rel="icon"], link[rel="shortcut icon"]')
    .forEach((link) => {
      if (link.href === absolute) return;
      link.type = "image/png";
      link.removeAttribute("media");
      link.href = href;
    });
}

export function FaviconTheme() {
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    if (!resolvedTheme) return;
    const href = resolvedTheme === "dark" ? DARK : LIGHT;
    applyFavicon(href);
    const observer = new MutationObserver(() => applyFavicon(href));
    observer.observe(document.head, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [resolvedTheme]);

  return null;
}
