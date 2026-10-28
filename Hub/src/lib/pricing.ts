export type PackageSlug = "plus" | "avancado" | "premium";

export type Package = {
  slug: PackageSlug;
  name: string;
  href: `/demonstracoes/${PackageSlug}`;
  positioning: string;
  priceCents: number;
  priceNote: string;
  recommended: boolean;
};

export const packages: readonly Package[] = [
  {
    slug: "plus",
    name: "Plus",
    href: "/demonstracoes/plus",
    positioning: "O equilíbrio para negócios locais e prestadores de serviço.",
    priceCents: 72490,
    priceNote: "pagamento único",
    recommended: false,
  },
  {
    slug: "avancado",
    name: "Avançado",
    href: "/demonstracoes/avancado",
    positioning: "Recomendado para uma página completa, com foco em conversão.",
    priceCents: 88277,
    priceNote: "pagamento único",
    recommended: true,
  },
  {
    slug: "premium",
    name: "Premium",
    href: "/demonstracoes/premium",
    positioning: "Conteúdo e recursos completos, com mais rodadas de revisão.",
    priceCents: 139910,
    priceNote: "pagamento único",
    recommended: false,
  },
];

export type InterestSlug = PackageSlug | "indefinido";

export const interestOptions: readonly { slug: InterestSlug; label: string }[] = [
  ...packages.map((pkg) => ({ slug: pkg.slug, label: pkg.name })),
  { slug: "indefinido", label: "Ainda não sei" },
];

export const formatBRL = (cents: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    cents / 100,
  );

export const includedMatrix: readonly {
  item: string;
  values: Record<PackageSlug, string>;
}[] = [
  { item: "Página única", values: { plus: "sim", avancado: "sim", premium: "sim" } },
  { item: "Design personalizado", values: { plus: "sim", avancado: "sim", premium: "sim" } },
  { item: "Responsivo", values: { plus: "sim", avancado: "sim", premium: "sim" } },
  { item: "Formulário de contato", values: { plus: "sim", avancado: "sim", premium: "sim" } },
  { item: "Botões de WhatsApp e redes", values: { plus: "sim", avancado: "sim", premium: "sim" } },
  { item: "Animações", values: { plus: "básicas", avancado: "avançadas", premium: "avançadas" } },
  { item: "Copywriting", values: { plus: "básico", avancado: "completo", premium: "completo" } },
  { item: "SEO básico", values: { plus: "sim", avancado: "sim", premium: "sim" } },
  { item: "Google Analytics", values: { plus: "sim", avancado: "sim", premium: "sim" } },
  { item: "Google Search Console", values: { plus: "não", avancado: "sim", premium: "sim" } },
  { item: "Otimização de velocidade", values: { plus: "básica", avancado: "completa", premium: "completa" } },
  { item: "Prova social", values: { plus: "sim", avancado: "sim", premium: "sim" } },
  { item: "FAQ estratégico", values: { plus: "sim", avancado: "sim", premium: "sim" } },
  { item: "Integrações", values: { plus: "básicas", avancado: "avançadas", premium: "avançadas" } },
  { item: "Rodadas de revisão", values: { plus: "2", avancado: "3", premium: "5" } },
  { item: "Copy + Conversão", values: { plus: "não", avancado: "sim", premium: "sim" } },
];
