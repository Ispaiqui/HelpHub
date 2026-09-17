import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { packages } from "@/lib/demonstracoes/content";
import { cn } from "@/lib/utils";
import * as responsive from "@/lib/responsive";

export const metadata: Metadata = {
  title: "Demonstrações",
  description:
    "Três pacotes de landing page (Plus, Avançado e Premium). Compare preço, itens e abra a demo do mesmo negócio fictício: Empresa.",
};

export default function DemonstracoesPage() {
  return (
    <div className="min-h-full bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
        <p className="text-sm font-bold tracking-[-0.03em] text-primary">
          Landing pages em pacotes
        </p>
        <h1 className={cn(responsive.heroTitle, "mt-4 max-w-3xl text-foreground")}>
          Três páginas.
          <br />
          Um único <span className="text-primary">negócio</span>.
          <br />
          <span className="text-primary">Três níveis</span> de entrega.
        </h1>
        <p className="mt-8 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg xl:leading-9">
          Abra cada rota e compare o que o cliente recebe. A empresa é a
          mesma. O que muda é o pacote: preço, itens e craft.
        </p>

        <ol className={cn(responsive.gridCols3, "mt-14 gap-6")}>
          {packages.map((pkg) => (
            <li
              key={pkg.slug}
              className={cn(
                "flex flex-col border bg-card p-6 text-card-foreground sm:p-8",
                pkg.recommended
                  ? "border-primary ring-1 ring-primary"
                  : "border-border",
              )}
            >
              {pkg.recommended ? (
                <p className="text-xs font-bold tracking-[-0.03em] text-primary">
                  Recomendado
                </p>
              ) : (
                <p className="text-xs font-bold tracking-[-0.03em] text-muted-foreground">
                  Pacote
                </p>
              )}
              <h2
                className={cn(
                  responsive.sectionHeading,
                  "mt-3 text-primary",
                )}
              >
                {pkg.name}
              </h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                {pkg.positioning}
              </p>
              <p className="mt-6 text-3xl font-extrabold tracking-[-0.04em] text-foreground">
                {pkg.price}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{pkg.priceNote}</p>
              <Link
                href={pkg.href}
                className={cn(buttonVariants(), "mt-8 w-full")}
              >                Ver demo
              </Link>
            </li>
          ))}
        </ol>

        <aside className="mt-14 grid gap-8 border border-border bg-card p-6 text-card-foreground sm:grid-cols-2 sm:p-8">
          <div>
            <p className="text-sm font-bold tracking-[-0.03em] text-primary">
              Negócio das demos
            </p>
            <p className={cn(responsive.sectionHeading, "mt-3 text-primary")}>
              Empresa
            </p>
            <p className="mt-2 text-base leading-8 text-muted-foreground">
              Atendimento e serviço para quem precisa de resposta rápida,
              horário combinado e garantia por escrito. Fictício, mas concreto
              — o tipo de oferta que se entende em cinco segundos.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold tracking-[-0.03em] text-primary">
              Como usar com o cliente
            </p>
            <p className="mt-3 text-base leading-8 text-muted-foreground">
              Envie o repositório ou o preview. Peça para abrir o celular e
              passar pelas três rotas. A conversa deixa de ser “o que vem
              no site” e vira “em qual faixa a gente entra”.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
