"use client";

import { useEffect, useRef } from "react";
import {
  clearPointer,
  createSimulation,
  resizeSimulation,
  stepSimulation,
  type LightSimulation,
} from "./animated-background-physics";

type RGB = readonly [number, number, number];
interface Palette {
  primary: RGB;
  accent: RGB;
  gain: number;
  composite: GlobalCompositeOperation;
}
interface Sprite {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}
interface SpriteCache {
  hub: Sprite;
  satellite: Sprite;
  beam: Sprite;
  packet: Sprite;
}

const FALLBACK: RGB = [37, 99, 235];
const TAU = Math.PI * 2;

function rgba(rgb: RGB, alpha: number): string {
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

function readPalette(dark: boolean): Palette {
  const style = getComputedStyle(document.documentElement);
  const probe = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  const resolve = (name: string): RGB => {
    const value = style.getPropertyValue(name).trim();
    if (!probe || !value || !CSS.supports("color", value)) return FALLBACK;
    probe.clearRect(0, 0, 1, 1);
    probe.fillStyle = "rgb(37, 99, 235)";
    probe.fillStyle = value;
    probe.fillRect(0, 0, 1, 1);
    const bytes = probe.getImageData(0, 0, 1, 1).data;
    return [bytes[0] ?? 37, bytes[1] ?? 99, bytes[2] ?? 235];
  };
  const primary = resolve(dark ? "--primary" : "--hh-blue-1000");
  return {
    primary,
    accent: dark ? resolve("--hh-blue-400") : primary,
    gain: dark ? 1 : 0.62,
    composite: dark ? "lighter" : "source-over",
  };
}

function makeSprite(width: number, height: number, dpr: number, paint: (ctx: CanvasRenderingContext2D) => void): Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.ceil(width * dpr));
  canvas.height = Math.max(1, Math.ceil(height * dpr));
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.scale(dpr, dpr);
    paint(ctx);
  }
  return { canvas, width, height };
}

function glow(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: RGB, alpha: number): void {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, rgba(color, alpha));
  gradient.addColorStop(0.22, rgba(color, alpha * 0.68));
  gradient.addColorStop(0.55, rgba(color, alpha * 0.2));
  gradient.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = gradient;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

function buildSprites(palette: Palette, dpr: number, side: number): SpriteCache {
  const hubRadius = Math.min(142, Math.max(86, side * 0.19));
  const satelliteRadius = Math.min(46, Math.max(30, side * 0.067));
  return {
    hub: makeSprite(hubRadius * 2, hubRadius * 2, dpr, (ctx) => {
      glow(ctx, hubRadius, hubRadius, hubRadius, palette.primary, 0.13);
      glow(ctx, hubRadius, hubRadius, hubRadius * 0.52, palette.accent, 0.23);
      glow(ctx, hubRadius, hubRadius, 28, palette.accent, 0.76);
    }),
    satellite: makeSprite(satelliteRadius * 2, satelliteRadius * 2, dpr, (ctx) => {
      glow(ctx, satelliteRadius, satelliteRadius, satelliteRadius, palette.primary, 0.105);
      glow(ctx, satelliteRadius, satelliteRadius, 11, palette.accent, 0.64);
      ctx.fillStyle = rgba(palette.accent, 0.68);
      ctx.beginPath();
      ctx.arc(satelliteRadius, satelliteRadius, 1.65, 0, TAU);
      ctx.fill();
    }),
    beam: makeSprite(256, 10, dpr, (ctx) => {
      const gradient = ctx.createLinearGradient(0, 0, 256, 0);
      gradient.addColorStop(0, rgba(palette.primary, 0));
      gradient.addColorStop(0.12, rgba(palette.primary, 0.34));
      gradient.addColorStop(0.62, rgba(palette.accent, 0.22));
      gradient.addColorStop(1, rgba(palette.accent, 0));
      ctx.strokeStyle = gradient;
      ctx.beginPath(); ctx.moveTo(0, 5); ctx.lineTo(256, 5);
      ctx.lineWidth = 5; ctx.globalAlpha = 0.16; ctx.stroke();
      ctx.lineWidth = 0.85; ctx.globalAlpha = 1; ctx.stroke();
    }),
    packet: makeSprite(64, 10, dpr, (ctx) => {
      const gradient = ctx.createLinearGradient(0, 0, 64, 0);
      gradient.addColorStop(0, rgba(palette.primary, 0));
      gradient.addColorStop(0.6, rgba(palette.accent, 0.24));
      gradient.addColorStop(0.88, rgba(palette.accent, 0.92));
      gradient.addColorStop(1, rgba(palette.accent, 0));
      ctx.strokeStyle = gradient;
      ctx.beginPath(); ctx.moveTo(0, 5); ctx.lineTo(64, 5);
      ctx.lineWidth = 7; ctx.globalAlpha = 0.12; ctx.stroke();
      ctx.lineWidth = 2; ctx.globalAlpha = 0.9; ctx.stroke();
    }),
  };
}

function drawScene(ctx: CanvasRenderingContext2D, sim: LightSimulation, palette: Palette, cache: SpriteCache, dpr: number): void {
  const hub = sim.nodes[0];
  if (!hub) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, sim.width, sim.height);
  ctx.globalCompositeOperation = palette.composite;

  for (let i = 1; i < sim.nodes.length; i += 1) {
    const node = sim.nodes[i];
    if (!node) continue;
    const dx = node.x - hub.x;
    const dy = node.y - hub.y;
    const length = Math.hypot(dx, dy);
    if (length < 1) continue;
    const depth = node.outer ? 0.64 : 1;
    ctx.save();
    ctx.translate(hub.x, hub.y);
    ctx.transform(dx / length, dy / length, -dy / length, dx / length, 0, 0);
    ctx.globalAlpha = palette.gain * depth;
    ctx.drawImage(cache.beam.canvas, 0, -5, length, 10);
    const packetLength = Math.min(64, length * 0.32);
    const head = packetLength + node.packet * Math.max(0, length - packetLength);
    const envelope = Math.sin(Math.PI * node.packet);
    ctx.globalAlpha = palette.gain * depth * envelope * 0.86;
    ctx.drawImage(cache.packet.canvas, head - packetLength, -5, packetLength, 10);
    ctx.restore();
  }

  const ringRadius = Math.min(180, Math.min(sim.width, sim.height) * 0.3);
  ctx.strokeStyle = rgba(palette.accent, 0.22);
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 3; i += 1) {
    const progress = (sim.time * 0.095 + i / 3) % 1;
    ctx.globalAlpha = palette.gain * Math.sin(progress * Math.PI) * (1 - progress) * 0.55;
    ctx.beginPath();
    ctx.arc(hub.x, hub.y, 22 + ringRadius * progress, 0, TAU);
    ctx.stroke();
  }

  for (let i = 1; i < sim.nodes.length; i += 1) {
    const node = sim.nodes[i];
    if (!node) continue;
    const arrival = Math.pow(Math.max(0, (node.packet - 0.8) / 0.2), 2) * Math.sin(node.packet * Math.PI);
    ctx.globalAlpha = palette.gain * (node.outer ? 0.68 : 0.9) * (0.9 + arrival * 0.35);
    const scale = node.outer ? 0.84 : 1;
    const size = cache.satellite.width * scale;
    ctx.drawImage(cache.satellite.canvas, node.x - size / 2, node.y - size / 2, size, size);
  }
  ctx.globalAlpha = palette.gain * (0.94 + Math.sin(sim.time * 0.48) * 0.035);
  ctx.drawImage(cache.hub.canvas, hub.x - cache.hub.width / 2, hub.y - cache.hub.height / 2, cache.hub.width, cache.hub.height);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !host || !ctx) return;

    const root = document.documentElement;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = motion.matches;
    let dark = root.classList.contains("dark");
    let palette = readPalette(dark);
    let bounds = canvas.getBoundingClientRect();
    let boundsDirty = false;
    const sim = createSimulation(bounds.width, bounds.height);
    let width = 0;
    let height = 0;
    let dpr = 0;
    let cache: SpriteCache | null = null;
    let inView = false;
    let focused = document.hasFocus();
    let disposed = false;
    let frame: number | null = null;
    let lastTime: number | null = null;

    const canRun = () => !disposed && !reduced && inView && focused && document.visibilityState === "visible" && width > 0 && height > 0;
    const paint = () => {
      if (cache && width > 0 && height > 0) drawScene(ctx, sim, palette, cache, dpr);
    };
    const tick = (timestamp: number) => {
      frame = null;
      if (!canRun()) { lastTime = null; return; }
      const dt = lastTime === null ? 0 : Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;
      stepSimulation(sim, dt);
      paint();
      frame = window.requestAnimationFrame(tick);
    };
    const syncLoop = () => {
      if (canRun()) {
        if (frame === null) { lastTime = null; frame = window.requestAnimationFrame(tick); }
      } else {
        if (frame !== null) window.cancelAnimationFrame(frame);
        frame = null;
        lastTime = null;
        clearPointer(sim);
      }
    };
    const resize = (nextWidth: number, nextHeight: number) => {
      const nextDpr = Math.min(window.devicePixelRatio || 1, nextWidth * nextHeight > 2_200_000 ? 1.25 : 2);
      if (width === nextWidth && height === nextHeight && dpr === nextDpr) return;
      width = nextWidth; height = nextHeight; dpr = nextDpr;
      boundsDirty = true;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      resizeSimulation(sim, width, height);
      clearPointer(sim);
      cache = buildSprites(palette, dpr, Math.min(width, height));
      paint();
      syncLoop();
    };
    const refreshSize = () => {
      bounds = canvas.getBoundingClientRect();
      resize(bounds.width, bounds.height);
      boundsDirty = false;
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!canRun() || event.pointerType === "touch") return;
      if (boundsDirty) { bounds = canvas.getBoundingClientRect(); boundsDirty = false; }
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const inside = x >= 0 && y >= 0 && x <= bounds.width && y <= bounds.height;
      sim.pointer.targetInfluence = inside ? 1 : 0;
      if (inside) {
        sim.pointer.targetX = x * width / Math.max(1, bounds.width);
        sim.pointer.targetY = y * height / Math.max(1, bounds.height);
      }
    };
    const onPointerLeave = () => clearPointer(sim);
    const onPointerOut = (event: PointerEvent) => { if (event.relatedTarget === null) onPointerLeave(); };
    const onScroll = () => { boundsDirty = true; clearPointer(sim); };
    const onBlur = () => { focused = false; syncLoop(); };
    const onFocus = () => { focused = true; boundsDirty = true; syncLoop(); };
    const onVisibility = () => { focused = document.hasFocus(); boundsDirty = true; syncLoop(); };
    const onMotion = () => {
      reduced = motion.matches;
      // Reduced motion mantém um frame estático, sem agendar outro rAF.
      if (reduced) clearPointer(sim, true);
      syncLoop();
      paint();
    };

    const intersection = new IntersectionObserver(([entry]) => {
      inView = Boolean(entry?.isIntersecting);
      boundsDirty = true;
      syncLoop();
    });
    const observer = new ResizeObserver(([entry]) => {
      if (entry) resize(entry.contentRect.width, entry.contentRect.height);
    });
    const theme = new MutationObserver(() => {
      const nextDark = root.classList.contains("dark");
      if (nextDark === dark) return;
      dark = nextDark;
      palette = readPalette(dark);
      if (dpr > 0) cache = buildSprites(palette, dpr, Math.min(width, height));
      paint();
    });
    let resolution = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
    const onResolution = () => {
      resolution.removeEventListener("change", onResolution);
      refreshSize();
      resolution = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
      resolution.addEventListener("change", onResolution);
    };

    refreshSize();
    observer.observe(host);
    intersection.observe(host);
    theme.observe(root, { attributes: true, attributeFilter: ["class"] });
    resolution.addEventListener("change", onResolution);
    motion.addEventListener("change", onMotion);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerout", onPointerOut, { passive: true });
    window.addEventListener("pointercancel", onPointerLeave, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", refreshSize, { passive: true });
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      disposed = true;
      if (frame !== null) window.cancelAnimationFrame(frame);
      intersection.disconnect(); observer.disconnect(); theme.disconnect();
      resolution.removeEventListener("change", onResolution);
      motion.removeEventListener("change", onMotion);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("pointercancel", onPointerLeave);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", refreshSize);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      cache = null;
    };
  }, []);

  return (
    <div className="hh-bg" aria-hidden="true">
      <canvas ref={canvasRef} className="hh-bg__canvas" />
      <div className="hh-bg__noise" />
    </div>
  );
}
