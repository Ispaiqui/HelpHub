"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import type { CSSProperties } from "react";
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

/**
 * Capítulo de lab. Não é montado na home.
 * Cores, objetos, intuito e marca vêm de src/lib/animation-brief.ts.
 */
export function PremiumLabChapter() {
  const { cor, marca, copy, intuito, objetos } = animationBrief;
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
      id="lab-premium"
      aria-label="Lab Premium — animação pin e scrub"
      className="relative min-h-dvh"
      style={style}
    >
      <p className="sr-only">
        Laboratório de animação. Com redução de movimento, a cena fica no estado final, sem scrub.
      </p>

      <div className="mx-auto flex max-w-5xl flex-wrap items-end justify-between gap-3 border-b border-[color:color-mix(in_srgb,var(--lab-ink)_12%,transparent)] px-4 py-4 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <p className="font-sans text-[10px] uppercase tracking-[0.22em] opacity-60">
            Laboratório interno · a home não usa esta cena
          </p>
          <p className="mt-2 font-sans text-sm leading-6 opacity-80">
            {marca.name} · {intuito}
          </p>
        </div>
        <Link
          href="/"
          className="font-sans text-xs tracking-wide opacity-70 underline-offset-4 hover:opacity-100 hover:underline"
        >
          Voltar ao site
        </Link>
      </div>

      <PinScrubStage
        runwayVh={320}
        scrub={0.85}
        beats={{ enter: [0, 0.24], details: [0.26, 0.62], hero: [0.62, 1] }}
        proxyFrom={{ rotY: -1.15, scale: 0.7, posY: -0.32, camZ: 5.8 }}
        proxyEnter={{ rotY: 0.2, scale: 1, posY: 0, camZ: 4.75 }}
        proxyDetails={{ rotY: 1.35, scale: 1, posY: 0.02, camZ: 4.6 }}
        proxyHero={{ rotY: 0.55, scale: 1.18, posY: 0.06, camZ: 4.05 }}
        callouts={copy?.callouts ?? []}
        eyebrow={copy?.eyebrow ?? "Lab Premium · src/lib/animation-brief.ts"}
        title={copy?.title ?? "O hub sob o scroll"}
        tagline={copy?.tagline ?? marca.tagline}
        badge={copy?.badge ?? "pin + scrub · lab"}
        hint={copy?.hint}
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
