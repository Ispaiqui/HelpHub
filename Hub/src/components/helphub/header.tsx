"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { name: "Início", href: "/" },
  { name: "O que é", href: "/#sobre" },
  { name: "Visão", href: "/#visao" },
  { name: "Serviços", href: "/#servicos" },
];

export function Header() {
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();

  const handleNav = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-[69px] items-center justify-between px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="font-bold text-white text-2xl">H</span>
            </div>
            <span className="font-bold text-2xl text-foreground tracking-tight">HelpHub</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-primary hover:scale-105"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Button variant="outline" className="rounded-full" onClick={() => router.push("#contato")}>
            Contato
          </Button>
          <Button className="rounded-full" onClick={() => router.push("#servicos")}>
            Começar agora
          </Button>
        </div>

        {/* Mobile Navigation (Sidebar) */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(true)}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Abrir menu</span>
          </Button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
              <div className="flex flex-col gap-6 py-6 mt-6">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleNav(link.href)}
                    className="text-left text-lg font-medium text-foreground transition-all duration-200 hover:text-primary hover:-translate-y-0.5"
                  >
                    {link.name}
                  </button>
                ))}
                <div className="flex flex-col gap-3 mt-4 border-t pt-6">
                  <div className="flex justify-center mb-2">
                    <ThemeToggle />
                  </div>
                  <Button variant="outline" className="w-full justify-center" onClick={() => handleNav("#contato")}>
                    Contato
                  </Button>
                  <Button className="w-full justify-center" onClick={() => handleNav("#servicos")}>
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
