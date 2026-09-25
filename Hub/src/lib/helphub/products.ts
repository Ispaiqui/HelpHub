import type { LucideIcon } from "lucide-react";
import { Globe, Store, Smartphone, MessageCircle, Search } from "lucide-react";
import { whatsappMessages } from "@/lib/whatsapp";

export type Product = {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  description: string;
  features: string[];
  cta: string;
  whatsappMessage: string;
};

export const products: Product[] = [
  {
    id: "landing-pages",
    title: "Landing Pages",
    subtitle: "Converta visitantes em clientes",
    icon: Globe,
    color: "from-hh-blue-500 to-hh-blue-700",
    description:
      "Uma landing page focada em conversão é a porta de entrada do seu negócio no digital. Criamos páginas rápidas, bonitas e otimizadas para transformar visitantes em clientes reais.",
    features: [
      "Design moderno e responsivo",
      "Formulário de captura de leads",
      "Integração com WhatsApp",
      "SEO básico incluso",
      "Entrega em até 5 dias",
    ],
    cta: "Quero minha Landing Page",
    whatsappMessage: whatsappMessages.landingPages,
  },
  {
    id: "sites-institucionais",
    title: "Sites Institucionais",
    subtitle: "Sua empresa com presença profissional",
    icon: Store,
    color: "from-hh-blue-400 to-hh-blue-800",
    description:
      "Um site institucional transmite credibilidade e permite que clientes conheçam sua empresa, seus serviços e entre em contato facilmente. Desenvolvemos sites completos com identidade visual e múltiplas páginas.",
    features: [
      "Múltiplas páginas (Home, Sobre, Serviços, Contato)",
      "Painel de administração simples",
      "Integração com Google Maps",
      "Blog opcional",
      "Manutenção inclusa por 30 dias",
    ],
    cta: "Criar meu Site Institucional",
    whatsappMessage: whatsappMessages.sitesInstitucionais,
  },
  {
    id: "catalogos-digitais",
    title: "Catálogos & Cardápios",
    subtitle: "Seus produtos sempre atualizados",
    icon: Smartphone,
    color: "from-hh-blue-300 to-hh-blue-700",
    description:
      "Chega de imprimir catálogos desatualizados! Desenvolvemos catálogos e cardápios digitais acessíveis via link ou QR Code, que você mesmo pode atualizar quando quiser, pelo celular.",
    features: [
      "Acesso por link ou QR Code",
      "Atualização em tempo real",
      "Fotos, preços e descrições",
      "Integração com WhatsApp para pedidos",
      "Funciona sem app instalado",
    ],
    cta: "Quero meu Catálogo Digital",
    whatsappMessage: whatsappMessages.catalogosDigitais,
  },
  {
    id: "integracoes",
    title: "Integrações",
    subtitle: "WhatsApp, Formulários e Google Maps",
    icon: MessageCircle,
    color: "from-hh-blue-200 to-hh-blue-600",
    description:
      "Conecte seu site com as ferramentas que seu cliente já usa. Botão de WhatsApp, formulários de contato, localização no Google Maps e muito mais para facilitar o contato e aumentar as conversões.",
    features: [
      "Botão de WhatsApp com mensagem automática",
      "Formulários de contato e orçamento",
      "Localização no Google Maps",
      "Integração com redes sociais",
      "Links para delivery (iFood, etc.)",
    ],
    cta: "Integrar meu negócio",
    whatsappMessage: whatsappMessages.integracoes,
  },
  {
    id: "seo-manutencao",
    title: "SEO & Manutenção",
    subtitle: "Apareça no Google e fique no ar",
    icon: Search,
    color: "from-hh-blue-600 to-hh-blue-900",
    description:
      "De nada adianta ter um site bonito que ninguém encontra. Aplicamos técnicas de SEO básico para que sua empresa apareça nas buscas do Google e oferecemos planos de manutenção para manter tudo funcionando.",
    features: [
      "Configuração de Google Analytics",
      "Google Search Console",
      "Otimização de velocidade",
      "Atualizações de conteúdo mensais",
      "Suporte técnico via WhatsApp",
    ],
    cta: "Melhorar meu posicionamento",
    whatsappMessage: whatsappMessages.seoManutencao,
  },
];
