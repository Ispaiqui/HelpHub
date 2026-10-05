/**
 * Brief da animação Premium — superfície única de ajuste no IDE.
 * A rota /lab/premium e o hero público leem este arquivo.
 *
 * Campos: cor · objetos · intuito · marca (+ copy dos callouts).
 * Hex alinhados aos tokens HelpHub (design system):
 *   primary  --hh-blue-600 / --primary
 *   accent   --hh-blue-400 (feixe e partícula do hub de luz)
 *   bg       --hh-slate-900 (faixa escura do diferencial)
 */

import type { CalloutItem } from "@/components/premium/PinScrubProduct/types";

export type AnimationBriefCor = {
  /** Azul de marca (luz principal, núcleo). */
  primary: string;
  /** Azul claro (feixes, badge, progresso). */
  accent: string;
  /** Fundo do capítulo. Escuro = texto claro; claro = texto escuro. */
  bg?: string;
};

export type AnimationBriefObjeto = {
  id: string;
  label: string;
  /**
   * Nota de craft. Não aparece na UI.
   * `id: "hub"` é o núcleo (marca). Os demais entram na órbita, na ordem do array.
   */
  notes?: string;
};

export type AnimationBriefMarca = {
  name: string;
  tone: string;
  tagline: string;
};

export type AnimationBriefCopy = {
  eyebrow?: string;
  title?: string;
  tagline?: string;
  badge?: string;
  hint?: string;
  callouts?: CalloutItem[];
};

export type AnimationBrief = {
  cor: AnimationBriefCor;
  objetos: AnimationBriefObjeto[];
  /** Uma frase: o que o capítulo de scroll comunica. */
  intuito: string;
  marca: AnimationBriefMarca;
  /** Textos do palco (PinScrubStage). */
  copy?: AnimationBriefCopy;
};

/** Brief HelpHub. Edite aqui e veja em /lab/premium. */
export const animationBrief: AnimationBrief = {
  cor: {
    primary: "#2563eb",
    accent: "#60a5fa",
    bg: "#0f172a",
  },
  objetos: [
    {
      id: "hub",
      label: "Núcleo HelpHub",
      notes: "Marca no centro. Proxy rotY / scale / posY / camZ no grupo.",
    },
    {
      id: "problema",
      label: "Problema",
      notes: "Satélite. Mesma etapa do carrossel da home.",
    },
    {
      id: "analise",
      label: "Análise",
      notes: "Satélite.",
    },
    {
      id: "solucao",
      label: "Solução",
      notes: "Satélite.",
    },
    {
      id: "implementacao",
      label: "Implementação",
      notes: "Satélite.",
    },
    {
      id: "suporte",
      label: "Suporte",
      notes: "Satélite.",
    },
  ],
  intuito:
    "Mostrar a HelpHub como núcleo que liga o caminho do cliente — problema, análise, solução, implementação e suporte — controlado pelo scroll.",
  marca: {
    name: "HelpHub",
    tone: "tecnologia, praticidade, confiança, proximidade",
    tagline: "Uma HUB para o seu negócio.",
  },
  copy: {
    eyebrow: "Lab Premium · src/lib/animation-brief.ts",
    title: "O hub sob o scroll",
    tagline: "Você cuida do negócio. A HelpHub cuida da tecnologia.",
    badge: "pin + scrub · lab",
    hint: "↓ role para avançar a timeline",
    callouts: [
      {
        id: "problema",
        label: "Problema",
        value: "Entendemos a dor",
        side: "left",
        top: "24%",
      },
      {
        id: "analise",
        label: "Análise",
        value: "Mapeamos o cenário",
        side: "right",
        top: "32%",
      },
      {
        id: "solucao",
        label: "Solução",
        value: "A tecnologia certa",
        side: "left",
        top: "56%",
      },
      {
        id: "suporte",
        label: "Suporte",
        value: "Acompanhamos você",
        side: "right",
        top: "64%",
      },
    ],
  },
};
