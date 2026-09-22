import Link from "next/link";
import { MessageCircle, Mail, MapPin } from "lucide-react";

import { BrandLockup } from "@/components/helphub/brand";
import * as responsive from "@/lib/responsive";
import { footerLinks } from "@/lib/helphub/nav";
import { WHATSAPP_DISPLAY, whatsappHref, whatsappMessages } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="bg-slate-900 py-10 text-slate-300 sm:py-16 dark:bg-slate-950">
      <div className={responsive.container}>
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-3 lg:gap-8">
          <div className="col-span-2 lg:col-span-1">
            <BrandLockup
              className="mb-3 sm:mb-4"
              markClassName="h-8 w-8"
              wordmarkClassName="text-white"
            />
            <p className="max-w-sm text-sm leading-relaxed text-slate-400 sm:text-base">
              Ajudamos pequenos e médios negócios a organizar, digitalizar e automatizar suas operações. Você cuida do seu negócio, a HelpHub cuida da tecnologia.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold tracking-wide text-white sm:mb-4 sm:text-lg">
              Links Rápidos
            </h3>
            <ul className="space-y-2 text-sm sm:space-y-3 sm:text-base">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-primary">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold tracking-wide text-white sm:mb-4 sm:text-lg">
              Contato
            </h3>
            <ul className="space-y-3 text-sm sm:space-y-4 sm:text-base">
              <li>
                <a
                  href={whatsappHref(whatsappMessages.footer)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 transition-colors hover:text-primary"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800">
                    <MessageCircle className="h-4 w-4 text-primary" />
                  </span>
                  <span className="min-w-0 leading-snug">
                    <span className="block text-xs text-slate-500">WhatsApp</span>
                    {WHATSAPP_DISPLAY}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:contato@helphub.com.br"
                  className="flex items-center gap-2.5 transition-colors hover:text-primary"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800">
                    <Mail className="h-4 w-4 text-primary" />
                  </span>
                  <span className="min-w-0 leading-snug break-all">contato@helphub.com.br</span>
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800">
                  <MapPin className="h-4 w-4 text-primary" />
                </span>
                <span className="leading-snug">Atendimento 100% Online</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 sm:pt-8">
          <p className="text-xs text-slate-500 sm:text-sm">
            &copy; {new Date().getFullYear()} HelpHub. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
