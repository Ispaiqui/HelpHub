"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Lightbulb, Code, Headphones, AlertTriangle, LucideIcon } from "lucide-react";

export interface StepItem {
  name: string;
  description: string;
  icon: LucideIcon;
}

const steps: StepItem[] = [
  { name: "Problema", description: "1. Entendemos a sua dor", icon: AlertTriangle },
  { name: "Análise", description: "2. Mapeamos o cenário", icon: Search },
  { name: "Solução", description: "3. Propomos a tecnologia", icon: Lightbulb },
  { name: "Implementação", description: "4. Colocamos em prática", icon: Code },
  { name: "Suporte", description: "5. Acompanhamos você", icon: Headphones },
];

const SLIDE_MS = 700;
const ENERGY_MS = 500;
const CHARGE_MS = 180;
const HOLD_MS = 4000;
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const MOVE = `transition-[transform,opacity] duration-700 ${EASE}`;
const CHARGE = `transition-[background-color,box-shadow,color,opacity,ring-color,ring-width] duration-200 ${EASE}`;

/** Slots posicionais definidos em globals.css (.hh-steps__card--*): cada um
 *  desloca o card em múltiplos da própria largura, nunca da largura do palco. */
const SLOT = {
  farLeft: "hh-steps__card--far-left",
  left: "hh-steps__card--left",
  center: "hh-steps__card--center",
  right: "hh-steps__card--right",
  farRight: "hh-steps__card--far-right",
} as const;

type Phase = "idle" | "energy" | "charged" | "sliding";

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

export function AboutStep() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [frozen, setFrozen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    setReducedMotion(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    query.addEventListener("change", onChange);

    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    // PT-BR: com "reduzir movimento" ativo a etapa atual fica estática,
    // sem ciclo automático e sem transições.
    if (!playing || reducedMotion) {
      setFrozen(true);
      setPhase("idle");
      return;
    }

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

      // Todos os timers do ciclo anterior já dispararam neste ponto.
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
  }, [playing, reducedMotion]);

  return (
    <div className="hh-steps mt-10 select-none px-2 sm:px-4">
      <div
        ref={stageRef}
        className="hh-steps__stage min-h-[280px] sm:min-h-[300px]"
      >
        <div className="hh-steps__rail" />

        <div className="hh-steps__beam-track">
          {phase === "energy" && <div className="hh-steps__beam" />}
        </div>

        {steps.map((step, i) => {
          const { posClass, transitionClass, isCharged } = getStepClasses(
            i,
            activeIndex,
            phase,
            frozen,
            steps.length,
          );
          const Icon = step.icon;

          return (
            <div
              key={step.name}
              className={`hh-steps__card ${transitionClass} ${posClass}`}
            >
              <div
                className={`
                  relative z-[1] flex h-20 w-20 items-center justify-center overflow-hidden rounded-full
                  ${CHARGE}
                  ${isCharged
                    ? "bg-hh-blue-500 shadow-md"
                    : "bg-card ring-1 ring-border shadow-lg"}
                `}
              >
                <div
                  className={`absolute inset-0 rounded-full bg-gradient-to-tr from-hh-blue-600 to-hh-blue-400 ${CHARGE} ${isCharged ? "opacity-100" : "opacity-0"}`}
                />

                <Icon
                  className={`relative z-10 h-7 w-7 ${CHARGE} ${isCharged ? "text-white" : "text-muted-foreground"}`}
                />
              </div>

              <h3 className={`mt-5 text-base font-bold ${CHARGE} ${isCharged ? "text-foreground" : "text-muted-foreground"}`}>
                {step.name}
              </h3>
              <p className={`mt-2 text-center text-sm leading-relaxed text-muted-foreground ${CHARGE} ${isCharged ? "opacity-100" : "opacity-70"}`}>
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
