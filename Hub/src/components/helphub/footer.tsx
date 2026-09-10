import Link from "next/link";
import { MessageCircle, Mail, MapPin } from "lucide-react";

import * as responsive from "@/lib/responsive";

export function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 py-10 sm:py-16">
      <div className={responsive.container}>
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-3 lg:gap-8">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-3 sm:mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="font-bold text-white text-xl">H</span>
              </div>
              <span className="font-bold text-xl text-white tracking-[-0.06em]">HelpHub</span>
            </Link>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-sm">
              Ajudamos pequenos e médios negócios a organizar, digitalizar e automatizar suas operações. Você cuida do seu negócio, a HelpHub cuida da tecnologia.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-lg tracking-wide">
              Links Rápidos
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
              <li>
                <Link href="/#sobre" className="hover:text-primary transition-colors">
                  O que é
                </Link>
              </li>
              <li>
                <Link href="/#visao" className="hover:text-primary transition-colors">
                  Nossa Visão
                </Link>
              </li>
              <li>
                <Link href="/demonstracoes" className="hover:text-primary transition-colors">
                  Demonstrações
                </Link>
              </li>
              <li>
                <Link href="/#servicos" className="hover:text-primary transition-colors">
                  Serviços
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-lg tracking-wide">
              Contato
            </h3>
            <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base">
              <li>
                <a
                  href="https://wa.me/5511999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-primary transition-colors"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800">
                    <MessageCircle className="h-4 w-4 text-primary" />
                  </span>
                  <span className="min-w-0 leading-snug">
                    <span className="block text-slate-500 text-xs">WhatsApp</span>
                    (11) 99999-9999
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:contato@helphub.com.br"
                  className="flex items-center gap-2.5 hover:text-primary transition-colors"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800">
                    <Mail className="h-4 w-4 text-primary" />
                  </span>
                  <span className="min-w-0 break-all leading-snug">contato@helphub.com.br</span>
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

        <div className="mt-8 pt-6 sm:pt-8 border-t border-slate-800 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p className="text-xs sm:text-sm text-slate-500">
            &copy; {new Date().getFullYear()} HelpHub. Todos os direitos reservados.
          </p>
          <div className="flex gap-4 text-xs sm:text-sm text-slate-500">
            <Link href="#" className="hover:text-primary transition-colors">
              Termos de Uso
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
