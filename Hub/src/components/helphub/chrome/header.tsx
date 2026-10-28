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
import { BrandLockup } from "@/components/helphub/brand";
import { cn } from "@/lib/utils";
import * as responsive from "@/lib/responsive";
import { INICIO_HREF, navLinks } from "@/lib/helphub/nav";
import { whatsappHref, whatsappMessages } from "@/lib/whatsapp";

const contatoHref = whatsappHref(whatsappMessages.headerContato);

const HOME_PATHS = new Set(["/", "/helphub"]);

function isHomePath(pathname: string) {
  return HOME_PATHS.has(pathname);
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const header = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
  const top = el.getBoundingClientRect().top + window.scrollY - header;
  window.scrollTo({ top, behavior: "instant" });
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
  const pillRef = React.useRef<HTMLSpanElement>(null);
  const pillReady = React.useRef(false);

  const placePill = (el: HTMLElement) => {
    const pill = pillRef.current;
    if (!pill) return;
    if (!pillReady.current) {
      pill.style.transition = "none";
      pill.style.width = `${el.offsetWidth}px`;
      pill.style.height = `${el.offsetHeight}px`;
      pill.style.transform = `translate3d(${el.offsetLeft}px, ${el.offsetTop}px, 0)`;
      pill.getBoundingClientRect();
      pill.style.transition = "";
      pillReady.current = true;
    } else {
      pill.style.width = `${el.offsetWidth}px`;
      pill.style.height = `${el.offsetHeight}px`;
      pill.style.transform = `translate3d(${el.offsetLeft}px, ${el.offsetTop}px, 0)`;
    }
    pill.style.opacity = "1";
  };

  const hidePill = () => {
    const pill = pillRef.current;
    if (!pill) return;
    pill.style.opacity = "0";
  };

  const goToInicio = () => {
    if (isHomePath(pathname)) {
      scrollToPageTop();
      return;
    }
    router.push(INICIO_HREF);
  };

  const goToHash = (href: string) => {
    const id = href.startsWith("/#") ? href.slice(2) : "";
    if (!id) return false;
    if (isHomePath(pathname)) {
      if (id === "topo") scrollToPageTop();
      else scrollToSection(id);
      return true;
    }
    sessionStorage.setItem("hh-scroll", id);
    router.push(href);
    return true;
  };

  React.useEffect(() => {
    if (!isHomePath(pathname)) return;
    const id = sessionStorage.getItem("hh-scroll") || window.location.hash.replace(/^#/, "");
    sessionStorage.removeItem("hh-scroll");
    if (!id || id === "topo") return;
    let frames = 0;
    let raf = 0;
    const run = () => {
      if (!document.getElementById(id) && frames++ < 40) {
        raf = requestAnimationFrame(run);
        return;
      }
      scrollToSection(id);
    };
    raf = requestAnimationFrame(run);
    const later = window.setTimeout(run, 100);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(later);
    };
  }, [pathname]);

  const handleNav = (href: string) => {
    setIsOpen(false);
    if (goToHash(href)) return;
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
      <div className={cn(responsive.container, responsive.headerHeight, "relative flex items-center justify-between")}>
        <BrandLockup priority symbol />

        {/* ≥md: desktop nav */}
        <nav
          className={cn(responsive.navDesktop, "absolute left-1/2 -translate-x-1/2 items-center gap-4")}
          onMouseLeave={hidePill}
          onBlur={(event) => {
            const next = event.relatedTarget;
            if (next instanceof Node && event.currentTarget.contains(next)) return;
            hidePill();
          }}
        >
          <span
            ref={pillRef}
            aria-hidden
            className="hh-charge pointer-events-none absolute top-0 left-0 rounded-full bg-primary/10 opacity-0"
          />
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              prefetch={false}
              onClick={(event) => {
                if (link.href === INICIO_HREF) {
                  handleInicioClick(event);
                  return;
                }
                if (link.href.startsWith("/#")) {
                  event.preventDefault();
                  goToHash(link.href);
                }
              }}
              onMouseEnter={(event) => placePill(event.currentTarget)}
              onFocus={(event) => placePill(event.currentTarget)}
              className="hh-charge relative z-10 px-2 py-1 text-sm font-medium text-muted-foreground hover:text-primary"
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
          <Button className="rounded-full" onClick={() => router.push("/formularios?origem=header")}>
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
                  <BrandLockup symbol onClick={() => setIsOpen(false)} />
                  <ThemeToggle />
                </div>
                <nav className="mt-2 flex flex-col divide-y divide-border/40">
                  {navLinks.map((link) => (
                    <button
                      key={link.name}
                      onClick={() => handleNav(link.href)}
                      className="hh-charge py-5 text-left text-lg font-medium text-foreground hover:text-primary"
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
                  <Button className="w-full justify-center" onClick={() => handleNav("/formularios?origem=header")}>
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
