"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrandMark } from "@/components/helphub/brand-mark";
import { cn } from "@/lib/utils";
import * as responsive from "@/lib/responsive";
import { whatsappHref, whatsappMessages } from "@/lib/whatsapp";

const contatoHref = whatsappHref(whatsappMessages.headerContato);

const HOME_PATHS = new Set(["/", "/helphub"]);
const INICIO_HREF = "/#topo";

const navLinks = [
  { name: "Início", href: INICIO_HREF },
  { name: "O que é", href: "/#sobre" },
  { name: "Serviços", href: "/#servicos" },
  { name: "Demonstrações", href: "/demonstracoes" },
];

function isHomePath(pathname: string) {
  return HOME_PATHS.has(pathname);
}

function scrollToPageTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  const nextUrl = `${window.location.pathname}${window.location.search}#topo`;
  if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== nextUrl) {
    history.replaceState(null, "", nextUrl);
  }
}

export function Header() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const goToInicio = () => {
    if (isHomePath(pathname)) {
      scrollToPageTop();
      return;
    }
    router.push(INICIO_HREF);
  };

  const handleNav = (href: string) => {
    setIsOpen(false);
    if (href === INICIO_HREF) {
      goToInicio();
      return;
    }
    router.push(href);
  };

  const handleInicioClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isHomePath(pathname)) return;
    event.preventDefault();
    scrollToPageTop();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className={cn(responsive.container, "flex h-[69px] items-center justify-between relative")}>
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <BrandMark priority />
            <span className="font-bold text-xl text-foreground tracking-[-0.06em]">HelpHub</span>
          </Link>
        </div>

        {/* ≥md: desktop nav */}
        <nav className={cn(responsive.navDesktop, "items-center gap-8 absolute left-1/2 -translate-x-1/2")}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={link.href === INICIO_HREF ? handleInicioClick : undefined}
              className="text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-primary hover:scale-105"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className={cn(responsive.navDesktop, "items-center gap-4")}>
          <ThemeToggle />
          <a
            href={contatoHref}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}
          >
            Contato
          </a>
          <Button className="rounded-full" onClick={() => router.push("/#servicos")}>
            Começar agora
          </Button>
        </div>

        {/* <md: drawer */}
        <div className={responsive.navMobile}>
          <Button variant="ghost" size="icon" className={responsive.navMobile} onClick={() => setIsOpen(true)}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Abrir menu</span>
          </Button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-6">
              <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-border/40 pb-6 pr-10">
                  <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2"
                  >
                    <BrandMark />
                    <span className="font-bold text-xl text-foreground tracking-[-0.06em]">HelpHub</span>
                  </Link>
                  <ThemeToggle />
                </div>
                <nav className="mt-2 flex flex-col divide-y divide-border/40">
                  {navLinks.map((link) => (
                    <button
                      key={link.name}
                      onClick={() => handleNav(link.href)}
                      className="py-5 text-left text-lg font-medium text-foreground transition-all duration-200 hover:text-primary hover:-translate-y-0.5"
                    >
                      {link.name}
                    </button>
                  ))}
                </nav>
                <div className="mt-8 flex flex-col gap-5 border-t border-border/40 pt-6">
                  <a
                    href={contatoHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: "outline" }), "w-full justify-center")}
                    onClick={() => setIsOpen(false)}
                  >
                    Contato
                  </a>
                  <Button className="w-full justify-center" onClick={() => handleNav("/#servicos")}>
                    Começar agora
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
