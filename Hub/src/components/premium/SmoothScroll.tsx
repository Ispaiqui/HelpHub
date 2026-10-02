"use client";

import { ReactLenis, type LenisRef } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis ↔ ticker do GSAP. Montado só no layout de /lab, para o pin/scrub.
 * As páginas públicas continuam com o scroll nativo do site.
 * O ScrollTrigger permanece a autoridade do pin.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(false);
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    return () => {
      root.style.scrollBehavior = previous;
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduced) return;

    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    let off: (() => void) | undefined;
    let tries = 0;
    const id = window.setInterval(() => {
      const lenis = lenisRef.current?.lenis;
      tries += 1;
      if (!lenis) {
        if (tries > 40) window.clearInterval(id);
        return;
      }
      if (off) {
        window.clearInterval(id);
        return;
      }
      const onScroll = () => ScrollTrigger.update();
      lenis.on("scroll", onScroll);
      off = () => lenis.off("scroll", onScroll);
      window.clearInterval(id);
      ScrollTrigger.refresh();
    }, 40);

    return () => {
      window.clearInterval(id);
      gsap.ticker.remove(update);
      off?.();
    };
  }, [reduced]);

  if (reduced) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        autoRaf: false,
        duration: 1.05,
        smoothWheel: true,
        touchMultiplier: 1.35,
      }}
    >
      {children}
    </ReactLenis>
  );
}
