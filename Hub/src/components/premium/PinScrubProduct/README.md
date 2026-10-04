# PinScrubProduct

Shell de pin + scrub para o lab Premium da HelpHub.

Stack: **GSAP ScrollTrigger** + **Lenis** (só na rota `/lab`) + filho **R3F** ou 2D.

O palco e a cena compartilham um `SceneHandle` (`proxy` + `progress`). O filho lê esses campos em `useFrame` / `rAF`. Não use `setState` no scrub.

## Storyboard (% do scroll pinado)

| Beat | Faixa | O que acontece |
|------|-------|----------------|
| **enter** | 0–24% | O núcleo entra (scale / rotY / posY / camZ) |
| **details** | 26–62% | Callouts + linhas; pausa de leitura; giro lento |
| **hero** | 62–100% | Callouts saem; escala de hero; tagline + badge |

A dica some depois de ~8%. A barra `%` espelha `ScrollTrigger.progress`.

## Onde editar

Copy, cor e objetos: `src/lib/animation-brief.ts`.  
A cena HelpHub (marca + órbita) está em `src/components/premium/HubCanvas.tsx`.

## Reduced motion

`prefers-reduced-motion: reduce` → estado hero estático, sem pin e sem pista de 320vh.
