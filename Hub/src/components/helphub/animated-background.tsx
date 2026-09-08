/**
 * PT-BR: Fundo animado da página principal.
 *
 * Camada única, fixa atrás de todo o conteúdo. Não usa JavaScript: todo o
 * movimento vem de `transform`/`opacity` em CSS (ver globals.css, seção
 * "FUNDO ANIMADO"), respeitando `prefers-reduced-motion`.
 *
 * As cores saem exclusivamente dos tokens do design system, então o tema
 * escuro funciona sem regra adicional aqui.
 */
export function AnimatedBackground() {
  return (
    <div aria-hidden className="hh-bg">
      <div className="hh-bg__grid" />
      <div className="hh-bg__blob hh-bg__blob--a" />
      <div className="hh-bg__blob hh-bg__blob--b" />
      <div className="hh-bg__blob hh-bg__blob--c" />
      <div className="hh-bg__glow" />
      <div className="hh-bg__noise" />
    </div>
  );
}
