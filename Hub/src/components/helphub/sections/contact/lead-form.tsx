"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { registerLead, type LeadInput, type RegisterLeadErrors } from "@helphub/crm";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { interestOptions, type InterestSlug } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { whatsappHref } from "@/lib/whatsapp";
import { Field } from "./field";

const ALLOWED = interestOptions.map((option) => option.slug);
const FIELDS = ["name", "email", "phone", "package", "message", "consent"] as const;
const CONTROL =
  "h-12 bg-background/50 px-4 text-base md:text-base";

type LeadFormProps = {
  defaultPackage?: string;
  source?: string;
  consentLabel: string;
  consentNote: string;
};

function onLeadSuccess(leadId: string, packageSlug: string) {
  void leadId;
  void packageSlug;
}

function initialPackage(value: string | undefined): InterestSlug | "" {
  return ALLOWED.includes(value as InterestSlug) ? (value as InterestSlug) : "";
}

function sourcePage(origem: string | undefined) {
  const query = origem?.trim();
  if (query) return query;
  try {
    if (document.referrer) {
      const url = new URL(document.referrer);
      if (url.origin === window.location.origin) return url.pathname;
    }
  } catch {
    /* keep the fallback */
  }
  return "/formularios";
}

function waMessage(fields: { nome: string; pacote: string; mensagem: string; pagina: string }) {
  const lines = ["Gostaria de saber mais sobre um site.", ""];
  for (const [label, value] of [
    ["Nome", fields.nome],
    ["Pacote de interesse", fields.pacote],
    ["Mensagem", fields.mensagem],
    ["Página de origem", fields.pagina],
  ] as const) {
    const text = value.trim();
    if (text) lines.push(`*${label}:* ${text}`);
  }
  return lines.join("\n");
}

export function LeadForm({ defaultPackage, source, consentLabel, consentNote }: LeadFormProps) {
  const [startedAt, setStartedAt] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selected, setSelected] = useState<InterestSlug | "">(() => initialPackage(defaultPackage));
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [companySite, setCompanySite] = useState("");
  const [errors, setErrors] = useState<RegisterLeadErrors>({});
  const [summary, setSummary] = useState(false);
  const [wa, setWa] = useState<{ href: string; blocked: boolean } | null>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const sent = useRef(false);

  useEffect(() => {
    // Stamp after mount so server and client markup stay the same.
    /* eslint-disable react-hooks/set-state-in-effect */
    setStartedAt(Date.now());
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  function input(): LeadInput {
    return {
      leadId: crypto.randomUUID(),
      name,
      email,
      phone,
      package: selected,
      message,
      consent,
      sourcePage: sourcePage(source),
    };
  }

  function touch(field: keyof LeadInput) {
    const result = registerLead(input(), ALLOWED);
    setErrors((current) => ({
      ...current,
      [field]: result.ok ? undefined : result.errors[field],
    }));
  }

  useEffect(() => {
    if (wa) statusRef.current?.focus();
  }, [wa]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sent.current) return;
    const payload = input();
    const result = registerLead(payload, ALLOWED);
    if (!result.ok) {
      setWa(null);
      setErrors(result.errors);
      setSummary(true);
      const first = FIELDS.find((field) => result.errors[field]);
      if (first) document.getElementById(first)?.focus();
      return;
    }

    const elapsed = startedAt > 0 ? Date.now() - startedAt : 0;
    if (companySite.trim() || elapsed < 3000) return;

    sent.current = true;
    setErrors({});
    setSummary(false);
    const href = whatsappHref(
      waMessage({
        nome: result.lead.name,
        pacote: interestOptions.find((option) => option.slug === result.lead.package)?.label ?? "",
        mensagem: result.lead.message,
        pagina: result.lead.sourcePage,
      }),
    );
    onLeadSuccess(result.lead.leadId, result.lead.package);
    const popup = window.open(href, "_blank");
    if (popup) popup.opener = null;
    setWa({ href, blocked: popup === null });
  }

  return (
    <div>
        <form className="relative space-y-2" onSubmit={onSubmit} noValidate>
          <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
            <label htmlFor="company_site">Site</label>
            <input
              id="company_site"
              name="company_site"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={companySite}
              onChange={(event) => setCompanySite(event.target.value)}
            />
          </div>
          <input type="hidden" name="startedAt" value={startedAt || ""} />
          {summary ? (
            <p role="alert" className="text-sm text-destructive dark:text-red-400">
              Revise os campos marcados.
            </p>
          ) : null}
          {wa ? (
            <div ref={statusRef} tabIndex={-1} role={wa.blocked ? "alert" : "status"} className="space-y-3 outline-none">
              <p className="text-sm text-foreground">
                {wa.blocked
                  ? "O navegador bloqueou o WhatsApp. Use o botão abaixo."
                  : "Abrindo o WhatsApp… Se não abrir, use o botão abaixo."}
              </p>
              <a
                href={wa.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants(), "h-12 w-full text-base")}
              >
                Abrir conversa no WhatsApp
              </a>
            </div>
          ) : null}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Field id="name" label="Nome" error={errors.name}>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                onBlur={() => touch("name")}
                className={CONTROL}
              />
            </Field>
            <Field id="email" label="E-mail" error={errors.email}>
              <Input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onBlur={() => touch("email")}
                className={CONTROL}
              />
            </Field>
          </div>
          <Field id="phone" label="WhatsApp" error={errors.phone}>
            <Input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              onBlur={() => touch("phone")}
              className={CONTROL}
            />
          </Field>
          <Field id="package" label="Pacote de interesse" error={errors.package}>
            <select
              id="package"
              name="package"
              value={selected}
              onChange={(event) => setSelected(event.target.value as InterestSlug | "")}
              onBlur={() => touch("package")}
              className={cn(
                "h-12 w-full rounded-lg border border-input bg-background px-4 text-base text-foreground scheme-light dark:scheme-dark",
                "outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive",
              )}
            >
              <option value="" className="bg-background text-foreground">
                Selecione
              </option>
              {interestOptions.map((option) => (
                <option key={option.slug} value={option.slug} className="bg-background text-foreground">
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <Field id="message" label="Mensagem" error={errors.message}>
            <Textarea
              id="message"
              name="message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onBlur={() => touch("message")}
              className="bg-background/50 text-base md:text-base"
            />
          </Field>
          <div className="space-y-3 pt-2">
            <label htmlFor="consent" className="flex min-h-11 items-start gap-3 text-sm leading-6 text-foreground">
              <input
                id="consent"
                name="consent"
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                onBlur={() => touch("consent")}
                aria-invalid={errors.consent ? true : undefined}
                aria-describedby="consent-error"
                className="mt-1 size-6 shrink-0 accent-primary"
              />
              <span>{consentLabel}</span>
            </label>
            <p id="consent-error" className="min-h-5 text-sm text-destructive dark:text-red-400">
              {errors.consent ?? "\u00a0"}
            </p>
          </div>
          <Button type="submit" className="h-12 w-full text-base">
            Enviar mensagem
          </Button>
          <p className="text-sm leading-6 text-muted-foreground">{consentNote}</p>
        </form>
    </div>
  );
}
