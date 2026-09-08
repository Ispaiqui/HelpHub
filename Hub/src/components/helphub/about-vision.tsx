import { Target, TrendingUp } from "lucide-react";
import { AboutStep } from "./about-step";
import { cn } from "@/lib/utils";
import * as responsive from "@/lib/responsive";

export function AboutVision() {
  return (
    <section
      id="sobre"
      className={cn(
        "relative overflow-hidden border-y border-border/40 bg-muted/50 backdrop-blur-sm",
        responsive.sectionPy,
      )}
    >
      <div className={cn("relative z-10", responsive.container)}>
        <div className={cn(responsive.gridCols2, "gap-16 lg:gap-0 xl:gap-24 lg:divide-x lg:divide-border")}>

          <div className="lg:pr-16 flex flex-col justify-start">
            <div className="text-center flex flex-col items-center">
              <h2 className={cn(responsive.sectionHeading, "text-foreground")}>
                O que é a <span className="relative text-primary">HelpHub</span>?
              </h2>
              <p className="mt-12 text-lg leading-8 text-muted-foreground">
                A HelpHub é uma empresa focada em ajudar pequenos e médios negócios a
                <strong className="text-foreground font-semibold"> organizar, digitalizar e automatizar suas operações</strong>.
                A ideia não é simplesmente vender um site ou um sistema. É entender como o negócio funciona,
                identificar problemas e oferecer uma solução tecnológica adequada.
              </p>
            </div>

            <AboutStep />
          </div>

          <div className="lg:pl-16 flex flex-col justify-start">
            <div className="text-center flex flex-col items-center">
              <h2 className={cn(responsive.sectionHeading, "text-foreground")}>
                Nossa Visão
              </h2>
              <div className="mt-12 flex flex-col gap-8">
                <div className="relative flex flex-col items-center text-center rounded-2xl bg-card p-8 shadow-sm ring-1 ring-border hover:shadow-md transition-shadow">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-4 text-xl font-bold text-foreground">A Referência para o Pequeno Empresário</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Ser a empresa que o pequeno empresário procura quando precisa
                    <strong className="text-primary font-semibold"> melhorar a forma como seu negócio funciona através da tecnologia</strong>.
                  </p>
                </div>

                <div className="relative flex flex-col items-center text-center rounded-2xl bg-card p-8 shadow-sm ring-1 ring-border hover:shadow-md transition-shadow">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-4 text-xl font-bold text-foreground">Do Serviço ao Produto Próprio</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Queremos construir uma empresa que comece prestando serviços e, com o tempo,
                    desenvolva produtos próprios e gere receita recorrente, criando um ecossistema completo.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
