import Image from "next/image";
import type { AnimationBriefObjeto } from "@/lib/animation-brief";

type HubFallbackProps = {
  objetos: AnimationBriefObjeto[];
};

/** Estado final estático — mesma metáfora do hub, sem WebGL e sem rAF. */
export function HubFallback({ objetos }: HubFallbackProps) {
  const nodes = objetos.filter((objeto) => objeto.id !== "hub");

  return (
    <div className="relative h-full w-full" aria-hidden>
      <div className="absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--lab-accent,#60a5fa)]/30 blur-3xl" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
        {nodes.map((node, index) => {
          const count = nodes.length || 1;
          const angle = (index / count) * Math.PI * 2 - Math.PI / 2;
          const x2 = 50 + Math.cos(angle) * 34;
          const y2 = 50 + Math.sin(angle) * 24;
          return (
            <g key={node.id}>
              <line
                x1="50"
                y1="50"
                x2={x2}
                y2={y2}
                stroke="var(--lab-accent, #60a5fa)"
                strokeOpacity="0.55"
                strokeWidth="0.35"
              />
              <circle cx={x2} cy={y2} r="1.35" fill="var(--lab-accent, #60a5fa)" />
            </g>
          );
        })}
        <circle
          cx="50"
          cy="50"
          r="16"
          fill="none"
          stroke="var(--lab-primary, #2563eb)"
          strokeOpacity="0.45"
          strokeWidth="0.28"
        />
      </svg>
      <Image
        src="/brand/helphub-mark.webp"
        alt=""
        width={112}
        height={112}
        unoptimized
        className="absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 object-contain sm:h-28 sm:w-28"
      />
    </div>
  );
}
