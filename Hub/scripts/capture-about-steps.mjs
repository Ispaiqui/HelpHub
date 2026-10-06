/**
 * Grava o carrossel de etapas (about-step) em MP4, WebM e poster.
 *
 * A página /capture/about-steps expõe o tempo do componente. Este script
 * avança o relógio quadro a quadro (sem esperar o timer real), tira PNG
 * e codifica com ffmpeg. Quadros parados do hold são reaproveitados.
 *
 * Uso (com `pnpm dev` em outro terminal):
 *   pnpm capture:about-steps
 *   pnpm capture:about-steps -- --only=desktop --sample
 *
 * Ver scripts/README.md.
 */
import { spawn } from "node:child_process";
import { accessSync, constants as fsConstants } from "node:fs";
import { copyFile, mkdir, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const media = JSON.parse(
  await readFile(
    path.join(root, "src/components/helphub/sections/about/about-step-media.json"),
    "utf8",
  ),
);

const FPS = 30;
const DPR = 2;
const args = process.argv.slice(2);
const only = args.find((arg) => arg.startsWith("--only="))?.slice("--only=".length) ?? null;
const sample = args.includes("--sample");
const base = args.find((arg) => arg.startsWith("--base="))?.slice("--base=".length) ?? "http://localhost:3000";

const chromeCandidates = [
  process.env.CHROME_PATH,
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);

const jobs = [
  job("desktop", "desktop", "light", media.desktop),
  job("desktop-dark", "desktop", "dark", media.desktop),
  job("mobile", "mobile", "light", media.mobile),
  job("mobile-dark", "mobile", "dark", media.mobile),
].filter((item) => !only || item.id === only);

function job(id, variant, theme, bucket) {
  return {
    id,
    variant,
    theme,
    width: bucket.width,
    height: bucket.height,
    files: bucket[theme],
  };
}

function resolveChrome() {
  for (const candidate of chromeCandidates) {
    try {
      accessSync(candidate, fsConstants.X_OK);
      return candidate;
    } catch {
      // continua
    }
  }
  throw new Error("Chrome/Chromium não encontrado. Defina CHROME_PATH.");
}

function ffmpeg(ffArgs) {
  return new Promise((resolve, reject) => {
    const child = spawn("ffmpeg", ffArgs, { stdio: ["ignore", "ignore", "pipe"] });
    let err = "";
    child.stderr.on("data", (chunk) => {
      err += chunk.toString();
    });
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(err.slice(-2500)));
    });
  });
}

function publicFile(urlPath) {
  return path.join(root, "public", urlPath.replace(/^\//, ""));
}

async function captureJob(browser, item) {
  const context = await browser.newContext({
    viewport: { width: item.width, height: item.height },
    deviceScaleFactor: DPR,
    colorScheme: item.theme,
    reducedMotion: "no-preference",
  });
  await context.addInitScript((theme) => {
    localStorage.setItem("theme", theme);
  }, item.theme);

  const page = await context.newPage();
  const url = `${base}/capture/about-steps?theme=${item.theme}&variant=${item.variant}`;
  await page.goto(url, { waitUntil: "load" });
  await page.waitForFunction(
    (expected) =>
      window.__aboutStepCaptureReady === true &&
      document.querySelector(".hh-steps")?.getAttribute("data-variant") === expected.variant &&
      document.documentElement.classList.contains(expected.theme),
    { variant: item.variant, theme: item.theme },
  );
  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  const timing = await page.evaluate(() => ({
    loopMs: window.__ABOUT_STEP_LOOP_MS,
    stepMs: window.__ABOUT_STEP_STEP_MS,
    holdMs: window.__ABOUT_STEP_HOLD_MS,
  }));
  if (!timing.loopMs || !timing.stepMs || !timing.holdMs) {
    throw new Error("A página de captura não publicou os tempos da animação.");
  }
  if ((timing.loopMs * FPS) % 1000 !== 0) {
    throw new Error(
      `LOOP_MS ${timing.loopMs} não fecha em ${FPS} fps. Ajuste o fps ou a duração.`,
    );
  }

  const frameCount = (timing.loopMs * FPS) / 1000;
  const frameDir = path.join(os.tmpdir(), "helphub-about-steps", item.id);
  await rm(frameDir, { recursive: true, force: true });
  await mkdir(frameDir, { recursive: true });

  const sampleTimes = [0, 4250, 4680, 5030, timing.stepMs];
  const times = sample
    ? sampleTimes
    : Array.from({ length: frameCount }, (_, index) => (index * 1000) / FPS);

  const holdFiles = new Map();
  let shot = 0;

  for (let index = 0; index < times.length; index += 1) {
    const timeMs = times[index];
    const step = Math.floor(timeMs / timing.stepMs) % 5;
    const local = timeMs - Math.floor(timeMs / timing.stepMs) * timing.stepMs;
    const holding = local < timing.holdMs;
    const file = path.join(frameDir, `frame-${String(index).padStart(4, "0")}.png`);

    if (!sample && holding && holdFiles.has(step)) {
      await copyFile(holdFiles.get(step), file);
      continue;
    }

    const report = await page.evaluate(async (time) => window.__renderAboutStepFrame(time), timeMs);
    if (report.phase === "energy" && report.beam < 1) {
      throw new Error(`Feixe não animou em t=${timeMs} (${item.id}).`);
    }
    if (report.phase === "charged" && report.charge < 1) {
      throw new Error(`Carga não animou em t=${timeMs} (${item.id}).`);
    }
    if (report.phase === "sliding" && report.slide < 1) {
      throw new Error(`Deslize não animou em t=${timeMs} (${item.id}).`);
    }

    await page.screenshot({
      path: file,
      type: "png",
      animations: "allow",
      caret: "hide",
    });
    shot += 1;
    if (holding) holdFiles.set(step, file);
    if (shot % 25 === 0) {
      console.log(`  ${item.id}: ${index + 1}/${times.length} (capturas ${shot})`);
    }
  }

  const probe = await sharp(path.join(frameDir, "frame-0000.png")).metadata();
  console.log(`  ${item.id}: ${probe.width}x${probe.height}, capturas ${shot}/${times.length}`);
  if ((probe.width ?? 1) % 2 !== 0 || (probe.height ?? 1) % 2 !== 0) {
    throw new Error(`Dimensão ímpar ${probe.width}x${probe.height}; H.264 exige par.`);
  }

  if (sample) {
    const preview = path.join(os.tmpdir(), "helphub-about-steps-preview", item.id);
    await rm(preview, { recursive: true, force: true });
    await mkdir(preview, { recursive: true });
    for (let index = 0; index < times.length; index += 1) {
      await copyFile(
        path.join(frameDir, `frame-${String(index).padStart(4, "0")}.png`),
        path.join(preview, `t-${times[index]}.png`),
      );
    }
    console.log(`  prévia em ${preview}`);
    await context.close();
    return;
  }

  const mp4 = publicFile(item.files.mp4);
  const webm = publicFile(item.files.webm);
  const poster = publicFile(item.files.poster);
  await mkdir(path.dirname(mp4), { recursive: true });

  await sharp(path.join(frameDir, "frame-0000.png")).webp({ quality: 82 }).toFile(poster);

  const input = ["-y", "-framerate", String(FPS), "-i", path.join(frameDir, "frame-%04d.png")];
  console.log(`  codificando ${path.basename(mp4)}`);
  await ffmpeg([
    ...input,
    "-an",
    "-c:v",
    "libx264",
    "-profile:v",
    "high",
    "-pix_fmt",
    "yuv420p",
    "-crf",
    "20",
    "-preset",
    "slow",
    "-g",
    "60",
    "-movflags",
    "+faststart",
    "-color_primaries",
    "bt709",
    "-colorspace",
    "bt709",
    "-color_trc",
    "bt709",
    mp4,
  ]);

  console.log(`  codificando ${path.basename(webm)}`);
  await ffmpeg([
    ...input,
    "-an",
    "-c:v",
    "libvpx-vp9",
    "-pix_fmt",
    "yuv420p",
    "-crf",
    "34",
    "-b:v",
    "0",
    "-row-mt",
    "1",
    "-deadline",
    "good",
    "-cpu-used",
    "4",
    "-g",
    "60",
    "-lag-in-frames",
    "25",
    webm,
  ]);

  await context.close();
  await rm(frameDir, { recursive: true, force: true });
}

const executablePath = resolveChrome();
const browser = await chromium.launch({
  executablePath,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars"],
});

try {
  for (const item of jobs) {
    console.log(`capturando ${item.id} (${item.width}x${item.height} @${DPR}x, ${item.theme})`);
    await captureJob(browser, item);
  }
} finally {
  await browser.close();
}

console.log("ok");
