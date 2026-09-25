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
import { FadeUp, ProofCard } from "@/components/demonstracoes/motion";
import { WhatsAppLink } from "@/components/demonstracoes/whatsapp";
import {
  demoWhatsappMessages,
  proofPoints,
} from "@/lib/demonstracoes/content";

export const metadata: Metadata = {
  title: "Empresa — Pacote Avançado",
  description:
    "Demo do pacote Avançado: arco de conversão da Empresa — dor, solução, prova, oferta, FAQ e WhatsApp. Microinterações com framer-motion.",
};

export default function AvancadoPage() {
  return (
    <div className="hh-lp min-h-full bg-white">
      <DemoBadge packageName="Avançado" />
      <LpHeader density="avancado" tagline="Atendimento local · mesmo dia*" />

      <div>
        <LpSection
          density="avancado"
          bleed
          padded={false}
          className="bg-ink text-paper"
          innerClassName="py-20 sm:py-28"
        >
          <FadeUp immediate>
            <p className="label text-gray-400">O problema</p>
            <h1 className="mt-6 max-w-3xl text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl sm:leading-[1.05] lg:text-[3.5rem]">
              Prazo apertado, retorno que não chega — e a última equipe só
              apareceu no terceiro dia.
            </h1>
            <p className="mt-8 max-w-xl text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
              Você precisa de alguém que confirme horário hoje, chegue no
              combinado e saia com o serviço no papel.
            </p>
          </FadeUp>
        </LpSection>

        <LpSection density="avancado" bleed className="border-b border-line">
          <FadeUp>
            <p className="label text-gray-500">A solução</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-medium tracking-tight sm:text-4xl sm:leading-tight">
              Empresa agenda no WhatsApp, chega com equipe preparada e deixa
              o serviço por escrito.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-gray-600 sm:leading-8">
              Atendimento para casa e comércio. Você descreve o que precisa.
              A gente confirma a janela. Extra só com o seu ok.
            </p>
            <WhatsAppLink className="mt-10" size="lg" message={demoWhatsappMessages.avancadoSolucao}>
              WhatsApp
            </WhatsAppLink>
          </FadeUp>
        </LpSection>

        <LpSection density="avancado" bleed className="bg-paper">
          <FadeUp>
            <p className="label text-gray-500">Prova</p>
            <h2 className="mt-4 text-2xl font-medium tracking-tight sm:text-3xl">
              Quem já foi atendido.
            </h2>
          </FadeUp>

          <FadeUp delay={0.08}>
            <TestimonialBlock variant="inline" className="mt-10 border border-line bg-white px-6 py-8 sm:px-10 sm:py-10" />
          </FadeUp>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {proofPoints.map((point, index) => (
              <ProofCard
                key={point.title}
                delay={index * 0.08}
                className="p-6 sm:p-8"
              >
                <p className="font-mono text-xs text-gray-400">
                  0{index + 1}
                </p>
                <h3 className="mt-4 font-medium leading-6 tracking-tight">
                  {point.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {point.body}
                </p>
              </ProofCard>
            ))}
          </div>
        </LpSection>

        <LpSection density="avancado" bleed className="border-y border-line bg-white">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:items-start lg:gap-16">
            <FadeUp>
              <p className="label text-gray-500">Área de atendimento</p>
              <h2 className="mt-4 text-2xl font-medium tracking-tight sm:text-3xl">
                Região por região.
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-7 text-gray-600">
                Não atendemos “a cidade inteira”. A equipe sai de base perto
                e chega na janela combinada.
              </p>
            </FadeUp>
            <NeighborhoodList
              renderItem={(name, index) => (
                <FadeUp delay={index * 0.04}>{name}</FadeUp>
              )}
            />
          </div>
        </LpSection>

        <LpSection density="avancado" bleed className="border-b border-line">
          <FadeUp>
            <p className="label text-gray-500">A oferta</p>
            <h2 className="mt-4 max-w-xl text-2xl font-medium tracking-tight sm:text-3xl">
              Visita, serviço principal ou extra.
            </h2>
          </FadeUp>
          <OfferList
            variant="open"
            wrapRow={(inner, item, index, rowClassName) => (
              <FadeUp key={item.title} delay={index * 0.06} className={rowClassName}>
                {inner}
              </FadeUp>
            )}
          />
          <p className="mt-5 text-xs leading-5 text-gray-500">
            Valor da visita combinado no WhatsApp. Sem tabela genérica no site
            — o que você precisa muda o trabalho.
          </p>
        </LpSection>

        <LpSection density="avancado">
          <FadeUp>
            <h2 className="mb-8 text-2xl font-medium tracking-tight sm:text-3xl">
              Antes de chamar
            </h2>
            <FaqList />
          </FadeUp>
        </LpSection>
      </div>

      <LpFooter density="avancado" />
      <StickyWhatsApp variant="float" message={demoWhatsappMessages.avancadoSticky} />
    </div>
  );
}
