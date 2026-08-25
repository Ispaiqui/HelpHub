import Link from "next/link";
import { MessageCircle, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
          {/* Brand & Info */}
          <div className="md:col-span-1">
            <Link href="/helphub" className="flex items-center space-x-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="font-bold text-white text-xl">H</span>
              </div>
              <span className="font-bold text-2xl text-white tracking-tight">HelpHub</span>
            </Link>
            <p className="text-slate-400 mt-4 leading-relaxed max-w-sm">
              Ajudamos pequenos e médios negócios a organizar, digitalizar e automatizar suas operações. Você cuida do seu negócio, a HelpHub cuida da tecnologia.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-1">
            <h3 className="text-white font-semibold mb-4 text-lg">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/helphub#sobre" className="hover:text-primary transition-colors">
                  O que é
                </Link>
              </li>
              <li>
                <Link href="/helphub#visao" className="hover:text-primary transition-colors">
                  Nossa Visão
                </Link>
              </li>
              <li>
                <Link href="/helphub#servicos" className="hover:text-primary transition-colors">
                  Serviços
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-1">
            <h3 className="text-white font-semibold mb-4 text-lg">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <a
                  href="https://wa.me/5511999999999" // Substitua pelo seu número
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp: (11) 99999-9999
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <a href="mailto:contato@helphub.com.br" className="hover:text-white transition-colors">
                  contato@helphub.com.br
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <span>Atendimento 100% Online</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} HelpHub. Todos os direitos reservados.
          </p>
          <div className="flex gap-4 text-sm text-slate-500">
            <Link href="#" className="hover:text-white transition-colors">
              Termos de Uso
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
