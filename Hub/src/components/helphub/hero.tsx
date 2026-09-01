import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, ChevronRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-32">
      {/* Background gradients */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/10 to-transparent" />
      <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-400/10 blur-3xl" />
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex justify-center">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
              Transforme seu pequeno e médio negócio
              <ChevronRight className="ml-1 h-4 w-4" />
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Você cuida do seu negócio. <br className="hidden md:block" />
            <span className="">
               <span className="relative inline-block">
                <span className="absolute inset-0 bg-primary/20 blur-md rounded-full"></span>
                <span className="relative text-primary">HelpHub</span>
              </span> cuida da tecnologia.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Ajudamos pequenos e médios negócios a organizar, digitalizar e automatizar suas operações. 
            Nossa missão é simplificar a tecnologia para que você não precise de conhecimento técnico para crescer.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="#servicos" className={buttonVariants({ variant: "default", size: "lg", className: "rounded-full px-8" })}>
              Conhecer nossos serviços
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="#contato" className={buttonVariants({ variant: "outline", size: "lg", className: "rounded-full px-8 shadow-md" })}>
              Falar com um especialista
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
