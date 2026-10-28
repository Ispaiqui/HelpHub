import "server-only";

export type LeadRecord = {
  leadId: string;
  receivedAt: string;
  name: string;
  email: string;
  phone: string;
  package: "plus" | "avancado" | "premium" | "indefinido";
  message: string;
  sourcePage: string;
  consentVersion: string;
};

export interface LeadSink {
  readonly name: "sheets" | "log" | "noop";
  write(lead: LeadRecord, opts: { signal: AbortSignal }): Promise<void>;
}
