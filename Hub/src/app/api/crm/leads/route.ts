import { registerLead, type LeadInput } from "@helphub/crm";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function field(value: unknown) {
  return typeof value === "string" ? value : "";
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ errors: { body: "JSON inválido." } }, { status: 400 });
  }

  if (!isRecord(body)) {
    return Response.json({ errors: { body: "JSON inválido." } }, { status: 400 });
  }

  const input: LeadInput = {
    name: field(body.name),
    email: field(body.email),
    subject: field(body.subject),
    message: field(body.message),
  };
  const result = registerLead(input);

  if (!result.ok) {
    return Response.json({ errors: result.errors }, { status: 400 });
  }

  return Response.json({ lead: result.lead });
}
