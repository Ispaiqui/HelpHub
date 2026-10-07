"use client";

import type { CalloutItem } from "./types";

type CalloutOverlayProps = {
  callouts: CalloutItem[];
  /** Visível de início. O estado reduzido esconde os callouts à parte. */
  visible?: boolean;
};

/**
 * Callouts + linhas-guia. Opacidade / x / scaleX vêm do PinScrubStage
 * via [data-callout] / [data-line] / [data-dot]. Sem setState aqui.
 */
export function CalloutOverlay({ callouts, visible = false }: CalloutOverlayProps) {
  return (
    <>
      {callouts.map((c) => (
        <div
          key={c.id}
          data-callout
          data-side={c.side}
          className={`pointer-events-none absolute z-20 flex max-w-[calc(50%-var(--hh-page-gutter)-1.5rem)] items-center gap-1.5 xl:max-w-[42%] ${
            c.side === "left"
              ? "left-[var(--hh-page-gutter)] flex-row-reverse text-right xl:left-auto xl:right-[calc(50%+5.5rem)]"
              : "right-[var(--hh-page-gutter)] flex-row text-left xl:right-auto xl:left-[calc(50%+5.5rem)]"
          }`}
          style={{
            top: c.top,
            opacity: visible ? 1 : 0,
          }}
        >
          <span
            data-dot
            data-side={c.side}
            className="block h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--lab-accent,#60a5fa)] shadow-[0_0_10px_var(--lab-accent,#60a5fa)]"
          />
          <span
            data-line
            data-side={c.side}
            className="block h-px w-4 shrink-0 bg-[color:color-mix(in_srgb,var(--lab-ink,#f8fafc)_35%,transparent)] sm:w-12"
          />
          <div className="min-w-0 max-w-[7.5rem] sm:max-w-[11rem]">
            <p className="font-sans text-[8px] uppercase tracking-[0.2em] opacity-60 sm:text-[9px]">
              {c.label}
            </p>
            <p className="line-clamp-2 font-sans text-[13px] font-medium leading-tight sm:text-sm xl:line-clamp-none xl:truncate">
              {c.value}
            </p>
          </div>
        </div>
      ))}
    </>
  );
}
