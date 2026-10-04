"use client";

import { WhatsAppIcon } from "@/components/demonstracoes/whatsapp-icon";
import { whatsappHref } from "@/lib/demonstracoes/content";
import { cn } from "@/lib/utils";

type StickyWhatsAppProps = {
  variant: "bar" | "float";
};

export function StickyWhatsApp({ variant }: StickyWhatsAppProps) {
  if (variant === "bar") {
    return (
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 p-4 sm:hidden">
        <a
          href={whatsappHref()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center justify-center gap-2 bg-ink text-sm font-medium text-paper"
        >
          <WhatsAppIcon className="size-4" />
          WhatsApp
        </a>
      </div>
    );
  }

  return (
    <a
      href={whatsappHref()}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-full bg-ink text-paper shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition-transform duration-200 hover:scale-105",
      )}
      aria-label="WhatsApp"
    >
      <WhatsAppIcon className="size-6" />
    </a>
  );
}
