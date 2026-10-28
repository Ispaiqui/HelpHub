export type LeadInput = {
  leadId: string;
  name: string;
  email: string;
  phone: string;
  package: string;
  message: string;
  consent: boolean;
  sourcePage: string;
};

export type LeadPackage = "plus" | "avancado" | "premium" | "indefinido";

export type Lead = {
  leadId: string;
  name: string;
  email: string;
  phone: string;
  package: LeadPackage;
  message: string;
  consent: true;
  sourcePage: string;
  receivedAt: string;
};

export type RegisterLeadErrors = Partial<Record<keyof LeadInput, string>>;

export type RegisterLeadResult =
  | { ok: true; lead: Lead }
  | { ok: false; errors: RegisterLeadErrors };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SOURCE = /^[a-z0-9/_-]{1,80}$/;
const LEAD_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function text(value: string) {
  return value.trim();
}

function receivedAt(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    fractionalSecondDigits: 3,
  }).formatToParts(now);
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "00";
  const hour = pick("hour") === "24" ? "00" : pick("hour");
  return `${pick("year")}-${pick("month")}-${pick("day")}T${hour}:${pick("minute")}:${pick("second")}.${pick("fractionalSecond")}-03:00`;
}

export function registerLead(
  input: LeadInput,
  allowedPackages: readonly string[],
): RegisterLeadResult {
  const leadId = text(input.leadId).toLowerCase();
  const name = text(input.name);
  const email = text(input.email).toLowerCase();
  const phone = input.phone.replace(/\D/g, "");
  const selected = text(input.package);
  const message = text(input.message);
  const sourcePage = SOURCE.test(text(input.sourcePage))
    ? text(input.sourcePage)
    : "desconhecido";
  const errors: RegisterLeadErrors = {};

  if (!LEAD_ID.test(leadId)) errors.leadId = "Identificador inválido.";
  if (name.length < 2) errors.name = "Informe o nome.";
  else if (name.length > 120) errors.name = "O nome pode ter no máximo 120 caracteres.";
  if (!email) errors.email = "Informe o e-mail.";
  else if (email.length > 254 || !EMAIL.test(email)) errors.email = "E-mail inválido.";
  if (phone.length < 10 || phone.length > 13) {
    errors.phone = "Informe um WhatsApp válido com DDD.";
  }
  if (!selected) errors.package = "Selecione um pacote.";
  else if (!allowedPackages.includes(selected)) errors.package = "Pacote inválido.";
  if (message.length < 10) errors.message = "A mensagem precisa ter pelo menos 10 caracteres.";
  else if (message.length > 2000) {
    errors.message = "A mensagem pode ter no máximo 2000 caracteres.";
  }
  if (input.consent !== true) {
    errors.consent = "É preciso concordar com o uso dos dados para responder ao contato.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    lead: {
      leadId,
      name,
      email,
      phone,
      package: selected as LeadPackage,
      message,
      consent: true,
      sourcePage,
      receivedAt: receivedAt(),
    },
  };
}
