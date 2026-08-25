"use client";

// ============================================================
// PROVEDOR COMPLETO DE CARREGAMENTO - LoadingSystem
// ============================================================
// PT-BR: Este arquivo exporta o conjunto completo do sistema de loading:
//   - LoadingProvider: fornece o estado global de loading via context
//   - LoadingLinkInterceptor: intercepta cliques em links (solução temporária)
//   - LoadingOverlay: renderiza o visual da tela de carregamento
//
// FEATURE FUTURA: Este arquivo pode ser simplificado ou removido quando
// o sistema de loading for integrado com eventos reais de rota/API.
// ============================================================

import * as React from "react";

import { LoadingProvider, useLoading } from "./loading-context";
import { LoadingLinkInterceptor } from "./loading-link-interceptor";
import { LoadingOverlay } from "./loading-overlay";

// Componente interno que consome o contexto e renderiza o overlay
function LoadingSystemInner({ children }: { children: React.ReactNode }) {
  const { isLoading } = useLoading();
  return (
    <>
      <LoadingLinkInterceptor>{children}</LoadingLinkInterceptor>
      <LoadingOverlay isVisible={isLoading} />
    </>
  );
}

// Componente principal que encapsula o provider + sistema completo
export function LoadingSystem({ children }: { children: React.ReactNode }) {
  return (
    <LoadingProvider>
      <LoadingSystemInner>{children}</LoadingSystemInner>
    </LoadingProvider>
  );
}
