export const POINTER_LERP = 0.18;
export const INFLUENCE_LERP = 0.07;
export const REPEL_FORCE = 2600;
export const SPRING = 46;
export const DAMPING = 5.4;

const TAU = Math.PI * 2;
const FIXED_STEP = 1 / 120;

export interface LightNode {
  nx: number;
  ny: number;
  amp: number;
  freq: number;
  phase: number;
  amp2: number;
  freq2: number;
  phase2: number;
  restX: number;
  restY: number;
  offsetX: number;
  offsetY: number;
  vx: number;
  vy: number;
  x: number;
  y: number;
  packet: number;
  packetSpeed: number;
  outer: boolean;
}

export interface LightSimulation {
  width: number;
  height: number;
  time: number;
  nodes: LightNode[];
  pointer: {
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    influence: number;
    targetInfluence: number;
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function makeNode(index: number, ring: number, width: number, height: number): LightNode {
  const hub = ring === 0;
  const angle = (index / (ring === 1 ? 8 : 6)) * TAU - Math.PI / 2 + ring * 0.19;
  const radius = ring === 1 ? 0.22 + Math.sin(index * 2.3) * 0.02 : 0.375 + Math.sin(index * 1.7) * 0.035;
  const nx = hub ? 0.5 : 0.5 + Math.cos(angle) * radius;
  const ny = hub ? 0.3 : 0.3 + Math.sin(angle) * radius * 0.68;
  return {
    nx, ny,
    amp: hub ? 0.006 : 0.011 + (index % 3) * 0.003,
    freq: 0.22 + index * 0.027 + ring * 0.031,
    phase: index * 2.399 + ring * 0.7,
    amp2: hub ? 0.003 : 0.005,
    freq2: 0.13 + index * 0.019,
    phase2: index * 1.618 + ring,
    restX: nx * width, restY: ny * height,
    offsetX: 0, offsetY: 0, vx: 0, vy: 0,
    x: nx * width, y: ny * height,
    packet: (index * 0.173 + ring * 0.27) % 1,
    packetSpeed: 0.105 + (index % 4) * 0.012,
    outer: ring === 2,
  };
}

export function createSimulation(width: number, height: number): LightSimulation {
  const w = Math.max(1, width);
  const h = Math.max(1, height);
  const nodes = [makeNode(0, 0, w, h)];
  for (let i = 0; i < 8; i += 1) nodes.push(makeNode(i, 1, w, h));
  for (let i = 0; i < 6; i += 1) nodes.push(makeNode(i, 2, w, h));
  return {
    width: w, height: h, time: 0, nodes,
    pointer: { x: w / 2, y: h * 0.3, targetX: w / 2, targetY: h * 0.3, influence: 0, targetInfluence: 0 },
  };
}

export function resizeSimulation(sim: LightSimulation, width: number, height: number): void {
  const w = Math.max(1, width);
  const h = Math.max(1, height);
  const sx = w / sim.width;
  const sy = h / sim.height;
  for (const node of sim.nodes) {
    node.x *= sx; node.restX *= sx; node.offsetX *= sx; node.vx *= sx;
    node.y *= sy; node.restY *= sy; node.offsetY *= sy; node.vy *= sy;
  }
  sim.pointer.x *= sx; sim.pointer.targetX *= sx;
  sim.pointer.y *= sy; sim.pointer.targetY *= sy;
  sim.width = w;
  sim.height = h;
}

export function clearPointer(sim: LightSimulation, immediate = false): void {
  sim.pointer.targetInfluence = 0;
  if (!immediate) return;
  sim.pointer.influence = 0;
  for (const node of sim.nodes) {
    node.offsetX = 0; node.offsetY = 0; node.vx = 0; node.vy = 0;
    node.x = node.restX; node.y = node.restY;
  }
}

function integrate(sim: LightSimulation, dt: number): void {
  sim.time += dt;
  const side = Math.min(sim.width, sim.height);
  const motionScale = Math.min(side, 900);
  const margin = Math.min(26, side * 0.08);
  const radius = Math.max(140, Math.min(side * 0.38, 230));
  const maxOffset = Math.min(42, side * 0.1);
  const pointer = sim.pointer;
  const pointerBlend = 1 - Math.pow(1 - POINTER_LERP, dt * 60);
  const influenceBlend = 1 - Math.pow(1 - INFLUENCE_LERP, dt * 60);
  const restBlend = 1 - Math.exp(-2.8 * dt);
  pointer.x += (pointer.targetX - pointer.x) * pointerBlend;
  pointer.y += (pointer.targetY - pointer.y) * pointerBlend;
  pointer.influence += (pointer.targetInfluence - pointer.influence) * influenceBlend;

  for (const node of sim.nodes) {
    const a = sim.time * node.freq + node.phase;
    const b = sim.time * node.freq2 + node.phase2;
    const targetX = clamp(node.nx * sim.width + motionScale * (Math.sin(a) * node.amp + Math.cos(b) * node.amp2), margin, sim.width - margin);
    const targetY = clamp(node.ny * sim.height + motionScale * (Math.cos(a) * node.amp + Math.sin(b) * node.amp2), margin, sim.height - margin);
    node.restX += (targetX - node.restX) * restBlend;
    node.restY += (targetY - node.restY) * restBlend;

    const dx = node.x - pointer.x;
    const dy = node.y - pointer.y;
    const distance = Math.hypot(dx, dy);
    const falloff = Math.max(0, 1 - distance / radius);
    const force = REPEL_FORCE * falloff * falloff * pointer.influence;
    const ux = distance > 0.001 ? dx / distance : Math.cos(node.phase);
    const uy = distance > 0.001 ? dy / distance : Math.sin(node.phase);
    node.vx += (ux * force - SPRING * node.offsetX - DAMPING * node.vx) * dt;
    node.vy += (uy * force - SPRING * node.offsetY - DAMPING * node.vy) * dt;
    node.offsetX += node.vx * dt;
    node.offsetY += node.vy * dt;

    const displacement = Math.hypot(node.offsetX, node.offsetY);
    if (displacement > maxOffset) {
      const scale = maxOffset / displacement;
      node.offsetX *= scale; node.offsetY *= scale;
      const nx = node.offsetX / maxOffset;
      const ny = node.offsetY / maxOffset;
      const outward = Math.max(0, node.vx * nx + node.vy * ny);
      node.vx -= outward * nx; node.vy -= outward * ny;
    }
    const x = clamp(node.restX + node.offsetX, margin, sim.width - margin);
    const y = clamp(node.restY + node.offsetY, margin, sim.height - margin);
    if (x !== node.restX + node.offsetX) { node.offsetX = x - node.restX; node.vx = 0; }
    if (y !== node.restY + node.offsetY) { node.offsetY = y - node.restY; node.vy = 0; }
    node.x = x; node.y = y;
    node.packet = (node.packet + dt * node.packetSpeed) % 1;
  }
}

export function stepSimulation(sim: LightSimulation, delta: number): void {
  let remaining = Number.isFinite(delta) ? clamp(delta, 0, 0.05) : 0;
  // Subpassos estabilizam a mola quando um frame demora mais.
  while (remaining > 0.000001) {
    const step = Math.min(remaining, FIXED_STEP);
    integrate(sim, step);
    remaining -= step;
  }
}
