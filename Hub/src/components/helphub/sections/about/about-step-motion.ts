/** Tempos do carrossel de etapas. A captura de vídeo lê `LOOP_MS` da página. */

export const HOLD_MS = 4000;
export const ENERGY_MS = 500;
export const CHARGE_MS = 180;
export const SLIDE_MS = 700;
export const STEP_COUNT = 5;

export const STEP_MS = HOLD_MS + ENERGY_MS + CHARGE_MS + SLIDE_MS;
export const LOOP_MS = STEP_MS * STEP_COUNT;

export type Phase = "idle" | "energy" | "charged" | "sliding";

export type StepSample = {
  activeIndex: number;
  phase: Phase;
  /** Progresso da transição de cor (duration-200). Null antes de começar. */
  chargeMs: number | null;
  /** Progresso do deslize (duration-700). */
  slideMs: number | null;
  /** Progresso do feixe (animation 500ms). */
  beamMs: number | null;
};

export function sampleAt(timeMs: number): StepSample {
  const loop = ((timeMs % LOOP_MS) + LOOP_MS) % LOOP_MS;
  const activeIndex = Math.floor(loop / STEP_MS) % STEP_COUNT;
  const local = loop - activeIndex * STEP_MS;

  if (local < HOLD_MS) {
    return { activeIndex, phase: "idle", chargeMs: null, slideMs: null, beamMs: null };
  }

  if (local < HOLD_MS + ENERGY_MS) {
    return {
      activeIndex,
      phase: "energy",
      chargeMs: null,
      slideMs: null,
      beamMs: local - HOLD_MS,
    };
  }

  const afterEnergy = local - HOLD_MS - ENERGY_MS;
  if (afterEnergy < CHARGE_MS) {
    return {
      activeIndex,
      phase: "charged",
      chargeMs: afterEnergy,
      slideMs: null,
      beamMs: null,
    };
  }

  const slideMs = afterEnergy - CHARGE_MS;
  return {
    activeIndex,
    phase: "sliding",
    chargeMs: CHARGE_MS + slideMs,
    slideMs,
    beamMs: null,
  };
}
