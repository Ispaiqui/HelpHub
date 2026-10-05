export type LeadInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type Lead = LeadInput & {
  id: string;
};

export type RegisterLeadErrors = Partial<Record<keyof LeadInput, string>>;

export type RegisterLeadResult =
  | { ok: true; lead: Lead }
  | { ok: false; errors: RegisterLeadErrors };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value: string) {
  return value.trim();
}

export function registerLead(input: LeadInput): RegisterLeadResult {
  const name = text(input.name);
  const email = text(input.email).toLowerCase();
  const subject = text(input.subject);
  const message = text(input.message);
  const errors: RegisterLeadErrors = {};

  if (!name) errors.name = "Informe o nome.";
  if (!email) errors.email = "Informe o e-mail.";
  else if (!EMAIL.test(email)) errors.email = "E-mail inválido.";
  if (!subject) errors.subject = "Informe o assunto.";
  if (!message) errors.message = "Informe a mensagem.";

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    lead: {
      id: globalThis.crypto.randomUUID(),
      name,
      email,
      subject,
      message,
    },
  };
}
