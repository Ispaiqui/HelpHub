import { Target, X, Check } from "lucide-react";

export function Differential() {
  return (
    <section id="diferencial" className="bg-slate-900 text-white py-24 sm:py-32 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-50"></div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-sm">
              <Target className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-12">
            Nosso Diferencial
          </h2>

          <div className="space-y-6">
            {/* O que não somos */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center text-left">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex-1 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                <div className="flex items-center gap-3 mb-2 text-slate-400">
                  <X className="h-5 w-5 text-red-500" />
                  <span className="font-medium uppercase tracking-wider text-xs">Não queremos ser apenas</span>
                </div>
                <p className="text-xl font-medium text-slate-300">
                  "A empresa que faz site."
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex-1 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                <div className="flex items-center gap-3 mb-2 text-slate-400">
                  <X className="h-5 w-5 text-red-500" />
                  <span className="font-medium uppercase tracking-wider text-xs">Nem apenas</span>
                </div>
                <p className="text-xl font-medium text-slate-300">
                  "A empresa que vende ERP."
                </p>
              </div>
            </div>

            {/* O que somos */}
            <div className="bg-primary/20 border border-primary/30 rounded-3xl p-8 sm:p-12 text-center relative mt-8 transform transition-all hover:scale-[1.02] duration-300">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 bg-primary text-white text-sm font-bold uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg">
                Queremos ser
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white leading-relaxed mt-4">
                A empresa que entende o <span className="text-blue-300">problema do negócio</span> e encontra a <span className="text-blue-300">tecnologia certa</span> para resolvê-lo.
              </h3>
            </div>
          </div>

          <p className="mt-12 text-lg text-slate-400 max-w-2xl mx-auto">
            Isso permite que a HelpHub trabalhe com diferentes tecnologias, produtos e parceiros sem ficar presa a uma única solução. Nosso compromisso é com o seu resultado.
          </p>
        </div>
      </div>
    </section>
  );
}
