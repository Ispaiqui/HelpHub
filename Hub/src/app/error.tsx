"use client";

import * as React from "react";

import { ErrorScreen } from "@/components/helphub/error";

export default function Error({
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
    <ErrorScreen
      title="Algo deu errado"
      description="Ocorreu um erro inesperado ao carregar esta página. Tente novamente ou volte para a página inicial."
      reset={reset}
    />
  );
}
