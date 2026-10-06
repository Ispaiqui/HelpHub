# Scripts

## `capture-about-steps.mjs`

Regrava o vídeo da seção de etapas (`AboutStep`) quando a animação em
`src/components/helphub/sections/about/about-step-animation.tsx` mudar.

A landing não roda mais esse carrossel: ela toca os arquivos em `public/about/`.
A rota `/capture/about-steps` existe só para o script avançar a timeline quadro
a quadro (fase, feixe, carga e deslize) e fotografar o DOM real.

```bash
pnpm dev
pnpm capture:about-steps
```

Flags: `--only=desktop|desktop-dark|mobile|mobile-dark`, `--sample` (poucos PNG,
sem encode), `--base=http://localhost:3000`.

Saída, em par claro/escuro e desktop/mobile (o mobile usa o card de 148px):

- `public/about/steps-desktop.mp4` + `.webm` + poster `.webp`
- `public/about/steps-desktop-dark.*`
- `public/about/steps-mobile.*`
- `public/about/steps-mobile-dark.*`

H.264 com `faststart` e WebM VP9, 30 fps, 2× o tamanho CSS do master. O componente
corta o centro do master conforme a largura da coluna, então um arquivo cobre
768, 1280 e 1440 sem esticar o card.
