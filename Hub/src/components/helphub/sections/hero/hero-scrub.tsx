"use client";

import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useState, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PinScrubStage } from "@/components/premium/PinScrubProduct";
import type { SceneProxy } from "@/components/premium/PinScrubProduct/types";
import { HubFallback } from "@/components/premium/HubFallback";
import { premiumScene } from "@/components/premium/premium-scene";
import { animationBrief } from "@/lib/animation-brief";

const HubCanvas = dynamic(
  () => import("@/components/premium/HubCanvas").then((mod) => mod.HubCanvas),
  {
    ssr: false,
    loading: () => <HubFallback objetos={animationBrief.objetos} />,
  },
);

type LabVars = CSSProperties & {
  "--lab-bg": string;
  "--lab-ink": string;
  "--lab-accent": string;
  "--lab-primary": string;
};

function inkForBackground(bg: string) {
  const hex = bg.trim().replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return "#f8fafc";
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.62 ? "#0f172a" : "#f8fafc";
}

type HeroScrubProps = {
  endSlot: ReactNode;
};

const OPEN_SECONDS = 0.7;

type HeroFit = "desktop" | "wide" | "narrow" | "short";

type HeroProxies = {
  from: SceneProxy;
  enter: SceneProxy;
  details: SceneProxy;
  hero: SceneProxy;
};

const WIDE_PROXIES: HeroProxies = {
  from: { rotY: -0.85, scale: 0.96, posY: -0.12, camZ: 4.35 },
  enter: { rotY: 0.2, scale: 1.16, posY: 0, camZ: 4.15 },
  details: { rotY: 1.15, scale: 1.16, posY: 0.02, camZ: 4.05 },
  hero: { rotY: 0.45, scale: 1.28, posY: 0.04, camZ: 3.7 },
};

/** 1280+ : a mesma cena de antes, com a câmera mais perto para preencher o quadro largo. */
const DESKTOP_PROXIES: HeroProxies = {
  from: { rotY: -0.85, scale: 1.15, posY: -0.12, camZ: 3.45 },
  enter: { rotY: 0.2, scale: 1.38, posY: 0, camZ: 3.25 },
  details: { rotY: 1.15, scale: 1.38, posY: 0.02, camZ: 3.15 },
  hero: { rotY: 0.45, scale: 1.52, posY: 0.04, camZ: 2.9 },
};

/** Recuo para a órbita caber na largura estreita (FOV 34). posY sobe no beat final. */
const NARROW_PROXIES: HeroProxies = {
  from: { rotY: -0.85, scale: 0.7, posY: -0.12, camZ: 7.2 },
  enter: { rotY: 0.2, scale: 0.78, posY: 0, camZ: 7.6 },
  details: { rotY: 1.15, scale: 0.78, posY: 0.02, camZ: 7.8 },
  hero: { rotY: 0.45, scale: 0.86, posY: 0.72, camZ: 8.2 },
};

const SHORT_PROXIES: HeroProxies = {
  ...NARROW_PROXIES,
  hero: { rotY: 0.45, scale: 0.86, posY: 1.05, camZ: 8.2 },
};

function readHeroFit(): HeroFit {
  if (window.matchMedia("(min-width: 1280px)").matches) return "desktop";
  if (window.matchMedia("(max-height: 700px)").matches) return "short";
  if (window.matchMedia("(max-width: 639px)").matches) return "narrow";
  return "wide";
}

function proxiesFor(fit: HeroFit | "boot"): HeroProxies {
  if (fit === "desktop") return DESKTOP_PROXIES;
  if (fit === "short") return SHORT_PROXIES;
  if (fit === "narrow") return NARROW_PROXIES;
  return WIDE_PROXIES;
}

gsap.registerPlugin(ScrollTrigger);

function lockPageScroll() {
  const html = document.documentElement;
  const body = document.body;
  const prevHtml = html.style.overflow;
  const prevBody = body.style.overflow;
  html.style.overflow = "hidden";
  body.style.overflow = "hidden";
  window.scrollTo(0, 0);

  const block = (event: Event) => event.preventDefault();
  const blockKey = (event: KeyboardEvent) => {
    if (
      event.key === " " ||
      event.key === "ArrowDown" ||
      event.key === "ArrowUp" ||
      event.key === "PageDown" ||
      event.key === "PageUp" ||
      event.key === "Home" ||
      event.key === "End"
    ) {
      event.preventDefault();
    }
  };

  window.addEventListener("wheel", block, { passive: false });
  window.addEventListener("touchmove", block, { passive: false });
  window.addEventListener("keydown", blockKey);

  return () => {
    html.style.overflow = prevHtml;
    body.style.overflow = prevBody;
    window.removeEventListener("wheel", block);
    window.removeEventListener("touchmove", block);
    window.removeEventListener("keydown", blockKey);
    ScrollTrigger.refresh();
  };
}

/**
 * Hero público: mesma cena pin/scrub do brief.
 * Sem a barra do lab. Texto e botões chegam em `endSlot`.
 */
export function HeroScrub({ endSlot }: HeroScrubProps) {
  const [scrollOn, setScrollOn] = useState(false);
  const [fit, setFit] = useState<HeroFit | "boot">("boot");
  const proxies = proxiesFor(fit);
  const { cor, copy, objetos } = animationBrief;

  useLayoutEffect(() => {
    const apply = () => setFit(readHeroFit());
    apply();
    const desktop = window.matchMedia("(min-width: 1280px)");
    const narrow = window.matchMedia("(max-width: 639px)");
    const short = window.matchMedia("(max-height: 700px)");
    desktop.addEventListener("change", apply);
    narrow.addEventListener("change", apply);
    short.addEventListener("change", apply);
    return () => {
      desktop.removeEventListener("change", apply);
      narrow.removeEventListener("change", apply);
      short.removeEventListener("change", apply);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setScrollOn(true);
      return;
    }
    const failSafe = window.setTimeout(() => setScrollOn(true), 5000);
    return () => window.clearTimeout(failSafe);
  }, []);

  useEffect(() => {
    if (scrollOn) return;
    return lockPageScroll();
  }, [scrollOn]);
  const accent = cor.accent;
  const primary = cor.primary;
  const bg = cor.bg ?? "#0f172a";
  const ink = inkForBackground(bg);

  const style: LabVars = {
    backgroundColor: bg,
    color: ink,
    "--lab-bg": bg,
    "--lab-ink": ink,
    "--lab-accent": accent,
    "--lab-primary": primary,
  };

  return (
    <section
      aria-label="Abertura HelpHub"
      className="hh-hero relative -mt-[var(--hh-header-height)]"
      style={style}
    >
      <PinScrubStage
        runwayVh={380}
        scrub={0.85}
        beats={{ enter: [0, 0.2], details: [0.22, 0.52], hero: [0.52, 0.84] }}
        sceneKey={fit}
        proxyFrom={proxies.from}
        proxyEnter={proxies.enter}
        proxyDetails={proxies.details}
        proxyHero={proxies.hero}
        callouts={copy?.callouts ?? []}
        showChrome={false}
        showProgress={false}
        hint=""
        pinClassName="pt-[var(--hh-header-height)]"
        endHold={0.16}
        endSlot={endSlot}
        backdrop={
          <>
            <div className="absolute top-0 left-1/2 h-px w-full max-w-5xl -translate-x-1/2 bg-gradient-to-r from-transparent via-[color:var(--lab-accent)]/70 to-transparent" />
            <div className="absolute top-1/2 left-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--lab-accent)] opacity-20 blur-[110px]" />
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: "url(/noise.svg)",
                backgroundSize: "180px 180px",
              }}
            />
          </>
        }
        reducedFallback={
          <div className="flex h-full items-center justify-center" style={{ transform: "scale(1.12)" }}>
            <HubFallback objetos={objetos} />
          </div>
        }
      >
        <HubCanvas
          handle={premiumScene}
          accent={accent}
          primary={primary}
          objetos={objetos}
          openSeconds={OPEN_SECONDS}
          onOpen={() => setScrollOn(true)}
        />
      </PinScrubStage>
    </section>
  );
}
