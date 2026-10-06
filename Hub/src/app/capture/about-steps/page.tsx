import type { Metadata } from "next";
import { CaptureClient } from "./capture-client";

export const metadata: Metadata = {
  title: "Captura das etapas",
  robots: { index: false, follow: false },
};

/** Harness headless para gravar o carrossel. Não entra na navegação. */
export default function AboutStepsCapturePage() {
  return <CaptureClient />;
}
