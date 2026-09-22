"use client";

import * as React from "react";

import { ErrorScreen } from "@/components/helphub/error";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="pt-br">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ErrorScreen
          title="Algo deu errado"
          description="Ocorreu um erro crítico na aplicação. Tente novamente ou volte para a página inicial."
          reset={reset}
          className="min-h-screen"
        />
      </body>
    </html>
  );
}
