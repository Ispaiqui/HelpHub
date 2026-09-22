import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const srcRoot = path.join(cwd, "src");
const exts = [".ts", ".tsx", ".js", ".jsx"];

function resolveImport(spec) {
  if (!spec.startsWith("@/")) return spec;
  const rel = spec.slice(2);
  const base = path.join(srcRoot, rel);

  const candidates = [
    base,
    ...exts.map((ext) => base + ext),
    ...exts.map((ext) => path.join(base, "index" + ext)),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }

  return null;
}

const importRe = /from ["'](@\/[^"']+)["']/g;
const errors = [];

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const filePath = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walk(filePath);
      continue;
    }

    if (!/\.(ts|tsx)$/.test(ent.name)) continue;

    const text = fs.readFileSync(filePath, "utf8");
    for (const match of text.matchAll(importRe)) {
      const resolved = resolveImport(match[1]);
      if (!resolved) {
        errors.push({
          file: path.relative(cwd, filePath),
          import: match[1],
        });
      }
    }
  }
}

walk(srcRoot);

if (errors.length) {
  console.error("BROKEN IMPORTS:");
  for (const error of errors) {
    console.error(`${error.file} -> ${error.import}`);
  }
  process.exit(1);
}

console.log("All @/ imports resolve.");
