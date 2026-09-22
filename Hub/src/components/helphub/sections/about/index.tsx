import { Target, TrendingUp } from "lucide-react";
import { AboutStep } from "./about-step";
import { SectionShell } from "@/components/helphub/layout";
import { VisionCard } from "./vision-card";
import { cn } from "@/lib/utils";
import * as responsive from "@/lib/responsive";

export function AboutVision() {
  return (
    <SectionShell
      id="sobre"
      className="overflow-x-clip border-y border-border/40 bg-muted"
      innerClassName="relative z-10"
    >
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

        <div id="visao" className="lg:pl-16 flex flex-col justify-start">
          <div className="text-center flex flex-col items-center">
            <h2 className={cn(responsive.sectionHeading, "text-foreground")}>
              Nossa Visão
            </h2>
            <div className="mt-12 flex flex-col gap-8">
              <VisionCard icon={Target} title="A Referência para o Pequeno Empresário">
                Ser a empresa que o pequeno empresário procura quando precisa
                <strong className="font-semibold text-primary"> melhorar a forma como seu negócio funciona através da tecnologia</strong>.
              </VisionCard>
              <VisionCard icon={TrendingUp} title="Do Serviço ao Produto Próprio">
                Queremos construir uma empresa que comece prestando serviços e, com o tempo,
                desenvolva produtos próprios e gere receita recorrente, criando um ecossistema completo.
              </VisionCard>
            </div>
          </div>
        </div>

      </div>
    </SectionShell>
  );
}
