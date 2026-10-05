"use client";

import dynamic from "next/dynamic";
import type { CSSProperties, ReactNode } from "react";
import { PinScrubStage } from "@/components/premium/PinScrubProduct";
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

/**
 * Hero público: mesma cena pin/scrub do brief.
 * Sem a barra do lab. Texto e botões chegam em `endSlot`.
 */
export function HeroScrub({ endSlot }: HeroScrubProps) {
  const { cor, copy, objetos } = animationBrief;
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
      className="relative -mt-[var(--hh-header-height)]"
      style={style}
    >
      <PinScrubStage
        runwayVh={380}
        scrub={0.85}
        beats={{ enter: [0, 0.2], details: [0.22, 0.52], hero: [0.52, 0.84] }}
        proxyFrom={{ rotY: -0.85, scale: 0.96, posY: -0.12, camZ: 4.35 }}
        proxyEnter={{ rotY: 0.2, scale: 1.16, posY: 0, camZ: 4.15 }}
        proxyDetails={{ rotY: 1.15, scale: 1.16, posY: 0.02, camZ: 4.05 }}
        proxyHero={{ rotY: 0.45, scale: 1.28, posY: 0.04, camZ: 3.7 }}
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
        />
      </PinScrubStage>
    </section>
  );
}
