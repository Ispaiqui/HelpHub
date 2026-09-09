"use client";

import { useEffect, useRef } from "react";

/**
 * PT-BR: Fundo da home — hub de luz em canvas.
 * A rede deriva sozinha o tempo todo; o cursor não a arrasta.
 * Perto do ponteiro, cada nó é empurrado e volta ao lugar por mola.
 * Sem teia: só feixes hub → satélite e glows radiais.
 */

type Rgb = { r: number; g: number; b: number };

type Node = {
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

const INNER = 8;
const OUTER = 6;
const MAX_DPR = 2;
const PIXEL_BUDGET = 2_200_000;

const POINTER_LERP = 0.18;
const INFLUENCE_LERP = 0.07;
const REPEL_FORCE = 2600;
const SPRING = 46;
const DAMPING = 5.4;

function seed(i: number, salt: number) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function parseCssColor(value: string): Rgb {
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

function rgba(c: Rgb, a: number) {
  return `rgba(${c.r},${c.g},${c.b},${a})`;
}

function readPalette(el: HTMLElement) {
  const styles = getComputedStyle(el);
  const dark = document.documentElement.classList.contains("dark");
  return {
    primary: parseCssColor(styles.getPropertyValue("--primary")),
    accent: parseCssColor(styles.getPropertyValue("--hh-blue-400")),
    gain: dark ? 1 : 0.42,
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

function buildNodes(): Node[] {
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

function drawGlow(
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

function drawBeam(
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

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const nodes = buildNodes();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let palette = readPalette(canvas);
    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let running = false;
    let time = 0;
    let last = performance.now();
    let mouseX = 0;
    let mouseY = 0;
    let hasPointer = false;
    let pointerX = 0;
    let pointerY = 0;
    let influence = 0;
    const rings = [0, 0.38, 0.72];

    const hub = nodes[0];

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      const nextW = Math.max(1, Math.floor(rect.width));
      const nextH = Math.max(1, Math.floor(rect.height));
      const area = nextW * nextH;
      const nextDpr = Math.min(window.devicePixelRatio || 1, area > PIXEL_BUDGET ? 1.25 : MAX_DPR);

      if (nextW === width && nextH === height && nextDpr === dpr) return;

      const scaleX = width > 0 ? nextW / width : 1;
      const scaleY = height > 0 ? nextH / height : 1;
      const first = width === 0;

      width = nextW;
      height = nextH;
      dpr = nextDpr;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (first) {
        for (const node of nodes) {
          node.bx = node.nx * width;
          node.by = node.ny * height;
          node.x = node.bx;
          node.y = node.by;
        }
        mouseX = hub.x;
        mouseY = hub.y;
        pointerX = hub.x;
        pointerY = hub.y;
        return;
      }

      for (const node of nodes) {
        node.bx *= scaleX;
        node.by *= scaleY;
        node.x *= scaleX;
        node.y *= scaleY;
      }
      mouseX *= scaleX;
      mouseY *= scaleY;
      pointerX *= scaleX;
      pointerY *= scaleY;
    };

    const paint = (animate: boolean, dt: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      const { primary, accent, gain } = palette;

      if (animate) {
        if (hasPointer) {
          pointerX += (mouseX - pointerX) * POINTER_LERP;
          pointerY += (mouseY - pointerY) * POINTER_LERP;
        }
        influence += ((hasPointer ? 1 : 0) - influence) * INFLUENCE_LERP;

        const radius = Math.max(140, Math.min(Math.min(width, height) * 0.38, 230));
        const active = influence > 0.002;

        for (const node of nodes) {
          const restX = node.nx * width;
          const restY = node.ny * height;
          const driftX =
            Math.sin(time * node.freq + node.phase) * node.ampX +
            Math.sin(time * node.freq2 + node.phase2) * node.ampX2;
          const driftY =
            Math.cos(time * node.freq * 0.85 + node.phase) * node.ampY +
            Math.cos(time * node.freq2 * 1.13 + node.phase2) * node.ampY2;
          node.bx += (restX + driftX - node.bx) * node.lag;
          node.by += (restY + driftY - node.by) * node.lag;

          let fx = 0;
          let fy = 0;
          if (active) {
            const dx = node.bx + node.offX - pointerX;
            const dy = node.by + node.offY - pointerY;
            const dist = Math.hypot(dx, dy);
            if (dist < radius) {
              const falloff = 1 - dist / radius;
              const push = falloff * falloff * REPEL_FORCE * node.react * influence;
              const inv = 1 / Math.max(dist, 1);
              fx = dx * inv * push;
              fy = dy * inv * push;
            }
          }

          node.vx += (fx - SPRING * node.offX - DAMPING * node.vx) * dt;
          node.vy += (fy - SPRING * node.offY - DAMPING * node.vy) * dt;
          node.offX += node.vx * dt;
          node.offY += node.vy * dt;

          node.x = node.bx + node.offX;
          node.y = node.by + node.offY;

          if (!node.hub) {
            node.packet = (node.packet + node.packetSpeed * dt) % 1;
          }
        }

        for (let i = 0; i < rings.length; i++) {
          rings[i] += dt * (0.07 + i * 0.01);
          if (rings[i] > 1) rings[i] -= 1;
        }
      }

      for (let i = 1; i < nodes.length; i++) {
        const node = nodes[i];
        const alpha = 0.22 * node.strength * gain;
        drawBeam(ctx, hub.x, hub.y, node.x, node.y, i % 2 ? primary : accent, alpha, 8 + node.strength * 6);
        drawBeam(ctx, hub.x, hub.y, node.x, node.y, primary, alpha * 0.45, 2.6);
      }

      for (let i = 0; i < rings.length; i++) {
        const p = rings[i];
        const radius = 42 + p * Math.min(width, height) * 0.32;
        ctx.strokeStyle = rgba(primary, (1 - p) * 0.12 * gain);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (let i = 1; i < nodes.length; i++) {
        const node = nodes[i];
        const px = hub.x + (node.x - hub.x) * node.packet;
        const py = hub.y + (node.y - hub.y) * node.packet;
        drawGlow(ctx, px, py, 14, primary, 0.55 * node.strength * gain);
      }

      for (let i = 1; i < nodes.length; i++) {
        const node = nodes[i];
        const color = i % 2 ? primary : accent;
        drawGlow(ctx, node.x, node.y, node.glow * 2.2, color, 0.22 * node.strength * gain);
        drawGlow(ctx, node.x, node.y, node.glow, color, 0.55 * node.strength * gain);
      }

      drawGlow(ctx, hub.x, hub.y, hub.glow * 2.8, primary, 0.2 * gain);
      drawGlow(ctx, hub.x, hub.y, hub.glow * 1.4, accent, 0.28 * gain);
      drawGlow(ctx, hub.x, hub.y, 28, primary, 0.85 * gain);

      ctx.globalCompositeOperation = "source-over";
    };

    const tick = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      time += dt;
      paint(true, dt);
      raf = requestAnimationFrame(tick);
    };

    let inView = true;

    const canRun = () => inView && !document.hidden && !reduced.matches;

    const start = () => {
      if (!canRun()) return;
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        hasPointer = false;
        return;
      }
      // Reentrada longe do último ponto: teleporta em vez de varrer a cena.
      if (!hasPointer && influence < 0.05) {
        pointerX = x;
        pointerY = y;
      }
      hasPointer = true;
      mouseX = x;
      mouseY = y;
    };

    const onLeave = () => {
      hasPointer = false;
    };

    const onVisibility = () => {
      if (!canRun()) {
        stop();
        return;
      }
      start();
    };

    const onMotion = () => {
      stop();
      if (reduced.matches) {
        paint(false, 0);
        return;
      }
      start();
    };

    const onTheme = () => {
      palette = readPalette(canvas);
      if (reduced.matches) paint(false, 0);
    };

    layout();
    paint(false, 0);
    start();

    const resize = new ResizeObserver(layout);
    resize.observe(canvas);

    const theme = new MutationObserver(onTheme);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    window.addEventListener("pointermove", onPointer, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", onMotion);

    return () => {
      stop();
      resize.disconnect();
      theme.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", onMotion);
    };
  }, []);

  return (
    <div aria-hidden className="hh-bg">
      <canvas ref={canvasRef} className="hh-bg__canvas" />
      <div className="hh-bg__noise" />
    </div>
  );
}
