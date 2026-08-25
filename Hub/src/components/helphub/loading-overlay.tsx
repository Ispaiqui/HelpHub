"use client";

import * as React from "react";

// ============================================================
// COMPONENTE DE TELA DE CARREGAMENTO - LoadingOverlay
// ============================================================
// PT-BR: Este componente é uma solução TEMPORÁRIA de carregamento.
// Atualmente, ele é acionado ao clicar em qualquer link da aplicação.
//
// FEATURE FUTURA: Substituir este comportamento genérico por um sistema
// de loading mais inteligente, que será acionado apenas durante:
//   - Chamadas de API reais (fetch, axios, etc.)
//   - Carregamento de páginas específicas que demandam dados pesados
//   - Transições de rota com dados assíncronos (ex: Next.js Server Components)
//
// TODO: Integrar com o sistema de roteamento do Next.js (usePathname +
//       useTransition ou NProgress) para um controle mais preciso.
// ============================================================

interface LoadingOverlayProps {
  isVisible: boolean;
}

export function LoadingOverlay({ isVisible }: LoadingOverlayProps) {
  const [shouldRender, setShouldRender] = React.useState(false);

  // Controla a montagem/desmontagem com fade para não cortar a animação de saída
  React.useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      // Aguarda a animação de saída (600ms) antes de desmontar o componente
      const timer = setTimeout(() => setShouldRender(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Carregando..."
      role="status"
      className={`loading-overlay ${isVisible ? "loading-overlay--visible" : "loading-overlay--hidden"}`}
    >
      {/* Container do ícone animado */}
      <div className="loading-icon-wrapper">
        {/* Anel giratório externo */}
        <div className="loading-ring loading-ring--outer" />
        {/* Anel giratório interno (direção oposta) */}
        <div className="loading-ring loading-ring--inner" />

        {/* Logo HH da HelpHub com animação de pulso */}
        <div className="loading-logo">
          <span className="loading-logo__letter loading-logo__letter--first">H</span>
          <span className="loading-logo__letter loading-logo__letter--second">H</span>
        </div>

        {/* Partículas decorativas ao redor do ícone */}
        <div className="loading-particles">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="loading-particle"
              style={{ "--particle-index": i } as React.CSSProperties}
            />
          ))}
        </div>
      </div>

      {/* Texto de carregamento com pontos animados */}
      <p className="loading-text">
        Carregando
        <span className="loading-dots">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </p>
    </div>
  );
}
