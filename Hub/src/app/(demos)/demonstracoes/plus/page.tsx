import type { Metadata } from "next";
import {
  DemoBadge,
  LpFooter,
  LpHeader,
  StickyWhatsApp,
} from "@/components/demonstracoes/chrome";
import { LpSection } from "@/components/demonstracoes/layout";
import {
  FaqList,
  NeighborhoodList,
  OfferList,
  TestimonialBlock,
} from "@/components/demonstracoes/sections";
import { WhatsAppLink } from "@/components/demonstracoes/whatsapp";
import {
  demoWhatsappMessages,
  steps,
} from "@/lib/demonstracoes/content";

export const metadata: Metadata = {
  title: "Empresa — Pacote Plus",
  description:
    "Demo do pacote Plus: Empresa com passo a passo, regiões, oferta, depoimento, FAQ e WhatsApp. Confiança local, ainda só com transições CSS.",
};

export default function PlusPage() {
  return (
    <div className="hh-lp min-h-full bg-paper pb-20 sm:pb-0">
      <DemoBadge packageName="Plus" />
      <LpHeader density="plus" tagline="Atendimento local · mesmo dia*" />

      <div>
        <LpSection
          density="plus"
          bleed
          className="border-b border-line bg-white"
          innerClassName="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-16"
        >
          <div className="hh-in">
            <p className="label text-gray-500">Região Norte e arredores</p>
            <h1 className="mt-5 text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl sm:leading-[1.05] lg:text-[3.25rem]">
              Serviço local, sem espera e sem enrolação.
            </h1>
            <p className="mt-4 text-xs leading-5 text-gray-500">
              *Mesmo dia sujeito a vaga na agenda do dia.
            </p>
          </div>
          <div className="hh-in hh-in-d2">
            <p className="text-base leading-7 text-gray-600 sm:leading-8">
              Atendimento para casa, escritório e comércio. Equipe preparada,
              horário combinado, garantia por escrito. Pessoa física e empresa
              falam com o mesmo time.
            </p>
            <WhatsAppLink className="mt-8" size="lg" message={demoWhatsappMessages.plusHero}>
              WhatsApp
            </WhatsAppLink>
          </div>
        </LpSection>

        <LpSection density="plus">
          <p className="label hh-in text-gray-500">Como funciona</p>
          <h2 className="hh-in hh-in-d1 mt-4 max-w-xl text-2xl font-medium tracking-tight sm:text-3xl">
            Três passos. Nada de formulário eterno.
          </h2>
          <ol className="mt-12 grid gap-0 border border-line bg-white md:grid-cols-3">
            {steps.map((step, index) => (
              <li
                key={step.n}
                className={`hh-in p-7 transition-colors duration-200 hover:bg-gray-50 sm:p-8${index > 0 ? ` hh-in-d${index}` : ""} ${
                  index < steps.length - 1 ? "md:border-r md:border-line" : ""
                } ${index > 0 ? "border-t border-line md:border-t-0" : ""}`}
              >
                <p className="font-mono text-xs text-gray-400">{step.n}</p>
                <h3 className="mt-5 text-xl font-medium tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </LpSection>

        <LpSection density="plus" bleed className="border-y border-line bg-white">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:items-start lg:gap-16">
            <div className="hh-in">
              <p className="label text-gray-500">Área de atendimento</p>
              <h2 className="mt-4 text-2xl font-medium tracking-tight sm:text-3xl">
                Região por região, no mapa de quem mora aqui.
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-7 text-gray-600">
                Não atendemos “a cidade inteira”. Atendemos a faixa combinada
                — a equipe sai de base perto e chega sem cruzar a cidade no
                horário de pico.
              </p>
            </div>
            <NeighborhoodList
              itemClassName={(_name, index) =>
                `hh-in${index % 3 > 0 ? ` hh-in-d${index % 3}` : ""}`
              }
            />
          </div>
        </LpSection>

        <LpSection density="plus">
          <p className="label hh-in text-gray-500">A oferta</p>
          <h2 className="hh-in hh-in-d1 mt-4 max-w-xl text-2xl font-medium tracking-tight sm:text-3xl">
            Visita, serviço principal ou extra.
          </h2>
          <OfferList
            rowClassName={(_item, index) =>
              `hh-in${index > 0 ? ` hh-in-d${index}` : ""}`
            }
          />
        </LpSection>

        <LpSection density="plus">
          <div className="grid gap-6">
            <TestimonialBlock variant="split" className="hh-in" />
            <TestimonialBlock variant="compact" className="hh-in hh-in-d2" />
          </div>
        </LpSection>

        <LpSection density="plus" padded={false} className="pb-4">
          <div className="hh-in">
            <h2 className="mb-8 text-2xl font-medium tracking-tight sm:text-3xl">
              Antes de agendar
            </h2>
            <FaqList className="bg-white px-1" />
          </div>
        </LpSection>
      </div>

      <LpFooter density="plus" />
      <StickyWhatsApp variant="bar" message={demoWhatsappMessages.plusSticky} />
    </div>
  );
}
