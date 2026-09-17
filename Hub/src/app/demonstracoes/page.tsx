import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { packages } from "@/lib/demonstracoes/content";
import { cn } from "@/lib/utils";
import * as responsive from "@/lib/responsive";

export const metadata: Metadata = {
  title: "Demonstrações",
  description:
    "Quatro landing pages de demonstração (Essencial, Plus, Avançado e Premium) com o mesmo negócio fictício: Empresa.",
};

export default function DemonstracoesPage() {
  return (
    <div className="min-h-full bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
        <p className="text-sm font-bold tracking-[-0.03em] text-primary">
          Landing pages em pacotes
        </p>
        <h1 className={cn(responsive.heroTitle, "mt-4 max-w-3xl text-foreground")}>
          Quatro páginas.
          <br />
          Um único <span className="text-primary">negócio</span>.
          <br />
          <span className="text-primary">Quatro níveis</span> de entrega.
        </h1>
        <p className="mt-8 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg xl:leading-9">
          Abra cada rota e compare o que o cliente recebe. A empresa é a
          mesma. O que muda é densidade, copy e craft.
        </p>

        <ol className="mt-14 divide-y divide-border border-y border-border">
          {packages.map((pkg, index) => (
            <li key={pkg.slug}>
              <div className="grid gap-3 py-7 sm:grid-cols-[4rem_1fr_auto] sm:items-end sm:gap-8 sm:py-9">
                <span className="text-sm text-muted-foreground">
                  0{index + 1}
                </span>
                <Link
                  href={pkg.href}
                  className="group transition-colors duration-200"
                >
                  <h2
                    className={cn(
                      responsive.sectionHeading,
                      "text-primary transition-colors group-hover:text-primary-hover",
                    )}
                  >
                    {pkg.name}
                  </h2>
                  <p className="mt-2 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
                    {pkg.positioning}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {pkg.density}
                  </p>
                </Link>
                <Link href={pkg.href}>
                  <Button size="sm">Ver demo</Button>
                </Link>
              </div>
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
              passar pelas quatro rotas. A conversa deixa de ser “o que vem
              no site” e vira “em qual faixa a gente entra”.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
