import "server-only";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_SUBMISSIONS = 5;

const ipHits = new Map<string, number[]>();
const leadHits = new Map<string, number>();

function fresh(stamps: number[], now: number) {
  return stamps.filter((at) => now - at < WINDOW_MS);
}

export function clientIp(request: Request) {
  const first = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return first || "unknown";
}

export function inspectRateLimit(ip: string, leadId: string, now = Date.now()) {
  const seen = leadHits.get(leadId);
  if (seen !== undefined && now - seen < WINDOW_MS) return "duplicate" as const;
  const hits = fresh(ipHits.get(ip) ?? [], now);
  ipHits.set(ip, hits);
  if (hits.length >= MAX_SUBMISSIONS) return "limited" as const;
  return "ok" as const;
}

export function commitRateLimit(ip: string, leadId: string, now = Date.now()) {
  const hits = fresh(ipHits.get(ip) ?? [], now);
  hits.push(now);
  ipHits.set(ip, hits);
  leadHits.set(leadId, now);
  return now;
}

export function releaseRateLimit(ip: string, leadId: string, at: number) {
  leadHits.delete(leadId);
  const hits = ipHits.get(ip);
  if (!hits) return;
  const index = hits.lastIndexOf(at);
  if (index >= 0) hits.splice(index, 1);
}
