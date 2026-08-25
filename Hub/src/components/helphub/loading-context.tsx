"use client";

import * as React from "react";

// ============================================================
// CONTEXTO DE CARREGAMENTO - LoadingContext
// ============================================================
// PT-BR: Este contexto é uma solução TEMPORÁRIA para controlar o estado
// de loading globalmente na aplicação.
//
// FEATURE FUTURA: Substituir por integração com eventos reais do Next.js:
//   - Router events (routeChangeStart / routeChangeComplete) do App Router
//   - React Suspense + useTransition para transições de rota
//   - Integração com bibliotecas de estado global (Zustand, Jotai)
//
// TODO: Quando o sistema de rotas real for integrado, remover o acionamento
//       manual via interceptação de cliques (LoadingLinkInterceptor).
// ============================================================

interface LoadingContextValue {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadingContext = React.createContext<LoadingContextValue | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = React.useState(false);

  const startLoading = React.useCallback(() => setIsLoading(true), []);
  const stopLoading = React.useCallback(() => setIsLoading(false), []);

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

// Hook para consumir o contexto de carregamento
export function useLoading() {
  const ctx = React.useContext(LoadingContext);
  if (!ctx) {
    throw new Error("useLoading deve ser usado dentro de <LoadingProvider>");
  }
  return ctx;
}
