"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import * as responsive from "@/lib/responsive";
import { whatsappHref } from "@/lib/whatsapp";
import type { Product } from "@/lib/helphub/products";

interface ServiceDialogProps {
  selected: Product | null;
  onClose: () => void;
}

export function ServiceDialog({ selected, onClose }: ServiceDialogProps) {
  return (
    <Dialog open={!!selected} onOpenChange={(open) => !open && onClose()}>
      {selected && (
        <DialogContent
          overlayClassName="bg-black/55 supports-backdrop-filter:backdrop-blur-md"
          className={cn(
            "flex flex-col items-stretch gap-0 overflow-hidden rounded-3xl border-0 !p-0 shadow-2xl ring-1 ring-black/8",
            responsive.serviceDialogShell,
          )}
        >
          <div
            className={cn(
              "relative flex w-full shrink-0 items-center justify-center bg-gradient-to-br",
              "h-24 sm:h-28 md:h-32",
              selected.color,
            )}
          >
            <div
              className={cn(
                "flex items-center justify-center bg-white/20 shadow-lg ring-1 ring-white/40 backdrop-blur-md",
                "size-16 rounded-2xl sm:size-[4.5rem] sm:rounded-[1.25rem] md:size-20 md:rounded-[1.5rem]",
              )}
            >
              {React.createElement(selected.icon, {
                className: "size-8 text-white sm:size-9 md:size-10",
              })}
            </div>
          </div>

          <div className="flex w-full flex-col px-5 py-4 sm:px-6 sm:py-5 md:px-7 md:py-6">
            <DialogHeader className="space-y-1 pr-0 text-left sm:space-y-1.5">
              <DialogTitle className="text-[1.0625rem] font-semibold tracking-tight text-foreground sm:text-xl md:text-[1.375rem]">
                {selected.title}
              </DialogTitle>
              <DialogDescription className="text-[0.8125rem] leading-relaxed text-muted-foreground sm:text-sm md:text-[0.9375rem]">
                {selected.description}
              </DialogDescription>
            </DialogHeader>

            <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-2.5 md:mt-5">
              {selected.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="size-3 text-primary" strokeWidth={2.5} />
                  </span>
                  <span className="text-[0.8125rem] leading-snug text-foreground sm:text-sm">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <a
              href={whatsappHref(selected.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: "default" }),
                "mt-4 h-11 w-full shrink-0 rounded-xl text-center text-sm sm:mt-5 sm:h-12 md:mt-6 md:h-14 md:text-base",
              )}
              onClick={onClose}
            >
              {selected.cta}
            </a>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
