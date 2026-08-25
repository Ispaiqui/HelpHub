"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Product } from "./services";

interface ServiceDialogProps {
  selected: Product | null;
  onClose: () => void;
}

export function ServiceDialog({ selected, onClose }: ServiceDialogProps) {
  return (
    <Dialog open={!!selected} onOpenChange={(open) => !open && onClose()}>
      {selected && (
        <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden rounded-2xl gap-0 border-0 shadow-2xl">
          {/* Header do Modal: idêntico ao do Card (h-32) */}
          <div className={`h-32 bg-gradient-to-br ${selected.color} flex items-center justify-center shrink-0`}>
            {React.createElement(selected.icon, { className: "h-14 w-14 text-white opacity-90" })}
          </div>
          
          <div className="p-6 flex flex-col">
            <DialogHeader className="text-left space-y-1">
              <DialogTitle className="text-2xl font-bold text-slate-900">{selected.title}</DialogTitle>
              <DialogDescription className="text-base text-slate-600">
                {selected.description}
              </DialogDescription>
            </DialogHeader>

            <ul className="mt-6 space-y-3">
              {selected.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <ArrowRight className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm text-slate-700">{feature}</span>
                </li>
              ))}
            </ul>

            <Button className="mt-8 w-full rounded-xl" size="lg" onClick={onClose}>
              {selected.cta}
            </Button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
