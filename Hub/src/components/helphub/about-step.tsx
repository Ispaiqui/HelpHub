"use client";

import { useEffect, useState } from "react";
import { Search, Lightbulb, Code, Headphones, AlertTriangle, LucideIcon } from "lucide-react";

export interface StepItem {
  name: string;
  description: string;
  icon: LucideIcon;
}

const steps: StepItem[] = [
  { name: "Problema", description: "1. Entendemos a sua dor", icon: AlertTriangle },
  { name: "Análise", description: "2. Mapeamos o cenário", icon: Search },
  { name: "Solução", description: "3. Propomos a tecnologia", icon: Lightbulb },
  { name: "Implementação", description: "4. Colocamos em prática", icon: Code },
  { name: "Suporte", description: "5. Acompanhamos você", icon: Headphones },
];

const getStepClasses = (i: number, activeIndex: number, phase: string, stepsCount: number) => {
  const nextIndex = (activeIndex + 1) % stepsCount;
  const prevIndex = (activeIndex - 1 + stepsCount) % stepsCount;
  const nextNextIndex = (activeIndex + 2) % stepsCount;

  // Far Right (escondido aguardando)
  let posClass = "translate-x-[220px] sm:translate-x-[300px] md:translate-x-[400px] opacity-0 scale-75";
  let transitionClass = "transition-all duration-500 ease-in-out";
  let isCharged = false;

  if (i === activeIndex) {
    if (phase === 'sliding') {
      // Sai para a esquerda
      posClass = "-translate-x-[140px] sm:-translate-x-[200px] md:-translate-x-[260px] opacity-50 scale-90";
      isCharged = false;
    } else if (phase === 'charged') {
      // Começa a perder o foco antes de mover
      posClass = "translate-x-0 opacity-50 scale-90 z-10";
      isCharged = false;
    } else {
      // Centro (ativo)
      posClass = "translate-x-0 opacity-100 scale-100 z-10";
      isCharged = true;
    }
  } else if (i === nextIndex) {
    if (phase === 'sliding') {
      // Vem para o centro
      posClass = "translate-x-0 opacity-100 scale-100 z-10";
      isCharged = true;
    } else if (phase === 'charged') {
      // Recebe a carga de energia AINDA na direita (preenche na hora)
      posClass = "translate-x-[140px] sm:translate-x-[200px] md:translate-x-[260px] opacity-100 scale-100 z-10";
      isCharged = true;
    } else {
      // Fica visível na direita aguardando a energia
      posClass = "translate-x-[140px] sm:translate-x-[200px] md:translate-x-[260px] opacity-50 scale-90";
      isCharged = false;
    }
  } else if (i === prevIndex) {
    if (phase === 'sliding' || phase === 'charged') {
      // Estava na esquerda, agora sai da tela totalmente (Far Left)
      posClass = "-translate-x-[220px] sm:-translate-x-[300px] md:-translate-x-[400px] opacity-0 scale-75 pointer-events-none";
      isCharged = false;
    } else {
      // Fica visível na esquerda
      posClass = "-translate-x-[140px] sm:-translate-x-[200px] md:-translate-x-[260px] opacity-50 scale-90";
      isCharged = false;
    }
  } else if (i === nextNextIndex) {
    if (phase === 'sliding') {
      // Estava escondido na direita, agora entra pra direita
      posClass = "translate-x-[140px] sm:translate-x-[200px] md:translate-x-[260px] opacity-50 scale-90";
      isCharged = false;
    } else {
      // Escondido na direita sem transição para não animar a volta
      transitionClass = "transition-none";
      posClass = "translate-x-[220px] sm:translate-x-[300px] md:translate-x-[400px] opacity-0 scale-75 pointer-events-none";
      isCharged = false;
    }
  } else {
    // Outros itens que não estão próximos ficam escondidos na direita
    transitionClass = "transition-none";
    posClass = "translate-x-[220px] sm:translate-x-[300px] md:translate-x-[400px] opacity-0 scale-75 pointer-events-none";
    isCharged = false;
  }

  return { posClass, transitionClass, isCharged };
};

export function AboutStep() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'energy' | 'charged' | 'sliding'>('idle');

  useEffect(() => {
    let timeout1: NodeJS.Timeout;
    let timeout2: NodeJS.Timeout;
    let timeout3: NodeJS.Timeout;
    
    // Total cycle: 4 seconds
    const interval = setInterval(() => {
      // 1. Dispara a energia saindo do item central
      setPhase('energy');
      
      // 2. A energia atinge o alvo na direita exatamente aos 800ms (ele se preenche)
      timeout1 = setTimeout(() => {
        setPhase('charged');
      }, 800);
      
      // 3. Aos 1200ms (após ser preenchido), o ícone azul é puxado para o centro
      timeout2 = setTimeout(() => {
        setPhase('sliding');
      }, 1200);
      
      // 4. Aos 1900ms (após o slide terminar), atualiza o índice oficial e volta ao repouso
      timeout3 = setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % steps.length);
        setPhase('idle');
      }, 1900);
      
    }, 4000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, []);

  return (
    <div className="mt-10 select-none">
      <div className="relative h-72 w-full flex items-center justify-center overflow-hidden rounded-3xl">
        
        {/* Linha contínua no fundo conectando os itens */}
        <div className="absolute top-[100px] left-0 right-0 h-[2px] bg-slate-200 -translate-y-1/2" />

        {/* Trilha por onde a energia passa (do centro para a direita) */}
        <div className="absolute top-[100px] left-1/2 h-[2px] w-[140px] sm:w-[200px] md:w-[260px] -translate-y-1/2">
          {phase === 'energy' && (
            <div className="absolute top-1/2 -translate-y-1/2 h-[4px] w-[60px] bg-gradient-to-r from-transparent via-blue-500 to-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.8)] rounded-full animate-[energy-travel_800ms_ease-in-out_forwards]" />
          )}
        </div>

        {/* Passos / Cards */}
        {steps.map((step, i) => {
          const { posClass, transitionClass, isCharged } = getStepClasses(i, activeIndex, phase, steps.length);
          const Icon = step.icon;

          return (
            <div
              key={step.name}
              className={`absolute inset-0 flex flex-col items-center pt-[60px] ${transitionClass} ${posClass}`}
            >
              <div 
                className={`
                  relative flex items-center justify-center rounded-full transition-all duration-200 shadow-lg 
                  ${isCharged 
                    ? "h-20 w-20 bg-blue-500 ring-4 ring-blue-200 shadow-blue-300" 
                    : "h-14 w-14 bg-white ring-1 ring-slate-200 mt-3"}
                `}
              >
                {/* Efeito Glow atrás do ícone ativo */}
                {isCharged && (
                  <div className="absolute inset-0 rounded-full bg-blue-500/40 blur-xl scale-[1.5] animate-pulse pointer-events-none" />
                )}
                
                {/* Fundo gradiente interno premium pro ícone carregado */}
                {isCharged && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400" />
                )}
                
                <Icon 
                  className={`relative z-10 transition-all duration-200 ${isCharged ? "h-8 w-8 text-white" : "h-6 w-6 text-slate-400"}`} 
                />
              </div>

              <h3 className={`mt-5 font-bold transition-all duration-200 ${isCharged ? "text-lg text-slate-900" : "text-sm text-slate-500"}`}>
                {step.name}
              </h3>
              <p className={`mt-2 text-center transition-all duration-200 ${isCharged ? "text-sm text-slate-600 max-w-[180px]" : "text-xs text-slate-400 max-w-[140px]"}`}>
                {step.description}
              </p>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes energy-travel {
          0% { left: 0%; opacity: 0; transform: translateX(0); }
          10% { opacity: 1; }
          95% { opacity: 1; }
          100% { left: 100%; opacity: 0; transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
