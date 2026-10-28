import Link from "next/link";
import { formatBRL, includedMatrix, packages } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import * as responsive from "@/lib/responsive";
import { whatsappHref } from "@/lib/whatsapp";

export function PackageMatrix() {
  return (
    <section className="mt-14" aria-labelledby="incluso-heading">
      <h2 id="incluso-heading" className={cn(responsive.sectionHeading, "text-foreground")}>
        O que está incluso
      </h2>

      <div className="mt-8 space-y-6 md:hidden">
        {packages.map((pkg) => (
          <article key={pkg.slug} className="border border-border bg-card p-6 text-card-foreground">
            <header>
              <h3 className="text-xl font-bold text-primary">{pkg.name}</h3>
              <p className="mt-1 text-2xl font-extrabold tracking-[-0.04em]">{formatBRL(pkg.priceCents)}</p>
              <p className="text-sm text-muted-foreground">{pkg.priceNote}</p>
            </header>
            <dl className="mt-4">
              {includedMatrix.map((row) => (
                <div key={row.item} className="grid grid-cols-2 gap-3 border-t border-border py-3">
                  <dt className="text-sm text-muted-foreground">{row.item}</dt>
                  <dd className="text-sm font-medium break-words text-foreground">{row.values[pkg.slug]}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>

      <div className="mt-8 hidden md:block">
        <table className="w-full table-fixed border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="min-w-[11rem] py-3 pr-4 font-medium text-muted-foreground">
                Item
              </th>
              {packages.map((pkg) => (
                <th key={pkg.slug} scope="col" className="px-3 py-3 align-bottom">
                  <span className="block text-base font-bold text-primary">{pkg.name}</span>
                  <span className="mt-1 block text-lg font-extrabold text-foreground">
                    {formatBRL(pkg.priceCents)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {includedMatrix.map((row) => (
              <tr key={row.item} className="border-b border-border">
                <th scope="row" className="min-w-[11rem] py-3 pr-4 font-medium text-foreground">
                  {row.item}
                </th>
                {packages.map((pkg) => (
                  <td key={pkg.slug} className="px-3 py-3 break-words text-muted-foreground">
                    {row.values[pkg.slug]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-8 flex flex-col gap-3 text-base sm:flex-row sm:items-center sm:gap-6">
        <Link
          href="/formularios?origem=demonstracoes-matriz"
          className="inline-flex min-h-11 items-center font-medium text-primary underline-offset-4 hover:underline"
        >
          Ficou com dúvida? Fale com a gente
        </Link>
        <a
          href={whatsappHref("Olá, HelpHub! Tenho uma dúvida sobre os pacotes.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center text-foreground underline-offset-4 hover:underline"
        >
          WhatsApp
        </a>
      </p>
    </section>
  );
}
