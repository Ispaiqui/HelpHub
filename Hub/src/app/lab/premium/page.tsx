import type { Metadata } from "next";
import { PremiumLabChapter } from "@/components/premium/PremiumLabChapter";

export const metadata: Metadata = {
  title: "Lab Premium — pin e scrub",
  description:
    "Laboratório interno da animação pin/scrub da HelpHub. Não faz parte da página pública.",
  robots: { index: false, follow: false },
};

export default function PremiumLabPage() {
  return <PremiumLabChapter />;
}
