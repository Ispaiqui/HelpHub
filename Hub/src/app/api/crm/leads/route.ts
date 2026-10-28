import { registerLead, type LeadInput } from "@helphub/crm";
import { interestOptions } from "@/lib/pricing";
import { CONSENT_VERSION } from "@/lib/leads/consent";
import { getLeadSink } from "@/lib/leads";
import {
  clientIp,
  commitRateLimit,
  inspectRateLimit,
  releaseRateLimit,
} from "@/lib/leads/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY = 10 * 1024;
const WRITE_TIMEOUT_MS = 8_000;
const MIN_FILL_MS = 3_000;
const PACKAGES = interestOptions.map((option) => option.slug);

function json(body: unknown, status = 200) {
  return Response.json(body, { status });
}

function logOutcome(leadId: string, sink: string, outcome: string, started: number) {
  console.info(JSON.stringify({ leadId, sink, outcome, latencyMs: Date.now() - started }));
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

export async function POST(request: Request) {
  const started = Date.now();
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return json({ ok: false, errors: { body: "Content-Type deve ser JSON." } }, 400);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY) {
    return json({ ok: false, errors: { body: "Corpo muito grande." } }, 400);
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, errors: { body: "JSON inválido." } }, 400);
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return json({ ok: false, errors: { body: "JSON inválido." } }, 400);
  }

  const record = body as Record<string, unknown>;
  const leadId = asString(record.leadId).trim().toLowerCase();

  if (asString(record.company_site).trim()) {
    logOutcome(leadId, "none", "honeypot", started);
    return json({ ok: true, leadId });
  }

  if (typeof record.startedAt !== "number" || !Number.isFinite(record.startedAt)) {
    return json({ ok: false, errors: { startedAt: "Envio inválido." } }, 400);
  }
  if (Date.now() - record.startedAt < MIN_FILL_MS) {
    logOutcome(leadId, "none", "time_trap", started);
    return json({ ok: true, leadId });
  }

  const input: LeadInput = {
    leadId,
    name: asString(record.name),
    email: asString(record.email),
    phone: asString(record.phone),
    package: asString(record.package),
    message: asString(record.message),
    consent: record.consent === true,
    sourcePage: asString(record.sourcePage),
  };

  const ip = clientIp(request);
  const rate = inspectRateLimit(ip, input.leadId);
  if (rate === "duplicate") {
    logOutcome(input.leadId, "none", "duplicate", started);
    return json({ ok: true, leadId: input.leadId });
  }
  if (rate === "limited") {
    logOutcome(input.leadId, "none", "rate_limited", started);
    return json({ ok: false, code: "rate_limited" }, 429);
  }

  const result = registerLead(input, PACKAGES);
  if (!result.ok) return json({ ok: false, errors: result.errors }, 400);

  let sink;
  try {
    sink = getLeadSink();
  } catch {
    logOutcome(result.lead.leadId, "unconfigured", "sink_unavailable", started);
    return json({ ok: false, code: "sink_unavailable" }, 503);
  }

  const committedAt = commitRateLimit(ip, result.lead.leadId);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), WRITE_TIMEOUT_MS);
  try {
    await sink.write(
      { ...result.lead, consentVersion: CONSENT_VERSION },
      { signal: controller.signal },
    );
  } catch {
    releaseRateLimit(ip, result.lead.leadId, committedAt);
    logOutcome(result.lead.leadId, sink.name, "sink_unavailable", started);
    return json({ ok: false, code: "sink_unavailable" }, 503);
  } finally {
    clearTimeout(timer);
  }

  logOutcome(result.lead.leadId, sink.name, "written", started);
  return json({ ok: true, leadId: result.lead.leadId });
}
