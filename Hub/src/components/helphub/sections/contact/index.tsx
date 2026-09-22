import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/helphub/layout";
import { Field } from "./field";
import { cn } from "@/lib/utils";
import * as responsive from "@/lib/responsive";

export function Contact() {
  return (
    <SectionShell
      padded={false}
      className="flex min-h-full flex-col items-center justify-center overflow-x-clip bg-background py-6 md:py-12 lg:py-24"
      innerClassName="relative z-10"
      backdrop={
        <>
          <div className="pointer-events-none absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-hh-blue-500/10 blur-3xl" />
        </>
      }
    >
      <div className="mx-auto w-full max-w-md space-y-8 rounded-2xl border border-border bg-card p-8 md:max-w-2xl md:space-y-10 md:rounded-3xl md:p-12 lg:max-w-4xl lg:p-16 xl:max-w-5xl 2xl:max-w-6xl">
        <div className="text-center">
          <h1 className={cn(responsive.heroTitle, "text-foreground")}>
            Fale Conosco
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:mt-4 md:text-base lg:text-lg">
            Preencha o formulário abaixo para entrar em contato com a equipe HelpHub. Retornaremos o mais breve possível.
          </p>
        </div>

        <form className="mt-8 space-y-6 md:mt-12 md:space-y-8">
          <div className={cn(responsive.gridCols2, "gap-6 md:gap-8")}>
            <Field id="name" label="Nome completo">
              <Input id="name" placeholder="João da Silva" type="text" className="h-12 bg-background/50 px-4 md:text-base" required />
            </Field>
            <Field id="email" label="E-mail">
              <Input id="email" placeholder="joao@exemplo.com" type="email" className="h-12 bg-background/50 px-4 md:text-base" required />
            </Field>
          </div>
          <Field id="subject" label="Assunto">
            <Input id="subject" placeholder="Como podemos ajudar?" type="text" className="h-12 bg-background/50 px-4 md:text-base" required />
          </Field>
          <Field id="message" label="Mensagem">
            <Textarea
              id="message"
              className="bg-background/50 md:text-base"
              placeholder="Descreva sua solicitação com o máximo de detalhes possível..."
              required
            />
          </Field>
          <Button type="submit" className="h-12 w-full text-base font-semibold md:h-14 md:text-lg" size="lg">
            Enviar Mensagem
          </Button>
        </form>
      </div>
    </SectionShell>
  );
}
