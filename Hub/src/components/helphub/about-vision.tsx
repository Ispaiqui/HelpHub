import { Target, TrendingUp } from "lucide-react";
import { AboutStep } from "./about-step";

export function AboutVision() {
  return (
    <section id="sobre" className="relative py-24 sm:py-32 overflow-hidden bg-muted">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-200/40 dark:bg-blue-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-200/40 dark:bg-indigo-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-gradient-to-tr from-blue-50/40 dark:from-blue-900/20 to-transparent blur-[120px]" />
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-0 lg:divide-x lg:divide-border">
          
          {/* Canto Esquerdo: About */}
          <div className="lg:pr-16 flex flex-col justify-start">
            <div className="text-center flex flex-col items-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
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

          {/* Canto Direito: Vision */}
          <div className="lg:pl-16 flex flex-col justify-start">
            <div className="text-center flex flex-col items-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
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
