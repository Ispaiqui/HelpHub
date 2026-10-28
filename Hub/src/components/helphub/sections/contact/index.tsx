import { SectionShell } from "@/components/helphub/layout";
import { CONSENT_LABEL, CONSENT_NOTE } from "@/lib/leads/consent";
import { cn } from "@/lib/utils";
import * as responsive from "@/lib/responsive";
import { LeadForm } from "./lead-form";

type ContactProps = {
  defaultPackage?: string;
  source?: string;
};

export function Contact({ defaultPackage, source }: ContactProps) {
  return (
    <SectionShell
      padded={false}
      className="flex min-h-full flex-col items-center justify-start overflow-x-clip bg-background py-6 sm:py-12 lg:py-24"
      innerClassName="relative z-10"
      backdrop={
        <>
          <div className="pointer-events-none absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-hh-blue-500/10 blur-3xl" />
        </>
      }
    >
      <div className="mx-auto w-full max-w-2xl space-y-8 rounded-2xl border border-border bg-card p-6 text-card-foreground sm:p-8">
        <div className="text-center">
          <h1 className={cn(responsive.heroTitle, "text-foreground")}>
            Fale Conosco
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:mt-4 sm:text-base">
            Preencha o formulário abaixo para entrar em contato com a equipe HelpHub. Retornaremos o mais breve possível.
          </p>
        </div>
        <LeadForm
          defaultPackage={defaultPackage}
          source={source}
          consentLabel={CONSENT_LABEL}
          consentNote={CONSENT_NOTE}
        />
      </div>
    </SectionShell>
  );
}
