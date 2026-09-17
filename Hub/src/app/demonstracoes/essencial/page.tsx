import type { Metadata } from "next";
import { DemoBadge } from "@/components/demonstracoes/demo-badge";
import { FaqList } from "@/components/demonstracoes/faq-list";
import { StickyWhatsApp } from "@/components/demonstracoes/sticky-whatsapp";
import { WhatsAppLink } from "@/components/demonstracoes/whatsapp-link";
import { benefits, demoWhatsappMessages, faqsEssencial, testimonial } from "@/lib/demonstracoes/content";

export const metadata: Metadata = {
  title: "Empresa — Pacote Essencial",
  description:
    "Demo do pacote Essencial: página direta da Empresa. Hero, benefícios, depoimento, FAQ e WhatsApp.",
};

export default function EssencialPage() {
  return (
    <div className="hh-lp min-h-full bg-paper pb-20 sm:pb-0">
      <DemoBadge packageName="Essencial" />

      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-2xl items-baseline justify-between px-5 py-5 sm:px-8">
          <p className="text-lg font-medium tracking-tight">Empresa</p>
          <p className="text-xs leading-5 text-gray-500">
            Atendimento · mesmo dia*
          </p>
        </div>
      </header>

      <div>
        <section className="bg-white">
          <div className="mx-auto max-w-2xl px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20">
            <p className="label hh-in text-gray-500">
              Empresa · atendimento local
            </p>
            <h1 className="hh-in hh-in-d1 mt-6 text-4xl font-medium leading-[1.08] tracking-tight sm:text-[2.75rem] sm:leading-[1.1]">
              Precisa do serviço? A gente atende hoje.
            </h1>
            <p className="hh-in hh-in-d2 mt-6 max-w-xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              Horário combinado no WhatsApp, equipe preparada, garantia por
              escrito. Sem enrolação.
            </p>
            <WhatsAppLink className="hh-in hh-in-d3 mt-10" size="lg" message={demoWhatsappMessages.essencialHero}>
              WhatsApp
            </WhatsAppLink>
            <p className="hh-in hh-in-d4 mt-5 text-xs leading-5 text-gray-500">
              *Mesmo dia sujeito a vaga na agenda do dia.
            </p>
          </div>
        </section>

        <section className="border-y border-line">
          <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-20">
            <h2 className="hh-in text-2xl font-medium tracking-tight sm:text-[1.75rem]">
              O que você contrata
            </h2>
            <ul className="mt-10 divide-y divide-line border-y border-line">
              {benefits.map((item, index) => (
                <li
                  key={item.n}
                  className={`hh-in grid grid-cols-[3.5rem_1fr] gap-4 py-8${index > 0 ? ` hh-in-d${index}` : ""}`}
                >
                  <span className="pt-1 font-mono text-xs text-gray-400">
                    {item.n}
                  </span>
                  <div>
                    <p className="text-lg font-medium tracking-tight">
                      {item.title}
                    </p>
                    <p className="mt-2.5 text-sm leading-7 text-gray-600">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <WhatsAppLink className="hh-in hh-in-d3 mt-10" size="lg" message={demoWhatsappMessages.essencialBeneficios}>
              WhatsApp
            </WhatsAppLink>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-20">
            <blockquote className="hh-in border-l-2 border-ink pl-6 sm:pl-8">
              <p className="text-xl leading-8 tracking-tight sm:text-2xl sm:leading-9">
                “{testimonial.quote}”
              </p>
              <footer className="mt-6 text-sm leading-6 text-gray-500">
                {testimonial.name}, {testimonial.role} · {testimonial.place}
              </footer>
            </blockquote>
          </div>
        </section>

        <section className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="hh-in">
            <h2 className="mb-8 text-2xl font-medium tracking-tight sm:text-[1.75rem]">
              Perguntas frequentes
            </h2>
            <FaqList items={faqsEssencial} />
          </div>
        </section>
      </div>

      <footer className="border-t border-line px-5 py-10 text-center text-xs leading-5 text-gray-500 sm:px-8">
        Empresa · demo HelpHub Essencial
      </footer>
      <StickyWhatsApp variant="bar" message={demoWhatsappMessages.essencialSticky} />
    </div>
  );
}
