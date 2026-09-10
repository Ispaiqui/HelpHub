export const whatsappNumber = "5511999999999";

export const whatsappHref = (text?: string) => {
  const message = text ?? "Olá. Quero mais informações.";
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
};

export const business = {
  name: "Empresa",
  offer:
    "Atendimento e serviço para quem precisa de resposta rápida, horário combinado e garantia por escrito.",
  audience:
    "Pessoas e negócios que querem combinar um horário sem ficar cobrando retorno.",
  differentiators: [
    "Equipe preparada para o que se propõe a fazer",
    "Agendamento no mesmo dia, quando há vaga",
    "Garantia por escrito no serviço",
  ],
} as const;

export const testimonial = {
  quote:
    "Em 2 horas resolveram o que eu precisava e deixaram tudo organizado. Marquei pelo WhatsApp sem enrolação.",
  name: "Carla M.",
  role: "cliente",
  place: "Região Norte",
} as const;

export const testimonialShort = {
  quote: "Responderam no mesmo dia e cumpriram o horário combinado.",
  name: "Rafael S.",
  role: "cliente",
  place: "Centro",
} as const;

export const packages = [
  {
    slug: "essencial",
    href: "/demonstracoes/essencial",
    name: "Essencial",
    price: "R$ 649,70",
    positioning:
      "Página única e direta: hero, benefícios, prova, FAQ e WhatsApp.",
    density: "Limpo · 1–2 cinzas · fade CSS",
  },
  {
    slug: "plus",
    href: "/demonstracoes/plus",
    name: "Plus",
    price: "R$ 728,60",
    positioning:
      "O Essencial com passo a passo, regiões e oferta — confiança local.",
    density: "Layout local · CSS com stagger",
  },
  {
    slug: "avancado",
    href: "/demonstracoes/avancado",
    name: "Avançado",
    price: "R$ 842,30",
    positioning:
      "Arco de conversão completo: dor, solução, prova, oferta e microinterações.",
    density: "Copy cheia · framer-motion em todo o arco",
  },
  {
    slug: "premium",
    href: "/demonstracoes/premium",
    name: "Premium",
    price: "R$ 987,10",
    positioning:
      "O mesmo arco, com tipografia, assimetria e motion de um degrau acima.",
    density: "Craft editorial · parallax e motion",
  },
] as const;

export type PackageSlug = (typeof packages)[number]["slug"];

export type FaqItem = {
  q: string;
  a: string;
};

export const faqsEssencial: FaqItem[] = [
  {
    q: "Vocês atendem no mesmo dia?",
    a: "Sim, quando há vaga na agenda. Pelo WhatsApp confirmamos horário em poucos minutos — sem deixar você esperando retorno no dia seguinte.",
  },
  {
    q: "Tem garantia?",
    a: "Tem. O serviço sai com garantia por escrito. Prazo e cobertura ficam claros antes de começar.",
  },
  {
    q: "Como funciona o orçamento?",
    a: "Você descreve o que precisa no WhatsApp ou no formulário. Passamos o valor antes de qualquer trabalho extra. Nada segue sem o seu ok.",
  },
];

export const faqs: FaqItem[] = [
  ...faqsEssencial,
  {
    q: "Atendem pessoa física e empresa?",
    a: "Os dois. Casa, escritório e ponto comercial. Quem decide e quem recebe falam com o mesmo time.",
  },
  {
    q: "Preciso estar no local?",
    a: "Alguém precisa receber a equipe. Combinamos quem abre a porta na hora do agendamento.",
  },
];

export const faqsPremium: FaqItem[] = [
  ...faqs,
  {
    q: "Posso agendar para outra pessoa?",
    a: "Pode. Informe o nome de quem recebe, o endereço e um telefone de contato. Confirmamos os dois lados no WhatsApp.",
  },
  {
    q: "Vocês emitem nota?",
    a: "Sim, quando o serviço pede. Combinamos isso no agendamento, junto com o valor.",
  },
];

export const neighborhoods = [
  "Região Norte",
  "Centro",
  "Zona Leste",
  "Zona Oeste",
  "Zona Sul",
  "ABC",
  "Litoral",
  "Interior próximo",
] as const;

export const steps = [
  {
    n: "01",
    title: "Você chama",
    body: "WhatsApp ou formulário. Diz o que precisa e quando prefere ser atendido.",
  },
  {
    n: "02",
    title: "A gente confirma o horário",
    body: "Se houver vaga, encaixamos no mesmo dia. Você recebe o nome de quem vai e a janela de chegada.",
  },
  {
    n: "03",
    title: "A equipe resolve e registra",
    body: "Trabalho na frente de quem receber. Extra só com aprovação. Serviço com garantia por escrito.",
  },
] as const;

export const benefits = [
  {
    n: "01",
    title: "Equipe preparada",
    body: "Quem chega sabe o que pode e o que não pode improvisar. Sem enrolação no primeiro contato.",
  },
  {
    n: "02",
    title: "Mesmo dia, quando cabe",
    body: "Agenda aberta pelo WhatsApp. Sem formulário eterno e sem “retorno até sexta”.",
  },
  {
    n: "03",
    title: "Garantia no papel",
    body: "Você recebe o que foi feito e até quando vale a garantia. Sem letra miúda no Zap.",
  },
] as const;

export const proofPoints = [
  {
    title: "Preparação, não “experiência de anos”",
    body: "Quem entra no local sabe o que veio fazer. Não mandamos alguém despreparado no primeiro contato.",
  },
  {
    title: "Horário combinado, não “passamos aí”",
    body: "Janela de chegada no WhatsApp. Se atrasar, avisamos. Quem trabalha não pode ficar o dia inteiro esperando.",
  },
  {
    title: "Valor antes do extra",
    body: "Visita e serviço têm valor combinado. Qualquer acréscimo só entra depois do seu sim. A garantia sai por escrito.",
  },
] as const;

export const offerItems = [
  {
    title: "Visita e diagnóstico",
    body: "Avaliamos o que precisa ser feito. Valor da visita combinado no WhatsApp, antes de sair a equipe.",
  },
  {
    title: "Serviço principal",
    body: "O trabalho combinado, do começo ao fim, com o que ficou registrado no agendamento.",
  },
  {
    title: "Serviço extra",
    body: "Peça, troca ou etapa que só aparece no local. Só segue com a sua aprovação.",
  },
] as const;
