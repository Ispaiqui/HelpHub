/** Canonical responsive Tailwind class strings — use with cn() */

export const container =
  "container mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12";

export const sectionPy = "py-24 sm:py-32 xl:py-36";

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

export const carouselItemBasis = "basis-11/12 md:basis-1/2 lg:basis-1/3";

export const carouselNav = "hidden md:flex";

export const heroTitle =
  "text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl md:text-5xl xl:text-6xl";
