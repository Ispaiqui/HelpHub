import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/demonstracoes/contact-form";
import { DemoBadge } from "@/components/demonstracoes/demo-badge";
import { FaqList } from "@/components/demonstracoes/faq-list";
import {
  FloatCta,
  ParallaxFrame,
  Reveal,
  RuleGrow,
  Stagger,
  StaggerItem,
} from "@/components/demonstracoes/motion/premium-motion";
import { StickyWhatsApp } from "@/components/demonstracoes/sticky-whatsapp";
import { WhatsAppLink } from "@/components/demonstracoes/whatsapp-link";
import {
  faqsPremium,
  offerItems,
  proofPoints,
  testimonial,
} from "@/lib/demonstracoes/content";

export const metadata: Metadata = {
  title: "Empresa — Pacote Premium",
  description:
    "Demo do pacote Premium: Empresa em arco editorial — tipografia expressiva, assimetria, prova, oferta e CTAs em cascata.",
};

export default function PremiumPage() {
  return (
    <div className="hh-lp min-h-full bg-paper">
      <DemoBadge packageName="Premium" />

      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-6xl items-baseline justify-between px-5 py-6 sm:px-8">
          <p className="font-serif text-2xl tracking-tight">Empresa</p>
          <p className="label text-gray-500">Atendimento local</p>
        </div>
      </header>

      <div>
        <section className="mx-auto max-w-6xl px-5 pb-10 pt-14 sm:px-8 sm:pb-12 sm:pt-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-16">
            <Reveal immediate className="lg:col-span-8">
              <p className="label text-gray-500">Uma terça qualquer</p>
              <h1 className="mt-6 font-serif text-[3rem] leading-[0.92] tracking-tight sm:text-7xl lg:text-[5.75rem]">
                O prazo apertou.
                <br />A gente chega.
              </h1>
            </Reveal>
            <Reveal immediate delay={0.1} className="lg:col-span-4 lg:pb-3">
              <p className="max-w-sm text-base leading-8 text-gray-600">
                Atendimento para quem administra o dia — casa, escritório, ponto
                comercial. Sem hype. Horário no WhatsApp. Garantia no papel.
              </p>
            </Reveal>
          </div>
          <RuleGrow className="mt-14" />
        </section>

        <section className="mx-auto grid max-w-6xl gap-12 px-5 pb-20 sm:px-8 sm:pb-28 lg:grid-cols-12 lg:gap-16">
          <Reveal immediate className="overflow-hidden lg:col-span-7">
            <ParallaxFrame>
              <Image
                src="/fig-facade.svg"
                alt="Fachada esquemática de um prédio, com janelas alinhadas em andares."
                width={640}
                height={800}
                priority
                unoptimized
                className="h-auto w-full border border-line"
              />
            </ParallaxFrame>
          </Reveal>
          <div className="flex flex-col justify-between gap-12 lg:col-span-5">
            <Reveal delay={0.1}>
              <p className="font-serif text-2xl leading-snug tracking-tight sm:text-[2rem] sm:leading-[1.2]">
                No meio da reunião, o que precisava estar pronto não estava.
                Duas horas depois, a equipe já tinha ido embora — e o combinado
                estava no papel.
              </p>
              <p className="mt-6 text-sm leading-7 text-gray-600">
                Esse é o padrão que a Empresa se propõe a repetir: alguém no
                WhatsApp, uma janela de chegada, equipe preparada, e o que foi
                feito escrito. Casa e comércio, da Região Norte ao Centro.
              </p>
            </Reveal>
            <FloatCta className="border border-ink bg-ink p-8 text-paper sm:p-9">
              <p className="label text-gray-400">Primeiro chamado</p>
              <p className="mt-4 font-serif text-2xl leading-tight sm:text-[1.75rem]">
                Manda a região e o que você precisa.
              </p>
              <WhatsAppLink variant="invert" className="mt-7 w-full" size="lg">
                WhatsApp
              </WhatsAppLink>
              <a
                href="#contato"
                className="mt-4 inline-flex h-11 w-full items-center justify-center text-sm text-gray-300 underline-offset-4 hover:text-paper hover:underline"
              >
                Contato
              </a>
            </FloatCta>
          </div>
        </section>

        <section className="bg-ink text-paper">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <p className="label text-gray-400">A dor, sem metáfora</p>
              <h2 className="mt-5 max-w-3xl font-serif text-4xl leading-[1.12] sm:text-5xl lg:text-[3.5rem]">
                Prazo estourando. Loja fechando mais cedo. Grupo pedindo
                “previsão”.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-xl text-sm leading-7 text-gray-300 sm:text-base sm:leading-8">
                A equipe que “passa aí essa semana” não serve. O que serve é
                alguém que confirma hoje, chega na janela combinada e não some
                quando o trabalho pede um extra.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <p className="label text-gray-500">A solução</p>
              <h2 className="mt-5 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
                Uma empresa da região, para a região.
              </h2>
              <p className="mt-6 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
                Não prometemos a cidade inteira. A equipe sai de base perto.
                Diagnóstico e serviço — extra só depois do seu sim.
              </p>
            </Reveal>
            <Stagger className="grid gap-px bg-line lg:col-span-7">
              {proofPoints.map((point) => (
                <StaggerItem
                  key={point.title}
                  className="bg-paper px-6 py-8 sm:px-9 sm:py-10"
                >
                  <h3 className="font-serif text-2xl leading-snug sm:text-[1.75rem]">
                    {point.title}
                  </h3>
                  <p className="mt-4 max-w-md text-sm leading-7 text-gray-600">
                    {point.body}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        <section className="border-y border-line bg-white">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal className="lg:max-w-4xl">
              <p className="font-serif text-[2.15rem] leading-[1.18] sm:text-5xl sm:leading-[1.15]">
                “{testimonial.quote}”
              </p>
              <p className="mt-10 label text-gray-500">
                {testimonial.name} · {testimonial.role} · {testimonial.place}
              </p>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-4">
              <Image
                src="/fig-north.svg"
                alt="Mapa esquemático das regiões de atendimento, com norte marcado."
                width={640}
                height={480}
                unoptimized
                className="h-auto w-full border border-line"
              />
            </Reveal>
            <div className="lg:col-span-8">
              <Reveal>
                <p className="label text-gray-500">A oferta</p>
                <h2 className="mt-5 font-serif text-4xl tracking-tight sm:text-5xl">
                  O que você pede. O que a gente faz.
                </h2>
              </Reveal>
              <div className="mt-12">
                {offerItems.map((item, index) => (
                  <Reveal
                    key={item.title}
                    delay={index * 0.08}
                    className="grid gap-4 border-t border-ink py-8 last:border-b sm:grid-cols-[14rem_1fr] sm:gap-10"
                  >
                    <h3 className="font-serif text-2xl leading-snug sm:text-[1.75rem]">
                      {item.title}
                    </h3>
                    <p className="self-center text-sm leading-7 text-gray-600">
                      {item.body}
                    </p>
                  </Reveal>
                ))}
              </div>
              <p className="mt-6 text-xs leading-5 text-gray-500">
                Valor da visita no WhatsApp. O que você precisa e o horário
                mudam o trabalho — por isso não há tabela genérica nesta página.
              </p>
              <WhatsAppLink className="mt-10" size="lg">
                WhatsApp
              </WhatsAppLink>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <Reveal>
            <h2 className="mb-8 font-serif text-3xl tracking-tight sm:text-4xl">
              Perguntas que costumam aparecer
            </h2>
            <FaqList className="bg-white px-2" items={faqsPremium} />
          </Reveal>
        </section>

        <section
          id="contato"
          className="mx-auto max-w-6xl px-5 py-20 pb-28 sm:px-8 sm:py-28 sm:pb-28"
        >
          <div className="grid gap-14 border-t border-ink pt-14 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <p className="label text-gray-500">Último chamado</p>
              <h2 className="mt-5 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
                Escreva para a empresa.
              </h2>
              <p className="mt-6 max-w-md text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
                Nome, telefone e o que está acontecendo. Esta demo só valida e
                confirma na tela.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-7">
              <ContactForm
                tone="editorial"
                submitLabel="Enviar"
              />
            </Reveal>
          </div>
        </section>
      </div>

      <footer className="border-t border-ink bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-14 sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:py-16">
          <div>
            <p className="font-serif text-4xl leading-none">Empresa</p>
            <p className="mt-4 text-sm leading-6 text-gray-400">
              Demo HelpHub Premium · wa.me/5511999999999
            </p>
          </div>
          <WhatsAppLink variant="invert" size="lg">
            WhatsApp
          </WhatsAppLink>
        </div>
      </footer>
      <StickyWhatsApp variant="float" />
    </div>
  );
}
