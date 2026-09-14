import type { Metadata } from "next";
import { ContactForm } from "@/components/demonstracoes/contact-form";
import { DemoBadge } from "@/components/demonstracoes/demo-badge";
import { FaqList } from "@/components/demonstracoes/faq-list";
import { FadeUp, ProofCard } from "@/components/demonstracoes/motion/avancado-motion";
import { StickyWhatsApp } from "@/components/demonstracoes/sticky-whatsapp";
import { WhatsAppLink } from "@/components/demonstracoes/whatsapp-link";
import {
  demoWhatsappMessages,
  neighborhoods,
  offerItems,
  proofPoints,
  testimonial,
  whatsappNumber,
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

      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-5xl items-baseline justify-between px-5 py-5 sm:px-8">
          <p className="text-lg font-medium tracking-tight">Empresa</p>
          <p className="text-xs leading-5 text-gray-500">
            Atendimento local · mesmo dia*
          </p>
        </div>
      </header>

      <div>
        <section className="bg-ink text-paper">
          <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-28">
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
          </div>
        </section>

        <section className="border-b border-line">
          <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-24">
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
          </div>
        </section>

        <section className="bg-paper">
          <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-24">
            <FadeUp>
              <p className="label text-gray-500">Prova</p>
              <h2 className="mt-4 text-2xl font-medium tracking-tight sm:text-3xl">
                Quem já foi atendido.
              </h2>
            </FadeUp>

            <FadeUp
              delay={0.08}
              className="mt-10 border border-line bg-white px-6 py-8 sm:px-10 sm:py-10"
            >
              <blockquote className="text-xl leading-8 tracking-tight sm:text-2xl sm:leading-9">
                “{testimonial.quote}”
              </blockquote>
              <p className="mt-6 text-sm leading-6 text-gray-500">
                {testimonial.name}, {testimonial.role} · {testimonial.place}
              </p>
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
          </div>
        </section>

        <section className="border-y border-line bg-white">
          <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-24">
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
              <ul className="grid grid-cols-2 gap-x-8 border-t border-line pt-8 text-sm sm:grid-cols-3">
                {neighborhoods.map((name, index) => (
                  <li key={name} className="border-b border-line py-3 text-gray-700">
                    <FadeUp delay={index * 0.04}>{name}</FadeUp>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="border-b border-line">
          <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-24">
            <FadeUp>
              <p className="label text-gray-500">A oferta</p>
              <h2 className="mt-4 max-w-xl text-2xl font-medium tracking-tight sm:text-3xl">
                Visita, serviço principal ou extra.
              </h2>
            </FadeUp>
            <div className="mt-12 divide-y divide-line border border-line">
              {offerItems.map((item, index) => (
                <FadeUp
                  key={item.title}
                  delay={index * 0.06}
                  className="grid gap-3 px-6 py-8 sm:grid-cols-[16rem_1fr] sm:gap-8 sm:px-8"
                >
                  <h3 className="text-lg font-medium tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-7 text-gray-600">{item.body}</p>
                </FadeUp>
              ))}
            </div>
            <p className="mt-5 text-xs leading-5 text-gray-500">
              Valor da visita combinado no WhatsApp. Sem tabela genérica no site
              — o que você precisa muda o trabalho.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-24">
          <FadeUp>
            <h2 className="mb-8 text-2xl font-medium tracking-tight sm:text-3xl">
              Antes de chamar
            </h2>
            <FaqList />
          </FadeUp>
        </section>

        <section id="contato" className="bg-ink pb-28 text-paper sm:pb-24">
          <div className="mx-auto grid max-w-5xl gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-2 lg:items-start lg:gap-16">
            <FadeUp>
              <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
                Manda a região e o que você precisa.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-gray-300 sm:text-base">
                Respondemos no WhatsApp com horário. O formulário desta demo só
                valida na tela.
              </p>
              <WhatsAppLink variant="invert" className="mt-10" size="lg" message={demoWhatsappMessages.avancadoContato}>
                WhatsApp
              </WhatsAppLink>
            </FadeUp>
            <FadeUp delay={0.08} className="bg-paper p-6 text-ink sm:p-8">
              <ContactForm submitLabel="Enviar" />
            </FadeUp>
          </div>
        </section>
      </div>

      <footer className="border-t border-line px-5 py-10 text-center text-xs leading-5 text-gray-500 sm:px-8">
        Empresa · demo HelpHub Avançado · wa.me/{whatsappNumber}
      </footer>
      <StickyWhatsApp variant="float" message={demoWhatsappMessages.avancadoSticky} />
    </div>
  );
}
