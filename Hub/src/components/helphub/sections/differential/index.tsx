import { Target, X } from "lucide-react";

import { SectionShell } from "@/components/helphub/layout";
import { cn } from "@/lib/utils";
import * as responsive from "@/lib/responsive";

export function Differential() {
  return (
    <SectionShell
      id="diferencial"
      className="overflow-x-clip overflow-y-hidden bg-slate-900 text-white dark:bg-slate-950"
      innerClassName="relative z-10"
      backdrop={
        <>
          <div className="absolute top-0 left-1/2 h-px w-full max-w-5xl -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 opacity-50 blur-[120px]" />
        </>
      }
    >
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm">
            <Target className="h-8 w-8 text-primary" />
          </div>
        </div>

        <h2 className={cn(responsive.sectionHeading, "mb-12 text-white")}>
          Nosso Diferencial
        </h2>

        <div className="space-y-6">
          <div className={cn("justify-center gap-6 text-left", responsive.stackToRowLg)}>
            <div className="relative flex-1 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="absolute top-0 left-0 h-full w-1 bg-red-500" />
              <div className="mb-2 flex items-center gap-3 text-slate-400">
                <X className="h-5 w-5 text-red-500" />
                <span className="text-xs font-medium tracking-wider uppercase">Não queremos ser apenas</span>
              </div>
              <p className="text-xl font-medium text-slate-200">
                &quot;A empresa que faz site.&quot;
              </p>
            </div>

            <div className="relative flex-1 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="absolute top-0 left-0 h-full w-1 bg-red-500" />
              <div className="mb-2 flex items-center gap-3 text-slate-400">
                <X className="h-5 w-5 text-red-500" />
                <span className="text-xs font-medium tracking-wider uppercase">Nem apenas</span>
              </div>
              <p className="text-xl font-medium text-slate-200">
                &quot;A empresa que vende ERP.&quot;
              </p>
            </div>
          </div>

          <div className="relative mt-8 rounded-3xl border border-primary/30 bg-primary/20 p-8 text-center sm:p-12">
            <div className="absolute top-0 left-1/2 -mt-4 -translate-x-1/2 rounded-full bg-primary px-4 py-1.5 text-sm font-bold tracking-widest text-white uppercase shadow-lg">
              Queremos ser
            </div>
            <h3 className="mt-4 text-2xl leading-relaxed font-bold text-white sm:text-3xl">
              A empresa que entende o <span className="text-hh-blue-300">problema do negócio</span> e encontra a <span className="text-hh-blue-300">tecnologia certa</span> para resolvê-lo.
            </h3>
          </div>
        </div>

        <p className="mx-auto mt-12 max-w-2xl text-lg text-slate-400">
          Isso permite que a HelpHub trabalhe com diferentes tecnologias, produtos e parceiros sem ficar presa a uma única solução. Nosso compromisso é com o seu resultado.
        </p>
      </div>
    </SectionShell>
  );
}
