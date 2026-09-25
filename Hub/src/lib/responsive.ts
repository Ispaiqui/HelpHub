/** Canonical responsive Tailwind class strings — use with cn()
 *
 * Contrato de área:
 * - Seção Hub: fundo full-bleed. Conteúdo: gutter XOR container, nunca os dois.
 * - Header/footer: casco full-bleed, inner só `container`.
 * - Catálogo `/demonstracoes`: mesmos tokens Hub.
 * - LP: `lpMax5`/`lpMax6` + `lpPadX`. Vertical por density.
 */

export const container =
  "container mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12";

/** Faixa lateral (~8%) — só itens (texto, carousel, botões, animações), nunca o fundo da seção. */
export const pageGutter = "hh-page-content";

export const sectionPy = "py-24 sm:py-32 xl:py-36";

export const heroPy = "pt-20 pb-28 sm:pt-24 sm:pb-32";

export const headerHeight = "h-[var(--hh-header-height)]";

/** JetBrains Mono ocupa mais largura por caractere que uma sans proporcional:
 *  a escala abaixo já vem um degrau abaixo da equivalente em Inter. */
export const sectionHeading =
  "text-2xl font-bold tracking-[-0.03em] sm:text-3xl xl:text-4xl";

export const gridCols2 = "grid grid-cols-1 lg:grid-cols-2";

export const gridCols3 = "grid grid-cols-1 lg:grid-cols-3";

export const stackToRowLg = "flex flex-col lg:flex-row";

export const stackToRowSm = "flex flex-col sm:flex-row";

export const navDesktop = "hidden md:flex";

export const navMobile = "md:hidden";

/** Um slide no centro; vizinhos só espiam. Largura menor que o trilho cheio. */
export const carouselItemBasis = "basis-[70%] sm:basis-[44%] lg:basis-[34%]";

export const carouselNav = "flex";

/** Service dialog: centralizado. Largura por breakpoint, cabendo sem scroll. */
export const serviceDialogShell =
  "top-1/2 left-1/2 w-[calc(100%-1.5rem)] max-w-[20.5rem] -translate-x-1/2 -translate-y-1/2 sm:max-w-[24rem] md:max-w-[28rem] lg:max-w-[32rem]";

export const heroTitle =
  "text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl md:text-5xl xl:text-6xl";

export const lpMax5 = "mx-auto max-w-5xl";

export const lpMax6 = "mx-auto max-w-6xl";

export const lpPadX = "px-5 sm:px-8";

export const lpPyPlus = "py-16 sm:py-20";

export const lpPyAvancado = "py-20 sm:py-24";

export const lpPyPremium = "py-20 sm:py-28";
