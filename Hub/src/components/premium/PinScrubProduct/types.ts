import type { ReactNode } from "react";

/** Proxy mutável — o GSAP interpola; o filho lê em useFrame / rAF (sem setState a 60Hz). */
export type SceneProxy = {
  rotY: number;
  scale: number;
  posY: number;
  camZ: number;
};

/** Faixas 0–1 do scrub pinado. */
export type BeatRange = readonly [start: number, end: number];

export type BeatsConfig = {
  /** O produto aparece e assenta. */
  enter: BeatRange;
  /** Callouts visíveis, com tempo de leitura. */
  details: BeatRange;
  /** Callouts saem; hero + tagline. */
  hero: BeatRange;
};

export type CalloutSide = "left" | "right";

export type CalloutItem = {
  id: string;
  label: string;
  value: string;
  side: CalloutSide;
  /** CSS top, ex.: "26%" */
  top: string;
};

export const DEFAULT_BEATS: BeatsConfig = {
  enter: [0, 0.24],
  details: [0.26, 0.62],
  hero: [0.62, 1],
};

export const DEFAULT_PROXY_FROM: SceneProxy = {
  rotY: -0.7,
  scale: 0.68,
  posY: -0.4,
  camZ: 5.4,
};

export const DEFAULT_PROXY_ENTER: SceneProxy = {
  rotY: 0.08,
  scale: 0.98,
  posY: 0,
  camZ: 4.85,
};

export const DEFAULT_PROXY_DETAILS: SceneProxy = {
  rotY: 0.42,
  scale: 0.98,
  posY: 0,
  camZ: 4.85,
};

export const DEFAULT_PROXY_HERO: SceneProxy = {
  rotY: 0.22,
  scale: 1.2,
  posY: 0.06,
  camZ: 4.3,
};

/**
 * Objeto estável que o GSAP muta.
 * Leia `proxy` e `progress` no useFrame / rAF — não copie para state.
 */
export type SceneHandle = {
  proxy: SceneProxy;
  progress: number;
};

export type PinScrubStageProps = {
  /** Altura da pista de scroll em vh (distância do pin). Padrão 320. */
  runwayVh?: number;
  /** Atraso do scrub do ScrollTrigger. Padrão 0.85. */
  scrub?: number;
  beats?: BeatsConfig;
  proxyFrom?: Partial<SceneProxy>;
  proxyEnter?: Partial<SceneProxy>;
  proxyDetails?: Partial<SceneProxy>;
  proxyHero?: Partial<SceneProxy>;
  callouts?: CalloutItem[];
  eyebrow?: string;
  title?: string;
  hint?: string;
  tagline?: string;
  badge?: string;
  showProgress?: boolean;
  className?: string;
  /** Camada atrás do palco (ruído, glow). Não recebe ponteiro. */
  backdrop?: ReactNode;
  /** Estado estático quando prefers-reduced-motion (também placeholder de SSR). */
  reducedFallback?: ReactNode;
  /** Dispara no scrub. Só DOM — sem state React. */
  onProgress?: (progress: number) => void;
  children?: ReactNode;
};
