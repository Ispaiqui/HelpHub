"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLoading } from "./loading-context";

// ============================================================
// INTERCEPTADOR DE CLIQUES EM LINKS - LoadingLinkInterceptor
// ============================================================
// PT-BR: Este componente é uma solução TEMPORÁRIA e GAMBIARRA necessária
// para interceptar cliques em qualquer link (<a> ou <Link>) da página
// e acionar a tela de loading antes da navegação acontecer.
//
// PROBLEMA ATUAL: O Next.js App Router não expõe eventos de rota como
// routeChangeStart/Complete (disponíveis no Pages Router). Por isso,
// usamos interceptação de eventos de clique no DOM.
//
// FEATURE FUTURA: Quando o Next.js adicionar suporte nativo a eventos
// de rota no App Router, ou quando integrarmos com React useTransition +
// startTransition no nível de página, este componente DEVE SER REMOVIDO
// e substituído pela solução oficial.
//
// REFERÊNCIA: https://nextjs.org/docs/app/api-reference/functions/use-router
// ============================================================

export function LoadingLinkInterceptor({ children }: { children: React.ReactNode }) {
  const { startLoading, stopLoading } = useLoading();
  const pathname = usePathname();
  const loadingTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Para o loading quando a rota muda (pathname atualizado = página carregada)
  React.useEffect(() => {
    // Limpa qualquer timeout pendente
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    // Para o loading após mudança de rota
    stopLoading();
  }, [pathname, stopLoading]);

  React.useEffect(() => {
    // Intercepta todos os cliques em elementos <a> dentro do componente
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Sobe na árvore DOM para encontrar o elemento <a> mais próximo
      const anchor = target.closest("a");

      if (!anchor) return;

      const href = anchor.getAttribute("href");

      // PT-BR: Ignora links que não são de navegação interna
      // (externos, mailto, tel, âncoras de mesma página, etc.)
      if (
        !href ||
        href.startsWith("http") ||
        href.startsWith("mailto") ||
        href.startsWith("tel") ||
        href.startsWith("#") ||
        anchor.getAttribute("target") === "_blank" ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      ) {
        return;
      }

      // Aciona o loading ao clicar em link interno
      startLoading();

      // PT-BR: Fallback de segurança - garante que o loading seja desativado
      // mesmo se a mudança de pathname não for detectada (ex: mesma rota)
      loadingTimeoutRef.current = setTimeout(() => {
        stopLoading();
      }, 3000); // Timeout máximo de 3 segundos
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [startLoading, stopLoading]);

  return <>{children}</>;
}
