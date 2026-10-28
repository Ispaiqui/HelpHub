import "server-only";
import { logSink } from "./sinks/log";
import { noopSink } from "./sinks/noop";
import { sheetsSink } from "./sinks/sheets";
import type { LeadSink } from "./types";

const SHEETS_VARS = [
  "GOOGLE_SHEETS_SPREADSHEET_ID",
  "GOOGLE_SHEETS_RANGE",
  "GOOGLE_SERVICE_ACCOUNT_EMAIL",
  "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY",
] as const;

export class SinkConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SinkConfigError";
  }
}

export function getLeadSink(): LeadSink {
  const vercelEnv = process.env.VERCEL_ENV;
  const selected =
    process.env.LEAD_SINK ??
    (vercelEnv === "production" || vercelEnv === "preview" ? "sheets" : "log");

  if ((selected === "log" || selected === "noop") && vercelEnv === "production") {
    throw new SinkConfigError("log and noop sinks are refused in production");
  }

  if (selected === "log") return logSink;
  if (selected === "noop") return noopSink;
  if (selected !== "sheets") throw new SinkConfigError("unknown lead sink");

  const missing = SHEETS_VARS.filter((name) => !process.env[name]?.trim());
  if (missing.length > 0) {
    throw new SinkConfigError(`missing ${missing.join(", ")}`);
  }
  return sheetsSink;
}
