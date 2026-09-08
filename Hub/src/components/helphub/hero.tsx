import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import * as responsive from "@/lib/responsive";

export function Hero() {
  return (
    <section className="relative pt-20 pb-28 sm:pt-24 sm:pb-32">
      <div className={cn("relative z-10 text-center", responsive.container)}>
        <div className="mx-auto max-w-4xl">
          <h1 className={cn(responsive.heroTitle, "text-foreground")}>
            Você cuida do seu negócio. <br className="hidden md:block" />
            <span>
              <span className="relative inline-block">
                <span className="absolute inset-0 bg-primary/20 blur-md rounded-full"></span>
                <span className="relative text-primary">HelpHub</span>
              </span>{" "}
              cuida da tecnologia.
            </span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg xl:leading-9">
            Ajudamos pequenos e médios negócios a organizar, digitalizar e automatizar suas operações.
            Nossa missão é simplificar a tecnologia para que você não precise de conhecimento técnico para crescer.
          </p>
          <div className={cn("mt-12 items-center justify-center gap-4", responsive.stackToRowSm)}>
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
            <Link
              href="#contato"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "w-full sm:w-auto rounded-full px-8 shadow-md",
              })}
            >
              Falar com um especialista
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
