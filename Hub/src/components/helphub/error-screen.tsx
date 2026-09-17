"use client";

import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as responsive from "@/lib/responsive";

interface ErrorScreenProps {
  statusCode?: string | number;
  title: string;
  description: string;
  reset?: () => void;
  homeHref?: string;
  className?: string;
}

export function ErrorScreen({
  statusCode,
  title,
  description,
  reset,
  homeHref = "/",
  className,
}: ErrorScreenProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-[70vh] flex-col items-center justify-center overflow-x-clip py-6 md:py-12",
        className
      )}
    >
      <div className="pointer-events-none absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-destructive/5 blur-3xl" />

      <div className={cn("relative w-full", responsive.pageGutter)}>
      <div className="relative mx-auto w-full max-w-lg space-y-6 rounded-2xl border border-border/50 bg-card p-8 text-center shadow-2xl backdrop-blur-xl md:rounded-3xl md:p-12 dark:bg-card/50">
        {statusCode !== undefined && (
          <span
            aria-hidden
            className="pointer-events-none absolute -top-2 right-6 select-none text-8xl font-extrabold text-primary/10"
          >
            {statusCode}
          </span>
        )}

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 ring-1 ring-destructive/20">
          <AlertTriangle className="h-8 w-8 text-destructive" aria-hidden />
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            {title}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            {description}
          </p>
        </div>

        <div className={cn("justify-center gap-3", responsive.stackToRowSm)}>
          {reset && (
            <Button type="button" size="lg" className="w-full sm:w-auto rounded-full" onClick={reset}>
              <RefreshCw className="size-4" />
              Tentar novamente
            </Button>
          )}
          <Link
            href={homeHref}
            className={buttonVariants({
              variant: reset ? "outline" : "default",
              size: "lg",
              className: "w-full sm:w-auto rounded-full",
            })}
          >
            <Home className="size-4" />
            Voltar ao início
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}
