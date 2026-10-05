"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AlertTriangle, Search, Lightbulb, Code, Headphones } from "lucide-react";

const STEPS = [
  { title: "Problema", description: "1. Entendemos a sua dor", Icon: AlertTriangle },
  { title: "Análise", description: "2. Mapeamos o cenário", Icon: Search },
  { title: "Solução", description: "3. Propomos a tecnologia", Icon: Lightbulb },
  { title: "Implementação", description: "4. Colocamos em prática", Icon: Code },
  { title: "Suporte", description: "5. Acompanhamos você", Icon: Headphones },
] as const;

const HOLD_MS = 4000;
const BEAM_MS = 600;
const SLIDE_MS = 700;

// Feixe, carga e deslize são encadeados no CSS por transition-delay;
// o React só troca de fase duas vezes por ciclo.
const TIMING = {
  "--hh-beam-ms": `${BEAM_MS}ms`,
  "--hh-slide-ms": `${SLIDE_MS}ms`,
} as CSSProperties;

type Phase = "idle" | "transfer";
interface Cycle { activeIndex: number; phase: Phase }

export function AboutStep() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [cycle, setCycle] = useState<Cycle>({ activeIndex: 0, phase: "idle" });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;
    let running = false;
    let activeIndex = 0;
    let phase: Phase = "idle";
    let timer: number | null = null;

    const canRun = () => inView && !motion.matches && document.visibilityState === "visible";
    const publish = () =>
      setCycle((prev) =>
        prev.activeIndex === activeIndex && prev.phase === phase ? prev : { activeIndex, phase },
      );
    const cancel = () => {
      if (timer !== null) window.clearTimeout(timer);
      timer = null;
    };
    const finishTransfer = () => {
      activeIndex = (activeIndex + 1) % STEPS.length;
      phase = "idle";
    };
    const startTransfer = () => {
      phase = "transfer";
      publish();
      timer = window.setTimeout(endTransfer, BEAM_MS + SLIDE_MS);
    };
    const endTransfer = () => {
      finishTransfer();
      publish();
      timer = window.setTimeout(startTransfer, HOLD_MS);
    };
    const sync = () => {
      const nextRunning = canRun();
      if (nextRunning === running) return;
      running = nextRunning;
      cancel();
      // Pausar no meio da troca conclui o passo, para não voltar os cards.
      if (!running && phase === "transfer") finishTransfer();
      publish();
      if (running) timer = window.setTimeout(startTransfer, HOLD_MS);
    };

    const intersection = new IntersectionObserver(([entry]) => {
      inView = Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.2);
      sync();
    }, { threshold: [0, 0.2] });
    intersection.observe(stage);
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      cancel();
      intersection.disconnect();
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const { activeIndex, phase } = cycle;
  const transfer = phase === "transfer";
  const nextIndex = (activeIndex + 1) % STEPS.length;

  return (
    <div
      ref={stageRef}
      className="hh-steps mt-10 select-none px-2 sm:px-4"
      data-phase={phase}
      style={TIMING}
    >
      <div className="hh-steps__rail" aria-hidden="true" />
      <div className="hh-steps__energy" aria-hidden="true">
        <span className="hh-steps__trail" />
        <span className="hh-steps__beam" />
      </div>
      <ol className="hh-steps__list" aria-label="Etapas do atendimento HelpHub">
        {STEPS.map(({ title, description, Icon }, index) => {
          const distance = (index - activeIndex + STEPS.length) % STEPS.length;
          const restingSlot = distance > 2 ? distance - STEPS.length : distance;
          const wrapping = transfer && restingSlot === -2;
          const slot = transfer ? (wrapping ? 2 : restingSlot - 1) : restingSlot;
          const charged = transfer ? index === nextIndex : index === activeIndex;
          return (
            <li
              key={title}
              className="hh-steps__card"
              data-slot={slot}
              data-wrap={wrapping}
              data-charged={charged}
              aria-current={index === activeIndex ? "step" : undefined}
            >
              <div className="hh-steps__icon">
                <Icon size={29} strokeWidth={1.75} aria-hidden="true" />
              </div>
              <h3 className="hh-steps__title">{title}</h3>
              <p className="hh-steps__description">{description}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
