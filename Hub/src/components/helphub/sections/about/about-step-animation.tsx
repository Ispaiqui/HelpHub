"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import {
  AlertTriangle,
  Code,
  Headphones,
  Lightbulb,
  Search,
  type LucideIcon,
} from "lucide-react";
import { aboutSteps } from "./about-step-content";
import {
  CHARGE_MS,
  ENERGY_MS,
  HOLD_MS,
  LOOP_MS,
  SLIDE_MS,
  STEP_MS,
  sampleAt,
  type Phase,
} from "./about-step-motion";
import "./about-step-animation.css";

const steps: { name: string; description: string; icon: LucideIcon }[] = [
  { ...aboutSteps[0], icon: AlertTriangle },
  { ...aboutSteps[1], icon: Search },
  { ...aboutSteps[2], icon: Lightbulb },
  { ...aboutSteps[3], icon: Code },
  { ...aboutSteps[4], icon: Headphones },
];

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const MOVE = `transition-[transform,opacity] duration-700 ${EASE}`;
const CHARGE = `transition-[background-color,box-shadow,color,opacity,ring-color,ring-width] duration-200 ${EASE}`;

const SLOT = {
  farLeft: "hh-steps__card--far-left",
  left: "hh-steps__card--left",
  center: "hh-steps__card--center",
  right: "hh-steps__card--right",
  farRight: "hh-steps__card--far-right",
} as const;

export type AboutStepVariant = "desktop" | "mobile";

type FrameReport = {
  phase: Phase;
  beam: number;
  charge: number;
  slide: number;
};

declare global {
  interface Window {
    __renderAboutStepFrame?: (timeMs: number) => Promise<FrameReport>;
    __aboutStepCaptureReady?: boolean;
    __ABOUT_STEP_LOOP_MS?: number;
    __ABOUT_STEP_STEP_MS?: number;
    __ABOUT_STEP_HOLD_MS?: number;
  }
}

const getStepClasses = (
  i: number,
  activeIndex: number,
  phase: Phase,
  frozen: boolean,
  stepsCount: number,
) => {
  const nextIndex = (activeIndex + 1) % stepsCount;
  const prevIndex = (activeIndex - 1 + stepsCount) % stepsCount;
  const nextNextIndex = (activeIndex + 2) % stepsCount;
  const sliding = phase === "sliding";
  const moveClass = frozen ? "transition-none" : MOVE;

  let posClass: string = SLOT.farRight;
  let transitionClass = "transition-none";
  let isCharged = false;

  if (i === activeIndex) {
    transitionClass = moveClass;
    posClass = sliding ? SLOT.left : SLOT.center;
    isCharged = phase === "idle" || phase === "energy";
  } else if (i === nextIndex) {
    transitionClass = moveClass;
    posClass = sliding ? SLOT.center : SLOT.right;
    isCharged = phase === "charged" || phase === "sliding";
  } else if (i === prevIndex) {
    transitionClass = moveClass;
    posClass = sliding ? SLOT.farLeft : SLOT.left;
  } else if (i === nextNextIndex) {
    transitionClass = sliding && !frozen ? MOVE : "transition-none";
    posClass = sliding ? SLOT.right : SLOT.farRight;
  }

  return { posClass, transitionClass, isCharged };
};

function stageAnimations(stage: HTMLElement) {
  return stage.getAnimations({ subtree: true });
}

function seekMatching(stage: HTMLElement, timeMs: number | null, match: (anim: Animation, dur: number) => boolean) {
  if (timeMs == null) return 0;
  let count = 0;
  for (const anim of stageAnimations(stage)) {
    const duration = anim.effect?.getComputedTiming().duration;
    const dur = typeof duration === "number" ? duration : 0;
    if (!match(anim, dur)) continue;
    anim.pause();
    const held = Math.max(0, dur - 0.05);
    anim.currentTime = timeMs >= dur ? held : Math.max(0, timeMs);
    count += 1;
  }
  stage.getBoundingClientRect();
  return count;
}

function isBeam(anim: Animation) {
  return "animationName" in anim && anim.animationName === "hh-energy-travel";
}

function isCharge(_anim: Animation, dur: number) {
  return dur >= 180 && dur <= 240;
}

function isSlide(_anim: Animation, dur: number) {
  return dur >= 650 && dur <= 760;
}

type CaptureProps = {
  capture: true;
  variant: AboutStepVariant;
};

type LiveProps = {
  capture?: false;
  variant?: never;
};

export function AboutStepAnimation(props: CaptureProps | LiveProps) {
  const capture = props.capture === true;
  const variant = props.capture ? props.variant : "desktop";
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [frozen, setFrozen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const reducedMotion = useSyncExternalStore(
    (onStoreChange) => {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      query.addEventListener("change", onStoreChange);
      return () => query.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  const paused = capture ? false : !playing || reducedMotion;

  useEffect(() => {
    if (!capture) return;
    const stage = stageRef.current;
    if (!stage) return;

    const commit = (next: { activeIndex: number; phase: Phase; frozen: boolean }) => {
      flushSync(() => {
        setActiveIndex(next.activeIndex);
        setPhase(next.phase);
        setFrozen(next.frozen);
      });
      stage.getBoundingClientRect();
    };

    window.__ABOUT_STEP_LOOP_MS = LOOP_MS;
    window.__ABOUT_STEP_STEP_MS = STEP_MS;
    window.__ABOUT_STEP_HOLD_MS = HOLD_MS;
    window.__renderAboutStepFrame = async (timeMs: number) => {
      const sample = sampleAt(timeMs);
      const root = stage.closest(".hh-steps") ?? stage;

      root.classList.add("hh-steps--freeze");
      for (const anim of stageAnimations(stage)) anim.cancel();
      commit({ activeIndex: sample.activeIndex, phase: "idle", frozen: true });
      root.classList.remove("hh-steps--freeze");
      stage.getBoundingClientRect();

      if (sample.phase === "idle") {
        return { phase: "idle", beam: 0, charge: 0, slide: 0 };
      }

      // Liga a transição de posição antes de mudar o slot, senão o browser
      // não interpola (a classe de transition entra no mesmo frame).
      commit({ activeIndex: sample.activeIndex, phase: "idle", frozen: false });

      if (sample.phase === "energy") {
        commit({ activeIndex: sample.activeIndex, phase: "energy", frozen: false });
        const beam = seekMatching(stage, sample.beamMs, isBeam);
        return { phase: "energy", beam, charge: 0, slide: 0 };
      }

      commit({ activeIndex: sample.activeIndex, phase: "charged", frozen: false });
      const charge = seekMatching(stage, sample.chargeMs, isCharge);
      if (sample.phase === "charged") {
        return { phase: "charged", beam: 0, charge, slide: 0 };
      }

      commit({ activeIndex: sample.activeIndex, phase: "sliding", frozen: false });
      const slide = seekMatching(stage, sample.slideMs, isSlide);
      seekMatching(stage, sample.chargeMs, isCharge);
      return { phase: "sliding", beam: 0, charge, slide };
    };
    window.__aboutStepCaptureReady = true;

    return () => {
      delete window.__renderAboutStepFrame;
      window.__aboutStepCaptureReady = false;
    };
  }, [capture]);

  useEffect(() => {
    if (capture) return;
    const el = stageRef.current;
    if (!el) return;

    let inView = false;
    let pageVisible = document.visibilityState === "visible";

    const sync = () => {
      setPlaying(inView && pageVisible);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { threshold: 0.2 },
    );

    const onVisibility = () => {
      pageVisible = document.visibilityState === "visible";
      sync();
    };

    io.observe(el);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [capture]);

  useEffect(() => {
    if (capture || paused) return;

    let cancelled = false;
    let timers: ReturnType<typeof setTimeout>[] = [];
    const later = (ms: number, fn: () => void) => {
      timers.push(setTimeout(fn, ms));
    };

    const frame = requestAnimationFrame(() => {
      if (cancelled) return;
      setFrozen(false);
    });

    const cycle = () => {
      if (cancelled) return;
      timers = [];
      setPhase("energy");

      later(ENERGY_MS, () => {
        if (cancelled) return;
        setPhase("charged");
      });

      later(ENERGY_MS + CHARGE_MS, () => {
        if (cancelled) return;
        setPhase("sliding");
      });

      later(ENERGY_MS + CHARGE_MS + SLIDE_MS, () => {
        if (cancelled) return;
        setActiveIndex((prev) => (prev + 1) % steps.length);
        setPhase("idle");
        later(HOLD_MS, cycle);
      });
    };

    later(HOLD_MS, cycle);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      timers.forEach(clearTimeout);
    };
  }, [paused, capture]);

  const displayPhase = paused ? "idle" : phase;
  const displayFrozen = paused || frozen;
  const stepWidth = variant === "mobile" ? "148px" : "180px";

  return (
    <div
      className={capture ? "hh-steps hh-steps--capture" : "hh-steps mt-10 select-none px-2 sm:px-4"}
      data-variant={variant}
      style={capture ? { ["--hh-step-width" as string]: stepWidth } : undefined}
    >
      <div
        ref={stageRef}
        className={capture ? "hh-steps__stage" : "hh-steps__stage min-h-[280px] sm:min-h-[300px]"}
      >
        <div className="hh-steps__rail" />

        <div className="hh-steps__beam-track">
          {displayPhase === "energy" && <div className="hh-steps__beam" />}
        </div>

        {steps.map((step, i) => {
          const { posClass, transitionClass, isCharged } = getStepClasses(
            i,
            activeIndex,
            displayPhase,
            displayFrozen,
            steps.length,
          );
          const Icon = step.icon;

          return (
            <div
              key={step.name}
              className={`hh-steps__card ${transitionClass} ${posClass}`}
            >
              <div
                className={`relative z-[1] flex h-20 w-20 items-center justify-center overflow-hidden rounded-full ${CHARGE} ${
                  isCharged ? "bg-hh-blue-500 shadow-md" : "bg-card ring-1 ring-border shadow-lg"
                }`}
              >
                <div
                  className={`absolute inset-0 rounded-full bg-gradient-to-tr from-hh-blue-600 to-hh-blue-400 ${CHARGE} ${
                    isCharged ? "opacity-100" : "opacity-0"
                  }`}
                />

                <Icon
                  className={`relative z-10 h-7 w-7 ${CHARGE} ${
                    isCharged ? "text-white" : "text-muted-foreground"
                  }`}
                />
              </div>

              <h3
                className={`mt-5 text-base font-bold ${CHARGE} ${
                  isCharged ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.name}
              </h3>
              <p
                className={`mt-2 text-center text-sm leading-relaxed text-muted-foreground ${CHARGE} ${
                  isCharged ? "opacity-100" : "opacity-70"
                }`}
              >
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
