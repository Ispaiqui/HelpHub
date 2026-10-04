import { TrendingUp } from "lucide-react";
import { AboutStep } from "./about-step";
import { SectionShell } from "@/components/helphub/layout";
import { VisionCard } from "./vision-card";
import { cn } from "@/lib/utils";
import * as responsive from "@/lib/responsive";

const successCases = [
  {
    name: "Magus Play",
    href: "https://buyhypestore.com/magus-play/",
    icon: "/cases/magus-play.jpg",
    crop: 1.24,
    glow: "radial-gradient(circle, #e0f7ff 0%, #38bdf8 42%, transparent 70%)",
  },
  {
    name: "Fiction City",
    href: "https://fiction-city-landing.vercel.app/",
    icon: "/cases/fiction-city.webp",
    crop: 1.1,
    glow: "radial-gradient(circle, #fae8ff 0%, #d946ef 42%, transparent 70%)",
  },
] as const;

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
            <div className="mt-12 flex w-full flex-col gap-8">
              <div className="relative flex flex-col items-center rounded-2xl bg-card p-8 text-center shadow-sm ring-1 ring-border">
                <h3 className="mb-6 text-xl font-bold text-foreground">Casos de sucesso</h3>
                <ul className="flex flex-wrap items-center justify-center gap-8">
                  {successCases.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col items-center gap-3 focus-visible:outline-none"
                      >
                        <span className="relative block h-24 w-24 sm:h-28 sm:w-28">
                          <span
                            aria-hidden
                            className="pointer-events-none absolute -inset-2 rounded-full blur-md"
                            style={{ background: item.glow }}
                          />
                          <span className="relative z-10 block h-full w-full overflow-hidden rounded-full transition-transform group-hover:scale-105 group-focus-visible:ring-2 group-focus-visible:ring-primary">
                            <img
                              src={item.icon}
                              alt=""
                              className="h-full w-full object-cover"
                              style={{ transform: `scale(${item.crop})` }}
                            />
                          </span>
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {item.name}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

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
