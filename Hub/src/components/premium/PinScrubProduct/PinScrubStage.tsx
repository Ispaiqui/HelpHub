"use client";

import { useCallback, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
// Handle de módulo: o GSAP escreve e o canvas lê no useFrame, sem setState.
import { premiumScene } from "@/components/premium/premium-scene";
import { CalloutOverlay } from "./CalloutOverlay";
import {
  DEFAULT_BEATS,
  DEFAULT_PROXY_DETAILS,
  DEFAULT_PROXY_ENTER,
  DEFAULT_PROXY_FROM,
  DEFAULT_PROXY_HERO,
  type PinScrubStageProps,
  type SceneProxy,
} from "./types";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function readReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function mergeProxy(base: SceneProxy, partial?: Partial<SceneProxy>): SceneProxy {
  return { ...base, ...partial };
}

/**
 * Palco pin + scrub.
 * A timeline vai de 0 a 1, então o progresso do ScrollTrigger é a % do storyboard.
 * O filho lê `handle.proxy` em useFrame / rAF — sem setState a 60Hz.
 */
export function PinScrubStage({
  runwayVh = 320,
  scrub = 0.85,
  beats = DEFAULT_BEATS,
  proxyFrom,
  proxyEnter,
  proxyDetails,
  proxyHero,
  callouts = [],
  eyebrow = "Lab Premium · pin + scrub",
  title = "Role para controlar",
  hint = "↓ role para avançar a timeline",
  tagline = "Uma HUB para o seu negócio.",
  badge = "pin + scrub",
  showProgress = true,
  showChrome = true,
  className = "",
  pinClassName = "",
  endHold = 0,
  sceneKey = "",
  backdrop,
  reducedFallback,
  onProgress,
  endSlot,
  children,
}: PinScrubStageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const progressLabelRef = useRef<HTMLSpanElement>(null);
  const onProgressRef = useRef(onProgress);
  const keyframesRef = useRef({
    beats,
    proxyFrom,
    proxyEnter,
    proxyDetails,
    proxyHero,
    scrub,
  });

  useLayoutEffect(() => {
    onProgressRef.current = onProgress;
    keyframesRef.current = {
      beats,
      proxyFrom,
      proxyEnter,
      proxyDetails,
      proxyHero,
      scrub,
    };
  }, [beats, onProgress, proxyDetails, proxyEnter, proxyFrom, proxyHero, scrub]);
  const reduced = useSyncExternalStore(subscribeReducedMotion, readReducedMotion, () => false);
  const [ready, setReady] = useState(false);
  const [endLive, setEndLive] = useState(false);
  const endLiveRef = useRef(false);
  const endLiveAtRef = useRef(0.99);

  const syncEndInteractive = useCallback((progress: number) => {
    const root = rootRef.current;
    if (!root?.querySelector("[data-end-slot]")) return;
    const on = progress >= endLiveAtRef.current;
    if (on === endLiveRef.current) return;
    endLiveRef.current = on;
    setEndLive(on);
  }, []);

  const showFinalState = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const hero = mergeProxy(DEFAULT_PROXY_HERO, keyframesRef.current.proxyHero);
    const calloutEls = gsap.utils.toArray<HTMLElement>("[data-callout]", root);
    const lineEls = gsap.utils.toArray<HTMLElement>("[data-line]", root);
    const dotEls = gsap.utils.toArray<HTMLElement>("[data-dot]", root);
    const taglineEl = root.querySelector<HTMLElement>("[data-tagline]");
    const badgeEl = root.querySelector<HTMLElement>("[data-badge]");
    const hintEl = root.querySelector<HTMLElement>("[data-hint]");

    Object.assign(premiumScene.proxy, hero);
    premiumScene.progress = 1;
    gsap.set(calloutEls, { opacity: 0, x: 0 });
    gsap.set(lineEls, { opacity: 0, scaleX: 0 });
    gsap.set(dotEls, { opacity: 0, scale: 0 });
    const endEl = root.querySelector<HTMLElement>("[data-end-slot]");
    const copyEls = [taglineEl, badgeEl, endEl].filter((el): el is HTMLElement => el instanceof HTMLElement);
    if (copyEls.length) gsap.set(copyEls, { opacity: 1, y: 0 });
    if (endEl && !window.matchMedia("(min-width: 1280px)").matches) {
      gsap.set(endEl, { scaleX: 1, scaleY: 1.05, transformOrigin: "top center" });
    }
    if (hintEl) gsap.set(hintEl, { opacity: 0 });
    if (progressFillRef.current) progressFillRef.current.style.width = "100%";
    if (progressLabelRef.current) progressLabelRef.current.textContent = "100%";
    onProgressRef.current?.(1);
    syncEndInteractive(1);
  }, [syncEndInteractive]);

  useGSAP(
    () => {
      if (sceneKey === "boot") return;
      setReady(true);
      if (reduced) {
        showFinalState();
        return;
      }

      const root = rootRef.current;
      const pin = pinRef.current;
      if (!root || !pin) return;

      const hold = Math.min(0.4, Math.max(0, endHold));
      endLiveAtRef.current = hold > 0 ? 1 - hold : 0.99;

      const {
        beats: b,
        proxyFrom: pf,
        proxyEnter: pe,
        proxyDetails: pd,
        proxyHero: ph,
        scrub: scrubLag,
      } = keyframesRef.current;

      const from = mergeProxy(DEFAULT_PROXY_FROM, pf);
      const enter = mergeProxy(DEFAULT_PROXY_ENTER, pe);
      const details = mergeProxy(DEFAULT_PROXY_DETAILS, pd);
      const hero = mergeProxy(DEFAULT_PROXY_HERO, ph);
      Object.assign(premiumScene.proxy, from);
      const beatCfg = b ?? DEFAULT_BEATS;

      const calloutEls = gsap.utils.toArray<HTMLElement>("[data-callout]", root);
      const lineEls = gsap.utils.toArray<HTMLElement>("[data-line]", root);
      const dotEls = gsap.utils.toArray<HTMLElement>("[data-dot]", root);
      const taglineEl = root.querySelector<HTMLElement>("[data-tagline]");
      const badgeEl = root.querySelector<HTMLElement>("[data-badge]");
      const hintEl = root.querySelector<HTMLElement>("[data-hint]");
      const endEl = root.querySelector<HTMLElement>("[data-end-slot]");
      const copyEls = [taglineEl, badgeEl].filter((el): el is HTMLElement => el instanceof HTMLElement);

      gsap.set(calloutEls, {
        opacity: 0,
        x: (_i, el) => ((el as HTMLElement).dataset.side === "left" ? -22 : 22),
      });
      lineEls.forEach((line) => {
        gsap.set(line, {
          opacity: 0,
          scaleX: 0,
          transformOrigin: line.dataset.side === "left" ? "right center" : "left center",
        });
      });
      gsap.set(dotEls, { opacity: 0, scale: 0 });
      if (copyEls.length) gsap.set(copyEls, { opacity: 0, y: 18 });
      const endGrowsDown = Boolean(endEl) && !window.matchMedia("(min-width: 1280px)").matches;
      if (endEl) {
        gsap.set(endEl, {
          opacity: 0,
          y: 18,
          ...(endGrowsDown ? { scaleX: 1, scaleY: 1.05, transformOrigin: "top center" } : {}),
        });
      }
      if (hintEl) gsap.set(hintEl, { opacity: 1 });
      syncEndInteractive(0);

      Object.assign(premiumScene.proxy, from);
      const proxy = premiumScene.proxy;

      const [enterStart, enterEnd] = beatCfg.enter;
      const [detailsStart, detailsEnd] = beatCfg.details;
      const [heroStart, heroEnd] = beatCfg.hero;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          pin: pin,
          scrub: scrubLag,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            premiumScene.progress = p;
            const pct = Math.round(p * 100);
            if (progressFillRef.current) {
              progressFillRef.current.style.width = `${pct}%`;
            }
            if (progressLabelRef.current) {
              progressLabelRef.current.textContent = `${pct}%`;
            }
            if (hintEl) {
              const hintOpacity = p < 0.08 ? 1 : gsap.utils.clamp(0, 1, 1 - (p - 0.08) / 0.06);
              hintEl.style.opacity = String(hintOpacity);
            }
            onProgressRef.current?.(p);
            syncEndInteractive(p);
          },
        },
      });

      const enterDur = Math.max(0.01, enterEnd - enterStart);
      tl.fromTo(
        proxy,
        { ...from },
        {
          rotY: enter.rotY,
          scale: enter.scale * 1.06,
          posY: enter.posY,
          camZ: enter.camZ,
          duration: enterDur * 0.85,
        },
        enterStart,
      );
      tl.to(
        proxy,
        { scale: enter.scale, duration: enterDur * 0.15 },
        enterStart + enterDur * 0.85,
      );

      const detailsDur = Math.max(0.01, detailsEnd - detailsStart);
      const reveal = Math.min(0.12, detailsDur * 0.35);
      tl.to(
        calloutEls,
        { opacity: 1, x: 0, duration: reveal, stagger: reveal * 0.2 },
        detailsStart,
      );
      tl.to(
        lineEls,
        {
          opacity: 1,
          scaleX: 1,
          duration: reveal * 0.85,
          stagger: reveal * 0.2,
        },
        detailsStart,
      );
      tl.to(
        dotEls,
        {
          opacity: 1,
          scale: 1,
          duration: reveal * 0.6,
          stagger: reveal * 0.2,
        },
        detailsStart + 0.02,
      );
      tl.to(
        proxy,
        {
          rotY: details.rotY,
          scale: details.scale,
          posY: details.posY,
          camZ: details.camZ,
          duration: detailsDur,
        },
        detailsStart,
      );

      const heroDur = Math.max(0.01, heroEnd - heroStart);
      const retract = Math.min(0.1, heroDur * 0.25);
      tl.to(
        calloutEls,
        {
          opacity: 0,
          x: (_i, el) => ((el as HTMLElement).dataset.side === "left" ? -14 : 14),
          duration: retract,
          stagger: 0.015,
        },
        heroStart,
      );
      tl.to(
        lineEls,
        { opacity: 0, scaleX: 0, duration: retract * 0.8, stagger: 0.012 },
        heroStart,
      );
      tl.to(
        dotEls,
        { opacity: 0, scale: 0, duration: retract * 0.6, stagger: 0.012 },
        heroStart,
      );
      tl.to(
        proxy,
        {
          rotY: hero.rotY,
          scale: hero.scale,
          posY: hero.posY,
          camZ: hero.camZ,
          duration: heroDur * 0.75,
        },
        heroStart + retract * 0.3,
      );
      if (taglineEl) {
        tl.to(
          taglineEl,
          { opacity: 1, y: 0, duration: heroDur * 0.35 },
          heroStart + heroDur * 0.35,
        );
      }
      if (badgeEl) {
        tl.to(
          badgeEl,
          { opacity: 1, y: 0, duration: heroDur * 0.3 },
          heroStart + heroDur * 0.45,
        );
      }
      if (endEl) {
        tl.to(
          endEl,
          {
            opacity: 1,
            y: 0,
            ...(endGrowsDown ? { scaleX: 1, scaleY: 1.05 } : {}),
            duration: heroDur * 0.28,
          },
          heroStart + heroDur * 0.72,
        );
      }
      if (hold > 0) {
        const pad = { t: 0 };
        tl.to(pad, { t: 1, duration: hold, ease: "none" }, 1 - hold);
      }

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: rootRef, revertOnUpdate: true, dependencies: [showFinalState, runwayVh, reduced, endHold, sceneKey] },
  );

  return (
    <div ref={rootRef} className={className}>
      <div
        className="lab-pin-runway relative"
        style={{ height: `${runwayVh}dvh` }}
      >
        <div
          ref={pinRef}
          data-pin
          className={`relative z-10 flex h-[100dvh] flex-col overflow-hidden ${pinClassName}`}
          style={{ backgroundColor: "var(--lab-bg, #0f172a)" }}
        >
          {backdrop ? (
            <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
              {backdrop}
            </div>
          ) : null}

          {showChrome ? (
            <header className="relative z-30 flex shrink-0 items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.22em] opacity-60">
                  {eyebrow}
                </p>
                <h1 className="mt-1 font-sans text-2xl font-bold tracking-tight sm:text-[1.75rem]">
                  {title}
                </h1>
              </div>
              {showProgress ? (
                <div className="flex min-w-[7.5rem] flex-col items-end gap-1.5">
                  <span
                    ref={progressLabelRef}
                    className="font-sans text-[10px] uppercase tracking-[0.18em] opacity-60"
                  >
                    0%
                  </span>
                  <div className="h-1 w-28 overflow-hidden rounded-full bg-[color:color-mix(in_srgb,var(--lab-ink,#f8fafc)_14%,transparent)]">
                    <div
                      ref={progressFillRef}
                      data-progress-fill
                      className="h-full w-0 rounded-full bg-[color:var(--lab-accent,#60a5fa)]"
                    />
                  </div>
                </div>
              ) : null}
            </header>
          ) : null}

          <div
            className={`relative z-10 mx-auto flex min-h-0 w-full flex-1 flex-col ${
              endSlot ? "" : "max-w-5xl items-center justify-center px-4 pb-8 sm:px-8"
            }`}
          >
            {hint ? (
              <p
                data-hint
                className="pointer-events-none absolute top-1 z-20 font-sans text-[10px] uppercase tracking-[0.22em] opacity-60 sm:top-2"
              >
                {hint}
              </p>
            ) : null}

            <div
              className={
                endSlot ? "absolute inset-0" : "relative h-[min(58vh,520px)] w-full"
              }
            >
              {callouts.length > 0 ? <CalloutOverlay callouts={callouts} /> : null}

              <div className="absolute inset-0 z-10">
                {reduced && reducedFallback
                  ? reducedFallback
                  : ready
                    ? children
                    : (reducedFallback ?? null)}
              </div>
            </div>

            {endSlot ? (
              <div
                data-end-slot
                inert={!endLive}
                className={`hh-page-content absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[var(--lab-bg,#0f172a)] via-[var(--lab-bg,#0f172a)]/88 to-transparent pt-16 pb-6 text-center opacity-0 sm:pb-8 ${
                  endLive ? "pointer-events-auto" : "pointer-events-none"
                }`}
              >
                {endSlot}
              </div>
            ) : (
              <div className="relative z-20 mt-2 flex min-h-[4.75rem] max-w-xl flex-col items-center gap-3 self-center px-2 text-center">
                <p
                  data-tagline
                  className="font-sans text-xl font-bold leading-snug tracking-tight opacity-0 sm:text-3xl"
                >
                  {tagline}
                </p>
                <span
                  data-badge
                  className="inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--lab-accent,#60a5fa)_45%,transparent)] bg-[color:color-mix(in_srgb,var(--lab-ink,#f8fafc)_6%,transparent)] px-3 py-1 font-sans text-[10px] uppercase tracking-[0.2em] opacity-0"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--lab-accent,#60a5fa)]" />
                  {badge}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
