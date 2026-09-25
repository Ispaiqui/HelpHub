"use client";

import { useEffect, useRef } from "react";
import {
  PIXEL_BUDGET,
  MAX_DPR,
  POINTER_LERP,
  INFLUENCE_LERP,
  REPEL_FORCE,
  SPRING,
  DAMPING,
  buildNodes,
  readPalette,
  rgba,
  drawGlow,
  drawBeam,
} from "./animated-background-physics";

/**
 * PT-BR: Fundo da home — hub de luz em canvas.
 * A rede deriva sozinha o tempo todo; o cursor não a arrasta.
 * Perto do ponteiro, cada nó é empurrado e volta ao lugar por mola.
 * Sem teia: só feixes hub → satélite e glows radiais.
 */

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

      const { primary, accent, gain, additive } = palette;
      ctx.globalCompositeOperation = additive ? "lighter" : "source-over";

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
