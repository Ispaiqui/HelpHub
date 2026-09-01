"use client";

import * as React from "react";
import {
  Globe,
  Store,
  MessageCircle,
  FileText,
  Search,
  Wrench,
  Smartphone,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ServiceDialog } from "./service-dialog";

export type Product = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  description: string;
  features: string[];
  cta: string;
};

const products: Product[] = [
  {
    id: "landing-pages",
    title: "Landing Pages",
    subtitle: "Converta visitantes em clientes",
    icon: Globe,
    color: "from-blue-500 to-blue-700",
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
  },
  {
    id: "sites-institucionais",
    title: "Sites Institucionais",
    subtitle: "Sua empresa com presença profissional",
    icon: Store,
    color: "from-indigo-500 to-indigo-700",
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
  },
  {
    id: "catalogos-digitais",
    title: "Catálogos & Cardápios",
    subtitle: "Seus produtos sempre atualizados",
    icon: Smartphone,
    color: "from-sky-500 to-sky-700",
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
  },
  {
    id: "integracoes",
    title: "Integrações",
    subtitle: "WhatsApp, Formulários e Google Maps",
    icon: MessageCircle,
    color: "from-cyan-500 to-cyan-700",
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
  },
  {
    id: "seo-manutencao",
    title: "SEO & Manutenção",
    subtitle: "Apareça no Google e fique no ar",
    icon: Search,
    color: "from-blue-600 to-blue-900",
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
  },
];

export function Services() {
  const [selected, setSelected] = React.useState<Product | null>(null);
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section id="servicos" className="bg-slate-50 dark:bg-muted py-24 sm:py-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            O que vendemos
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Explore nossos produtos. Clique em qualquer card para conhecer os detalhes e o que está incluso.
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <Carousel
            setApi={setApi}
            opts={{ align: "center", loop: true }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 py-8">
              {products.map((product, index) => {
                const Icon = product.icon;
                const isSelected = index === current;

                return (
                  <CarouselItem
                    key={product.id}
                    className="pl-4 basis-11/12 sm:basis-1/2 lg:basis-1/3"
                  >
                    <button
                      onClick={() => {
                        api?.scrollTo(index);
                        setSelected(product);
                      }}
                      className={`group w-full h-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl transition-all duration-300 ${isSelected ? "scale-105 opacity-100 z-10 relative" : "scale-95 opacity-70"}`}
                    >
                      <div className="relative flex flex-col h-full min-h-[380px] overflow-hidden rounded-2xl bg-white dark:bg-card shadow-md ring-1 ring-slate-200 dark:ring-border hover:shadow-lg hover:ring-primary/30 transition-all duration-300">
                        {/* Gradient header */}
                        <div className={`h-32 bg-gradient-to-br ${product.color} flex items-center justify-center shrink-0`}>
                          <Icon className="h-14 w-14 text-white opacity-90" />
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                            {product.title}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground flex-1">{product.subtitle}</p>
                          <div className="mt-4 flex items-center text-sm font-medium text-primary">
                            Ver detalhes
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </button>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>

        <ServiceDialog selected={selected} onClose={() => setSelected(null)} />
      </div>
    </section>
  );
}

