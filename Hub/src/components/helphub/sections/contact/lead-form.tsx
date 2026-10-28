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

export function LeadForm({ defaultPackage, source, consentLabel, consentNote }: LeadFormProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [leadId, setLeadId] = useState("");
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
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [hold, setHold] = useState<number>();

  useEffect(() => {
    // Generated after mount so the server and client markup stay the same.
    /* eslint-disable react-hooks/set-state-in-effect */
    setLeadId(crypto.randomUUID());
    setStartedAt(Date.now());
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (status !== "success") return;
    headingRef.current?.focus();
  }, [status]);

  function input(): LeadInput {
    return {
      leadId: leadId || crypto.randomUUID(),
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

  function reset() {
    setLeadId(crypto.randomUUID());
    setStartedAt(Date.now());
    setName("");
    setEmail("");
    setPhone("");
    setSelected(initialPackage(defaultPackage));
    setMessage("");
    setConsent(false);
    setCompanySite("");
    setErrors({});
    setSummary(false);
    setStatus("idle");
    setHold(undefined);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    const payload = input();
    const result = registerLead(payload, ALLOWED);
    if (!result.ok) {
      setErrors(result.errors);
      setSummary(true);
      setStatus("idle");
      const first = FIELDS.find((field) => result.errors[field]);
      if (first) document.getElementById(first)?.focus();
      return;
    }

    setErrors({});
    setSummary(false);
    setStatus("submitting");
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 10_000);
    try {
      const response = await fetch("/api/crm/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          ...payload,
          leadId: result.lead.leadId,
          company_site: companySite,
          startedAt,
        }),
      });
      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        errors?: RegisterLeadErrors;
      } | null;
      if (response.ok && data?.ok) {
        setHold(frameRef.current?.offsetHeight);
        setStatus("success");
        onLeadSuccess(result.lead.leadId, result.lead.package);
        return;
      }
      if (response.status === 400 && data?.errors) {
        setErrors(data.errors);
        setSummary(true);
        setStatus("idle");
        const first = FIELDS.find((field) => data.errors?.[field]);
        if (first) document.getElementById(first)?.focus();
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    } finally {
      window.clearTimeout(timer);
    }
  }

  const packageLabel = interestOptions.find((option) => option.slug === selected)?.label ?? "";
  const fallback = whatsappHref(
    [`Nome: ${name}`, `Pacote: ${packageLabel}`, message].join("\n").slice(0, 500),
  );

  return (
    <div ref={frameRef} style={status === "success" && hold ? { minHeight: hold } : undefined}>
      {status === "success" ? (
        <div role="status" className="space-y-4 transition-opacity duration-150 motion-reduce:transition-none">
          <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-foreground outline-none">
            Recebemos sua mensagem.
          </h2>
          <p className="text-base text-muted-foreground">
            Respondemos em até 1 dia útil. Entraremos em contato.
          </p>
          <Button type="button" className="h-12 w-full text-base" onClick={reset}>
            Enviar outra mensagem
          </Button>
        </div>
      ) : (
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
          <input type="hidden" name="leadId" value={leadId} />
          <input type="hidden" name="startedAt" value={startedAt || ""} />
          {summary ? (
            <p role="alert" className="text-sm text-destructive">
              Revise os campos marcados.
            </p>
          ) : null}
          {status === "error" ? (
            <div role="alert" className="space-y-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4">
              <p className="text-sm text-foreground">
                Não conseguimos enviar agora. Seus dados continuam aqui.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={fallback}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants(), "h-12 w-full text-base sm:flex-1")}
                >
                  Enviar pelo WhatsApp
                </a>
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 w-full text-base sm:flex-1"
                  onClick={() => setStatus("idle")}
                >
                  Tentar de novo
                </Button>
              </div>
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
                CONTROL,
                "w-full rounded-lg border border-input outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive",
              )}
            >
              <option value="">Selecione</option>
              {interestOptions.map((option) => (
                <option key={option.slug} value={option.slug}>
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
            <p id="consent-error" className="min-h-5 text-sm text-destructive">
              {errors.consent ?? "\u00a0"}
            </p>
          </div>
          <Button
            type="submit"
            className="h-12 w-full text-base"
            disabled={status === "submitting"}
            aria-busy={status === "submitting"}
          >
            {status === "submitting" ? "Enviando…" : "Enviar mensagem"}
          </Button>
          <p className="text-sm leading-6 text-muted-foreground">{consentNote}</p>
        </form>
      )}
    </div>
  );
}
