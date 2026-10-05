import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as responsive from "@/lib/responsive";
import { whatsappHref, whatsappMessages } from "@/lib/whatsapp";
import { HeroScrub } from "./hero-scrub";

export function Hero() {
  return (
    <HeroScrub
      endSlot={
        <>
          <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-[color:var(--lab-ink,#f8fafc)] sm:text-4xl xl:text-5xl">
            Você cuida do seu negócio. <br className="hidden md:block" />
            <span className="relative inline-block">
              <span className="absolute inset-0 rounded-full bg-primary/20 blur-md" />
              <span className="relative text-primary">HelpHub</span>
            </span>{" "}
            cuida da tecnologia.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[color:color-mix(in_srgb,var(--lab-ink,#f8fafc)_78%,transparent)] sm:mt-6 sm:text-base sm:leading-8">
            Ajudamos pequenos e médios negócios a organizar, digitalizar e automatizar suas operações.
            Nossa missão é simplificar a tecnologia para que você não precise de conhecimento técnico para crescer.
          </p>
          <div className={cn("mt-6 items-center justify-center gap-4 sm:mt-8", responsive.stackToRowSm)}>
            <Link
              href="#servicos"
              className={buttonVariants({
                variant: "default",
                size: "lg",
                className: "w-full sm:w-auto rounded-full px-8",
              })}
            >
              Conhecer nossos serviços
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <a
              href={whatsappHref(whatsappMessages.heroEspecialista)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className:
                  "w-full border-white/35 bg-white/10 text-[color:var(--lab-ink,#f8fafc)] shadow-md hover:bg-white/20 hover:text-[color:var(--lab-ink,#f8fafc)] sm:w-auto rounded-full px-8",
              })}
            >
              Falar com um especialista
            </a>
          </div>
        </>
      }
    />
  );
}
