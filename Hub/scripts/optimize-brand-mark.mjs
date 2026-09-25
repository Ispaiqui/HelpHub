import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const require = createRequire(
  new URL(
    "../node_modules/.pnpm/sharp@0.35.4_@types+node@20.19.43/node_modules/sharp/package.json",
    import.meta.url
  )
);
const sharp = require("sharp");

const root = path.resolve(import.meta.dirname, "..");
const src = path.join(root, "public", "helplogoo.jpeg");

const image = sharp(src);
const meta = await image.metadata();
console.log("source", { width: meta.width, height: meta.height, format: meta.format, size: meta.size });

const { data, info } = await image
  .clone()
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const isWhite = (i) => {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  return r > 245 && g > 245 && b > 245;
};

const rowInk = (y) => {
  let ink = 0;
  const start = y * width * channels;
  for (let x = 0; x < width; x++) {
    if (!isWhite(start + x * channels)) ink++;
  }
  return ink;
};

const rows = Array.from({ length: height }, (_, y) => rowInk(y));
const threshold = Math.max(8, Math.floor(width * 0.01));
let top = 0;
while (top < height && rows[top] < threshold) top++;
let bottom = height - 1;
while (bottom > top && rows[bottom] < threshold) bottom--;

const gaps = [];
let inGap = false;
let gapStart = 0;
for (let y = top; y <= bottom; y++) {
  const empty = rows[y] < threshold;
  if (empty && !inGap) {
    inGap = true;
    gapStart = y;
  } else if (!empty && inGap) {
    gaps.push({ start: gapStart, end: y - 1, size: y - gapStart });
    inGap = false;
  }
}

const contentHeight = bottom - top + 1;
const splitGap = gaps
  .filter((g) => g.size > Math.floor(contentHeight * 0.04) && g.start > top + contentHeight * 0.25)
  .sort((a, b) => b.size - a.size)[0];

const markBottom = splitGap ? splitGap.start - 1 : top + Math.floor(contentHeight * 0.58);

const colInk = (x, y0, y1) => {
  let ink = 0;
  for (let y = y0; y <= y1; y++) {
    const i = (y * width + x) * channels;
    if (!isWhite(i)) ink++;
  }
  return ink;
};

let left = 0;
while (left < width && colInk(left, top, markBottom) < 4) left++;
let right = width - 1;
while (right > left && colInk(right, top, markBottom) < 4) right--;

const pad = Math.round(Math.max(markBottom - top, right - left) * 0.08);
const extractLeft = Math.max(0, left - pad);
const extractTop = Math.max(0, top - pad);
const extract = {
  left: extractLeft,
  top: extractTop,
  width: Math.min(width - extractLeft, right + pad - extractLeft + 1),
  height: Math.min(height - extractTop, markBottom + pad - extractTop + 1),
};

console.log({ top, markBottom, left, right, extract, gaps: gaps.slice(0, 8) });

const markBuf = await sharp(src).extract(extract).png().toBuffer();
const punched = await sharp(markBuf)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const out = Buffer.from(punched.data);
for (let i = 0; i < out.length; i += punched.info.channels) {
  const r = out[i];
  const g = out[i + 1];
  const b = out[i + 2];
  if (r > 248 && g > 248 && b > 248) out[i + 3] = 0;
}

const transparent = await sharp(out, {
  raw: { width: punched.info.width, height: punched.info.height, channels: punched.info.channels },
})
  .png()
  .toBuffer();

const squarePad = async (input, size) => {
  const resized = sharp(input).resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } });
  return resized.png({ compressionLevel: 9, palette: true }).toBuffer();
};

async function lightenForDark(pngBuf) {
  const { data, info } = await sharp(pngBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += info.channels) {
    if (out[i + 3] < 8) continue;
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    const accent = b > r + 25 && b > g + 15;
    if (accent) {
      out[i] = Math.min(255, Math.round(r * 0.25 + 90));
      out[i + 1] = Math.min(255, Math.round(g * 0.35 + 165));
      out[i + 2] = 255;
      continue;
    }
    const t = 0.82;
    out[i] = Math.round(r * (1 - t) + 255 * t);
    out[i + 1] = Math.round(g * (1 - t) + 255 * t);
    out[i + 2] = Math.round(b * (1 - t) + 255 * t);
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .png()
    .toBuffer();
}

const publicBrand = path.join(root, "public", "brand");
const appDir = path.join(root, "src", "app");
await mkdir(publicBrand, { recursive: true });

const mark80 = await sharp(transparent)
  .resize(80, 80, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .webp({ quality: 82, effort: 6 })
  .toBuffer();

const mark160 = await sharp(transparent)
  .resize(160, 160, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .webp({ quality: 82, effort: 6 })
  .toBuffer();

const darkMark = await lightenForDark(transparent);

await writeFile(path.join(publicBrand, "helphub-mark.webp"), mark80);
await writeFile(path.join(publicBrand, "favicon-light.png"), await squarePad(transparent, 32));
await writeFile(path.join(publicBrand, "favicon-dark.png"), await squarePad(darkMark, 32));
await writeFile(path.join(appDir, "icon.png"), await squarePad(transparent, 32));
await writeFile(path.join(appDir, "apple-icon.png"), await squarePad(transparent, 180));

const icoPng32 = await squarePad(darkMark, 32);
const icoPng16 = await sharp(darkMark)
  .resize(16, 16, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();

function pngToIco(pngBuffers, sizes) {
  const count = pngBuffers.length;
  const headerSize = 6 + 16 * count;
  const entries = [];
  let offset = headerSize;
  const parts = [Buffer.alloc(headerSize)];
  parts[0].writeUInt16LE(0, 0);
  parts[0].writeUInt16LE(1, 2);
  parts[0].writeUInt16LE(count, 4);
  for (let i = 0; i < count; i++) {
    const png = pngBuffers[i];
    const size = sizes[i];
    const entry = 6 + i * 16;
    parts[0].writeUInt8(size >= 256 ? 0 : size, entry);
    parts[0].writeUInt8(size >= 256 ? 0 : size, entry + 1);
    parts[0].writeUInt8(0, entry + 2);
    parts[0].writeUInt8(0, entry + 3);
    parts[0].writeUInt16LE(1, entry + 4);
    parts[0].writeUInt16LE(32, entry + 6);
    parts[0].writeUInt32LE(png.length, entry + 8);
    parts[0].writeUInt32LE(offset, entry + 12);
    parts.push(png);
    offset += png.length;
  }
  return Buffer.concat(parts);
}

await writeFile(path.join(appDir, "favicon.ico"), pngToIco([icoPng16, icoPng32], [16, 32]));

console.log("wrote", {
  mark80: mark80.length,
  mark160: mark160.length,
  icon: (await squarePad(transparent, 32)).length,
});
