import type { Metadata } from "next";
import Link from "next/link";
import { AboutStep } from "@/components/helphub/sections/about/about-step";
import { AnimatedBackground } from "../../../animation-lab/chatgpt/animated-background";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "Lab de animação",
  robots: { index: false, follow: false },
};

export default function AnimacaoLabPage() {
  return (
    <div className="animation-lab min-h-full bg-background text-foreground">
      <header className="flex items-center justify-between gap-4 border-b border-border/40 px-4 py-3 sm:px-6">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Análise
          </p>
          <h1 className="text-lg font-bold">Proposta ChatGPT</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
            Voltar ao site
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <section className="relative min-h-[70vh] overflow-hidden border-b border-border/40">
        <AnimatedBackground />
        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center px-4 text-center">
          <p className="text-sm font-medium text-primary">Fundo do hero</p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] sm:text-5xl">
            Você cuida do seu negócio.{" "}
            <span className="text-primary">HelpHub</span> cuida da tecnologia.
          </h2>
        </div>
      </section>

      <section className="bg-muted py-24">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-sm font-medium text-primary">Etapas</p>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">O que é a HelpHub?</h2>
          <AboutStep />
        </div>
      </section>
    </div>
  );
}
