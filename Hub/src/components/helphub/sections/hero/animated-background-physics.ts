export type Rgb = { r: number; g: number; b: number };

export type Node = {
  nx: number;
  ny: number;
  x: number;
  y: number;
  bx: number;
  by: number;
  offX: number;
  offY: number;
  vx: number;
  vy: number;
  lag: number;
  react: number;
  ampX: number;
  ampY: number;
  freq: number;
  phase: number;
  ampX2: number;
  ampY2: number;
  freq2: number;
  phase2: number;
  glow: number;
  strength: number;
  hub: boolean;
  packet: number;
  packetSpeed: number;
};

export const INNER = 8;
export const OUTER = 6;
export const MAX_DPR = 2;
export const PIXEL_BUDGET = 2_200_000;

export const POINTER_LERP = 0.18;
export const INFLUENCE_LERP = 0.07;
export const REPEL_FORCE = 2600;
export const SPRING = 46;
export const DAMPING = 5.4;

export function seed(i: number, salt: number) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function parseCssColor(value: string): Rgb {
  const v = value.trim();
  const hex = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    return {
      r: Number.parseInt(h.slice(0, 2), 16),
      g: Number.parseInt(h.slice(2, 4), 16),
      b: Number.parseInt(h.slice(4, 6), 16),
    };
  }
  const rgb = v.match(/rgba?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*[, ]\s*([\d.]+)/i);
  if (rgb) {
    return { r: Number(rgb[1]), g: Number(rgb[2]), b: Number(rgb[3]) };
  }
  return { r: 37, g: 99, b: 235 };
}

export function rgba(c: Rgb, a: number) {
  return `rgba(${c.r},${c.g},${c.b},${a})`;
}

export function readPalette(el: HTMLElement) {
  const styles = getComputedStyle(el);
  const dark = document.documentElement.classList.contains("dark");
  return {
    primary: parseCssColor(styles.getPropertyValue(dark ? "--primary" : "--hh-blue-1000")),
    accent: parseCssColor(styles.getPropertyValue(dark ? "--hh-blue-400" : "--hh-blue-1000")),
    gain: dark ? 1 : 0.62,
    additive: dark,
  };
}

const REST = {
  x: 0,
  y: 0,
  bx: 0,
  by: 0,
  offX: 0,
  offY: 0,
  vx: 0,
  vy: 0,
} as const;

export function buildNodes(): Node[] {
  const nodes: Node[] = [
    {
      ...REST,
      nx: 0.5,
      ny: 0.3,
      lag: 0.035,
      react: 0.22,
      ampX: 9,
      ampY: 7,
      freq: 0.22,
      phase: 0.4,
      ampX2: 4,
      ampY2: 3,
      freq2: 0.53,
      phase2: 1.9,
      glow: 72,
      strength: 1,
      hub: true,
      packet: 0,
      packetSpeed: 0,
    },
  ];

  for (let i = 0; i < INNER; i++) {
    const t = (i / INNER) * Math.PI * 2 + 0.18;
    const radius = 0.2 + seed(i, 1) * 0.04;
    const strength = 0.55 + seed(i, 9) * 0.3;
    nodes.push({
      ...REST,
      nx: 0.5 + Math.cos(t) * radius * 0.92,
      ny: 0.3 + Math.sin(t) * radius,
      lag: 0.045 + seed(i, 2) * 0.07,
      react: 0.8 + strength * 0.5,
      ampX: 14 + seed(i, 4) * 16,
      ampY: 12 + seed(i, 5) * 14,
      freq: 0.18 + seed(i, 6) * 0.22,
      phase: seed(i, 7) * Math.PI * 2,
      ampX2: 5 + seed(i, 23) * 7,
      ampY2: 4 + seed(i, 24) * 6,
      freq2: 0.44 + seed(i, 25) * 0.42,
      phase2: seed(i, 26) * Math.PI * 2,
      glow: 26 + seed(i, 8) * 12,
      strength,
      hub: false,
      packet: seed(i, 10),
      packetSpeed: 0.08 + seed(i, 11) * 0.07,
    });
  }

  for (let i = 0; i < OUTER; i++) {
    const t = (i / OUTER) * Math.PI * 2 + 0.7;
    const radius = 0.34 + seed(i, 12) * 0.07;
    const strength = 0.28 + seed(i, 20) * 0.22;
    nodes.push({
      ...REST,
      nx: 0.5 + Math.cos(t) * radius * 1.05,
      ny: 0.32 + Math.sin(t) * radius * 0.95,
      lag: 0.03 + seed(i, 13) * 0.05,
      react: 1 + strength * 0.8,
      ampX: 20 + seed(i, 15) * 22,
      ampY: 16 + seed(i, 16) * 20,
      freq: 0.12 + seed(i, 17) * 0.18,
      phase: seed(i, 18) * Math.PI * 2,
      ampX2: 7 + seed(i, 27) * 9,
      ampY2: 6 + seed(i, 28) * 8,
      freq2: 0.31 + seed(i, 29) * 0.34,
      phase2: seed(i, 30) * Math.PI * 2,
      glow: 18 + seed(i, 19) * 10,
      strength,
      hub: false,
      packet: seed(i, 21),
      packetSpeed: 0.05 + seed(i, 22) * 0.05,
    });
  }

  return nodes;
}

export function drawGlow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: Rgb,
  alpha: number,
) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
  g.addColorStop(0, rgba(color, alpha));
  g.addColorStop(0.35, rgba(color, alpha * 0.35));
  g.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

export function drawBeam(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: Rgb,
  alpha: number,
  width: number,
) {
  const g = ctx.createLinearGradient(x1, y1, x2, y2);
  g.addColorStop(0, rgba(color, alpha));
  g.addColorStop(0.45, rgba(color, alpha * 0.55));
  g.addColorStop(1, rgba(color, 0));
  ctx.strokeStyle = g;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
